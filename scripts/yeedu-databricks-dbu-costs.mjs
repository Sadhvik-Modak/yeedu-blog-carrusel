// ════════════════════════════════════════════════════════════════
// How to Reduce Databricks DBU Costs in 2026
// Source: n8n-workflows-v2/output/strategy/2026-09-01-how-to-reduce-databricks-dbu-costs-in-2026
//
// 5 slides, 4:5. One bespoke drawing per slide, no shared renderer map.
// Chrome only comes from ./yeedu-chrome.mjs. Topic numbers are the blog's
// cited sources (select.dev client engagement, Databricks docs and blog);
// contract rates are one client's and labelled illustrative. The Yeedu
// closer carries capabilities only, no Yeedu figure.
// ════════════════════════════════════════════════════════════════
import {
  C, stage, logoMark, eyebrow, headline, em, caption, well, svg,
  makeQr, ctaPill, buildCarousel, deleteCarousel, exportDeck,
} from './yeedu-chrome.mjs';

const BLOG_URL = null; // not given; set the live URL and re-run to add the QR
const OLD_ID = process.env.OLD_ID || '184791cc-c865-44a2-9829-cb6a16d8f015';

const O = C.orange, OL = C.orangeLight;

const lbl = (x, y, t, { anchor = 'start', fill = '#fff', op = 0.42, size = 6.2 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter" font-size="${size}" font-weight="600" letter-spacing="0.9" fill="${fill}" opacity="${op}">${t}</text>`;
const num = (x, y, t, { anchor = 'start', fill = '#fff', op = 1, size = 14, weight = 800 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Montserrat" font-size="${size}" font-weight="${weight}" letter-spacing="-0.4" fill="${fill}" opacity="${op}">${t}</text>`;

// ── 1. COVER ─────────────────────────────────────────────────────
// Claim: run frequency beat every per-cluster tweak. 472 runs a day drawn as
// 472 dots; one an hour drawn as 24 orange dots. Count encoded as marks.
// The closer echoes this: a field of many jobs, only a few move.
function drawRunFrequency() {
  const x0 = 12, p = 4.5;
  let b = lbl(10, 9, 'BEFORE · 472 RUNS A DAY', { size: 4.8, op: 0.6 });
  b += `<g fill="#fff" fill-opacity="0.5">`;
  for (let i = 0; i < 472; i++) {
    const c = i % 40, r = Math.floor(i / 40);
    b += `<circle cx="${x0 + c * p}" cy="${18 + r * p}" r="1.35"/>`;
  }
  b += `</g>`;
  b += lbl(10, 85, 'AFTER · ONE RUN AN HOUR · 24 A DAY', { size: 4.8, fill: OL, op: 1 });
  b += `<g fill="${O}">`;
  for (let i = 0; i < 24; i++) b += `<circle cx="${x0 + i * p}" cy="94" r="1.6"/>`;
  b += `</g>`;
  b += num(10, 124, '~95% lower cost', { size: 17, fill: OL });
  b += num(10, 140, 'about $19,000 a year', { size: 9, weight: 600, op: 0.85 });
  b += lbl(10, 152, 'ONE JOB · ONE CLIENT ENGAGEMENT (SELECT.DEV)', { size: 4.4, op: 0.42 });
  return svg(200, 156, b, 856);
}

// ── 2. RATE SPREAD ───────────────────────────────────────────────
// Claim: the same work bills at different DBU rates by compute type. Bar
// length = $/DBU on one client's contract (select.dev). All-purpose in orange.
function drawRateSpread() {
  const rows = [
    ['ALL-PURPOSE · INTERACTIVE CLUSTERS', 0.55, true],
    ['JOBS SERVERLESS', 0.45, false],
    ['JOBS CLASSIC', 0.30, false],
  ];
  const k = 140 / 0.55;
  let b = '';
  rows.forEach(([t, v, hot], i) => {
    const y = 18 + i * 38;
    b += lbl(10, y, t, { size: 4.8, op: hot ? 0.9 : 0.6, fill: hot ? OL : '#fff' });
    b += hot
      ? `<rect x="10" y="${y + 5}" width="${v * k}" height="16" rx="2" fill="${O}"/>`
      : `<rect x="10" y="${y + 5}" width="${v * k}" height="16" rx="2" fill="#fff" fill-opacity="0.7"/>`;
    b += num(10 + v * k + 5, y + 18, `$${v.toFixed(2)}`, { size: 11, fill: hot ? OL : '#fff' });
  });
  b += lbl(10, 136, 'PER DBU, ONE CLIENT CONTRACT (SELECT.DEV)', { size: 4.4, op: 0.55 });
  b += lbl(10, 144, 'ILLUSTRATIVE · YOUR RATES LIVE IN LIST_PRICES', { size: 4.4, op: 0.42 });
  return svg(200, 148, b, 856);
}

// ── 3. AUTO-STOP TIMELINE ────────────────────────────────────────
// Claim: a 5-minute query against the 120-minute SQL warehouse default bills
// for about two hours. Two identical timelines; only the idle tail differs.
// The tightened row's missing tail is a dotted ghost.
function drawAutoStop() {
  const X = (m) => 12 + m * 1.38;
  const yA = 22, yB = 66, h = 14;
  let b = '';
  b += lbl(12, yA - 6, 'SQL WAREHOUSE DEFAULT · AUTO-STOP 120 MIN', { size: 4.8, op: 0.6 });
  b += `<rect x="${X(0)}" y="${yA}" width="${X(5) - X(0)}" height="${h}" rx="1.5" fill="#fff" fill-opacity="0.9"/>`;
  b += `<rect x="${X(5) + 1}" y="${yA}" width="${X(125) - X(5) - 1}" height="${h}" rx="1.5" fill="${O}"/>`;
  b += lbl((X(5) + X(125)) / 2, yA + 9.5, 'IDLE AND STILL BILLING', { anchor: 'middle', size: 4.8, fill: '#14110d', op: 1 });

  b += lbl(12, yB - 6, 'TIGHTENED · AUTO-STOP 10 MIN', { size: 4.8, op: 0.6 });
  b += `<rect x="${X(0)}" y="${yB}" width="${X(5) - X(0)}" height="${h}" rx="1.5" fill="#fff" fill-opacity="0.9"/>`;
  b += `<rect x="${X(5) + 1}" y="${yB}" width="${X(15) - X(5) - 1}" height="${h}" rx="1.5" fill="${O}"/>`;
  b += `<rect x="${X(15) + 2}" y="${yB + 1}" width="${X(125) - X(15) - 3}" height="${h - 2}" rx="1.5" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="1.6" stroke-dasharray="1 5" stroke-linecap="round"/>`;
  b += lbl((X(15) + X(125)) / 2, yB + 9.5, 'STOPPED, NOTHING BILLED', { anchor: 'middle', size: 4.6, op: 0.5 });

  // axis
  const ay = 96;
  b += `<line x1="${X(0)}" y1="${ay}" x2="${X(125)}" y2="${ay}" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5"/>`;
  [0, 30, 60, 90, 120].forEach((m) => {
    b += `<line x1="${X(m)}" y1="${ay}" x2="${X(m)}" y2="${ay + 3}" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5"/>`;
    b += lbl(X(m), ay + 10, m === 120 ? '120 MIN' : String(m), { anchor: m === 0 ? 'start' : 'middle', size: 4.6, op: 0.5 });
  });
  b += lbl(12, 122, 'WHITE = THE 5-MINUTE QUERY · ORANGE = IDLE BILLING', { size: 4.4, op: 0.55 });
  b += lbl(12, 130, 'COST OF THE SHORT SETTING: 1 TO 3 MIN COLD START', { size: 4.4, op: 0.42 });
  return svg(200, 134, b, 856);
}

// ── 4. ORDER OF WORK ─────────────────────────────────────────────
// Claim: work the bill cheapest fix first; each step touches fewer jobs and
// carries more risk, and the engine test is reserved for the handful left.
// Rows of job ticks narrow from the whole fleet to fewer than ten (orange).
function drawFixOrder() {
  const steps = [
    ['AUTO-TERMINATION + POLICY CAPS', 'EVERY CLUSTER · NO RISK TO CORRECTNESS', 42],
    ['ALL-PURPOSE TO JOBS COMPUTE', 'SCHEDULED WORK · 2 TO 3X CHEAPER PER DATABRICKS', 28],
    ['DELTA LAYOUT, PHOTON, SPOT', 'EVALUATED JOB BY JOB, NOT FLEET-WIDE', 15],
    ['TEST A DIFFERENT ENGINE', 'ONLY THE FEW JOBS STILL TOPPING THE ROLLUP', 7],
  ];
  let b = '';
  steps.forEach(([t, s, n], i) => {
    const y = 10 + i * 38, last = i === steps.length - 1;
    b += num(10, y + 15, String(i + 1), { size: 16, fill: last ? OL : '#fff', op: last ? 1 : 0.85 });
    b += lbl(26, y + 4, t, { size: 4.8, fill: last ? OL : '#fff', op: last ? 1 : 0.75 });
    b += `<g stroke="${last ? O : '#fff'}" stroke-opacity="${last ? 1 : 0.6}" stroke-width="${last ? 2.4 : 1.8}">`;
    for (let j = 0; j < n; j++) b += `<line x1="${27 + j * 3.8}" y1="${y + 9}" x2="${27 + j * 3.8}" y2="${y + 18}"/>`;
    b += `</g>`;
    b += lbl(26, y + 26, s, { size: 4.2, op: 0.45 });
  });
  b += lbl(10, 162, 'TICK = ONE JOB IN SCOPE · SCHEMATIC COUNTS', { size: 4.2, op: 0.42 });
  return svg(200, 165, b, 856);
}

// ── 5. CLOSER ────────────────────────────────────────────────────
// Bookend of the cover's field of dots: a grid of jobs that stays put, three
// dotted gaps where CPU-bound jobs left, and those three landing in orange on
// a Yeedu execution layer inside the customer's own cloud account. No figures.
function drawJobLevelAdoption() {
  const cols = 16, rows = 4, x0 = 12, y0 = 24, px = 11, py = 10;
  const moved = [[1, 3], [2, 9], [0, 13]];
  const isMoved = (r, c) => moved.some(([a, d]) => a === r && d === c);
  let b = lbl(10, 16, 'NOTEBOOKS, DASHBOARDS, DAGS AND OTHER JOBS STAY', { size: 4.4, op: 0.55 });
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = x0 + c * px, y = y0 + r * py;
    b += isMoved(r, c)
      ? `<rect x="${x}" y="${y}" width="8" height="6" rx="1" fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="1.2" stroke-dasharray="1 2.5" stroke-linecap="round"/>`
      : `<rect x="${x}" y="${y}" width="8" height="6" rx="1" fill="#fff" fill-opacity="0.4"/>`;
  }
  const by = 82;
  b += `<rect x="10" y="${by}" width="180" height="30" rx="3" fill="none" stroke="${OL}" stroke-opacity="0.6" stroke-width="2"/>`;
  moved.forEach(([r, c]) => {
    // routed down the gutter beside the column so the line never crosses a job that stays
    const cx = x0 + c * px, x = cx + 9.5, ym = y0 + r * py + 3;
    b += `<path d="M${cx + 8},${ym} H${x} V${by + 6}" fill="none" stroke="${O}" stroke-width="1.6"/>`;
    b += `<rect x="${x - 6}" y="${by + 6}" width="12" height="8" rx="1.2" fill="${O}"/>`;
  });
  b += lbl(16, by + 25, 'YEEDU EXECUTION LAYER · YOUR CLOUD ACCOUNT', { size: 4.6, fill: OL, op: 1 });
  b += lbl(10, 124, 'ORANGE: CPU-BOUND JOBS, JOINS AND AGGREGATIONS', { size: 4.2, op: 0.55 });
  b += lbl(10, 132, 'CATALOG READ IN PLACE: UNITY, HIVE METASTORE, GLUE', { size: 4.2, op: 0.55 });
  return svg(200, 135, b, 760);
}

// ── slides ───────────────────────────────────────────────────────
const qr = BLOG_URL ? await makeQr(BLOG_URL, 150) : '';
const CTA = 'Pilot your costliest DBU job on Yeedu';
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
    notes: 'Cover: run frequency outweighs per-cluster tuning; one select.dev client job cut from 472 runs a day to one an hour, cost down ~95%, about $19,000 a year. Count-as-marks: 472 dots vs 24 orange dots (closer echoes the field of marks)',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Databricks DBU costs')}
      ${headline(`472 runs a day, ${em('cut to 24')}`, 54)}
      ${well(drawRunFrequency(), { card: false })}
      ${caption(`One job in a select.dev client engagement went from 472 runs a day to one an hour and cost roughly 95% less. Check run frequency and idle time before touching instance types.`)}
    `, 'A'),
  },
  {
    notes: 'Rate spread: same work bills at different DBU rates by compute type; one client contract $0.55 all-purpose, $0.45 jobs serverless, $0.30 jobs classic (illustrative); Databricks states jobs compute is 2 to 3x cheaper than all-purpose. Bar length = $/DBU',
    html: stage(`
      ${eyebrow('Compute type')}
      ${headline('Same work, three DBU rates', 54)}
      ${well(drawRateSpread())}
      ${caption(`Databricks puts jobs compute at 2 to 3 times cheaper than all-purpose for equivalent work. Scheduled production jobs left on interactive clusters pay that gap on every run.`)}
    `, 'B'),
  },
  {
    notes: 'Auto-stop: SQL warehouse auto-stop defaults to 120 min, so a 5-minute query leaves it idle and billing for nearly two hours vs ~10 min tightened; cluster auto-termination has no default at all. Two identical timelines, orange idle tail, dotted ghost where the tightened one stops',
    html: stage(`
      ${eyebrow('Idle compute')}
      ${headline('A 5-minute query, 2 hours billed', 48)}
      ${well(drawAutoStop(), { card: false })}
      ${caption(`SQL warehouse auto-stop ships at 120 minutes. Cluster auto-termination has no default at all, so an idle cluster runs and bills until someone sets an inactivity period.`)}
    `, 'C'),
  },
  {
    notes: 'Order of work: cheapest fix first. Auto-termination and policy caps, then all-purpose to jobs compute, then Delta layout, Photon and spot per job, then test a different engine on the fewer-than-ten jobs topping system.billing.usage. Rows of job ticks narrowing to a few orange ones (schematic counts)',
    html: stage(`
      ${eyebrow('Order of work')}
      ${headline(`Cheapest fix first, ${em('engine last')}`, 52)}
      ${well(drawFixOrder())}
      ${caption(`A monthly rollup of system.billing.usage usually shows fewer than ten jobs holding a disproportionate share of DBU spend. Those are the only ones worth an engine test.`)}
    `, 'D'),
  },
  {
    notes: 'Closer: Yeedu is a Spark execution layer in the customer\'s own cloud account; the unit of adoption is a job; catalog (Unity, Hive Metastore, Glue) read in place; fixed annual licence, unlimited usage. No Yeedu figures. Bookend of cover dot field: grid of jobs stays, three CPU-bound jobs drop onto an orange layer; CTA pill + sales@yeedu.com',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Where Yeedu fits')}
      ${headline('Move a job, keep the estate', 52)}
      ${well(drawJobLevelAdoption(), { card: false })}
      ${caption(`Yeedu runs Spark jobs inside your own AWS, Azure or GCP account and reads your existing catalog directly. Point the CPU-bound jobs topping your bill at it. Licensing is a fixed annual rate for unlimited usage.`)}
      ${cta}
    `, 'C'),
  },
];

const NAME = 'How to Reduce Databricks DBU Costs in 2026';

if (OLD_ID) await deleteCarousel(OLD_ID);
const id = await buildCarousel(NAME, slides);
if (!process.env.SKIP_EXPORT) await exportDeck(id, NAME);
