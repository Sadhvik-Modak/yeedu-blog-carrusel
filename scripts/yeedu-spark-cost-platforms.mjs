// ════════════════════════════════════════════════════════════════
// Best Spark Cost Optimization Platforms for 2026
// Source: n8n-workflows-v2/output/revise/2026-09-28-best-spark-cost-optimization-platforms-for-2026
//
// 5 slides, 4:5. One bespoke drawing per slide, no shared renderer map.
// Chrome only comes from ./yeedu-chrome.mjs. Topic numbers are the blog's
// cited sources (AWS EMR pricing worked example, Dataproc pricing, Databricks
// cost-maturity post). The pricing-model chart has no real prices on it and
// is labelled illustrative. Yeedu claims come from the blog's Yeedu section
// and the facts pack only, with the vendor-reported CPU-bound scope carried.
// ════════════════════════════════════════════════════════════════
import {
  C, stage, logoMark, eyebrow, headline, em, caption, well, svg,
  makeQr, ctaPill, buildCarousel, deleteCarousel, exportDeck,
} from './yeedu-chrome.mjs';

const BLOG_URL = null; // not published yet; set the live URL and re-run to add the QR
const OLD_ID = process.env.OLD_ID || '08d73409-66ec-4849-bec1-6526f692d459';

const O = C.orange, OL = C.orangeLight;

const lbl = (x, y, t, { anchor = 'start', fill = '#fff', op = 0.42, size = 6.2 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter" font-size="${size}" font-weight="600" letter-spacing="0.9" fill="${fill}" opacity="${op}">${t}</text>`;
const txt = (x, y, t, { anchor = 'start', fill = '#fff', op = 0.75, size = 5.2, weight = 500 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter" font-size="${size}" font-weight="${weight}" fill="${fill}" opacity="${op}">${t}</text>`;
const num = (x, y, t, { anchor = 'start', fill = '#fff', op = 1, size = 14, weight = 800 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Montserrat" font-size="${size}" font-weight="${weight}" letter-spacing="-0.4" fill="${fill}" opacity="${op}">${t}</text>`;

// ── 1. COVER ─────────────────────────────────────────────────────
// Claim: the ten platforms do not form one ranked list; they sit on four
// layers that each touch a different part of the bill. Four strata, the ten
// platforms drawn as chips on the stratum they touch. The execution layer is
// outlined orange, which the closer picks up again.
function drawFourLayers() {
  const layers = [
    { name: 'EXECUTION ENGINE', sub: 'changes how Spark runs', tools: ['Yeedu', 'Apache Gluten', 'DataFusion Comet'], hot: true },
    { name: 'MANAGED PLATFORM', sub: 'levers you already pay for', tools: ['Databricks', 'Amazon EMR', 'Google Cloud'] },
    { name: 'OBSERVABILITY', sub: 'shows which job spent what', tools: ['Unravel', 'Pepperdata', 'Acceldata'] },
    { name: 'KUBERNETES COST', sub: 'cost down to the pod', tools: ['Kubecost / OpenCost'] },
  ];
  const x0 = 6, w = 188, h = 30, gap = 5, y0 = 4;
  let b = '';
  layers.forEach((l, i) => {
    const y = y0 + i * (h + gap);
    b += l.hot
      ? `<rect x="${x0}" y="${y}" width="${w}" height="${h}" rx="3" fill="${O}" fill-opacity="0.12" stroke="${O}" stroke-width="2"/>`
      : `<rect x="${x0}" y="${y}" width="${w}" height="${h}" rx="3" fill="#fff" fill-opacity="0.03" stroke="#fff" stroke-opacity="0.28" stroke-width="1.5"/>`;
    b += lbl(x0 + 6, y + 13, l.name, { size: 4.0, op: 0.95, fill: l.hot ? OL : '#fff' });
    b += txt(x0 + 6, y + 21.5, l.sub, { size: 4.4, op: 0.55 });
    const cx0 = 72, cw = 38.5, cg = 2.5;
    l.tools.forEach((t, j) => {
      const single = l.tools.length === 1;
      const cx = cx0 + j * (cw + cg), ww = single ? cw * 2 + cg : cw;
      const lead = l.hot && j === 0;
      b += `<rect x="${cx}" y="${y + 8}" width="${ww}" height="14" rx="7" fill="${lead ? O : '#14110d'}" stroke="${lead ? O : '#fff'}" stroke-opacity="${lead ? 1 : 0.4}" stroke-width="1.2"/>`;
      b += txt(cx + ww / 2, y + 16.6, t, { anchor: 'middle', size: 4.1, op: lead ? 1 : 0.85, weight: 600 });
    });
  });
  const by = y0 + 4 * (h + gap) + 8;
  b += num(x0, by + 10, '10 platforms', { size: 12 });
  b += txt(x0 + 86, by + 4, 'Most teams run two or three layers', { size: 4.6, op: 0.6 });
  b += txt(x0 + 86, by + 11, 'at once. No layer replaces another.', { size: 4.6, op: 0.6 });
  return svg(200, by + 14, b, 856);
}

// ── 2. WHERE THE BILL COMES FROM ─────────────────────────────────
// Claim: on EMR the platform fee rides on top of compute, about 26% in AWS's
// own worked example, and idle capacity bills the same as busy capacity.
// Top: one bar split at the true $871.62 / $229.95 ratio. Bottom: two
// identical cluster boxes, one 20% filled, one 100% filled, same price tag.
function drawEmrUplift() {
  const x0 = 10, W = 180, ec2 = 871.62, emr = 229.95;
  const k = W / (ec2 + emr), we = ec2 * k, wm = emr * k;
  let b = '';
  b += lbl(x0, 10, 'AWS EXAMPLE · 1 MASTER + 2 CORE C4.2XLARGE · ONE MONTH', { size: 4.4, op: 0.55 });
  const y = 18, bh = 24;
  b += `<rect x="${x0}" y="${y}" width="${we}" height="${bh}" rx="2" fill="#fff" fill-opacity="0.82"/>`;
  b += txt(x0 + 6, y + 10, 'EC2 CHARGES', { size: 4.4, fill: '#14110d', op: 0.8, weight: 700 });
  b += num(x0 + 6, y + 20, '$871.62', { size: 8.5, fill: '#14110d' });
  b += `<rect x="${x0 + we + 1}" y="${y}" width="${wm - 1}" height="${bh}" rx="2" fill="${O}"/>`;
  b += txt(x0 + we + wm / 2 + 0.5, y + 10, 'EMR', { anchor: 'middle', size: 4.4, op: 1, weight: 700 });
  b += num(x0 + we + wm / 2 + 0.5, y + 20, '$229.95', { anchor: 'middle', size: 6.4 });
  b += `<path d="M${x0 + we + 1},${y + bh + 4} L${x0 + we + 1},${y + bh + 8} L${x0 + W},${y + bh + 8} L${x0 + W},${y + bh + 4}" fill="none" stroke="${OL}" stroke-width="1.2"/>`;
  b += num(x0 + W, y + bh + 24, '+26%', { anchor: 'end', size: 14, fill: OL });
  b += txt(x0 + W - 42, y + bh + 19, 'EMR uplift on', { anchor: 'end', size: 4.6, op: 0.65 });
  b += txt(x0 + W - 42, y + bh + 25.5, 'top of EC2', { anchor: 'end', size: 4.6, op: 0.65 });

  // idle: two identical boxes, same bill
  const iy = 86, cw = 84, ch = 34;
  b += `<line x1="${x0}" y1="${iy - 8}" x2="${x0 + W}" y2="${iy - 8}" stroke="#fff" stroke-opacity="0.1" stroke-width="1"/>`;
  [{ x: x0, used: 0.2, t: '20% UTILIZED' }, { x: x0 + W - cw, used: 1, t: '100% UTILIZED' }].forEach(({ x, used, t }) => {
    b += lbl(x, iy + 4, t, { size: 4.6, op: 0.8 });
    const by = iy + 9;
    b += `<rect x="${x}" y="${by}" width="${cw}" height="${ch}" rx="3" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="1.5"/>`;
    const cols = 12, cell = (cw - 8) / cols;
    for (let r = 0; r < 4; r++) for (let c = 0; c < cols; c++) {
      const on = (r * cols + c) < used * 48;
      b += `<rect x="${x + 4 + c * cell + 0.6}" y="${by + 4 + r * 6.6}" width="${cell - 1.2}" height="5" rx="0.6" fill="${on ? '#fff' : 'none'}" fill-opacity="${on ? 0.8 : 0}" stroke="#fff" stroke-opacity="${on ? 0 : 0.28}" stroke-width="0.6" ${on ? '' : 'stroke-dasharray="1 1.2"'}/>`;
    }
    b += lbl(x, by + ch + 9, 'SAME HOURLY BILL', { size: 4.4, fill: OL, op: 1 });
  });
  b += num(x0 + W / 2, iy + 9 + ch / 2 + 4, '=', { anchor: 'middle', size: 12, fill: OL });
  return svg(200, iy + 56, b, 856);
}

// ── 3. ATTRIBUTE BEFORE YOU TUNE ─────────────────────────────────
// Claim: the order is attribution, then controls, then tuning, and the engine
// swap is the last step. A four-step staircase from the article's rollout,
// grouped under the Databricks maturity stages; a dotted jump arrow from the
// ground straight to step 4 marks the shortcut that tunes the wrong jobs.
function drawRolloutStairs() {
  const steps = [
    { t1: 'Tag clusters,', t2: 'publish showback', stage: 'ATTRIBUTE' },
    { t1: 'Auto-terminate,', t2: 'capped policies', stage: 'CONTROL' },
    { t1: 'Move to', t2: 'chargeback', stage: 'CONTROL' },
    { t1: 'Right-size, Spot', t2: 'or engine swap', stage: 'TUNE', hot: true },
  ];
  const x0 = 20, sw = 44, rise = 26, base = 140;
  let b = '';
  b += `<line x1="${x0 - 4}" y1="${base}" x2="196" y2="${base}" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5"/>`;
  steps.forEach((s, i) => {
    const x = x0 + i * sw, top = base - (i + 1) * rise;
    b += s.hot
      ? `<rect x="${x}" y="${top}" width="${sw - 2}" height="${base - top}" rx="2" fill="${O}" fill-opacity="0.16" stroke="${O}" stroke-width="2"/>`
      : `<rect x="${x}" y="${top}" width="${sw - 2}" height="${base - top}" rx="2" fill="#fff" fill-opacity="${0.04 + i * 0.02}" stroke="#fff" stroke-opacity="0.4" stroke-width="1.5"/>`;
    b += num(x + 4, top + 11, String(i + 1), { size: 9, fill: s.hot ? OL : '#fff' });
    b += lbl(x + 4, top + 18, s.stage, { size: 3.8, op: s.hot ? 1 : 0.5, fill: s.hot ? OL : '#fff' });
    b += txt(x + 2, top - 10, s.t1, { size: 4.3, op: 0.9, weight: 600 });
    b += txt(x + 2, top - 4, s.t2, { size: 4.3, op: 0.65 });
  });
  // the shortcut: ground straight to step 4, dotted, crossed
  const sx = 8, sy = base, ex = x0 + 3 * sw + 4, ey = base - 4 * rise - 16;
  b += `<path d="M${sx},${sy} C${sx},${ey - 10} ${ex - 70},${ey - 14} ${ex},${ey}" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="1.4" stroke-dasharray="1 3.5" stroke-linecap="round"/>`;
  b += `<path d="M${ex - 6},${ey - 4} L${ex},${ey} L${ex - 6},${ey + 3}" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="1.4"/>`;
  b += lbl(x0, base + 11, 'DOTTED: SKIP STRAIGHT TO TUNING AND YOU', { size: 4.2, op: 0.55 });
  b += lbl(x0, base + 18, 'OPTIMIZE THE WRONG TEN JOBS', { size: 4.2, op: 0.55 });
  return svg(200, base + 20, b, 856);
}

// ── 4. USAGE BILLING VS A FIXED LICENSE ──────────────────────────
// Claim: neither pricing model is cheaper by default; the crossover depends
// on how much compute a team burns. A rising consumption line, a flat license
// line, a crossover with no number on it. No real prices: labelled
// illustrative.
function drawPricingCrossover() {
  const ax = 18, ay = 124, aw = 172, ah = 110;
  let b = '';
  b += `<g stroke="#fff" stroke-opacity="0.3" stroke-width="1.5">
    <line x1="${ax}" y1="${ay}" x2="${ax + aw}" y2="${ay}"/><line x1="${ax}" y1="${ay}" x2="${ax}" y2="${ay - ah}"/></g>`;
  b += lbl(ax + aw, ay + 10, 'COMPUTE YOUR TEAM BURNS →', { anchor: 'end', size: 4.4, op: 0.55 });
  b += `<text transform="translate(${ax - 6},${ay}) rotate(-90)" font-family="Inter" font-size="4.4" font-weight="600" letter-spacing="0.9" fill="#fff" opacity="0.55">PLATFORM COST →</text>`;
  // consumption line
  const flatY = ay - 52, cx = ax + 82;
  b += `<line x1="${ax}" y1="${ay}" x2="${ax + aw - 6}" y2="${ay - ah + 4}" stroke="#fff" stroke-opacity="0.85" stroke-width="2.5"/>`;
  // flat license line
  b += `<line x1="${ax}" y1="${flatY}" x2="${ax + aw - 6}" y2="${flatY}" stroke="${O}" stroke-width="3"/>`;
  // crossover
  b += `<line x1="${cx}" y1="${flatY}" x2="${cx}" y2="${ay}" stroke="${OL}" stroke-opacity="0.7" stroke-width="1.2" stroke-dasharray="1 3" stroke-linecap="round"/>`;
  b += `<circle cx="${cx}" cy="${flatY}" r="3.5" fill="#14110d" stroke="${OL}" stroke-width="1.8"/>`;
  b += lbl(cx + 3, ay - 5, 'SET BY YOUR UTILIZATION', { size: 4, fill: OL, op: 1 });
  // line labels
  b += lbl(ax + 110, flatY + 14, 'USAGE BILLING', { size: 4.8, op: 0.95 });
  b += txt(ax + 110, flatY + 21, 'Databricks DBUs, EMR,', { size: 4.2, op: 0.6 });
  b += txt(ax + 110, flatY + 27, 'Dataproc, most', { size: 4.2, op: 0.6 });
  b += txt(ax + 110, flatY + 33, 'observability tools', { size: 4.2, op: 0.6 });
  b += lbl(ax + 6, flatY - 13, 'FIXED ANNUAL LICENSE', { size: 4.8, fill: OL, op: 1 });
  b += txt(ax + 6, flatY - 6, 'Yeedu: unlimited usage', { size: 4.2, op: 0.6 });
  b += lbl(ax, ay + 22, 'ILLUSTRATIVE · SHAPES ONLY, NO REAL PRICES', { size: 4, op: 0.5 });
  b += txt(ax, ay + 30, 'Gluten and Comet carry no license; you still pay for the infrastructure.', { size: 4.2, op: 0.55 });
  return svg(200, ay + 33, b, 856);
}

// ── 5. CLOSER ────────────────────────────────────────────────────
// Bookend: the cover's orange execution layer comes back as the one thing
// that changes. Inside the customer's own account, the catalog, the DAGs and
// the rest of the job estate stay put; one pipeline (orange) is routed to the
// Yeedu execution layer. The vendor-reported range carries its CPU-bound scope.
function drawOnePipeline() {
  let b = '';
  b += `<rect x="4" y="4" width="192" height="118" rx="5" fill="none" stroke="#fff" stroke-opacity="0.4" stroke-width="1.5" stroke-dasharray="4 4"/>`;
  b += lbl(10, 14, 'YOUR AWS, AZURE, GCP OR OCI ACCOUNT, OR ON-PREM', { size: 4.2, op: 0.55 });
  // stays put column
  const sx = 12;
  b += lbl(sx, 26, 'STAYS WHERE IT IS', { size: 4.4, op: 0.75 });
  const box = (y, t1, t2) =>
    `<rect x="${sx}" y="${y}" width="66" height="20" rx="3" fill="#fff" fill-opacity="0.04" stroke="#fff" stroke-opacity="0.35" stroke-width="1.2"/>` +
    txt(sx + 5, y + 8.5, t1, { size: 4.4, op: 0.9, weight: 600 }) + txt(sx + 5, y + 15, t2, { size: 3.9, op: 0.55 });
  b += box(31, 'Catalog', 'Unity, Hive Metastore, Glue');
  b += box(55, 'Orchestration DAGs', 'Airflow, Prefect');
  // job estate grid with one orange job
  b += lbl(sx, 86, 'THE REST OF THE JOBS', { size: 3.9, op: 0.5 });
  const gx = sx, gy = 90, p = 4.4;
  for (let r = 0; r < 6; r++) for (let c = 0; c < 15; c++) {
    const hot = r === 2 && c === 14;
    b += `<rect x="${gx + c * p}" y="${gy + r * p}" width="${hot ? 3.6 : 2.8}" height="${hot ? 3.6 : 2.8}" rx="0.5" fill="${hot ? O : '#fff'}" fill-opacity="${hot ? 1 : 0.3}"/>`;
  }
  // route from the hot job to the Yeedu layer
  const hx = gx + 14 * p + 3.6, hy = gy + 2 * p + 1.8;
  const yx = 98, yy = 34, yw = 92, yh = 50;
  b += `<path d="M${hx},${hy} C${hx + 18},${hy} ${yx - 16},${yy + yh - 12} ${yx},${yy + yh - 12}" fill="none" stroke="${O}" stroke-width="2.4"/>`;
  b += `<path d="M${yx - 5},${yy + yh - 16} L${yx},${yy + yh - 12} L${yx - 5},${yy + yh - 8}" fill="none" stroke="${O}" stroke-width="2"/>`;
  // catalog read in place: dotted line from catalog to Yeedu
  b += `<path d="M${sx + 66},41 C88,41 88,${yy + 10} ${yx},${yy + 10}" fill="none" stroke="#fff" stroke-opacity="0.5" stroke-width="1.2" stroke-dasharray="1 3" stroke-linecap="round"/>`;
  b += txt(84, 31, 'read in place', { size: 3.9, op: 0.55 });
  // Yeedu layer
  b += `<rect x="${yx}" y="${yy}" width="${yw}" height="${yh}" rx="4" fill="${O}" fill-opacity="0.14" stroke="${O}" stroke-width="2.4"/>`;
  b += lbl(yx + 6, yy + 11, 'YEEDU EXECUTION LAYER', { size: 4.6, fill: OL, op: 1 });
  b += txt(yx + 6, yy + 19, 'C++, vectorized, under the Spark API', { size: 4, op: 0.75 });
  b += num(yx + 6, yy + 36, '4–10×', { size: 12, fill: '#fff' });
  b += txt(yx + 44, yy + 30, 'faster, 60–80% lower', { size: 4.2, op: 0.85, weight: 600 });
  b += txt(yx + 44, yy + 36, 'compute cost', { size: 4.2, op: 0.85, weight: 600 });
  b += txt(yx + 6, yy + 45, 'Vendor-reported, CPU-bound jobs only', { size: 3.9, op: 0.65, weight: 600 });
  b += txt(yx, yy + yh + 9, 'CPU-bound: joins, aggregations,', { size: 4, op: 0.6 });
  b += txt(yx, yy + yh + 15, 'multi-stage transforms. Yeedu puts', { size: 4, op: 0.6 });
  b += txt(yx, yy + yh + 21, 'it at 30–40% of a typical mix.', { size: 4, op: 0.6 });
  return svg(200, 126, b, 856);
}

// ── slides ───────────────────────────────────────────────────────
const qr = BLOG_URL ? await makeQr(BLOG_URL, 150) : '';
const CTA = 'Test one pipeline on Yeedu';
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
  : `<div style="display:flex;align-items:center;justify-content:space-between;gap:28px;margin-top:26px;padding-top:24px;border-top:1px solid ${C.rule};">
       ${ctaPill(CTA)}
       <div style="font-size:22px;color:${C.text2};font-weight:500;">sales@yeedu.com</div>
     </div>`;

const slides = [
  {
    notes: 'Cover: claim: the ten best Spark cost optimization platforms sit on four layers (execution engine, managed platform, observability, Kubernetes cost visibility) that rarely get compared; teams usually adopt two or three. Four strata with the ten platforms as chips, execution layer orange (returns on the closer)',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Spark cost platforms 2026')}
      ${headline(`Ten tools, ${em('four layers')}`, 60)}
      ${well(drawFourLayers(), { card: false })}
      ${caption(`A team chasing faster CPU-bound jobs and a team hunting for the pipeline that blew the budget need different tools. Ranking all ten on one list hides that.`)}
    `, 'A'),
  },
  {
    notes: 'Where the bill comes from: claim: EMR bills EC2 plus an EMR uplift, $871.62 + $229.95 a month, about 26% (AWS pricing page worked example: 1 master + 2 core c4.2xlarge); idle capacity bills like busy capacity (20% vs 100% utilization). Proportional split bar plus two identical cluster boxes',
    html: stage(`
      ${eyebrow('Where the Spark bill comes from')}
      ${headline('EMR adds about 26% on top of EC2', 48)}
      ${well(drawEmrUplift())}
      ${caption(`Dataproc adds $0.010 per vCPU-hour on provisioned clusters, and Databricks bills DBUs on top of the cloud bill on classic compute. Idle time is the line every invoice under-reports.`)}
    `, 'C'),
  },
  {
    notes: 'Attribute first: claim: Databricks cost maturity runs attribution, then controls, then tuning; the article rollout is tagging and showback, auto-termination floors and capped policies, chargeback, then right-sizing, Spot or an engine swap. Staircase with a dotted shortcut arrow',
    html: stage(`
      ${eyebrow('Before you shop for an engine')}
      ${headline('Who spent what comes first', 54)}
      ${well(drawRolloutStairs(), { card: false })}
      ${caption(`Capacity matched to load often pays before any engine change. GoDaddy reported over 60% lower cost and a 50% performance gain moving from EMR on EC2 to EMR Serverless.`)}
    `, 'B'),
  },
  {
    notes: 'Pricing model: claim: Databricks, EMR, Dataproc and most observability tools bill usage, Yeedu licenses at a fixed annual price with unlimited usage; neither is cheaper by default, the crossover depends on compute burned. Illustrative crossover chart, no real prices',
    html: stage(`
      ${eyebrow('Usage billing or fixed license')}
      ${headline('Where do the two price lines cross?', 46)}
      ${well(drawPricingCrossover())}
      ${caption(`Neither model wins by default. Plot your own utilization before you compare a license with DBUs or instance-hours, and budget alerts make a usage-billed POC safer, though not fixed.`)}
    `, 'D'),
  },
  {
    notes: 'Closer: claim: Yeedu is an execution layer in the customer\'s own cloud account or on-prem; adoption is one job at a time while the catalog (read via BYOCatalog), the DAGs and the rest of the jobs stay put. Vendor-reported 4-10x faster and 60-80% lower compute cost on CPU-bound work (30-40% of a typical mix), facts pack + article. Bookend of the cover\'s orange execution layer. CTA pill + sales@yeedu.com, no QR (no blog URL)',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Yeedu')}
      ${headline(`Point one pipeline ${em('at Yeedu')}`, 54)}
      ${well(drawOnePipeline(), { card: false })}
      ${caption(`Fixed annual license with unlimited usage, real-time cost per job, and clusters that start and stop on their own. Compare a week of runs on your most expensive job.`)}
      ${cta}
    `, 'C'),
  },
];

const NAME = 'Best Spark Cost Optimization Platforms for 2026';

if (OLD_ID) await deleteCarousel(OLD_ID);
const id = await buildCarousel(NAME, slides);
if (!process.env.SKIP_EXPORT) await exportDeck(id, NAME);
