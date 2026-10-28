// ════════════════════════════════════════════════════════════════
// Why Spark Shuffle Breaks Down at Petabyte Scale
//
// 5 slides, 4:5. The article's argument: local-disk shuffle fails as a
// hardware problem at hundreds of TB a day, a few limits are architectural
// rather than configurable, the largest Spark users moved shuffle off the
// compute node, and most teams do not need that yet. Figures are the
// article's, from the companies' own engineering posts. Yeedu gets one
// closing line plus the CTA, as on the other technical deep-dive decks.
// ════════════════════════════════════════════════════════════════
import { stage, logoMark, eyebrow, headline, caption, well, svg, buildCarousel, deleteCarousel, exportDeck } from './yeedu-chrome.mjs';
import { O, OL, MONO, em2, lbl, txt, card, arrow, cta } from './yeedu-deck-parts.mjs';

const OLD_ID = process.env.OLD_ID || '';

// ── 1. COVER: local fan-out vs remote shuffle ────────────────────
function drawTopology() {
  let b = '';
  const half = (x0, k, remote) => {
    b += lbl(x0 + 46, 8, k, { anchor: 'middle', size: 4.2, op: 1, fill: remote ? OL : '#fff' });
    const my = [18, 36, 54];
    my.forEach((y) => { b += card(x0, y, 26, 12, 'Map', '', { titleSize: 4.4 }); });
    if (!remote) {
      my.forEach((y) => {
        b += `<rect x="${x0 + 34}" y="${y}" width="22" height="12" rx="2" fill="${O}" fill-opacity="0.18" stroke="${O}" stroke-opacity="0.7" stroke-width="0.6"/>`;
        b += txt(x0 + 45, y + 7.8, 'disk', { anchor: 'middle', size: 4, op: 0.9 });
        b += arrow(x0 + 27, y + 6, x0 + 33, y + 6, { op: 0.45 });
        b += arrow(x0 + 57, y + 6, x0 + 69, 42, { op: 0.45 });
      });
      b += card(x0 + 70, 36, 22, 12, 'Reduce', '', { titleSize: 4.2 });
      b += txt(x0 + 46, 80, 'reducer fetches from every node', { anchor: 'middle', size: 4, op: 0.7 });
    } else {
      b += `<rect x="${x0 + 38}" y="24" width="24" height="36" rx="3" fill="${O}" fill-opacity="0.22" stroke="${O}" stroke-width="0.9"/>`;
      b += txt(x0 + 50, 40, 'shuffle', { anchor: 'middle', size: 4.2, op: 1, weight: 700 });
      b += txt(x0 + 50, 47, 'service', { anchor: 'middle', size: 4.2, op: 1, weight: 700 });
      my.forEach((y) => { b += arrow(x0 + 27, y + 6, x0 + 37, 42, { op: 0.45 }); });
      b += arrow(x0 + 63, 42, x0 + 69, 42, { op: 0.6, color: OL });
      b += card(x0 + 70, 36, 22, 12, 'Reduce', '', { titleSize: 4.2, hot: true });
      b += txt(x0 + 46, 80, 'reducer fetches from one place', { anchor: 'middle', size: 4, op: 0.9, fill: OL });
    }
  };
  half(4, 'LOCAL DISK SHUFFLE', false);
  half(104, 'REMOTE SHUFFLE', true);
  b += `<line x1="100" y1="4" x2="100" y2="84" stroke="#fff" stroke-opacity="0.15" stroke-width="0.6"/>`;
  return svg(200, 86, b, 856);
}

// ── 2. FAILURE BECOMES A BUDGET ──────────────────────────────────
function drawBudget() {
  const stats = [
    ['~6 months', 'life of SSDs rated for 3 years under sustained shuffle I/O'],
    ['90 TB', 'shuffled in one stage across 250,000 tasks'],
    ['4 → 20', 'max fetch failures per stage, raised to keep that job alive'],
    ['100s-1,000s', 'fetch failures a day on 10,000+ node clusters'],
  ];
  let b = '';
  stats.forEach(([n, s], i) => {
    const y = 2 + i * 31;
    b += `<rect x="2" y="${y}" width="196" height="27" rx="3" fill="#fff" fill-opacity="0.06" stroke="#fff" stroke-opacity="0.22" stroke-width="0.6"/>`;
    b += `<rect x="2" y="${y}" width="2.4" height="27" rx="1" fill="${OL}"/>`;
    b += txt(10, y + 17.5, n, { size: 9.5, op: 1, weight: 800, fill: OL });
    b += txt(80, y + 15.5, s, { size: 4.2, op: 0.85 });
  });
  return svg(200, 126, b, 856);
}

// ── 3. CEILINGS TUNING CANNOT MOVE ───────────────────────────────
function drawCeilings() {
  const rows = [
    ['2 GB per shuffle block', 'FetchFailedException: Too large frame', 'Only fix: more, smaller partitions'],
    ['8 GB / 512M rows per broadcast', 'Cannot broadcast the table that is larger than 8GB', 'Built on the driver, whatever the threshold'],
    ['AQE skew split', 'forceOptimizeSkewedJoin = false', 'Sort-merge joins only; no help for disk wear'],
  ];
  let b = '';
  rows.forEach(([t, e, n], i) => {
    const y = 2 + i * 42;
    b += `<rect x="2" y="${y}" width="196" height="38" rx="3" fill="#fff" fill-opacity="0.06" stroke="#fff" stroke-opacity="0.22" stroke-width="0.6"/>`;
    b += `<rect x="2" y="${y}" width="2.4" height="38" rx="1" fill="${O}"/>`;
    b += txt(9, y + 11, t, { size: 5.4, op: 1, weight: 700 });
    b += txt(9, y + 21, e, { size: 3.9, op: 0.9, fill: OL, family: MONO });
    b += txt(9, y + 31, n, { size: 4.3, op: 0.72 });
  });
  return svg(200, 128, b, 856);
}

// ── 4. WHAT THEY BUILT ───────────────────────────────────────────
function drawBuilt() {
  const blocks = [
    ['Uber · Remote Shuffle Service', '8-10 PB a day moved onto 400 dedicated servers', '~95%', 'fewer shuffle container failures'],
    ['LinkedIn · Magnet (push shuffle)', 'merges map output; upstream as spark.shuffle.push', '-98%', 'fetch wait, 20,636 → 445 min'],
    ['LinkedIn · Apache Celeborn', 'NVMe shuffle workers for Spark and Flink', '750 → 20', 'daily fetch failures'],
  ];
  let b = '';
  blocks.forEach(([t, s, big, bs], i) => {
    const y = 2 + i * 42;
    b += `<rect x="2" y="${y}" width="196" height="38" rx="3" fill="#fff" fill-opacity="0.06" stroke="#fff" stroke-opacity="0.22" stroke-width="0.6"/>`;
    b += `<rect x="2" y="${y}" width="2.4" height="38" rx="1" fill="${OL}"/>`;
    b += txt(9, y + 12, t, { size: 5, op: 1, weight: 700 });
    b += txt(9, y + 22, s, { size: 4, op: 0.7 });
    b += txt(192, y + 21, big, { anchor: 'end', size: 10, op: 1, weight: 800, fill: OL });
    b += txt(192, y + 31, bs, { anchor: 'end', size: 3.8, op: 0.75 });
  });
  return svg(200, 128, b, 856);
}

// ── 5. DO YOU NEED IT? ───────────────────────────────────────────
function drawNeed() {
  const rows = [
    ['Daily shuffle', 'under ~10-50 TB', '100s of TB to PBs'],
    ['Fetch failures', 'isolated jobs', 'cluster-wide, daily'],
    ['Disk wear', 'rated lifetime', '3-year SSDs in ~6 mo'],
    ['Fix', 'partitions=4000 + AQE', 'RSS, Magnet, Celeborn'],
  ];
  let b = '';
  const x0 = 4, c1 = 62, c2 = 132, rh = 17, y0 = 15;
  b += lbl(c1, 9, 'TUNING STILL WORKS', { size: 3.9, op: 0.8 });
  b += lbl(c2, 9, 'SHUFFLE SERVICE', { size: 3.9, op: 1, fill: OL });
  rows.forEach(([k, a, z], i) => {
    const y = y0 + i * rh;
    if (i % 2 === 0) b += `<rect x="${x0 - 2}" y="${y - 1}" width="198" height="${rh - 1}" rx="2" fill="#fff" fill-opacity="0.04"/>`;
    b += txt(x0, y + 10, k, { size: 4.6, op: 1, weight: 700 });
    b += txt(c1, y + 10, a, { size: 4.2, op: 0.8 });
    b += txt(c2, y + 10, z, { size: 4.2, op: 1, fill: OL, weight: 600 });
  });
  return svg(200, y0 + 4 * rh, b, 856);
}

const slides = [
  {
    notes: 'Cover: local-disk shuffle, where a reducer fetches from every mapper node, vs a remote shuffle service, where it fetches from one place',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Spark shuffle at scale')}
      ${headline(`At petabyte scale ${em2('shuffle leaves the local disk')}`, 54)}
      ${well(drawTopology(), { card: false })}
      ${caption(`Spark writes map output to local disk and reducers fetch it over the network. Past hundreds of terabytes a day, that design turns into a hardware problem.`)}
    `, 'A'),
  },
  {
    notes: 'Failure becomes a budget: SSD wear-out in ~6 months, the 90TB/250,000-task stage, fetch failure ceiling 4 to 20, hundreds to thousands of fetch failures per day',
    html: stage(`
      ${eyebrow('When disks wear out')}
      ${headline(`Fetch failures become ${em2('a budget to plan for')}`, 54)}
      ${well(drawBudget(), { pad: 26 })}
      ${caption(`No partition count changes how many bytes a disk physically absorbs. Teams at this scale size the retry budget and watch the trend.`)}
    `, 'B'),
  },
  {
    notes: 'Three architectural ceilings: 2GB per shuffle block, 8GB/512M-row broadcast built on the driver, AQE skew handling limited to sort-merge joins',
    html: stage(`
      ${eyebrow('Hard limits')}
      ${headline(`Three ceilings ${em2('no config moves')}`, 56)}
      ${well(drawCeilings(), { pad: 26 })}
      ${caption(`Below petabyte scale, spark.sql.shuffle.partitions and AQE are the right levers. These limits sit in Spark's shuffle internals, out of reach of either.`)}
    `, 'C'),
  },
  {
    notes: "What Uber, LinkedIn Magnet and Celeborn built, with the figures from their own engineering posts as cited in the article",
    html: stage(`
      ${eyebrow('What the largest users built')}
      ${headline(`Move shuffle ${em2('off the compute node')}`, 56)}
      ${well(drawBuilt(), { pad: 26 })}
      ${caption(`Magnet also cut end-to-end runtime 26% on a 2TB-shuffle job. Celeborn brought 20x fewer task failures during maintenance and about 10% lower compute cost.`)}
    `, 'D'),
  },
  {
    notes: "Closer: the article's signal table, tuning vs shuffle service territory. One Yeedu line + CTA, no QR",
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Do you need one?')}
      ${headline(`Most teams ${em2('are not there yet')}`, 56)}
      ${well(drawNeed(), { card: false })}
      ${caption(`Adopt a shuffle service once disk wear is the binding constraint. Until then, 4,000 shuffle partitions plus AQE covers most production work, and Yeedu runs that same Spark code faster with zero code changes.`)}
      ${cta()}
    `, 'C'),
  },
];

const NAME = 'Why Spark Shuffle Breaks Down at Petabyte Scale';

if (OLD_ID) await deleteCarousel(OLD_ID);
const id = await buildCarousel(NAME, slides);
if (!process.env.SKIP_EXPORT) await exportDeck(id, NAME);
