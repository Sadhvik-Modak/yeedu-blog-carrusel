/**
 * Pure ffmpeg argv/filter-graph construction. No filesystem, no spawning —
 * everything here is deterministic and unit-testable by inspection.
 *
 * All timing is computed in integer frames and only converted to seconds at
 * string-formatting time. Accumulating float milliseconds across a chained
 * xfade produces drift and a black tail frame.
 */

import type { ClipAnnotation, NormalizedClip } from "@/types/video";
import { FPS, framesToSeconds, msToFrames, transitionFrames, xfadeToken } from "@/types/video";

export interface TimedClip {
  durationFrames: number;
  /** Frames the transition INTO the next clip occupies. Unused on the last clip. */
  transitionFrames: number;
  xfade: string;
  annotation: ClipAnnotation | null;
}

export interface Timeline {
  clips: TimedClip[];
  /** offsets[k] is the xfade offset joining the chain so far to clip k (k >= 1). */
  offsets: number[];
  totalFrames: number;
}

/** Fixed-point seconds. ffmpeg parses these; exponent notation would not. */
function secs(frames: number): string {
  return framesToSeconds(frames).toFixed(6);
}

/**
 * Clamp a transition so it can never consume more footage than its two
 * neighbouring clips have to give.
 *
 * Capping at half of (shorter neighbour - 1) is a sufficient condition for the
 * real constraint — that a clip's head and tail transitions together leave at
 * least one frame — and unlike the sequential formulation it has no
 * order-dependence. MIN_CLIP_MS (15 frames) guarantees the cap is >= 1.
 */
function clampTransition(
  requestedFrames: number,
  durFrames: number,
  nextDurFrames: number
): number {
  const ceiling = Math.floor((Math.min(durFrames, nextDurFrames) - 1) / 2);
  return Math.max(1, Math.min(requestedFrames, Math.max(1, ceiling)));
}

/**
 * Resolve clips into a frame-exact timeline. Both the graph builder and the
 * editor's duration readout go through this, so what the UI shows is what
 * ffmpeg produces.
 */
export function planTimeline(clips: NormalizedClip[]): Timeline {
  const timed: TimedClip[] = clips.map((c) => ({
    durationFrames: msToFrames(c.durationMs),
    transitionFrames: transitionFrames(c),
    xfade: xfadeToken(c),
    annotation: c.annotation,
  }));

  for (let i = 0; i < timed.length - 1; i++) {
    timed[i].transitionFrames = clampTransition(
      timed[i].transitionFrames,
      timed[i].durationFrames,
      timed[i + 1].durationFrames
    );
  }

  // offset[k] = sum(d[0..k-1]) - sum(t[0..k-1])
  const offsets: number[] = [0];
  let cumDur = 0;
  let cumTrans = 0;
  for (let k = 1; k < timed.length; k++) {
    cumDur += timed[k - 1].durationFrames;
    cumTrans += timed[k - 1].transitionFrames;
    offsets[k] = cumDur - cumTrans;
  }

  const totalFrames =
    timed.reduce((acc, c) => acc + c.durationFrames, 0) -
    timed.slice(0, -1).reduce((acc, c) => acc + c.transitionFrames, 0);

  return { clips: timed, offsets, totalFrames };
}

function annotationFilter(
  inputIndex: number,
  clipIndex: number,
  annotation: ClipAnnotation
): string {
  const startSec = annotation.startMs / 1000;
  const endSec = annotation.endMs / 1000;
  // Keep the in/out ramps from overlapping on very short annotations.
  const fadeDur = Math.min(0.3, (endSec - startSec) / 2);
  const outStart = endSec - fadeDur;

  return (
    `[${inputIndex}:v]format=rgba,fps=${FPS},settb=AVTB,` +
    `fade=t=in:st=${startSec.toFixed(6)}:d=${fadeDur.toFixed(6)}:alpha=1,` +
    `fade=t=out:st=${outStart.toFixed(6)}:d=${fadeDur.toFixed(6)}:alpha=1[a${clipIndex}]`
  );
}

export interface BuildVideoArgsParams {
  clips: NormalizedClip[];
  dims: { width: number; height: number };
  /** Absolute path to each clip's rendered PNG, parallel to `clips`. */
  clipPaths: string[];
  /** Absolute path to each clip's annotation overlay PNG, or null. Parallel to `clips`. */
  annotationPaths: (string | null)[];
  graphPath: string;
  outPath: string;
}

export interface BuiltVideoArgs {
  args: string[];
  filterScript: string;
  totalFrames: number;
}

/**
 * Build the complete ffmpeg invocation.
 *
 * No user-authored string reaches the argv or the graph: durations are numbers,
 * transition names come from a fixed allowlist, and annotation text lives in a
 * PNG rendered by Puppeteer rather than in a drawtext filter.
 */
export function buildVideoArgs(params: BuildVideoArgsParams): BuiltVideoArgs {
  const { clips, dims, clipPaths, annotationPaths, graphPath, outPath } = params;

  if (clips.length === 0) throw new Error("Cannot build a video with no clips");
  if (clipPaths.length !== clips.length || annotationPaths.length !== clips.length) {
    throw new Error("clipPaths/annotationPaths must be parallel to clips");
  }

  // ffmpeg has no `--` end-of-options separator; a path starting with `-`
  // would be parsed as a flag. Generated paths are UUID-based so this is an
  // assertion, not a sanitizer.
  for (const p of [...clipPaths, ...annotationPaths, graphPath, outPath]) {
    if (p !== null && p.startsWith("-")) {
      throw new Error(`Refusing to pass a path that looks like a flag: ${p}`);
    }
  }

  const timeline = planTimeline(clips);
  const { width, height } = dims;

  const inputArgs: string[] = [];
  const graphLines: string[] = [];

  // Clip stills occupy input indices 0..N-1.
  timeline.clips.forEach((clip, i) => {
    inputArgs.push(
      "-loop", "1",
      "-framerate", String(FPS),
      "-t", secs(clip.durationFrames),
      "-i", clipPaths[i]
    );
  });

  // Annotation overlays follow, each spanning its clip's full duration.
  const annotationInputIndex = new Map<number, number>();
  let nextInput = timeline.clips.length;
  timeline.clips.forEach((clip, i) => {
    const path = annotationPaths[i];
    if (!clip.annotation || !path) return;
    inputArgs.push(
      "-loop", "1",
      "-framerate", String(FPS),
      "-t", secs(clip.durationFrames),
      "-i", path
    );
    annotationInputIndex.set(i, nextInput++);
  });

  // Normalize every input. `settb=AVTB` is what prevents xfade's timebase
  // mismatch error; `setsar=1` prevents the SAR mismatch.
  timeline.clips.forEach((_, i) => {
    graphLines.push(
      `[${i}:v]fps=${FPS},scale=${width}:${height}:flags=lanczos,` +
        `setsar=1,format=yuv420p,settb=AVTB[b${i}]`
    );
  });

  // Composite annotations per-clip, BEFORE xfade, so annotation timings stay
  // clip-local instead of global-timeline. overlay pairs frames by PTS, so the
  // alpha ramp alone gates visibility.
  timeline.clips.forEach((clip, i) => {
    const annIdx = annotationInputIndex.get(i);
    if (clip.annotation && annIdx !== undefined) {
      graphLines.push(annotationFilter(annIdx, i, clip.annotation));
      graphLines.push(
        `[b${i}][a${i}]overlay=0:0:format=auto,format=yuv420p[v${i}]`
      );
    } else {
      graphLines.push(`[b${i}]null[v${i}]`);
    }
  });

  // Chain the cross-fades.
  let lastLabel = "v0";
  for (let k = 1; k < timeline.clips.length; k++) {
    const prev = timeline.clips[k - 1];
    const label = `x${k}`;
    graphLines.push(
      `[${lastLabel}][v${k}]xfade=transition=${prev.xfade}:` +
        `duration=${secs(prev.transitionFrames)}:` +
        `offset=${secs(timeline.offsets[k])}[${label}]`
    );
    lastLabel = label;
  }

  const outputArgs = [
    "-map", `[${lastLabel}]`,
    "-an",
    // Pin the exact length; belt-and-braces against a trailing black frame.
    "-frames:v", String(timeline.totalFrames),
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "20",
    // Correct for the flat graphic content these slides produce.
    "-tune", "stillimage",
    "-pix_fmt", "yuv420p",
    "-r", String(FPS),
    "-g", String(FPS * 2),
    "-profile:v", "high",
    "-level", "4.0",
    // `-vsync cfr` not `-fps_mode`; the latter is ffmpeg 5.0+.
    "-vsync", "cfr",
    "-movflags", "+faststart",
    outPath,
  ];

  const args = [
    "-nostdin",
    "-y",
    "-loglevel", "error",
    "-progress", "pipe:1",
    "-nostats",
    ...inputArgs,
    "-filter_complex_script", graphPath,
    ...outputArgs,
  ];

  return {
    args,
    filterScript: graphLines.join(";\n") + "\n",
    totalFrames: timeline.totalFrames,
  };
}
