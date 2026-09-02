// ════════════════════════════════════════════════════════════════
// Dumping Observability Data Into Iceberg Lakehouses
// Source: https://yeedu.com/blog/dumping-observability-data-into-iceberg-lakehouses
//
// 5 slides, 4:5. One bespoke drawing per slide — no shared renderer
// map, and no drawing shared with the CDC deck.
// ════════════════════════════════════════════════════════════════
import {
  C, stage, logoMark, eyebrow, headline, em, caption, well, svg, annot,
  makeQr, ctaPill, buildCarousel, deleteCarousel, exportDeck,
} from './yeedu-chrome.mjs';

const BLOG_URL = 'https://yeedu.com/blog/dumping-observability-data-into-iceberg-lakehouses';
const OLD_ID = null;   // set to the previous deck's id to replace it

const O = C.orange, OL = C.orangeLight;

// ── 1. COVER ─────────────────────────────────────────────────────
// Claim: $500K becomes $70K. Drawn as area — the inner rect is 1/7.15 of the
// outer, which is exactly the cost ratio. Vocabulary inverted on the closer.
function drawCostRatio() {
  let b = '';
  // outer = the SaaS bill (container: stroked)
  b += `<rect x="14" y="14" width="110" height="104" rx="5" fill="none" stroke="#fff" stroke-opacity="0.42" stroke-width="2.5"/>`;
  b += `<text x="14" y="8" font-family="Inter" font-size="6.2" font-weight="600" letter-spacing="0.9" fill="#fff" opacity="0.42">DATADOG INGEST @ $0.10/GB</text>`;
  b += `<text x="90" y="44" text-anchor="middle" font-family="Montserrat" font-size="17" font-weight="800" letter-spacing="-0.5" fill="#fff">$500,000</text>`;
  b += `<text x="90" y="54" text-anchor="middle" font-family="Inter" font-size="6.2" fill="#fff" opacity="0.55">per year</text>`;
  // inner = self-hosted, at 1/7.15 the area (content: filled)
  b += `<rect x="20" y="73" width="41" height="39" rx="3" fill="${O}"/>`;
  b += `<line x1="61" y1="80" x2="76" y2="80" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5"/>`;
  b += `<text x="80" y="79" font-family="Montserrat" font-size="10" font-weight="800" fill="${OL}">$70,000</text>`;
  b += `<text x="80" y="88" font-family="Inter" font-size="6" fill="#fff" opacity="0.55">S3 + Iceberg</text>`;
  // leader fan to the context stack
  const fan = [[40, 30, '700 GB / day'], [66, 66, '250 TB / year'], [92, 100, '85% cheaper']];
  fan.forEach(([y1, y2, t]) => {
    b += `<line x1="124" y1="${y1}" x2="136" y2="${y2}" stroke="#fff" stroke-opacity="0.28" stroke-width="1.5"/>`;
    b += `<text x="140" y="${y2 + 2.4}" font-family="Inter" font-size="7" font-weight="500" fill="#fff" opacity="0.7">${t}</text>`;
  });
  b += annot(14, 136, { label: 'SAME VOLUME, SELF-HOSTED', value: '85% less', note: 'S3 at $0.023/GB-month, documented case study' });
  return svg(200, 178, b);
}

// ── 2. COMPACTION COST ───────────────────────────────────────────
// Claim: the storage saving hides a compaction bill 20–29× larger under management.
// Two lines from the same workload; the one orange thing is the GAP between them.
function drawCompactionGap() {
  const y = v => 120 - (Math.log10(v) + 1) * 32.14;
  const x0 = 40, x1 = 176;
  const mg0 = y(5.04), mg1 = y(47.69), sm0 = y(0.17), sm1 = y(2.29);
  let b = '';
  b += `<line x1="26" y1="128" x2="190" y2="128" stroke="#fff" stroke-opacity="0.14" stroke-width="1.5"/>`;
  b += `<line x1="26" y1="128" x2="26" y2="26" stroke="#fff" stroke-opacity="0.14" stroke-width="1.5"/>`;
  b += `<path d="M${x0},${mg0.toFixed(1)} L${x1},${mg1.toFixed(1)} L${x1},${sm1.toFixed(1)} L${x0},${sm0.toFixed(1)} Z" fill="${O}" fill-opacity="0.15"/>`;
  b += `<line x1="${x0}" y1="${mg0.toFixed(1)}" x2="${x1}" y2="${mg1.toFixed(1)}" stroke="#fff" stroke-opacity="0.5" stroke-width="3"/>`;
  b += `<line x1="${x0}" y1="${sm0.toFixed(1)}" x2="${x1}" y2="${sm1.toFixed(1)}" stroke="#fff" stroke-opacity="0.5" stroke-width="3"/>`;
  [[x0, mg0], [x1, mg1], [x0, sm0], [x1, sm1]].forEach(([px, py]) => {
    b += `<circle cx="${px}" cy="${py.toFixed(1)}" r="2.6" fill="#fff" fill-opacity="0.75"/>`;
  });
  b += `<text x="34" y="${(mg0 + 2).toFixed(1)}" text-anchor="end" font-family="Montserrat" font-size="8.5" font-weight="700" fill="#fff">$5.04</text>`;
  b += `<text x="34" y="${(sm0 + 2).toFixed(1)}" text-anchor="end" font-family="Montserrat" font-size="8.5" font-weight="700" fill="#fff">$0.17</text>`;
  b += `<text x="${x1}" y="${(mg1 - 7).toFixed(1)}" text-anchor="end" font-family="Montserrat" font-size="10" font-weight="800" fill="#fff">$47.69</text>`;
  b += `<text x="${x1}" y="${(sm1 + 12).toFixed(1)}" text-anchor="end" font-family="Montserrat" font-size="10" font-weight="800" fill="#fff">$2.29</text>`;
  b += `<text x="${x1}" y="${(mg1 - 15).toFixed(1)}" text-anchor="end" font-family="Inter" font-size="6" font-weight="600" letter-spacing="0.7" fill="#fff" opacity="0.5">S3 TABLES — MANAGED</text>`;
  // +28, not +20 — the label is wide enough that the rising line clipped its left end
  b += `<text x="${x1}" y="${(sm1 + 28).toFixed(1)}" text-anchor="end" font-family="Inter" font-size="6" font-weight="600" letter-spacing="0.7" fill="#fff" opacity="0.5">EMR — SELF-MANAGED</text>`;
  // the multiple, annotated at both ends of the gap
  b += `<text x="${x0 + 6}" y="${((mg0 + sm0) / 2 + 3).toFixed(1)}" font-family="Montserrat" font-size="12" font-weight="800" fill="${OL}">29×</text>`;
  b += `<text x="${x1 - 6}" y="${((mg1 + sm1) / 2 + 3).toFixed(1)}" text-anchor="end" font-family="Montserrat" font-size="12" font-weight="800" fill="${OL}">20.8×</text>`;
  [[x0, '100 GB'], [x1, '953.7 GB']].forEach(([px, t]) => {
    b += `<line x1="${px}" y1="128" x2="${px}" y2="132" stroke="#fff" stroke-opacity="0.25" stroke-width="1.5"/>`;
    b += `<text x="${px}" y="141" text-anchor="middle" font-family="Inter" font-size="6.4" font-weight="600" fill="#fff" opacity="0.5">${t}</text>`;
  });
  // two short lines — one long line ran under the "S3 TABLES — MANAGED" label
  b += `<text x="26" y="14" font-family="Inter" font-size="6" font-weight="600" letter-spacing="0.9" fill="#fff" opacity="0.4">COST TO COMPACT</text>`;
  b += `<text x="26" y="22" font-family="Inter" font-size="6" font-weight="600" letter-spacing="0.9" fill="#fff" opacity="0.28">LOG SCALE</text>`;
  b += annot(14, 152, { label: 'THE BILL ICEBERG STORAGE PRICING HIDES', value: '20–29×', note: 'managed compaction vs self-managed, identical workload' });
  return svg(200, 192, b);
}

// ── 3. LATENCY TRADE-OFF ─────────────────────────────────────────
// Claim: you buy the 85% with query latency. Two bands on one shared log axis.
function drawLatencyBands() {
  const x = t => 26 + (Math.log10(t) + 2) * 41;
  let b = '';
  b += `<line x1="26" y1="104" x2="190" y2="104" stroke="#fff" stroke-opacity="0.16" stroke-width="1.5"/>`;
  [[0.01, '10 ms'], [0.1, '100 ms'], [1, '1 s'], [10, '10 s'], [100, '100 s']].forEach(([t, l]) => {
    b += `<line x1="${x(t).toFixed(1)}" y1="104" x2="${x(t).toFixed(1)}" y2="108" stroke="#fff" stroke-opacity="0.22" stroke-width="1.5"/>`;
    b += `<text x="${x(t).toFixed(1)}" y="117" text-anchor="middle" font-family="Inter" font-size="6.2" font-weight="500" fill="#fff" opacity="0.45">${l}</text>`;
  });
  const s0 = x(0.05), s1 = x(0.9);
  b += `<rect x="${s0.toFixed(1)}" y="42" width="${(s1 - s0).toFixed(1)}" height="19" rx="9.5" fill="#fff" fill-opacity="0.26"/>`;
  b += `<text x="${s0.toFixed(1)}" y="37" font-family="Inter" font-size="6.4" font-weight="600" letter-spacing="0.8" fill="#fff" opacity="0.5">SAAS OBSERVABILITY</text>`;
  b += `<text x="${((s0 + s1) / 2).toFixed(1)}" y="55.5" text-anchor="middle" font-family="Montserrat" font-size="9" font-weight="700" fill="#fff">sub-second</text>`;
  const i0 = x(2), i1 = x(40);
  b += `<rect x="${i0.toFixed(1)}" y="72" width="${(i1 - i0).toFixed(1)}" height="19" rx="9.5" fill="${O}"/>`;
  b += `<text x="${i0.toFixed(1)}" y="67" font-family="Inter" font-size="6.4" font-weight="600" letter-spacing="0.8" fill="${OL}">ICEBERG DIRECT</text>`;
  b += `<text x="${((i0 + i1) / 2).toFixed(1)}" y="85.5" text-anchor="middle" font-family="Montserrat" font-size="9" font-weight="700" fill="#fff">2 – 40 s</text>`;
  b += annot(26, 132, { label: 'WHAT THE ON-CALL ENGINEER FEELS AT 3 AM', value: 'seconds', note: 'to tens of seconds — against sub-second on SaaS' });
  return svg(200, 172, b);
}

// ── 4. SMALL-FILE ARRIVAL RATE ───────────────────────────────────
// Claim: 1 GB/min across 100 partitions is ~100 files a minute, forever.
// The grid literally has 100 cells — the count of marks is the data.
function drawFileArrival() {
  let b = '';
  b += `<text x="14" y="10" font-family="Inter" font-size="6.2" font-weight="600" letter-spacing="0.9" fill="#fff" opacity="0.42">FILES LANDED IN ONE MINUTE</text>`;
  b += `<g fill="none" stroke="#fff" stroke-opacity="0.32" stroke-width="0.8">`;
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) {
    b += `<rect x="${14 + c * 8}" y="${16 + r * 8}" width="5.5" height="5.5" rx="1"/>`;
  }
  b += `</g>`;
  b += `<text x="14" y="106" font-family="Inter" font-size="6.6" font-weight="500" fill="#fff" opacity="0.6">~100 files · 7–15 MB each</text>`;
  b += `<text x="14" y="115" font-family="Inter" font-size="6.6" font-weight="500" fill="#fff" opacity="0.6">1 GB/min across 100 partitions</text>`;
  b += `<line x1="98" y1="55" x2="126" y2="55" stroke="#fff" stroke-opacity="0.32" stroke-width="2" stroke-dasharray="4 5"/>`;
  b += `<path d="M123,51.5 L127,55 L123,58.5" fill="none" stroke="#fff" stroke-opacity="0.32" stroke-width="2" stroke-linecap="round"/>`;
  b += `<circle cx="158" cy="55" r="24" fill="none" stroke="${O}" stroke-width="2.5"/>`;
  // 15px overran the ring — the glyphs are wider than the chord at that height
  b += `<text x="158" y="53" text-anchor="middle" font-family="Montserrat" font-size="12.5" font-weight="800" letter-spacing="-0.5" fill="${OL}">100K+</text>`;
  b += `<text x="158" y="64" text-anchor="middle" font-family="Inter" font-size="5.8" font-weight="500" fill="#fff" opacity="0.6">small files</text>`;
  b += annot(14, 130, { label: 'AND THEY NEVER STOP ARRIVING', value: 'every minute', note: 'skip compaction and every query pays for it' });
  return svg(200, 170, b);
}

// ── 5. CLOSER ────────────────────────────────────────────────────
// Bookend: slide 1's nested rects, inverted. There the inner box was 1/7.15 —
// here it is 1/169, and the retention bar grows while the cost box shrinks.
function drawCompressionBookend() {
  let b = '';
  b += `<text x="14" y="8" font-family="Inter" font-size="6.2" font-weight="600" letter-spacing="0.9" fill="#fff" opacity="0.42">5.38 PB RAW · $1.8M / YR</text>`;
  b += `<rect x="14" y="14" width="104" height="78" rx="4" fill="none" stroke="#fff" stroke-opacity="0.4" stroke-width="2.5"/>`;
  b += `<rect x="20" y="80" width="8" height="6" rx="1" fill="${O}"/>`;
  b += `<line x1="28" y1="82" x2="52" y2="66" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5"/>`;
  b += `<text x="56" y="64" font-family="Montserrat" font-size="10" font-weight="800" fill="${OL}">31.4 TB</text>`;
  b += `<text x="56" y="73" font-family="Inter" font-size="6.2" fill="#fff" opacity="0.6">$10,000 / yr</text>`;
  b += `<text x="132" y="26" font-family="Inter" font-size="6.2" font-weight="600" letter-spacing="0.9" fill="#fff" opacity="0.42">RETENTION</text>`;
  b += `<rect x="132" y="34" width="6" height="9" rx="2" fill="#fff" fill-opacity="0.3"/>`;
  b += `<text x="144" y="41" font-family="Inter" font-size="6.4" font-weight="600" fill="#fff" opacity="0.55">3 days</text>`;
  b += `<rect x="132" y="54" width="60" height="9" rx="2" fill="${O}"/>`;
  b += `<text x="132" y="76" font-family="Montserrat" font-size="9" font-weight="700" fill="${OL}">30 days</text>`;
  b += annot(14, 106, { label: 'UBER CLP ON SPARK LOGS', value: '169×', note: 'purpose-built compression — a general format cannot' });
  return svg(200, 150, b, 780);
}

// ── slides ───────────────────────────────────────────────────────
const qr = await makeQr(BLOG_URL, 150);

const slides = [
  {
    notes: 'Cover — proportional nested rects, inner area = 1/7.15 of outer = the $500K→$70K ratio, with leader fan',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Observability on Iceberg')}
      ${headline(`The storage math is ${em('obvious.')}`, 52)}
      ${well(drawCostRatio(), { card: false })}
      <p style="margin:14px 0 0;font-size:22px;line-height:1.5;color:${C.text2};max-width:880px;">
        700 GB of logs a day on Datadog is half a million dollars a year. The same 250 TB on S3 is seventy thousand. Then you read the rest of the bill.
      </p>
    `, 'A'),
  },
  {
    notes: 'Compaction gap — two cost lines on a log axis with the widening gap shaded orange; 29× at 100GB, 20.8× at 953.7GB',
    html: stage(`
      ${eyebrow('The bill under the bill')}
      ${headline('Storage is cheap. Compaction is not.', 50)}
      ${well(drawCompactionGap())}
      ${caption(`Iceberg is batch-shaped and observability is a continuous write. Somebody has to pay to tidy up afterwards — and managed compaction charges like it.`)}
    `, 'C'),
  },
  {
    notes: 'Latency trade-off — SaaS and Iceberg bands positioned on one shared log time axis',
    html: stage(`
      ${eyebrow('What 85% actually costs')}
      ${headline('You are trading dollars for seconds.', 48)}
      ${well(drawLatencyBands())}
      ${caption(`Parquet row groups decompress whole pages to return one record — the opposite of what incident debugging asks for. Tuning metadata took one team from tens of seconds to ~1 second. It never got to sub-second.`)}
    `, 'B'),
  },
  {
    notes: 'Small-file arrival — a literal 10×10 grid (100 files/minute) causing a 100K+ outcome token',
    html: stage(`
      ${eyebrow('The small-files death spiral')}
      ${headline('A hundred files. Every minute.', 50)}
      ${well(drawFileArrival())}
      ${caption(`Millions of tiny writers, one commit per partition. Metadata grows to millions of entries and query planning slows down before the scan even starts.`)}
    `, 'B'),
  },
  {
    notes: 'Closer — bookend of slide 1: nested rects again, now at 1/169, retention growing as cost shrinks; CTA + QR',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Do it deliberately')}
      ${headline(`Purpose-built beats ${em('general-purpose.')}`, 48)}
      ${well(drawCompressionBookend(), { card: false })}
      <div style="display:flex;align-items:center;justify-content:space-between;gap:32px;margin-top:12px;">
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

const NAME = 'Dumping Observability Data Into Iceberg Lakehouses';

if (OLD_ID) { console.log('Removing superseded deck…'); await deleteCarousel(OLD_ID); }
const id = await buildCarousel(NAME, slides);
await exportDeck(id);
