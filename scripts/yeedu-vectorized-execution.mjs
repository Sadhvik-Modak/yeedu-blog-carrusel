// ════════════════════════════════════════════════════════════════
// Vectorized Execution in Apache Spark: What It Is and Why It Matters
//
// 5 slides, 4:5. One bespoke drawing per slide, chrome from ./yeedu-chrome.mjs.
// Generic Spark behaviour carries no Yeedu figures; the Amdahl numbers are the
// article's illustrative example and are labelled that way. Yeedu figures come
// from the facts pack only: Turbo's 4-10x (vendor claim, CPU-bound work) and
// Smart Scheduling's 2-4x (ingestion, ELT, streaming). Multi-threading,
// multiplexing and the Parquet disk cache carry no figure. Yeedu is never
// framed as helping CPU-bound work only.
// ════════════════════════════════════════════════════════════════
import {
  C, stage, logoMark, eyebrow, headline, caption, well, svg,
  makeQr, ctaPill, buildCarousel, deleteCarousel, exportDeck,
} from './yeedu-chrome.mjs';

const BLOG_URL = process.env.BLOG_URL || null; // empty for now, so no QR
const OLD_ID = process.env.OLD_ID || '';

const O = C.orange, OL = C.orangeLight;
const MONO = 'JetBrains Mono, monospace';

const em2 = (t) => `<span style="display:block;font-weight:300;font-style:italic;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;padding-right:0.14em;-webkit-box-decoration-break:clone;box-decoration-break:clone;">${t}</span>`;

const lbl = (x, y, t, { anchor = 'start', fill = '#fff', op = 0.42, size = 6.2 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter" font-size="${size}" font-weight="600" letter-spacing="0.9" fill="${fill}" opacity="${op}">${t}</text>`;
const txt = (x, y, t, { anchor = 'start', fill = '#fff', op = 0.75, size = 5.2, weight = 500, family = 'Inter' } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" opacity="${op}">${t}</text>`;

// ── 1. COVER ─────────────────────────────────────────────────────
// Left: row at a time, each row walks the operator chain with a next() call.
// Right: one column batch, a SIMD instruction across many lanes at once.
function drawRowVsBatch() {
  let b = '';
  // left panel
  const lx = 8;
  b += lbl(lx, 10, 'ROW AT A TIME', { size: 4.4, op: 0.7 });
  const ops = ['SCAN', 'FILTER', 'PROJECT'];
  ops.forEach((o, i) => {
    const y = 18 + i * 24;
    b += `<rect x="${lx}" y="${y}" width="40" height="13" rx="2.5" fill="#fff" fill-opacity="0.07" stroke="#fff" stroke-opacity="0.35" stroke-width="0.7"/>`;
    b += txt(lx + 20, y + 8.4, o, { anchor: 'middle', size: 4.2, op: 0.8, weight: 700 });
    if (i < 2) {
      b += `<path d="M${lx + 20},${y + 13.5} L${lx + 20},${y + 23.5}" stroke="#fff" stroke-opacity="0.4" stroke-width="0.7"/>`;
      b += txt(lx + 23, y + 20.2, 'next()', { size: 3.6, op: 0.55, family: MONO, weight: 600 });
    }
  });
  // single rows trickling down
  for (let k = 0; k < 5; k++) {
    b += `<rect x="${lx + 52}" y="${20 + k * 13}" width="22" height="4.5" rx="1" fill="#fff" fill-opacity="${0.5 - k * 0.08}"/>`;
  }
  b += lbl(lx, 92, 'ONE ROW PER CALL', { size: 3.6, op: 0.5 });

  // divider
  b += `<line x1="96" y1="8" x2="96" y2="98" stroke="#fff" stroke-opacity="0.1" stroke-width="0.8"/>`;

  // right panel: column batch + SIMD lanes
  const rx = 106;
  b += lbl(rx, 10, 'VECTORIZED BATCH', { size: 4.4, op: 1, fill: OL });
  const cols = 4, rows = 10, cw = 9, ch = 4.2;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      b += `<rect x="${rx + c * (cw + 2)}" y="${18 + r * (ch + 1)}" width="${cw}" height="${ch}" rx="0.8" fill="${c === 1 ? O : '#fff'}" fill-opacity="${c === 1 ? 0.95 : 0.16}"/>`;
    }
  }
  b += lbl(rx, 74, 'A COLUMN, THOUSANDS OF VALUES', { size: 3.4, op: 0.55 });
  // SIMD instruction hitting the orange column
  const sx = rx + 52;
  b += `<rect x="${sx}" y="30" width="32" height="13" rx="2.5" fill="${O}" fill-opacity="0.18" stroke="${O}" stroke-width="1"/>`;
  b += txt(sx + 16, 38.6, 'SIMD', { anchor: 'middle', size: 5, op: 1, family: 'Montserrat', weight: 800 });
  for (let r = 0; r < rows; r += 1) {
    const ty = 18 + r * (ch + 1) + ch / 2;
    b += `<path d="M${sx},36.5 L${rx + cw + 2 + cw + 1},${ty}" stroke="${OL}" stroke-opacity="0.35" stroke-width="0.5"/>`;
  }
  b += lbl(sx + 16, 52, 'ONE INSTRUCTION', { anchor: 'middle', size: 3.6, op: 0.85, fill: OL });
  b += lbl(sx + 16, 58, 'MANY VALUES', { anchor: 'middle', size: 3.6, op: 0.85, fill: OL });
  b += lbl(rx, 92, 'CACHE-FRIENDLY, PREDICTABLE', { size: 3.4, op: 0.5 });
  return svg(200, 104, b, 856);
}

// ── 2. THE PLAN ──────────────────────────────────────────────────
// A physical plan read top to bottom: a batched scan, then a ColumnarToRow
// boundary, then row operators. The columnar part is orange, the row part grey.
function drawPlan() {
  const nodes = [
    { t: 'FileScan parquet', s: 'Batched: true', col: true },
    { t: 'Filter', s: 'columnar', col: true },
    { t: 'ColumnarToRow', s: 'back to rows', edge: true },
    { t: 'BatchEvalPython', s: 'row-based UDF', col: false },
    { t: 'HashAggregate', s: 'row at a time', col: false },
  ];
  let b = '';
  b += lbl(10, 9, "df.explain('formatted'), READ BOTTOM UP", { size: 4, op: 0.6 });
  const x = 40, w = 120, h = 15, gap = 7;
  // draw from the scan (bottom) upwards
  nodes.forEach((n, i) => {
    const y = 120 - i * (h + gap);
    const stroke = n.edge ? OL : n.col ? O : '#fff';
    const fill = n.edge ? OL : n.col ? O : '#fff';
    b += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${fill}" fill-opacity="${n.col ? 0.18 : n.edge ? 0.12 : 0.06}" stroke="${stroke}" stroke-opacity="${n.col || n.edge ? 1 : 0.35}" stroke-width="${n.edge ? 1.3 : 0.8}" ${n.edge ? 'stroke-dasharray="2.4 1.6"' : ''}/>`;
    b += txt(x + 7, y + 9.6, n.t, { size: 5, op: 0.95, family: MONO, weight: 700, fill: n.edge ? OL : '#fff' });
    b += txt(x + w - 7, y + 9.6, n.s, { anchor: 'end', size: 3.9, op: n.col || n.edge ? 0.9 : 0.5, fill: n.col ? OL : '#fff' });
    if (i < nodes.length - 1) b += `<path d="M${x + w / 2},${y - 0.5} L${x + w / 2},${y - gap + 0.5}" stroke="#fff" stroke-opacity="0.45" stroke-width="0.8"/>`;
  });
  // side brackets
  const yTop = 120 - 1 * (h + gap), yBot = 120 + h;
  b += `<path d="M${x - 5},${yTop} L${x - 9},${yTop} L${x - 9},${yBot} L${x - 5},${yBot}" fill="none" stroke="${O}" stroke-width="1"/>`;
  b += `<text transform="translate(${x - 13},${(yTop + yBot) / 2}) rotate(-90)" text-anchor="middle" font-family="Inter" font-size="3.8" font-weight="700" letter-spacing="0.8" fill="${OL}">VECTORIZED</text>`;
  const rTop = 120 - 4 * (h + gap), rBot = 120 - 3 * (h + gap) + h;
  b += `<path d="M${x + w + 5},${rTop} L${x + w + 9},${rTop} L${x + w + 9},${rBot} L${x + w + 5},${rBot}" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="1"/>`;
  b += `<text transform="translate(${x + w + 14},${(rTop + rBot) / 2}) rotate(90)" text-anchor="middle" font-family="Inter" font-size="3.8" font-weight="700" letter-spacing="0.8" fill="#fff" opacity="0.55">ROW PATH</text>`;
  return svg(200, 142, b, 856);
}

// ── 3. AMDAHL ────────────────────────────────────────────────────
// The article's illustrative 100-minute job: 35 CPU-bound, 65 shuffle and I/O.
// Vectorizing only the CPU share at 5x gives 72 minutes; at 10x, 68.5.
function drawAmdahl() {
  const x0 = 10, W = 180, y1 = 26, y2 = 66, y3 = 100, h = 18;
  const k = W / 100;
  let b = '';
  b += lbl(x0, 10, 'ILLUSTRATIVE 100-MINUTE JOB', { size: 4.4, op: 0.65 });
  const bar = (y, cpu, rest, title, total) => {
    let s = lbl(x0, y - 4, title, { size: 3.9, op: 0.7 });
    s += `<rect x="${x0}" y="${y}" width="${cpu * k - 0.8}" height="${h}" rx="2" fill="${O}"/>`;
    s += `<rect x="${x0 + cpu * k}" y="${y}" width="${rest * k}" height="${h}" rx="2" fill="#fff" fill-opacity="0.2"/>`;
    s += txt(x0 + cpu * k + rest * k + 3, y + 11.4, total, { size: 5.4, op: 1, family: 'Montserrat', weight: 800 });
    return s;
  };
  b += bar(y1, 35, 65, 'BEFORE', '100');
  b += txt(x0 + 3, y1 + 11.2, 'CPU 35', { size: 4.2, op: 1, weight: 700 });
  b += txt(x0 + 35 * k + 3, y1 + 11.2, 'SHUFFLE + I/O WAIT 65', { size: 4.2, op: 0.85, weight: 700 });
  b += bar(y2, 7, 65, 'CPU SHARE 5x FASTER', '72');
  b += bar(y3, 3.5, 65, 'CPU SHARE 10x FASTER', '68.5');
  // the untouched block, bracketed
  const bx = x0 + 7 * k;
  b += `<path d="M${bx},${y3 + h + 4} L${bx},${y3 + h + 8} L${x0 + 72 * k - 1},${y3 + h + 8} L${x0 + 72 * k - 1},${y3 + h + 4}" fill="none" stroke="${OL}" stroke-width="1"/>`;
  b += lbl(bx + (65 * k) / 2, y3 + h + 15, 'UNTOUCHED BY VECTORIZATION', { anchor: 'middle', size: 3.9, op: 1, fill: OL });
  b += lbl(x0 + W, 10, 'MINUTES, ILLUSTRATIVE', { anchor: 'end', size: 3.4, op: 0.38 });
  return svg(200, 138, b, 856);
}

// ── 4. YEEDU, BOTH SIDES OF THE JOB ──────────────────────────────
// The same job bar split in two. The CPU share drops into Turbo. The shuffle
// and I/O share fans out into four mechanisms. Only facts-pack figures appear.
function drawBothSides() {
  const x0 = 10, W = 180, y = 14, h = 14, k = W / 100;
  let b = '';
  b += `<rect x="${x0}" y="${y}" width="${35 * k - 0.8}" height="${h}" rx="2" fill="${O}"/>`;
  b += `<rect x="${x0 + 35 * k}" y="${y}" width="${65 * k}" height="${h}" rx="2" fill="#fff" fill-opacity="0.2"/>`;
  b += txt(x0 + 3, y + 9, 'CPU-BOUND SHARE', { size: 4, op: 1, weight: 700 });
  b += txt(x0 + 35 * k + 3, y + 9, 'SHUFFLE AND I/O WAIT', { size: 4, op: 0.9, weight: 700 });

  // left: Turbo card
  const tx = x0, ty = 46, tw = 58, th = 72;
  b += `<path d="M${x0 + 17.5 * k},${y + h + 1} L${x0 + 17.5 * k},${ty - 1}" stroke="${O}" stroke-width="1.2"/>`;
  b += `<rect x="${tx}" y="${ty}" width="${tw}" height="${th}" rx="4" fill="${O}" fill-opacity="0.16" stroke="${O}" stroke-width="1.2"/>`;
  b += txt(tx + tw / 2, ty + 15, 'TURBO', { anchor: 'middle', size: 8, op: 1, family: 'Montserrat', weight: 800 });
  b += lbl(tx + tw / 2, ty + 23, 'C++ VECTORIZED', { anchor: 'middle', size: 3.4, op: 0.9, fill: OL });
  b += txt(tx + tw / 2, ty + 44, '4-10x', { anchor: 'middle', size: 13, op: 1, family: 'Montserrat', weight: 800, fill: OL });
  b += lbl(tx + tw / 2, ty + 54, 'ON CPU-BOUND WORK', { anchor: 'middle', size: 3.5, op: 0.85 });
  b += lbl(tx + tw / 2, ty + 63, 'VENDOR CLAIM', { anchor: 'middle', size: 3.1, op: 0.45 });

  // right: four mechanisms
  const mx = x0 + 66, mw = W - 66, mh = 15, mg = 4;
  const mech = [
    ['Multi-threaded execution', 'every core busy in parallel'],
    ['Smart Scheduling', '2-4x on ingestion, ELT, streaming'],
    ['spark-submit multiplexing', 'jobs share one cache'],
    ['Turbo Parquet disk cache', 'repeat reads from local disk'],
  ];
  const fx = x0 + 67.5 * k;
  b += `<path d="M${fx},${y + h + 1} L${fx},${ty - 6} L${mx + 6},${ty - 6} L${mx + 6},${ty}" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="0.9"/>`;
  mech.forEach(([t, s], i) => {
    const yy = ty + i * (mh + mg);
    b += `<rect x="${mx}" y="${yy}" width="${mw}" height="${mh}" rx="3" fill="#fff" fill-opacity="0.07" stroke="#fff" stroke-opacity="0.3" stroke-width="0.7"/>`;
    b += `<rect x="${mx}" y="${yy}" width="2.4" height="${mh}" rx="1" fill="${OL}"/>`;
    b += txt(mx + 6, yy + 6.6, t, { size: 4.6, op: 1, weight: 700 });
    b += txt(mx + 6, yy + 12, s, { size: 3.8, op: 0.65, fill: i === 1 ? OL : '#fff' });
  });
  b += lbl(x0 + W, 136, 'SHARES ILLUSTRATIVE', { anchor: 'end', size: 3.2, op: 0.38 });
  return svg(200, 140, b, 856);
}

// ── 5. CLOSER ────────────────────────────────────────────────────
const ICONS = {
  code: '<rect x="2" y="2" width="20" height="20" rx="6"/><path d="M8 10l-2 2 2 2M16 10l2 2-2 2M13.2 9l-2.4 6"/>',
  wallet: '<path d="M22 11.5V9c0-2.6-1.6-4-4-4H6C3.6 5 2 6.4 2 9v6c0 2.6 1.6 4 4 4h12c2.4 0 4-1.4 4-4v-.5"/><path d="M22 11.5h-3.5a1.75 1.75 0 0 0 0 3.5H22z"/><path d="M6 9.5h5"/>',
  cloud: '<path d="M7 18.5h10.5a4.5 4.5 0 0 0 .6-8.96A6 6 0 0 0 6.6 10.2 4.2 4.2 0 0 0 7 18.5z"/>',
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

const code = (t) => `<span style="font-family:'JetBrains Mono',monospace;color:#fff;">${t}</span>`;

const slides = [
  {
    notes: 'Cover: row-at-a-time Volcano model (scan, filter, project with next() per row) against a vectorized column batch hit by one SIMD instruction. No figures',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Apache Spark')}
      ${headline(`Vectorized execution ${em2('batches of columns through the CPU')}`, 56)}
      ${well(drawRowVsBatch(), { card: false })}
      ${caption(`Row at a time, every operator calls ${code('next()')} once per row. Vectorized, each operator runs one tight loop over a batch of column values, so the CPU cache, SIMD and branch prediction finally do their jobs.`)}
    `, 'A'),
  },
  {
    notes: 'The plan: Spark already vectorizes the Parquet/ORC scan (Batched: true) but a ColumnarToRow boundary hands later operators rows again, often before a row-based Python UDF. Read with explain(formatted). No figures',
    html: stage(`
      ${eyebrow('Read the plan')}
      ${headline(`Spark vectorizes the scan ${em2('then converts back to rows')}`, 50)}
      ${well(drawPlan())}
      ${caption(`Look for ${code('Batched: true')} on the scan and find where ${code('ColumnarToRow')} sits. Everything above that boundary, including row-based Python UDFs, runs one row at a time.`)}
    `, 'B'),
  },
  {
    notes: "Amdahl: the article's illustrative 100-minute job, 35 CPU-bound and 65 shuffle/I-O. Vectorizing the CPU share at 5x gives 72 minutes, at 10x 68.5. All numbers labelled illustrative. Point: measure CPU time vs wall-clock first",
    html: stage(`
      ${eyebrow("Amdahl's law")}
      ${headline(`Vectorizing alone ${em2('is capped by the CPU share')}`, 54)}
      ${well(drawAmdahl())}
      ${caption(`Vectorization speeds up joins, aggregations and scans that keep the CPU busy. Shuffle fetch waits and object storage reads stay as they were, so check CPU time against wall-clock time in the Spark UI first.`)}
    `, 'C'),
  },
  {
    notes: 'Yeedu: Turbo (C++ vectorized, SIMD) on the CPU-bound share with the 4-10x vendor claim scoped to CPU-bound work; the shuffle and I/O share gets multi-threaded execution on every core, Smart Scheduling (2-4x on ingestion, ELT, streaming), spark-submit multiplexing with a shared cache, and the Turbo Parquet disk cache. Never framed as CPU-only',
    html: stage(`
      ${eyebrow('Yeedu Turbo')}
      ${headline(`Turbo vectorizes the CPU share ${em2('and the rest gets faster too')}`, 48)}
      ${well(drawBothSides(), { pad: 26 })}
      ${caption(`Yeedu claims 4-10x faster execution on CPU-bound work from Turbo. Multi-threading, Smart Scheduling, multiplexing and caching go after the shuffle and I/O wait, so a Yeedu job's gain isn't capped by its CPU-bound share.`)}
    `, 'D'),
  },
  {
    notes: 'Closer: existing Spark code runs with zero code changes; annual licence instead of DBU or instance-hour billing, 60-80% lower compute cost is a Yeedu claim; runs in your own cloud account or on-prem, job by job. CTA pill + sales@yeedu.com + yeedu.com, no QR (no blog URL)',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Yeedu')}
      ${headline(`Same Spark code ${em2('vectorized underneath')}`, 56)}
      <div style="flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:20px;margin-top:30px;">
        ${point('code', 'Existing Spark jobs run on Turbo with zero code changes.')}
        ${point('wallet', 'An annual licence, and Yeedu reports 60-80% lower compute cost.')}
        ${point('cloud', 'Runs in your own cloud account or on-prem, adopted job by job.')}
      </div>
      ${cta}
    `, 'C'),
  },
];

const NAME = 'Vectorized Execution in Apache Spark: What It Is and Why It Matters';

if (OLD_ID) await deleteCarousel(OLD_ID);
const id = await buildCarousel(NAME, slides);
if (!process.env.SKIP_EXPORT) await exportDeck(id, NAME);
