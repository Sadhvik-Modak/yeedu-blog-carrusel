// ════════════════════════════════════════════════════════════════
// How Spark Shuffle Impacts Performance and Cloud Costs
// Source: n8n-workflows-v2/output/strategy/2026-10-02-how-spark-shuffle-impacts-performance-and-cloud-costs
//
// 5 slides, 4:5. One bespoke drawing per slide, no shared renderer map.
// Chrome only comes from ./yeedu-chrome.mjs. Topic numbers are the blog's
// cited sources (dev.to practitioner run, AWS EC2 pricing page, Spark docs),
// never Yeedu's. Yeedu numbers appear only on the closer, from the facts pack,
// with the vendor's CPU-bound scope carried.
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

// ── 1. COVER ─────────────────────────────────────────────────────
// Claim: every map task writes a block for every reducer, so six maps and six
// reducers already means 36 transfers across the stage boundary. All 36 lines
// are drawn; one reducer's six inbound lines are orange. The closer turns this
// lattice into a stage timeline.
function drawAllToAll() {
  const xm = 30, xr = 170, n = 6, y0 = 16, step = 24, hero = 3;
  let b = '';
  b += `<line x1="100" y1="4" x2="100" y2="${y0 + (n - 1) * step + 12}" stroke="#fff" stroke-opacity="0.22" stroke-width="1.5" stroke-dasharray="4 5"/>`;
  b += `<g stroke="#fff" stroke-opacity="0.2" stroke-width="1.5">`;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (j !== hero)
    b += `<line x1="${xm + 7}" y1="${y0 + i * step}" x2="${xr - 7}" y2="${y0 + j * step}"/>`;
  b += `</g><g stroke="${O}" stroke-width="2.5">`;
  for (let i = 0; i < n; i++) b += `<line x1="${xm + 7}" y1="${y0 + i * step}" x2="${xr - 7}" y2="${y0 + hero * step}"/>`;
  b += `</g>`;
  b += `<g fill="#14110d" stroke="#fff" stroke-opacity="0.6" stroke-width="2">`;
  for (let i = 0; i < n; i++) {
    b += `<rect x="${xm - 7}" y="${y0 + i * step - 6}" width="14" height="12" rx="2"/>`;
    b += `<rect x="${xr - 7}" y="${y0 + i * step - 6}" width="14" height="12" rx="2"/>`;
  }
  b += `</g>`;
  const yb = y0 + (n - 1) * step + 22;
  b += lbl(xm, yb, 'MAP SIDE', { anchor: 'middle', size: 5.2, op: 0.55 });
  b += lbl(100, yb, 'STAGE BOUNDARY', { anchor: 'middle', size: 5.2, op: 0.4 });
  b += lbl(xr, yb, 'REDUCE SIDE', { anchor: 'middle', size: 5.2, op: 0.55 });
  b += num(100, yb + 22, '6 × 6 = 36', { anchor: 'middle', size: 16, fill: OL });
  b += lbl(100, yb + 32, 'BLOCKS WRITTEN, SERIALIZED, SENT, READ', { anchor: 'middle', size: 5 });
  return svg(200, 178, b, 700);
}

// ── 2. SKEW ──────────────────────────────────────────────────────
// Claim: 95% of tasks finished in about 4 minutes, one or two ran past 40.
// Forty task bars drawn to one time scale: 38 at 4 units, 2 at 40.
function drawStragglers() {
  const x0 = 14, k = 4.1, n = 40, y0 = 10, pitch = 3.4;
  let b = '';
  for (let i = 0; i < n; i++) {
    const slow = i >= n - 2, mins = slow ? 40 : 4, y = y0 + i * pitch;
    b += `<rect x="${x0}" y="${y.toFixed(2)}" width="${(mins * k).toFixed(2)}" height="2.2" fill="${slow ? O : '#fff'}" fill-opacity="${slow ? 1 : 0.55}"/>`;
  }
  const yEnd = y0 + n * pitch;
  b += `<line x1="${x0}" y1="${y0 - 4}" x2="${x0}" y2="${yEnd + 2}" stroke="#fff" stroke-opacity="0.2" stroke-width="1.5"/>`;
  b += `<line x1="${x0 + 4 * k}" y1="${y0 - 4}" x2="${x0 + 4 * k}" y2="${yEnd + 2}" stroke="#fff" stroke-opacity="0.2" stroke-width="1.5" stroke-dasharray="4 5"/>`;
  b += num(x0 + 4 * k + 6, y0 + 22, '95%', { size: 11, weight: 700, op: 0.8 });
  b += lbl(x0 + 4 * k + 6, y0 + 31, 'DONE IN ~4 MIN', { size: 5.2 });
  b += num(x0 + 40 * k, yEnd - 12, '40+ min', { anchor: 'end', size: 16, fill: OL });
  b += lbl(x0 + 40 * k, yEnd - 26, '2 TASKS ON SKEWED KEYS', { anchor: 'end', size: 5.2, op: 0.6 });
  b += lbl(x0, yEnd + 12, '40 BARS DRAWN · LENGTH = RUNTIME', { size: 5.2 });
  return svg(200, 166, b, 856);
}

// ── 3. CROSS-ZONE TRANSFER ───────────────────────────────────────
// Claim: a terabyte of shuffle crossing zones costs about $20 ($0.01/GB each
// way); the same traffic inside one zone over private IPs is free. Fork with
// identical limbs; the costly limb sits lower and carries a bar to scale,
// the free limb a round-dotted bar that never fills.
function drawZoneFork() {
  const rx = 16, ry = 80, k = 6;  // $1 = 6 units, so $20 = 120
  const limb = (y, title, cost, real) => {
    let g = `<path d="M${rx + 6},${ry} Q${rx + 20},${ry} ${rx + 26},${y}" fill="none" stroke="#fff" stroke-opacity="0.3" stroke-width="2"/>`;
    g += lbl(rx + 32, y - 9, title, { size: 5.4, op: 0.6 });
    g += real
      ? `<rect x="${rx + 32}" y="${y - 4}" width="${20 * k}" height="10" fill="${O}"/>`
      : `<line x1="${rx + 34}" y1="${y + 1}" x2="${rx + 32 + 20 * k}" y2="${y + 1}" stroke="#fff" stroke-opacity="0.5" stroke-width="3" stroke-dasharray="1 8" stroke-linecap="round"/>`;
    g += num(rx + 32 + 20 * k + 6, y + 6, cost, { size: real ? 16 : 12, fill: real ? OL : '#fff', op: real ? 1 : 0.55 });
    return g;
  };
  let b = `<circle cx="${rx}" cy="${ry}" r="6" fill="#fff" fill-opacity="0.85"/>`;
  b += lbl(rx, ry + 16, '1 TB OF', { anchor: 'middle', size: 5, op: 0.55 });
  b += lbl(rx, ry + 24, 'SHUFFLE', { anchor: 'middle', size: 5, op: 0.55 });
  b += limb(40, 'SAME ZONE · PRIVATE IPs', '$0', false);
  b += limb(120, 'ACROSS ZONES · $0.01/GB EACH WAY', '~$20', true);
  b += lbl(rx + 32, 152, 'BAR LENGTH = DOLLARS · AWS EC2 PRICING PAGE', { size: 5 });
  return svg(200, 158, b, 856);
}

// ── 4. BROADCAST ─────────────────────────────────────────────────
// Claim: broadcast the small side and the big table never moves. Four big
// partitions stay where they are (stroked); one small table is copied to each
// (orange source, dashed copies); the shuffle they'd otherwise need is a
// round-dotted ghost.
function drawBroadcastCopies() {
  const n = 4, x0 = 22, pitch = 44, py = 70, pw = 34, ph = 48;
  let b = '';
  const sx = 100, sy = 12;
  b += `<rect x="${sx - 8}" y="${sy}" width="16" height="12" rx="2" fill="${O}"/>`;
  b += lbl(sx + 14, sy + 9, 'SMALL TABLE · UNDER 10MiB', { size: 5, op: 0.7 });
  b += `<g fill="none" stroke="#fff" stroke-opacity="0.32" stroke-width="1.5" stroke-dasharray="4 5">`;
  for (let i = 0; i < n; i++) {
    const cx = x0 + i * pitch + pw / 2;
    b += `<path d="M${sx},${sy + 12} Q${sx},${py - 24} ${cx},${py - 12}"/>`;
  }
  b += `</g>`;
  for (let i = 0; i < n; i++) {
    const x = x0 + i * pitch, cx = x + pw / 2;
    b += `<rect x="${cx - 6}" y="${py - 12}" width="12" height="9" rx="1.5" fill="#fff" fill-opacity="0.75"/>`;
    b += `<rect x="${x}" y="${py}" width="${pw}" height="${ph}" rx="2" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="2"/>`;
    b += `<g stroke="#fff" stroke-opacity="0.18" stroke-width="1.5">`;
    for (let r = 1; r < 6; r++) b += `<line x1="${x + 4}" y1="${py + r * 8}" x2="${x + pw - 4}" y2="${py + r * 8}"/>`;
    b += `</g>`;
  }
  // the shuffle that doesn't happen
  b += `<line x1="${x0 + 4}" y1="${py + ph + 14}" x2="${x0 + 3 * pitch + pw - 4}" y2="${py + ph + 14}" stroke="#fff" stroke-opacity="0.55" stroke-width="3" stroke-dasharray="1 8" stroke-linecap="round"/>`;
  b += lbl(x0, py + ph + 28, 'BIG TABLE PARTITIONS STAY PUT · NO EXCHANGE', { size: 5 });
  return svg(200, 150, b, 856);
}

// ── 5. CLOSER ────────────────────────────────────────────────────
// Bookend: the cover's all-to-all lattice comes back as a cluster, dimmed: a
// driver plus four workers with every pair wired (12 directed transfers). Next
// to it, Yeedu mode: one VM holding the whole job, 32 cores drawn, and no line
// leaving the box. The count of crossing lines is the claim: 12 versus 0.
function drawOneVm() {
  let b = '';
  // left: the distributed cluster, mechanism-dim
  const W = [[16, 44], [62, 44], [16, 92], [62, 92]];
  b += lbl(14, 14, 'DRIVER + 4 WORKERS', { size: 5, op: 0.5 });
  b += `<rect x="36" y="20" width="18" height="10" rx="2" fill="none" stroke="#fff" stroke-opacity="0.4" stroke-width="2"/>`;
  b += `<g stroke="#fff" stroke-opacity="0.28" stroke-width="1.5" stroke-dasharray="4 5" fill="none">`;
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
    const [x1, y1] = W[i], [x2, y2] = W[j];
    b += `<path d="M${x1 + 6},${y1 + 6} Q${(x1 + x2) / 2 + 9},${(y1 + y2) / 2 - 9} ${x2 + 6},${y2 + 6}"/>`;
    b += `<path d="M${x1 + 6},${y1 + 6} Q${(x1 + x2) / 2 - 9},${(y1 + y2) / 2 + 9} ${x2 + 6},${y2 + 6}"/>`;
  }
  b += `</g><g fill="#14110d" stroke="#fff" stroke-opacity="0.45" stroke-width="2">`;
  W.forEach(([x, y]) => { b += `<rect x="${x}" y="${y}" width="12" height="12" rx="2"/>`; });
  b += `</g>`;
  b += num(46, 130, '12', { anchor: 'middle', size: 16, op: 0.55 });
  b += lbl(46, 139, 'NETWORK SHUFFLE PATHS', { anchor: 'middle', size: 4.6 });

  // right: one VM, the whole job inside, nothing crossing its edge
  const vx = 112, vy = 20, vw = 78, vh = 92;
  b += lbl(vx, 14, 'YEEDU MODE · ONE VM', { size: 5, fill: OL, op: 1 });
  b += `<rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" rx="4" fill="none" stroke="${O}" stroke-width="3"/>`;
  b += `<g fill="#fff" fill-opacity="0.8">`;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 4; c++)
    b += `<rect x="${vx + 12 + c * 15}" y="${vy + 10 + r * 9.5}" width="9" height="5.5" rx="1"/>`;
  b += `</g>`;
  b += num(vx + vw / 2, 130, '0', { anchor: 'middle', size: 22, fill: OL });
  b += lbl(vx + vw / 2, 139, 'NETWORK SHUFFLE PATHS', { anchor: 'middle', size: 4.6 });
  return svg(200, 144, b, 856);
}

// ── slides ───────────────────────────────────────────────────────
const qr = BLOG_URL ? await makeQr(BLOG_URL, 150) : '';
const CTA = 'Run your heaviest shuffle job in Yeedu mode';
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
    notes: 'Cover — claim: every map task writes a block for every reducer, so 6 maps × 6 reducers = 36 transfers across the stage boundary. All-to-all lattice, one reducer inbound in orange (flattened into a stage timeline on the closer)',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Spark shuffle performance')}
      ${headline(`Every map task talks to ${em('every reducer')}`, 46)}
      ${well(drawAllToAll(), { card: false })}
      ${caption(`Joins, groupBy, distinct, window functions and repartition all force it. Each block is serialized, written to local disk, sent over the network and read back.`)}
    `, 'A'),
  },
  {
    notes: 'Skew — claim: 95% of tasks finished in ~4 minutes while 1–2 ran past 40 (dev.to practitioner, single production run, PySpark 3.x). Forty task bars to one time scale, two orange stragglers',
    html: stage(`
      ${eyebrow('Skewed join keys')}
      ${headline('95% done in 4 minutes, two took 40', 48)}
      ${well(drawStragglers())}
      ${caption(`One practitioner's PySpark join, traced to a handful of hot customer keys. The cluster stays up and billed while two tasks finish.`)}
    `, 'B'),
  },
  {
    notes: 'Cross-zone transfer — claim: 1 TB of shuffle across availability zones ≈ $20 ($0.01/GB each direction, AWS EC2 pricing page at time of writing); same zone over private IPs is free. Two-outcome fork, costly limb lower, bar to scale vs round-dotted ghost bar',
    html: stage(`
      ${eyebrow('Spark shuffle costs')}
      ${headline('A terabyte across zones costs about $20', 44)}
      ${well(drawZoneFork(), { card: false })}
      ${caption(`AWS lists inter-AZ transfer at $0.01/GB in each direction, so a shuffle round trip runs about $0.02/GB. Keep the cluster in one zone and that line disappears.`)}
    `, 'C'),
  },
  {
    notes: 'Broadcast — claim: broadcasting the small side (under the 10MiB default threshold) leaves the big table where it is. Copies fan out from one orange source, big partitions stay stroked, the exchange is a round-dotted ghost (Spark SQL docs)',
    html: stage(`
      ${eyebrow('Control partitioning to reduce shuffle')}
      ${headline('Ship the small table, leave the big one', 44)}
      ${well(drawBroadcastCopies(), { pad: 34 })}
      ${caption(`Spark broadcasts tables under autoBroadcastJoinThreshold, 10MiB by default. Bucketing both sides on the join key and selecting columns early cut what's left to move.`)}
    `, 'D'),
  },
  {
    notes: 'Closer — claim: Yeedu mode (with Turbo) runs the entire Spark job on a single VM, so nothing is partitioned across machines and no shuffle crosses the network (facts pack, no figure attached). Bookend: the cover lattice returns as a dim driver + 4 workers with 12 network paths vs one orange VM with 0; CTA pill + sales@yeedu.io (QR when BLOG_URL is set)',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Yeedu mode')}
      ${headline('One VM, zero network shuffle', 50)}
      ${well(drawOneVm(), { card: false })}
      ${caption(`Distributed Spark was built for 2–4 GB machines. Yeedu mode runs the whole job on one VM with the Turbo engine, so nothing is partitioned across machines. Jobs that need a cluster keep one.`)}
      ${cta}
    `, 'C'),
  },
];

const NAME = 'How Spark Shuffle Impacts Performance and Cloud Costs';

if (OLD_ID) await deleteCarousel(OLD_ID);
const id = await buildCarousel(NAME, slides);
if (!process.env.SKIP_EXPORT) await exportDeck(id, NAME);
