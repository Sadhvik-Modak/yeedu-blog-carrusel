import { spawn } from "child_process";
import { mkdtemp, mkdir, readdir, readFile, rm, stat, writeFile } from "fs/promises";
import os from "os";
import path from "path";

import { getFfmpegPath } from "./ffmpeg-path";
import { buildAnnotationHtml } from "./annotation-html";
import { renderHtmlToPng } from "./export-slides";
import { buildVideoArgs, planTimeline } from "./video-filtergraph";
import type { Carousel } from "@/types/carousel";
import { DIMENSIONS } from "@/types/carousel";
import type { NormalizedClip } from "@/types/video";
import { FPS, MAX_VIDEO_MS, MIN_VIDEO_MS, normalizeClip } from "@/types/video";

const JOB_ROOT = path.join(os.tmpdir(), "open-carrusel-video");
const STALE_JOB_MS = 60 * 60 * 1000;
const FFMPEG_TIMEOUT_MS = 180_000;
const STDERR_CAP_BYTES = 64 * 1024;

export class VideoExportError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "VideoExportError";
  }
}

export interface VideoProgress {
  phase: "rendering" | "encoding" | "done";
  current: number;
  total: number;
}

const progressByCarousel = new Map<string, VideoProgress>();

export function getVideoProgress(carouselId: string): VideoProgress | null {
  return progressByCarousel.get(carouselId) ?? null;
}

// Puppeteer at 1080p plus an x264 encode saturates a typical laptop; running
// two renders concurrently tends to time out both rather than finishing either.
let renderInFlight = false;

export function isVideoRenderInFlight(): boolean {
  return renderInFlight;
}

/** Clear job dirs orphaned by a hard kill (SIGKILL skips the finally block). */
async function sweepStaleJobs(): Promise<void> {
  try {
    const entries = await readdir(JOB_ROOT);
    const cutoff = Date.now() - STALE_JOB_MS;
    await Promise.all(
      entries.map(async (entry) => {
        const dir = path.join(JOB_ROOT, entry);
        try {
          const info = await stat(dir);
          if (info.mtimeMs < cutoff) {
            await rm(dir, { recursive: true, force: true });
          }
        } catch {
          // Raced with another sweep — fine.
        }
      })
    );
  } catch {
    // JOB_ROOT does not exist yet.
  }
}

function runFfmpeg(
  args: string[],
  totalFrames: number,
  onFrame: (frame: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    // argv array with shell:false — no user-authored string reaches a shell,
    // and transition names were allowlisted upstream.
    const child = spawn(getFfmpegPath(), args, {
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
      timeout: FFMPEG_TIMEOUT_MS,
    });

    let stdoutBuf = "";
    child.stdout.on("data", (chunk: Buffer) => {
      stdoutBuf += chunk.toString();
      const lines = stdoutBuf.split("\n");
      stdoutBuf = lines.pop() ?? "";
      for (const line of lines) {
        const match = /^frame=(\d+)/.exec(line.trim());
        if (match) onFrame(Math.min(Number(match[1]), totalFrames));
      }
    });

    // Ring-buffered so a runaway encode cannot balloon memory.
    let stderr = "";
    child.stderr.on("data", (chunk: Buffer) => {
      stderr = (stderr + chunk.toString()).slice(-STDERR_CAP_BYTES);
    });

    child.on("error", (err) => {
      reject(new VideoExportError(`Failed to run ffmpeg: ${err.message}`, 500));
    });

    child.on("close", (code, signal) => {
      if (code === 0) return resolve();
      const detail = stderr.trim().split("\n").slice(-6).join("\n");
      reject(
        new VideoExportError(
          signal === "SIGTERM"
            ? "ffmpeg timed out while encoding"
            : `ffmpeg exited with code ${code}${detail ? `:\n${detail}` : ""}`,
          500
        )
      );
    });
  });
}

/**
 * Render a carousel to an MP4 buffer.
 *
 * The whole lifecycle — frames, filter graph, encode, read-back, cleanup — is
 * contained in this call so the temp dir can be removed in a finally block
 * before the response is returned.
 */
export async function exportCarouselVideo(carousel: Carousel): Promise<Buffer> {
  try {
    // Resolve up front so a missing (or mis-configured) ffmpeg is a clean 503
    // rather than a spawn failure after a minute of Puppeteer rendering.
    getFfmpegPath();
  } catch (error) {
    throw new VideoExportError(
      error instanceof Error ? error.message : "ffmpeg not found",
      503
    );
  }
  if (carousel.slides.length === 0) {
    throw new VideoExportError("No slides to export", 400);
  }
  if (renderInFlight) {
    throw new VideoExportError(
      "Another video export is already running. Try again when it finishes.",
      429
    );
  }

  renderInFlight = true;
  progressByCarousel.set(carousel.id, {
    phase: "rendering",
    current: 0,
    total: carousel.slides.length,
  });

  await sweepStaleJobs();
  await mkdir(JOB_ROOT, { recursive: true });
  const jobDir = await mkdtemp(path.join(JOB_ROOT, "job-"));

  try {
    const slides = [...carousel.slides].sort((a, b) => a.order - b.order);
    const clips: NormalizedClip[] = slides.map((s) => normalizeClip(s.clip));
    const timeline = planTimeline(clips);
    const totalMs = (timeline.totalFrames / FPS) * 1000;

    if (totalMs < MIN_VIDEO_MS) {
      throw new VideoExportError(
        `Video is ${(totalMs / 1000).toFixed(1)}s — Instagram Reels needs at least ${MIN_VIDEO_MS / 1000}s. Increase clip durations.`,
        400
      );
    }
    if (totalMs > MAX_VIDEO_MS) {
      throw new VideoExportError(
        `Video is ${(totalMs / 1000).toFixed(1)}s — Instagram Reels allows at most ${MAX_VIDEO_MS / 1000}s. Shorten clip durations or remove slides.`,
        400
      );
    }

    // Slide frames at 1x — video output is native 1080-wide, so the 4x used for
    // PNG export would only cost time and memory.
    const clipPaths: string[] = [];
    for (let i = 0; i < slides.length; i++) {
      const buffer = await renderHtmlToPng(slides[i].html, carousel.aspectRatio, {
        scale: 1,
      });
      const filePath = path.join(jobDir, `clip-${String(i).padStart(3, "0")}.png`);
      await writeFile(filePath, buffer);
      clipPaths.push(filePath);
      progressByCarousel.set(carousel.id, {
        phase: "rendering",
        current: i + 1,
        total: slides.length,
      });
    }

    // Annotation overlays: transparent, and never Sharp-processed so nothing
    // risks flattening the alpha channel the overlay depends on.
    const annotationPaths: (string | null)[] = [];
    for (let i = 0; i < clips.length; i++) {
      const annotation = clips[i].annotation;
      if (!annotation) {
        annotationPaths.push(null);
        continue;
      }
      const buffer = await renderHtmlToPng(
        buildAnnotationHtml(annotation, carousel.aspectRatio),
        carousel.aspectRatio,
        { scale: 1, omitBackground: true, postProcess: false }
      );
      const filePath = path.join(jobDir, `ann-${String(i).padStart(3, "0")}.png`);
      await writeFile(filePath, buffer);
      annotationPaths.push(filePath);
    }

    const graphPath = path.join(jobDir, "graph.txt");
    const outPath = path.join(jobDir, "out.mp4");
    const built = buildVideoArgs({
      clips,
      dims: DIMENSIONS[carousel.aspectRatio],
      clipPaths,
      annotationPaths,
      graphPath,
      outPath,
    });

    // The graph goes to a file rather than argv: it stays readable for
    // debugging and sidesteps the Windows command-line length limit at 20 clips.
    await writeFile(graphPath, built.filterScript, "utf-8");

    progressByCarousel.set(carousel.id, {
      phase: "encoding",
      current: 0,
      total: built.totalFrames,
    });

    await runFfmpeg(built.args, built.totalFrames, (frame) => {
      progressByCarousel.set(carousel.id, {
        phase: "encoding",
        current: frame,
        total: built.totalFrames,
      });
    });

    const mp4 = await readFile(outPath);
    progressByCarousel.set(carousel.id, {
      phase: "done",
      current: built.totalFrames,
      total: built.totalFrames,
    });
    return mp4;
  } finally {
    renderInFlight = false;
    await rm(jobDir, { recursive: true, force: true }).catch(() => {});
    setTimeout(() => progressByCarousel.delete(carousel.id), 10_000).unref?.();
  }
}
