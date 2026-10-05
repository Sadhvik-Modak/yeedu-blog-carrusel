// ════════════════════════════════════════════════════════════════
// Row-Level Security On Iceberg — The Second Engine Problem
// Source: n8n technical-deep-dive 2026-08-25, "Row-Level Security Breaks the
// Moment a Second Engine Reads Your Iceberg Table" (not yet published).
// Facts are the article's cited sources (Databricks, Apache Polaris,
// Snowflake, Apache Iceberg docs). None of them are Yeedu's.
//
// 5 slides, 4:5. One bespoke drawing per slide, no shared renderer map.
// Chrome only comes from ./yeedu-chrome.mjs.
// ════════════════════════════════════════════════════════════════
import {
  C, stage, logoMark, eyebrow, headline, em, caption, well, svg, annot,
  makeQr, ctaPill, buildCarousel, deleteCarousel, exportDeck,
} from './yeedu-chrome.mjs';

const BLOG_URL = null; // not published yet — set the live URL and re-run to add the QR
const OLD_ID = '2bfc62e7-a4b3-40ce-b684-62b2c30d4a4b';

const O = C.orange, OL = C.orangeLight;

const LABEL = `font-family="Inter" font-weight="600" letter-spacing="0.8" fill="#fff" opacity="0.42"`;
const NOTE = `font-family="Inter" font-weight="400" fill="#fff" opacity="0.6"`;

/** Three Parquet slabs. The cover opens on it and the closer ends on it. */
function filesGlyph(cx, y) {
  let b = `<g fill="#fff" fill-opacity="0.12" stroke="#fff" stroke-opacity="0.4" stroke-width="2">`;
  for (let i = 0; i < 3; i++) b += `<rect x="${cx - 20}" y="${y + i * 10}" width="40" height="7" rx="2"/>`;
  return b + `</g>`;
}

// ── 1. COVER ─────────────────────────────────────────────────────
// Claim: the same files, read two ways; the second engine never meets the filter.
// Split paths off one file stack. Path A passes through a solid filter node and
// ends in a short row stack; path B swerves around a round-dotted (absent)
// filter node and ends in a full orange stack. Row counts are illustrative.
// The closer merges these two paths through one plan node.
function drawSplitRead() {
  const AX = 50, BX = 150, NY = 66, NW = 52, NH = 20;
  const BASE = 180, PITCH = 6.4, RH = 4.2;
  const FILTERED = 3, FULL = 12;              // illustrative, not measured
  const top = n => BASE - RH - (n - 1) * PITCH;
  let b = '';

  b += filesGlyph(100, 6);
  b += `<text x="72" y="17" text-anchor="end" font-size="6" ${LABEL}>ICEBERG FILES</text>`;
  b += `<text x="72" y="25" text-anchor="end" font-size="6" ${NOTE}>one copy, two readers</text>`;

  // path A: straight through the filter
  b += `<g fill="none" stroke="#fff" stroke-opacity="0.3" stroke-width="2" stroke-dasharray="4 5">`;
  b += `<path d="M100,36 C100,50 ${AX},42 ${AX},56 L${AX},${NY}"/>`;
  b += `<path d="M${AX},${NY + NH} L${AX},${(top(FILTERED) - 4).toFixed(1)}"/>`;
  // path B: swerves around the filter it never meets
  b += `<path d="M100,36 C100,50 ${BX},42 ${BX},56 C${BX},60 192,58 192,76 C192,94 ${BX},92 ${BX},100 L${BX},${(top(FULL) - 4).toFixed(1)}"/>`;
  b += `</g>`;
  b += `<g fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="2" stroke-linecap="round">`;
  [[AX, top(FILTERED) - 4], [BX, top(FULL) - 4]].forEach(([x, y]) => {
    b += `<path d="M${x - 3},${(y - 3.5).toFixed(1)} L${x},${y.toFixed(1)} L${x + 3},${(y - 3.5).toFixed(1)}"/>`;
  });
  b += `</g>`;

  // filter nodes: solid = it runs, round-dotted = it doesn't
  b += `<rect x="${AX - NW / 2}" y="${NY}" width="${NW}" height="${NH}" rx="5" fill="#fff" fill-opacity="0.08" stroke="#fff" stroke-opacity="0.6" stroke-width="2.5"/>`;
  b += `<rect x="${BX - NW / 2}" y="${NY}" width="${NW}" height="${NH}" rx="5" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="2.5" stroke-dasharray="1 8" stroke-linecap="round"/>`;
  b += `<text x="${AX}" y="${NY + 12.2}" text-anchor="middle" font-family="Montserrat" font-size="5.8" font-weight="700" letter-spacing="0.4" fill="#fff" opacity="0.92">ROW FILTER</text>`;
  b += `<text x="${BX}" y="${NY + 12.2}" text-anchor="middle" font-family="Montserrat" font-size="5.8" font-weight="700" letter-spacing="0.4" fill="#fff" opacity="0.3">ROW FILTER</text>`;

  // row stacks: the height difference is the claim
  for (let i = 0; i < FILTERED; i++) b += `<rect x="${AX - NW / 2}" y="${(BASE - RH - i * PITCH).toFixed(1)}" width="${NW}" height="${RH}" rx="1.2" fill="#fff" fill-opacity="0.42"/>`;
  for (let i = 0; i < FULL; i++) b += `<rect x="${BX - NW / 2}" y="${(BASE - RH - i * PITCH).toFixed(1)}" width="${NW}" height="${RH}" rx="1.2" fill="${O}"/>`;

  b += `<text x="${AX}" y="192" text-anchor="middle" font-size="5.8" ${LABEL}>ENGINE A</text>`;
  b += `<text x="${AX}" y="200" text-anchor="middle" font-size="5.6" ${NOTE}>by table name</text>`;
  b += `<text x="${AX}" y="207.5" text-anchor="middle" font-size="5.6" ${NOTE}>row filter applied</text>`;
  b += `<text x="${BX}" y="192" text-anchor="middle" font-size="5.8" ${LABEL}>SECOND ENGINE</text>`;
  b += `<text x="${BX}" y="200" text-anchor="middle" font-size="5.6" ${NOTE}>by path or REST catalog</text>`;
  b += `<text x="${BX}" y="207.5" text-anchor="middle" font-size="5.6" font-family="Inter" font-weight="600" fill="${OL}">row filter skipped</text>`;
  b += `<text x="100" y="220" text-anchor="middle" font-family="Inter" font-size="5" font-weight="400" letter-spacing="0.6" fill="#fff" opacity="0.32">ROW COUNTS ILLUSTRATIVE</text>`;
  return svg(200, 224, b, 690);
}

// ── 2. POLARIS ───────────────────────────────────────────────────
// Claim: Polaris's full table-privilege set is ten grants and none is row-scoped.
// Ten numbered solid chips (the literal privilege names), then an 11th
// round-dotted chip for the row filter that isn't in the grammar.
function drawPolarisGrants() {
  const GRANTS = [
    'TABLE_CREATE', 'TABLE_DROP', 'TABLE_LIST', 'TABLE_READ_PROPERTIES',
    'TABLE_WRITE_PROPERTIES', 'TABLE_READ_DATA', 'TABLE_WRITE_DATA',
    'TABLE_FULL_METADATA', 'TABLE_ATTACH_POLICY', 'TABLE_DETACH_POLICY',
  ];
  const X = 20, W = 92, H = 11, y = i => 13 + i * 15;
  const READ = GRANTS.indexOf('TABLE_READ_DATA');
  const GY = y(10) + 6;
  let b = '';

  b += `<text x="${X}" y="6" font-size="5.8" ${LABEL}>APACHE POLARIS · TABLE PRIVILEGES</text>`;
  GRANTS.forEach((g, i) => {
    const hot = i === READ;
    b += `<text x="${X - 5}" y="${y(i) + 7.6}" text-anchor="end" font-family="Montserrat" font-size="5" font-weight="700" fill="#fff" opacity="0.35">${String(i + 1).padStart(2, '0')}</text>`;
    b += `<rect x="${X}" y="${y(i)}" width="${W}" height="${H}" rx="3" fill="#fff" fill-opacity="${hot ? 0.12 : 0.06}" stroke="#fff" stroke-opacity="${hot ? 0.7 : 0.3}" stroke-width="2"/>`;
    b += `<text x="${X + 5}" y="${y(i) + 7.6}" font-family="Inter" font-size="5.2" font-weight="600" letter-spacing="0.2" fill="#fff" opacity="${hot ? 0.95 : 0.7}">${g}</text>`;
  });

  // the 11th grant, which does not exist
  b += `<text x="${X - 5}" y="${GY + 7.6}" text-anchor="end" font-family="Montserrat" font-size="5" font-weight="700" fill="${OL}">11</text>`;
  b += `<rect x="${X}" y="${GY}" width="${W}" height="${H}" rx="3" fill="none" stroke="${O}" stroke-width="2.4" stroke-dasharray="1 8" stroke-linecap="round"/>`;
  b += `<text x="${X + 5}" y="${GY + 7.6}" font-family="Inter" font-size="5.2" font-weight="700" letter-spacing="0.2" fill="${OL}">ROW FILTER</text>`;

  // leaders
  const ry = y(READ) + H / 2, gy = GY + H / 2;
  b += `<g stroke="#fff" stroke-opacity="0.3" stroke-width="1.5">`;
  b += `<line x1="${X + W + 3}" y1="${ry}" x2="${X + W + 13}" y2="${ry}"/>`;
  b += `<line x1="${X + W + 3}" y1="${gy}" x2="${X + W + 13}" y2="${gy}"/>`;
  b += `</g>`;
  const tx = X + W + 17;
  b += `<text x="${tx}" y="${ry + 1.5}" font-family="Montserrat" font-size="11" font-weight="800" letter-spacing="-0.3" fill="#fff">every row</text>`;
  b += `<text x="${tx}" y="${ry + 10}" font-size="5.6" ${NOTE}>and every column</text>`;
  b += `<text x="${tx}" y="${gy + 1.5}" font-family="Montserrat" font-size="8.5" font-weight="800" letter-spacing="-0.2" fill="#fff" opacity="0.9">no such grant</text>`;
  b += `<text x="${tx}" y="${gy + 9.5}" font-size="5.6" ${NOTE}>row or column scope</text>`;
  return svg(200, 188, b, 760);
}

// ── 3. SNOWFLAKE HORIZON ─────────────────────────────────────────
// Claim: Horizon's Iceberg REST API has two connection paths; only one applies policy.
// A heavy catalog block with two ports. The limbs are identical <g> groups that
// differ only in y: the default limb sits lower, its policy ring round-dotted,
// its Spark client orange. Horizontal, unlike the cover's vertical split.
function drawHorizonPaths() {
  const limb = (enforced) => {
    let g = '';
    g += `<circle cx="61" cy="0" r="2.6" fill="#fff" fill-opacity="0.6"/>`;
    g += `<g stroke="#fff" stroke-opacity="0.3" stroke-width="2" stroke-dasharray="4 5" fill="none">`;
    g += `<line x1="65" y1="0" x2="93" y2="0"/><line x1="115" y1="0" x2="145" y2="0"/></g>`;
    g += `<path d="M142,-3 L145.5,0 L142,3" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="2" stroke-linecap="round"/>`;
    g += enforced
      ? `<circle cx="104" cy="0" r="10" fill="#fff" fill-opacity="0.07" stroke="#fff" stroke-opacity="0.75" stroke-width="2.5"/>`
      : `<circle cx="104" cy="0" r="10" fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="2.5" stroke-dasharray="1 8" stroke-linecap="round"/>`;
    // padlock
    g += `<g fill="none" stroke="#fff" stroke-width="1.5" stroke-opacity="${enforced ? 0.9 : 0.22}">`;
    g += `<rect x="100.5" y="-1" width="7" height="5.5" rx="1"/><path d="M101.8,-1 V-3 a2.2,2.2 0 0 1 4.4,0 V-1"/></g>`;
    g += enforced
      ? `<rect x="150" y="-11" width="44" height="22" rx="5" fill="#fff" fill-opacity="0.06" stroke="#fff" stroke-opacity="0.45" stroke-width="2"/>`
      : `<rect x="150" y="-11" width="44" height="22" rx="5" fill="${O}"/>`;
    g += `<text x="172" y="2.6" text-anchor="middle" font-family="Montserrat" font-size="7" font-weight="800" letter-spacing="0.4" fill="#fff">SPARK</text>`;
    g += `<text x="66" y="-16" font-size="5.4" ${LABEL}>${enforced ? 'WITH DATA POLICIES ENFORCED' : 'DEFAULT CONNECTION'}</text>`;
    g += `<text x="66" y="21" font-size="5.8" ${NOTE}>${enforced ? 'row filters and masks apply' : 'no policies applied'}</text>`;
    return g;
  };

  let b = '';
  // the catalog: heavier than anything on the cover
  b += `<rect x="6" y="10" width="55" height="124" rx="8" fill="#fff" fill-opacity="0.05" stroke="#fff" stroke-opacity="0.45" stroke-width="2.5"/>`;
  b += `<text x="33.5" y="32" text-anchor="middle" font-size="5.2" ${LABEL}>SNOWFLAKE</text>`;
  b += `<text x="33.5" y="44" text-anchor="middle" font-family="Montserrat" font-size="8.6" font-weight="800" letter-spacing="-0.1" fill="#fff">HORIZON</text>`;
  b += `<text x="33.5" y="53" text-anchor="middle" font-size="5.4" ${NOTE}>Iceberg REST API</text>`;
  b += `<g fill="none" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5">`;
  b += `<rect x="20" y="80" width="27" height="26" rx="2"/><line x1="20" y1="88" x2="47" y2="88"/><line x1="20" y1="97" x2="47" y2="97"/><line x1="33.5" y1="80" x2="33.5" y2="106"/></g>`;
  b += `<text x="33.5" y="120" text-anchor="middle" font-size="5.2" ${LABEL}>ONE TABLE</text>`;

  b += `<g transform="translate(0,40)">${limb(true)}</g>`;
  b += `<g transform="translate(0,104)">${limb(false)}</g>`;

  b += annot(6, 152, { label: 'ONCE POLICIES ARE ACTIVE', value: 'writes blocked', note: 'for external engines, in either connection mode', color: '#fff' });
  return svg(200, 190, b, 800);
}

// ── 4. THE FIXES ─────────────────────────────────────────────────
// Claim: of the five approaches, scan planning is the one where the catalog
// filters before a client opens files. Comparison matrix, hero row triple-encoded.
function drawFixMatrix() {
  const ROWS = [
    { name: 'Reject multi-engine access', reads: null, plan: null, breaks: 'Blocks legitimate cross-engine analytics' },
    { name: 'Server-side scan planning', reads: 'Yes', plan: 'Yes', breaks: 'Iceberg 1.11+, opt-in per engine, beta on Databricks', hero: true },
    { name: 'One trusted engine', reads: null, plan: null, breaks: 'Proxy or block every other catalog' },
    { name: 'Filtered copy per audience', reads: 'Own copy', plan: null, breaks: 'Duplicate storage that drifts over time' },
    { name: 'Replicate policy per engine', reads: 'Yes', plan: null, breaks: 'Definitions fall out of sync silently' },
  ];
  const nul = `<span style="color:rgba(255,255,255,0.25);font-size:22px;">—</span>`;
  const th = (t, align = 'left', w) => `<th style="text-align:${align};${w ? `width:${w}px;` : ''}padding:0 12px 14px;font-size:14px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:${C.text3};border-bottom:1px solid rgba(255,255,255,0.15);">${t}</th>`;
  const td = (inner, r, { align = 'left', first = false, size = 19, dim = false } = {}) => {
    const hero = r.hero;
    const color = hero ? (dim ? 'rgba(255,255,255,0.88)' : OL) : (dim ? C.text2 : (first ? '#fff' : C.text2));
    return `<td style="text-align:${align};vertical-align:middle;padding:19px 12px;font-size:${size}px;line-height:1.3;color:${color};font-weight:${hero ? 700 : (first ? 600 : 500)};${hero ? 'background:rgba(242,96,12,0.12);' : ''}${hero && first ? `box-shadow:inset 4px 0 0 ${O};` : ''}border-bottom:1px solid rgba(255,255,255,0.06);">${inner}</td>`;
  };
  const body = ROWS.map(r => `<tr>
      ${td(r.name, r, { first: true, size: 20 })}
      ${td(r.reads ?? nul, r, { align: 'center' })}
      ${td(r.plan ?? nul, r, { align: 'center' })}
      ${td(r.breaks, r, { size: 17, dim: true })}
    </tr>`).join('');

  const chip = t => `<span style="display:inline-block;padding:6px 13px;border-radius:999px;border:1px solid rgba(255,255,255,0.14);font-size:16px;font-weight:600;color:${C.text2};">${t}</span>`;
  return `<div style="width:100%;">
    <div style="font-size:14px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:${C.text3};margin-bottom:18px;">Snowflake engineering's five approaches</div>
    <table style="width:100%;border-collapse:collapse;font-family:'Inter',sans-serif;">
      <thead><tr>${th('Approach', 'left', 270)}${th('Second engine reads', 'center', 132)}${th('Catalog pre-filters', 'center', 132)}${th('Where it breaks')}</tr></thead>
      <tbody>${body}</tbody>
    </table>
    <div style="margin-top:26px;display:flex;flex-wrap:wrap;align-items:center;gap:10px;">
      <span style="font-size:14px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:${C.text3};margin-right:4px;">Databricks cross-engine ABAC needs</span>
      ${chip('Iceberg-Spark 1.11+')}${chip('Apache Spark 4.0+')}${chip('DBR 16.4+')}
    </div>
  </div>`;
}

// ── 5. CLOSER ────────────────────────────────────────────────────
// Bookend: the cover's two paths, merged through one catalog scan-plan node
// before they reach the same file stack the cover started from.
function drawOnePlan() {
  const NX = 100, NY = 56;
  let b = '';
  b += `<text x="44" y="7" text-anchor="middle" font-size="5.8" ${LABEL}>ENGINE A</text>`;
  b += `<text x="156" y="7" text-anchor="middle" font-size="5.8" ${LABEL}>SECOND ENGINE</text>`;
  b += `<circle cx="44" cy="15" r="3" fill="#fff" fill-opacity="0.5"/><circle cx="156" cy="15" r="3" fill="#fff" fill-opacity="0.5"/>`;
  b += `<g fill="none" stroke="#fff" stroke-opacity="0.3" stroke-width="2" stroke-dasharray="4 5">`;
  b += `<path d="M44,19 C44,44 ${NX},32 ${NX},${NY - 9}"/>`;
  b += `<path d="M156,19 C156,44 ${NX},32 ${NX},${NY - 9}"/>`;
  b += `<path d="M${NX},${NY + 9} L${NX},84"/>`;
  b += `</g>`;
  b += `<path d="M${NX - 3},80.5 L${NX},84 L${NX + 3},80.5" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="2" stroke-linecap="round"/>`;
  b += `<circle cx="${NX}" cy="${NY}" r="11" fill="none" stroke="${O}" stroke-opacity="0.35" stroke-width="1.5"/>`;
  b += `<circle cx="${NX}" cy="${NY}" r="6" fill="${O}"/>`;
  b += `<text x="${NX + 18}" y="${NY + 2}" font-family="Montserrat" font-size="8.5" font-weight="800" letter-spacing="0.2" fill="#fff">ONE SCAN PLAN</text>`;
  b += `<text x="${NX + 18}" y="${NY + 10}" font-size="5.6" ${NOTE}>filters applied in the catalog</text>`;
  b += filesGlyph(NX, 88);
  b += `<text x="72" y="99" text-anchor="end" font-size="6" ${LABEL}>ICEBERG FILES</text>`;
  b += `<text x="72" y="107" text-anchor="end" font-size="6" ${NOTE}>opened after the plan</text>`;
  return svg(200, 118, b, 720);
}

// ── slides ───────────────────────────────────────────────────────
const qr = BLOG_URL ? await makeQr(BLOG_URL, 150) : null;

const cta = qr
  ? `<div style="display:flex;align-items:center;justify-content:space-between;gap:32px;margin-top:20px;">
       <div>
         ${ctaPill('Keep your catalog and code, run Spark 4–10× faster')}
         <div style="margin-top:16px;font-size:21px;color:${C.text2};font-weight:500;">sales@yeedu.io</div>
       </div>
       <div style="text-align:center;">
         ${qr}
         <div style="margin-top:8px;font-size:13px;color:${C.text3};letter-spacing:0.6px;">READ THE POST</div>
       </div>
     </div>`
  : `<div style="margin-top:26px;padding-top:26px;border-top:1px solid ${C.rule};display:flex;align-items:center;justify-content:space-between;gap:24px;">
       ${ctaPill('Keep your catalog and code, run Spark 4–10× faster')}
       <div style="font-size:22px;color:${C.text2};font-weight:500;white-space:nowrap;">sales@yeedu.io</div>
     </div>`;

const slides = [
  {
    notes: 'Cover — claim: a second engine reading the same Iceberg files skips the row filter. Split-path vocabulary: solid filter node vs round-dotted absent node, short vs full (orange) row stack; bookended on slide 5',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Iceberg · Row-level security')}
      ${headline(`A second engine ${em('skips your row filter')}`, 50)}
      ${well(drawSplitRead(), { card: false })}
      ${caption(`Row filters and column masks run in the query planner at read time. The Iceberg files don't carry them, so an engine opening those files by path or through another REST catalog never sees the rule.`)}
    `, 'A'),
  },
  {
    notes: 'Polaris — claim: ten table privileges, none row-scoped. Archetype 5 (ghost edge) as a numbered grant list: 10 solid chips, 11th round-dotted ROW FILTER chip',
    html: stage(`
      ${eyebrow('Apache Polaris')}
      ${headline('10 Polaris table grants, none by row', 50)}
      ${well(drawPolarisGrants())}
      ${caption(`None of Polaris's table privileges is scoped to rows or columns. Grant TABLE_READ_DATA and the principal reads the entire table; anything finer means bolting on an outside policy engine such as Open Policy Agent.`)}
    `, 'B'),
  },
  {
    notes: 'Snowflake Horizon — claim: two connection paths, only one applies policies. Archetype 4 (two-outcome fork, valence by height): identical limbs off a heavy catalog block, default limb lower with a round-dotted policy ring',
    html: stage(`
      ${eyebrow('Snowflake Horizon')}
      ${headline(`Horizon's policy path is opt-in`, 54)}
      ${well(drawHorizonPaths())}
      ${caption(`Horizon's Iceberg REST API offers two connection paths to one table, and only the one opened “with data policies enforced” applies them. A Spark cluster pointed at the default gets unpoliced reads.`)}
    `, 'D'),
  },
  {
    notes: 'The fixes — claim: server-side scan planning is the approach where the catalog filters before files open. Archetype 7 (comparison matrix, hero row) over the five approaches, plus version requirements',
    html: stage(`
      ${eyebrow('Five fixes, compared')}
      ${headline('Scan planning filters before files open', 46)}
      ${well(drawFixMatrix(), { pad: 34 })}
      ${caption(`Iceberg 1.11.0 added a server-side scan planning API. The client posts one request to <span style="font-family:'JetBrains Mono',monospace;font-size:20px;">.../plan</span> and the REST catalog returns pre-filtered FileScanTasks.`)}
    `, 'C'),
  },
  {
    notes: 'Closer — claim: route every engine through one catalog scan plan. Archetype 8 (convergence bookend): the cover split paths merge through one orange plan node before the file stack. CTA pill + sales@yeedu.io; QR only when BLOG_URL is set',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Plan-time governance')}
      ${headline('Route every engine through one plan', 46)}
      ${well(drawOnePlan(), { card: false })}
      ${caption(`Adding any Spark engine to an Iceberg estate, Yeedu included, means routing it through that same plan before it reads a protected table.`)}
      ${cta}
    `, 'A'),
  },
];

const NAME = 'Row-Level Security On Iceberg — The Second Engine Problem';

if (OLD_ID) { console.log('Removing superseded deck…'); await deleteCarousel(OLD_ID); }
const id = await buildCarousel(NAME, slides);
if (!process.env.SKIP_EXPORT) await exportDeck(id, NAME);
