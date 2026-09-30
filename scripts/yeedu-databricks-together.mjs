// ════════════════════════════════════════════════════════════════
// Databricks and Yeedu: How They Work Together
// Source: n8n-workflows-v2/output/revise/2026-09-29-databricks-and-yeedu-how-they-work-together/article.md
//
// 6 slides, 4:5. The article's hinge is coexistence: keep Databricks,
// run the 20% of jobs behind half the DBU bill on Yeedu. The deck
// opens on that split, shows what moves and what stays, lists the
// workloads that run unchanged, opens the Turbo engine, draws the
// Airflow failover to Databricks, and closes on the system-tables
// query that finds the first jobs. Every number comes from the article.
// ════════════════════════════════════════════════════════════════
import {
  C, stage, logoMark, eyebrow, headline, em, caption, well, svg, annot,
  makeQr, ctaPill, buildCarousel, deleteCarousel, exportDeck,
} from './yeedu-chrome.mjs';

const BLOG_URL = 'https://yeedu.com/blog/databricks-and-yeedu-how-they-work-together';
const OLD_ID = process.env.OLD_ID || '';   // set to the previous deck's id to replace it

const O = C.orange, OL = C.orangeLight;
const t = (x, y, s, { size = 5.4, weight = 600, fill = '#fff', op = 1, anchor = 'start', ls = 0.6, family = 'Inter' } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${ls}" fill="${fill}" opacity="${op}">${s}</text>`;
const mono = (x, y, s, o = {}) => t(x, y, s, { family: 'JetBrains Mono, Menlo, monospace', weight: 500, ls: 0, ...o });
const box = (x, y, w, h, { hot = false, dash = false, op } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${hot ? O : '#fff'}" fill-opacity="${op ?? (hot ? 0.1 : 0.04)}" stroke="${hot ? O : '#fff'}" stroke-opacity="${hot ? 0.6 : 0.13}"${dash ? ' stroke-dasharray="3 2.5"' : ''}/>`;
const arrow = (x1, y, x2, color = O) =>
  `<path d="M${x1},${y} H${x2 - 4}" stroke="${color}" stroke-width="1.3"/><polygon points="${x2},${y} ${x2 - 5},${y - 2.5} ${x2 - 5},${y + 2.5}" fill="${color}"/>`;

// ── 1. COVER ─────────────────────────────────────────────────────
// Claim: a fifth of the jobs carry half the bill. 100 cells stand in
// for 1,000 jobs; 20 are orange, and the bar beside them is half full.
function drawSplit() {
  let b = '';
  b += t(8, 10, '1,000 PRODUCTION JOBS ON DATABRICKS', { size: 5, ls: 0.9, op: 0.4 });
  for (let i = 0; i < 100; i++) {
    const x = 8 + (i % 10) * 10.4, y = 16 + Math.floor(i / 10) * 10.4;
    const hot = i < 20;
    b += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="8.2" height="8.2" rx="1.6" fill="${hot ? O : '#fff'}" fill-opacity="${hot ? 0.95 : 0.09}"/>`;
  }
  // bill bar
  b += t(128, 22, 'SHARE OF THE DBU BILL', { size: 4.6, weight: 700, op: 0.5, ls: 0.5 });
  b += `<rect x="128" y="27" width="22" height="88" rx="3" fill="#fff" fill-opacity="0.08"/>`;
  b += `<rect x="128" y="71" width="22" height="44" rx="3" fill="${O}"/>`;
  b += t(156, 96, 'up to', { size: 5, weight: 500, op: 0.6, ls: 0 });
  b += t(156, 108, '50%', { size: 12, weight: 800, fill: OL, family: 'Montserrat', ls: -0.2 });
  b += t(156, 48, 'the other', { size: 5, weight: 500, op: 0.45, ls: 0 });
  b += t(156, 56, '80% of jobs', { size: 5, weight: 500, op: 0.45, ls: 0 });
  b += t(8, 128, '20% of jobs, in orange', { size: 5, weight: 600, fill: OL, ls: 0 });
  b += annot(8, 146, { label: 'RUN ONLY THOSE ON YEEDU', value: 'about 60%', note: 'lower production cost in Yeedu customer case studies' });
  return svg(200, 182, b);
}

// ── 2. WHAT MOVES, WHAT STAYS ────────────────────────────────────
// Claim: code travels with a utility; data never travels at all.
function drawMoves() {
  let b = '';
  // code column
  b += box(6, 4, 90, 112);
  b += t(14, 16, 'YOUR CODE MOVES', { size: 5, weight: 700, op: 0.6, ls: 0.6 });
  const code = [['Notebooks', 'open format, import/export'], ['Git folders', 'same GitHub repos'], ['DBFS mounts', 'recreated by utility'], ['dbutils calls', 'fs and secrets handled'], ['Workflows', 'same schedules, task order']];
  code.forEach(([a, c], i) => {
    const y = 28 + i * 17;
    b += t(14, y, a, { size: 5.4, weight: 700, op: 0.9, ls: 0 });
    b += t(14, y + 7, c, { size: 4.4, weight: 500, op: 0.45, ls: 0 });
  });
  // data column
  b += box(104, 4, 90, 112, { hot: true });
  b += t(112, 16, 'YOUR DATA STAYS', { size: 5, weight: 700, fill: OL, ls: 0.6 });
  const data = [['Unity Catalog', 'read as a foreign catalog'], ['Grants and RBAC', 'via each user’s PAT'], ['Lineage and audit', 'still logged in Databricks'], ['Delta tables', 'shared, read and write'], ['dbutils.secrets', 'S3, ADLS, Kafka, JDBC']];
  data.forEach(([a, c], i) => {
    const y = 28 + i * 17;
    b += t(112, y, a, { size: 5.4, weight: 700, op: 0.95, ls: 0 });
    b += t(112, y + 7, c, { size: 4.4, weight: 500, fill: OL, op: 0.7, ls: 0 });
  });
  b += annot(8, 134, { label: 'NO DATA MIGRATION PROJECT', value: 'zero copies', note: 'no duplicated tables, no duplicated metadata' });
  return svg(200, 170, b);
}

// ── 3. WHAT RUNS ON YEEDU ────────────────────────────────────────
// Claim: almost 95% of typical Databricks work runs unchanged; the
// one gap is named, not hidden.
function drawWorkloads() {
  let b = '';
  const rows = [
    ['BATCH ETL / ELT', 'PySpark, Spark SQL, Scala as is'],
    ['STREAMING', 'Structured Streaming on Kafka, Pub/Sub'],
    ['AUTO LOADER', 'over 50% cost cut in customer results'],
    ['ML INFERENCE', 'Yeedu Functions as REST endpoints'],
    ['MODEL TRAINING', 'MLflow-compatible workloads'],
    ['BI AND SQL', 'Thrift over JDBC/ODBC, ready in under 20s'],
  ];
  rows.forEach(([a, c], i) => {
    const y = 4 + i * 17;
    b += box(6, y, 188, 14, { op: 0.035 });
    b += `<circle cx="14" cy="${y + 7}" r="1.8" fill="${O}"/>`;
    b += t(20, y + 9, a, { size: 5, weight: 700, op: 0.85, ls: 0.5 });
    b += t(78, y + 9, c, { size: 4.9, weight: 500, op: 0.6, ls: 0 });
  });
  b += box(6, 110, 188, 20, { dash: true, op: 0.02 });
  b += t(14, 118.5, 'THE ONE GAP', { size: 4.4, weight: 700, op: 0.5, ls: 0.6 });
  b += t(14, 126, 'No no-code connectors: write them with open-source PySpark ones', { size: 4.6, weight: 500, op: 0.65, ls: 0 });
  b += annot(8, 146, { label: 'TYPICAL DATABRICKS JOBS', value: 'almost 95%', note: 'across data engineering, data science and analytics' });
  return svg(200, 182, b);
}

// ── 4. INSIDE TURBO ──────────────────────────────────────────────
// Claim: the saving comes from the engine, and each number carries
// its workload scope.
function drawTurbo() {
  let b = '';
  // stack
  b += box(6, 4, 188, 16);
  b += t(100, 14.5, 'YOUR SPARK CODE  ·  PySpark  ·  Spark SQL  ·  Scala', { size: 4.8, weight: 700, anchor: 'middle', op: 0.7, ls: 0.3 });
  b += `<path d="M100,20 V26" stroke="#fff" stroke-opacity="0.3"/>`;
  b += `<rect x="6" y="26" width="188" height="44" rx="5" fill="${O}" fill-opacity="0.16" stroke="${O}" stroke-width="1.2"/>`;
  b += t(14, 37, 'TURBO  ·  C++ EXECUTION LAYER', { size: 5.4, weight: 800, fill: OL, ls: 0.6 });
  const parts = ['Columnar', 'SIMD', 'L2/L3 cache', 'Plan rewrite'];
  parts.forEach((p, i) => {
    const x = 14 + i * 44.5;
    b += `<rect x="${x}" y="44" width="40" height="18" rx="3" fill="#000" fill-opacity="0.25" stroke="${O}" stroke-opacity="0.4"/>`;
    b += t(x + 20, 55, p, { size: 4.1, weight: 600, anchor: 'middle', op: 0.85, ls: 0 });
  });
  b += `<path d="M100,70 V76" stroke="#fff" stroke-opacity="0.3"/>`;
  b += box(6, 76, 188, 16);
  b += t(100, 86.5, 'YOUR VPC  ·  AWS  ·  AZURE  ·  GCP  ·  OCI  ·  ON-PREM', { size: 4.8, weight: 700, anchor: 'middle', op: 0.7, ls: 0.3 });

  // two scoped claims
  [['4–10×', 'FASTER', 'CPU-bound: joins, aggregations,', 'multi-stage transforms'], ['2–4×', 'CLUSTER EFFICIENCY', 'I/O-bound: Smart Scheduling', 'fills idle CPU on reads, writes']].forEach(([v, l, n1, n2], i) => {
    const x = 6 + i * 96;
    b += t(x + 2, 116, v, { size: 16, weight: 800, fill: OL, family: 'Montserrat', ls: -0.4 });
    b += t(x + 2, 126, l, { size: 4.8, weight: 700, op: 0.6, ls: 0.6 });
    b += t(x + 2, 135, n1, { size: 4.5, weight: 500, op: 0.5, ls: 0 });
    b += t(x + 2, 142, n2, { size: 4.5, weight: 500, op: 0.5, ls: 0 });
  });
  b += t(6, 158, 'Vendor-reported. CPU-bound work is 30–40% of a typical mix.', { size: 4.8, weight: 500, fill: OL, op: 0.8, ls: 0 });
  return svg(200, 164, b);
}

// ── 5. FAILOVER ──────────────────────────────────────────────────
// Claim: Databricks stays as the safety net for SLA-critical jobs.
// Drawn as the Airflow DAG the article describes.
function drawFailover() {
  let b = '';
  b += t(8, 10, 'AIRFLOW DAG  ·  SLA-CRITICAL JOB', { size: 5, ls: 0.9, op: 0.4 });
  b += box(6, 18, 70, 30, { hot: true });
  b += t(41, 30, 'YEEDU TASK', { size: 5.6, weight: 800, anchor: 'middle', fill: OL, ls: 0.6 });
  b += t(41, 40, 'runs first', { size: 4.6, weight: 500, anchor: 'middle', op: 0.6, ls: 0 });
  b += arrow(76, 33, 122, '#fff');
  b += t(99, 28, 'one_failed', { size: 4.4, weight: 600, anchor: 'middle', op: 0.6, ls: 0, family: 'JetBrains Mono, Menlo, monospace' });
  b += box(124, 18, 70, 30);
  b += t(159, 30, 'DATABRICKS', { size: 5.6, weight: 800, anchor: 'middle', op: 0.85, ls: 0.6 });
  b += t(159, 40, 'reruns on failure', { size: 4.6, weight: 500, anchor: 'middle', op: 0.5, ls: 0 });

  b += `<rect x="6" y="58" width="188" height="36" rx="5" fill="#000" fill-opacity="0.3" stroke="#fff" stroke-opacity="0.1"/>`;
  b += mono(12, 70, 'fallback = DatabricksRunNowOperator(', { size: 4.8, op: 0.85 });
  b += mono(20, 78, 'task_id="dbx_fallback", job_id=...,', { size: 4.8, op: 0.6 });
  b += mono(20, 86, 'trigger_rule="one_failed")', { size: 4.8, fill: OL, op: 0.95 });

  b += t(8, 108, 'ALSO', { size: 4.6, weight: 700, op: 0.45, ls: 0.8 });
  b += t(8, 118, 'Prefect orchestrates both too. Spark compute boots from', { size: 4.9, weight: 500, op: 0.65, ls: 0 });
  b += t(8, 126, 'your own golden image, inside your VPC.', { size: 4.9, weight: 500, op: 0.65, ls: 0 });
  b += annot(8, 142, { label: 'IF A YEEDU RUN FAILS', value: 'auto rerun', note: 'on Databricks, only when the Yeedu task fails' });
  return svg(200, 178, b);
}

// ── 6. CLOSER ────────────────────────────────────────────────────
// Claim: Databricks already knows which jobs to move. Three system
// tables, one query, top 50 jobs.
function drawQuery() {
  let b = '';
  const tables = ['system.billing.usage', 'system.billing.list_prices', 'system.lakeflow.jobs'];
  tables.forEach((s, i) => {
    const y = 4 + i * 15;
    b += box(6, y, 106, 12, { op: 0.05 });
    b += mono(11, y + 8, s, { size: 4.7, op: 0.8 });
    b += `<path d="M112,${y + 6} H124 V26" fill="none" stroke="${O}" stroke-opacity="0.6"/>`;
  });
  b += arrow(124, 26, 138);
  b += `<rect x="140" y="10" width="54" height="32" rx="5" fill="${O}" fill-opacity="0.18" stroke="${O}" stroke-width="1.2"/>`;
  b += t(167, 24, 'TOP 50 JOBS', { size: 5.2, weight: 800, anchor: 'middle', fill: OL, ls: 0.5 });
  b += t(167, 34, 'by cost, 30 days', { size: 4.4, weight: 500, anchor: 'middle', op: 0.65, ls: 0 });
  b += annot(8, 70, { label: 'YOUR FIRST CANDIDATES', value: 'top 50', note: 'jobs by estimated list cost, from data you already have' });
  return svg(200, 104, b);
}

// ── SLIDES ───────────────────────────────────────────────────────
const qr = await makeQr(BLOG_URL, 150);

const slides = [
  {
    notes: 'Cover: 20% of jobs, up to half the DBU bill',
    html: stage(
      logoMark(34) +
      eyebrow('Databricks + Yeedu') +
      headline(`Keep Databricks. ${em('Offload the 20%.')}`, 54) +
      caption('A fifth of your Databricks jobs can drive half the DBU bill. Run just those on Yeedu and leave the lakehouse where it is.') +
      well(drawSplit()),
      'A'
    ),
  },
  {
    notes: 'What moves and what stays',
    html: stage(
      eyebrow('Code and data') +
      headline(`Code moves. ${em('Data stays put.')}`, 54) +
      caption('A migration utility carries notebooks, DBFS mounts, dbutils and Workflows. Unity Catalog, grants and Delta tables never move.') +
      well(drawMoves()),
      'B'
    ),
  },
  {
    notes: 'Workloads: almost 95% run unchanged',
    html: stage(
      eyebrow('Workload coverage') +
      headline(`Batch to BI, ${em('no rewrites')}`, 54) +
      caption('Batch, streaming, Auto Loader, MLflow and BI dashboards run on Yeedu. The one gap is named up front.') +
      well(drawWorkloads()),
      'C'
    ),
  },
  {
    notes: 'Inside the Turbo engine, scoped claims',
    html: stage(
      eyebrow('Inside Turbo') +
      headline(`Same Spark jobs, ${em('less compute')}`, 54) +
      caption('A C++ vectorized engine underneath the Spark API, deployed in your own cloud account. Each gain is scoped to the work it applies to.') +
      well(drawTurbo()),
      'D'
    ),
  },
  {
    notes: 'Airflow failover to Databricks',
    html: stage(
      eyebrow('SLA safety net') +
      headline(`Databricks stays ${em('the fallback')}`, 54) +
      caption('For jobs with SLAs you cannot miss, one Airflow trigger rule reruns a failed Yeedu task on Databricks.') +
      well(drawFailover()),
      'A'
    ),
  },
  {
    notes: 'Closer: find the first jobs with system tables, CTA and QR',
    html: stage(
      logoMark(34) +
      eyebrow('Where to start') +
      headline(`Databricks knows ${em('what to move')}`, 52) +
      caption('One query over three system tables lists your 50 costliest jobs. Those are the first to run on Yeedu.') +
      well(drawQuery()) +
      `<div style="display:flex;align-items:center;justify-content:space-between;gap:36px;margin-top:34px;">
         <div>
           ${ctaPill('Get the query and a pilot plan')}
           <div style="margin-top:18px;font-size:21px;font-weight:600;color:${C.text2};">sales@yeedu.io</div>
         </div>
         <div style="text-align:center;">
           ${qr}
           <div style="margin-top:10px;font-size:14px;letter-spacing:0.6px;color:${C.text3};">Read the full guide</div>
         </div>
       </div>`,
      'C'
    ),
  },
];

// ── BUILD ────────────────────────────────────────────────────────
const NAME = 'Databricks and Yeedu Together';

if (OLD_ID) { console.log('Removing superseded deck…'); await deleteCarousel(OLD_ID); }
const id = await buildCarousel(NAME, slides);
await exportDeck(id, NAME);
