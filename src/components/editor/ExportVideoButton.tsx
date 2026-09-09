"use client";

import { useEffect, useRef, useState } from "react";
import { Video, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportVideoButtonProps {
  carouselId: string;
  slideCount: number;
}

interface VideoProgress {
  phase: "rendering" | "encoding" | "done";
  current: number;
  total: number;
}

export function ExportVideoButton({
  carouselId,
  slideCount,
}: ExportVideoButtonProps) {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState<VideoProgress | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ffmpegAvailable, setFfmpegAvailable] = useState(true);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // One probe on mount tells us whether to offer the button at all.
  useEffect(() => {
    fetch(`/api/carousels/${carouselId}/export-video/progress`)
      .then((r) => r.json())
      .then((d) => setFfmpegAvailable(Boolean(d.ffmpegAvailable)))
      .catch(() => {});
  }, [carouselId]);

  useEffect(() => {
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, []);

  const handleExport = async () => {
    if (exporting || slideCount === 0 || !ffmpegAvailable) return;
    setExporting(true);
    setDone(false);
    setError(null);
    setProgress({ phase: "rendering", current: 0, total: slideCount });

    // The POST holds open for the whole encode, so progress comes from a
    // separate poll against the in-memory job registry.
    pollTimer.current = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/carousels/${carouselId}/export-video/progress`
        );
        const data = await res.json();
        if (data.progress) setProgress(data.progress);
      } catch {
        // Transient — the next tick will retry.
      }
    }, 500);

    try {
      const response = await fetch(`/api/carousels/${carouselId}/export-video`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Video export failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `carousel-${carouselId}.mp4`;
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch (err) {
      console.error("Video export error:", err);
      setError(err instanceof Error ? err.message : "Video export failed");
    } finally {
      if (pollTimer.current) clearInterval(pollTimer.current);
      pollTimer.current = null;
      setExporting(false);
      setProgress(null);
      setTimeout(() => setDone(false), 3000);
    }
  };

  const label = () => {
    if (!progress) return "…";
    if (progress.phase === "rendering") {
      return `frames ${progress.current}/${progress.total}`;
    }
    const pct = progress.total
      ? Math.round((progress.current / progress.total) * 100)
      : 0;
    return `encoding ${pct}%`;
  };

  return (
    <div className="flex flex-col items-end">
      <Button
        onClick={handleExport}
        disabled={exporting || slideCount === 0 || !ffmpegAvailable}
        variant="accent"
        size="sm"
        title={
          ffmpegAvailable
            ? "Render slides to an MP4 for Reels"
            : "ffmpeg not found — install it (brew/apt/choco install ffmpeg) or set FFMPEG_PATH"
        }
      >
        <span
          key={exporting ? "exporting" : done ? "done" : "idle"}
          className="oc-enter-pop inline-flex items-center gap-2"
        >
          {exporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{label()}</span>
            </>
          ) : done ? (
            <>
              <Check className="h-4 w-4" />
              <span>Downloaded!</span>
            </>
          ) : (
            <>
              <Video className="h-4 w-4" />
              <span>Export MP4</span>
            </>
          )}
        </span>
      </Button>
      {error && (
        <span className="mt-1 max-w-[18rem] text-right text-[10px] text-destructive">
          {error}
        </span>
      )}
    </div>
  );
}
