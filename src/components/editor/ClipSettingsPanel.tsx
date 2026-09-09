"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Film } from "lucide-react";
import { planTimeline } from "@/lib/video-filtergraph";
import type { Slide } from "@/types/carousel";
import type { AnnotationPosition, NormalizedClip, Transition } from "@/types/video";
import {
  ANNOTATION_POSITIONS,
  FPS,
  MAX_ANNOTATION_CHARS,
  MAX_CLIP_MS,
  MAX_TRANSITION_MS,
  MIN_CLIP_MS,
  MAX_VIDEO_MS,
  MIN_VIDEO_MS,
  TRANSITIONS,
  normalizeClip,
} from "@/types/video";

interface ClipSettingsPanelProps {
  carouselId: string;
  slides: Slide[];
  activeIndex: number;
  onUpdated: () => void;
}

const SECONDS = (ms: number) => (ms / 1000).toFixed(1);

export function ClipSettingsPanel({
  carouselId,
  slides,
  activeIndex,
  onUpdated,
}: ClipSettingsPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const slide = slides[activeIndex];
  const [draft, setDraft] = useState<NormalizedClip>(() => normalizeClip(slide?.clip));
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reload the draft only when the selection moves. Keying off `slide.clip`
  // instead would reset mid-drag, because saving triggers a refetch that hands
  // back a new object every time.
  const [loadedSlideId, setLoadedSlideId] = useState(slide?.id);
  if (slide?.id !== loadedSlideId) {
    setLoadedSlideId(slide?.id);
    setDraft(normalizeClip(slide?.clip));
  }

  const persist = useCallback(
    (next: NormalizedClip) => {
      if (!slide) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        await fetch(`/api/carousels/${carouselId}/slides/${slide.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clip: next }),
        });
        onUpdated();
      }, 400);
    },
    [carouselId, slide, onUpdated]
  );

  const update = useCallback(
    (patch: Partial<NormalizedClip>) => {
      setDraft((prev) => {
        const next = normalizeClip({ ...prev, ...patch });
        persist(next);
        return next;
      });
    },
    [persist]
  );

  // Substitute the live draft so the readout tracks the slider, and run it
  // through the same planner ffmpeg will use so the number is frame-exact.
  const total = useMemo(() => {
    const clips = slides.map((s, i) =>
      i === activeIndex ? draft : normalizeClip(s.clip)
    );
    if (clips.length === 0) return { frames: 0, ms: 0 };
    const frames = planTimeline(clips).totalFrames;
    return { frames, ms: (frames / FPS) * 1000 };
  }, [slides, activeIndex, draft]);

  if (!slide) return null;

  const outOfRange = total.ms < MIN_VIDEO_MS || total.ms > MAX_VIDEO_MS;
  const annotation = draft.annotation;

  return (
    <div className="border-t border-border bg-surface">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <Film className="h-3 w-3" />
          Clip Timing
        </span>
        <span className="flex items-center gap-2">
          <span className={outOfRange ? "text-destructive" : "text-muted-foreground"}>
            total {SECONDS(total.ms)}s
          </span>
          {expanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronUp className="h-3 w-3" />
          )}
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-3 space-y-3">
          <div className="text-[10px] text-muted-foreground">
            Slide {activeIndex + 1} of {slides.length}
            {outOfRange && (
              <span className="text-destructive ml-2">
                Reels needs {MIN_VIDEO_MS / 1000}–{MAX_VIDEO_MS / 1000}s total
              </span>
            )}
          </div>

          <label className="block">
            <span className="text-[10px] font-medium text-muted-foreground">
              Duration — {SECONDS(draft.durationMs)}s
            </span>
            <input
              type="range"
              min={MIN_CLIP_MS}
              max={MAX_CLIP_MS}
              step={100}
              value={draft.durationMs}
              onChange={(e) => update({ durationMs: Number(e.target.value) })}
              className="w-full accent-accent"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] font-medium text-muted-foreground">
                Transition out
              </span>
              <select
                value={draft.transition}
                onChange={(e) =>
                  update({ transition: e.target.value as Transition })
                }
                className="w-full text-xs bg-muted rounded-md px-2 py-1.5 border border-border"
              >
                {TRANSITIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-[10px] font-medium text-muted-foreground">
                Transition — {SECONDS(draft.transitionMs)}s
              </span>
              <input
                type="range"
                min={0}
                max={MAX_TRANSITION_MS}
                step={50}
                disabled={draft.transition === "none"}
                value={draft.transitionMs}
                onChange={(e) => update({ transitionMs: Number(e.target.value) })}
                className="w-full accent-accent disabled:opacity-40"
              />
            </label>
          </div>

          <div className="space-y-2 border-t border-border pt-2">
            <label className="block">
              <span className="text-[10px] font-medium text-muted-foreground">
                On-screen text (optional)
              </span>
              <input
                type="text"
                maxLength={MAX_ANNOTATION_CHARS}
                placeholder="Text overlaid on this clip"
                value={annotation?.text ?? ""}
                onChange={(e) =>
                  update({
                    annotation: e.target.value.trim()
                      ? {
                          text: e.target.value,
                          position: annotation?.position ?? "bottom",
                          startMs: annotation?.startMs ?? 0,
                          endMs: annotation?.endMs ?? draft.durationMs,
                        }
                      : null,
                  })
                }
                className="w-full text-xs bg-muted rounded-md px-2 py-1.5 border border-border"
              />
            </label>

            {annotation && (
              <div className="grid grid-cols-3 gap-2">
                <label className="block">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    Position
                  </span>
                  <select
                    value={annotation.position}
                    onChange={(e) =>
                      update({
                        annotation: {
                          ...annotation,
                          position: e.target.value as AnnotationPosition,
                        },
                      })
                    }
                    className="w-full text-xs bg-muted rounded-md px-2 py-1.5 border border-border"
                  >
                    {ANNOTATION_POSITIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    In — {SECONDS(annotation.startMs)}s
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={draft.durationMs}
                    step={100}
                    value={annotation.startMs}
                    onChange={(e) =>
                      update({
                        annotation: {
                          ...annotation,
                          startMs: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-accent"
                  />
                </label>

                <label className="block">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    Out — {SECONDS(annotation.endMs)}s
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={draft.durationMs}
                    step={100}
                    value={annotation.endMs}
                    onChange={(e) =>
                      update({
                        annotation: {
                          ...annotation,
                          endMs: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-accent"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
