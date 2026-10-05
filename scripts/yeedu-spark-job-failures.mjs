// ════════════════════════════════════════════════════════════════
// Top 10 Reasons Why Apache Spark Jobs Fail
// Source: n8n-workflows-v2/output/strategy/2026-10-01-top-10-reasons-why-apache-spark-jobs-fail
//
// 5 slides, 4:5. One bespoke drawing per slide, no shared renderer map.
// Chrome only comes from ./yeedu-chrome.mjs. Every topic number is a Spark
// default or error string the blog cites (Spark config docs, Databricks KB),
// never Yeedu's. The closer carries Yeedu Assistant (Assistant X) capabilities
// from the facts pack, with no numbers attached (none are published).
// ════════════════════════════════════════════════════════════════
import {
  C, stage, logoMark, eyebrow, headline, em, caption, well, svg,
  makeQr, ctaPill, buildCarousel, deleteCarousel, exportDeck,
} from './yeedu-chrome.mjs';

const BLOG_URL = null; // not published yet — set the live URL and re-run to add the QR
const OLD_ID = process.env.OLD_ID || '';

const O = C.orange, OL = C.orangeLight;

const lbl = (x, y, t, { anchor = 'start', fill = '#fff', op = 0.42, size = 6.2 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter" font-size="${size}" font-weight="600" letter-spacing="0.9" fill="${fill}" opacity="${op}">${t}</text>`;
const num = (x, y, t, { anchor = 'start', fill = '#fff', op = 1, size = 14, weight = 800 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Montserrat" font-size="${size}" font-weight="${weight}" letter-spacing="-0.4" fill="${fill}" opacity="${op}">${t}</text>`;
const code = (x, y, t, { anchor = 'start', op = 0.8, size = 6, fill = '#fff' } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter" font-size="${size}" font-weight="500" fill="${fill}" opacity="${op}">${t}</text>`;

// ── 1. COVER ─────────────────────────────────────────────────────
// Claim: one failed job can surface as any of eight error strings, each
// pointing at a different subsystem. Divergence tree from one orange root;
// the closer inverts it into three sources converging on one RCA node.
const ERRORS = [
  ['maxResultSize exceeded', 'DRIVER'],
  ['exit code 137', 'EXECUTOR MEMORY'],
  ['FetchFailedException', 'SHUFFLE'],
  ['ExecutorLostFailure', 'NODE LOSS'],
  ['NotSerializableException', 'CLOSURES'],
  ['KryoException', 'SERIALIZER'],
  ['NoSuchMethodError', 'CLASSPATH'],
  ['AnalysisException', 'SCHEMA'],
];
function drawErrorFanOut() {
  const rx = 18, ry = 92, x1 = 76, top = 12, step = 22;
  let b = '';
  b += `<g fill="none" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="4 5">`;
  ERRORS.forEach((_, i) => {
    const y = top + i * step;
    b += `<path d="M${rx + 7},${ry} C${rx + 34},${ry} ${x1 - 30},${y} ${x1 - 4},${y}"/>`;
  });
  b += `</g>`;
  b += `<circle cx="${rx}" cy="${ry}" r="9" fill="${O}"/>`;
  b += lbl(rx, ry - 15, 'FAILED', { anchor: 'middle', size: 5.2, fill: OL, op: 1 });
  ERRORS.forEach(([e, area], i) => {
    const y = top + i * step;
    b += `<circle cx="${x1}" cy="${y}" r="2.2" fill="#fff" fill-opacity="0.85"/>`;
    b += code(x1 + 7, y + 2, e, { size: 7, op: 0.92 });
    b += lbl(x1 + 7, y + 10, area, { size: 4.6, op: 0.4 });
  });
  return svg(200, 178, b, 856);
}

// ── 2. DRIVER MEMORY ─────────────────────────────────────────────
// Claim: a "small" 200MB broadcast is 20× the 10MiB default threshold and
// lands inside a driver that defaults to 1g. Nested squares, areas to scale
// (1024 : 200 : 10).
function drawBroadcastInDriver() {
  const S = 120, side = mb => S * Math.sqrt(mb / 1024), x0 = 40, base = 146;
  const s200 = side(200), s10 = side(10);
  let b = '';
  b += `<rect x="${x0}" y="${base - S}" width="${S}" height="${S}" rx="2" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="2"/>`;
  b += lbl(x0, base - S - 6, 'DRIVER MEMORY · 1g DEFAULT');
  b += `<rect x="${x0}" y="${(base - s200).toFixed(2)}" width="${s200.toFixed(2)}" height="${s200.toFixed(2)}" fill="${O}"/>`;
  b += num(x0 + 4, base - s200 + 15, '200MB', { size: 11 });
  b += `<rect x="${(x0 + S - s10 - 6).toFixed(2)}" y="${(base - S + 6).toFixed(2)}" width="${s10.toFixed(2)}" height="${s10.toFixed(2)}" fill="#fff" fill-opacity="0.85"/>`;
  b += lbl(x0 + S - s10 - 10, base - S + 13, '10MiB', { anchor: 'end', size: 5.6, op: 0.7 });
  // leader fan to the explanation stack
  b += `<g stroke="#fff" stroke-opacity="0.3" stroke-width="1.5">`;
  b += `<line x1="${x0 + s200}" y1="${base - s200 / 2}" x2="${x0 + S + 6}" y2="${base - 34}"/>`;
  b += `</g>`;
  b += lbl(x0 + S + 8, base - 40, 'THE "SMALL"', { size: 5.2, op: 0.6 });
  b += lbl(x0 + S + 8, base - 32, 'SIDE OF A', { size: 5.2, op: 0.6 });
  b += lbl(x0 + S + 8, base - 24, 'BROADCAST', { size: 5.2, op: 0.6 });
  b += lbl(x0, base + 12, 'AREA TO SCALE · 1024 : 200 : 10 MB', { size: 5.2 });
  return svg(200, 162, b, 820);
}

// ── 3. EXECUTOR OVERHEAD ─────────────────────────────────────────
// Claim: the Python worker for a PySpark UDF lives in the overhead slice,
// 10% of executor memory by default, and growing past it gets the container
// killed (exit 137). Bar lengths to scale: heap 1.0, overhead 0.10; the
// worker's growth is a curve rising into the kill line.
function drawOverheadSlice() {
  const x0 = 12, H = 150, heapEnd = x0 + H, ovEnd = heapEnd + 0.10 * H, y = 22, h = 20;
  let b = '';
  b += lbl(x0, y - 6, 'spark.executor.memory', { size: 5.2, op: 0.55 });
  b += `<rect x="${x0}" y="${y}" width="${H}" height="${h}" fill="#fff" fill-opacity="0.16" stroke="#fff" stroke-opacity="0.4" stroke-width="2"/>`;
  b += num(x0 + 6, y + 14, 'HEAP 1.0×', { size: 8, weight: 700, op: 0.75 });
  b += `<rect x="${heapEnd}" y="${y}" width="${0.10 * H}" height="${h}" fill="none" stroke="#fff" stroke-opacity="0.85" stroke-width="2"/>`;
  b += lbl(ovEnd, y - 6, 'OVERHEAD 0.10×', { anchor: 'end', size: 5.2, op: 0.8 });

  // the overhead limit carried down as a horizontal rule
  const rule = 70;
  b += `<line x1="${ovEnd}" y1="${y + h}" x2="${ovEnd}" y2="${rule}" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="4 5"/>`;
  b += `<line x1="${x0}" y1="${rule}" x2="${ovEnd + 8}" y2="${rule}" stroke="#fff" stroke-opacity="0.5" stroke-width="2"/>`;
  b += lbl(x0, rule + 9, 'OVERHEAD LIMIT', { size: 5.2, op: 0.55 });

  // python worker memory grows across one UDF task until it meets the rule
  const yb = 136, xk = ovEnd - 4;
  b += `<path d="M${x0},${yb} C${x0 + 70},${yb - 4} ${xk - 50},${rule + 30} ${xk},${rule}" fill="none" stroke="#fff" stroke-opacity="0.85" stroke-width="3.5" stroke-linecap="round"/>`;
  b += `<circle cx="${xk}" cy="${rule}" r="5" fill="${O}"/>`;
  b += num(xk - 9, rule - 5, '137', { anchor: 'end', size: 20, fill: OL });
  b += lbl(xk - 44, rule - 6, 'CONTAINER KILLED', { anchor: 'end', size: 5.2, op: 0.6 });
  b += lbl(x0, yb + 9, 'PYTHON WORKER MEMORY, ONE UDF TASK', { size: 5.2 });
  b += lbl(x0, 158, 'NON-JVM JOBS ON KUBERNETES DEFAULT TO 0.40×', { size: 5.2 });
  return svg(200, 162, b, 856);
}

// ── 4. NODE LOSS ─────────────────────────────────────────────────
// Claim: heartbeats every 10s, and Spark waits the full 120s network timeout
// before declaring a vanished executor lost. Twelve beats drawn as real dots
// until the reclaim, then twelve round-dotted ghost beats; the verdict at 120s.
function drawHeartbeatSilence() {
  const x0 = 16, x1 = 184, k = (x1 - x0) / 180, y = 70;
  let b = '';
  b += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="#fff" stroke-opacity="0.16" stroke-width="1.5"/>`;
  // 60s alive: beats at 0..50, solid
  b += `<g fill="#fff" fill-opacity="0.85">`;
  for (let t = 0; t <= 50; t += 10) b += `<circle cx="${(x0 + t * k).toFixed(2)}" cy="${y}" r="3"/>`;
  b += `</g>`;
  const tr = 60, xr = x0 + tr * k;
  b += `<line x1="${xr}" y1="${y - 22}" x2="${xr}" y2="${y + 22}" stroke="#fff" stroke-opacity="0.5" stroke-width="2"/>`;
  b += lbl(xr, y - 28, 'SPOT NODE RECLAIMED', { anchor: 'middle', size: 5.2, op: 0.7 });
  // 120s of silence: ghost beats
  b += `<line x1="${xr + 10 * k}" y1="${y}" x2="${x0 + 180 * k}" y2="${y}" stroke="#fff" stroke-opacity="0.6" stroke-width="4" stroke-dasharray="1 ${(10 * k - 1).toFixed(2)}" stroke-linecap="round"/>`;
  const xe = x0 + 180 * k;
  b += `<circle cx="${xe}" cy="${y}" r="6" fill="${O}"/>`;
  // span annotation
  b += `<path d="M${xr},${y + 30} L${xe},${y + 30}" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5"/>`;
  b += `<path d="M${xr},${y + 26} L${xr},${y + 34} M${xe},${y + 26} L${xe},${y + 34}" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5"/>`;
  b += num((xr + xe) / 2, y + 52, '120s', { anchor: 'middle', size: 22, fill: OL });
  b += lbl((xr + xe) / 2, y + 63, 'spark.network.timeout', { anchor: 'middle', size: 5.2, op: 0.55 });
  b += lbl(x0, y + 18, 'BEAT EVERY 10s', { size: 5.2, op: 0.55 });
  b += lbl(xe, y - 12, 'LOST', { anchor: 'end', size: 5.6, fill: OL, op: 1 });
  return svg(200, 140, b, 856);
}

// ── 5. CLOSER ────────────────────────────────────────────────────
// Bookend: the cover's one-to-eight divergence inverts. Three evidence sources
// converge on one orange RCA node, which emits one fix.
function drawEvidenceConverges() {
  const srcX = 14, rx = 128, ry = 64;
  const SRC = [
    ['Spark logs', 'DRIVER + EXECUTOR', 20],
    ['History Server', 'EVENT DATA FOR THE RUN', 64],
    ['Cluster monitoring', 'WHAT THE NODES DID', 108],
  ];
  let b = '';
  b += `<g fill="none" stroke="#fff" stroke-opacity="0.32" stroke-width="2">`;
  SRC.forEach(([, , y]) => {
    b += `<path d="M${srcX + 70},${y} C${srcX + 96},${y} ${rx - 30},${ry} ${rx - 9},${ry}"/>`;
  });
  b += `</g>`;
  SRC.forEach(([name, sub, y]) => {
    b += `<circle cx="${srcX + 70}" cy="${y}" r="2.6" fill="#fff" fill-opacity="0.85"/>`;
    b += code(srcX, y - 1, name, { size: 7.4, op: 0.92 });
    b += lbl(srcX, y + 8, sub, { size: 4.4, op: 0.4 });
  });
  b += `<circle cx="${rx}" cy="${ry}" r="9" fill="${O}"/>`;
  b += lbl(rx, ry - 15, 'RCA', { anchor: 'middle', fill: OL, op: 1, size: 6 });
  b += `<path d="M${rx + 9},${ry} L${rx + 46},${ry}" stroke="#fff" stroke-opacity="0.32" stroke-width="2" stroke-dasharray="4 5"/>`;
  b += `<path d="M${rx + 42},${ry - 4} L${rx + 47},${ry} L${rx + 42},${ry + 4}" fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="2"/>`;
  b += lbl(rx + 50, ry + 2, 'FIX', { size: 6, op: 0.85 });
  return svg(200, 124, b, 856);
}

// ── slides ───────────────────────────────────────────────────────
const qr = BLOG_URL ? await makeQr(BLOG_URL, 150) : '';
const CTA = 'Hand Assistant X your last failed job';
const cta = BLOG_URL
  ? `<div style="display:flex;align-items:center;justify-content:space-between;gap:32px;margin-top:22px;">
       <div>
         ${ctaPill(CTA)}
         <div style="margin-top:16px;font-size:21px;color:${C.text2};font-weight:500;">sales@yeedu.io</div>
       </div>
       <div style="text-align:center;">
         ${qr}
         <div style="margin-top:8px;font-size:13px;color:${C.text3};letter-spacing:0.6px;">READ THE POST</div>
       </div>
     </div>`
  : `<div style="display:flex;align-items:center;justify-content:space-between;gap:28px;margin-top:30px;padding-top:28px;border-top:1px solid ${C.rule};">
       ${ctaPill(CTA)}
       <div style="font-size:22px;color:${C.text2};font-weight:500;">sales@yeedu.io</div>
     </div>`;

const slides = [
  {
    notes: 'Cover — claim: one failed Spark job can surface as any of eight error strings, each pointing at a different subsystem. Divergence tree from one orange root (inverted into convergence on the closer)',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Apache Spark job failures')}
      ${headline(`One failed job, ${em('eight')} error strings`, 50)}
      ${well(drawErrorFanOut(), { card: false })}
      ${caption(`Each string points somewhere different: the driver, executor memory, the shuffle, a lost node, closures, the classpath or the schema. Reading it right is half the fix.`)}
    `, 'A'),
  },
  {
    notes: 'Driver memory — claim: a 200MB broadcast is 20× the 10MiB default threshold and lands inside a 1g default driver. Proportional nested squares, areas to scale 1024:200:10 (Spark config docs, Databricks KB)',
    html: stage(`
      ${eyebrow('Driver out of memory')}
      ${headline('A 200MB broadcast inside a 1g driver', 50)}
      ${well(drawBroadcastInDriver())}
      ${caption(`spark.driver.memory and spark.driver.maxResultSize both default to 1g. Spark builds the broadcast side on the driver first, and the default threshold for that side is 10MiB.`)}
    `, 'B'),
  },
  {
    notes: 'Executor overhead — claim: the PySpark Python worker lives in a 10% overhead slice; outgrowing it kills the container (exit 137 by community convention). Bars to scale 1.0 : 0.10, growth curve hitting the kill line (Spark config docs)',
    html: stage(`
      ${eyebrow('Exit code 137')}
      ${headline('Your Python worker gets a 10% slice', 46)}
      ${well(drawOverheadSlice(), { card: false })}
      ${caption(`Overhead defaults to 10% of executor memory, 40% for non-JVM jobs on Kubernetes. A UDF worker that outgrows it is killed without a Java stack trace, so heap charts look fine.`)}
    `, 'C'),
  },
  {
    notes: 'Node loss — claim: heartbeats every 10s, but a reclaimed executor is only declared lost after the 120s network timeout. Solid beats then round-dotted ghost beats, verdict node at 120s (Spark config docs)',
    html: stage(`
      ${eyebrow('ExecutorLostFailure')}
      ${headline('A spot node vanishes, Spark waits 120s', 44)}
      ${well(drawHeartbeatSilence(), { pad: 34 })}
      ${caption(`Executors beat every 10s; spark.network.timeout defaults to 120s. Since Spark 3.4, decommissioning can migrate shuffle and cached blocks off a node before it's reclaimed.`)}
    `, 'D'),
  },
  {
    notes: 'Closer — claim: Yeedu Assistant (Assistant X) joins logs, History Server events and cluster monitoring into one root-cause analysis. Convergence bookend inverting the cover tree; CTA pill + sales@yeedu.io (QR when BLOG_URL is set)',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Yeedu Assistant (Assistant X)')}
      ${headline('Three sources, one root cause', 56)}
      ${well(drawEvidenceConverges(), { card: false })}
      ${caption(`Assistant X fetches the job's Spark logs, reads the run's History Server events and pulls cluster monitoring, then explains why it failed and what to change.`)}
      ${cta}
    `, 'C'),
  },
];

const NAME = 'Top 10 Reasons Why Apache Spark Jobs Fail';

if (OLD_ID) await deleteCarousel(OLD_ID);
const id = await buildCarousel(NAME, slides);
if (!process.env.SKIP_EXPORT) await exportDeck(id, NAME);
