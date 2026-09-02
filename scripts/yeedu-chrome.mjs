// ════════════════════════════════════════════════════════════════
// Yeedu carousel chrome — the ONLY thing shared between decks.
// Tokens, stage, eyebrow, headline, caption, footer, QR, API calls.
//
// Deliberately contains NO infographic code. Every drawing lives in
// its own topic script, in a render function named for its claim.
// See .claude/skills/yeedu-carousel-designer/references/infographics.md
// ════════════════════════════════════════════════════════════════
import QRCode from 'qrcode';
import { request as httpRequest } from 'node:http';
import { mkdtemp, mkdir, rm, readdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import sharp from 'sharp';

const run = promisify(execFile);

/** `Some Deck — Name!` → `some-deck-name`. Mirrors the output folder naming. */
function slug(name) {
  return name
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'carousel';
}

export const BASE = 'http://localhost:3000';
export const LOGO = '/uploads/7d95c235-aa75-4cb1-a3c2-e84314ceca33.png';

export const C = {
  orange:      '#f2600c',
  orangeLight: '#ff8a3d',
  orangeDim:   'rgba(242,96,12,0.18)',
  brown:       '#26221d',
  brownDeep:   '#14110d',
  text:        '#ffffff',
  text2:       'rgba(255,255,255,0.72)',
  text3:       'rgba(255,255,255,0.42)',
  rule:        'rgba(255,255,255,0.08)',
  ruleWarm:    'rgba(242,140,90,0.15)',
};

export const R = { w: 1080, h: 1350, padX: 80, padTop: 88, padBottom: 150 };

export const cardBg = `background:linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015));border:1px solid ${C.rule};backdrop-filter:blur(8px);`;

const GLOW = {
  A: { g1:'radial-gradient(ellipse 55% 45% at 90% -5%, rgba(242,96,12,0.32), transparent 55%)',
       g2:'radial-gradient(ellipse 50% 40% at 10% 100%, rgba(242,140,60,0.18), transparent 60%)',
       g3:'radial-gradient(circle at 65% 50%, rgba(255,138,61,0.08), transparent 50%)' },
  B: { g1:'radial-gradient(ellipse 60% 50% at 8% 0%, rgba(242,96,12,0.28), transparent 55%)',
       g2:'radial-gradient(ellipse 50% 40% at 95% 80%, rgba(242,140,60,0.22), transparent 55%)',
       g3:'radial-gradient(circle at 40% 60%, rgba(255,138,61,0.10), transparent 55%)' },
  C: { g1:'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(242,96,12,0.32), transparent 55%)',
       g2:'radial-gradient(ellipse 60% 45% at 50% 110%, rgba(242,140,60,0.22), transparent 55%)',
       g3:'radial-gradient(circle at 20% 40%, rgba(255,138,61,0.08), transparent 55%)' },
  D: { g1:'radial-gradient(ellipse 55% 45% at 100% 50%, rgba(242,96,12,0.30), transparent 55%)',
       g2:'radial-gradient(ellipse 45% 35% at 0% 50%, rgba(242,140,60,0.18), transparent 60%)',
       g3:'radial-gradient(circle at 50% 20%, rgba(255,138,61,0.10), transparent 55%)' },
};

/** The locked five-pass stage + footer band. `inner` is the flow content column. */
export function stage(inner, variant = 'A') {
  const v = GLOW[variant];
  return `
<div style="width:${R.w}px;height:${R.h}px;position:relative;overflow:hidden;font-family:'Inter',sans-serif;color:${C.text};background:linear-gradient(160deg,${C.brown} 0%,${C.brownDeep} 50%,#0a0807 100%);-webkit-font-smoothing:antialiased;">
  <div style="position:absolute;inset:0;background:${v.g1};"></div>
  <div style="position:absolute;inset:0;background:${v.g2};"></div>
  <div style="position:absolute;inset:0;background:${v.g3};"></div>
  <div style="position:absolute;inset:0;background-image:radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0);background-size:32px 32px;opacity:0.7;"></div>
  <svg style="position:absolute;top:0;right:0;width:389px;height:389px;opacity:0.16;" viewBox="0 0 380 380">
    ${[120,160,200,240,280,320].map(r=>`<circle cx="380" cy="0" r="${r}" fill="none" stroke="${C.orange}" stroke-width="1" stroke-dasharray="2 6"/>`).join('')}
  </svg>
  <svg style="position:absolute;bottom:0;left:0;width:302px;height:302px;opacity:0.12;" viewBox="0 0 300 300">
    ${[60,100,140,180,220,260].map(r=>`<circle cx="0" cy="300" r="${r}" fill="none" stroke="${C.orangeLight}" stroke-width="1"/>`).join('')}
  </svg>
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse 90% 90% at 50% 50%,transparent 60%,rgba(0,0,0,0.45) 100%);"></div>
  <div style="position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;padding:${R.padTop}px ${R.padX}px ${R.padBottom}px;box-sizing:border-box;">${inner}</div>
  <div style="position:absolute;left:${R.padX}px;right:${R.padX}px;bottom:48px;display:flex;align-items:center;justify-content:space-between;font-size:16px;color:${C.text3};z-index:5;">
    <img src="${LOGO}" style="height:26px;opacity:0.9;" />
    <span style="font-weight:500;letter-spacing:0.5px;">yeedu.io</span>
  </div>
</div>`;
}

// wrapped — a bare <img> in the flex column gets stretched to full width
export function logoMark(h = 34) {
  return `<div style="margin-bottom:26px;"><img src="${LOGO}" style="height:${h}px;width:auto;display:block;" /></div>`;
}

export function eyebrow(text) {
  return `<div><div style="display:inline-flex;align-items:center;gap:10px;padding:7px 14px;background:${C.orangeDim};border:1px solid ${C.ruleWarm};border-radius:999px;font-size:16px;font-weight:600;color:${C.orangeLight};letter-spacing:1.5px;text-transform:uppercase;">
    <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${C.orange};box-shadow:0 0 10px ${C.orange};"></span>${text}
  </div></div>`;
}

/** One tight line, optically fitted per slide (44–62px). Never a fixed size with <br/>. */
export function headline(text, size = 54) {
  return `<h1 style="margin:22px 0 0;font-family:'Montserrat',sans-serif;font-weight:800;font-size:${size}px;line-height:1.02;letter-spacing:-2px;">${text}</h1>`;
}

/** Optional italic gradient fragment, for use inside headline(). */
export function em(text) {
  return `<span style="font-weight:300;font-style:italic;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">${text}</span>`;
}

export function caption(text) {
  return `<p style="margin:22px 0 0;font-size:23px;line-height:1.5;color:${C.text2};max-width:880px;">${text}</p>`;
}

/** The infographic well — flex:1 so the drawing takes whatever the copy leaves. */
export function well(inner, { card = true, pad = 30 } = {}) {
  const box = card ? `${cardBg}border-radius:24px;padding:${pad}px;` : '';
  return `<div style="flex:1;min-height:0;display:flex;align-items:center;justify-content:center;margin-top:30px;${box}box-sizing:border-box;">${inner}</div>`;
}

/** Design in a ~200-unit viewBox; this upscales it to the frame. */
export function svg(vbW, vbH, body, renderW = 856) {
  const h = Math.round((renderW * vbH) / vbW);
  return `<svg viewBox="0 0 ${vbW} ${vbH}" width="${renderW}" height="${h}" xmlns="http://www.w3.org/2000/svg" style="display:block;overflow:visible;">${body}</svg>`;
}

/** In-SVG annotation stack: label / hero value / qualifier, three sizes. */
export function annot(x, y, { label, value, note, anchor = 'start', color = C.orangeLight }) {
  const a = anchor;
  let out = '';
  if (label) out += `<text x="${x}" y="${y}" text-anchor="${a}" font-family="Inter" font-size="6.4" font-weight="600" letter-spacing="0.9" fill="#fff" opacity="0.42">${label}</text>`;
  if (value) out += `<text x="${x}" y="${y + 20}" text-anchor="${a}" font-family="Montserrat" font-size="20" font-weight="800" letter-spacing="-0.6" fill="${color}">${value}</text>`;
  if (note)  out += `<text x="${x}" y="${y + 32}" text-anchor="${a}" font-family="Inter" font-size="6.6" font-weight="400" fill="#fff" opacity="0.6">${note}</text>`;
  return out;
}

// ── QR: dark modules (white-on-white renders blank), viewBox read off the SVG ──
export async function makeQr(url, size = 168) {
  const s = await QRCode.toString(url, {
    type: 'svg', margin: 0, errorCorrectionLevel: 'M',
    color: { dark: '#14110d', light: '#00000000' },
  });
  const box = s.match(/viewBox="([^"]+)"/)[1];
  const inner = s.replace(/<svg[^>]*>/, '').replace('</svg>', '');
  return `<div style="background:#fff;border-radius:16px;padding:14px;display:inline-block;line-height:0;">
    <svg viewBox="${box}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>
  </div>`;
}

export function ctaPill(text) {
  return `<div style="display:inline-flex;align-items:center;gap:12px;padding:16px 30px;border-radius:999px;background:linear-gradient(135deg,${C.orange},${C.orangeLight});font-family:'Montserrat',sans-serif;font-weight:700;font-size:22px;letter-spacing:-0.3px;color:#fff;box-shadow:0 10px 30px rgba(242,96,12,0.35);">${text}</div>`;
}

// ── API ──────────────────────────────────────────────────────────
export async function deleteCarousel(id) {
  const r = await fetch(`${BASE}/api/carousels/${id}`, { method: 'DELETE' });
  console.log(`  delete ${id}: ${r.status}`);
}

export async function buildCarousel(name, slides, aspectRatio = '4:5') {
  const res = await fetch(`${BASE}/api/carousels`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, aspectRatio }),
  });
  if (!res.ok) throw new Error(`create failed: ${res.status} ${await res.text()}`);
  const { id } = await res.json();
  for (const [i, s] of slides.entries()) {
    const r = await fetch(`${BASE}/api/carousels/${id}/slides`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: s.html, notes: s.notes }),
    });
    if (!r.ok) throw new Error(`slide ${i + 1} failed: ${r.status} ${await r.text()}`);
    console.log(`  slide ${i + 1}/${slides.length} — ${s.notes}`);
  }
  console.log(`\n${name}\n  ${BASE}/?carousel=${id}\n  id: ${id}\n`);
  return id;
}

/**
 * POST and buffer the binary response. Uses node:http rather than fetch — a 4×
 * export of five slides routinely runs past fetch's 300s headers timeout,
 * which surfaces as an opaque UND_ERR_HEADERS_TIMEOUT.
 */
function postForBuffer(url) {
  return new Promise((resolve, reject) => {
    const req = httpRequest(url, { method: 'POST' }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const body = Buffer.concat(chunks);
        if (res.statusCode !== 200) {
          return reject(new Error(`export failed: ${res.statusCode} ${body.toString().slice(0, 300)}`));
        }
        resolve(body);
      });
    });
    req.on('error', reject);
    req.setTimeout(0);
    req.end();
  });
}

/**
 * Export a built deck to `output/<carousel-name-slugified>/1.jpg, 2.jpg, …`.
 *
 * The app's export endpoint hands back a ZIP of PNGs, so the renumbering and
 * the JPEG conversion happen here. The output directory is wiped first, so a
 * deck rebuilt with fewer slides never leaves a stale trailing image behind.
 *
 * Exports are not serialized server-side — run one at a time, or the shared
 * browser dies with `Protocol error (Page.captureScreenshot): Target closed`.
 */
export async function exportDeck(id, name) {
  const zip = await postForBuffer(`${BASE}/api/carousels/${id}/export`);

  const tmp = await mkdtemp(path.join(tmpdir(), 'yeedu-export-'));
  const dir = path.join('output', slug(name));
  try {
    const zipPath = path.join(tmp, 'deck.zip');
    await writeFile(zipPath, zip);
    await run('unzip', ['-q', '-o', zipPath, '-d', tmp]);

    // slide-2.png must sort before slide-10.png — numeric, not lexical.
    const pngs = (await readdir(tmp))
      .filter(f => f.endsWith('.png'))
      .sort((a, b) => parseInt(a.match(/\d+/)?.[0] ?? '0', 10) - parseInt(b.match(/\d+/)?.[0] ?? '0', 10));

    await rm(dir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });

    for (const [i, png] of pngs.entries()) {
      await sharp(await readFile(path.join(tmp, png)))
        .toColorspace('srgb')
        .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
        .toFile(path.join(dir, `${i + 1}.jpg`));
    }
    console.log(`  exported ${pngs.length} → ${dir}/1..${pngs.length}.jpg`);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
  return dir;
}
