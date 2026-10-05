// ════════════════════════════════════════════════════════════════
// Why Spark Autoscaling Won't Fix Your Cloud Bill
// Source: https://yeedu.com/blog/spark-cluster-autoscaling-cost-optimization
//
// 5 slides, 4:5. One bespoke drawing per slide, no shared renderer map.
// Chrome only comes from ./yeedu-chrome.mjs. Every topic number here is
// the blog's cited source (Spark docs, Onehouse, AWS, Teads, Adevinta),
// never Yeedu's. Yeedu numbers appear only on the closer, from the fact sheet.
// ════════════════════════════════════════════════════════════════
import {
  C, stage, logoMark, eyebrow, headline, em, caption, well, svg,
  makeQr, ctaPill, buildCarousel, deleteCarousel, exportDeck,
} from './yeedu-chrome.mjs';

const BLOG_URL = 'https://yeedu.com/blog/spark-cluster-autoscaling-cost-optimization';
const OLD_ID = '014092e5-42ed-4858-8380-47c4b03c3177';

const O = C.orange, OL = C.orangeLight;

const lbl = (x, y, t, { anchor = 'start', fill = '#fff', op = 0.42, size = 6.2 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter" font-size="${size}" font-weight="600" letter-spacing="0.9" fill="${fill}" opacity="${op}">${t}</text>`;
const num = (x, y, t, { anchor = 'start', fill = '#fff', op = 1, size = 14, weight = 800 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Montserrat" font-size="${size}" font-weight="${weight}" letter-spacing="-0.4" fill="${fill}" opacity="${op}">${t}</text>`;
const cfg = (x, y, t, anchor = 'start') =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter" font-size="5.8" font-weight="500" fill="#fff" opacity="0.5">${t}</text>`;

// ── 1. COVER ─────────────────────────────────────────────────────
// Claim: Spark asks for capacity after 1s and gives it back after 60s, or never.
// Time bars at a true 1:60 length ratio; the cached-executor timeout is a
// round-dotted "doesn't happen" line that runs off the slide edge. The closer
// inverts this into one bounded bar.
function drawTimeoutAsymmetry() {
  const x0 = 16, k = 170 / 60;           // 60s = 170 units, so 1s = 2.83 units
  let b = '';
  // guides at 0s and 60s
  b += `<g stroke="#fff" stroke-opacity="0.14" stroke-width="1.5">`;
  b += `<line x1="${x0}" y1="6" x2="${x0}" y2="150"/><line x1="${x0 + 60 * k}" y1="6" x2="${x0 + 60 * k}" y2="150"/>`;
  b += `</g>`;

  // request: 1 second
  b += lbl(x0 + 4, 20, 'ASK FOR MORE EXECUTORS');
  b += `<rect x="${x0}" y="26" width="${(1 * k).toFixed(2)}" height="18" fill="#fff"/>`;
  b += num(x0 + 8, 41, '1s', { size: 15 });
  b += cfg(x0 + 30, 39, 'schedulerBacklogTimeout');

  // release: 60 seconds
  b += lbl(x0 + 4, 68, 'GIVE AN IDLE EXECUTOR BACK');
  b += `<rect x="${x0}" y="74" width="${(60 * k).toFixed(2)}" height="18" rx="2" fill="${O}"/>`;
  b += num(x0 + 60 * k - 5, 88, '60s', { anchor: 'end', size: 13 });
  b += cfg(x0 + 4, 103, 'executorIdleTimeout');

  // release with cached blocks: never, drawn as a ghost line off the edge
  b += lbl(x0 + 4, 124, 'GIVE BACK ONE THAT CACHES RDD BLOCKS');
  b += `<line x1="${x0 + 2}" y1="136" x2="262" y2="136" stroke="#fff" stroke-opacity="0.6" stroke-width="4" stroke-dasharray="1 8" stroke-linecap="round"/>`;
  b += cfg(x0 + 4, 151, 'cachedExecutorIdleTimeout');
  b += num(x0 + 60 * k - 10, 157, '∞', { anchor: 'end', size: 18, op: 0.85 });
  return svg(200, 162, b, 856);
}

// ── 2. STRANDED EXECUTORS ────────────────────────────────────────
// Claim: allocation stayed flat at 24 executors for 10+ hours while CPU fell
// 55% → 15%, so idle capacity widened from 45% to 85%. The gap is the point.
function drawStrandedExecutors() {
  const xL = 26, xR = 170, yT = 34, yB = 124, s = (yB - yT) / 100;
  const cpu0 = yB - 55 * s, cpu1 = yB - 15 * s;
  let b = '';
  // axes
  b += `<g stroke="#fff" stroke-opacity="0.16" stroke-width="1.5">`;
  b += `<line x1="${xL}" y1="${yB}" x2="${xR}" y2="${yB}"/><line x1="${xL}" y1="${yT}" x2="${xL}" y2="${yB}"/>`;
  b += `</g>`;
  b += lbl(xL - 4, yT + 2, '100%', { anchor: 'end', size: 5.6 });
  b += lbl(xL - 4, yB + 2, '0', { anchor: 'end', size: 5.6 });
  b += lbl(xL, yB + 10, '0 H', { anchor: 'middle', size: 5.6 });
  b += lbl(xR, yB + 10, '10+ H', { anchor: 'middle', size: 5.6 });

  // used (faint) and idle (orange) areas
  b += `<path d="M${xL},${cpu0} L${xR},${cpu1} L${xR},${yB} L${xL},${yB} Z" fill="#fff" fill-opacity="0.06"/>`;
  b += `<path d="M${xL},${yT} L${xR},${yT} L${xR},${cpu1} L${xL},${cpu0} Z" fill="${O}" fill-opacity="0.32"/>`;

  // allocation: flat
  b += `<line x1="${xL}" y1="${yT}" x2="${xR}" y2="${yT}" stroke="#fff" stroke-opacity="0.85" stroke-width="2.5"/>`;
  b += lbl(xL, yT - 7, '24 EXECUTORS ALLOCATED', { op: 0.6 });

  // cpu: falling. 55% sits on the y-axis as a tick so no label crosses the line
  b += `<line x1="${xL}" y1="${cpu0}" x2="${xR}" y2="${cpu1}" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>`;
  b += `<circle cx="${xL}" cy="${cpu0}" r="2.6" fill="#fff"/><circle cx="${xR}" cy="${cpu1}" r="2.6" fill="#fff"/>`;
  b += num(xL - 5, cpu0 + 2.5, '55%', { anchor: 'end', size: 7, weight: 700 });
  b += num(xR + 5, cpu1 + 3, '15%', { size: 8, weight: 700 });
  b += lbl(xL + 6, yB - 6, 'CPU UTILIZATION', { op: 0.55, size: 5.6 });

  // idle annotations inside the gap
  b += lbl(xL + 6, yT + 14, '45% IDLE', { fill: OL, op: 0.9 });
  b += lbl(xR - 6, yT + 16, 'IDLE BY HOUR 10', { anchor: 'end', op: 0.55 });
  b += num(xR - 6, yT + 40, '85%', { anchor: 'end', size: 22, fill: OL });

  // the 24 executors as 24 drawn marks, each 15% busy
  b += lbl(xL, 150, 'THE SAME 24 EXECUTORS AT HOUR 10', { size: 5.6 });
  const pitch = (xR - xL) / 24, w = pitch - 1.8, cy = 156, ch = 22;
  b += `<g fill="none" stroke="#fff" stroke-opacity="0.32" stroke-width="1.5">`;
  for (let i = 0; i < 24; i++) b += `<rect x="${(xL + i * pitch + 0.9).toFixed(2)}" y="${cy}" width="${w.toFixed(2)}" height="${ch}" rx="1"/>`;
  b += `</g><g fill="#fff" fill-opacity="0.55">`;
  for (let i = 0; i < 24; i++) b += `<rect x="${(xL + i * pitch + 0.9).toFixed(2)}" y="${(cy + ch * 0.85).toFixed(2)}" width="${w.toFixed(2)}" height="${(ch * 0.15).toFixed(2)}"/>`;
  b += `</g>`;
  return svg(200, 182, b, 820);
}

// ── 3. SHUFFLE-AWARE SCALING ─────────────────────────────────────
// Claim: once EMR stopped removing nodes holding shuffle output, equivalent
// workloads ran on 70 nodes instead of 179, and 41 instead of 86.
// Proportional nested rects: every area uses one area-per-node constant, so
// both pairs are to scale with each other. These are NODE counts, not cost.
function drawShuffleAwareNodes() {
  const perNode = (100 * 100) / 179, side = n => Math.sqrt(n * perNode), base = 140;
  const pairs = [
    { x: 6,   before: 179, after: 70, hero: true },
    { x: 124, before: 86,  after: 41, hero: false },
  ];
  let b = '';
  b += `<line x1="0" y1="${base}" x2="200" y2="${base}" stroke="#fff" stroke-opacity="0.16" stroke-width="1.5"/>`;
  pairs.forEach(p => {
    const S = side(p.before), s = side(p.after);
    b += `<rect x="${p.x}" y="${(base - S).toFixed(2)}" width="${S.toFixed(2)}" height="${S.toFixed(2)}" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="2"/>`;
    b += `<rect x="${p.x}" y="${(base - s).toFixed(2)}" width="${s.toFixed(2)}" height="${s.toFixed(2)}" fill="${O}" fill-opacity="${p.hero ? 1 : 0.6}"/>`;
    b += num(p.x, base - S - 6, `${p.before} nodes`, { size: 9, weight: 700, op: 0.55 });
    b += num(p.x + 5, base - 7, `${p.after}`, { size: p.hero ? 20 : 14 });
  });
  b += lbl(0, base + 13, 'NODES REQUESTED · SIMILAR WORKLOADS', { size: 5.6 });
  return svg(200, 156, b, 856);
}

// ── 4. NODE SHAPE ────────────────────────────────────────────────
// Claim: the same eight executors cost $0.27/hr packed on one r3.8xlarge and
// $0.72/hr split across eight r3.xlarge (Teads). Dots = executors, boxes =
// nodes at equal total area, column height = hourly cost to scale.
function drawNodeShape() {
  const cxL = 52, cxR = 146, base = 172, k = 100;
  let b = '';
  b += lbl(cxL, 14, '1× r3.8xlarge', { anchor: 'middle', op: 0.6, size: 7 });
  b += lbl(cxR, 14, '8× r3.xlarge', { anchor: 'middle', op: 0.6, size: 7 });

  // one node, eight executors
  const B = 56;
  b += `<rect x="${cxL - B / 2}" y="24" width="${B}" height="${B}" rx="3" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="2"/>`;
  b += `<g fill="#fff" fill-opacity="0.85">`;
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) b += `<circle cx="${cxL - 16.5 + c * 11}" cy="${45 + r * 14}" r="3.2"/>`;
  b += `</g>`;

  // eight nodes, one executor each; each box is 1/8 the area of the big one
  const s = B / Math.sqrt(8), gap = 4, gw = 4 * s + 3 * gap, gh = 2 * s + gap;
  const gx = cxR - gw / 2, gy = 52 - gh / 2;
  b += `<g fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="2">`;
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) b += `<rect x="${(gx + c * (s + gap)).toFixed(2)}" y="${(gy + r * (s + gap)).toFixed(2)}" width="${s.toFixed(2)}" height="${s.toFixed(2)}" rx="2"/>`;
  b += `</g><g fill="#fff" fill-opacity="0.85">`;
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) b += `<circle cx="${(gx + c * (s + gap) + s / 2).toFixed(2)}" cy="${(gy + r * (s + gap) + s / 2).toFixed(2)}" r="3.2"/>`;
  b += `</g>`;

  // hourly cost columns, height to scale
  const hL = 0.27 * k, hR = 0.72 * k;
  b += `<line x1="14" y1="${base}" x2="186" y2="${base}" stroke="#fff" stroke-opacity="0.2" stroke-width="1.5"/>`;
  b += `<rect x="${cxL - 20}" y="${base - hL}" width="40" height="${hL}" fill="${O}"/>`;
  b += `<rect x="${cxR - 20}" y="${base - hR}" width="40" height="${hR}" fill="#fff" fill-opacity="0.26"/>`;
  b += num(cxL, base - hL - 6, '$0.27/hr', { anchor: 'middle', size: 11, fill: OL });
  b += num(cxR, base - hR - 6, '$0.72/hr', { anchor: 'middle', size: 11, op: 0.85 });
  b += lbl(100, base + 12, "TEADS' PUBLISHED FIGURES", { anchor: 'middle', size: 5.6 });
  return svg(200, 188, b, 780);
}

// ── 5. CLOSER ────────────────────────────────────────────────────
// Bookend: the cover's open-ended bars become one bounded bar, 100% of cluster
// resources. Length = resource share; ticks = apps (1 tick ≈ 20 apps). The top
// 20 apps are one orange block holding 30% of the length; the other 149 ticks
// (~2,980 apps) crowd into the remaining 70% (Adevinta event logs).
function drawTopTwentyShare() {
  const x0 = 10, x1 = 190, W = x1 - x0, top = 26, h = 28, split = x0 + 0.30 * W;
  let b = '';
  b += lbl(x0, 19, 'TOP 20 APPS', { fill: OL, op: 1 });
  b += lbl(x1, 19, 'THE OTHER 2,980+', { anchor: 'end' });
  b += `<rect x="${x0}" y="${top}" width="${W}" height="${h}" rx="3" fill="none" stroke="#fff" stroke-opacity="0.4" stroke-width="2"/>`;
  b += `<rect x="${x0}" y="${top}" width="${(split - x0).toFixed(2)}" height="${h}" rx="3" fill="${O}"/>`;
  const n = 149, t0 = split + 3, t1 = x1 - 3, p = (t1 - t0) / (n - 1);
  b += `<g stroke="#fff" stroke-opacity="0.34" stroke-width="0.45">`;
  for (let i = 0; i < n; i++) { const x = (t0 + i * p).toFixed(2); b += `<line x1="${x}" y1="${top + 4}" x2="${x}" y2="${top + h - 4}"/>`; }
  b += `</g>`;
  b += num((x0 + split) / 2, top + h + 18, '30%', { anchor: 'middle', size: 16 });
  b += num((split + x1) / 2, top + h + 16, '70%', { anchor: 'middle', size: 10, weight: 700, op: 0.4 });
  // stacked, not side by side: at 5.6 with letter-spacing these run ~5.3 units/char and overlapped
  b += lbl(x0, 86, 'LENGTH = SHARE OF CLUSTER RESOURCES', { size: 5.2 });
  b += lbl(x0, 96, '1 TICK ≈ 20 APPS', { size: 5.2 });
  b += lbl(x0, 106, 'ADEVINTA EVENT LOGS', { size: 5.2 });
  return svg(200, 110, b, 856);
}

// ── slides ───────────────────────────────────────────────────────
const qr = await makeQr(BLOG_URL, 150);

const slides = [
  {
    notes: 'Cover — claim: Spark requests executors after 1s but releases after 60s, or never when cached. Time bars at true 1:60 length + round-dotted ghost line off the edge (establishes bar vocabulary, inverted on the closer)',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Spark dynamic allocation defaults')}
      ${headline(`Spark takes ${em('60× longer')} to let go`, 58)}
      ${well(drawTimeoutAsymmetry(), { card: false })}
      ${caption(`Spark asks for executors after 1s of backlog and gives one back after 60s idle. Cache RDD blocks on it and the default wait is infinite.`)}
    `, 'A'),
  },
  {
    notes: 'Stranded executors — claim: 24 executors held for 10+ hours while CPU fell 55%→15%. Two lines from a shared origin with the widening idle gap shaded (45%→85%), plus 24 drawn executor marks each 15% busy (Onehouse case)',
    html: stage(`
      ${eyebrow('Stranded executors')}
      ${headline('24 executors held as CPU fell to 15%', 48)}
      ${well(drawStrandedExecutors())}
      ${caption(`A cluster Onehouse documented kept 24 executors for more than ten hours while utilization slid from 55% to 15%. The idle clock never lined up with load.`)}
    `, 'B'),
  },
  {
    notes: 'Shuffle-aware scaling — claim: the enhanced EMR Managed Scaling (incl. shuffle-data awareness) requested 70 nodes vs 179, and 41 vs 86, for similar workloads. Proportional nested rects, one area-per-node constant across both pairs (AWS Big Data Blog, 28 Feb 2023; nodes requested, not cost)',
    html: stage(`
      ${eyebrow('EMR managed scaling')}
      ${headline(`EMR's new scaler cut 179 nodes to 70`, 46)}
      ${well(drawShuffleAwareNodes(), { card: false })}
      ${caption(`AWS's 2023 update to EMR Managed Scaling stopped scaling down nodes that still hold shuffle data. Nodes requested for similar workloads; AWS cites costs down by up to 19%.`)}
    `, 'C'),
  },
  {
    notes: 'Node shape — claim: the same 8 executors cost $0.27/hr on one r3.8xlarge vs $0.72/hr on eight r3.xlarge. Packed box vs split boxes at equal total area, cost columns to scale (Teads published figures)',
    html: stage(`
      ${eyebrow('Node shape')}
      ${headline('8 executors, 1 node, $0.27 an hour', 50)}
      ${well(drawNodeShape(), { pad: 34 })}
      ${caption(`Teads' published figures for the same eight executors on EMR. We'd check node shape before touching a single dynamicAllocation setting.`)}
    `, 'D'),
  },
  {
    notes: 'Closer — claim: 20 of 3,000+ apps used ~30% of resources, so savings live below the autoscaler. Bookend inverting the cover bars into one bounded 100% bar, 149 dim ticks + one orange 30% block (Adevinta); CTA pill, email, QR',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Workload triage')}
      ${headline('Start with the 20 apps using 30%', 54)}
      ${well(drawTopTwentyShare(), { card: false })}
      ${caption(`The savings live below the autoscaler, in the engine and the workload. Yeedu's engine runs existing Spark code 4–10× faster with zero rewrites.`)}
      <div style="display:flex;align-items:center;justify-content:space-between;gap:32px;margin-top:26px;">
        <div>
          ${ctaPill('Rerun your 20 heaviest jobs on Yeedu')}
          <div style="margin-top:16px;font-size:21px;color:${C.text2};font-weight:500;">sales@yeedu.io</div>
        </div>
        <div style="text-align:center;">
          ${qr}
          <div style="margin-top:8px;font-size:13px;color:${C.text3};letter-spacing:0.6px;">READ THE POST</div>
        </div>
      </div>
    `, 'C'),
  },
];

const NAME = "Why Spark Autoscaling Won't Fix Your Cloud Bill";

if (OLD_ID) { console.log('Removing superseded deck…'); await deleteCarousel(OLD_ID); }
const id = await buildCarousel(NAME, slides);
await exportDeck(id, NAME);
