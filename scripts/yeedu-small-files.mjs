// ════════════════════════════════════════════════════════════════
// The Spark Small-File Problem: Why Compaction Is a Recurring Tax
//
// 5 slides, 4:5. The article's argument: small files cost Spark on the
// driver before any task runs; compaction fixes the symptom but bills you
// again every cycle; the lasting fix is file size at write time, and CDC
// tables outrun any schedule. All figures are the article's, with its
// sources. Yeedu gets one closing line plus the CTA, as on the other
// technical deep-dive decks.
// ════════════════════════════════════════════════════════════════
import { stage, logoMark, eyebrow, headline, caption, well, svg, buildCarousel, deleteCarousel, exportDeck } from './yeedu-chrome.mjs';
import { O, OL, MONO, em2, lbl, txt, card, arrow, cta } from './yeedu-deck-parts.mjs';

const OLD_ID = process.env.OLD_ID || '';

// ── 1. COVER: the driver lists, executors wait ───────────────────
function drawListing() {
  let b = '';
  b += card(4, 30, 52, 30, 'Driver', 'listLeafFiles', { hot: true, titleSize: 5.4, subSize: 4.2, mono: false });
  // swarm of small files
  for (let r = 0; r < 7; r++) for (let c = 0; c < 9; c++) {
    const x = 76 + c * 7, y = 8 + r * 11;
    b += `<rect x="${x}" y="${y}" width="5" height="7" rx="0.8" fill="#fff" fill-opacity="${0.12 + ((r * 9 + c) % 5) * 0.05}"/>`;
  }
  b += lbl(76, 94, 'THOUSANDS OF OBJECTS', { size: 3.8, op: 0.6 });
  for (let i = 0; i < 5; i++) b += `<path d="M57,${38 + i * 3.5} L74,${12 + i * 17}" stroke="${OL}" stroke-opacity="0.5" stroke-width="0.6" stroke-dasharray="1.5 1.2"/>`;
  b += lbl(30, 70, 'LIST + FOOTER READS', { anchor: 'middle', size: 3.8, op: 0.9, fill: OL });
  // idle executors
  for (let i = 0; i < 4; i++) {
    const y = 14 + i * 18;
    b += `<rect x="148" y="${y}" width="48" height="13" rx="2" fill="#fff" fill-opacity="0.04" stroke="#fff" stroke-opacity="0.2" stroke-width="0.5" stroke-dasharray="2 1.5"/>`;
    b += txt(172, y + 8.6, 'executor idle', { anchor: 'middle', size: 3.9, op: 0.45 });
  }
  b += txt(172, 94, 'tasks running: 0', { anchor: 'middle', size: 4.6, op: 1, fill: OL, family: MONO, weight: 600 });
  return svg(200, 100, b, 856);
}

// ── 2. WHAT ONE SMALL FILE COSTS ─────────────────────────────────
function drawCosts() {
  const stats = [
    ['~200ms', 'metadata overhead per file on S3, before a row is read'],
    ['1,000x', 'API-call cost: 1M small files vs 1,000 right-sized ones'],
    ['~3 GB', 'NameNode heap for 10M files at ~150 bytes each'],
    ['< 30M', 'files where NameNode OutOfMemoryError has been reported'],
  ];
  let b = '';
  stats.forEach(([n, s], i) => {
    const y = 2 + i * 31;
    b += `<rect x="2" y="${y}" width="196" height="27" rx="3" fill="#fff" fill-opacity="0.06" stroke="#fff" stroke-opacity="0.22" stroke-width="0.6"/>`;
    b += `<rect x="2" y="${y}" width="2.4" height="27" rx="1" fill="${OL}"/>`;
    b += txt(10, y + 18, n, { size: 11, op: 1, weight: 800, fill: OL });
    b += txt(66, y + 15.5, s, { size: 4.4, op: 0.85 });
  });
  return svg(200, 126, b, 856);
}

// ── 3. THE COMPACTION LOOP ───────────────────────────────────────
function drawLoop() {
  let b = '';
  const nodes = [
    [100, 10, 'Small files land', false],
    [168, 46, 'Read old (GET)', false],
    [148, 92, 'Write new (PUT)', false],
    [52, 92, '~2x storage until expiry', true],
    [32, 46, 'Expire old (DELETE)', false],
  ];
  // ring
  b += `<ellipse cx="100" cy="54" rx="66" ry="40" fill="none" stroke="${O}" stroke-opacity="0.35" stroke-width="0.8" stroke-dasharray="2.5 2"/>`;
  nodes.forEach(([x, y, t, hot]) => {
    const w = t.length * 2.3 + 12;
    b += `<rect x="${x - w / 2}" y="${y - 7}" width="${w}" height="14" rx="3" fill="${hot ? O : '#1c1814'}" fill-opacity="${hot ? 0.3 : 0.95}" stroke="${hot ? O : '#fff'}" stroke-opacity="${hot ? 1 : 0.35}" stroke-width="0.7"/>`;
    b += txt(x, y + 1.6, t, { anchor: 'middle', size: 4.3, op: 1, weight: 600 });
  });
  b += txt(100, 52, 'every cycle,', { anchor: 'middle', size: 4.6, op: 0.75 });
  b += txt(100, 59, 'not once', { anchor: 'middle', size: 4.6, op: 0.75 });
  b += lbl(4, 116, 'ICEBERG SKIPS NEAR-TARGET FILES', { size: 4, op: 1, fill: OL });
  b += txt(4, 126, 'min-file-size-bytes = 75% of target: a 220MB file under a 256MB target is left alone', { size: 4, op: 0.8 });
  return svg(200, 130, b, 856);
}

// ── 4. WRITE-TIME LEVERS ─────────────────────────────────────────
function drawLevers() {
  const rows = [
    ['Delta optimizeWrite', 'bins output before commit', '512 MiB bins'],
    ['Delta Auto Compaction', 'inline OPTIMIZE after commit', '128MB, 50 files'],
    ['Delta OPTIMIZE', 'scheduled target size', '1 GB'],
    ['Iceberg rewrite', 'only small files eligible', '75% of target'],
    ['Spark AQE coalesce', 'merges tiny shuffle partitions', '1 MB min, 3.2.0+'],
    ['Glue groupFiles', 'groups inputs you do not own', 'inPartition'],
  ];
  let b = '';
  const x0 = 4, c1 = 72, c2 = 150, rh = 20, y0 = 16;
  b += lbl(x0, 10, 'LEVER', { size: 4, op: 0.55 });
  b += lbl(c1, 10, 'WHAT IT DOES', { size: 4, op: 0.8 });
  b += lbl(c2, 10, 'DEFAULT', { size: 4, op: 1, fill: OL });
  rows.forEach(([k, a, z], i) => {
    const y = y0 + i * rh;
    if (i % 2 === 0) b += `<rect x="${x0 - 2}" y="${y - 1}" width="198" height="${rh - 1}" rx="2" fill="#fff" fill-opacity="0.04"/>`;
    b += txt(x0, y + 11.5, k, { size: 4.6, op: 1, weight: 700 });
    b += txt(c1, y + 11.5, a, { size: 4.1, op: 0.75 });
    b += txt(c2, y + 11.5, z, { size: 4.3, op: 1, fill: OL, weight: 600 });
  });
  return svg(200, y0 + 6 * rh + 2, b, 856);
}

// ── 5. CLOSER: CDC outruns any schedule ──────────────────────────
function drawCDC() {
  let b = '';
  b += lbl(4, 8, 'CDC AND STREAMING TABLES', { size: 4.2, op: 1, fill: OL });
  // file arrival rate vs compaction clears
  for (let i = 0; i < 26; i++) b += `<rect x="${4 + i * 7.4}" y="14" width="5" height="9" rx="0.8" fill="#fff" fill-opacity="0.3"/>`;
  b += txt(4, 31, 'small files every commit', { size: 4.2, op: 0.7 });
  [40, 110, 180].forEach((x) => { b += `<rect x="${x - 10}" y="36" width="20" height="10" rx="2" fill="${O}" fill-opacity="0.35" stroke="${O}" stroke-width="0.6"/>`; });
  b += txt(4, 54, 'a scheduled OPTIMIZE never catches up', { size: 4.2, op: 0.7 });
  b += card(2, 60, 97, 24, 'Merge-on-read', 'defers rewrites to a batch', { titleSize: 4.8, subSize: 4 });
  b += card(101, 60, 97, 24, 'Deletion vectors (v3)', 'less write amplification', { titleSize: 4.8, subSize: 4 });
  return svg(200, 86, b, 856);
}

const slides = [
  {
    notes: 'Cover: the driver lists thousands of objects and reads footers while executors sit idle; the Spark UI shows tasks running: 0',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Spark small files')}
      ${headline(`Small files cost Spark ${em2('before a row loads')}`, 56)}
      ${well(drawListing(), { card: false })}
      ${caption(`Listing and partition-size estimation run on the driver. A job can sit for minutes with zero tasks running while it walks the directory tree.`)}
    `, 'A'),
  },
  {
    notes: 'Per-file cost figures from the article: ~200ms metadata per file on S3, ~1000x API cost, NameNode ~150 bytes per file, OOM under 30M files',
    html: stage(`
      ${eyebrow('The per-file bill')}
      ${headline(`File count breaks it ${em2('long before data volume does')}`, 52)}
      ${well(drawCosts(), { pad: 26 })}
      ${caption(`Schema inference across many small JSON files can stop the driver before any executor starts. An explicit StructType sidesteps it.`)}
    `, 'B'),
  },
  {
    notes: 'Compaction works but repeats its GET/PUT/DELETE bill every cycle and holds ~2x storage until old files expire; Iceberg skips files above 75% of target',
    html: stage(`
      ${eyebrow('Compaction')}
      ${headline(`Compaction works ${em2('and bills you every cycle')}`, 54)}
      ${well(drawLoop(), { pad: 26 })}
      ${caption(`Run OPTIMIZE nightly against a table that keeps producing small files and the rewrite becomes a standing write cost on top of the read cost it removes.`)}
    `, 'C'),
  },
  {
    notes: "Write-time levers and defaults from the article's table: optimizeWrite, Auto Compaction, OPTIMIZE target, Iceberg threshold, AQE coalesce, Glue grouping",
    html: stage(`
      ${eyebrow('Fix it at write time')}
      ${headline(`Land files near target ${em2('on the first commit')}`, 54)}
      ${well(drawLevers(), { pad: 26 })}
      ${caption(`Pay the sizing cost inline, on the write that caused it. Glue's read-time grouping is the fallback when you do not own the producer.`)}
    `, 'D'),
  },
  {
    notes: 'Closer: CDC and streaming tables outrun any compaction schedule; merge-on-read and v3 deletion vectors narrow the gap; write-time control first. One Yeedu line + CTA, no QR',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('CDC and streaming')}
      ${headline(`Write-time control ${em2('is the lever to pull first')}`, 54)}
      ${well(drawCDC(), { card: false })}
      ${caption(`Upserts arrive faster than any batch job can clear them, so size files where they are written. The reads still run on Spark, and Yeedu runs that Spark faster with zero code changes, inside your own cloud account.`)}
      ${cta()}
    `, 'C'),
  },
];

const NAME = 'The Spark Small-File Problem: Why Compaction Is a Recurring Tax';

if (OLD_ID) await deleteCarousel(OLD_ID);
const id = await buildCarousel(NAME, slides);
if (!process.env.SKIP_EXPORT) await exportDeck(id, NAME);
