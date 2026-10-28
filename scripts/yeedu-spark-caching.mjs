// ════════════════════════════════════════════════════════════════
// Spark Caching vs Recomputing: Which Is More Cost-Effective?
// Source: n8n-workflows-v2/output/strategy/2026-10-12-spark-caching-vs-recomputing-which-is-more-cost-effective
//
// 5 slides, 4:5. One bespoke drawing per slide, no shared renderer map.
// Chrome only comes from ./yeedu-chrome.mjs. Topic facts are the blog's
// cited sources (Spark RDD guide, Spark tuning guide, Databricks KB); the
// cost model numbers are the blog's own illustrative ones and are labelled
// so. The Yeedu closer carries no Yeedu figure at all.
// ════════════════════════════════════════════════════════════════
import {
  C, stage, logoMark, eyebrow, headline, em, caption, well, svg,
  makeQr, ctaPill, buildCarousel, deleteCarousel, exportDeck,
} from './yeedu-chrome.mjs';

const BLOG_URL = null; // not published yet — set the live URL and re-run to add the QR
const OLD_ID = process.env.OLD_ID || '9a2b78f9-8f5f-419f-8792-d9ed17732772';

const O = C.orange, OL = C.orangeLight;

const lbl = (x, y, t, { anchor = 'start', fill = '#fff', op = 0.42, size = 6.2 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter" font-size="${size}" font-weight="600" letter-spacing="0.9" fill="${fill}" opacity="${op}">${t}</text>`;
const code = (x, y, t, { anchor = 'middle', fill = '#fff', op = 0.7, size = 5.2 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter" font-size="${size}" font-weight="500" fill="${fill}" opacity="${op}">${t}</text>`;
const num = (x, y, t, { anchor = 'start', fill = '#fff', op = 1, size = 14, weight = 800 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Montserrat" font-size="${size}" font-weight="${weight}" letter-spacing="-0.4" fill="${fill}" opacity="${op}">${t}</text>`;

// ── 1. COVER ─────────────────────────────────────────────────────
// Claim: with nothing cached, every action walks the lineage again from the
// source read. Three actions are drawn as three identical chains, each fed by
// its own orange re-read of S3. The closer inverts this: three jobs, one read.
function drawLineageReruns() {
  const sx = 16, sy = 74, rows = [30, 74, 118];
  const acts = ['count()', 'join().show()', 'write.parquet()'];
  let b = '';
  // source cylinder
  b += `<g fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="2">
    <path d="M${sx - 9},${sy - 12} L${sx - 9},${sy + 12} A9 3.5 0 0 0 ${sx + 9},${sy + 12} L${sx + 9},${sy - 12}"/>
    <ellipse cx="${sx}" cy="${sy - 12}" rx="9" ry="3.5"/></g>`;
  b += lbl(sx, sy + 26, 'S3', { anchor: 'middle', size: 5, op: 0.55 });
  // the three re-reads, the point of the slide
  b += `<g fill="none" stroke="${O}" stroke-width="3">`;
  rows.forEach((y) => { b += `<path d="M${sx + 10},${sy} Q${sx + 18},${y} 40,${y}"/>`; });
  b += `</g>`;
  rows.forEach((y, i) => {
    const nodes = [['read', 40], ['filter', 72], ['join', 104]];
    b += lbl(40, y - 11, `PASS ${i + 1}`, { size: 4.6, op: 0.42 });
    b += `<g stroke="#fff" stroke-opacity="0.3" stroke-width="2">`;
    b += `<line x1="62" y1="${y}" x2="72" y2="${y}"/><line x1="94" y1="${y}" x2="104" y2="${y}"/><line x1="126" y1="${y}" x2="136" y2="${y}"/>`;
    b += `</g>`;
    nodes.forEach(([t, x]) => {
      b += `<rect x="${x}" y="${y - 7}" width="22" height="14" rx="2" fill="#14110d" stroke="#fff" stroke-opacity="0.45" stroke-width="2"/>`;
      b += code(x + 11, y + 2, t, { size: 5 });
    });
    b += `<rect x="136" y="${y - 7}" width="56" height="14" rx="7" fill="#fff" fill-opacity="0.08" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5"/>`;
    b += code(164, y + 2, acts[i], { size: 5.2, op: 0.85 });
  });
  b += num(100, 150, '3 actions, 3 full passes', { anchor: 'middle', size: 13, fill: OL });
  b += lbl(100, 160, 'SAME LINEAGE, RE-READ FROM SOURCE EACH TIME', { anchor: 'middle', size: 4.8 });
  return svg(200, 164, b, 856);
}

// ── 2. EVICTION FORK ─────────────────────────────────────────────
// Claim: when a cached block is evicted (or its executor is lost), the storage
// level decides the ending. Two structurally identical limbs: MEMORY_AND_DISK
// above (the block survives on local disk), MEMORY_ONLY below (the slot is a
// round-dotted ghost and the lineage re-runs in orange).
function drawEvictionFork() {
  const rx = 40, yU = 46, yL = 116, root = 81;
  let b = '<g transform="translate(0,-24)">';
  b += `<rect x="10" y="${root - 6}" width="14" height="12" rx="2" fill="#fff" fill-opacity="0.85"/>`;
  b += lbl(17, root + 18, 'EVICTED', { anchor: 'middle', size: 4.4, op: 0.55 });
  b += lbl(17, root + 25, 'OR NODE', { anchor: 'middle', size: 4.4, op: 0.55 });
  b += lbl(17, root + 32, 'LOST', { anchor: 'middle', size: 4.4, op: 0.55 });
  b += `<g stroke="#fff" stroke-opacity="0.3" stroke-width="2" fill="none">
    <line x1="24" y1="${root}" x2="${rx}" y2="${root}"/>
    <line x1="${rx}" y1="${yU}" x2="${rx}" y2="${yL}"/></g>`;
  const limb = (y, title, survives) => {
    let g = `<line x1="${rx}" y1="${y}" x2="58" y2="${y}" stroke="#fff" stroke-opacity="0.3" stroke-width="2"/>`;
    g += lbl(58, y - 14, title, { size: 4.8, op: 0.6 });
    g += survives
      ? `<rect x="58" y="${y - 9}" width="30" height="18" rx="2" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="2"/>
         <rect x="66" y="${y - 5}" width="14" height="10" rx="1.5" fill="#fff" fill-opacity="0.8"/>`
      : `<rect x="58" y="${y - 9}" width="30" height="18" rx="2" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="2" stroke-dasharray="1 5" stroke-linecap="round"/>`;
    g += `<path d="M90,${y} L98,${y}" stroke="#fff" stroke-opacity="0.35" stroke-width="1.5" stroke-dasharray="4 5"/>`;
    return g;
  };
  // upper limb: spills, survives
  b += limb(yU, 'DATAFRAME DEFAULT · MEMORY_AND_DISK', true);
  b += lbl(73, yU + 18, 'LOCAL DISK', { anchor: 'middle', size: 4.4, op: 0.42 });
  b += `<path d="M100,${yU} L110,${yU}" stroke="#fff" stroke-opacity="0.4" stroke-width="2"/>`;
  b += code(112, yU + 2, 'read back from disk', { anchor: 'start', size: 5.4, op: 0.75 });
  // lower limb: the block is gone, the lineage re-runs
  b += limb(yL, 'RDD CACHE() · MEMORY_ONLY', false);
  b += lbl(73, yL + 18, 'BLOCK GONE', { anchor: 'middle', size: 4.4, op: 0.42 });
  b += `<g stroke="${O}" stroke-width="3"><line x1="118" y1="${yL}" x2="126" y2="${yL}"/><line x1="144" y1="${yL}" x2="152" y2="${yL}"/></g>`;
  [['read', 100], ['filter', 126], ['join', 152]].forEach(([t, x]) => {
    b += `<rect x="${x}" y="${yL - 6}" width="18" height="12" rx="2" fill="${O}"/>`;
    b += code(x + 9, yL + 2, t, { size: 4.6, fill: '#14110d', op: 1 });
  });
  b += lbl(100, yL + 18, 'RECOMPUTED FROM LINEAGE', { size: 4.8, fill: OL, op: 1 });
  b += lbl(100, yL + 26, 'NO ERROR, NO WARNING', { size: 4.6, op: 0.5 });
  return svg(200, 122, b + '</g>', 856);
}

// ── 3. READ COUNTS ───────────────────────────────────────────────
// Claim: a cache only pays back through later reads. Every row carries the
// same materialization block; the ticks after it are reads of the cached copy,
// drawn at their count. Rows that pay sit high; rows that lose money sit low,
// and the single-use block is the one orange thing.
function drawReadCounts() {
  const bx = 10, bw = 16, t0 = 32, pitch = 4;
  let b = '';
  const row = (y, title, reads, { waste = false } = {}) => {
    let g = lbl(bx, y - 9, title, { size: 4.8, op: 0.6 });
    g += waste
      ? `<rect x="${bx}" y="${y - 5}" width="${bw}" height="10" rx="1.5" fill="${O}"/>`
      : `<rect x="${bx}" y="${y - 5}" width="${bw}" height="10" rx="1.5" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="2"/>`;
    g += `<g stroke="#fff" stroke-opacity="0.75" stroke-width="2">`;
    for (let i = 0; i < reads; i++) g += `<line x1="${t0 + i * pitch}" y1="${y - 5}" x2="${t0 + i * pitch}" y2="${y + 5}"/>`;
    g += `</g>`;
    return g;
  };
  b += row(18, 'DIMENSION TABLE · JOINED 40 TIMES A DAY', 40);
  b += row(46, 'ITERATIVE ML · ONE SCAN PER EPOCH', 24);
  b += row(74, 'HOT BI DATASET · ONE READ PER QUERY', 12);
  b += `<line x1="${bx}" y1="94" x2="190" y2="94" stroke="#fff" stroke-opacity="0.25" stroke-width="1.5" stroke-dasharray="4 5"/>`;
  b += row(116, 'SINGLE-USE DATAFRAME · NOTHING TO PAY BACK', 1, { waste: true });
  // cached before filter(): the whole table pinned to serve a narrow query
  const y5 = 144;
  b += lbl(bx, y5 - 9, 'CACHED BEFORE FILTER() · FULL TABLE PINNED', { size: 4.8, op: 0.6 });
  b += `<rect x="${bx}" y="${y5 - 5}" width="64" height="10" rx="1.5" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="2"/>`;
  b += `<rect x="${bx}" y="${y5 - 5}" width="12" height="10" rx="1.5" fill="#fff" fill-opacity="0.75"/>`;
  b += `<line x1="80" y1="${y5 - 5}" x2="80" y2="${y5 + 5}" stroke="#fff" stroke-opacity="0.75" stroke-width="2"/>`;
  b += lbl(86, y5 + 2, 'FILLED = ROWS THE QUERY NEEDED', { size: 4.4, op: 0.42 });
  b += lbl(bx, 166, 'BLOCK = ONE CACHE BUILD · TICK = ONE READ OF IT', { size: 4.4, op: 0.42 });
  return svg(200, 170, b, 856);
}

// ── 4. BREAK-EVEN ────────────────────────────────────────────────
// Claim: recompute cost grows with every reuse, the cache cost is paid once.
// Two lines from a shared origin on the blog's illustrative numbers: a pass is
// 0.2 compute-hours at $4/hr = $0.80; the cache is one $0.80 materialization
// plus a $0.50 memory premium (one hour at the blog's $0.50/hr). They cross
// at ~1.6 reuses; at 3 reuses recompute is $2.40.
function drawBreakEven() {
  const ox = 24, oy = 128, kx = 32, ky = 26;
  const X = (n) => ox + n * kx, Y = (v) => oy - v * ky;
  let b = '';
  b += `<g stroke="#fff" stroke-opacity="0.3" stroke-width="1.5">
    <line x1="${ox}" y1="${oy}" x2="${X(5) + 4}" y2="${oy}"/><line x1="${ox}" y1="${oy}" x2="${ox}" y2="${Y(4.2)}"/></g>`;
  for (let n = 1; n <= 5; n++) {
    b += `<line x1="${X(n)}" y1="${oy}" x2="${X(n)}" y2="${oy + 3}" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5"/>`;
    b += code(X(n), oy + 10, String(n), { size: 5.2, op: 0.55 });
  }
  b += code(ox - 4, oy + 2, '$0', { anchor: 'end', size: 5, op: 0.42 });
  // recompute: $0.80 per reuse
  b += `<line x1="${ox}" y1="${oy}" x2="${X(5)}" y2="${Y(4)}" stroke="#fff" stroke-opacity="0.8" stroke-width="3"/>`;
  b += `<g fill="#fff">`;
  for (let n = 1; n <= 5; n++) b += `<circle cx="${X(n)}" cy="${Y(0.8 * n)}" r="2.2"/>`;
  b += `</g>`;
  // cache: $0.80 + $0.50 once, then flat
  b += `<path d="M${ox},${oy} L${X(1)},${Y(1.3)} L${X(5)},${Y(1.3)}" fill="none" stroke="${O}" stroke-width="3"/>`;
  // break-even
  const be = 1.3 / 0.8;
  b += `<line x1="${X(be)}" y1="${Y(1.3)}" x2="${X(be)}" y2="${oy}" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="4 5"/>`;
  b += `<circle cx="${X(be)}" cy="${Y(1.3)}" r="3" fill="#14110d" stroke="#fff" stroke-width="2"/>`;
  b += lbl(X(be) + 4, oy - 5, 'BREAK-EVEN', { size: 4.6, op: 0.6 });
  // annotations
  b += num(X(3) - 5, Y(2.4) - 3, '$2.40', { anchor: 'end', size: 12 });
  b += lbl(X(3) - 5, Y(2.4) - 16, '3 REUSES', { anchor: 'end', size: 4.4, op: 0.5 });
  b += lbl(X(5), Y(4) - 6, 'RECOMPUTE · $0.80 EVERY REUSE', { anchor: 'end', size: 4.8, op: 0.6 });
  b += num(X(5), Y(1.3) - 5, '$1.30', { anchor: 'end', size: 12, fill: OL });
  b += lbl(X(5), Y(1.3) + 10, 'CACHED · $0.80 ONCE + $0.50', { anchor: 'end', size: 4.6, op: 0.6 });
  b += lbl(X(5), Y(1.3) + 17, 'MEMORY PREMIUM', { anchor: 'end', size: 4.6, op: 0.6 });
  b += lbl(ox, oy + 20, 'REUSES OF THE SAME DATAFRAME', { size: 4.6, op: 0.5 });
  b += lbl(ox, oy + 28, 'ILLUSTRATIVE · 0.2 COMPUTE-HRS × $4/HR PER PASS', { size: 4.4, op: 0.42 });
  return svg(200, 160, b, 856);
}

// ── 5. CLOSER ────────────────────────────────────────────────────
// Bookend: the cover's three re-reads of S3 come back inverted. One VM holds a
// long-lived Spark session; three multiplexed jobs read the same cached blocks
// (orange), only job 1 ever touches object storage, and jobs 2 and 3's storage
// reads are round-dotted ghosts. No Yeedu figures.
function drawSharedSessionCache() {
  let b = '';
  b += `<rect x="10" y="6" width="180" height="14" rx="3" fill="none" stroke="#fff" stroke-opacity="0.4" stroke-width="2"/>`;
  b += lbl(16, 15.5, 'OBJECT STORAGE', { size: 4.8, op: 0.55 });
  b += `<rect x="10" y="36" width="180" height="78" rx="4" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="2.5"/>`;
  b += lbl(10, 124, 'YEEDU MODE · ONE VM · ONE SHARED SPARK SESSION', { size: 4.6, fill: OL, op: 1 });
  // cached blocks
  b += `<g fill="#fff" fill-opacity="0.8">`;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++)
    b += `<rect x="${20 + c * 12}" y="${58 + r * 10}" width="10" height="8" rx="1"/>`;
  b += `</g>`;
  b += lbl(37, 107, 'CACHED ONCE', { anchor: 'middle', size: 4.4, op: 0.55 });
  const jobs = [[80, 62], [116, 76], [152, 90]];
  // cache reads, the point
  b += `<g stroke="${O}" stroke-width="3">`;
  jobs.forEach(([x, y]) => { b += `<line x1="56" y1="${y + 6}" x2="${x}" y2="${y + 6}"/>`; });
  b += `</g>`;
  // storage reads: one real, two that never happen
  jobs.forEach(([x, y], i) => {
    const cx = x + 13;
    b += i === 0
      ? `<line x1="${cx}" y1="${y}" x2="${cx}" y2="20" stroke="#fff" stroke-opacity="0.6" stroke-width="2"/>`
      : `<line x1="${cx}" y1="${y - 2}" x2="${cx}" y2="22" stroke="#fff" stroke-opacity="0.55" stroke-width="2.5" stroke-dasharray="1 7" stroke-linecap="round"/>`;
    b += `<rect x="${x}" y="${y}" width="26" height="12" rx="2" fill="#14110d" stroke="#fff" stroke-opacity="0.5" stroke-width="2"/>`;
    b += lbl(cx, y + 8, `JOB ${i + 1}`, { anchor: 'middle', size: 4.6, op: 0.8 });
  });
  b += lbl(10, 134, 'SOLID: JOB 1 READS OBJECT STORAGE ONCE', { size: 4.6, op: 0.55 });
  b += lbl(10, 142, 'DOTTED: RE-READS JOBS 2 AND 3 NEVER MAKE', { size: 4.6, op: 0.55 });
  return svg(200, 146, b, 740);
}

// ── slides ───────────────────────────────────────────────────────
const qr = BLOG_URL ? await makeQr(BLOG_URL, 150) : '';
const CTA = 'Point your most re-read job at Yeedu';
const cta = BLOG_URL
  ? `<div style="display:flex;align-items:center;justify-content:space-between;gap:32px;margin-top:22px;">
       <div>
         ${ctaPill(CTA)}
         <div style="margin-top:16px;font-size:21px;color:${C.text2};font-weight:500;">sales@yeedu.com</div>
       </div>
       <div style="text-align:center;">
         ${qr}
         <div style="margin-top:8px;font-size:13px;color:${C.text3};letter-spacing:0.6px;">READ THE POST</div>
       </div>
     </div>`
  : `<div style="display:flex;align-items:center;justify-content:space-between;gap:28px;margin-top:26px;padding-top:24px;border-top:1px solid ${C.rule};">
       ${ctaPill(CTA)}
       <div style="font-size:22px;color:${C.text2};font-weight:500;">sales@yeedu.com</div>
     </div>`;

const slides = [
  {
    notes: 'Cover — claim: lazy evaluation means nothing is cached unless asked; with no cache, every action re-walks the lineage from the source read (Spark RDD Programming Guide). Three identical read→filter→join chains, each fed by its own orange S3 re-read (inverted on the closer: three jobs, one read)',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Spark caching vs recomputing')}
      ${headline(`Every action reruns ${em('the whole lineage')}`, 48)}
      ${well(drawLineageReruns(), { card: false })}
      ${caption(`Transformations only extend the DAG. Recompute is Spark's default, so each count(), show() or write goes back to the S3 read, and a .cache() with no action after it never materializes anything.`)}
    `, 'A'),
  },
  {
    notes: 'Eviction fork — claim: RDD cache() is MEMORY_ONLY, so an evicted block silently recomputes from lineage; a DataFrame persist() defaults to MEMORY_AND_DISK and spills instead (Spark RDD guide, Databricks recompute KB). Spot reclaim and autoscale-down lose blocks the same way. Two-outcome fork, identical limbs, MEMORY_ONLY lower with ghost slot and orange lineage re-run',
    html: stage(`
      ${eyebrow('cache() vs persist()')}
      ${headline('MEMORY_ONLY drops evicted blocks', 46)}
      ${well(drawEvictionFork())}
      ${caption(`RDD cache() means MEMORY_ONLY. A DataFrame's persist() defaults to MEMORY_AND_DISK and spills. Spot reclaim and autoscaling scale-down take cached blocks with the executor, and the next read recomputes them.`)}
    `, 'B'),
  },
  {
    notes: 'Read counts — claim: caching pays only through repeat reads; iterative ML, a dimension table joined 40 times a day and hot BI data pay back, a single-use DataFrame or a cache placed before filter() loses money. Identical materialization block per row, read ticks drawn at count, losers sit lower, single-use block orange',
    html: stage(`
      ${eyebrow('When caching pays')}
      ${headline('Count the reads before you call cache()', 46)}
      ${well(drawReadCounts(), { card: false })}
      ${caption(`Caching before a filter pins the unfiltered table and blocks pushdown. Renting a bigger instance just to hold a cache shows up on the bill whatever the cache saves.`)}
    `, 'C'),
  },
  {
    notes: 'Break-even — claim: recompute_cost ≈ compute_hours_per_pass × rate × reuse_count grows per reuse; cache_cost ≈ one materialization + memory premium is paid once. Blog\'s illustrative numbers only: 0.2 compute-hrs × $4/hr = $0.80/pass, $0.50 memory premium; 3 reuses = $2.40 vs $1.30. Two cost lines from a shared origin, cache line orange, crossing marked',
    html: stage(`
      ${eyebrow('Cache vs recompute cost')}
      ${headline('Where does the cache break even?', 50)}
      ${well(drawBreakEven())}
      ${caption(`Illustrative numbers. Recompute pays compute-hours × rate on every reuse, the cache pays one materialization plus its memory premium. Plug in your own pass time and instance pricing.`)}
    `, 'D'),
  },
  {
    notes: 'Closer — claim: Yeedu mode keeps a whole job and its cached blocks on one VM; spark-submit multiplexing runs jobs in one long-lived session, so data cached once is served from memory to later jobs with no object-storage re-read (blog Yeedu section, no figures). Bookend: cover\'s 3 re-reads inverted to 1 read + 2 ghost re-reads, orange cache-read lines; CTA pill + sales@yeedu.com',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Yeedu mode + multiplexing')}
      ${headline('Cache once, serve every job from memory', 44)}
      ${well(drawSharedSessionCache(), { card: false })}
      ${caption(`Yeedu mode runs the whole job on one VM, so cached blocks stay on one machine. Multiplexed spark-submit jobs share one long-lived session, with no I/O wait on a re-read. Turbo adds CPU-aware L2/L3 caching and a Parquet disk cache, and the fixed licence means a bigger memory VM adds cloud cost only.`)}
      ${cta}
    `, 'C'),
  },
];

const NAME = 'Spark Caching vs Recomputing: Which Is More Cost-Effective?';

if (OLD_ID) await deleteCarousel(OLD_ID);
const id = await buildCarousel(NAME, slides);
if (!process.env.SKIP_EXPORT) await exportDeck(id, NAME);
