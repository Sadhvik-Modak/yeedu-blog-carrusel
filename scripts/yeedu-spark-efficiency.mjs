// ════════════════════════════════════════════════════════════════
// How to Run Apache Spark Workloads Efficiently
//
// 5 slides, 4:5. The article's argument: measure in the Spark UI before
// tuning, know what AQE already does by default, and map each error string
// to a first fix. All defaults are Spark's own documented values. Yeedu only
// on the closer, facts pack only: four mechanisms, Turbo 4-10x scoped to
// CPU-bound work, adopted job by job.
// ════════════════════════════════════════════════════════════════
import { stage, logoMark, eyebrow, headline, caption, well, svg, buildCarousel, deleteCarousel, exportDeck } from './yeedu-chrome.mjs';
import { O, OL, MONO, em2, lbl, txt, card, arrow, points, cta } from './yeedu-deck-parts.mjs';

const OLD_ID = process.env.OLD_ID || '';

// ── 1. COVER: two stages and the shuffle between them ────────────
function drawStages() {
  let b = '';
  b += card(70, 2, 60, 16, 'Driver', '', { titleSize: 5 });
  b += arrow(100, 19, 100, 28, { op: 0.45 });
  const col = (x, k, n, skew) => {
    b += lbl(x, 36, k, { size: 4.2, op: 0.65 });
    for (let i = 0; i < n; i++) {
      const w = skew && i === n - 1 ? 70 : 22 + (i % 3) * 4;
      const hot = skew && i === n - 1;
      b += `<rect x="${x}" y="${41 + i * 11}" width="${w}" height="8" rx="1.5" fill="${hot ? O : '#fff'}" fill-opacity="${hot ? 0.75 : 0.18}"/>`;
    }
  };
  col(4, 'STAGE 1 · MAP TASKS', 5, false);
  col(122, 'STAGE 2 · REDUCE TASKS', 5, true);
  // shuffle band
  b += `<rect x="52" y="40" width="64" height="54" rx="4" fill="${O}" fill-opacity="0.1" stroke="${O}" stroke-opacity="0.8" stroke-width="0.8" stroke-dasharray="2 1.5"/>`;
  b += lbl(84, 52, 'SHUFFLE', { anchor: 'middle', size: 4.6, op: 1, fill: OL });
  b += txt(84, 64, 'write to disk', { anchor: 'middle', size: 4.2, op: 0.75 });
  b += txt(84, 72, 'fetch over network', { anchor: 'middle', size: 4.2, op: 0.75 });
  b += txt(84, 80, 'stage boundary', { anchor: 'middle', size: 4.2, op: 0.75 });
  b += arrow(36, 67, 51, 67, { op: 0.5 });
  b += arrow(117, 67, 121, 67, { op: 0.5 });
  b += txt(194, 106, 'one skewed task sets the stage time', { anchor: 'end', size: 4.2, op: 0.9, fill: OL });
  return svg(200, 112, b, 856);
}

// ── 2. READ THE SPARK UI ─────────────────────────────────────────
function drawUI() {
  const rows = [
    ['Task duration spread', 'max far above median', 'skew'],
    ['Shuffle fetch wait', 'short compute, long wait', 'network-bound'],
    ['Spill (disk) > 0', 'stage outgrew its memory', 'more partitions'],
    ['GC Time per task', 'full GCs before finish', 'more heap per task'],
    ['Executor removed', 'add/remove events', 'OOM or spot loss'],
  ];
  let b = '';
  const x0 = 4, c1 = 76, c2 = 142, rh = 24, y0 = 18;
  b += lbl(x0, 11, 'SIGNAL', { size: 4.2, op: 0.55 });
  b += lbl(c1, 11, 'WHAT YOU SEE', { size: 4.2, op: 0.8 });
  b += lbl(c2, 11, 'POINTS TO', { size: 4.2, op: 1, fill: OL });
  rows.forEach(([k, a, z], i) => {
    const y = y0 + i * rh;
    if (i % 2 === 0) b += `<rect x="${x0 - 2}" y="${y - 1}" width="198" height="${rh - 1}" rx="2" fill="#fff" fill-opacity="0.04"/>`;
    b += txt(x0, y + 13, k, { size: 4.8, op: 1, weight: 700 });
    b += txt(c1, y + 13, a, { size: 4.3, op: 0.75 });
    b += txt(c2, y + 13, z, { size: 4.5, op: 1, fill: OL, weight: 600 });
  });
  return svg(200, 140, b, 856);
}

// ── 3. AQE DEFAULTS ──────────────────────────────────────────────
function drawAQE() {
  let b = '';
  b += lbl(4, 9, 'ON BY DEFAULT SINCE SPARK 3.2.0', { size: 4.4, op: 1, fill: OL });
  const blocks = [
    ['1. Coalesce partitions', 'merges small shuffle partitions', 'advisoryPartitionSizeInBytes = 64MB', '64MB'],
    ['2. Split skewed joins', 'partition > 5x median AND > 256MB', 'skewedPartitionFactor = 5.0', '5x'],
    ['3. Switch to broadcast', 'small side under the threshold', 'autoBroadcastJoinThreshold = 10MB', '10MB'],
  ];
  blocks.forEach(([t, s, conf, big], i) => {
    const y = 15 + i * 40;
    b += `<rect x="2" y="${y}" width="196" height="35" rx="3" fill="#fff" fill-opacity="0.07" stroke="#fff" stroke-opacity="0.3" stroke-width="0.7"/>`;
    b += `<rect x="2" y="${y}" width="2.4" height="35" rx="1" fill="${OL}"/>`;
    b += txt(9, y + 10, t, { size: 5.2, op: 1, weight: 700 });
    b += txt(9, y + 19, s, { size: 4.3, op: 0.72 });
    b += txt(9, y + 28, conf, { size: 3.9, op: 0.9, fill: OL, family: MONO });
    b += txt(192, y + 23, big, { anchor: 'end', size: 12, op: 1, weight: 800, fill: OL });
  });
  return svg(200, 136, b, 856);
}

// ── 4. ERROR STRING → FIRST FIX ──────────────────────────────────
function drawErrors() {
  const rows = [
    ['FetchFailedException: Too large frame', 'one shuffle block over 2GB', 'Salt or repartition the skewed key'],
    ['Container killed by YARN for exceeding memory limits', 'overhead factor 0.10 too small', 'Raise memoryOverheadFactor'],
    ['... is bigger than spark.driver.maxResultSize', 'collect() pulled too much', 'Write to storage, keep the 1g cap'],
    ['Could not execute broadcast in 300 secs', 'broadcast side too slow', 'Raise broadcastTimeout or shuffle'],
  ];
  let b = '';
  rows.forEach(([e, c, f], i) => {
    const y = 2 + i * 34;
    b += `<rect x="2" y="${y}" width="196" height="30" rx="3" fill="#fff" fill-opacity="0.06" stroke="#fff" stroke-opacity="0.22" stroke-width="0.6"/>`;
    b += txt(7, y + 9, e, { size: 4.1, op: 1, family: MONO, weight: 600 });
    b += txt(7, y + 18.5, c, { size: 4.2, op: 0.68 });
    b += arrow(7, y + 24.2, 13, y + 24.2, { op: 0.6, color: OL });
    b += txt(16, y + 25.5, f, { size: 4.5, op: 1, fill: OL, weight: 600 });
  });
  return svg(200, 138, b, 856);
}

const slides = [
  {
    notes: 'Cover: driver, two stages and the shuffle boundary; a single skewed reduce task sets the stage time',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Apache Spark workloads')}
      ${headline(`Run Spark efficiently ${em2('measure first, then tune')}`, 56)}
      ${well(drawStages(), { card: false })}
      ${caption(`Most wasted compute sits at the shuffle boundary: skewed partitions, spill and network waits. The Spark UI shows which one before any config changes.`)}
    `, 'A'),
  },
  {
    notes: 'Five Spark UI signals worth reading on every slow stage and what each points to',
    html: stage(`
      ${eyebrow('Read the Spark UI')}
      ${headline(`Five signals ${em2('on every slow stage')}`, 56)}
      ${well(drawUI(), { pad: 26 })}
      ${caption(`The Stages tab and the History Server already hold these numbers. A config change without a baseline is a guess.`)}
    `, 'B'),
  },
  {
    notes: "AQE's three runtime corrections with Spark's documented defaults: 64MB advisory size, 5x and 256MB skew thresholds, 10MB broadcast threshold",
    html: stage(`
      ${eyebrow('Adaptive Query Execution')}
      ${headline(`What AQE ${em2('already fixes for you')}`, 56)}
      ${well(drawAQE(), { pad: 26 })}
      ${caption(`Check that AQE is on before hand-tuning partition counts. Salt a join key manually only when a skewed partition stays under the 256MB floor or the split is still too coarse.`)}
    `, 'C'),
  },
  {
    notes: "Four error strings from the article's troubleshooting table with likely cause and first fix",
    html: stage(`
      ${eyebrow('Troubleshooting')}
      ${headline(`Error string ${em2('to first fix')}`, 56)}
      ${well(drawErrors(), { pad: 26 })}
      ${caption(`Paste the exact string from the driver or executor log. Each one names a cause narrow enough to fix in one change.`)}
    `, 'D'),
  },
  {
    notes: 'Closer: Yeedu faster on every job type via multi-threading, Smart Scheduling 2-4x, multiplexing and Parquet disk cache; Turbo 4-10x on CPU-bound work; Yeedu mode; job by job. CTA, no QR',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Yeedu')}
      ${headline(`Same Spark code ${em2('a faster engine underneath')}`, 54)}
      ${points([
        ['bolt', 'Faster on every job type: multi-threading, Smart Scheduling (2-4x on ingestion, ELT, streaming), multiplexing and a Parquet disk cache.'],
        ['code', 'Turbo runs CPU-bound joins and aggregations 4-10x faster at 60-80% lower compute cost. Zero code changes.'],
        ['cloud', 'Yeedu mode runs jobs that fit on one VM without a shuffle across machines.'],
        ['steps', 'Adopted job by job, inside your own cloud account.'],
      ])}
      ${cta()}
    `, 'C'),
  },
];

const NAME = 'How to Run Apache Spark Workloads Efficiently';

if (OLD_ID) await deleteCarousel(OLD_ID);
const id = await buildCarousel(NAME, slides);
if (!process.env.SKIP_EXPORT) await exportDeck(id, NAME);
