// ════════════════════════════════════════════════════════════════
// CDC-to-Iceberg Pipelines — Postgres/MySQL Logical Replication
// Source: https://yeedu.com/blog/cdc-to-iceberg-pipelines-postgres-mysql-logical-replication
//
// 5 slides, 4:5. One bespoke drawing per slide — no shared renderer
// map. Chrome only comes from ./yeedu-chrome.mjs.
// ════════════════════════════════════════════════════════════════
import {
  C, stage, logoMark, eyebrow, headline, em, caption, well, svg, annot,
  makeQr, ctaPill, buildCarousel, deleteCarousel, exportDeck,
} from './yeedu-chrome.mjs';

const BLOG_URL = 'https://yeedu.com/blog/cdc-to-iceberg-pipelines-postgres-mysql-logical-replication';
const OLD_ID = null;   // set to the previous deck's id to replace it

const O = C.orange, OL = C.orangeLight;

// ── 1. COVER ─────────────────────────────────────────────────────
// Claim: a CDC pipeline is five hops, and every handoff is a way to lose data.
// Vertical chain, four orange burst markers on the connectors. The vocabulary
// established here (many stages) is inverted on the closer (one merge).
function drawHopChain() {
  const NODES = ['POSTGRES', 'DEBEZIUM', 'KAFKA', 'FLINK', 'ICEBERG'];
  const FAILS = [
    ['replication slot bloat', 'fills the primary disk'],
    ['partitioned publication', 'drops rows silently'],
    ['commit cadence becomes', 'a tuning problem'],
    ['small files + equality', 'delete amplification'],
  ];
  const cx = 68, halfH = 13, w = 76;
  const cy = i => 14 + i * 45.5;

  let b = '';

  // connectors + burst markers + failure leaders
  for (let i = 0; i < 4; i++) {
    const y1 = cy(i) + halfH, y2 = cy(i + 1) - halfH, mid = (y1 + y2) / 2;
    b += `<line x1="${cx}" y1="${y1}" x2="${cx}" y2="${y2}" stroke="#fff" stroke-opacity="0.28" stroke-width="2" stroke-dasharray="4 5"/>`;
    // burst = 6 spokes + core
    b += `<g stroke="${O}" stroke-width="1.6" stroke-linecap="round">`;
    for (let k = 0; k < 6; k++) {
      const a = (k * Math.PI) / 3;
      b += `<line x1="${(cx + 2.4 * Math.cos(a)).toFixed(1)}" y1="${(mid + 2.4 * Math.sin(a)).toFixed(1)}" x2="${(cx + 6 * Math.cos(a)).toFixed(1)}" y2="${(mid + 6 * Math.sin(a)).toFixed(1)}"/>`;
    }
    b += `</g><circle cx="${cx}" cy="${mid}" r="2.2" fill="${O}"/>`;
    b += `<line x1="${cx + 8}" y1="${mid}" x2="${cx + 38}" y2="${mid}" stroke="#fff" stroke-opacity="0.22" stroke-width="1.5"/>`;
    b += `<text x="${cx + 42}" y="${mid - 1}" font-family="Inter" font-size="5.6" font-weight="500" fill="#fff" opacity="0.66">${FAILS[i][0]}</text>`;
    b += `<text x="${cx + 42}" y="${mid + 6.4}" font-family="Inter" font-size="5.6" font-weight="500" fill="#fff" opacity="0.66">${FAILS[i][1]}</text>`;
  }

  // stage nodes
  b += `<g fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="2">`;
  NODES.forEach((_, i) => { b += `<rect x="${cx - w / 2}" y="${cy(i) - halfH}" width="${w}" height="${halfH * 2}" rx="6"/>`; });
  b += `</g>`;
  NODES.forEach((n, i) => {
    b += `<text x="${cx}" y="${cy(i) + 3.2}" text-anchor="middle" font-family="Montserrat" font-size="9" font-weight="700" letter-spacing="0.6" fill="#fff">${n}</text>`;
  });

  return svg(176, 210, b, 690);
}

// ── 2. EQUALITY DELETES ──────────────────────────────────────────
// Claim: delete files accumulate one per commit, and every read merges all of them.
// Growing stack on the left "causes" (dashed) a read-cost curve on the right.
function drawDeleteAmplification() {
  let b = '';
  // the one data file
  b += `<rect x="16" y="118" width="78" height="17" rx="3" fill="#fff" fill-opacity="0.10" stroke="#fff" stroke-opacity="0.5" stroke-width="2.5"/>`;
  b += `<text x="55" y="146" text-anchor="middle" font-family="Inter" font-size="6.2" font-weight="600" letter-spacing="0.8" fill="#fff" opacity="0.42">ONE DATA FILE</text>`;
  // accumulating delete files — nine slabs, one per commit
  b += `<g fill="none" stroke="#fff" stroke-opacity="0.3" stroke-width="1.4">`;
  for (let i = 0; i < 9; i++) b += `<rect x="16" y="${110 - i * 8.5}" width="78" height="6" rx="1.5"/>`;
  b += `</g>`;
  b += `<text x="55" y="30" text-anchor="middle" font-family="Inter" font-size="6.2" font-weight="600" letter-spacing="0.8" fill="#fff" opacity="0.42">DELETE FILES — ONE PER COMMIT</text>`;
  b += `<path d="M55,34 L55,40" stroke="#fff" stroke-opacity="0.25" stroke-width="1.5"/>`;

  // "causes" — dashed connector + drawn chevron
  b += `<line x1="100" y1="86" x2="112" y2="86" stroke="#fff" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="4 5"/>`;
  b += `<path d="M110,82.5 L114,86 L110,89.5" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="2" stroke-linecap="round"/>`;

  // read-cost curve
  b += `<line x1="122" y1="135" x2="196" y2="135" stroke="#fff" stroke-opacity="0.16" stroke-width="1.5"/>`;
  b += `<line x1="122" y1="135" x2="122" y2="42" stroke="#fff" stroke-opacity="0.16" stroke-width="1.5"/>`;
  b += `<path d="M122,131 C146,129 162,120 174,96 C184,76 190,58 194,46" fill="none" stroke="${O}" stroke-width="3.6" stroke-linecap="round"/>`;
  // right-anchored: left-anchored at the axis this runs off the 200-unit viewBox
  b += `<text x="196" y="38" text-anchor="end" font-family="Inter" font-size="6.2" font-weight="600" letter-spacing="0.8" fill="#fff" opacity="0.42">READ COST PER QUERY</text>`;
  // the annot stack is wider than the right-hand column — give it the full width
  b += annot(10, 158, { label: 'DATA FILES : DELETE FILES', value: '1 : n', note: 'every scan merges all n before returning a row' });
  return svg(200, 198, b);
}

// ── 3. SMALL FILES / COMPACTION ──────────────────────────────────
// Claim: 58,176 objects and 2 GB became ~437 MB, and the query got 40% faster.
// Ragged comb -> funnel -> few thick bars, with the query-time bars drawn to scale.
function drawCompaction() {
  let b = '';
  // ragged comb — the count of marks is the data
  const N = 40, x0 = 10, x1 = 78, base = 84;
  b += `<g stroke="#fff" stroke-opacity="0.34" stroke-width="0.9" stroke-linecap="round">`;
  for (let i = 0; i < N; i++) {
    const x = (x0 + (i * (x1 - x0)) / (N - 1)).toFixed(2);
    const top = 26 + ((i * 37) % 23);           // deterministic jitter — ragged is the point
    b += `<line x1="${x}" y1="${top}" x2="${x}" y2="${base}"/>`;
  }
  b += `</g>`;
  // funnel — the mechanism, deliberately dim
  b += `<path d="M88,22 L118,46 L118,62 L88,86 Z" fill="none" stroke="#fff" stroke-opacity="0.25" stroke-width="2"/>`;
  // above the funnel — at y=98 it collided with the "58,176 OBJECTS" label
  b += `<text x="103" y="16" text-anchor="middle" font-family="Inter" font-size="5.8" font-weight="600" letter-spacing="1" fill="#fff" opacity="0.4">COMPACTION</text>`;
  // few, thick, orange
  b += `<g stroke="${O}" stroke-width="7" stroke-linecap="round">`;
  [136, 154, 172].forEach(x => { b += `<line x1="${x}" y1="42" x2="${x}" y2="84"/>`; });
  b += `</g>`;
  b += `<text x="44" y="98" text-anchor="middle" font-family="Inter" font-size="6.2" font-weight="600" letter-spacing="0.6" fill="#fff" opacity="0.5">58,176 OBJECTS · 2 GB</text>`;
  b += `<text x="154" y="98" text-anchor="middle" font-family="Inter" font-size="6.2" font-weight="600" letter-spacing="0.6" fill="${OL}">~437 MB</text>`;

  // query-time bars, lengths proportional to 99s and 59s
  const bx = 54, k = 1.32;
  b += `<line x1="10" y1="112" x2="196" y2="112" stroke="#fff" stroke-opacity="0.1" stroke-width="1"/>`;
  b += `<text x="48" y="128" text-anchor="end" font-family="Inter" font-size="6" font-weight="600" letter-spacing="0.8" fill="#fff" opacity="0.42">BEFORE</text>`;
  b += `<rect x="${bx}" y="120" width="${(99 * k).toFixed(1)}" height="11" rx="2.5" fill="#fff" fill-opacity="0.24"/>`;
  b += `<text x="${(bx + 99 * k - 5).toFixed(1)}" y="128.5" text-anchor="end" font-family="Montserrat" font-size="8" font-weight="700" fill="#fff" opacity="0.75">1:39</text>`;
  b += `<text x="48" y="150" text-anchor="end" font-family="Inter" font-size="6" font-weight="600" letter-spacing="0.8" fill="#fff" opacity="0.42">AFTER</text>`;
  b += `<rect x="${bx}" y="142" width="${(59 * k).toFixed(1)}" height="11" rx="2.5" fill="${O}"/>`;
  b += `<text x="${(bx + 59 * k - 5).toFixed(1)}" y="150.5" text-anchor="end" font-family="Montserrat" font-size="8" font-weight="700" fill="#fff">0:59</text>`;
  b += `<text x="${(bx + 99 * k + 6).toFixed(1)}" y="141" font-family="Montserrat" font-size="9" font-weight="800" fill="${OL}">40%</text>`;
  b += `<text x="${(bx + 99 * k + 6).toFixed(1)}" y="149" font-family="Inter" font-size="5.4" fill="#fff" opacity="0.55">faster</text>`;
  return svg(200, 162, b);
}

// ── 4. REPLICATION SLOT BLOAT ────────────────────────────────────
// Claim: with the connector down, WAL climbs toward a hard disk ceiling.
// Three rays at the article's stated rates; the crossing point is the data.
function drawWalCeiling() {
  const ox = 26, oy = 118, ceil = 34, perHr = 13.67;
  const RATES = [
    { gb: 50, hrs: 2,  hero: true },
    { gb: 20, hrs: 5,  hero: false },
    { gb: 10, hrs: 10, hero: false },
  ];
  let b = '';
  b += `<line x1="${ox}" y1="${oy}" x2="192" y2="${oy}" stroke="#fff" stroke-opacity="0.16" stroke-width="1.5"/>`;
  b += `<line x1="${ox}" y1="${oy}" x2="${ox}" y2="${ceil}" stroke="#fff" stroke-opacity="0.16" stroke-width="1.5"/>`;
  // the ceiling — solid, because the limit is real
  b += `<line x1="${ox}" y1="${ceil}" x2="192" y2="${ceil}" stroke="#fff" stroke-opacity="0.4" stroke-width="2"/>`;
  b += `<text x="${ox}" y="${ceil - 6}" font-family="Inter" font-size="6.2" font-weight="600" letter-spacing="0.9" fill="#fff" opacity="0.5">100 GB FREE ON THE PRIMARY</text>`;

  RATES.forEach(r => {
    const x = ox + r.hrs * perHr;
    b += `<line x1="${ox}" y1="${oy}" x2="${x.toFixed(1)}" y2="${ceil}" stroke="${r.hero ? O : '#fff'}" ${r.hero ? '' : 'stroke-opacity="0.3"'} stroke-width="${r.hero ? 3.6 : 2}" stroke-linecap="round"/>`;
    b += `<circle cx="${x.toFixed(1)}" cy="${ceil}" r="${r.hero ? 3.2 : 2.2}" fill="${r.hero ? O : '#fff'}" ${r.hero ? '' : 'fill-opacity="0.35"'}/>`;
    b += `<text x="${x.toFixed(1)}" y="${ceil + 12}" text-anchor="middle" font-family="Inter" font-size="6" font-weight="600" fill="${r.hero ? OL : '#fff'}" ${r.hero ? '' : 'opacity="0.5"'}>${r.gb} GB/hr</text>`;
    b += `<line x1="${x.toFixed(1)}" y1="${oy}" x2="${x.toFixed(1)}" y2="${oy + 4}" stroke="#fff" stroke-opacity="0.25" stroke-width="1.5"/>`;
    b += `<text x="${x.toFixed(1)}" y="${oy + 14}" text-anchor="middle" font-family="Montserrat" font-size="8" font-weight="700" fill="#fff" opacity="${r.hero ? 0.9 : 0.45}">${r.hrs}h</text>`;
  });
  b += `<text x="${ox}" y="${oy + 14}" text-anchor="middle" font-family="Montserrat" font-size="8" font-weight="700" fill="#fff" opacity="0.35">0</text>`;
  b += annot(26, 152, { label: 'CONNECTOR DOWN AT PEAK WAL RATE', value: '2 hours', note: 'before the replication slot fills the primary disk' });
  return svg(200, 190, b);
}

// ── 5. CLOSER ────────────────────────────────────────────────────
// Bookend: the five hops of slide 1, inverted — five stubs converging on one merge.
function drawConvergence() {
  let b = '';
  const ys = [18, 38, 58, 78, 98], nodeX = 140, nodeY = 58;
  b += `<g stroke="#fff" stroke-opacity="0.3" stroke-width="2" stroke-linecap="round">`;
  ys.forEach(y => { b += `<line x1="20" y1="${y}" x2="44" y2="${y}"/>`; });
  b += `</g>`;
  b += `<g fill="none" stroke="#fff" stroke-opacity="0.3" stroke-width="2">`;
  ys.forEach(y => { b += `<path d="M44,${y} C96,${y} 100,${nodeY} ${nodeX - 8},${nodeY}"/>`; });
  b += `</g>`;
  b += `<text x="20" y="9" font-family="Inter" font-size="6.2" font-weight="600" letter-spacing="0.9" fill="#fff" opacity="0.42">FIVE HOPS</text>`;
  b += `<circle cx="${nodeX}" cy="${nodeY}" r="7.5" fill="${O}"/>`;
  b += `<circle cx="${nodeX}" cy="${nodeY}" r="13" fill="none" stroke="${O}" stroke-opacity="0.35" stroke-width="1.5"/>`;
  b += `<text x="${nodeX + 20}" y="${nodeY + 3}" font-family="Montserrat" font-size="10" font-weight="800" fill="#fff">ONE MERGE</text>`;
  // both labels kept short — the long versions overlapped in the middle
  b += annot(20, 118, { label: 'TEAMS ACTUALLY NEED', value: 'minutes', note: 'not sub-minute freshness' });
  b += annot(200, 118, { label: 'ICEBERG v3', value: '50–80%', note: 'faster reads than v2', anchor: 'end' });
  return svg(200, 156, b, 780);
}

// ── slides ───────────────────────────────────────────────────────
const qr = await makeQr(BLOG_URL, 150);

const slides = [
  {
    notes: 'Cover — vertical five-hop CDC chain with four failure bursts (many→connector→outcome vocabulary, bookended on slide 5)',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('CDC · Postgres & MySQL')}
      ${headline(`Five hops. ${em('Five ways to lose a row.')}`, 52)}
      ${well(drawHopChain(), { card: false })}
      <p style="margin:14px 0 0;font-size:22px;line-height:1.5;color:${C.text2};max-width:880px;">
        One team's partitioned publication silently dropped rows for <strong style="color:${C.orangeLight};font-weight:600;">three weeks</strong> before anyone noticed.
      </p>
    `, 'A'),
  },
  {
    notes: 'Equality deletes — accumulating delete-file stack "causes" a bending read-cost curve (proportional stack + annotation)',
    html: stage(`
      ${eyebrow('Read amplification')}
      ${headline('Every delete file is a tax on every read.', 50)}
      ${well(drawDeleteAmplification())}
      ${caption(`Equality deletes let Flink write without reading first — the cost moves to query time. Each commit adds a delete file the reader must merge.`)}
    `, 'B'),
  },
  {
    notes: 'Small files — ragged comb → funnel → three thick bars, plus query-time bars drawn to 99s/59s scale (AWS EMR numbers)',
    html: stage(`
      ${eyebrow('The small-file explosion')}
      ${headline('58,176 objects. One table.', 50)}
      ${well(drawCompaction())}
      ${caption(`AWS consolidated 2 GB of tiny Parquet objects into ~437 MB. Same data, same query — 40% less time.`)}
    `, 'C'),
  },
  {
    notes: 'Replication slot bloat — three WAL growth rays crossing a solid disk-ceiling rule; crossing time is the data',
    html: stage(`
      ${eyebrow('Replication slot bloat')}
      ${headline('A dead connector is a clock on your primary.', 48)}
      ${well(drawWalCeiling())}
      ${caption(`Postgres holds WAL until the slot advances. At 20–50 GB/hr, a stopped Debezium connector is a disk-full incident on the production database.`)}
    `, 'B'),
  },
  {
    notes: 'Closer — convergence bookend inverting the cover chain (five hops → one merge), v3 stat, CTA pill + QR',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Build it boring')}
      ${headline(`Fewer moving parts. ${em('Fresh enough.')}`, 50)}
      ${well(drawConvergence(), { card: false })}
      <div style="display:flex;align-items:center;justify-content:space-between;gap:32px;margin-top:16px;">
        <div>
          ${ctaPill('Cut your Spark bill 60–80%')}
          <div style="margin-top:16px;font-size:21px;color:${C.text2};font-weight:500;">sales@yeedu.io</div>
        </div>
        <div style="text-align:center;">
          ${qr}
          <div style="margin-top:8px;font-size:13px;color:${C.text3};letter-spacing:0.6px;">READ THE POST</div>
        </div>
      </div>
    `, 'D'),
  },
];

const NAME = 'CDC-to-Iceberg Pipelines — Postgres/MySQL Logical Replication';

if (OLD_ID) { console.log('Removing superseded deck…'); await deleteCarousel(OLD_ID); }
const id = await buildCarousel(NAME, slides);
await exportDeck(id);
