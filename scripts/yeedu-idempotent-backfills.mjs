// ════════════════════════════════════════════════════════════════
// Idempotent Backfills — Partition Overwrite Risks
// Source: technical-deep-dive 2026-08-10 "Idempotent backfills: why the fast
// partition-overwrite patterns in Spark, Delta and Iceberg are the ones most
// likely to corrupt data" (not published yet).
//
// 5 slides, 4:5. One bespoke drawing per slide — no shared renderer
// map. Chrome only comes from ./yeedu-chrome.mjs.
// Every number is the article's source (GitHub issues, Expedia), never Yeedu's.
// ════════════════════════════════════════════════════════════════
import {
  C, stage, logoMark, eyebrow, headline, em, caption, well, svg, annot,
  makeQr, ctaPill, buildCarousel, deleteCarousel, exportDeck,
} from './yeedu-chrome.mjs';

const BLOG_URL = null; // not published yet — set the live URL and re-run to add the QR
const OLD_ID = '86e7d2e9-1063-4029-b579-9afb7f5b9253';

const O = C.orange, OL = C.orangeLight;

// Shared partition-strip geometry: seven day partitions across the 200-unit viewBox.
// The strip is the deck's vocabulary; the cover breaks it, the closer makes it whole.
const DAYS = ['03·01', '03·02', '03·03', '03·04', '03·05', '03·06', '03·07'];
const CELL_W = 22, STEP = 27, X0 = 8;
const cellX = i => X0 + i * STEP;
const cellCx = i => X0 + i * STEP + CELL_W / 2;

// ── 1. COVER ─────────────────────────────────────────────────────
// Claim: dynamic overwrite only replaces partitions present in the batch;
// a partition the batch is missing keeps its stale rows, silently.
// Batch bar → six solid overwrite arrows into fresh cells, one round-dotted
// ghost arrow to the absent day, whose cell stays stale and orange.
function drawStaleSurvivor() {
  const MISSING = 4;
  const barY = 18, barH = 22, arrowTop = 44, arrowBot = 68, cellY = 74, cellH = 62;
  let b = '';

  b += `<text x="${X0}" y="11" font-family="Inter" font-size="6.2" font-weight="600" letter-spacing="0.9" fill="#fff" opacity="0.42">BACKFILL BATCH</text>`;
  b += `<rect x="${X0}" y="${barY}" width="${7 * STEP - 5}" height="${barH}" rx="5" fill="none" stroke="#fff" stroke-opacity="0.3" stroke-width="2"/>`;
  // rows in the batch — one chip per day it carries; the missing day has none
  DAYS.forEach((_, i) => {
    if (i === MISSING) return;
    b += `<rect x="${cellX(i) + 4}" y="${barY + 6}" width="${CELL_W - 8}" height="${barH - 12}" rx="2" fill="#fff" fill-opacity="0.42"/>`;
  });

  // overwrite arrows: solid = it happens, round-dotted = it doesn't
  DAYS.forEach((_, i) => {
    const x = cellCx(i);
    if (i === MISSING) {
      b += `<line x1="${x}" y1="${arrowTop}" x2="${x}" y2="${arrowBot}" stroke="#fff" stroke-opacity="0.55" stroke-width="3" stroke-dasharray="1 8" stroke-linecap="round"/>`;
      return;
    }
    b += `<line x1="${x}" y1="${arrowTop}" x2="${x}" y2="${arrowBot}" stroke="#fff" stroke-opacity="0.7" stroke-width="3" stroke-linecap="round"/>`;
    b += `<path d="M${x - 4},${arrowBot - 5} L${x},${arrowBot} L${x + 4},${arrowBot - 5}" fill="none" stroke="#fff" stroke-opacity="0.7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  });

  // the table's day partitions
  DAYS.forEach((d, i) => {
    const stale = i === MISSING, x = cellX(i);
    b += `<rect x="${x}" y="${cellY}" width="${CELL_W}" height="${cellH}" rx="4" fill="${stale ? O : '#fff'}" fill-opacity="${stale ? 0.2 : 0.08}" stroke="${stale ? O : '#fff'}" stroke-opacity="${stale ? 1 : 0.45}" stroke-width="2"/>`;
    b += `<g stroke="${stale ? O : '#fff'}" stroke-opacity="${stale ? 0.9 : 0.4}" stroke-width="1.5" stroke-linecap="round">`;
    for (let r = 0; r < 5; r++) b += `<line x1="${x + 6}" y1="${cellY + 11 + r * 10}" x2="${x + CELL_W - 6}" y2="${cellY + 11 + r * 10}"/>`;
    b += `</g>`;
    b += `<text x="${cellCx(i)}" y="${cellY + cellH + 12}" text-anchor="middle" font-family="Inter" font-size="5.8" font-weight="600" fill="${stale ? OL : '#fff'}" opacity="${stale ? 1 : 0.42}">${d}</text>`;
  });

  // annotation for the survivor
  const ax = cellCx(MISSING), ay = cellY + cellH + 18;
  b += `<line x1="${ax}" y1="${ay}" x2="${ax}" y2="${ay + 8}" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5"/>`;
  b += `<text x="${ax}" y="${ay + 17}" text-anchor="middle" font-family="Inter" font-size="6.2" font-weight="600" letter-spacing="0.9" fill="#fff" opacity="0.5">NOT IN THE BATCH</text>`;
  b += `<text x="${ax}" y="${ay + 26}" text-anchor="middle" font-family="Inter" font-size="6" font-weight="400" fill="#fff" opacity="0.6">old rows stay · no error, no log line</text>`;
  return svg(200, ay + 30, b, 800);
}

// ── 2. CONNECTOR WIPE ────────────────────────────────────────────
// Claim: DYNAMIC set in three places, and the connector still deleted the whole table.
// Many → dashed connector → outcome: three setting marks fan into the connector,
// which "causes" the partition strip to go hollow, every cell at once.
function drawConnectorWipe() {
  const MARKS = [['cluster conf', 35], ['writer option', 100], ['DataFrame writer', 165]];
  const markY = 6, markH = 30, markW = 58;
  const connY = 54, connH = 18, stripY = 98, stripH = 44;
  let b = '';

  // the three settings — mechanism, dim
  b += `<g fill="none" stroke="#fff" stroke-opacity="0.32" stroke-width="2">`;
  MARKS.forEach(([, cx]) => { b += `<rect x="${cx - markW / 2}" y="${markY}" width="${markW}" height="${markH}" rx="4"/>`; });
  b += `</g>`;
  MARKS.forEach(([where, cx]) => {
    b += `<text x="${cx}" y="${markY + 12}" text-anchor="middle" font-family="Inter" font-size="5.8" font-weight="500" fill="#fff" opacity="0.55">${where}</text>`;
    b += `<text x="${cx}" y="${markY + 24}" text-anchor="middle" font-family="Montserrat" font-size="8" font-weight="700" letter-spacing="0.5" fill="#fff" opacity="0.9">DYNAMIC</text>`;
  });

  // fan-in: dashed = flows to
  b += `<g fill="none" stroke="#fff" stroke-opacity="0.32" stroke-width="2" stroke-dasharray="4 5">`;
  MARKS.forEach(([, cx]) => { b += `<path d="M${cx},${markY + markH} C${cx},${connY - 6} 100,${markY + markH + 6} 100,${connY}"/>`; });
  b += `</g>`;

  // the connector — the mechanism that broke the contract
  b += `<rect x="52" y="${connY}" width="96" height="${connH}" rx="9" fill="none" stroke="#fff" stroke-opacity="0.4" stroke-width="2"/>`;
  b += `<text x="100" y="${connY + 11.5}" text-anchor="middle" font-family="Inter" font-size="6.2" font-weight="500" fill="#fff" opacity="0.7">spark-bigquery-connector</text>`;

  // causes →
  b += `<line x1="100" y1="${connY + connH}" x2="100" y2="${stripY - 4}" stroke="#fff" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="4 5"/>`;
  b += `<path d="M96.5,${stripY - 8} L100,${stripY - 4} L103.5,${stripY - 8}" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="2" stroke-linecap="round"/>`;
  b += `<text x="${X0}" y="${stripY - 7}" font-family="Inter" font-size="6.2" font-weight="600" letter-spacing="0.9" fill="#fff" opacity="0.42">TARGET TABLE</text>`;

  // the outcome — every partition hollow, the claim in orange
  b += `<g fill="none" stroke="${O}" stroke-width="3">`;
  DAYS.forEach((_, i) => { b += `<rect x="${cellX(i)}" y="${stripY}" width="${CELL_W}" height="${stripH}" rx="4"/>`; });
  b += `</g>`;

  b += annot(X0, stripY + stripH + 18, { label: 'DATABRICKS RUNTIME 15.4 LTS · SPARK 3.5.0', value: 'entire table', note: 'deleted during a backfill of one partition' });
  return svg(200, stripY + stripH + 56, b, 800);
}

// ── 3. FLAKY REPLACEWHERE ────────────────────────────────────────
// Claim: ten identical runs, three failed. Valence by height: ten structurally
// identical <g> glyphs; the three failures are the same group translated lower,
// tinted orange, with a round-dotted ghost where their commit should have landed.
function drawFlakyRuns() {
  const FAILED = new Set([1, 4, 8]);   // the issue doesn't say which three; spread for legibility
  const up = 24, drop = 44, colX = i => 15 + i * 18.9;
  const glyph = (color, op) => `
    <circle cx="0" cy="0" r="2.6" fill="${color}" fill-opacity="${op}"/>
    <line x1="0" y1="3" x2="0" y2="13" stroke="${color}" stroke-opacity="${op}" stroke-width="2"/>
    <rect x="-7" y="14" width="14" height="24" rx="2.5" fill="${color}" fill-opacity="${op * 0.3}" stroke="${color}" stroke-opacity="${op}" stroke-width="2"/>
    <g stroke="${color}" stroke-opacity="${op}" stroke-width="1.5" stroke-linecap="round">
      <line x1="-3.5" y1="21" x2="3.5" y2="21"/><line x1="-3.5" y1="26" x2="3.5" y2="26"/><line x1="-3.5" y1="31" x2="3.5" y2="31"/>
    </g>`;
  let b = '';
  b += `<text x="6" y="11" font-family="Inter" font-size="6.2" font-weight="600" letter-spacing="0.9" fill="#fff" opacity="0.42">TEN DAILY BACKFILLS · SAME CODE</text>`;

  for (let i = 0; i < 10; i++) {
    const x = colX(i);
    if (FAILED.has(i)) {
      // where the commit should have been: does not happen
      b += `<rect x="${(x - 7).toFixed(1)}" y="${up + 14}" width="14" height="24" rx="2.5" fill="none" stroke="#fff" stroke-opacity="0.4" stroke-width="1.5" stroke-dasharray="1 5" stroke-linecap="round"/>`;
      b += `<g transform="translate(${x.toFixed(1)},${up + drop})">${glyph(O, 1)}</g>`;
    } else {
      b += `<g transform="translate(${x.toFixed(1)},${up})">${glyph('#fff', 0.55)}</g>`;
    }
    b += `<text x="${x.toFixed(1)}" y="${up + drop + 50}" text-anchor="middle" font-family="Montserrat" font-size="6.6" font-weight="700" fill="#fff" opacity="${FAILED.has(i) ? 0.85 : 0.35}">${i + 1}</text>`;
  }
  b += `<line x1="6" y1="${up + drop + 58}" x2="194" y2="${up + drop + 58}" stroke="#fff" stroke-opacity="0.1" stroke-width="1"/>`;
  b += annot(6, up + drop + 74, { label: 'DELTA ISSUE #1147 · SPARK 3.2.1', value: '3 of 10', note: 'threw AnalysisException with no logic change between runs' });
  return svg(200, up + drop + 112, b, 820);
}

// ── 4. MERGE COST ────────────────────────────────────────────────
// Claim: Expedia's MERGE INTO backfill cost a third of INSERT OVERWRITE.
// Proportional nested rects: inner AREA / outer AREA = $0.66 / $2 (runtime ~1h / ~3h
// holds the same 1:3). Leader fan to the runtime stack on the right.
function drawMergeCost() {
  const ox = 8, oy = 24, side = 100;
  const inner = +(side * Math.sqrt(0.66 / 2)).toFixed(1);   // area-true, not width-true
  const iy = oy + side - inner;
  let b = '';

  b += `<text x="${ox}" y="${oy - 9}" font-family="Inter" font-size="6.2" font-weight="600" letter-spacing="0.9" fill="#fff" opacity="0.5">INSERT OVERWRITE</text>`;
  b += `<rect x="${ox}" y="${oy}" width="${side}" height="${side}" rx="3" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="2.5"/>`;
  b += `<text x="${ox + side - 8}" y="${oy + 20}" text-anchor="end" font-family="Montserrat" font-size="15" font-weight="800" fill="#fff" opacity="0.85">~$2</text>`;
  b += `<rect x="${ox}" y="${iy}" width="${inner}" height="${inner}" rx="3" fill="${O}"/>`;
  b += `<text x="${ox + inner / 2}" y="${iy + inner / 2 + 4.5}" text-anchor="middle" font-family="Montserrat" font-size="12.5" font-weight="800" fill="#fff">$0.66</text>`;
  b += `<text x="${ox}" y="${oy + side + 14}" font-family="Inter" font-size="6.2" font-weight="600" letter-spacing="0.9" fill="${OL}">MERGE INTO · MERGE-ON-READ</text>`;

  // leader fan → runtime stack
  const tx = 132;
  const STACK = [
    { y: 36,  from: [ox + side, oy + 10],        value: '~3 h / day', note: 'INSERT OVERWRITE', hero: false },
    { y: 78,  from: [ox + inner, iy + 6],        value: '~1 h / day', note: 'MERGE INTO', hero: true },
    { y: 116, from: [ox + side, oy + side - 4],  value: 'Expedia',    note: 'same daily backfill', hero: false },
  ];
  b += `<g stroke="#fff" stroke-opacity="0.3" stroke-width="1.5" fill="none">`;
  STACK.forEach(s => { b += `<path d="M${s.from[0] + 3},${s.from[1]} L${tx - 6},${s.y - 4}"/>`; });
  b += `</g>`;
  STACK.forEach(s => {
    b += `<text x="${tx}" y="${s.y}" font-family="Montserrat" font-size="10.5" font-weight="800" fill="${s.hero ? OL : '#fff'}" opacity="${s.hero ? 1 : 0.85}">${s.value}</text>`;
    b += `<text x="${tx}" y="${s.y + 9}" font-family="Inter" font-size="5.8" font-weight="500" fill="#fff" opacity="0.55">${s.note}</text>`;
  });
  return svg(200, oy + side + 22, b, 856);
}

// ── 5. CLOSER ────────────────────────────────────────────────────
// Bookend: the cover strip returns whole. Two check rails converge on one node,
// which feeds seven solid overwrite arrows. No ghost arrow, no stale cell.
function drawCheckedOverwrite() {
  const nodeY = 70, barY = 88, arrowBot = 102, cellY = 106, cellH = 42;
  let b = '';

  // the two checks from the article's pre-backfill list
  b += `<text x="${X0}" y="10" font-family="Inter" font-size="6.2" font-weight="600" letter-spacing="0.9" fill="#fff" opacity="0.5">BATCH COMPLETE</text>`;
  b += `<text x="${X0}" y="19" font-family="Inter" font-size="5.8" font-weight="400" fill="#fff" opacity="0.6">for every partition it touches</text>`;
  b += `<text x="192" y="10" text-anchor="end" font-family="Inter" font-size="6.2" font-weight="600" letter-spacing="0.9" fill="#fff" opacity="0.5">SPEC FROZEN</text>`;
  b += `<text x="192" y="19" text-anchor="end" font-family="Inter" font-size="5.8" font-weight="400" fill="#fff" opacity="0.6">for the whole backfill window</text>`;

  [cellCx(0), cellCx(6)].forEach(x => {
    b += `<circle cx="${x}" cy="32" r="6" fill="none" stroke="#fff" stroke-opacity="0.5" stroke-width="2"/>`;
    b += `<path d="M${x - 2.6},32.2 L${x - 0.6},34.4 L${x + 3},29.8" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  });
  // rails converge
  b += `<g fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="2.5" stroke-linecap="round">`;
  b += `<path d="M${cellCx(0)},38 C${cellCx(0)},62 60,${nodeY} 92,${nodeY}"/>`;
  b += `<path d="M${cellCx(6)},38 C${cellCx(6)},62 140,${nodeY} 108,${nodeY}"/>`;
  b += `</g>`;
  b += `<circle cx="100" cy="${nodeY}" r="11" fill="none" stroke="${O}" stroke-opacity="0.35" stroke-width="1.5"/>`;
  b += `<circle cx="100" cy="${nodeY}" r="6" fill="${O}"/>`;

  // distribution bar + seven solid overwrite arrows
  b += `<g stroke="#fff" stroke-opacity="0.45" stroke-width="2" stroke-linecap="round">`;
  b += `<line x1="100" y1="${nodeY + 11}" x2="100" y2="${barY}"/>`;
  b += `<line x1="${cellCx(0)}" y1="${barY}" x2="${cellCx(6)}" y2="${barY}"/>`;
  b += `</g>`;
  DAYS.forEach((_, i) => {
    const x = cellCx(i);
    b += `<line x1="${x}" y1="${barY}" x2="${x}" y2="${arrowBot}" stroke="#fff" stroke-opacity="0.7" stroke-width="3" stroke-linecap="round"/>`;
    b += `<path d="M${x - 4},${arrowBot - 5} L${x},${arrowBot} L${x + 4},${arrowBot - 5}" fill="none" stroke="#fff" stroke-opacity="0.7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  });

  // the strip, whole
  DAYS.forEach((d, i) => {
    const x = cellX(i);
    b += `<rect x="${x}" y="${cellY}" width="${CELL_W}" height="${cellH}" rx="4" fill="#fff" fill-opacity="0.08" stroke="#fff" stroke-opacity="0.45" stroke-width="2"/>`;
    b += `<g stroke="#fff" stroke-opacity="0.4" stroke-width="1.5" stroke-linecap="round">`;
    for (let r = 0; r < 4; r++) b += `<line x1="${x + 6}" y1="${cellY + 9 + r * 8}" x2="${x + CELL_W - 6}" y2="${cellY + 9 + r * 8}"/>`;
    b += `</g>`;
    b += `<text x="${cellCx(i)}" y="${cellY + cellH + 11}" text-anchor="middle" font-family="Inter" font-size="5.8" font-weight="600" fill="#fff" opacity="0.42">${d}</text>`;
  });
  return svg(200, cellY + cellH + 15, b, 800);
}

// ── slides ───────────────────────────────────────────────────────
const qr = BLOG_URL ? await makeQr(BLOG_URL, 150) : '';

const closerCta = BLOG_URL
  ? `<div style="display:flex;align-items:center;justify-content:space-between;gap:32px;margin-top:22px;">
        <div>
          ${ctaPill('Test MERGE on 4–10× faster Spark')}
          <div style="margin-top:16px;font-size:21px;color:${C.text2};font-weight:500;">sales@yeedu.io</div>
        </div>
        <div style="text-align:center;">
          ${qr}
          <div style="margin-top:8px;font-size:13px;color:${C.text3};letter-spacing:0.6px;">READ THE POST</div>
        </div>
      </div>`
  : `<div style="display:flex;align-items:center;justify-content:space-between;gap:32px;margin-top:26px;padding-top:26px;border-top:1px solid ${C.rule};">
        ${ctaPill('Test MERGE on 4–10× faster Spark')}
        <div style="text-align:right;white-space:nowrap;flex-shrink:0;">
          <div style="font-size:21px;color:${C.text};font-weight:600;">sales@yeedu.io</div>
          <div style="margin-top:6px;font-size:17px;color:${C.text3};">same PySpark and Scala, zero rewrites</div>
        </div>
      </div>`;

const slides = [
  {
    notes: 'Cover — claim: dynamic overwrite leaves partitions absent from the batch stale. Archetype 5 (ghost edge) on a partition strip: six solid overwrite arrows, one round-dotted ghost to the stale orange cell. Strip returns whole on slide 5',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Idempotent backfills')}
      ${headline('Missing partitions keep their old rows', 44)}
      ${well(drawStaleSurvivor(), { card: false })}
      <p style="margin:14px 0 0;font-size:22px;line-height:1.5;color:${C.text2};max-width:880px;">
        Spark's dynamic partition overwrite only replaces the days that appear in the batch. If the extract dropped a day, that day keeps last run's rows and the job <strong style="color:${C.orangeLight};font-weight:600;">still succeeds</strong>.
      </p>
    `, 'A'),
  },
  {
    notes: 'Connector ignored DYNAMIC — claim: set in three places, the connector still deleted the whole table (spark-bigquery-connector #1325, DBR 15.4, Spark 3.5.0). Archetype 1 (many → dashed connector → outcome): three setting marks fan into the connector, strip goes hollow',
    html: stage(`
      ${eyebrow('spark-bigquery-connector')}
      ${headline('Three dynamic settings, one wiped table', 44)}
      ${well(drawConnectorWipe())}
      ${caption(`Dynamic overwrite is a Spark-side contract, and the connector didn't keep it. Issue #1325 was closed with no fix landed.`)}
    `, 'B'),
  },
  {
    notes: 'replaceWhere flakiness — claim: identical code failed 3 of 10 daily backfills (delta-io #1147, Spark 3.2.1). Archetype 4 (valence by height): ten identical glyphs, three translated lower and orange with a ghost commit above',
    html: stage(`
      ${eyebrow('Delta replaceWhere')}
      ${headline('3 of 10 identical backfills failed', 50)}
      ${well(drawFlakyRuns())}
      ${caption(`A table partitioned on dt and processed_dt, the same batch shape every day. Three runs hit "Data written out does not match replaceWhere" and seven committed.`)}
    `, 'C'),
  },
  {
    notes: 'MERGE INTO was cheaper — claim: Expedia measured MERGE at $0.66 and ~1h/day vs INSERT OVERWRITE at ~$2 and ~3h/day. Archetype 6 (proportional nested rects, area 1:3) with leader fan to runtime stack',
    html: stage(`
      ${eyebrow('Cost per daily backfill')}
      ${headline('Merging cost a third as much', 54)}
      ${well(drawMergeCost())}
      ${caption(`Expedia ran the same daily backfill both ways on one Iceberg table. MERGE matches on the join key, so it also survives a partition spec change that INSERT OVERWRITE doesn't.`)}
    `, 'B'),
  },
  {
    notes: 'Closer — claim: overwrite only after two checks (batch complete, partition spec frozen), else MERGE. Archetype 8 (convergence bookend): cover strip returns whole, two check rails converge on one node, no ghost arrow. CTA pill + sales@yeedu.io; QR only when BLOG_URL is set',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Before the next backfill')}
      ${headline(`Two checks before any ${em('overwrite')}`, 52)}
      ${well(drawCheckedOverwrite(), { card: false })}
      ${caption(`If either check fails, we default to MERGE INTO. It's join-heavy Spark work, so a faster Spark engine makes the correct path cheaper to run.`)}
      ${closerCta}
    `, 'D'),
  },
];

const NAME = 'Idempotent Backfills — Partition Overwrite Risks';

if (OLD_ID) { console.log('Removing superseded deck…'); await deleteCarousel(OLD_ID); }
const id = await buildCarousel(NAME, slides);
await exportDeck(id, NAME);
