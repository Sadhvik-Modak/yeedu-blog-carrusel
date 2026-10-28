// ════════════════════════════════════════════════════════════════
// When to Buy vs Build a Spark Platform: A Decision Guide
//
// 5 slides, 4:5. The article's argument: decide per workload, not per
// company. Nine components every platform must provide, seven criteria that
// tip the call, the hidden cost of each path, and how to keep it reversible.
// No vendor prices. Yeedu only on the closer, facts pack only: runs in your
// own account, fixed licence, job-by-job adoption.
// ════════════════════════════════════════════════════════════════
import { C, stage, logoMark, eyebrow, headline, caption, well, svg, buildCarousel, deleteCarousel, exportDeck } from './yeedu-chrome.mjs';
import { O, OL, em2, lbl, txt, card, arrow, points, cta } from './yeedu-deck-parts.mjs';

const OLD_ID = process.env.OLD_ID || '';

// ── 1. COVER: the spectrum ───────────────────────────────────────
function drawSpectrum() {
  let b = '';
  const y = 24, h = 60, w = 56, xs = [4, 72, 140];
  const nodes = [
    ['BUILD', 'Self-managed Spark', 'you own infra and ops', false],
    ['MIDDLE', 'Software you buy', 'runs in your account', true],
    ['BUY', 'Managed service', 'vendor runs the plane', false],
  ];
  // the axis underneath
  b += `<line x1="4" y1="100" x2="196" y2="100" stroke="#fff" stroke-opacity="0.25" stroke-width="0.8"/>`;
  b += lbl(4, 110, 'MORE CONTROL', { size: 4.2, op: 0.6 });
  b += lbl(196, 110, 'LESS TO RUN', { anchor: 'end', size: 4.2, op: 0.6 });
  nodes.forEach(([k, t, s, hot], i) => {
    const x = xs[i];
    b += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${hot ? O : '#fff'}" fill-opacity="${hot ? 0.16 : 0.07}" stroke="${hot ? O : '#fff'}" stroke-opacity="${hot ? 1 : 0.32}" stroke-width="${hot ? 1.1 : 0.7}"/>`;
    b += lbl(x + w / 2, y + 13, k, { anchor: 'middle', size: 4.6, op: 1, fill: hot ? OL : '#fff' });
    b += txt(x + w / 2, y + 32, t, { anchor: 'middle', size: 5, op: 1, weight: 700 });
    b += txt(x + w / 2, y + 43, s, { anchor: 'middle', size: 4.2, op: 0.7 });
    b += `<circle cx="${x + w / 2}" cy="100" r="2" fill="${hot ? O : '#fff'}" fill-opacity="${hot ? 1 : 0.5}"/>`;
    if (i < 2) b += arrow(x + w + 1.5, y + h / 2, xs[i + 1] - 1.5, y + h / 2, { op: 0.35 });
  });
  b += lbl(4, 12, 'MOST ESTATES END UP WITH A MIX', { size: 4.4, op: 0.65 });
  return svg(200, 116, b, 856);
}

// ── 2. NINE COMPONENTS ───────────────────────────────────────────
function drawComponents() {
  const comps = [
    ['Cluster lifecycle', 'start, stop, autoscale'],
    ['Job scheduling', 'submit, queue, retry'],
    ['Catalog', 'metastore, tables'],
    ['Notebooks / IDE', 'interactive access'],
    ['Access + secrets', 'who can run what'],
    ['Cost attribution', 'spend per job, team'],
    ['Monitoring', 'History Server, logs'],
    ['Upgrades', 'multi-version Spark'],
    ['Support + on-call', 'who gets paged'],
  ];
  let b = '';
  const w = 62, h = 40, gx = 3, gy = 7;
  comps.forEach(([t, s], i) => {
    const x = 2 + (i % 3) * (w + gx), y = 4 + Math.floor(i / 3) * (h + gy);
    b += card(x, y, w, h, t, s, { titleSize: 5.2, subSize: 4.3 });
  });
  return svg(200, 142, b, 856);
}

// ── 3. SEVEN CRITERIA ────────────────────────────────────────────
function drawCriteria() {
  const rows = [
    ['Platform headcount', 'team runs K8s/YARN', 'no infra engineers'],
    ['Workload profile', 'steady, near capacity', 'spiky, long idle'],
    ['Time to value', '3-6 months is fine', 'needed in weeks'],
    ['Compliance', 'data must stay in', 'vendor certs suffice'],
    ['Customization', 'patched internals', 'standard APIs fit'],
    ['Differentiation', 'platform is the product', 'Spark is plumbing'],
    ['Vendor dependence', 'exit timing matters', 'SLA trade-off is fine'],
  ];
  let b = '';
  const x0 = 4, c1 = 66, c2 = 134, rh = 20, y0 = 18;
  b += lbl(x0, 11, 'CRITERION', { size: 4.2, op: 0.55 });
  b += lbl(c1, 11, 'FAVORS BUILD', { size: 4.2, op: 1, fill: OL });
  b += lbl(c2, 11, 'FAVORS BUY', { size: 4.2, op: 0.8 });
  rows.forEach(([k, a, z], i) => {
    const y = y0 + i * rh;
    if (i % 2 === 0) b += `<rect x="${x0 - 2}" y="${y - 1}" width="198" height="${rh - 1}" rx="2" fill="#fff" fill-opacity="0.04"/>`;
    b += txt(x0, y + 11.5, k, { size: 4.9, op: 1, weight: 700 });
    b += txt(c1, y + 11.5, a, { size: 4.5, op: 0.9, fill: OL });
    b += txt(c2, y + 11.5, z, { size: 4.5, op: 0.75 });
  });
  return svg(200, 160, b, 856);
}

// ── 4. HIDDEN COSTS + REVERSIBILITY ──────────────────────────────
function drawHidden() {
  let b = '';
  const w = 94, x1 = 4, x2 = 102;
  b += lbl(x1, 10, 'HIDDEN COST OF BUILDING', { size: 4.3, op: 0.75 });
  b += lbl(x2, 10, 'HIDDEN COST OF BUYING', { size: 4.3, op: 0.75 });
  const build = [['Key-person risk', 'two engineers know it all'], ['Upgrade debt', 'compounds quietly'], ['Platform becomes the job', 'instead of pipelines']];
  const buy = [['Consumption billing', 'scales with usage'], ['Proprietary features', 'raise exit cost'], ['Control plane', "someone else's"]];
  build.forEach(([t, s], i) => { b += card(x1, 16 + i * 28, w, 24, t, s, { titleSize: 5, subSize: 4.2 }); });
  buy.forEach(([t, s], i) => { b += card(x2, 16 + i * 28, w, 24, t, s, { titleSize: 5, subSize: 4.2 }); });
  // reversibility bar
  const y = 114;
  b += lbl(x1, y, 'KEEP EITHER PATH REVERSIBLE', { size: 4.3, op: 1, fill: OL });
  const legs = [['Open table formats', 'Delta, Iceberg'], ['Portable catalog', 'no single-vendor lock'], ['Plain spark-submit', 'standard Spark APIs']];
  legs.forEach(([t, s], i) => { b += card(x1 + i * 65.3, y + 6, 61, 26, t, s, { hot: true, titleSize: 4.5, subSize: 3.7 }); });
  return svg(200, 148, b, 856);
}

const slides = [
  {
    notes: 'Cover: build / middle / buy spectrum, more control to less to run. Most estates end up with a mix. No figures',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Spark platforms')}
      ${headline(`Buy or build? ${em2('decide per workload, not per company')}`, 56)}
      ${well(drawSpectrum(), { card: false })}
      ${caption(`Who already runs the infrastructure, how steady the workload is, and how much control over residency and runtime you will hand over decide the call. There is no universal winner.`)}
    `, 'A'),
  },
  {
    notes: 'The nine components every Spark platform must provide. Building means owning all nine; buying means renting them',
    html: stage(`
      ${eyebrow('What a platform is')}
      ${headline(`Nine components ${em2('someone has to own')}`, 56)}
      ${well(drawComponents())}
      ${caption(`Building means your team assembles, patches and gets paged for all nine. Buying means a vendor does, on its terms and its control plane.`)}
    `, 'B'),
  },
  {
    notes: "The seven criteria from the article's decision matrix, favors build vs favors buy. Score per workload",
    html: stage(`
      ${eyebrow('The decision matrix')}
      ${headline(`Seven criteria ${em2('score each workload')}`, 56)}
      ${well(drawCriteria(), { pad: 26 })}
      ${caption(`A nightly batch estate and a spiky analytics workload can land on opposite sides. Pilot any change on two or three jobs for four to six weeks before moving the rest.`)}
    `, 'C'),
  },
  {
    notes: 'Hidden cost of each path (key-person risk, upgrade debt vs consumption billing, proprietary features, control plane) and the three legs of reversibility',
    html: stage(`
      ${eyebrow('Both paths cost more than they look')}
      ${headline(`Hidden costs ${em2('and how to stay reversible')}`, 54)}
      ${well(drawHidden(), { pad: 26 })}
      ${caption(`Whichever path you pick, keep the table format, the catalog and the code portable. Then the decision can change when the workload does. Revisit the split every twelve months.`)}
    `, 'D'),
  },
  {
    notes: 'Closer: Yeedu as the middle option. Runs in your own cloud account or on-prem; fixed annual licence with unlimited usage; catalog read in place and adoption job by job. CTA, no QR',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Yeedu')}
      ${headline(`Buy the software ${em2('keep the control')}`, 56)}
      ${points([
        ['cloud', 'Runs inside your own cloud account or on your own servers.'],
        ['wallet', 'A fixed annual licence with unlimited usage. No per-core, per-hour or per-job charge.'],
        ['steps', 'Adopted job by job. Unity Catalog, Hive Metastore and Glue are read in place.'],
      ])}
      ${cta()}
    `, 'C'),
  },
];

const NAME = 'When to Buy vs Build a Spark Platform: A Decision Guide';

if (OLD_ID) await deleteCarousel(OLD_ID);
const id = await buildCarousel(NAME, slides);
if (!process.env.SKIP_EXPORT) await exportDeck(id, NAME);
