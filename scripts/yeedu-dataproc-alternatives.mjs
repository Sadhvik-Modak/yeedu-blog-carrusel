// ════════════════════════════════════════════════════════════════
// Best Google Cloud Dataproc Alternatives: When It Makes Sense to Move On
// Source: n8n-workflows-v2/output/revise/2026-09-23-best-google-cloud-dataproc-alternatives-when-it-makes-sense-to-move-on/article.md
//
// 6 slides, 4:5. The article's argument is "platform problem or three
// jobs?", so the deck opens on the bill, gives Dataproc its due, names
// the signals, sorts the field by category, lands Yeedu on the
// CPU-bound slice, and closes on a one-week reversible test.
// Every number comes from the article or the Yeedu fact sheet.
// ════════════════════════════════════════════════════════════════
import {
  C, stage, logoMark, eyebrow, headline, em, caption, well, svg, annot,
  makeQr, ctaPill, buildCarousel, deleteCarousel, exportDeck,
} from './yeedu-chrome.mjs';

const BLOG_URL = 'https://yeedu.com/blog/best-google-cloud-dataproc-alternatives-when-it-makes-sense-to-move-on';
const OLD_ID = process.env.OLD_ID || '';   // set to the previous deck's id to replace it

const O = C.orange, OL = C.orangeLight;
const t = (x, y, s, { size = 5.4, weight = 600, fill = '#fff', op = 1, anchor = 'start', ls = 0.6, family = 'Inter' } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${ls}" fill="${fill}" opacity="${op}">${s}</text>`;

// ── 1. COVER ─────────────────────────────────────────────────────
// Claim: the bill is usually a few jobs, not the platform. Drawn as one
// bill split into job segments, three of them carrying most of it, and
// two roads out of it with very different lengths.
function drawBill() {
  let b = '';
  b += t(8, 10, 'YOUR DATAPROC BILL, BY JOB', { size: 5.6, ls: 0.9, op: 0.4 });

  const segs = [38, 30, 24, 9, 8, 7, 6, 6, 5, 5, 4, 4, 4, 3, 3];   // illustrative shares, not data
  const total = segs.reduce((a, v) => a + v, 0);
  let x = 8;
  segs.forEach((s, i) => {
    const w = (s / total) * 184;
    const hot = i < 3;
    b += `<rect x="${x.toFixed(2)}" y="16" width="${(w - 1).toFixed(2)}" height="22" rx="2" fill="${hot ? O : '#fff'}" fill-opacity="${hot ? 0.85 - i * 0.15 : 0.1}"/>`;
    x += w;
  });
  const hotW = ((38 + 30 + 24) / total) * 184;
  b += `<path d="M8,42 V45 H${(8 + hotW - 1).toFixed(1)} V42" fill="none" stroke="${OL}" stroke-width="0.9" stroke-opacity="0.8"/>`;
  b += t(8 + hotW / 2, 53, 'THREE JOBS', { size: 5, weight: 700, fill: OL, anchor: 'middle', ls: 0.8 });
  b += t(8 + hotW + (184 - hotW) / 2, 53, 'EVERYTHING ELSE', { size: 5, weight: 600, anchor: 'middle', op: 0.4, ls: 0.8 });

  b += `<line x1="8" y1="64" x2="192" y2="64" stroke="#fff" stroke-opacity="0.08"/>`;

  // two roads: a long one and a short one, drawn to length
  b += t(8, 78, 'SWAP THE PLATFORM', { size: 5.2, weight: 700, op: 0.55, ls: 0.8 });
  b += `<rect x="80" y="72.5" width="112" height="7" rx="2" fill="#fff" fill-opacity="0.12"/>`;
  b += t(192, 88, 'multi-quarter project', { size: 4.8, weight: 500, anchor: 'end', op: 0.4, ls: 0 });
  b += t(8, 101, 'RETARGET THE JOBS', { size: 5.2, weight: 700, fill: OL, ls: 0.8 });
  b += `<rect x="80" y="95.5" width="18" height="7" rx="2" fill="${O}"/>`;
  b += t(102, 101.2, 'inside a sprint, reversible', { size: 4.8, weight: 500, fill: OL, op: 0.85, ls: 0 });

  b += annot(8, 124, { label: 'START FROM THE LINE ITEM', value: 'not the logo', note: 'most teams arrive after a bill review, not a tech audit' });
  return svg(200, 162, b);
}

// ── 2. WHAT DATAPROC GETS RIGHT ──────────────────────────────────
// Claim: the pricing is legible. Three tiles plus the article's own
// worked example, so the reader can check the arithmetic.
function drawLegible() {
  let b = '';
  const tiles = [
    ['$0.010', 'PER vCPU-HOUR', 'flat, billed per second'],
    ['~90s', 'CLUSTER SPIN-UP', 'job-scoped clusters'],
    ['gs://', 'FOR hdfs://', 'GCS connector, URI swap'],
  ];
  tiles.forEach(([big, label, note], i) => {
    const x = 6 + i * 64;
    b += `<rect x="${x}" y="6" width="60" height="62" rx="5" fill="#fff" fill-opacity="0.04" stroke="#fff" stroke-opacity="0.12"/>`;
    b += t(x + 30, 32, big, { size: 14, weight: 800, fill: OL, anchor: 'middle', ls: -0.4, family: 'Montserrat' });
    b += t(x + 30, 46, label, { size: 4.8, weight: 700, anchor: 'middle', op: 0.75, ls: 0.6 });
    b += t(x + 30, 57, note, { size: 4.4, weight: 500, anchor: 'middle', op: 0.45, ls: 0 });
  });

  // the worked example, as an equation strip
  b += `<rect x="6" y="80" width="188" height="24" rx="5" fill="${O}" fill-opacity="0.1" stroke="${O}" stroke-opacity="0.55"/>`;
  b += t(100, 95, '8 vCPU  ×  10 h  ×  $0.010  =  $0.80 premium', { size: 6.4, weight: 700, anchor: 'middle', ls: 0.3 });

  b += annot(8, 124, { label: 'WHAT CHANGES AT SCALE', value: 'trivial, then not', note: 'small for a few clusters, material for an always-on fleet' });
  return svg(200, 162, b);
}

// ── 3. THE SIGNALS ───────────────────────────────────────────────
// Claim: three questions separate "wrong platform" from "underused".
// Drawn as signal → what it actually tells you.
function drawSignals() {
  let b = '';
  const rows = [
    ['COST AT SCALE', 'Clusters that never idle down', 'ephemeral was the wrong shape'],
    ['OPERATIONAL BURDEN', 'Tuning shuffle, chasing YARN', 'you are bolting on a platform'],
    ['SINGLE-CLOUD LOCK-IN', 'Multi-cloud mandate or acquisition', 'portability beats marginal cost'],
  ];
  rows.forEach(([sig, see, means], i) => {
    const y = 6 + i * 52;
    b += `<rect x="6" y="${y}" width="188" height="45" rx="5" fill="#fff" fill-opacity="0.035" stroke="#fff" stroke-opacity="0.1"/>`;
    b += `<rect x="6" y="${y}" width="2.4" height="45" rx="1" fill="${O}"/>`;
    b += t(16, y + 16, `0${i + 1}`, { size: 8.5, weight: 800, fill: O, family: 'Montserrat', ls: 0 });
    b += t(34, y + 16, sig, { size: 6.4, weight: 700, ls: 0.8, op: 0.9 });
    b += t(34, y + 28, see, { size: 5.6, weight: 500, op: 0.55, ls: 0 });
    b += t(34, y + 38, `→ ${means}`, { size: 5.4, weight: 600, fill: OL, op: 0.9, ls: 0 });
  });
  return svg(200, 160, b);
}

// ── 4. THE FIELD, BY CATEGORY ────────────────────────────────────
// Claim: name the category first and the long list becomes a
// shortlist. Six cards, platforms pinned in each; the execution-engine
// swap is the one that leaves the estate where it is.
function drawCategories() {
  let b = '';
  const cats = [
    ['EXECUTION-ENGINE SWAP', 'change the engine only', ['YEEDU', 'COMET'], true],
    ['MANAGED SPARK, OTHER CLOUD', 'same shape, new cloud', ['AMAZON EMR', 'HDINSIGHT']],
    ['SELF-MANAGED', 'no uplift, you own it', ['SPARK ON K8S']],
    ['WAREHOUSE-FIRST', 'SQL first, Spark via bridge', ['BIGQUERY', 'SNOWFLAKE']],
    ['LAKEHOUSE AND HYBRID', 'consolidate tooling', ['DATABRICKS', 'CLOUDERA']],
    ['CAPACITY-BASED', 'Spark and BI, one bill', ['FABRIC']],
  ];
  cats.forEach(([name, hint, chips, accent], i) => {
    const x = 6 + (i % 2) * 95, y = 6 + Math.floor(i / 2) * 46, w = 91;
    b += `<rect x="${x}" y="${y}" width="${w}" height="41" rx="5" fill="${accent ? O : '#fff'}" fill-opacity="${accent ? 0.12 : 0.035}" stroke="${accent ? O : '#fff'}" stroke-opacity="${accent ? 0.75 : 0.1}"/>`;
    b += t(x + 7, y + 11, name, { size: 4.6, weight: 700, fill: accent ? OL : '#fff', op: accent ? 1 : 0.8, ls: 0.5 });
    b += t(x + 7, y + 19, hint, { size: 4.2, weight: 500, op: 0.42, ls: 0 });
    let cx = x + 7;
    chips.forEach((c) => {
      const cw = c.length * 3.3 + 9;
      const hot = accent && c === 'YEEDU';
      b += `<rect x="${cx.toFixed(1)}" y="${y + 25}" width="${cw.toFixed(1)}" height="10" rx="2.5" fill="${hot ? O : '#fff'}" fill-opacity="${hot ? 1 : 0.08}" stroke="${hot ? O : '#fff'}" stroke-opacity="${hot ? 1 : 0.16}"/>`;
      b += t((cx + cw / 2).toFixed(1), y + 31.8, c, { size: 4.3, weight: 700, anchor: 'middle', op: hot ? 1 : 0.6, ls: 0.3 });
      cx += cw + 4;
    });
  });
  b += t(6, 150, 'The only category that leaves your catalog and pipelines in place.', { size: 4.8, weight: 500, fill: OL, op: 0.85, ls: 0 });
  return svg(200, 156, b);
}

// ── 5. YEEDU ON THE CPU-BOUND SLICE ──────────────────────────────
// Claim: scoped, not universal. The workload bar shows the 30–40% the
// engine acts on; the numbers sit on that slice only.
function drawSlice() {
  let b = '';
  b += t(8, 10, 'A TYPICAL SPARK WORKLOAD MIX', { size: 5.6, ls: 0.9, op: 0.4 });
  b += `<rect x="8" y="16" width="66" height="22" rx="3" fill="${O}"/>`;
  b += `<rect x="75" y="16" width="117" height="22" rx="3" fill="#fff" fill-opacity="0.08"/>`;
  b += t(41, 29.6, 'CPU-BOUND 30–40%', { size: 5, weight: 700, anchor: 'middle', ls: 0.4 });
  b += t(133.5, 29.6, 'SHUFFLE · I/O · INGESTION', { size: 5, weight: 600, anchor: 'middle', op: 0.45, ls: 0.4 });
  b += t(41, 47, 'joins · aggregations · feature prep', { size: 4.2, weight: 500, anchor: 'middle', fill: OL, op: 0.8, ls: 0 });

  // the two claims, pinned to the slice they apply to
  [['4–10×', 'FASTER EXECUTION'], ['60–80%', 'LOWER COMPUTE COST']].forEach(([v, l], i) => {
    const x = 8 + i * 94;
    b += `<rect x="${x}" y="58" width="90" height="36" rx="5" fill="#fff" fill-opacity="0.04" stroke="#fff" stroke-opacity="0.12"/>`;
    b += t(x + 9, 79, v, { size: 15, weight: 800, fill: OL, family: 'Montserrat', ls: -0.4 });
    b += t(x + 9, 88.5, l, { size: 4.6, weight: 700, op: 0.6, ls: 0.6 });
  });

  b += t(8, 108, 'RUNS INSIDE YOUR OWN ENVIRONMENT', { size: 4.8, weight: 700, op: 0.42, ls: 0.8 });
  let cx = 8;
  ['AWS', 'AZURE', 'GCP', 'OCI', 'ON-PREM'].forEach((c) => {
    const cw = c.length * 3.6 + 10;
    b += `<rect x="${cx}" y="112" width="${cw}" height="11" rx="2.5" fill="#fff" fill-opacity="0.07" stroke="#fff" stroke-opacity="0.16"/>`;
    b += t(cx + cw / 2, 119.4, c, { size: 4.6, weight: 700, anchor: 'middle', op: 0.7, ls: 0.4 });
    cx += cw + 4;
  });

  b += annot(8, 140, { label: 'WHAT YOU REWRITE TO GET IT', value: '0 lines', note: 'existing PySpark, Scala and Java run unmodified' });
  return svg(200, 178, b);
}

// ── 6. CLOSER ────────────────────────────────────────────────────
// The article's reversible experiment, as four steps.
function drawSteps() {
  let b = '';
  const steps = [
    ['01', 'PULL', 'the 3–4 jobs topping the bill'],
    ['02', 'CLASSIFY', 'CPU, shuffle or I/O bound'],
    ['03', 'CAP', 'autoscaling before run one'],
    ['04', 'RUN IN PARALLEL', 'for a week, then compare'],
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
    notes: 'Cover: platform problem or three jobs',
    html: stage(
      logoMark(34) +
      eyebrow('Dataproc alternatives') +
      headline(`Platform problem, ${em('or three jobs?')}`, 54) +
      caption('Most teams shopping for a Dataproc replacement are fighting a few expensive jobs, not the platform. The two problems have very different fixes.') +
      well(drawBill()),
      'A'
    ),
  },
  {
    notes: 'What Dataproc gets right: legible pricing',
    html: stage(
      eyebrow('Credit where due') +
      headline(`Dataproc isn't broken, ${em("it's legible")}`, 52) +
      caption('A flat premium, per-second billing and 90-second clusters. Know what you already have before you price what you might need.') +
      well(drawLegible()),
      'B'
    ),
  },
  {
    notes: 'Three signals it is time to look elsewhere',
    html: stage(
      eyebrow('The signals') +
      headline(`Three signs ${em("it's time to look")}`, 54) +
      caption('Each one tells you whether Dataproc is wrong for the workload or just underused. Only the first is about price.') +
      well(drawSignals()),
      'C'
    ),
  },
  {
    notes: 'The field sorted into six categories',
    html: stage(
      eyebrow('The landscape') +
      headline(`Name the category, ${em('then the tool')}`, 52) +
      caption('Ten alternatives sort into six categories. Picking the category first turns a long list into a shortlist.') +
      well(drawCategories()),
      'D'
    ),
  },
  {
    notes: 'Yeedu: scoped to the CPU-bound slice',
    html: stage(
      eyebrow('Where Yeedu fits') +
      headline(`Same code, ${em('a faster engine')}`, 54) +
      caption('Yeedu swaps what runs under your Spark jobs, not the jobs themselves. The gains land on the CPU-bound slice, and we say so.') +
      well(drawSlice()),
      'A'
    ),
  },
  {
    notes: 'Closer: a one-week reversible test, CTA and QR',
    html: stage(
      logoMark(34) +
      eyebrow('Before you migrate') +
      headline(`Test one job, ${em('not a platform')}`, 54) +
      caption("If it works, expand it. If it doesn't, you've spent a week instead of a quarter.") +
      well(drawSteps()) +
      `<div style="display:flex;align-items:center;justify-content:space-between;gap:36px;margin-top:34px;">
         <div>
           ${ctaPill('Test your top Dataproc job')}
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
const NAME = 'Best Google Cloud Dataproc Alternatives 2026';

if (OLD_ID) { console.log('Removing superseded deck…'); await deleteCarousel(OLD_ID); }
const id = await buildCarousel(NAME, slides);
await exportDeck(id, NAME);
