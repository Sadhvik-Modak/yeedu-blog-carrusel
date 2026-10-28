// ════════════════════════════════════════════════════════════════
// Why Is Databricks Expensive? A Breakdown of Databricks Pricing
//
// 5 slides, 4:5. The article's argument: classic Databricks compute is billed
// on two meters, DBU rates differ by compute type, serverless bundles the
// infrastructure into a higher rate, and most of a high bill traces to a
// handful of configuration symptoms plus drift. No per-DBU dollar rates.
// Yeedu only on the closer, facts pack only.
// ════════════════════════════════════════════════════════════════
import { stage, logoMark, eyebrow, headline, caption, well, svg, buildCarousel, deleteCarousel, exportDeck } from './yeedu-chrome.mjs';
import { O, OL, MONO, em2, lbl, txt, card, arrow, points, cta } from './yeedu-deck-parts.mjs';

const OLD_ID = process.env.OLD_ID || '';

// ── 1. COVER: two meters, two invoices ───────────────────────────
function drawMeters() {
  let b = '';
  // the workload
  b += card(60, 4, 80, 20, 'One job on classic compute', '', { hot: true, titleSize: 5.2 });
  // two meters
  const cols = [
    { x: 6, k: 'METER 1 · DATABRICKS', t: 'DBUs', s: ['compute type', 'Photon on or off', 'serverless premium'] },
    { x: 106, k: 'METER 2 · CLOUD PROVIDER', t: 'VM + storage + network', s: ['instance family, spot', 'idle time, cluster size', 'small files, egress'] },
  ];
  b += arrow(85, 25, 50, 38, { op: 0.45 });
  b += arrow(115, 25, 150, 38, { op: 0.45 });
  cols.forEach(({ x, k, t, s }) => {
    b += `<rect x="${x}" y="40" width="88" height="58" rx="4" fill="#fff" fill-opacity="0.07" stroke="#fff" stroke-opacity="0.3" stroke-width="0.7"/>`;
    b += lbl(x + 6, 50, k, { size: 3.8, op: 1, fill: OL });
    b += txt(x + 6, 61, t, { size: 5.4, op: 1, weight: 700 });
    s.forEach((l, i) => { b += txt(x + 6, 72 + i * 8, l, { size: 4.2, op: 0.7 }); });
  });
  b += arrow(50, 99, 85, 110, { op: 0.45 });
  b += arrow(150, 99, 115, 110, { op: 0.45 });
  b += card(55, 112, 90, 18, 'Two invoices, one bill', '', { titleSize: 5 });
  return svg(200, 132, b, 856);
}

// ── 2. COMPUTE TYPES + SERVERLESS ────────────────────────────────
function drawCompute() {
  let b = '';
  b += lbl(4, 9, 'SAME VM, DIFFERENT DBU RATE PER COMPUTE TYPE', { size: 4.2, op: 0.65 });
  const types = [
    ['Jobs compute', 'scheduled runs, lower rate'],
    ['All-Purpose', 'interactive, higher rate'],
    ['SQL warehouses', 'Classic, Pro, Serverless'],
    ['Lakeflow pipelines', 'Core, Pro, Advanced'],
    ['Model Serving', 'serverless only, GPU rates'],
    ['Photon', 'a multiplier on any of them'],
  ];
  const w = 95, h = 22;
  types.forEach(([t, s], i) => {
    const x = 4 + (i % 2) * (w + 2), y = 14 + Math.floor(i / 2) * (h + 4);
    b += card(x, y, w, h, t, s, { hot: i === 5, titleSize: 5, subSize: 4.1 });
  });
  // serverless vs classic
  const y = 100;
  b += lbl(4, y, 'SERVERLESS BUNDLES THE VM INTO ONE HIGHER RATE', { size: 4.2, op: 1, fill: OL });
  const rows = [
    ['Short, bursty, idle-heavy', 'tends to be cheaper serverless'],
    ['Long, steady, fully used', 'tends to be cheaper classic'],
  ];
  rows.forEach(([a, z], i) => {
    const ry = y + 5 + i * 15;
    b += `<rect x="2" y="${ry}" width="196" height="13" rx="2" fill="#fff" fill-opacity="${i ? 0.03 : 0.06}"/>`;
    b += txt(6, ry + 8.6, a, { size: 4.7, op: 1, weight: 700 });
    b += txt(108, ry + 8.6, z, { size: 4.5, op: 0.85, fill: OL });
  });
  return svg(200, 136, b, 856);
}

// ── 3. SYMPTOM → FIX ─────────────────────────────────────────────
function drawSymptoms() {
  const rows = [
    ['All-Purpose SKU on a job_id', 'Move it to Jobs compute'],
    ['RUNNING for hours, no commands', 'autotermination_minutes = 60'],
    ['Idle driver, saturated workers', 'Size the driver on its own'],
    ['DBU-hours up, wall-clock flat', 'Benchmark Photon on vs off'],
    ['Long task tail, big shuffle', 'Skew join on, tune partitions'],
    ['Warehouse up all day, busy 3 hrs', 'Tighten auto-stop'],
  ];
  let b = '';
  const x0 = 4, c1 = 104, rh = 21, y0 = 18;
  b += lbl(x0, 11, 'SYMPTOM', { size: 4.2, op: 0.55 });
  b += lbl(c1, 11, 'FIRST FIX', { size: 4.2, op: 1, fill: OL });
  rows.forEach(([s, f], i) => {
    const y = y0 + i * rh;
    if (i % 2 === 0) b += `<rect x="${x0 - 2}" y="${y - 1}" width="198" height="${rh - 1}" rx="2" fill="#fff" fill-opacity="0.04"/>`;
    b += txt(x0, y + 12, s, { size: 4.6, op: 1, weight: 600 });
    b += arrow(c1 - 9, y + 10.5, c1 - 3, y + 10.5, { op: 0.5, color: OL });
    b += txt(c1, y + 12, f, { size: 4.5, op: 0.95, fill: OL, family: f.includes('_') ? MONO : 'Inter' });
  });
  return svg(200, 146, b, 856);
}

// ── 4. DRIFT: the bill grows on its own ──────────────────────────
function drawDrift() {
  const items = [
    ['Data growth', 'table +30%, job does +30%'],
    ['Small files', 'more DBU-seconds per query'],
    ['Runtime upgrade', 'defaults change under you'],
    ['Contract renewal', 'rates reset each term'],
    ['New users', 'new notebooks, new clusters'],
    ['Serverless shift', 'two lines become one'],
    ['Silent retries', 'every attempt is billed'],
  ];
  let b = '';
  const w = 95, h = 25;
  items.forEach(([t, s], i) => {
    const x = 4 + (i % 2) * (w + 2), y = 4 + Math.floor(i / 2) * (h + 4);
    b += card(x, y, w, h, t, s, { titleSize: 5, subSize: 4.2 });
  });
  // 8th tile: the takeaway
  b += card(101, 4 + 3 * 29, 95, 25, 'Recheck quarterly', 'not once at signing', { hot: true, titleSize: 5, subSize: 4.2 });
  return svg(200, 120, b, 856);
}

const slides = [
  {
    notes: 'Cover: classic Databricks compute bills on two meters, DBUs from Databricks and VM/storage/network from the cloud provider. No dollar rates',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Databricks pricing')}
      ${headline(`Why is Databricks ${em2('expensive?')}`, 60)}
      ${well(drawMeters(), { card: false })}
      ${caption(`Neither meter explains the bill alone. A flat DBU count can sit next to a rising cloud invoice, and a quiet cloud bill can hide a DBU rate that jumped when Photon went on everywhere.`)}
    `, 'A'),
  },
  {
    notes: 'Compute types each carry their own DBU rate; serverless folds the VM into a higher rate, cheaper for bursty work and pricier for steady work. No per-DBU dollar figures',
    html: stage(`
      ${eyebrow('Where the rate comes from')}
      ${headline(`Same VM ${em2('different rate')}`, 56)}
      ${well(drawCompute(), { pad: 26 })}
      ${caption(`Databricks' own guidance says scheduled jobs cost significantly less on Jobs compute than on All-Purpose. Check which surface each job runs on before tuning anything else.`)}
    `, 'B'),
  },
  {
    notes: "Symptom to first fix, from the article's diagnostic table",
    html: stage(`
      ${eyebrow('What drives a high bill')}
      ${headline(`Six symptoms ${em2('and the first fix')}`, 56)}
      ${well(drawSymptoms(), { pad: 26 })}
      ${caption(`Most of these show up in the billing export or the cluster event log. Tag every cluster with an owner first, or nobody can act on what the export shows.`)}
    `, 'C'),
  },
  {
    notes: 'Why the bill grows when workloads have not changed: data growth, small files, runtime defaults, renewal, users, serverless, retries',
    html: stage(`
      ${eyebrow('Same workloads, bigger bill')}
      ${headline(`The bill drifts ${em2('even when the code does not')}`, 54)}
      ${well(drawDrift(), { pad: 26 })}
      ${caption(`Compaction, auto-termination policies, retry alerts and a dated price check at every renewal keep drift visible before it reaches the invoice.`)}
    `, 'D'),
  },
  {
    notes: 'Closer: Yeedu fixed licence with no per-DBU meter, own account, faster on every job type (2-4x Smart Scheduling; 4-10x on CPU-bound work), adopted job by job alongside Databricks. CTA, no QR',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Yeedu')}
      ${headline(`Take the meter ${em2('off the software line')}`, 54)}
      ${points([
        ['wallet', 'A fixed annual licence with unlimited usage. No charge per core, hour, job or DBU.'],
        ['cloud', 'Runs in your own AWS, Azure, GCP or OCI account. Unity Catalog, Hive and Glue read in place.'],
        ['bolt', 'Faster on every job type. 2-4x cluster efficiency on ingestion, ELT and streaming; 4-10x on CPU-bound work.'],
        ['steps', 'Point the highest-DBU jobs at Yeedu first. Everything else stays on Databricks.'],
      ])}
      ${cta()}
    `, 'C'),
  },
];

const NAME = 'Why Is Databricks Expensive? A Breakdown of Databricks Pricing';

if (OLD_ID) await deleteCarousel(OLD_ID);
const id = await buildCarousel(NAME, slides);
if (!process.env.SKIP_EXPORT) await exportDeck(id, NAME);
