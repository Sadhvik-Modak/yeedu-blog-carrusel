// ════════════════════════════════════════════════════════════════
// How to Reduce Cloud Data Platform Costs
// Source: n8n-workflows-v2/output/strategy/2026-09-01-how-to-reduce-cloud-data-platform-costs
//
// 5 slides, 4:5. One bespoke drawing per slide, no shared renderer map.
// Chrome only comes from ./yeedu-chrome.mjs. Every topic number is the
// article's own, carried with its scope (Flexera 2026, S3 us-east-1 pricing,
// the six teams' published results). Usage curves and tier step heights are
// drawn dashed and labelled illustrative. The Yeedu closer carries only the
// article's Yeedu section and the facts pack's CAPABILITY lines (runs in the
// customer's own cloud account, job as the unit of adoption, federated
// catalog, fixed annual licence) and no Yeedu performance or savings figure.
// ════════════════════════════════════════════════════════════════
import {
  C, stage, logoMark, eyebrow, headline, em, caption, well, svg,
  makeQr, ctaPill, buildCarousel, deleteCarousel, exportDeck,
} from './yeedu-chrome.mjs';

const BLOG_URL = null; // not published yet — set the live URL and re-run to add the QR
const OLD_ID = process.env.OLD_ID || 'e3d49c75-416d-4106-baa6-2abb1397bb0d';

const O = C.orange, OL = C.orangeLight;

const lbl = (x, y, t, { anchor = 'start', fill = '#fff', op = 0.42, size = 6.2 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter" font-size="${size}" font-weight="600" letter-spacing="0.9" fill="${fill}" opacity="${op}">${t}</text>`;
const txt = (x, y, t, { anchor = 'start', fill = '#fff', op = 0.75, size = 5.2, weight = 500 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter" font-size="${size}" font-weight="${weight}" fill="${fill}" opacity="${op}">${t}</text>`;
const num = (x, y, t, { anchor = 'start', fill = '#fff', op = 1, size = 14, weight = 800 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Montserrat" font-size="${size}" font-weight="${weight}" letter-spacing="-0.4" fill="${fill}" opacity="${op}">${t}</text>`;

// ── 1. COVER ─────────────────────────────────────────────────────
// Claim: of every 100 dollars of cloud spend, 29 were wasted in 2026
// (Flexera 2026 State of the Cloud), the first rise in five years. 100 marks
// actually drawn, the last 29 orange. The closer reuses the grid of marks as
// a grid of jobs with one pulled out.
function drawWastedHundred() {
  const gx = 8, gy = 14, p = 9, s = 7.2;
  let b = '';
  for (let i = 0; i < 100; i++) {
    const c = i % 10, r = Math.floor(i / 10);
    const wasted = i >= 71;
    b += wasted
      ? `<rect x="${gx + c * p}" y="${gy + r * p}" width="${s}" height="${s}" rx="1.2" fill="${O}"/>`
      : `<rect x="${gx + c * p}" y="${gy + r * p}" width="${s}" height="${s}" rx="1.2" fill="#fff" fill-opacity="0.22"/>`;
  }
  b += lbl(gx, gy - 5, 'EVERY $100 OF CLOUD SPEND', { size: 4.4, op: 0.55 });
  // bracket from the orange block to the number
  const bx = gx + 10 * p + 4;
  b += `<path d="M${bx},${gy + 7 * p} L${bx + 4},${gy + 7 * p} L${bx + 4},${gy + 10 * p - 1.8} L${bx},${gy + 10 * p - 1.8}" fill="none" stroke="${O}" stroke-width="1.5"/>`;
  b += `<line x1="${bx + 4}" y1="${gy + 8.5 * p}" x2="${bx + 10}" y2="${gy + 8.5 * p}" stroke="${O}" stroke-width="1.5"/>`;
  b += num(bx + 13, gy + 8.5 * p + 10, '$29', { size: 30, fill: OL });
  b += lbl(bx + 13, gy + 8.5 * p + 21, 'WASTED IN 2026', { size: 4.6, op: 0.9, fill: OL });
  // the trend note, top right
  b += lbl(bx + 13, gy + 14, 'FIRST RISE IN', { size: 4.4, op: 0.55 });
  b += lbl(bx + 13, gy + 21, 'FIVE YEARS', { size: 4.4, op: 0.55 });
  b += `<path d="M${bx + 13},${gy + 30} L${bx + 30},${gy + 36} L${bx + 47},${gy + 42} L${bx + 64},${gy + 47}" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="1.5" stroke-dasharray="2 3"/>`;
  b += `<path d="M${bx + 64},${gy + 47} L${bx + 78},${gy + 38}" fill="none" stroke="${O}" stroke-width="2.5" stroke-linecap="round"/>`;
  b += `<circle cx="${bx + 78}" cy="${gy + 38}" r="2" fill="${O}"/>`;
  b += lbl(bx + 13, gy + 55, 'TREND SHAPE ILLUSTRATIVE', { size: 3.6, op: 0.4 });
  b += lbl(gx, gy + 10 * p + 26, 'SOURCE: FLEXERA 2026 STATE OF THE CLOUD REPORT', { size: 4, op: 0.45 });
  return svg(200, 132, b, 856);
}

// ── 2. STORAGE TIERS ─────────────────────────────────────────────
// Claim: the same gigabyte costs less as it ages through tiers. Top: S3
// Standard $0.023/GB vs Intelligent-Tiering frequent access $0.0125/GB on one
// scale (first 50 TB/month, us-east-1). Bottom: the article's lifecycle rule
// as a staircase on a 365-day axis; step heights are illustrative.
function drawTierStaircase() {
  const x0 = 10, k = 170 / 0.023;
  let b = '';
  b += lbl(x0, 8, 'S3 STANDARD', { size: 4.8, op: 0.8 });
  b += `<rect x="${x0}" y="12" width="${0.023 * k}" height="14" rx="2" fill="#fff" fill-opacity="0.82"/>`;
  b += txt(x0 + 5, 21.6, '$0.023 / GB', { size: 5.4, fill: '#14110d', op: 1, weight: 700 });
  b += lbl(x0, 38, 'S3 INTELLIGENT-TIERING, FREQUENT ACCESS', { size: 4.8, op: 0.8 });
  b += `<rect x="${x0}" y="42" width="${0.0125 * k}" height="14" rx="2" fill="${O}"/>`;
  b += txt(x0 + 5, 51.6, '$0.0125 / GB', { size: 5.4, fill: '#fff', op: 1, weight: 700 });
  b += lbl(x0 + 0.0125 * k + 5, 51.4, 'NO PER-TIER RETRIEVAL FEE', { size: 4, op: 0.55 });
  b += lbl(x0, 65, 'FIRST 50 TB / MONTH · US-EAST-1', { size: 3.8, op: 0.45 });

  // lifecycle staircase
  const ax = x0, ay = 150, aw = 180, d = (days) => ax + (days / 365) * aw;
  b += `<line x1="${ax}" y1="74" x2="190" y2="74" stroke="#fff" stroke-opacity="0.12" stroke-width="1"/>`;
  b += lbl(ax, 86, 'ONE LIFECYCLE RULE ON LOGS/', { size: 4.8, op: 0.8 });
  const steps = [
    { a: 0, z: 30, h: 46, name: 'STANDARD', c: '#fff', op: 0.82 },
    { a: 30, z: 90, h: 28, name: 'STANDARD_IA', c: OL, op: 0.75 },
    { a: 90, z: 365, h: 12, name: 'GLACIER', c: O, op: 1 },
  ];
  steps.forEach(({ a, z, h, c, op }) => {
    b += `<rect x="${d(a)}" y="${ay - h}" width="${d(z) - d(a) - 0.8}" height="${h}" rx="1" fill="${c}" fill-opacity="${op}"/>`;
  });
  b += lbl(d(0), ay - 49, 'STANDARD', { size: 3.8, op: 0.7 });
  b += lbl(d(30) + 1, ay - 31, 'IA', { size: 3.8, op: 0.8, fill: OL });
  b += lbl(d(90) + 4, ay - 15, 'GLACIER', { size: 3.8, op: 1, fill: OL });
  // expiry marker
  b += `<line x1="${d(365)}" y1="${ay - 30}" x2="${d(365)}" y2="${ay}" stroke="#fff" stroke-opacity="0.6" stroke-width="1.2" stroke-dasharray="1 2.5" stroke-linecap="round"/>`;
  b += lbl(d(365), ay - 33, 'EXPIRE', { anchor: 'end', size: 3.8, op: 0.7 });
  b += `<line x1="${ax}" y1="${ay}" x2="${d(365)}" y2="${ay}" stroke="#fff" stroke-opacity="0.35" stroke-width="1"/>`;
  [[0, '0', 'start'], [30, '30', 'middle'], [90, '90', 'middle'], [365, '365', 'end']].forEach(([t, s, a]) => {
    b += lbl(d(t), ay + 8, s, { anchor: a, size: 3.8, op: 0.55 });
  });
  b += lbl(d(365), ay + 17, 'DAYS', { anchor: 'end', size: 3.6, op: 0.45 });
  b += lbl(ax, ay + 17, 'STEP HEIGHTS ILLUSTRATIVE', { size: 3.6, op: 0.4 });
  return svg(200, 170, b, 856);
}

// ── 3. IDLE COMPUTE ──────────────────────────────────────────────
// Claim: the same workday bills three different ways depending on the
// mechanism. A 24h axis, one illustrative usage pattern repeated per lane;
// the billed shape is what changes. Autoscaling keeps a floor all night,
// auto-suspend tracks the queries, a scheduled pause leaves only storage.
function drawIdleNight() {
  const x0 = 10, w = 180, h2x = (h) => x0 + (h / 24) * w;
  const busy = [[9, 12], [13, 18]];
  const lanes = [
    { y: 14, name: 'MULTI-NODE AUTOSCALING', sub: 'Floor at min_workers, never zero' },
    { y: 62, name: 'SNOWFLAKE AUTO_SUSPEND', sub: 'Billed per second, 60-second minimum' },
    { y: 110, name: 'REDSHIFT PAUSE AT 20:00', sub: 'Compute stops, storage still billed' },
  ];
  const lh = 26;
  let b = '';
  lanes.forEach(({ y, name, sub }, i) => {
    b += lbl(x0, y - 3, name, { size: 4.6, op: 0.9, fill: i === 0 ? '#fff' : OL });
    b += txt(190, y - 3, sub, { anchor: 'end', size: 4.2, op: 0.55 });
    const base = y + lh;
    b += `<line x1="${x0}" y1="${base}" x2="${x0 + w}" y2="${base}" stroke="#fff" stroke-opacity="0.25" stroke-width="1"/>`;
    // billed shape
    if (i === 0) {
      b += `<rect x="${x0}" y="${base - 9}" width="${w}" height="9" fill="#fff" fill-opacity="0.32"/>`;
      busy.forEach(([a, z]) => { b += `<rect x="${h2x(a)}" y="${base - 22}" width="${h2x(z) - h2x(a)}" height="13" fill="#fff" fill-opacity="0.32"/>`; });
      b += lbl(h2x(1), base - 3, 'BILLED OVERNIGHT', { size: 3.6, op: 0.8 });
      b += lbl(h2x(19), base - 3, 'BILLED', { size: 3.6, op: 0.8 });
    } else if (i === 1) {
      busy.forEach(([a, z]) => { b += `<rect x="${h2x(a)}" y="${base - 22}" width="${h2x(z) - h2x(a)}" height="22" fill="${O}" fill-opacity="0.85"/>`; });
    } else {
      b += `<rect x="${h2x(0)}" y="${base - 2}" width="${w}" height="2" fill="#fff" fill-opacity="0.5"/>`;
      b += `<rect x="${h2x(8)}" y="${base - 22}" width="${h2x(20) - h2x(8)}" height="20" fill="${O}" fill-opacity="0.85"/>`;
      b += `<line x1="${h2x(20)}" y1="${base - 26}" x2="${h2x(20)}" y2="${base + 2}" stroke="${OL}" stroke-width="1.2" stroke-dasharray="1 2" stroke-linecap="round"/>`;
      b += lbl(h2x(20) + 3, base - 5, 'STORAGE ONLY', { size: 3.6, op: 0.75 });
    }
    // the shared usage pattern, dashed outline
    busy.forEach(([a, z]) => {
      b += `<rect x="${h2x(a)}" y="${base - 22}" width="${h2x(z) - h2x(a)}" height="22" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="0.8" stroke-dasharray="2 2"/>`;
    });
  });
  const ay = 110 + lh;
  [[0, '00:00', 'start'], [6, '06:00', 'middle'], [12, '12:00', 'middle'], [18, '18:00', 'middle'], [24, '24:00', 'end']].forEach(([t, s, a]) => {
    b += lbl(h2x(t), ay + 8, s, { anchor: a, size: 3.8, op: 0.5 });
  });
  b += lbl(x0, ay + 17, 'DASHED = SAME ILLUSTRATIVE WORKDAY IN EVERY LANE', { size: 3.8, op: 0.45 });
  return svg(200, 156, b, 856);
}

// ── 4. SIX TEAMS, SIX LEVERS ─────────────────────────────────────
// Claim: six published cost wins came from six different levers, none from a
// platform swap. One bar per team on a 0-100% scale, each labelled with its
// own base. "More than" results get a dotted tail past the bar end. The
// attribution lever is the orange one, tying back to the cover.
function drawLeverResults() {
  const x0 = 10, bw = 120, k = bw / 100;
  const rows = [
    { v: 80, more: true, val: '>80%', lever: 'BLOB GRS TO LRS, PLUS COMPUTE', scope: 'Storage and compute cost · retail' },
    { v: 60, more: true, val: '>60%', lever: 'TRINO ON GRAVITON, AUTOSCALING', scope: 'That cluster\'s cost · payments' },
    { v: 50, more: true, val: '>50%', lever: 'ROWS SORTED BEFORE COMPRESSION', scope: 'File size, largest Hive tables · ride-hailing' },
    { v: 50, val: '50%', lever: 'TAGS ENFORCED IN TERRAFORM', scope: 'Monthly platform cost · website builder', hot: true },
    { v: 50, val: '50%', lever: 'KAFKA CDC READS, FASTER VACUUM', scope: 'Whole platform, seven months · lending' },
    { v: 10, more: true, val: '>10%', lever: 'TTL FROM 180-DAY ACCESS LOOKBACK', scope: 'Warehouse storage footprint · streaming' },
  ];
  let b = '';
  rows.forEach(({ v, more, val, lever, scope, hot }, i) => {
    const y = 14 + i * 27;
    b += lbl(x0, y, lever, { size: 4.2, op: hot ? 1 : 0.85, fill: hot ? OL : '#fff' });
    b += `<rect x="${x0}" y="${y + 3}" width="${v * k}" height="9" rx="1.5" fill="${hot ? O : '#fff'}" fill-opacity="${hot ? 1 : 0.7}"/>`;
    if (more) b += `<line x1="${x0 + v * k + 1.5}" y1="${y + 7.5}" x2="${x0 + v * k + 10}" y2="${y + 7.5}" stroke="#fff" stroke-opacity="0.6" stroke-width="1.4" stroke-dasharray="1 2" stroke-linecap="round"/>`;
    b += num(x0 + bw + 14, y + 11.5, val, { size: 10, fill: hot ? OL : '#fff' });
    b += txt(x0, y + 18.5, scope, { size: 3.9, op: 0.55 });
  });
  b += `<line x1="${x0 + bw}" y1="2" x2="${x0 + bw}" y2="${14 + 6 * 27 - 6}" stroke="#fff" stroke-opacity="0.15" stroke-width="0.8" stroke-dasharray="2 2"/>`;
  b += lbl(x0 + bw, 4, '100%', { anchor: 'middle', size: 3.6, op: 0.4 });
  b += lbl(x0, 182, 'EACH TEAM\'S OWN PUBLISHED RESULT · DIFFERENT BASES', { size: 3.6, op: 0.45 });
  return svg(200, 186, b, 856);
}

// ── 5. CLOSER ────────────────────────────────────────────────────
// Bookend: the cover's grid of marks returns as a grid of jobs inside the
// customer's own cloud account. One CPU-bound job is pulled to the Yeedu
// execution layer; the catalog, notebooks, dashboards and DAGs stay where they
// are, and Yeedu reads the catalog in place. Pricing: a metered line beside a
// flat licence line, no figures. No Yeedu number anywhere.
function drawOneJobPilot() {
  let b = '';
  b += `<rect x="3" y="4" width="194" height="128" rx="5" fill="none" stroke="#fff" stroke-opacity="0.4" stroke-width="1.5" stroke-dasharray="4 4"/>`;
  b += lbl(10, 14, 'YOUR AWS, AZURE OR GCP ACCOUNT', { size: 4.4, op: 0.55 });
  // job grid
  const gx = 12, gy = 26, p = 8, s = 6;
  const pick = [2, 1];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
    const hot = c === pick[0] && r === pick[1];
    b += hot
      ? `<rect x="${gx + c * p}" y="${gy + r * p}" width="${s}" height="${s}" rx="1" fill="none" stroke="${O}" stroke-width="1" stroke-dasharray="1 1.5"/>`
      : `<rect x="${gx + c * p}" y="${gy + r * p}" width="${s}" height="${s}" rx="1" fill="#fff" fill-opacity="0.3"/>`;
  }
  b += lbl(gx, gy + 4 * p + 6, 'SPARK JOBS', { size: 3.8, op: 0.55 });
  // the moved job travelling right
  const jx = gx + pick[0] * p + s / 2, jy = gy + pick[1] * p + s / 2;
  b += `<path d="M${jx + 3},${jy} C${jx + 40},${jy} 92,${jy} 118,${jy}" fill="none" stroke="${O}" stroke-width="2"/>`;
  b += `<rect x="96" y="${jy - 3.5}" width="7" height="7" rx="1" fill="${O}"/>`;
  b += lbl(89, jy - 6, 'ONE CPU-BOUND JOB', { anchor: 'middle', size: 3.8, fill: OL, op: 1 });
  // Yeedu execution layer
  b += `<rect x="120" y="22" width="70" height="30" rx="4" fill="${O}" fill-opacity="0.14" stroke="${O}" stroke-width="2.2"/>`;
  b += lbl(126, 33, 'YEEDU EXECUTION', { size: 4.4, fill: OL, op: 1 });
  b += lbl(126, 40, 'LAYER', { size: 4.4, fill: OL, op: 1 });
  b += txt(126, 47.5, 'PySpark · Pandas · DuckDB', { size: 3.9, op: 0.7 });
  // what stays put
  const stay = ['Catalog: Unity, Hive Metastore or Glue', 'Notebooks and BI dashboards', 'Airflow or Prefect DAGs'];
  b += lbl(gx, 82, 'STAYS WHERE IT IS', { size: 4.2, op: 0.7 });
  stay.forEach((t, i) => {
    const y = 88 + i * 11;
    b += `<rect x="${gx}" y="${y}" width="96" height="8" rx="1.5" fill="#fff" fill-opacity="0.08" stroke="#fff" stroke-opacity="0.35" stroke-width="0.8"/>`;
    b += txt(gx + 4, y + 5.6, t, { size: 3.9, op: 0.8 });
  });
  // catalog read in place
  b += `<path d="M155,52 C155,74 140,92 108,92" fill="none" stroke="${OL}" stroke-width="1.2" stroke-dasharray="1 2.5" stroke-linecap="round"/>`;
  b += lbl(158, 70, 'READS THE', { size: 3.6, op: 0.7, fill: OL });
  b += lbl(158, 76, 'CATALOG', { size: 3.6, op: 0.7, fill: OL });
  b += lbl(158, 82, 'IN PLACE', { size: 3.6, op: 0.7, fill: OL });
  // pricing shape
  b += `<line x1="122" y1="124" x2="190" y2="100" stroke="#fff" stroke-opacity="0.5" stroke-width="1.2" stroke-dasharray="1 2.5" stroke-linecap="round"/>`;
  b += `<line x1="122" y1="114" x2="190" y2="114" stroke="${O}" stroke-width="2.5"/>`;
  b += lbl(190, 98, 'METERED', { anchor: 'end', size: 3.4, op: 0.55 });
  b += lbl(190, 121, 'FLAT LICENCE', { anchor: 'end', size: 3.4, op: 1, fill: OL });
  return svg(200, 136, b, 856);
}

// ── slides ───────────────────────────────────────────────────────
const qr = BLOG_URL ? await makeQr(BLOG_URL, 150) : '';
const CTA = 'Pick one CPU-bound job to pilot';
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
    notes: 'Cover: claim: wasted cloud spend rose to 29% in 2026, the first increase in five years of decline (Flexera 2026 State of the Cloud), tied to AI adoption outpacing tagging and attribution. 100 drawn marks, 29 orange, illustrative trend tick. Grid returns as a job grid on the closer',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Cloud data platform costs')}
      ${headline(`Cloud waste hit ${em('29%')} in 2026`, 54)}
      ${well(drawWastedHundred(), { card: false })}
      ${caption(`Flexera ties the first rise in five years to AI spend outpacing tagging and attribution. Tags can't be applied backwards, so attribution comes before any cut.`)}
    `, 'A'),
  },
  {
    notes: 'Storage tiering: claim: S3 Standard $0.023/GB vs Intelligent-Tiering frequent access $0.0125/GB (first 50 TB/month, us-east-1); lifecycle rule moves logs to IA at 30 days, Glacier at 90, expires at 365. Two bars on one price scale plus a staircase on a 365-day axis, step heights illustrative',
    html: stage(`
      ${eyebrow('Storage tiering')}
      ${headline('Tier storage by access pattern', 50)}
      ${well(drawTierStaircase())}
      ${caption(`Check early-deletion terms first: Azure Cool, Cold and Archive charge if data leaves before 30, 90 and 180 days. BigQuery moves a table to long-term pricing after 90 days with no edits.`)}
    `, 'C'),
  },
  {
    notes: 'Idle compute: claim: autoscaling trims peaks but a multi-node Databricks cluster cannot reach zero; Snowflake auto-suspend bills per second with a 60-second minimum; a Redshift scheduled pause stops compute billing and leaves storage. Three lanes on a 24h axis, same illustrative workday dashed in each, billed shape differs',
    html: stage(`
      ${eyebrow('Idle compute')}
      ${headline('Idle clusters keep billing overnight', 46)}
      ${well(drawIdleNight(), { card: false })}
      ${caption(`Snowflake recommends auto-suspend at 5 to 10 minutes or less. Redshift pauses usually finish within 15 minutes. On BigQuery Enterprise the lever is commitment size, in 50-slot steps.`)}
    `, 'B'),
  },
  {
    notes: 'Six teams: claim: six published cost wins came from six different levers, none from changing platforms: >80% retail (Blob GRS to LRS plus compute), >60% payments Trino on Graviton, >50% file size from row sorting, 50% monthly cost after tag attribution, 50% lending over seven months, >10% storage footprint from TTL. Horizontal bars, each with its own base; attribution bar orange',
    html: stage(`
      ${eyebrow('What six teams changed')}
      ${headline('Six teams cut spend with six levers', 46)}
      ${well(drawLeverResults())}
      ${caption(`None of the six changed platforms. Each matched the lever to what drove its own bill, and each percentage has a different base.`)}
    `, 'D'),
  },
  {
    notes: 'Closer: claim: Yeedu runs inside the customer\'s own AWS, Azure or GCP account; the unit of adoption is a job, so one CPU-bound Spark job moves while catalog (Unity, Hive Metastore, Glue, read in place), notebooks, BI and Airflow/Prefect DAGs stay; fixed annual licence with unlimited usage vs a metered line. Job grid echoes the cover grid. No Yeedu figures. CTA pill + sales@yeedu.com, no QR (no blog URL)',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Yeedu')}
      ${headline('Move one job and leave the estate', 48)}
      ${well(drawOneJobPilot(), { card: false })}
      ${caption(`Yeedu runs Spark jobs inside your own cloud account on a fixed annual licence with unlimited usage. Start with a CPU-bound job, such as a heavy join or aggregation.`)}
      ${cta}
    `, 'C'),
  },
];

const NAME = 'How to Reduce Cloud Data Platform Costs';

if (OLD_ID) await deleteCarousel(OLD_ID);
const id = await buildCarousel(NAME, slides);
if (!process.env.SKIP_EXPORT) await exportDeck(id, NAME);
