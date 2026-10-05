// ════════════════════════════════════════════════════════════════
// Surrogate Keys At Scale Without A Central Sequence
// Source: technical-deep-dive 2026-08-24 (not published yet)
//
// 5 slides, 4:5. One bespoke drawing per slide — no shared renderer
// map. Chrome only comes from ./yeedu-chrome.mjs.
// Every number on slides 1–5 is the article's source, never Yeedu's;
// the only Yeedu figures are on the closer's CTA (skill fact sheet).
// ════════════════════════════════════════════════════════════════
import {
  C, stage, logoMark, eyebrow, headline, em, caption, well, svg, annot,
  makeQr, ctaPill, buildCarousel, deleteCarousel, exportDeck,
} from './yeedu-chrome.mjs';

const BLOG_URL = null; // not published yet — set the live URL and re-run to add the QR
const OLD_ID = '2f1760cf-8d93-4e39-b13d-766ab525d3b3';

const O = C.orange, OL = C.orangeLight;

const label = (x, y, text, { anchor = 'start', op = 0.42, size = 6.4, fill = '#fff' } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter" font-size="${size}" font-weight="600" letter-spacing="0.9" fill="${fill}" opacity="${op}">${text}</text>`;
const sup = n => `<tspan dy="-3" font-size="4.4">${n}</tspan>`;

// ── 1. COVER ─────────────────────────────────────────────────────
// Claim: a SHA-512 key is eight BIGINTs wide.
// Proportional nested rects: 4s × 2s outer (64 bytes) vs s × s inner (8 bytes),
// area 8:1. The faint cell grid makes the count of eight readable without a label.
// Bookended on the closer, where the outer rect turns to a ghost.
function drawKeyWidth() {
  const s = 40, x0 = 20, y0 = 26;
  let b = '';
  b += `<g stroke="#fff" stroke-opacity="0.14" stroke-width="1.5">`;
  for (let i = 1; i < 4; i++) b += `<line x1="${x0 + i * s}" y1="${y0}" x2="${x0 + i * s}" y2="${y0 + 2 * s}"/>`;
  b += `<line x1="${x0}" y1="${y0 + s}" x2="${x0 + 4 * s}" y2="${y0 + s}"/>`;
  b += `</g>`;
  b += `<rect x="${x0}" y="${y0}" width="${4 * s}" height="${2 * s}" fill="none" stroke="#fff" stroke-opacity="0.5" stroke-width="2.5"/>`;
  b += `<rect x="${x0}" y="${y0 + s}" width="${s}" height="${s}" fill="${O}"/>`;
  // outer label above, inner label below (archetype 6)
  b += label(x0, y0 - 9, 'SHA-512 HASH KEY');
  b += `<text x="${x0 + 4 * s}" y="${y0 - 8}" text-anchor="end" font-family="Montserrat" font-size="9" font-weight="700" fill="#fff" opacity="0.8">64 bytes</text>`;
  b += label(x0, y0 + 2 * s + 14, 'BIGINT KEY', { op: 0.9, fill: OL });
  // label renders ~46 units wide; at +44 the two ran together
  b += `<text x="${x0 + 54}" y="${y0 + 2 * s + 14.6}" font-family="Montserrat" font-size="9" font-weight="700" fill="#fff" opacity="0.8">8 bytes</text>`;
  return svg(200, 128, b, 820);
}

// ── 2. TABLE SIZE ────────────────────────────────────────────────
// Claim: same 673M rows, the SHA-512-keyed fact table is 3× the BIGINT one.
// Side-by-side oblique table slabs on one baseline; the count of slabs is the data.
function drawTableSlabs() {
  const base = 128, w = 60, h = 28, dx = 12, dy = -8;
  const front = (x, y, fill, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
  const side = (x, y, fill, extra = '') => `<path d="M${x + w},${y} L${x + w + dx},${y + dy} L${x + w + dx},${y + h + dy} L${x + w},${y + h} Z" fill="${fill}" ${extra}/>`;
  const top = (x, y, fill, extra = '') => `<path d="M${x},${y} L${x + dx},${y + dy} L${x + w + dx},${y + dy} L${x + w},${y} Z" fill="${fill}" ${extra}/>`;
  const rows = (x, y, stroke, op) => {
    let r = `<g stroke="${stroke}" stroke-opacity="${op}" stroke-width="1.5">`;
    for (let k = 1; k <= 3; k++) r += `<line x1="${x + 5}" y1="${y + k * 7}" x2="${x + w - 5}" y2="${y + k * 7}"/>`;
    return r + `</g>`;
  };
  let b = '';
  b += `<line x1="12" y1="${base}" x2="192" y2="${base}" stroke="#fff" stroke-opacity="0.16" stroke-width="1.5"/>`;

  // SHA-512 keyed table: three slabs
  const sx = 112, ghost = 'stroke="#fff" stroke-opacity="0.45" stroke-width="2" stroke-linejoin="round"';
  for (let i = 0; i < 3; i++) {
    const y = base - h * (i + 1);
    b += side(sx, y, 'rgba(255,255,255,0.03)', ghost);
    b += front(sx, y, 'rgba(255,255,255,0.06)', ghost);
    b += rows(sx, y, '#fff', 0.2);
  }
  b += top(sx, base - 3 * h, 'rgba(255,255,255,0.10)', ghost);

  // BIGINT keyed table: one slab
  const bx = 28, by = base - h;
  b += side(bx, by, '#b8470a');
  b += top(bx, by, OL);
  b += front(bx, by, O);
  b += rows(bx, by, '#14110d', 0.28);

  b += label(bx + w / 2, base + 13, 'BIGINT KEYS', { anchor: 'middle', op: 0.9, fill: OL });
  b += label(sx + w / 2, base + 13, 'SHA-512 KEYS', { anchor: 'middle', op: 0.5 });
  b += annot(bx, 34, { label: 'FACT TABLE SIZE', value: '3x', note: 'same 673M rows' });
  return svg(200, 146, b, 800);
}

// ── 3. COLLISION BOUNDARY ────────────────────────────────────────
// Claim: Snowflake HASH() collisions get reasonably likely at 2^32 ≈ 4B rows,
// far below MD5's theoretical 2^64 point.
// Rows over time on a log2 axis (with a marked break) rising into a solid rule.
// The growth rate is the article's 3.6M rows/day; the crossing time is derived.
function drawCollisionBoundary() {
  const ox = 30, xr = 192, years = 20, pxYr = (xr - ox) / years;
  const oy = 128, pLo = 24, perLo = 70 / 12;            // lower band: 2^24 .. 2^36
  const yLo = p => oy - (p - pLo) * perLo;
  const yUp = p => 40 - (p - 60) * 4;                   // upper band: 2^60 .. 2^66
  const RATE = 3.6e6, DAYS = 365.25;
  const p = yrs => Math.log2(RATE * yrs * DAYS);
  const crossYr = 2 ** 32 / RATE / DAYS;                // ≈ 3.27 years
  const cx = ox + crossYr * pxYr, cy = yLo(32);

  let b = '';
  // axes, with a break between the bands
  b += `<g stroke="#fff" stroke-opacity="0.16" stroke-width="1.5">`;
  b += `<line x1="${ox}" y1="${oy}" x2="${xr}" y2="${oy}"/>`;
  b += `<line x1="${ox}" y1="${oy}" x2="${ox}" y2="53"/>`;
  b += `<line x1="${ox}" y1="45" x2="${ox}" y2="14"/>`;
  b += `</g>`;
  b += `<g stroke="#fff" stroke-opacity="0.4" stroke-width="1.5" stroke-linecap="round"><line x1="26" y1="55" x2="34" y2="51"/><line x1="26" y1="47" x2="34" y2="43"/></g>`;
  b += label(ox + 4, 10, 'ROWS, LOG SCALE', { op: 0.36, size: 5.8 });

  // 2^64 — dotted ghost: theoretical, nobody has reported hitting it
  b += `<line x1="${ox}" y1="${yUp(64)}" x2="${xr}" y2="${yUp(64)}" stroke="#fff" stroke-opacity="0.45" stroke-width="2" stroke-dasharray="1 8" stroke-linecap="round"/>`;
  b += label(ox + 4, yUp(64) + 10, 'MD5 50% COLLISION POINT · THEORETICAL', { op: 0.42, size: 5.8 });

  // 2^32 — solid: the documented limit
  b += `<line x1="${ox}" y1="${cy}" x2="${xr}" y2="${cy}" stroke="#fff" stroke-opacity="0.45" stroke-width="2"/>`;
  // kept short: the "SNOWFLAKE …" version ran back into the crossing leader
  b += label(xr, cy + 10, `HASH() · 2${sup(32)} ≈ 4B ROWS`, { anchor: 'end', op: 0.6, size: 5.8 });
  b += label(xr, cy + 18, 'collisions reasonably likely', { anchor: 'end', op: 0.42, size: 5.8 });

  // y tick labels
  const tick = (y, n) => `<text x="${ox - 5}" y="${y + 2.4}" text-anchor="end" font-family="Montserrat" font-size="7" font-weight="700" fill="#fff" opacity="0.55">2${sup(n)}</text>`;
  b += tick(yUp(64), 64) + tick(cy, 32) + tick(oy, 24);

  // x ticks
  [0, 10, 20].forEach(t => {
    const x = ox + t * pxYr;
    b += `<line x1="${x}" y1="${oy}" x2="${x}" y2="${oy + 3}" stroke="#fff" stroke-opacity="0.25" stroke-width="1.5"/>`;
    b += `<text x="${x}" y="${oy + 11}" text-anchor="${t === 20 ? 'end' : 'middle'}" font-family="Montserrat" font-size="7" font-weight="700" fill="#fff" opacity="0.45">${t === 20 ? '20 yrs' : t}</text>`;
  });

  // the data: 3.6M rows/day, log2 rows vs linear years
  const t0 = 2 ** pLo / RATE / DAYS;
  const pts = [];
  for (let i = 0; i <= 60; i++) {
    const t = t0 * Math.pow(years / t0, i / 60);
    pts.push(`${(ox + t * pxYr).toFixed(2)},${yLo(p(t)).toFixed(2)}`);
  }
  b += `<path d="M${pts.join(' L')}" fill="none" stroke="${O}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>`;

  // crossing, drawn to the axis
  b += `<line x1="${cx.toFixed(1)}" y1="${(cy + 6).toFixed(1)}" x2="${cx.toFixed(1)}" y2="${oy}" stroke="#fff" stroke-opacity="0.25" stroke-width="1.5"/>`;
  b += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="7" fill="none" stroke="${O}" stroke-opacity="0.35" stroke-width="1.5"/>`;
  b += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="3.2" fill="${O}"/>`;

  b += annot(ox, 152, { label: 'AT 3.6M NEW ROWS A DAY', value: `${crossYr.toFixed(1)} years`, note: `to cross 2${sup(32)} rows (derived)` });
  return svg(200, 190, b, 820);
}

// ── 4. TYPE-2 LOOKUP ─────────────────────────────────────────────
// Claim: one Type-2 attribute on the dimension brings the lookup back.
// Git-graph with a ghost edge: the direct business-key → fact edge (the hash
// promise) is dotted; the real path runs through the dimension's versions.
// The single orange column is the count of Type-2 attributes: 1.
function drawTypeTwoLookup() {
  const ky = 124, kx = 16, fx = 184, dy = 36;
  let b = '';
  // ghost edge — the lookup-free insert that doesn't happen
  b += `<line x1="${kx + 8}" y1="${ky}" x2="${fx - 8}" y2="${ky}" stroke="#fff" stroke-opacity="0.5" stroke-width="2.5" stroke-dasharray="1 8" stroke-linecap="round"/>`;

  // dimension table glyph: five columns, one Type-2
  b += `<rect x="34" y="24" width="44" height="24" rx="3" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="2"/>`;
  b += `<g fill="none" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5">`;
  for (let i = 0; i < 4; i++) b += `<rect x="${38 + i * 8}" y="28" width="6" height="16" rx="1"/>`;
  b += `</g>`;
  b += `<rect x="70" y="28" width="6" height="16" rx="1" fill="${O}"/>`;
  b += label(34, 16, 'DIMENSION');

  // version rail + commits
  const V = [104, 140, 176];
  b += `<line x1="78" y1="${dy}" x2="190" y2="${dy}" stroke="#fff" stroke-opacity="0.3" stroke-width="2"/>`;
  V.forEach((x, i) => {
    b += `<circle cx="${x}" cy="${dy}" r="4.5" fill="#fff" fill-opacity="${i === 1 ? 1 : 0.5}"/>`;
    b += `<text x="${x}" y="${dy - 9}" text-anchor="middle" font-family="Montserrat" font-size="7" font-weight="700" fill="#fff" opacity="${i === 1 ? 0.9 : 0.45}">v${i + 1}</text>`;
  });

  // the real path: key → dimension, version at event time → fact
  b += `<g fill="none" stroke="#fff" stroke-opacity="0.75" stroke-width="3" stroke-linecap="round">`;
  b += `<path d="M${kx},${ky - 5} C${kx},80 20,${dy} 34,${dy}"/>`;
  b += `<path d="M${V[1]},${dy + 5} C${V[1]},70 ${fx},90 ${fx},${ky - 6}"/>`;
  b += `</g>`;
  b += `<circle cx="${kx}" cy="${ky}" r="5" fill="#fff"/>`;
  b += `<circle cx="${fx}" cy="${ky}" r="5" fill="#fff"/>`;

  // right of the drop curve; under the rail it crowded the annot stack
  b += label(196, 54, 'LOOKUP AT', { anchor: 'end', op: 0.5, size: 5.8 });
  b += label(196, 62, 'EVENT TIME', { anchor: 'end', op: 0.5, size: 5.8 });
  b += label(6, ky + 14, 'BUSINESS KEY', { op: 0.6 });
  b += label(fx + 10, ky + 14, 'FACT ROW', { anchor: 'end', op: 0.6 });
  // above the ghost edge: below it, it collided with BUSINESS KEY
  b += label(100, ky - 8, 'HASH KEY, NO LOOKUP', { anchor: 'middle', op: 0.36 });
  b += annot(34, 64, { label: 'TYPE-2 COLUMNS', value: '1', note: 'is all it takes' });
  return svg(200, 146, b, 820);
}

// ── 5. CLOSER ────────────────────────────────────────────────────
// Bookend: the cover's 64-byte rect returns as a dotted ghost; the 8-byte
// IDENTITY square stays solid. One writer flows in, the other two are ghosts.
function drawSingleWriterKey() {
  const s = 40, x0 = 20, y0 = 26;
  let b = '';
  b += `<rect x="${x0}" y="${y0}" width="${4 * s}" height="${2 * s}" fill="none" stroke="#fff" stroke-opacity="0.4" stroke-width="2.5" stroke-dasharray="1 8" stroke-linecap="round"/>`;
  b += `<rect x="${x0}" y="${y0 + s}" width="${s}" height="${s}" fill="${O}"/>`;
  b += label(x0, y0 - 9, 'SHA-512 HASH KEY', { op: 0.3 });
  b += `<text x="${x0 + 4 * s}" y="${y0 - 8}" text-anchor="end" font-family="Montserrat" font-size="9" font-weight="700" fill="#fff" opacity="0.3">64 bytes</text>`;
  b += annot(x0 + s + 12, y0 + 34, { label: 'IDENTITY COLUMN', value: '8 bytes', note: 'unique, monotonic, gaps allowed' });

  // writers: one real (flows to), two that can't run concurrently (ghost)
  const wy = y0 + 2 * s + 26, sb = y0 + 2 * s, mid = x0 + s / 2;
  b += `<line x1="${mid}" y1="${wy - 5}" x2="${mid}" y2="${sb + 5}" stroke="#fff" stroke-opacity="0.55" stroke-width="2" stroke-dasharray="4 5"/>`;
  b += `<path d="M${mid - 3.5},${sb + 7.5} L${mid},${sb + 4} L${mid + 3.5},${sb + 7.5}" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="2" stroke-linecap="round"/>`;
  [-14, 14].forEach(d => {
    b += `<line x1="${mid + d}" y1="${wy - 5}" x2="${mid + d * 0.5}" y2="${sb + 5}" stroke="#fff" stroke-opacity="0.4" stroke-width="2" stroke-dasharray="1 8" stroke-linecap="round"/>`;
    b += `<circle cx="${mid + d}" cy="${wy}" r="3.5" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="1.5"/>`;
  });
  b += `<circle cx="${mid}" cy="${wy}" r="3.5" fill="#fff"/>`;
  b += label(mid + 24, wy - 1, 'ONE WRITER AT A TIME', { op: 0.6 });
  b += label(mid + 24, wy + 8, 'concurrent transactions disabled', { op: 0.42, size: 5.8 });
  return svg(200, 142, b, 780);
}

// ── slides ───────────────────────────────────────────────────────
const qr = BLOG_URL ? await makeQr(BLOG_URL, 150) : '';

const contact = `
  <div>
    <div style="font-size:14px;font-weight:600;color:${C.text3};letter-spacing:1.4px;text-transform:uppercase;">Talk to us</div>
    <div style="margin-top:6px;font-size:24px;color:${C.text2};font-weight:600;">sales@yeedu.io</div>
  </div>`;
const cta = ctaPill('Run your Spark jobs for 60–80% less');
const closerCta = BLOG_URL
  ? `<div style="display:flex;align-items:center;justify-content:space-between;gap:32px;margin-top:22px;">
       <div>${cta}<div style="margin-top:18px;">${contact}</div></div>
       <div style="text-align:center;">${qr}
         <div style="margin-top:8px;font-size:13px;color:${C.text3};letter-spacing:0.6px;">READ THE POST</div>
       </div>
     </div>`
  : `<div style="display:flex;align-items:center;gap:40px;margin-top:30px;padding-top:30px;border-top:1px solid ${C.rule};">
       ${cta}${contact}
     </div>`;

const slides = [
  {
    notes: 'Cover — claim: a SHA-512 key is 8x a BIGINT. Archetype 6, proportional nested rects (area 1:8, 4×2 cell grid); bookended on slide 5',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Surrogate keys · key width')}
      ${headline('Eight BIGINTs fit in one SHA-512 key', 46)}
      ${well(drawKeyWidth(), { card: false })}
      ${caption(`SHA-1 is 20 bytes, SHA-256 is 32 and SHA-512 is 64. A hashed dimension key gets stored again in every fact row that points at it.`)}
    `, 'A'),
  },
  {
    notes: 'Table size — claim: same 673M rows, the SHA-512-keyed fact table is 3x the BIGINT one (dimodelo benchmark). Side-by-side oblique table slabs, count of slabs is the ratio',
    html: stage(`
      ${eyebrow('Storage · 673M-row benchmark')}
      ${headline('SHA-512 keys tripled a 673M-row table', 46)}
      ${well(drawTableSlabs())}
      ${caption(`In a dimodelo benchmark joining a 673M-row fact table to three dimensions, the BIGINT-keyed table came out a third the size of the SHA-512 one. Each dimension a fact row references adds another wide key.`)}
    `, 'B'),
  },
  {
    notes: 'Collision boundary — claim: Snowflake HASH() collisions get reasonably likely near 2^32 rows. Curve rising into a solid rule, dotted 2^64 MD5 rule above an axis break; 3.3-year crossing derived from 3.6M rows/day',
    html: stage(`
      ${eyebrow('Snowflake HASH()')}
      ${headline('At 4B rows, HASH() keys likely collide', 44)}
      ${well(drawCollisionBoundary())}
      ${caption(`Snowflake's HASH() returns a 64-bit number, and its docs call duplicates reasonably likely past 2<sup>32</sup> rows. At 3.6M rows a day we'd get there in about 3.3 years. MD5's 50% point sits up at 2<sup>64</sup>.`)}
    `, 'C'),
  },
  {
    notes: 'Type-2 lookup — claim: one SCD2 attribute brings the dimension lookup back. Archetype 5, git-graph with a ghost edge (business key → fact goes dotted), one orange Type-2 column',
    html: stage(`
      ${eyebrow('Slowly changing dimensions')}
      ${headline('Track history and the lookup returns', 46)}
      ${well(drawTypeTwoLookup())}
      ${caption(`A hash key lets a load insert the fact row without reading the dimension. Once the dimension keeps history, the load has to find the version that was active at event time, and that's a lookup whatever the key is.`)}
    `, 'B'),
  },
  {
    notes: 'Closer — claim: keep the key at 8 bytes with IDENTITY, accept a single writer. Archetype 8, bookend inverting the cover (64-byte rect now a dotted ghost, 8-byte square solid) + one-writer flow; CTA pill + email, QR only when BLOG_URL is set',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Delta Lake IDENTITY')}
      ${headline(`An 8-byte key and ${em('a single writer')}`, 54)}
      ${well(drawSingleWriterKey(), { card: false })}
      ${caption(`IDENTITY columns (Databricks Runtime 10.4+, Delta Lake 3.3.0+) hand out BIGINT keys, and declaring one disables concurrent transactions on that table. The joins still run on Spark, and Yeedu makes that Spark faster and cheaper with zero code rewrites.`)}
      ${closerCta}
    `, 'D'),
  },
];

const NAME = 'Surrogate Keys At Scale Without A Central Sequence';

if (OLD_ID) { console.log('Removing superseded deck…'); await deleteCarousel(OLD_ID); }
const id = await buildCarousel(NAME, slides);
if (!process.env.SKIP_EXPORT) await exportDeck(id, NAME);
