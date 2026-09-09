import type { AspectRatio } from "@/types/carousel";
import { DIMENSIONS } from "@/types/carousel";
import type { ClipAnnotation } from "@/types/video";

/**
 * This module is the single point where user-authored annotation text becomes
 * markup. Text is escaped here and rendered by Puppeteer — it never reaches
 * ffmpeg, which is why the pipeline can avoid `drawtext` and its layered
 * `: ' \ %` escaping rules entirely.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Vertical placement, kept clear of the Reels/Stories chrome at both edges. */
function placement(position: ClipAnnotation["position"]): string {
  switch (position) {
    case "top":
      return "top: 12%; bottom: auto; transform: none;";
    case "center":
      return "top: 50%; bottom: auto; transform: translateY(-50%);";
    case "bottom":
    default:
      return "top: auto; bottom: 16%; transform: none;";
  }
}

/**
 * Build body-level HTML for a transparent annotation overlay.
 * Render it with `renderHtmlToPng(..., { omitBackground: true, postProcess: false })`.
 */
export function buildAnnotationHtml(
  annotation: ClipAnnotation,
  aspectRatio: AspectRatio
): string {
  const { width } = DIMENSIONS[aspectRatio];
  const fontSize = Math.round(width * 0.058);
  const padV = Math.round(width * 0.022);
  const padH = Math.round(width * 0.034);
  const radius = Math.round(width * 0.018);

  const safe = escapeHtml(annotation.text).replace(/\r?\n/g, "<br>");

  return `<div style="position: absolute; left: 0; right: 0; ${placement(
    annotation.position
  )} display: flex; justify-content: center; padding: 0 6%;">
  <span style="
    font-family: 'Inter', system-ui, sans-serif;
    font-weight: 700;
    font-size: ${fontSize}px;
    line-height: 1.25;
    color: #ffffff;
    text-align: center;
    background: rgba(0, 0, 0, 0.62);
    padding: ${padV}px ${padH}px;
    border-radius: ${radius}px;
    text-wrap: balance;
  ">${safe}</span>
</div>`;
}
