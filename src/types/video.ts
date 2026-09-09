/**
 * Clip/video types for MP4 export.
 *
 * All timing math downstream runs in integer frames, never float milliseconds —
 * accumulated float drift across chained xfade offsets produces a black tail frame.
 */

export const FPS = 30;

export const MIN_CLIP_MS = 500; // 15 frames — xfade needs headroom on both sides
export const MAX_CLIP_MS = 15_000;
export const MIN_TRANSITION_MS = 0;
export const MAX_TRANSITION_MS = 2_000;

/** Instagram Reels accepts 3s–90s. */
export const MIN_VIDEO_MS = 3_000;
export const MAX_VIDEO_MS = 90_000;

/**
 * User-selectable transitions. Every entry except "none" is a literal xfade
 * token and is interpolated into the filter graph, so this array IS the
 * security allowlist — validate against it, never sanitize a free-form string.
 *
 * Restricted to transitions that exist in ffmpeg 4.3+; `zoomin`, `hlwind` and
 * `fadegrays` are 5.x-only and would fail on the 4.4 baseline.
 */
export const TRANSITIONS = [
  "none",
  "fade",
  "fadeblack",
  "dissolve",
  "wipeleft",
  "slideleft",
  "circleopen",
] as const;

export type Transition = (typeof TRANSITIONS)[number];

/** Reserved for a future Ken Burns pass; cut from v1 due to zoompan pixel-snap jitter. */
export const MOTIONS = ["none"] as const;
export type Motion = (typeof MOTIONS)[number];

export const ANNOTATION_POSITIONS = ["top", "center", "bottom"] as const;
export type AnnotationPosition = (typeof ANNOTATION_POSITIONS)[number];

export const MAX_ANNOTATION_CHARS = 200;

export interface ClipAnnotation {
  text: string;
  position: AnnotationPosition;
  startMs: number;
  endMs: number;
}

export interface ClipSettings {
  durationMs: number;
  transition: Transition;
  transitionMs: number;
  motion: Motion;
  annotation?: ClipAnnotation | null;
}

export type NormalizedClip = Required<Omit<ClipSettings, "annotation">> & {
  annotation: ClipAnnotation | null;
};

export const DEFAULT_CLIP: NormalizedClip = {
  durationMs: 3_000,
  transition: "fade",
  transitionMs: 400,
  motion: "none",
  annotation: null,
};

export function msToFrames(ms: number): number {
  return Math.round((ms / 1000) * FPS);
}

export function framesToSeconds(frames: number): number {
  return frames / FPS;
}

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function normalizeAnnotation(
  raw: unknown,
  clipDurationMs: number
): ClipAnnotation | null {
  if (!raw || typeof raw !== "object") return null;
  const a = raw as Record<string, unknown>;

  if (typeof a.text !== "string" || a.text.trim() === "") return null;
  const text = a.text.slice(0, MAX_ANNOTATION_CHARS);

  const position = ANNOTATION_POSITIONS.includes(a.position as AnnotationPosition)
    ? (a.position as AnnotationPosition)
    : "bottom";

  const startMs = clampNumber(a.startMs, 0, clipDurationMs, 0);
  // An annotation must end after it starts, and cannot outlive its clip.
  const endMs = clampNumber(a.endMs, startMs, clipDurationMs, clipDurationMs);
  if (endMs <= startMs) return null;

  return { text, position, startMs, endMs };
}

/**
 * Fill defaults and clamp every field into a safe range. Call this at read time
 * on anything loaded from JSON or arriving over the wire — downstream graph
 * building assumes normalized input.
 */
export function normalizeClip(clip?: ClipSettings | null): NormalizedClip {
  if (!clip || typeof clip !== "object") return { ...DEFAULT_CLIP };

  const durationMs = clampNumber(
    clip.durationMs,
    MIN_CLIP_MS,
    MAX_CLIP_MS,
    DEFAULT_CLIP.durationMs
  );

  const transition = TRANSITIONS.includes(clip.transition)
    ? clip.transition
    : DEFAULT_CLIP.transition;

  const transitionMs = clampNumber(
    clip.transitionMs,
    MIN_TRANSITION_MS,
    MAX_TRANSITION_MS,
    DEFAULT_CLIP.transitionMs
  );

  return {
    durationMs,
    transition,
    transitionMs,
    motion: "none",
    annotation: normalizeAnnotation(clip.annotation, durationMs),
  };
}

/**
 * Frames a transition occupies. "none" still emits a 1-frame xfade rather than
 * branching to the concat filter — visually a hard cut, but it keeps a single
 * code path and a single offset formula.
 */
export function transitionFrames(clip: NormalizedClip): number {
  if (clip.transition === "none") return 1;
  return Math.max(1, msToFrames(clip.transitionMs));
}

/** The xfade token to emit. "none" degenerates to a 1-frame fade. */
export function xfadeToken(clip: NormalizedClip): string {
  return clip.transition === "none" ? "fade" : clip.transition;
}
