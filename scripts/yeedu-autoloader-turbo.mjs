// ════════════════════════════════════════════════════════════════
// Faster Auto Loader: How Yeedu Turbo Speeds Up Streaming File Ingestion
//
// 5 slides, 4:5. One bespoke drawing per slide, chrome from ./yeedu-chrome.mjs.
// Generic Auto Loader and S3 behaviour carries no figures. Every Yeedu line
// stays inside the allowed claims: cloudFiles code runs as is, Turbo (C++
// vectorized engine) takes the CPU-bound JSON work, the scoped scan of the
// current YYYY/MM/DD folder is the bigger effect, tuning for deep folders and
// file-split distribution, a flat annual licence with no per-DBU fee, and
// adoption job by job. No Yeedu number anywhere. Segment widths and bar
// heights are drawn as illustrative shapes and labelled that way.
// ════════════════════════════════════════════════════════════════
import {
  C, stage, logoMark, eyebrow, headline, caption, well, svg,
  makeQr, ctaPill, buildCarousel, deleteCarousel, exportDeck,
} from './yeedu-chrome.mjs';

const BLOG_URL = process.env.BLOG_URL || null; // empty for now, so no QR
const OLD_ID = process.env.OLD_ID || '';

const O = C.orange, OL = C.orangeLight;

// Italic second line of a headline. The gradient is clipped to the text, so
// the italic overhang on a wrapped line loses its last glyph unless every
// line fragment carries its own padding (box-decoration-break: clone).
const em2 = (t) => `<span style="display:block;font-weight:300;font-style:italic;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;padding-right:0.14em;-webkit-box-decoration-break:clone;box-decoration-break:clone;">${t}</span>`;

const lbl = (x, y, t, { anchor = 'start', fill = '#fff', op = 0.42, size = 6.2 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter" font-size="${size}" font-weight="600" letter-spacing="0.9" fill="${fill}" opacity="${op}">${t}</text>`;
const txt = (x, y, t, { anchor = 'start', fill = '#fff', op = 0.75, size = 5.2, weight = 500, family = 'Inter' } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" opacity="${op}">${t}</text>`;

// ── 1. COVER ─────────────────────────────────────────────────────
// One micro-batch as a timeline bar: discover, parse, transform, write.
// Discover and parse are orange. Faint batches repeat underneath to show
// the stream. Widths illustrative.
const SEG = [
  { name: 'DISCOVER FILES', w: 62, fill: O, op: 1, hot: true },
  { name: 'PARSE JSON', w: 48, fill: OL, op: 0.9, hot: true },
  { name: 'TRANSFORM', w: 38, fill: '#fff', op: 0.3 },
  { name: 'WRITE TO DELTA', w: 32, fill: '#fff', op: 0.18 },
];
function drawBatchTimeline() {
  const x0 = 10, y = 30, h = 24;
  let b = '';
  b += lbl(x0, 12, 'ONE MICRO-BATCH', { size: 4.6, op: 0.6 });
  // bracket over the hot segments
  const hotW = SEG[0].w + SEG[1].w;
  b += `<path d="M${x0},${y - 4} L${x0},${y - 8} L${x0 + hotW - 1},${y - 8} L${x0 + hotW - 1},${y - 4}" fill="none" stroke="${OL}" stroke-width="1.2"/>`;
  b += lbl(x0 + hotW / 2, y - 11, 'WHERE THE BATCH WAITS', { anchor: 'middle', size: 4, op: 1, fill: OL });
  let x = x0;
  SEG.forEach((s, i) => {
    b += `<rect x="${x}" y="${y}" width="${s.w - 1.2}" height="${h}" rx="2" fill="${s.fill}" fill-opacity="${s.op}"/>`;
    b += `<text x="${x + 4}" y="${y + h + 9}" font-family="Inter" font-size="4.2" font-weight="700" letter-spacing="0.6" fill="${s.hot ? OL : '#fff'}" opacity="${s.hot ? 1 : 0.6}">${s.name}</text>`;
    b += `<text x="${x + 4}" y="${y + 15}" font-family="Montserrat" font-size="7" font-weight="800" fill="${s.hot ? '#fff' : '#fff'}" opacity="${s.hot ? 1 : 0.7}">${i + 1}</text>`;
    x += s.w;
  });
  // stream of later batches, faint
  const ry = 82;
  b += lbl(x0, ry - 4, 'EVERY TRIGGER REPEATS IT', { size: 3.8, op: 0.45 });
  for (let k = 0; k < 4; k++) {
    let sx = x0 + k * 46;
    const scale = 0.24;
    SEG.forEach(s => {
      b += `<rect x="${sx}" y="${ry}" width="${s.w * scale - 0.6}" height="6" rx="1" fill="${s.fill}" fill-opacity="${s.hot ? 0.75 : s.op}"/>`;
      sx += s.w * scale;
    });
  }
  b += lbl(190, 100, 'WIDTHS ILLUSTRATIVE', { anchor: 'end', size: 3.4, op: 0.38 });
  return svg(200, 104, b, 856);
}

// ── 2 + 3. THE LANDING TREE ──────────────────────────────────────
// landing/2026/ with four months of day folders. Mode 'all': every past day
// is walked on each batch, one new file glows in 10/14. Mode 'today': the
// history is skipped and only 10/14 is listed, with tomorrow dashed for the
// rollover. A small per-batch chart underneath, illustrative.
const MONTHS = [['07', 31], ['08', 31], ['09', 30], ['10', 14]];
function fileIcon(x, y, s, color) {
  // iconsax-style document outline
  return `<g transform="translate(${x},${y}) scale(${s / 24})" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z"/>
    <path d="M14.5 4.5v2c0 1.1.9 2 2 2h2"/><path d="M8 13h4M8 17h8"/></g>`;
}
function drawLandingTree(mode) {
  const tx = 10, gx = 37, p = 5, s = 4, rowH = 11, gy = 26;
  const all = mode === 'all';
  let b = '';
  b += txt(tx, 8, 's3://bucket/landing/', { size: 5, op: 0.85, family: 'JetBrains Mono, monospace', weight: 600 });
  b += txt(tx + 6, 17, '2026/', { size: 5, op: 0.85, family: 'JetBrains Mono, monospace', weight: 600 });
  b += `<path d="M${tx + 2},10 L${tx + 2},15 L${tx + 5},15" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="0.8"/>`;
  MONTHS.forEach(([m, days], r) => {
    const y = gy + r * rowH;
    // connector
    b += `<path d="M${tx + 8},19 L${tx + 8},${y + 2} L${tx + 12},${y + 2}" fill="none" stroke="#fff" stroke-opacity="0.25" stroke-width="0.7"/>`;
    b += txt(tx + 14, y + 3.8, `${m}/`, { size: 4.4, op: 0.7, family: 'JetBrains Mono, monospace', weight: 600 });
    for (let d = 1; d <= days; d++) {
      const x = gx + (d - 1) * p;
      const today = m === '10' && d === 14;
      if (today) {
        b += `<rect x="${x - 1.2}" y="${y - 1.2}" width="${s + 2.4}" height="${s + 2.4}" rx="1.6" fill="${O}" fill-opacity="0.35"/>`;
        b += `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="0.8" fill="${O}"/>`;
      } else if (all) {
        b += `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="0.8" fill="#fff" fill-opacity="0.2" stroke="#fff" stroke-opacity="0.45" stroke-width="0.4"/>`;
      } else {
        b += `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="0.8" fill="#fff" fill-opacity="0.07"/>`;
      }
    }
  });
  const ty = gy + 3 * rowH, tdx = gx + 13 * p;
  if (all) {
    // recursive scan box around the whole history
    b += `<rect x="${gx - 3}" y="${gy - 3.5}" width="${31 * p + 2}" height="${3 * rowH + s + 7}" rx="2.5" fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="0.9" stroke-dasharray="2 2"/>`;
    b += lbl(gx + 31 * p - 1, gy - 6.5, 'LISTED ON EVERY BATCH: EVERY PAST DAY', { anchor: 'end', size: 3.9, op: 0.7 });
  } else {
    b += `<rect x="${tdx - 3}" y="${ty - 3}" width="${s + 6}" height="${s + 6}" rx="2" fill="none" stroke="${OL}" stroke-width="1.1"/>`;
    b += txt(gx + 12, gy - 6, 'LIST landing/2026/10/14/', { size: 4.6, op: 1, fill: OL, family: 'JetBrains Mono, monospace', weight: 700 });
    b += lbl(gx + 30 * p + 2, gy - 6, 'HISTORY SKIPPED', { anchor: 'end', size: 3.8, op: 0.45 });
    // tomorrow, dashed: rollover
    const nx = tdx + p;
    b += `<rect x="${nx}" y="${ty}" width="${s}" height="${s}" rx="0.8" fill="none" stroke="#fff" stroke-opacity="0.7" stroke-width="0.5" stroke-dasharray="0.8 0.8"/>`;
    b += `<path d="M${nx + 2},${ty + s + 1.5} L${nx + 2},${ty + s + 6} L${nx + 12},${ty + s + 6}" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="0.6"/>`;
    b += lbl(nx + 14, ty + s + 7.4, 'TOMORROW: ROLLOVER', { size: 3.4, op: 0.6 });
  }
  // the new file
  b += `<path d="M${tdx + 2},${ty + s + 1.5} L${tdx + 2},${ty + s + 9}" stroke="${OL}" stroke-width="0.8"/>`;
  b += fileIcon(tdx - 3.5, ty + s + 9, 11, OL);
  b += lbl(tdx + 9, ty + s + 16.5, 'NEW FILE', { size: 3.8, op: 1, fill: OL });

  // per-batch chart
  const cx = 10, cy = 140, cw = 180;
  b += `<line x1="${cx}" y1="94" x2="${cx + cw}" y2="94" stroke="#fff" stroke-opacity="0.1" stroke-width="0.8"/>`;
  b += lbl(cx, 103, 'PER BATCH, AS DAYS PILE UP', { size: 4.2, op: 0.7 });
  const n = 10, bw = 7, gap = cw / n;
  for (let i = 0; i < n; i++) {
    const x = cx + i * gap + 2;
    const listH = all ? 4 + i * 2.8 : 5;
    b += `<rect x="${x}" y="${cy - listH}" width="${bw}" height="${listH}" rx="0.8" fill="#fff" fill-opacity="${all ? 0.55 : 0.3}"/>`;
    b += `<rect x="${x + bw + 1}" y="${cy - 5}" width="${bw}" height="5" rx="0.8" fill="${O}"/>`;
  }
  b += `<line x1="${cx}" y1="${cy}" x2="${cx + cw}" y2="${cy}" stroke="#fff" stroke-opacity="0.35" stroke-width="0.8"/>`;
  b += `<rect x="${cx}" y="${cy + 5}" width="4" height="4" rx="0.8" fill="#fff" fill-opacity="0.55"/>`;
  b += lbl(cx + 6, cy + 8.6, all ? 'LISTING WORK' : 'LISTING WORK, FLAT', { size: 3.6, op: 0.7 });
  b += `<rect x="${cx + (all ? 52 : 72)}" y="${cy + 5}" width="4" height="4" rx="0.8" fill="${O}"/>`;
  b += lbl(cx + (all ? 58 : 78), cy + 8.6, 'NEW FILES', { size: 3.6, op: 0.9, fill: OL });
  b += lbl(cx + cw, cy + 8.6, 'ILLUSTRATIVE', { anchor: 'end', size: 3.4, op: 0.38 });
  return svg(200, 152, b, 856);
}

// ── 4. CPU-BOUND JSON ────────────────────────────────────────────
// A chain of transform blocks (the same Spark code) feeding a CPU core. Turbo
// sits underneath the code, so the arrows run down into the chip.
function cpuChip(cx, cy, r) {
  let b = '';
  const pins = [-0.33, -0.11, 0.11, 0.33];
  pins.forEach(t => {
    const o = t * r * 2;
    b += `<line x1="${cx + o}" y1="${cy - r - 6}" x2="${cx + o}" y2="${cy - r}" stroke="${OL}" stroke-width="1.4" stroke-linecap="round"/>`;
    b += `<line x1="${cx + o}" y1="${cy + r}" x2="${cx + o}" y2="${cy + r + 6}" stroke="${OL}" stroke-width="1.4" stroke-linecap="round"/>`;
    b += `<line x1="${cx - r - 6}" y1="${cy + o}" x2="${cx - r}" y2="${cy + o}" stroke="${OL}" stroke-width="1.4" stroke-linecap="round"/>`;
    b += `<line x1="${cx + r}" y1="${cy + o}" x2="${cx + r + 6}" y2="${cy + o}" stroke="${OL}" stroke-width="1.4" stroke-linecap="round"/>`;
  });
  b += `<rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" rx="6" fill="${O}" fill-opacity="0.16" stroke="${O}" stroke-width="2"/>`;
  return b;
}
function drawTransformToCore() {
  const ops = ['from_json', 'explode', 'withColumn', 'filter', 'select'];
  const x0 = 6, bw = 34, gap = 3.5, y = 20, h = 15;
  let b = '';
  b += lbl(x0, 10, 'SAME SPARK CODE, PER FILE', { size: 4.4, op: 0.65 });
  ops.forEach((o, i) => {
    const x = x0 + i * (bw + gap);
    b += `<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="2.5" fill="#fff" fill-opacity="${i === 0 ? 0.14 : 0.08}" stroke="${i === 0 ? OL : '#fff'}" stroke-opacity="${i === 0 ? 1 : 0.4}" stroke-width="0.9"/>`;
    b += txt(x + bw / 2, y + 9.6, o, { anchor: 'middle', size: 4.6, op: 0.95, family: 'JetBrains Mono, monospace', weight: 600, fill: i === 0 ? OL : '#fff' });
    if (i < ops.length - 1) b += `<path d="M${x + bw + 0.4},${y + h / 2} l${gap - 0.8},0" stroke="#fff" stroke-opacity="0.5" stroke-width="0.8"/>`;
    // feed down into the core
    const fx = x + bw / 2, cx = 100, cyTop = 66;
    b += `<path d="M${fx},${y + h + 1} C${fx},${y + h + 18} ${cx + (fx - cx) * 0.25},${cyTop - 14} ${cx + (fx - cx) * 0.18},${cyTop - 1}" fill="none" stroke="${O}" stroke-opacity="0.85" stroke-width="1.3" stroke-dasharray="${i === 0 ? '0' : '2 1.6'}"/>`;
  });
  b += cpuChip(100, 90, 24);
  b += txt(100, 88, 'TURBO', { anchor: 'middle', size: 8.4, op: 1, family: 'Montserrat', weight: 800 });
  b += lbl(100, 96.5, 'C++ VECTORIZED', { anchor: 'middle', size: 3.6, op: 0.85, fill: OL });
  // side notes
  b += lbl(8, 80, 'JSON IN', { size: 4, op: 0.7 });
  [0, 1, 2].forEach(k => { b += fileIcon(8 + k * 11, 85, 10, '#fff'); });
  b += `<path d="M44,90 L68,90" stroke="#fff" stroke-opacity="0.45" stroke-width="0.9" stroke-dasharray="1.5 1.5"/>`;
  b += lbl(192, 80, 'CORES BUSY', { anchor: 'end', size: 4, op: 0.7 });
  [0, 1, 2, 3].forEach(k => {
    b += `<rect x="${150 + k * 11}" y="85" width="9" height="12" rx="1.5" fill="${O}" fill-opacity="${0.55 + k * 0.1}"/>`;
  });
  b += `<path d="M132,90 L146,90" stroke="#fff" stroke-opacity="0.45" stroke-width="0.9" stroke-dasharray="1.5 1.5"/>`;
  b += lbl(100, 126, 'CPU-BOUND WORK MOVES INTO THE ENGINE, THE CODE STAYS', { anchor: 'middle', size: 3.9, op: 0.55 });
  return svg(200, 130, b, 856);
}

// ── 5. CLOSER ────────────────────────────────────────────────────
// Three short points with iconsax-style outline icons, then the CTA.
const ICONS = {
  code: '<rect x="2" y="2" width="20" height="20" rx="6"/><path d="M8 10l-2 2 2 2M16 10l2 2-2 2M13.2 9l-2.4 6"/>',
  wallet: '<path d="M22 11.5V9c0-2.6-1.6-4-4-4H6C3.6 5 2 6.4 2 9v6c0 2.6 1.6 4 4 4h12c2.4 0 4-1.4 4-4v-.5"/><path d="M22 11.5h-3.5a1.75 1.75 0 0 0 0 3.5H22z"/><path d="M6 9.5h5"/>',
  timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4.2l2.6 1.6M9.5 2.5h5"/>',
};
const icon = (k) => `<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="${OL}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex:none;display:block;">${ICONS[k]}</svg>`;
const point = (k, t) => `<div style="display:flex;align-items:center;gap:24px;padding:22px 26px;border-radius:20px;background:linear-gradient(160deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015));border:1px solid ${C.rule};">
  ${icon(k)}<div style="font-size:29px;line-height:1.35;color:#fff;font-weight:500;text-wrap:balance;">${t}</div></div>`;

const qr = BLOG_URL ? await makeQr(BLOG_URL, 150) : '';
const CTA = 'Talk to Yeedu';
const contact = `<div style="display:flex;flex-direction:column;gap:6px;font-size:22px;color:${C.text2};font-weight:500;text-align:right;">
  <span>sales@yeedu.com</span><span>yeedu.com</span></div>`;
const cta = BLOG_URL
  ? `<div style="display:flex;align-items:center;justify-content:space-between;gap:32px;margin-top:30px;">
       <div>
         ${ctaPill(CTA)}
         <div style="margin-top:16px;font-size:21px;color:${C.text2};font-weight:500;">sales@yeedu.com · yeedu.com</div>
       </div>
       <div style="text-align:center;">
         ${qr}
         <div style="margin-top:8px;font-size:13px;color:${C.text3};letter-spacing:0.6px;">READ THE POST</div>
       </div>
     </div>`
  : `<div style="display:flex;align-items:center;justify-content:space-between;gap:28px;margin-top:36px;padding-top:30px;border-top:1px solid ${C.rule};">
       ${ctaPill(CTA)}
       ${contact}
     </div>`;

const slides = [
  {
    notes: 'Cover: an Auto Loader micro-batch as four segments (discover files, parse JSON, transform, write to Delta). Discover and parse in orange as the slow part; faint repeated batches show every trigger repeats it. Widths illustrative, no figures',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Auto Loader')}
      ${headline(`Faster Auto Loader ${em2('where streaming ingestion spends its time')}`, 56)}
      ${well(drawBatchTimeline(), { card: false })}
      ${caption(`Each micro-batch finds new files, parses them, transforms them and writes to Delta. On deep landing zones, finding the files and parsing the JSON take most of the batch.`)}
    `, 'A'),
  },
  {
    notes: 'Discovery: generic Auto Loader behaviour. In directory listing mode each micro-batch lists the input path; on a YYYY/MM/DD layout a recursive listing walks every past day. Tree of landing/2026/07..10 day folders, all outlined as listed, one new file in 10/14; per-batch chart with listing work growing while new files stay flat (illustrative)',
    html: stage(`
      ${eyebrow('File discovery')}
      ${headline(`Listing grows with history ${em2('not with new files')}`, 50)}
      ${well(drawLandingTree('all'))}
      ${caption(`In directory listing mode, every micro-batch lists the input path. On a <span style="font-family:'JetBrains Mono',monospace;color:#fff;">YYYY/MM/DD</span> layout, a recursive listing walks every past day, so LIST requests and listing time keep growing while the new files stay few.`)}
    `, 'B'),
  },
  {
    notes: 'Scope the scan: Yeedu claim (c) and (d). Yeedu Auto Loader can scan just the current day folder on a YYYY/MM/DD landing zone instead of the whole tree; tuned for deep folders and file-split distribution. Same tree with history dimmed, only 10/14 listed, tomorrow dashed for rollover; listing work now flat. Note on rollover and late files. No figures',
    html: stage(`
      ${eyebrow('Scope the scan')}
      ${headline(`Scan today ${em2('skip the history')}`, 56)}
      ${well(drawLandingTree('today'))}
      ${caption(`When the source writes under <span style="font-family:'JetBrains Mono',monospace;color:#fff;">YYYY/MM/DD</span>, Yeedu's Auto Loader can scan just the current day's folder, so discovery time tracks the new files. It is tuned for deep folders and file-split distribution.`)}
      <div style="margin-top:14px;font-size:18px;line-height:1.45;color:${C.text3};">Plan for day rollover and for late files that land in yesterday's folder.</div>
    `, 'C'),
  },
  {
    notes: 'CPU-bound JSON: Yeedu claim (b) and (c). Parsing JSON and long transform chains keep cores busy; Turbo, the C++ vectorized engine, runs that work under the same Spark code. Transform blocks feed a CPU core marked TURBO. Scoped scan named as the bigger effect. No figures',
    html: stage(`
      ${eyebrow('CPU-bound JSON')}
      ${headline(`JSON parsing is CPU work ${em2('Turbo takes it on')}`, 50)}
      ${well(drawTransformToCore(), { pad: 28 })}
      ${caption(`Parsing JSON and running long transformation chains per file keeps the cores busy. Turbo, Yeedu's C++ vectorized engine, runs that CPU-bound work underneath the same Spark code. On dated landing zones, the scoped scan still does more.`)}
    `, 'D'),
  },
  {
    notes: 'Closer: Yeedu claims (a), (e), (f). Existing cloudFiles code runs as is; flat annual licence so more parallel streams add cloud cost only, no per-DBU fee; adopt stream by stream, starting with the ones missing SLA. Iconsax outline icons; CTA pill Talk to Yeedu + sales@yeedu.com + yeedu.com, no QR (no blog URL)',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Yeedu')}
      ${headline(`Same cloudFiles code ${em2('faster batches')}`, 56)}
      <div style="flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:20px;margin-top:30px;">
        ${point('code', `Existing Auto Loader <span style="font-family:'JetBrains Mono',monospace;color:${OL};">cloudFiles</span> code runs as is.`)}
        ${point('wallet', 'A flat annual licence, so more parallel streams add cloud cost only, with no per-DBU fee.')}
        ${point('timer', 'Move job by job, starting with streams that miss their SLA.')}
      </div>
      ${cta}
    `, 'C'),
  },
];

const NAME = 'Faster Auto Loader: How Yeedu Turbo Speeds Up Streaming File Ingestion';

if (OLD_ID) await deleteCarousel(OLD_ID);
const id = await buildCarousel(NAME, slides);
if (!process.env.SKIP_EXPORT) await exportDeck(id, NAME);
