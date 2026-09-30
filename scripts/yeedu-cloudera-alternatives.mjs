// ════════════════════════════════════════════════════════════════
// Best Cloudera Alternatives for 2026
// Source: n8n-workflows-v2/output/revise/2026-09-25-best-cloudera-alternatives-for-2026/article.md
//
// 6 slides, 4:5. The article's hinge is data residency: whether the
// workload can leave your hardware decides the shortlist before price
// does. The deck opens on that fork, prices what Cloudera actually
// costs, gives the four buyer's-guide questions, maps who runs
// on-prem (text labels, no ticks), lands Yeedu job by job, and closes
// on a one-week measurement. Every number comes from the article.
// ════════════════════════════════════════════════════════════════
import {
  C, stage, logoMark, eyebrow, headline, em, caption, well, svg, annot,
  makeQr, ctaPill, buildCarousel, deleteCarousel, exportDeck,
} from './yeedu-chrome.mjs';

const BLOG_URL = 'https://yeedu.com/blog/best-cloudera-alternatives-for-2026';
const OLD_ID = process.env.OLD_ID || '';   // set to the previous deck's id to replace it

const O = C.orange, OL = C.orangeLight;
const t = (x, y, s, { size = 5.4, weight = 600, fill = '#fff', op = 1, anchor = 'start', ls = 0.6, family = 'Inter' } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${ls}" fill="${fill}" opacity="${op}">${s}</text>`;
const chipRow = (x, y, chips, { hot = [], size = 4.5, h = 10.5 } = {}) => {
  let b = '', cx = x;
  chips.forEach((c) => {
    const w = c.length * size * 0.74 + 9, on = hot.includes(c);
    b += `<rect x="${cx.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${h}" rx="2.5" fill="${on ? O : '#fff'}" fill-opacity="${on ? 1 : 0.08}" stroke="${on ? O : '#fff'}" stroke-opacity="${on ? 1 : 0.16}"/>`;
    b += t((cx + w / 2).toFixed(1), y + h / 2 + size * 0.36, c, { size, weight: 700, anchor: 'middle', op: on ? 1 : 0.65, ls: 0.3 });
    cx += w + 4;
  });
  return b;
};

// ── 1. COVER ─────────────────────────────────────────────────────
// Claim: one question splits the field before price does. Drawn as a
// fork: data that must stay on your hardware narrows ten options to a
// handful; data that can move opens all of them.
function drawFork() {
  let b = '';
  b += `<rect x="22" y="6" width="156" height="22" rx="5" fill="#fff" fill-opacity="0.06" stroke="#fff" stroke-opacity="0.28" stroke-dasharray="3 2.5"/>`;
  b += t(100, 19.8, 'MUST THE DATA STAY ON YOUR HARDWARE?', { size: 5, weight: 700, anchor: 'middle', ls: 0.5, op: 0.9 });

  b += `<path d="M100,28 V36 H50 V44" fill="none" stroke="${O}" stroke-opacity="0.8" stroke-width="1.2"/>`;
  b += `<path d="M100,36 H150 V44" fill="none" stroke="#fff" stroke-opacity="0.25" stroke-width="1.1"/>`;
  b += t(50, 52, 'YES', { size: 5.4, weight: 800, anchor: 'middle', fill: OL, ls: 1 });
  b += t(150, 52, 'NO', { size: 5.4, weight: 800, anchor: 'middle', op: 0.5, ls: 1 });

  // left: the narrow set that runs on your own hardware
  b += `<rect x="6" y="57" width="96" height="56" rx="5" fill="${O}" fill-opacity="0.1" stroke="${O}" stroke-opacity="0.6"/>`;
  b += t(12, 67, 'RUNS ON YOUR HARDWARE', { size: 4.4, weight: 700, fill: OL, ls: 0.5 });
  b += chipRow(12, 72, ['YEEDU', 'CLOUDERA'], { hot: ['YEEDU'], size: 4 });
  b += chipRow(12, 86, ['EMR OUTPOSTS', 'STARBURST'], { size: 4 });
  b += chipRow(12, 100, ['SPARK ON K8S', 'COMET'], { size: 4 });

  // right: the full field
  b += `<rect x="106" y="57" width="88" height="56" rx="5" fill="#fff" fill-opacity="0.035" stroke="#fff" stroke-opacity="0.12"/>`;
  b += t(112, 67, 'THE WHOLE FIELD', { size: 4.4, weight: 700, op: 0.55, ls: 0.5 });
  b += t(112, 80, 'All ten options, plus', { size: 4.8, weight: 500, op: 0.55, ls: 0 });
  b += t(112, 89, 'Databricks, Snowflake,', { size: 4.8, weight: 500, op: 0.55, ls: 0 });
  b += t(112, 98, 'Fabric, Dataproc and', { size: 4.8, weight: 500, op: 0.55, ls: 0 });
  b += t(112, 107, 'HDInsight on the table', { size: 4.8, weight: 500, op: 0.55, ls: 0 });

  b += annot(8, 132, { label: 'DECIDE THIS BEFORE PRICE', value: 'residency first', note: 'it removes cloud-only platforms before a quote is opened' });
  return svg(200, 170, b);
}

// ── 2. WHAT CLOUDERA ACTUALLY COSTS ──────────────────────────────
// Claim: the licence line is the visible part. The CCU meter varies
// by profile, and the staff time sits under it.
function drawCost() {
  let b = '';
  b += t(8, 10, 'SAME COMPUTE, DIFFERENT CCU PROFILE', { size: 5.4, ls: 0.9, op: 0.4 });
  b += t(8, 21, 'CORE PROFILE', { size: 5, weight: 700, op: 0.6, ls: 0.6 });
  b += `<rect x="8" y="24" width="60" height="7" rx="2" fill="#fff" fill-opacity="0.25"/>`;
  b += t(72, 30, '1×', { size: 5.4, weight: 700, op: 0.6, ls: 0 });
  b += t(8, 41, 'ALL-PURPOSE DATA ENGINEERING', { size: 5, weight: 700, fill: OL, ls: 0.6 });
  b += `<rect x="8" y="44" width="165" height="7" rx="2" fill="${O}"/>`;
  b += t(192, 50, '~3×', { size: 5.4, weight: 700, anchor: 'end', fill: OL, ls: 0 });

  b += `<line x1="8" y1="60" x2="192" y2="60" stroke="#fff" stroke-opacity="0.08"/>`;
  b += t(8, 70, 'THE LINE THAT NEVER SHOWS ON THE INVOICE', { size: 5.2, ls: 0.8, op: 0.4 });
  const duties = [['PATCHING', 'Hadoop services'], ['REBALANCING', 'HDFS'], ['CHASING', 'Kerberos tickets']];
  duties.forEach(([a, c], i) => {
    const x = 8 + i * 62;
    b += `<rect x="${x}" y="76" width="58" height="26" rx="4" fill="#fff" fill-opacity="0.05" stroke="#fff" stroke-opacity="0.14"/>`;
    b += t(x + 29, 87, a, { size: 5, weight: 700, anchor: 'middle', op: 0.8, ls: 0.5 });
    b += t(x + 29, 96, c, { size: 4.5, weight: 500, anchor: 'middle', op: 0.45, ls: 0 });
  });

  b += annot(8, 124, { label: "CLOUDERA'S OWN MIGRATION TOOL", value: 'on-prem only', note: 'it automates on-prem moves, not a move to public cloud' });
  return svg(200, 162, b);
}

// ── 3. THE BUYER'S GUIDE ─────────────────────────────────────────
// Claim: four questions do more than a feature matrix. The Uber
// finding sits under them as the thing to rule out first.
function drawGuide() {
  let b = '';
  const q = [
    ['01', 'WORKLOAD FIT', 'Hive SQL or PySpark notebooks?'],
    ['02', 'HYBRID NEED', 'any data pinned on-prem?'],
    ['03', 'LICENSING', 'consumption or subscription?'],
    ['04', 'MIGRATION EFFORT', 'and who is on call at 2am?'],
  ];
  q.forEach(([n, l, h], i) => {
    const x = 6 + (i % 2) * 96, y = 4 + Math.floor(i / 2) * 48;
    b += `<rect x="${x}" y="${y}" width="92" height="43" rx="5" fill="#fff" fill-opacity="0.04" stroke="#fff" stroke-opacity="0.12"/>`;
    b += t(x + 8, y + 16, n, { size: 9, weight: 800, fill: O, family: 'Montserrat', ls: 0, op: 0.9 });
    b += t(x + 25, y + 16, l, { size: 5.6, weight: 700, op: 0.85, ls: 0.5 });
    b += t(x + 8, y + 31, h, { size: 5, weight: 500, op: 0.5, ls: 0 });
  });
  b += `<rect x="6" y="104" width="188" height="30" rx="5" fill="${O}" fill-opacity="0.1" stroke="${O}" stroke-opacity="0.55"/>`;
  b += t(14, 116, 'RULE THIS OUT FIRST', { size: 4.8, weight: 700, fill: OL, ls: 0.8 });
  b += t(14, 127, 'Uber: a Spark 3.3 upgrade alone cut runtime and resources 50%', { size: 5, weight: 600, op: 0.85, ls: 0 });
  return svg(200, 140, b);
}

// ── 4. WHO RUNS ON YOUR HARDWARE ─────────────────────────────────
// Claim: on-prem support is a spectrum, not a checkbox. Text labels
// only, grouped by answer.
function drawHybrid() {
  let b = '';
  const groups = [
    ['YES', 'runs on your own servers', ['YEEDU', 'EMR VIA OUTPOSTS', 'STARBURST', 'SPARK ON K8S', 'COMET'], true],
    ['PARTIAL', 'a separate product or a bridge', ['DATAPROC APPLIANCE', 'DATABRICKS METASTORE']],
    ['NO', 'cloud-hosted only', ['SNOWFLAKE', 'FABRIC', 'HDINSIGHT']],
  ];
  let y = 4;
  groups.forEach(([ans, hint, chips, accent]) => {
    const rows = accent ? 2 : 1, h = 22 + rows * 14;
    b += `<rect x="6" y="${y}" width="188" height="${h}" rx="5" fill="${accent ? O : '#fff'}" fill-opacity="${accent ? 0.1 : 0.035}" stroke="${accent ? O : '#fff'}" stroke-opacity="${accent ? 0.6 : 0.1}"/>`;
    b += t(14, y + 13, ans, { size: 7, weight: 800, family: 'Montserrat', fill: accent ? OL : '#fff', op: accent ? 1 : 0.7, ls: 0.4 });
    b += t(58, y + 13, hint, { size: 5, weight: 500, op: 0.5, ls: 0 });
    if (accent) {
      b += chipRow(14, y + 19, chips.slice(0, 3), { hot: ['YEEDU'] });
      b += chipRow(14, y + 33, chips.slice(3));
    } else {
      b += chipRow(14, y + 19, chips);
    }
    y += h + 6;
  });
  b += t(6, y + 6, 'Yeedu also runs on AWS, Azure, GCP and OCI: either side of a hybrid estate.', { size: 4.8, weight: 500, fill: OL, op: 0.85, ls: 0 });
  return svg(200, y + 10, b);
}

// ── 5. YEEDU, JOB BY JOB ─────────────────────────────────────────
// Claim: nothing has to leave. A Cloudera estate keeps its catalog;
// the CPU-bound jobs point at a faster engine that reads the same
// Hive Metastore.
function drawJobByJob() {
  let b = '';
  // the estate
  b += `<rect x="6" y="6" width="112" height="72" rx="5" fill="#fff" fill-opacity="0.035" stroke="#fff" stroke-opacity="0.14"/>`;
  b += t(14, 17, 'YOUR CLOUDERA ESTATE', { size: 4.8, weight: 700, op: 0.5, ls: 0.6 });
  for (let i = 0; i < 12; i++) {
    const x = 14 + (i % 6) * 16.5, y = 23 + Math.floor(i / 6) * 14;
    const hot = i === 1 || i === 4 || i === 8;
    b += `<rect x="${x}" y="${y}" width="13" height="10" rx="2" fill="${hot ? O : '#fff'}" fill-opacity="${hot ? 0.9 : 0.1}"/>`;
  }
  b += t(14, 60, 'CPU-bound jobs in orange', { size: 4.4, weight: 500, fill: OL, op: 0.85, ls: 0 });
  b += t(14, 70, 'everything else stays put', { size: 4.4, weight: 500, op: 0.45, ls: 0 });

  // arrow to engine
  b += `<path d="M118,38 H132" stroke="${O}" stroke-width="1.3"/>`;
  b += `<polygon points="136,38 131,35.5 131,40.5" fill="${O}"/>`;
  b += `<rect x="138" y="20" width="56" height="36" rx="5" fill="${O}" fill-opacity="0.18" stroke="${O}" stroke-width="1.2"/>`;
  b += t(166, 35, 'YEEDU', { size: 6.4, weight: 800, anchor: 'middle', fill: OL, ls: 0.8 });
  b += t(166, 45, 'TURBO ENGINE', { size: 4.6, weight: 700, anchor: 'middle', op: 0.75, ls: 0.6 });

  // shared catalog
  b += `<rect x="6" y="88" width="188" height="16" rx="4" fill="#fff" fill-opacity="0.05" stroke="#fff" stroke-opacity="0.22" stroke-dasharray="3 2.5"/>`;
  b += t(100, 98.6, 'ONE CATALOG, READ IN PLACE · HIVE METASTORE · UNITY · GLUE', { size: 4.6, weight: 700, anchor: 'middle', op: 0.7, ls: 0.4 });
  b += `<path d="M62,78 V88 M166,56 V88" stroke="#fff" stroke-opacity="0.2" stroke-dasharray="2 2"/>`;

  [['4–10×', 'FASTER, CPU-BOUND JOBS'], ['60–80%', 'LOWER COMPUTE COST']].forEach(([v, l], i) => {
    const x = 6 + i * 96;
    b += t(x + 2, 128, v, { size: 16, weight: 800, fill: OL, family: 'Montserrat', ls: -0.4 });
    b += t(x + 2, 138, l, { size: 4.8, weight: 700, op: 0.55, ls: 0.6 });
  });
  b += t(6, 154, 'Fixed annual licence, unlimited usage. Zero code changes.', { size: 5, weight: 500, op: 0.6, ls: 0 });
  return svg(200, 160, b);
}

// ── 6. CLOSER ────────────────────────────────────────────────────
function drawSteps() {
  let b = '';
  const steps = [
    ['01', 'RANK', "last month's jobs by spend"],
    ['02', 'CHECK', 'Spark UI: CPU or shuffle bound'],
    ['03', 'CAP', 'autoscaling before run one'],
    ['04', 'COMPARE', 'over a full week'],
  ];
  steps.forEach(([n, label, hint], i) => {
    const x = 6 + (i % 2) * 96, y = 4 + Math.floor(i / 2) * 48;
    b += `<rect x="${x}" y="${y}" width="92" height="43" rx="5" fill="#fff" fill-opacity="0.04" stroke="#fff" stroke-opacity="0.12"/>`;
    b += t(x + 8, y + 16, n, { size: 9, weight: 800, fill: O, family: 'Montserrat', ls: 0, op: 0.9 });
    b += t(x + 25, y + 16, label, { size: 6, weight: 700, op: 0.85, ls: 0.6 });
    b += t(x + 8, y + 31, hint, { size: 5.2, weight: 500, op: 0.55, ls: 0 });
  });
  return svg(200, 100, b);
}

// ── SLIDES ───────────────────────────────────────────────────────
const qr = await makeQr(BLOG_URL, 150);

const slides = [
  {
    notes: 'Cover: residency decides the shortlist before price',
    html: stage(
      logoMark(34) +
      eyebrow('Cloudera alternatives 2026') +
      headline(`Can your data ${em('leave the building?')}`, 52) +
      caption('Before price, before features: whether a workload can leave your own hardware decides which Cloudera alternatives are even on the list.') +
      well(drawFork()),
      'A'
    ),
  },
  {
    notes: 'What Cloudera actually costs',
    html: stage(
      eyebrow('The real bill') +
      headline(`The licence is ${em('the smaller line')}`, 54) +
      caption('CCU rates swing with the workload profile, and the staff time that keeps Hadoop running never appears on the quote.') +
      well(drawCost()),
      'B'
    ),
  },
  {
    notes: "Buyer's guide: four questions",
    html: stage(
      eyebrow("Buyer's guide") +
      headline(`Four questions ${em('write the shortlist')}`, 52) +
      caption('Answer these before opening a feature matrix. And check whether an engine upgrade fixes the bill before you shop at all.') +
      well(drawGuide()),
      'C'
    ),
  },
  {
    notes: 'Hybrid: who runs on your hardware, in plain text',
    html: stage(
      eyebrow('Hybrid and on-prem') +
      headline(`Who runs ${em('on your hardware')}`, 54) +
      caption('On-prem support is a spectrum, not a checkbox. Some options run on your servers, some need a separate product, some never will.') +
      well(drawHybrid()),
      'D'
    ),
  },
  {
    notes: 'Yeedu: job by job, nothing leaves',
    html: stage(
      eyebrow('Where Yeedu fits') +
      headline(`Keep Cloudera, ${em('speed the jobs')}`, 54) +
      caption('Yeedu runs inside your environment, reads the catalog you already have, and takes the expensive CPU-bound jobs one at a time.') +
      well(drawJobByJob()),
      'A'
    ),
  },
  {
    notes: 'Closer: measure for a week, CTA and QR',
    html: stage(
      logoMark(34) +
      eyebrow('Before you migrate') +
      headline(`Measure a week, ${em('not a quarter')}`, 54) +
      caption("Test one option against this quarter's most expensive workload. If it works, expand job by job.") +
      well(drawSteps()) +
      `<div style="display:flex;align-items:center;justify-content:space-between;gap:36px;margin-top:34px;">
         <div>
           ${ctaPill('Benchmark your top Cloudera job')}
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
const NAME = 'Best Cloudera Alternatives 2026';

if (OLD_ID) { console.log('Removing superseded deck…'); await deleteCarousel(OLD_ID); }
const id = await buildCarousel(NAME, slides);
await exportDeck(id, NAME);
