import puppeteer, { type Browser } from "puppeteer";
import { Mutex } from "async-mutex";
import { readFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { wrapSlideHtml, extractFontFamilies } from "./slide-html";
import { getInlinedFontCSS } from "./fonts";
import type { Slide, AspectRatio } from "@/types/carousel";
import { DIMENSIONS } from "@/types/carousel";

const MAX_RENDERS_BEFORE_RESTART = 50;

// A 4320x5400 capture can outlast puppeteer's 180s default on a busy machine.
const PROTOCOL_TIMEOUT_MS = 600_000;

interface RenderState {
  browser: Promise<Browser> | null;
  renders: number;
  mutex: Mutex;
}

// One shared browser, one render at a time, process-wide. Overlapping exports
// used to capture in the same browser at once and time out in
// Page.captureScreenshot, and callers racing an unset singleton each launched
// (and leaked) their own browser. The state lives on globalThis so a dev-server
// module reload reuses the browser instead of orphaning it.
const globalForRender = globalThis as typeof globalThis & {
  __carouselRender?: RenderState;
};
const state = (globalForRender.__carouselRender ??= {
  browser: null,
  renders: 0,
  mutex: new Mutex(),
});

/** Only call while holding `state.mutex`, so no page is open during a restart. */
async function getBrowser(): Promise<Browser> {
  if (state.browser) {
    const current = await state.browser.catch(() => null);
    if (current?.isConnected() && state.renders < MAX_RENDERS_BEFORE_RESTART) {
      return current;
    }
    await current?.close().catch(() => {});
  }
  state.renders = 0;
  state.browser = puppeteer.launch({
    headless: true,
    protocolTimeout: PROTOCOL_TIMEOUT_MS,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });
  return state.browser;
}

/**
 * Inline all image references in slide HTML.
 * Replaces /uploads/xxx.png paths with data: URIs.
 */
async function inlineImages(html: string): Promise<string> {
  const uploadDir = path.resolve(process.cwd(), "public");
  const imgRegex = /(?:src=["']|url\(["']?)(\/uploads\/[^"'\s)]+)/g;
  const matches = [...html.matchAll(imgRegex)];

  let result = html;
  for (const match of matches) {
    const imgPath = match[1];
    try {
      const fullPath = path.join(uploadDir, imgPath);
      const buffer = await readFile(fullPath);
      const ext = path.extname(imgPath).toLowerCase();
      const mime =
        ext === ".png"
          ? "image/png"
          : ext === ".jpg" || ext === ".jpeg"
            ? "image/jpeg"
            : "image/webp";
      const base64 = buffer.toString("base64");
      result = result.replace(imgPath, `data:${mime};base64,${base64}`);
    } catch {
      // Keep original path — Puppeteer can fetch from localhost
    }
  }

  return result;
}

export interface RenderOptions {
  /** Device scale factor. 4 for print-quality PNG export, 1 for video frames. */
  scale?: number;
  /** Render with a transparent background (annotation overlays). */
  omitBackground?: boolean;
  /** Run the Sharp sRGB pass. Skip it for alpha overlays so nothing flattens transparency. */
  postProcess?: boolean;
}

/**
 * Render body-level HTML to a PNG buffer through the shared slide contract.
 * Both slide export and annotation overlays go through here so typography and
 * image inlining behave identically.
 */
export async function renderHtmlToPng(
  bodyHtml: string,
  aspectRatio: AspectRatio,
  options: RenderOptions = {}
): Promise<Buffer> {
  const { scale = 4, omitBackground = false, postProcess = true } = options;
  const { width, height } = DIMENSIONS[aspectRatio];

  // Get inlined font CSS
  const fontFamilies = extractFontFamilies(bodyHtml);
  const inlinedFontCss = await getInlinedFontCSS(fontFamilies);

  // Inline images
  const inlinedHtml = await inlineImages(bodyHtml);

  // Build self-contained HTML
  const fullHtml = wrapSlideHtml(inlinedHtml, aspectRatio, {
    inlineFontCss: inlinedFontCss,
  });

  const screenshotBuffer = await state.mutex.runExclusive(async () => {
    const br = await getBrowser();
    const page = await br.newPage();

    try {
      await page.setViewport({ width, height, deviceScaleFactor: scale });
      await page.setContent(fullHtml, { waitUntil: "domcontentloaded", timeout: 15000 });

      // Force layout so the faces the slide uses start loading, then wait for
      // them. Declared faces the slide never uses stay "unloaded", so waiting
      // for every face to be "loaded" always ran out the full timeout.
      await page
        .waitForFunction(
          () => {
            document.body.getBoundingClientRect();
            return document.fonts.ready.then(() =>
              [...document.fonts].every((f) => f.status !== "loading")
            );
          },
          { timeout: 10000 }
        )
        .catch(() => {
          // Font loading timeout — proceed with whatever loaded
        });

      const shot = await page.screenshot({
        type: "png",
        omitBackground,
        clip: { x: 0, y: 0, width, height },
      });

      state.renders++;
      return shot;
    } finally {
      await page.close().catch(() => {});
    }
  });

  if (!postProcess) return Buffer.from(screenshotBuffer);

  // Post-process with Sharp: enforce sRGB
  const processed = await sharp(screenshotBuffer)
    .toColorspace("srgb")
    .png()
    .toBuffer();

  return processed;
}

/**
 * Export a single slide to PNG buffer.
 */
export async function exportSlide(
  slide: Slide,
  aspectRatio: AspectRatio,
  options?: RenderOptions
): Promise<Buffer> {
  return renderHtmlToPng(slide.html, aspectRatio, options);
}

/**
 * Export all slides of a carousel to PNG buffers, in slide order.
 * Renders are serialized process-wide, so slides go one after another.
 */
export async function exportAllSlides(
  slides: Slide[],
  aspectRatio: AspectRatio,
  onProgress?: (current: number, total: number) => void,
  options?: RenderOptions
): Promise<{ name: string; buffer: Buffer }[]> {
  const results: { name: string; buffer: Buffer }[] = [];

  for (let i = 0; i < slides.length; i++) {
    const buffer = await exportSlide(slides[i], aspectRatio, options);
    onProgress?.(i + 1, slides.length);
    results.push({ name: `slide-${i + 1}.png`, buffer });
  }

  return results;
}
