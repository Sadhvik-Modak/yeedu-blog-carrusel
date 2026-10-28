// ════════════════════════════════════════════════════════════════
// Top 10 Innovations in the Apache Spark Ecosystem
// Source: n8n-workflows-v2/output/strategy/2026-10-12-top-10-innovations-in-the-apache-spark-ecosystem
//
// 5 slides, 4:5. One bespoke drawing per slide, no shared renderer map.
// Chrome only comes from ./yeedu-chrome.mjs. Every topic version and config
// string is one the blog cites (Spark release notes, migration guides), never
// Yeedu's. The closer carries Yeedu capabilities from the article's Yeedu
// section with no numbers attached and no claim about which Spark versions
// Yeedu runs.
// ════════════════════════════════════════════════════════════════
import {
  C, stage, logoMark, eyebrow, headline, em, caption, well, svg,
  makeQr, ctaPill, buildCarousel, deleteCarousel, exportDeck,
} from './yeedu-chrome.mjs';

const BLOG_URL = null; // not published yet — set the live URL and re-run to add the QR
const OLD_ID = process.env.OLD_ID || '188fcd3b-27c4-4160-a6b0-0339a0dab511';

const O = C.orange, OL = C.orangeLight;

const lbl = (x, y, t, { anchor = 'start', fill = '#fff', op = 0.42, size = 6.2 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter" font-size="${size}" font-weight="600" letter-spacing="0.9" fill="${fill}" opacity="${op}">${t}</text>`;
const code = (x, y, t, { anchor = 'start', op = 0.8, size = 6, fill = '#fff', weight = 500 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter" font-size="${size}" font-weight="${weight}" fill="${fill}" opacity="${op}">${t}</text>`;

// ── 1. COVER ─────────────────────────────────────────────────────
// Claim: of the ten changes, seven shipped in Spark 4.0. A layer × release
// map: five layer bands, three release columns, one dot per innovation. The
// 4.0 column is the only orange thing and holds 7 of the 10 dots. The closer
// reuses the column vocabulary for jobs moving between releases.
const COLS = [
  { x: 0, w: 56, head: 'BEFORE 4.0' },
  { x: 60, w: 76, head: 'SPARK 4.0 · 7 OF 10' },
  { x: 140, w: 60, head: 'SPARK 4.1' },
];
const LAYERS = [
  ['DEVELOPER APIS', { 1: [['Spark Connect'], ['Python data sources'], ['SQL scripting, pipes']] }],
  ['SQL AND TYPES', { 1: [['ANSI mode default'], ['VARIANT type'], ['String collations']] }],
  ['STREAMING', { 1: [['transformWithState'], ], 2: [['SDP + Real-Time', 'Declarative Pipelines']] }],
  ['EXECUTION', { 0: [['AQE + native', 'Gluten, Comet, RAPIDS']] }],
  ['LAKEHOUSE', { 0: [['Delta, Iceberg', 'Unity Catalog OSS, K8s']] }],
];
function drawReleaseMap() {
  const top = 14, itemH = it => (it[1] ? 14 : 9);
  let b = '';
  // row geometry first so the 4.0 column tint can span it
  let y = top;
  const rows = LAYERS.map(([name, cells]) => {
    const h = 10 + Math.max(...Object.values(cells).map(items => items.reduce((s, it) => s + itemH(it), 0))) + 4;
    const r = { name, cells, y, h };
    y += h;
    return r;
  });
  const bottom = y;
  b += `<rect x="${COLS[1].x}" y="0" width="${COLS[1].w}" height="${bottom}" rx="3" fill="${O}" fill-opacity="0.13" stroke="${O}" stroke-opacity="0.55" stroke-width="2"/>`;
  COLS.forEach((c, i) => b += lbl(c.x + 3, 8, c.head, { size: 4.6, fill: i === 1 ? OL : '#fff', op: i === 1 ? 1 : 0.42 }));
  rows.forEach(r => {
    b += `<line x1="0" y1="${r.y}" x2="200" y2="${r.y}" stroke="#fff" stroke-opacity="0.12" stroke-width="1.5"/>`;
    b += lbl(3, r.y + 7, r.name, { size: 3.9, op: 0.34 });
    for (const [ci, items] of Object.entries(r.cells)) {
      const c = COLS[ci];
      let iy = r.y + 15;
      for (const [main, sub] of items) {
        b += `<circle cx="${c.x + 5}" cy="${iy - 1.8}" r="2.1" fill="#fff" fill-opacity="0.9"/>`;
        b += code(c.x + 10, iy, main, { size: 5.2, op: 0.92 });
        if (sub) b += code(c.x + 10, iy + 6, sub, { size: 4, op: 0.45, weight: 400 });
        iy += itemH([main, sub]);
      }
    }
  });
  return svg(200, bottom + 2, b, 880);
}

// ── 2. DEVELOPER APIS ────────────────────────────────────────────
// Claim: Python and SQL now reach the driver without a Scala jar, and
// Spark Connect clients sit outside the driver JVM. Three solid paths into
// the driver boundary, the old jar path as a round-dotted ghost edge.
function drawNoJarPath() {
  const SRC = [
    ['Notebook client', 'Spark Connect, gRPC :15002', 16, true],
    ['my_source.py', 'spark.dataSource.register()', 50, true],
    ['BEGIN … END', 'SQL UDFs, |> pipe syntax', 84, true],
    ['Scala jar', 'compile, publish, deploy', 118, false],
  ];
  const dx = 82, nx = 168, ny = 67, bx = 144;
  let b = '';
  // driver boundary: a container, so stroked
  b += `<rect x="${bx}" y="26" width="54" height="82" rx="4" fill="none" stroke="#fff" stroke-opacity="0.4" stroke-width="2"/>`;
  b += lbl(bx + 27, 21, 'DRIVER JVM', { anchor: 'middle', size: 4.8, op: 0.55 });
  SRC.forEach(([name, sub, y, real]) => {
    const d = `M${dx + 3},${y} C${dx + 34},${y} ${bx - 26},${ny} ${nx - 9},${ny}`;
    b += real
      ? `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="0.75" stroke-width="3"/>`
      : `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="0.5" stroke-width="3" stroke-dasharray="1 8" stroke-linecap="round"/>`;
    b += `<circle cx="${dx}" cy="${y}" r="2.6" fill="#fff" fill-opacity="${real ? 0.9 : 0.3}"/>`;
    b += code(4, y - 1, name, { size: 7.2, op: real ? 0.92 : 0.38 });
    b += code(4, y + 7, sub, { size: 4.8, op: real ? 0.5 : 0.3, weight: 400 });
  });
  b += `<circle cx="${nx}" cy="${ny}" r="8" fill="${O}"/>`;
  b += lbl(nx, ny + 18, 'SPARK 4.0', { anchor: 'middle', size: 4.8, fill: OL, op: 1 });
  b += lbl(4, 134, 'DOTTED: THE PATH YOU NO LONGER NEED', { size: 4.4, op: 0.38 });
  return svg(200, 138, b, 860);
}

// ── 3. SQL, TYPES AND UPGRADE DEFAULTS ───────────────────────────
// Claim: moving a job from 3.x to 4.0 changes six things at once, and the
// ANSI row is the one that surfaces first. Comparison matrix, hero row
// triple-encoded; Mesos's 4.0 cell is the faint empty-cell glyph.
function drawUpgradeMatrix() {
  const ROWS = [
    ['CAST(\'a\' AS INT)', 'NULL, job finishes green', 'Throws CAST_INVALID_INPUT', true],
    ['Messy JSON column', 'STRING + from_json', 'VARIANT type', false],
    ['Case-insensitive join', 'UPPER() on both sides', 'UTF8_LCASE collation', false],
    ['Java', 'JDK 8 or 11', 'JDK 17, 21 supported', false],
    ['Scala', '2.12', '2.13', false],
    ['Mesos cluster manager', 'Supported', null, false],
  ];
  const th = `padding:0 0 16px;text-align:left;font-size:15px;font-weight:600;letter-spacing:1.4px;text-transform:uppercase;color:${C.text3};border-bottom:1px solid rgba(255,255,255,0.15);`;
  const td = `padding:19px 14px 19px 0;font-size:21px;line-height:1.3;border-bottom:1px solid rgba(255,255,255,0.06);vertical-align:top;`;
  const rows = ROWS.map(([k, a, bb, hero]) => {
    const bg = hero ? `background:rgba(242,96,12,0.14);` : '';
    const nul = `<span style="color:rgba(255,255,255,0.25);">—</span>`;
    return `<tr style="${bg}">
      <td style="${td}padding-left:${hero ? 14 : 0}px;color:${hero ? '#fff' : C.text2};font-weight:${hero ? 700 : 500};font-family:${hero ? "'Montserrat',sans-serif" : "'Inter',sans-serif"};">${k}</td>
      <td style="${td}color:${C.text3};">${a}</td>
      <td style="${td}color:${hero ? C.orangeLight : '#fff'};font-weight:${hero ? 700 : 500};">${bb ?? nul}</td>
    </tr>`;
  }).join('');
  return `<table style="width:100%;border-collapse:collapse;font-family:'Inter',sans-serif;">
    <thead><tr><th style="${th}width:34%;"></th><th style="${th}width:31%;">Spark 3.x</th><th style="${th}">Spark 4.0</th></tr></thead>
    <tbody>${rows}</tbody></table>`;
}

// ── 4. STREAMING, EXECUTION, LAKEHOUSE ───────────────────────────
// Claim: the physical plan AQE builds can now run on three native engines
// as well as the JVM. Stack diagram: streaming on top, one orange plan node
// fanning to four engine boxes (JVM dim), tables and Kubernetes underneath.
function drawOnePlanFourEngines() {
  let b = '';
  // streaming band
  b += lbl(0, 5, 'STREAMING', { size: 4.2, op: 0.38 });
  b += `<rect x="0" y="8" width="200" height="27" rx="3" fill="none" stroke="#fff" stroke-opacity="0.3" stroke-width="2"/>`;
  b += code(6, 19, 'Declarative Pipelines + Real-Time Mode', { size: 5.6, op: 0.88 });
  b += code(194, 19, 'SPARK 4.1', { anchor: 'end', size: 4.4, op: 0.45, weight: 600 });
  b += code(6, 29, 'transformWithState + state data source', { size: 5.6, op: 0.88 });
  b += code(194, 29, 'SPARK 4.0', { anchor: 'end', size: 4.4, op: 0.45, weight: 600 });
  // plan node
  const px = 100, py = 54;
  b += `<path d="M${px},35 L${px},${py - 8}" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="4 5"/>`;
  b += `<circle cx="${px}" cy="${py}" r="7" fill="${O}"/>`;
  b += lbl(px + 12, py + 2, 'AQE PHYSICAL PLAN', { size: 4.8, fill: OL, op: 1 });
  b += lbl(px - 12, py + 2, 'ON SINCE 3.2', { anchor: 'end', size: 4.4, op: 0.4 });
  // four engines
  const ENG = [
    ['JVM', 'default', false],
    ['Gluten', 'Velox backend', true],
    ['Comet', 'DataFusion, Rust', true],
    ['RAPIDS', 'NVIDIA GPU', true],
  ];
  const ew = 46, gap = 5.33, ey = 82, eh = 26;
  ENG.forEach(([n, sub, native], i) => {
    const x = i * (ew + gap), cx = x + ew / 2;
    b += native
      ? `<path d="M${px},${py + 7} C${px},${py + 18} ${cx},${ey - 14} ${cx},${ey}" fill="none" stroke="#fff" stroke-opacity="0.85" stroke-width="3"/>`
      : `<path d="M${px},${py + 7} C${px},${py + 18} ${cx},${ey - 14} ${cx},${ey}" fill="none" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5"/>`;
    b += `<rect x="${x.toFixed(2)}" y="${ey}" width="${ew}" height="${eh}" rx="3" fill="${native ? '#fff' : 'none'}" fill-opacity="${native ? 0.1 : 0}" stroke="#fff" stroke-opacity="${native ? 0.7 : 0.3}" stroke-width="2"/>`;
    b += code(cx, ey + 12, n, { anchor: 'middle', size: 6.8, op: native ? 0.95 : 0.45, weight: 700 });
    b += code(cx, ey + 20, sub, { anchor: 'middle', size: 4.4, op: native ? 0.55 : 0.35, weight: 400 });
  });
  b += `<path d="M${ew + gap},${ey + eh + 4} L${ew + gap},${ey + eh + 7} L200,${ey + eh + 7} L200,${ey + eh + 4}" fill="none" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5"/>`;
  b += lbl(200, ey + eh + 14, 'NATIVE, OFF THE JVM', { anchor: 'end', size: 4.2, op: 0.42 });
  // tables + runtime
  b += lbl(0, 129, 'TABLES AND CATALOG', { size: 4.2, op: 0.38 });
  b += `<rect x="0" y="132" width="200" height="15" rx="3" fill="none" stroke="#fff" stroke-opacity="0.3" stroke-width="2"/>`;
  b += code(100, 142, 'Delta Lake 4.4.1 · Apache Iceberg 1.12.0 · Unity Catalog OSS', { anchor: 'middle', size: 5.2, op: 0.85 });
  b += `<rect x="0" y="151" width="200" height="15" rx="3" fill="#fff" fill-opacity="0.07" stroke="none"/>`;
  b += code(100, 161, 'Kubernetes, GA since Spark 3.1.1', { anchor: 'middle', size: 5.2, op: 0.7 });
  return svg(200, 167, b, 860);
}

// ── 5. CLOSER ────────────────────────────────────────────────────
// Bookend: the cover's release columns return, holding jobs instead of
// features. Four waves; each dot is a job, orange once it runs on the newer
// release (0, 3, 7, 12). No Spark version named: the deck makes no claim
// about which versions Yeedu runs.
function drawStagedUpgrade() {
  const MOVED = [0, 3, 7, 12], N = 12, x0 = 40, cw = 37, gap = 3.3;
  const dot = (cx, cy, on) => on
    ? `<circle cx="${cx.toFixed(2)}" cy="${cy}" r="1.8" fill="${O}"/>`
    : `<circle cx="${cx.toFixed(2)}" cy="${cy}" r="1.6" fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="1.5"/>`;
  let b = '';
  b += lbl(0, 23, 'CURRENT', { size: 4.4, op: 0.5 });
  b += lbl(0, 29, 'RELEASE', { size: 4.4, op: 0.5 });
  b += lbl(0, 51, 'NEWER', { size: 4.4, fill: OL, op: 1 });
  b += lbl(0, 57, 'RELEASE', { size: 4.4, fill: OL, op: 1 });
  b += `<line x1="0" y1="37" x2="200" y2="37" stroke="#fff" stroke-opacity="0.12" stroke-width="1.5"/>`;
  MOVED.forEach((m, w) => {
    const x = x0 + w * (cw + gap);
    b += lbl(x + 2, 8, `WAVE ${w + 1}`, { size: 4.2, op: 0.42 });
    b += `<rect x="${x.toFixed(2)}" y="12" width="${cw}" height="52" rx="3" fill="none" stroke="#fff" stroke-opacity="0.18" stroke-width="2"/>`;
    const place = (k, yTop, on) => dot(x + 5.5 + (k % 6) * 5.2, yTop + Math.floor(k / 6) * 6, on);
    for (let k = 0; k < N - m; k++) b += place(k, 21, false);
    for (let k = 0; k < m; k++) b += place(k, 48, true);
    if (w < 3) b += `<path d="M${(x + cw + 0.3).toFixed(2)},38 L${(x + cw + gap - 0.3).toFixed(2)},38" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="4 5"/>`;
  });
  b += lbl(x0, 74, 'EACH DOT IS ONE JOB', { size: 4.2, op: 0.38 });
  return svg(200, 76, b, 860);
}

// ── slides ───────────────────────────────────────────────────────
const qr = BLOG_URL ? await makeQr(BLOG_URL, 150) : '';
const CTA = 'Plan a staged Spark upgrade with Yeedu';
const cta = BLOG_URL
  ? `<div style="display:flex;align-items:center;justify-content:space-between;gap:32px;margin-top:22px;">
       <div>
         ${ctaPill(CTA)}
         <div style="margin-top:16px;font-size:21px;color:${C.text2};font-weight:500;">sales@yeedu.com</div>
       </div>
       <div style="text-align:center;">
         ${qr}
         <div style="margin-top:8px;font-size:13px;color:${C.text3};letter-spacing:0.6px;">READ THE POST</div>
       </div>
     </div>`
  : `<div style="display:flex;align-items:center;justify-content:space-between;gap:28px;margin-top:28px;padding-top:26px;border-top:1px solid ${C.rule};">
       ${ctaPill(CTA)}
       <div style="font-size:22px;color:${C.text2};font-weight:500;">sales@yeedu.com</div>
     </div>`;

const slides = [
  {
    notes: 'Cover — claim: seven of the ten Spark ecosystem changes shipped in Spark 4.0. Layer × release map, one dot per innovation, 4.0 column the only orange thing (column vocabulary returns on the closer)',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Apache Spark 4.0 and 4.1')}
      ${headline(`Ten Spark changes, ${em('seven')} in 4.0`, 52)}
      ${well(drawReleaseMap(), { card: false })}
      ${caption(`They touch every layer, from the client API down to the catalog. Spark 4.0 was the first major release since 3.0, and 4.1 followed with Declarative Pipelines and Real-Time Mode.`)}
    `, 'A'),
  },
  {
    notes: 'Developer APIs — claim: Spark Connect, Python data sources/UDTFs and SQL scripting reach the driver without a Scala jar; Connect clients live outside the driver JVM. Git-graph style paths with a round-dotted ghost edge for the jar route',
    html: stage(`
      ${eyebrow('Developer APIs')}
      ${headline('Python and SQL skip the Scala jar', 52)}
      ${well(drawNoJarPath())}
      ${caption(`Spark Connect sends unresolved plans over gRPC, so a crashing notebook can't take down a driver other sessions share. UDTFs, Python data sources and SQL scripts ship in the job's own pull request.`)}
    `, 'B'),
  },
  {
    notes: 'SQL, types and upgrade defaults — claim: moving a job from 3.x to 4.0 changes six behaviours, ANSI throw-instead-of-NULL first. Comparison matrix with hero row; Mesos 4.0 cell is the faint empty glyph (Spark SQL + core migration guides)',
    html: stage(`
      ${eyebrow('SQL, types and the 4.0 upgrade')}
      ${headline('What changes when a job moves to 4.0', 46)}
      ${well(drawUpgradeMatrix(), { pad: 34 })}
      ${caption(`spark.sql.ansi.enabled is on by default, so a bad cast fails in CI before anyone trusts the number. TRY_CAST and try_divide() fix one expression without turning ANSI off.`)}
    `, 'C'),
  },
  {
    notes: 'Streaming, execution, lakehouse — claim: the physical plan AQE builds now runs on Gluten/Velox, Comet or RAPIDS as well as the JVM, between 4.0/4.1 streaming above and Delta/Iceberg/UC OSS on Kubernetes below. Stack diagram, orange plan node fanning to four engines',
    html: stage(`
      ${eyebrow('Streaming, execution, lakehouse')}
      ${headline('One AQE plan, four engines to run it', 48)}
      ${well(drawOnePlanFourEngines(), { card: false })}
      ${caption(`Each native engine publishes its own benchmarks on its own hardware, and they don't compare to each other. Test them on your own CPU-bound stages.`)}
    `, 'D'),
  },
  {
    notes: 'Closer — claim: Yeedu runs multiple Spark versions, so jobs move to a newer release a few at a time; Turbo is a native C++ vectorized engine in the Gluten/Comet family; BYOCatalog reads UC, Hive Metastore, Glue with Delta and Iceberg; fixed licence. Bookend: cover release columns now hold jobs. CTA pill + sales@yeedu.com (QR when BLOG_URL is set)',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Yeedu')}
      ${headline('Upgrade Spark a few jobs at a time', 50)}
      ${well(drawStagedUpgrade(), { card: false })}
      ${caption(`Yeedu runs multiple Spark versions side by side. Turbo, its native C++ vectorized engine, sits in the same family as Gluten and Comet. BYOCatalog reads Unity Catalog, Hive Metastore and Glue, with Delta and Iceberg, on one fixed licence.`)}
      ${cta}
    `, 'C'),
  },
];

const NAME = 'Top 10 Innovations in the Apache Spark Ecosystem';

if (OLD_ID) await deleteCarousel(OLD_ID);
const id = await buildCarousel(NAME, slides);
if (!process.env.SKIP_EXPORT) await exportDeck(id, NAME);
