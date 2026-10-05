// ════════════════════════════════════════════════════════════════
// Airflow Dynamic Task Mapping and the Scheduler Load It Creates
// Source: n8n technical-deep-dive, 2026-08-10 (not published yet)
// Topic numbers come from apache/airflow #45991, #46044, #28478, #36454,
// #26172 as cited in the post. No Yeedu stat appears outside the fact sheet.
//
// 5 slides, 4:5. One bespoke drawing per slide. Chrome only from
// ./yeedu-chrome.mjs. Vocabulary: a task-count bar under a 1024 rule,
// broken on the cover and completed as five batches on the closer.
// ════════════════════════════════════════════════════════════════
import {
  C, stage, logoMark, eyebrow, headline, em, caption, well, svg, annot,
  makeQr, ctaPill, buildCarousel, deleteCarousel, exportDeck,
} from './yeedu-chrome.mjs';

const BLOG_URL = null; // not published yet — set the live URL and re-run to add the QR
const OLD_ID = 'a96ec16e-d4c6-4091-a2ae-6df8ac9890b9';

const O = C.orange, OL = C.orangeLight;

// small SVG text shorthand, local to this deck
const txt = (x, y, s, { size = 6.2, weight = 600, family = 'Inter', fill = '#fff', op = 1, anchor = 'start', ls = 0 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${ls}" fill="${fill}"${op < 1 ? ` opacity="${op}"` : ''}>${s}</text>`;

// ── 1. COVER ─────────────────────────────────────────────────────
// Claim: a mapped run breaks at 500 tasks while the 1024 cap is still far off.
// Track = the allowed range (stroked container), bar length ∝ task count,
// orange fracture at 500, dotted ghost for the headroom nobody reaches.
function drawBreakBeforeCap() {
  const x = n => 12 + (n * 164) / 1024;          // 1024 lands on x=176
  const top = 62, bot = 88, mid = 75;
  let b = '';
  // the allowed range
  b += `<rect x="12" y="${top}" width="164" height="${bot - top}" rx="3" fill="none" stroke="#fff" stroke-opacity="0.22" stroke-width="2"/>`;
  // task-count bar up to the break
  b += `<rect x="12" y="${top}" width="${x(500) - 8 - 12}" height="${bot - top}" rx="3" fill="#fff" fill-opacity="0.38"/>`;
  // the fracture, then two displaced shards
  const bx = x(500);
  b += `<g fill="${O}">`;
  b += `<polygon points="${bx - 8},${top} ${bx + 1},${top} ${bx - 3},68.5 ${bx + 4},${mid} ${bx - 2},81.5 ${bx + 2},${bot} ${bx - 8},${bot}"/>`;
  b += `<polygon points="${bx + 6},66 ${bx + 11},69.5 ${bx + 6.5},72.5"/>`;
  b += `<polygon points="${bx + 8},79 ${bx + 13},83 ${bx + 7.5},86"/>`;
  b += `</g>`;
  // headroom that never gets used
  b += `<line x1="${bx + 18}" y1="${mid}" x2="171" y2="${mid}" stroke="#fff" stroke-opacity="0.45" stroke-width="2.5" stroke-dasharray="1 8" stroke-linecap="round"/>`;
  // the limit: solid, because it is real
  b += `<line x1="176" y1="40" x2="176" y2="110" stroke="#fff" stroke-opacity="0.62" stroke-width="2.5"/>`;
  b += txt(171, 45, 'max_map_length = 1024', { size: 6.4, weight: 600, op: 0.7, anchor: 'end' });
  b += txt(171, 54, 'DEFAULT CAP', { size: 5.6, op: 0.42, anchor: 'end', ls: 0.9 });
  // axis
  b += `<line x1="12" y1="104" x2="186" y2="104" stroke="#fff" stroke-opacity="0.16" stroke-width="1.5"/>`;
  [[0, 0.4], [100, 0.4], [500, 1], [1024, 0.7]].forEach(([n, op]) => {
    b += `<line x1="${x(n)}" y1="104" x2="${x(n)}" y2="108" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5"/>`;
    b += txt(x(n), 116, n, { size: 7, weight: 700, family: 'Montserrat', anchor: 'middle', fill: n === 500 ? OL : '#fff', op });
  });
  b += annot(12, 136, { label: 'AIRFLOW 2.10.4 · ISSUE #45991', value: '500 tasks', note: 'wall time already 8× the 100-task run' });
  return svg(200, 172, b, 900);
}

// ── 2. SUPERLINEAR WALL TIME ─────────────────────────────────────
// Claim: 5× the tasks took 8× the wall time, because parallelism fell 9 → 5.
// Lane count = effective parallelism, lane height ∝ wall time (70s vs 560s).
function drawWallTimeLanes() {
  const y0 = 24, k = 150 / 560, ax = 28, pitch = 7, w = 4;
  const y = s => y0 + s * k;
  let b = '';
  // time axis, downward
  b += `<line x1="${ax}" y1="${y0}" x2="${ax}" y2="${y(560)}" stroke="#fff" stroke-opacity="0.16" stroke-width="1.5"/>`;
  [[0, '0'], [70, '70s'], [560, '560s']].forEach(([s, l]) => {
    b += `<line x1="${ax - 3}" y1="${y(s)}" x2="${ax}" y2="${y(s)}" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5"/>`;
    b += txt(ax - 6, y(s) + 2.3, l, { size: 6.4, weight: 700, family: 'Montserrat', anchor: 'end', op: 0.5 });
  });
  // faint level guides so the eye can compare the two run ends
  b += `<line x1="${ax}" y1="${y(70)}" x2="150" y2="${y(70)}" stroke="#fff" stroke-opacity="0.08" stroke-width="1"/>`;
  b += `<line x1="${ax}" y1="${y(560)}" x2="150" y2="${y(560)}" stroke="#fff" stroke-opacity="0.08" stroke-width="1"/>`;

  // 100 tasks: nine short lanes
  const ax1 = 40;
  b += txt(ax1, 17, '100 TASKS', { size: 6.2, op: 0.5, ls: 0.8 });
  b += `<g fill="#fff" fill-opacity="0.45">`;
  for (let i = 0; i < 9; i++) b += `<rect x="${ax1 + i * pitch}" y="${y0}" width="${w}" height="${(70 * k).toFixed(2)}" rx="1"/>`;
  b += `</g>`;
  b += txt(ax1, y(70) + 11, '~9× PARALLEL', { size: 5.6, op: 0.42, ls: 0.8 });

  // 500 tasks: five long lanes
  const ax2 = 124;
  b += txt(ax2, 17, '500 TASKS', { size: 6.2, fill: OL, ls: 0.8 });
  b += `<g fill="${O}">`;
  for (let i = 0; i < 5; i++) b += `<rect x="${ax2 + i * pitch}" y="${y0}" width="${w}" height="${(560 * k).toFixed(2)}" rx="1"/>`;
  b += `</g>`;
  // left of the lanes: to the right it ran off the card
  b += txt(ax2 - 6, y(560) - 3, '~5× PARALLEL', { size: 5.6, op: 0.42, ls: 0.8, anchor: 'end' });

  b += annot(ax1, 112, { label: '5× THE TASKS', value: '8×', note: 'the wall time' });
  return svg(200, 182, b, 800);
}

// ── 3. SCHEDULER FUNNEL ──────────────────────────────────────────
// Claim: hundreds of ready task instances leave the loop 16 at a time, every 8.49s.
// Ragged comb (the backlog) → dim funnel (quadratic dependency check) → 16 marks.
function drawSchedulerFunnel() {
  let b = '';
  b += txt(10, 8, 'READY TASK INSTANCES', { size: 6, op: 0.42, ls: 0.9 });
  // ragged comb, 180 marks
  const N = 180, x0 = 10, x1 = 190, base = 58;
  b += `<g stroke="#fff" stroke-opacity="0.32" stroke-width="0.6" stroke-linecap="round">`;
  for (let i = 0; i < N; i++) {
    const xx = (x0 + (i * (x1 - x0)) / (N - 1)).toFixed(2);
    const t = 16 + ((i * 37) % 23) + ((i * 11) % 7);
    b += `<line x1="${xx}" y1="${t}" x2="${xx}" y2="${base}"/>`;
  }
  b += `</g>`;
  // funnel: the mechanism, dim
  b += `<path d="M8,66 L192,66 L134,112 L66,112 Z" fill="none" stroke="#fff" stroke-opacity="0.25" stroke-width="2"/>`;
  b += txt(100, 83, 'TriggerRuleDep', { size: 6.6, weight: 600, anchor: 'middle', op: 0.55 });
  b += txt(100, 93, 'finished × schedulable, per loop', { size: 5.4, weight: 400, anchor: 'middle', op: 0.42 });
  // the loop boundary and its 16 marks
  b += `<rect x="62" y="118" width="76" height="36" rx="4" fill="none" stroke="#fff" stroke-opacity="0.4" stroke-width="2"/>`;
  b += `<g stroke="${O}" stroke-width="2.6" stroke-linecap="round">`;
  for (let i = 0; i < 16; i++) { const xx = 70 + i * 4; b += `<line x1="${xx}" y1="125" x2="${xx}" y2="147"/>`; }
  b += `</g>`;
  b += annot(10, 172, { label: 'SCHEDULER LOOP', value: '8.49 s', note: 'mini-scheduler skipped, rows locked', color: '#fff' });
  b += annot(190, 172, { label: 'PER LOOP', value: '16', note: 'default batch', anchor: 'end' });
  return svg(200, 206, b, 740);
}

// ── 4. THE NEXT WALL ─────────────────────────────────────────────
// Claim: raising the cap walks the run into the next failure, three walls deep.
// Log task-count axis, three solid walls; the orange run passes through gaps
// where a limit was raised and stops dead on the third.
function drawNextWall() {
  const ly = n => 184 - (Math.log10(n) - 2) * 50;
  const px0 = 34, py0 = 184, px1 = 110, py1 = ly(100000);
  const xAt = yy => px0 + ((py0 - yy) / (py0 - py1)) * (px1 - px0);
  let b = '';
  // axis
  b += `<line x1="24" y1="190" x2="24" y2="22" stroke="#fff" stroke-opacity="0.16" stroke-width="1.5"/>`;
  [[100, '100'], [1000, '1K'], [10000, '10K'], [100000, '100K']].forEach(([n, l]) => {
    b += `<line x1="21" y1="${ly(n)}" x2="24" y2="${ly(n)}" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5"/>`;
    b += txt(18, ly(n) + 2.2, l, { size: 6, weight: 700, family: 'Montserrat', anchor: 'end', op: 0.42 });
  });
  b += txt(30, 10, 'MAPPED TASKS · LOG SCALE', { size: 5.6, op: 0.36, ls: 0.9 });

  const WALLS = [
    { n: 1024,   v: '1,024',    ref: 'default cap',   note: 'task fails past max_map_length', gap: true },
    { n: 5000,   v: '~5,000',   ref: '#28478',        note: 'Postgres: stack depth limit exceeded', gap: true },
    { n: 100000, v: '~100,000', ref: '#36454',        note: '1–3 s DAG parse times out at 10 min', gap: false },
  ];
  WALLS.forEach(wl => {
    const wy = ly(wl.n), cx = xAt(wy);
    const right = 196;                            // every wall ends inside the card
    if (wl.gap) {
      b += `<line x1="30" y1="${wy}" x2="${cx - 6}" y2="${wy}" stroke="#fff" stroke-opacity="0.5" stroke-width="2.5"/>`;
      b += `<line x1="${cx + 6}" y1="${wy}" x2="${right}" y2="${wy}" stroke="#fff" stroke-opacity="0.5" stroke-width="2.5"/>`;
    } else {
      b += `<line x1="30" y1="${wy}" x2="${right}" y2="${wy}" stroke="#fff" stroke-opacity="0.62" stroke-width="2.5"/>`;
    }
    b += `<text x="196" y="${wy - 12}" text-anchor="end" font-family="Montserrat" font-size="9" font-weight="800" fill="#fff">${wl.v}<tspan font-family="Inter" font-size="5.6" font-weight="600" fill-opacity="0.45" dx="4">${wl.ref}</tspan></text>`;
    b += txt(196, wy - 4.5, wl.note, { size: 5.6, weight: 400, anchor: 'end', op: 0.6 });
  });
  // the run
  b += `<line x1="${px0}" y1="${py0}" x2="${px1}" y2="${py1}" stroke="${O}" stroke-width="3.6" stroke-linecap="round"/>`;
  b += `<circle cx="${px0}" cy="${py0}" r="2.4" fill="${O}"/>`;
  b += `<circle cx="${px1}" cy="${py1}" r="4.2" fill="${O}"/>`;
  return svg(200, 196, b, 780);
}

// ── 5. CLOSER ────────────────────────────────────────────────────
// Bookend: the cover's one bar under the 1024 rule, completed. A 5,000-wide
// expand (dotted, it never runs) becomes five sequential DagRuns, each ≤ 1024.
function drawBatchesUnderCap() {
  const x = n => 14 + (n * 172) / 5000;          // 1024 → 49.2, 5000 → 186
  const BATCHES = [1024, 1024, 1024, 1024, 5000 - 4 * 1024];
  const rule = x(1024);
  let b = '';
  // the rejected shape
  b += `<line x1="14" y1="24" x2="186" y2="24" stroke="#fff" stroke-opacity="0.42" stroke-width="3" stroke-dasharray="1 8" stroke-linecap="round"/>`;
  b += txt(186, 35, 'ONE 5,000-WIDE EXPAND', { size: 5.8, anchor: 'end', op: 0.42, ls: 0.9 });
  // the same limit as the cover
  b += `<line x1="${rule}" y1="12" x2="${rule}" y2="132" stroke="#fff" stroke-opacity="0.62" stroke-width="2.5"/>`;
  b += txt(rule + 5, 8, 'max_map_length = 1024', { size: 6, op: 0.62 });
  // run order flows downward
  b += `<line x1="7" y1="50" x2="7" y2="118" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="4 5"/>`;
  b += `<path d="M4,115 L7,120 L10,115" fill="none" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5" stroke-linecap="round"/>`;
  BATCHES.forEach((n, i) => {
    const yy = 46 + i * 17, xe = x(n);
    b += `<rect x="14" y="${yy}" width="${(xe - 14).toFixed(1)}" height="10" rx="2" fill="${O}"/>`;
    b += txt((xe - 2.5).toFixed(1), yy + 7.2, n.toLocaleString('en-US'), { size: 5.6, weight: 700, family: 'Montserrat', anchor: 'end' });
    b += txt(rule + 5, yy + 7, `DagRun ${i + 1}`, { size: 5.6, weight: 500, op: 0.45 });
  });
  b += annot(192, 64, { label: 'MAX_ACTIVE_RUNS=1', value: '5 batches', note: '5,000 items, one run at a time', anchor: 'end' });
  return svg(200, 136, b, 900);
}

// ── slides ───────────────────────────────────────────────────────
const qr = BLOG_URL ? await makeQr(BLOG_URL, 150) : '';

const cta = BLOG_URL
  ? `<div style="display:flex;align-items:center;justify-content:space-between;gap:32px;margin-top:22px;">
       <div>
         ${ctaPill('Send us one Spark job to run 4–10× faster')}
         <div style="margin-top:16px;font-size:21px;color:${C.text2};font-weight:500;">sales@yeedu.io</div>
       </div>
       <div style="text-align:center;">
         ${qr}
         <div style="margin-top:8px;font-size:13px;color:${C.text3};letter-spacing:0.6px;">READ THE POST</div>
       </div>
     </div>`
  : `<div style="display:flex;align-items:center;justify-content:space-between;gap:28px;margin-top:30px;padding-top:28px;border-top:1px solid ${C.rule};">
       ${ctaPill('Send us one Spark job to run 4–10× faster')}
       <div style="font-size:22px;color:${C.text2};font-weight:500;">sales@yeedu.io</div>
     </div>`;

const slides = [
  {
    notes: 'Cover — claim: mapped runs break at 500 tasks, far under the 1024 cap. Archetype: bar growing toward a limit rule, orange fracture + dotted headroom (bookended on slide 5)',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Airflow · dynamic task mapping')}
      ${headline(`Mapped tasks stall ${em('well before 1024')}`, 46)}
      ${well(drawBreakBeforeCap(), { card: false })}
      ${caption(`The scheduler checks dependencies and writes state one task instance at a time, so a wide mapped run sags while the default cap still looks far off.`)}
    `, 'A'),
  },
  {
    notes: 'Superlinear wall time — claim: 5× tasks → 8× wall time as parallelism falls 9 → 5 (#45991). Archetype: proportional lanes, lane count = parallelism, lane height ∝ wall time',
    html: stage(`
      ${eyebrow('Issue #45991 · Airflow 2.10.4')}
      ${headline('5x the tasks, 8x the wall time', 54)}
      ${well(drawWallTimeLanes())}
      ${caption(`Measured on the stock Docker Compose deployment. Effective parallelism fell from about 9× to 5×, and 500 tasks isn't even half the default cap.`)}
    `, 'B'),
  },
  {
    notes: 'Scheduler funnel — claim: hundreds of ready task instances leave each 8.49s loop 16 at a time; TriggerRuleDep is quadratic (#46044). Archetype: ragged comb → funnel → thin output (vertical)',
    html: stage(`
      ${eyebrow('Inside the scheduler loop')}
      ${headline('16 task instances per 8.5s loop', 52)}
      ${well(drawSchedulerFunnel())}
      ${caption(`TriggerRuleDep loops over every finished task instance for each schedulable one, so the check grows quadratically. The mini-scheduler gets skipped because the rows it needs are locked (discussion #46044).`)}
    `, 'C'),
  },
  {
    notes: 'The next wall — claim: raising max_map_length walks the run into Postgres stack depth (~5,000, #28478) then a 10-min DAG parse timeout (~100,000, #36454). Archetype: rise through stacked limit rules on a log axis',
    html: stage(`
      ${eyebrow('Past max_map_length')}
      ${headline('Raising the cap finds the next wall', 48)}
      ${well(drawNextWall())}
      ${caption(`Issue #29959 split that bulk UPDATE into batches and raised the ceiling again. Each task instance still gets its dependencies checked on its own.`)}
    `, 'D'),
  },
  {
    notes: 'Closer — claim: 5,000 items as five sequential DagRuns of ≤1024 (max_active_runs=1) stay under the cap. Archetype: convergence bookend completing the cover bar + rule; bridge to one Spark job on Yeedu; CTA pill + sales@yeedu.io (QR when BLOG_URL is set)',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Expand of expands')}
      ${headline('Run one batch of 1024 at a time', 52)}
      ${well(drawBatchesUnderCap(), { card: false })}
      ${caption(`The post says to size fan-out like a Spark shuffle, and each mapped item starts its own Python interpreter (#26172). We'd move that per-item work into one Spark job and run it on Yeedu with zero rewrites.`)}
      ${cta}
    `, 'B'),
  },
];

const NAME = 'Airflow Dynamic Task Mapping — Scheduler Load';

if (OLD_ID) await deleteCarousel(OLD_ID);
const id = await buildCarousel(NAME, slides);
if (!process.env.SKIP_EXPORT) await exportDeck(id, NAME);
