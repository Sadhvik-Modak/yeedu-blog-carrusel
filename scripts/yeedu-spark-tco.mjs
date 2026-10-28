// ════════════════════════════════════════════════════════════════
// Self-Managed Spark vs Commercial Spark Platforms: The True Cost
// Source: n8n-workflows-v2/output/strategy/2026-10-09-self-managed-spark-vs-commercial-spark-platforms-the-true-co
//
// 5 slides, 4:5. One bespoke drawing per slide, no shared renderer map.
// Chrome only comes from ./yeedu-chrome.mjs. Dollar figures are the blog's
// own worked example (5 x m5.4xlarge for 3 hours, EMR pricing page read
// 2026-10-09). Headcount and idle widths are reader-supplied in the blog and
// are drawn dashed and labelled illustrative. The Yeedu closer carries only
// the article's Yeedu section (control plane in the customer's account, fixed
// licence tier, YCU definition, job-by-job adoption), no Yeedu savings figure.
// ════════════════════════════════════════════════════════════════
import {
  C, stage, logoMark, eyebrow, headline, em, caption, well, svg,
  makeQr, ctaPill, buildCarousel, deleteCarousel, exportDeck,
} from './yeedu-chrome.mjs';

const BLOG_URL = null; // not published yet — set the live URL and re-run to add the QR
const OLD_ID = process.env.OLD_ID || '547b4a51-fc16-4602-b85b-4492d3b3779e';

const O = C.orange, OL = C.orangeLight;

const lbl = (x, y, t, { anchor = 'start', fill = '#fff', op = 0.42, size = 6.2 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter" font-size="${size}" font-weight="600" letter-spacing="0.9" fill="${fill}" opacity="${op}">${t}</text>`;
const txt = (x, y, t, { anchor = 'start', fill = '#fff', op = 0.75, size = 5.2, weight = 500 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter" font-size="${size}" font-weight="${weight}" fill="${fill}" opacity="${op}">${t}</text>`;
const num = (x, y, t, { anchor = 'start', fill = '#fff', op = 1, size = 14, weight = 800 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Montserrat" font-size="${size}" font-weight="${weight}" letter-spacing="-0.4" fill="${fill}" opacity="${op}">${t}</text>`;

// ── 1. COVER ─────────────────────────────────────────────────────
// Claim: Spark itself costs $0, and the spend lands in three places, only two
// of which ever reach an invoice. A round-dotted ghost "$0" source fans into
// three bills; the people bill sits below a dashed rule, in orange, under
// "headcount plan". The closer reuses the three lanes under a control plane.
function drawThreeBills() {
  const sx = 30, sy = 72;
  const bills = [
    { y: 16, title: 'CLOUD BILL', sub: 'VMs, storage, egress' },
    { y: 50, title: 'PLATFORM FEE', sub: 'DBU · CCU · DCU · vCPU-hour' },
    { y: 104, title: 'PEOPLE', sub: 'patching, upgrades, 2am on-call', people: true },
  ];
  const bx = 96, bw = 96, bh = 24;
  let b = '';
  // the $0 source, a ghost
  b += `<rect x="${sx - 22}" y="${sy - 16}" width="44" height="32" rx="4" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="2" stroke-dasharray="1 5" stroke-linecap="round"/>`;
  b += num(sx, sy + 5, '$0', { anchor: 'middle', size: 14 });
  b += lbl(sx, sy + 26, 'APACHE SPARK', { anchor: 'middle', size: 4.6, op: 0.6 });
  b += lbl(sx, sy + 33, 'DOWNLOAD', { anchor: 'middle', size: 4.6, op: 0.6 });
  // branches
  bills.forEach(({ y, people }) => {
    const cy = y + bh / 2;
    b += `<path d="M${sx + 22},${sy} C${sx + 46},${sy} ${bx - 26},${cy} ${bx},${cy}" fill="none" stroke="${people ? O : '#fff'}" stroke-opacity="${people ? 1 : 0.45}" stroke-width="${people ? 3 : 2}"/>`;
  });
  // group labels
  b += lbl(bx, 11, 'ON AN INVOICE', { size: 4.6, op: 0.5 });
  b += `<line x1="${bx}" y1="88" x2="${bx + bw}" y2="88" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="4 5"/>`;
  b += lbl(bx, 99, 'ON A HEADCOUNT PLAN', { size: 4.6, fill: OL, op: 1 });
  // the bills
  bills.forEach(({ y, title, sub, people }) => {
    b += people
      ? `<rect x="${bx}" y="${y}" width="${bw}" height="${bh}" rx="3" fill="${O}" fill-opacity="0.14" stroke="${O}" stroke-width="2.5"/>`
      : `<rect x="${bx}" y="${y}" width="${bw}" height="${bh}" rx="3" fill="#14110d" stroke="#fff" stroke-opacity="0.45" stroke-width="2"/>`;
    b += lbl(bx + 7, y + 10, title, { size: 5.4, op: 0.95, fill: people ? OL : '#fff' });
    b += txt(bx + 7, y + 18.5, sub, { size: 4.8, op: 0.6 });
  });
  b += num(10, 150, 'Two of three bills reach an invoice', { size: 11.5 });
  return svg(200, 154, b, 856);
}

// ── 2. ONE JOB, LINE BY LINE ─────────────────────────────────────
// Claim: run the same job both ways and the fee term drops to $0 on one side
// while the people term shrinks, rarely to zero, on the other. Two stacked
// bars on one dollar scale: the solid segments are the blog's EC2 and EMR
// figures for 5 x m5.4xlarge for 3 hours; the people and idle segments are
// dashed because the blog leaves them reader-supplied.
function drawJobStack() {
  const x0 = 10, k = 100 / 11.52, bh = 20;
  const comp = 11.52 * k, fee = 2.88 * k;
  let b = '';
  const dashed = (x, y, w, label) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${bh}" rx="2" fill="none" stroke="#fff" stroke-opacity="0.5" stroke-width="1.5" stroke-dasharray="3 3"/>` +
    lbl(x + w / 2, y + 12.5, label, { anchor: 'middle', size: 4.4, op: 0.6 });
  const computeBar = (y) =>
    `<rect x="${x0}" y="${y}" width="${comp}" height="${bh}" rx="2" fill="#fff" fill-opacity="0.82"/>` +
    txt(x0 + 6, y + 12.8, '$11.52 EC2 COMPUTE', { size: 5.2, fill: '#14110d', op: 1, weight: 700 });

  // self-managed
  const y1 = 26;
  b += lbl(x0, y1 - 8, 'SELF-MANAGED SPARK', { size: 5.2, op: 0.8 });
  b += computeBar(y1);
  b += `<line x1="${x0 + comp + 1}" y1="${y1 - 4}" x2="${x0 + comp + 1}" y2="${y1 + bh + 4}" stroke="${OL}" stroke-width="1.5" stroke-dasharray="1 3" stroke-linecap="round"/>`;
  b += lbl(x0 + comp + 1, y1 + bh + 11, '$0 FEE', { anchor: 'middle', size: 4.6, fill: OL, op: 1 });
  b += dashed(x0 + comp + 4, y1, 48, 'PEOPLE');
  b += dashed(x0 + comp + 55, y1, 20, 'IDLE');

  // EMR
  const y2 = 86;
  b += lbl(x0, y2 - 8, 'AMAZON EMR ON EC2', { size: 5.2, op: 0.8 });
  b += computeBar(y2);
  b += `<rect x="${x0 + comp}" y="${y2}" width="${fee}" height="${bh}" rx="2" fill="${O}"/>`;
  b += txt(x0 + comp + fee / 2, y2 + 12.8, '$2.88', { anchor: 'middle', size: 5.4, fill: '#fff', op: 1, weight: 700 });
  b += lbl(x0 + comp + fee / 2, y2 + bh + 11, 'EMR FEE', { anchor: 'middle', size: 4.6, fill: OL, op: 1 });
  b += dashed(x0 + comp + fee + 3, y2, 29, 'PEOPLE');
  b += dashed(x0 + comp + fee + 35, y2, 19, 'IDLE');
  b += num(x0, y2 + bh + 30, '$14.40', { size: 14 });
  b += lbl(x0 + 50, y2 + bh + 24, 'ON THE INVOICE,', { size: 4.6, op: 0.55 });
  b += lbl(x0 + 50, y2 + bh + 31, 'BEFORE PEOPLE AND IDLE', { size: 4.6, op: 0.55 });

  b += `<line x1="${x0}" y1="148" x2="190" y2="148" stroke="#fff" stroke-opacity="0.12" stroke-width="1"/>`;
  b += lbl(x0, 157, 'SAME JOB · 5 × M5.4XLARGE NODES FOR 3 HOURS', { size: 4.2, op: 0.5 });
  b += lbl(x0, 165, 'EMR PRICING PAGE, READ 2026-10-09', { size: 4.2, op: 0.5 });
  b += lbl(x0, 173, 'DASHED = READER-SUPPLIED · WIDTHS ILLUSTRATIVE', { size: 4.2, op: 0.5 });
  return svg(200, 176, b, 856);
}

// ── 3. WHO WINS WHERE ────────────────────────────────────────────
// Claim: team size and load shape decide build vs buy. A two-axis field:
// each winning zone is drawn with its own load trace and its own head of
// people dots, so the corners read without labels. A dashed diagonal joins
// them: mixed estates are normal.
function drawWhoWins() {
  const ax = 22, ay = 142;
  let b = '';
  b += `<g stroke="#fff" stroke-opacity="0.3" stroke-width="1.5">
    <line x1="${ax}" y1="${ay}" x2="194" y2="${ay}"/><line x1="${ax}" y1="${ay}" x2="${ax}" y2="6"/></g>`;
  b += lbl(194, ay + 11, 'PLATFORM TEAM SIZE →', { anchor: 'end', size: 4.6, op: 0.55 });
  b += lbl(ax, ay + 11, 'SMALL', { size: 4.4, op: 0.4 });
  b += `<text transform="translate(${ax - 6},${ay}) rotate(-90)" font-family="Inter" font-size="4.6" font-weight="600" letter-spacing="0.9" fill="#fff" opacity="0.55">UTILIZATION: SPIKY → STEADY</text>`;

  // top right: self-managed
  const tr = { x: 114, y: 6, w: 80, h: 58 };
  b += `<rect x="${tr.x}" y="${tr.y}" width="${tr.w}" height="${tr.h}" rx="4" fill="#fff" fill-opacity="0.04" stroke="#fff" stroke-opacity="0.5" stroke-width="2"/>`;
  b += lbl(tr.x + 6, tr.y + 10, 'SELF-MANAGED SPARK', { size: 4.6, op: 0.95 });
  b += txt(tr.x + 6, tr.y + 17.5, 'Kubernetes or YARN', { size: 4.6, op: 0.6 });
  b += `<path d="M${tr.x + 6},${tr.y + 30} L${tr.x + 20},${tr.y + 29} L${tr.x + 34},${tr.y + 30.5} L${tr.x + 48},${tr.y + 29} L${tr.x + 62},${tr.y + 30} L${tr.x + 78},${tr.y + 29.5}" fill="none" stroke="#fff" stroke-opacity="0.85" stroke-width="2.5" stroke-linejoin="round"/>`;
  b += `<g fill="#fff" fill-opacity="0.75">`;
  for (let i = 0; i < 12; i++) b += `<circle cx="${tr.x + 8 + i * 5.8}" cy="${tr.y + 42}" r="2"/>`;
  b += `</g>`;
  b += txt(tr.x + 6, tr.y + 54, 'Headcount already sunk', { size: 4.4, op: 0.6 });

  // bottom left: managed serverless
  const bl = { x: 28, y: 82, w: 80, h: 56 };
  b += `<rect x="${bl.x}" y="${bl.y}" width="${bl.w}" height="${bl.h}" rx="4" fill="${O}" fill-opacity="0.1" stroke="${O}" stroke-width="2.5"/>`;
  b += lbl(bl.x + 6, bl.y + 10, 'MANAGED SERVERLESS', { size: 4.6, fill: OL, op: 1 });
  b += txt(bl.x + 6, bl.y + 17.5, 'EMR or Dataproc Serverless', { size: 4.6, op: 0.6 });
  b += `<path d="M${bl.x + 6},${bl.y + 36} L${bl.x + 14},${bl.y + 36} L${bl.x + 18},${bl.y + 22} L${bl.x + 22},${bl.y + 36} L${bl.x + 38},${bl.y + 36} L${bl.x + 42},${bl.y + 25} L${bl.x + 46},${bl.y + 36} L${bl.x + 60},${bl.y + 36} L${bl.x + 63},${bl.y + 21} L${bl.x + 67},${bl.y + 36} L${bl.x + 78},${bl.y + 36}" fill="none" stroke="${OL}" stroke-width="2.5" stroke-linejoin="round"/>`;
  b += `<g fill="${OL}">`;
  for (let i = 0; i < 2; i++) b += `<circle cx="${bl.x + 8 + i * 6.3}" cy="${bl.y + 44}" r="2"/>`;
  b += `</g>`;
  b += txt(bl.x + 6, bl.y + 53, 'Bills usage, no cluster to size', { size: 4.4, op: 0.6 });

  // mixed estates: the dashed diagonal between the zones
  b += `<line x1="${bl.x + bl.w - 6}" y1="${bl.y - 2}" x2="${tr.x + 6}" y2="${tr.y + tr.h + 2}" stroke="#fff" stroke-opacity="0.45" stroke-width="1.5" stroke-dasharray="1 4" stroke-linecap="round"/>`;
  b += lbl(118, 80, 'MIXED ESTATES', { size: 4.6, op: 0.6 });
  b += lbl(118, 87, 'ARE NORMAL', { size: 4.6, op: 0.6 });
  return svg(200, 158, b, 856);
}

// ── 4. THE EXPENSIVE FEW ─────────────────────────────────────────
// Claim: in an estate of 900 jobs where three are the bulk of the bill, moving
// three captures most of the saving. 900 marks actually drawn, three orange,
// with leaders down to a bill bar whose orange share they own. The blog gives
// the scenario, not the split, so the bar is labelled illustrative.
function drawExpensiveFew() {
  const cols = 45, rows = 20, p = 4, gx = 10, gy = 16;
  const hot = [[7, 4], [26, 13], [38, 7]];
  const isHot = (c, r) => hot.some(([hc, hr]) => hc === c && hr === r);
  let b = `<g fill="#fff" fill-opacity="0.3">`;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
    if (!isHot(c, r)) b += `<rect x="${gx + c * p}" y="${gy + r * p}" width="2.6" height="2.6" rx="0.5"/>`;
  b += `</g>`;
  hot.forEach(([c, r]) => {
    b += `<rect x="${gx + c * p - 0.9}" y="${gy + r * p - 0.9}" width="4.4" height="4.4" rx="0.8" fill="${O}"/>`;
  });
  const gh = rows * p;
  b += lbl(gx, gy - 6, '900 JOBS IN THE ESTATE', { size: 4.8, op: 0.6 });

  // the bill
  const by = 124, bw = 180, share = 0.7;
  hot.forEach(([c, r], i) => {
    const tx = gx + bw * share * (i + 0.5) / 3;
    b += `<path d="M${gx + c * p + 1.3},${gy + r * p + 3.5} L${tx},${by - 1}" fill="none" stroke="${O}" stroke-opacity="0.55" stroke-width="1.2"/>`;
  });
  b += `<rect x="${gx}" y="${by}" width="${bw * share}" height="16" rx="2" fill="${O}"/>`;
  b += `<rect x="${gx + bw * share}" y="${by}" width="${bw * (1 - share)}" height="16" rx="2" fill="#fff" fill-opacity="0.18"/>`;
  b += lbl(gx + 6, by + 10.5, '3 JOBS', { size: 5, op: 1 });
  b += lbl(gx + bw - 6, by + 10.5, '897 JOBS', { anchor: 'end', size: 5, op: 0.8 });
  b += lbl(gx, by + 27, 'THE COMPUTE BILL · ILLUSTRATIVE SPLIT', { size: 4.6, op: 0.5 });
  return svg(200, 156, b, 856);
}

// ── 5. CLOSER ────────────────────────────────────────────────────
// Bookend: the cover's three bills come back as three lanes fed by a Yeedu
// control plane inside the customer's own account. Cloud bill paid direct with
// no uplift; the platform fee is a flat orange line beside EMR's metered fee
// ($2.88 to $28.80 at ten times the runs, from the blog); platform
// engineering tasks come with the control plane. No Yeedu dollar figure.
function drawControlPlaneLanes() {
  let b = '';
  b += `<rect x="4" y="6" width="192" height="122" rx="5" fill="none" stroke="#fff" stroke-opacity="0.4" stroke-width="1.5" stroke-dasharray="4 4"/>`;
  b += lbl(10, 16, 'YOUR CLOUD ACCOUNT OR ON-PREM', { size: 4.6, op: 0.55 });
  // control plane
  b += `<rect x="12" y="52" width="40" height="44" rx="4" fill="${O}" fill-opacity="0.14" stroke="${O}" stroke-width="2.5"/>`;
  b += lbl(32, 69, 'YEEDU', { anchor: 'middle', size: 5.4, fill: OL, op: 1 });
  b += lbl(32, 77, 'CONTROL', { anchor: 'middle', size: 4.6, op: 0.75 });
  b += lbl(32, 84, 'PLANE', { anchor: 'middle', size: 4.6, op: 0.75 });
  const lanes = [40, 74, 108];
  lanes.forEach((y) => {
    b += `<path d="M52,74 C60,74 58,${y} 66,${y}" fill="none" stroke="#fff" stroke-opacity="0.4" stroke-width="2"/>`;
  });
  // lane 1: cloud bill
  let y = lanes[0];
  b += lbl(68, y - 8, 'CLOUD BILL', { size: 5, op: 0.95 });
  b += `<g fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="1.5">`;
  for (let i = 0; i < 5; i++) b += `<rect x="${68 + i * 9}" y="${y - 3}" width="7" height="7" rx="1"/>`;
  b += `</g>`;
  b += `<line x1="116" y1="${y + 0.5}" x2="126" y2="${y + 0.5}" stroke="#fff" stroke-opacity="0.6" stroke-width="2"/>`;
  b += txt(128, y + 2.5, 'billed by your cloud,', { size: 4.6, op: 0.75 });
  b += txt(128, y + 9, 'no platform uplift', { size: 4.6, op: 0.75 });
  // lane 2: platform fee
  y = lanes[1];
  b += lbl(68, y - 8, 'PLATFORM FEE', { size: 5, op: 0.95 });
  b += `<line x1="70" y1="${y + 8}" x2="128" y2="${y - 6}" stroke="#fff" stroke-opacity="0.55" stroke-width="1.5" stroke-dasharray="1 3" stroke-linecap="round"/>`;
  b += `<line x1="70" y1="${y + 8}" x2="128" y2="${y + 8}" stroke="${O}" stroke-width="3"/>`;
  b += txt(132, y - 3, 'EMR fee $2.88 → $28.80', { size: 4.6, op: 0.6 });
  b += txt(132, y + 3.5, 'at 10× the runs', { size: 4.6, op: 0.6 });
  b += txt(132, y + 10, 'Yeedu tier: flat', { size: 4.6, fill: OL, op: 1, weight: 700 });
  // lane 3: platform engineering
  y = lanes[2];
  b += lbl(68, y - 8, 'PLATFORM ENGINEERING', { size: 5, op: 0.95 });
  b += txt(68, y + 2, 'auto start and stop · autoscaling', { size: 4.6, op: 0.75 });
  b += txt(68, y + 9, 'multi-version Spark · per-run usage metering', { size: 4.6, op: 0.75 });
  return svg(200, 132, b, 820);
}

// ── slides ───────────────────────────────────────────────────────
const qr = BLOG_URL ? await makeQr(BLOG_URL, 150) : '';
const CTA = 'Price your costliest job on Yeedu';
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
    notes: 'Cover — claim: Apache Spark costs nothing to download; spend lands in the cloud bill, the platform fee, and the salaries of the people keeping the cluster up, and only the first two reach an invoice. Ghost $0 source fanning into three bills, people bill orange below a dashed rule (lanes return on the closer)',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Spark total cost of ownership')}
      ${headline(`Free Spark still sends ${em('three bills')}`, 52)}
      ${well(drawThreeBills(), { card: false })}
      ${caption(`Patching, upgrades and on-call never show up on a cloud invoice, so the rate card undercounts. A platform with a higher sticker price can be cheaper to run for a year once engineering time is priced in.`)}
    `, 'A'),
  },
  {
    notes: 'Per-job TCO — claim: cost_per_job = compute + platform fee + storage/egress + loaded headcount ÷ job runs; on self-managed the fee is $0, on EMR it is $2.88 on $11.52 of EC2 ($14.40) for 5 x m5.4xlarge for 3 hours (blog, EMR pricing page read 2026-10-09). People and idle drawn dashed, widths illustrative. Two stacked bars on one dollar scale, fee segment orange',
    html: stage(`
      ${eyebrow('Per-job TCO')}
      ${headline('One Spark job, priced line by line', 50)}
      ${well(drawJobStack())}
      ${caption(`Add compute, any platform fee, storage and egress, then a share of loaded headcount per job run. Self-managed drops the fee to $0. A managed platform shrinks the people term, rarely to zero.`)}
    `, 'C'),
  },
  {
    notes: 'Build vs buy — claim: self-managed wins with an existing platform team and high, steady utilization; managed serverless (EMR/Dataproc Serverless) wins with small teams and spiky load; mixed estates are normal. Two-axis field, each zone carrying its own load trace and people count, serverless zone orange, dotted diagonal between',
    html: stage(`
      ${eyebrow('Build vs buy')}
      ${headline('Team size and load shape pick the winner', 44)}
      ${well(drawWhoWins(), { card: false })}
      ${caption(`Self-managed fits data-residency limits too. A managed platform suits a team that needs production in days, since standing up a cluster, catalog and monitoring stack from scratch takes weeks.`)}
    `, 'B'),
  },
  {
    notes: 'Job by job — claim: in an estate of 900 jobs where three are the bulk of the bill, move the expensive few and leave the rest in place (blog decision table). 900 drawn marks, three orange with leaders to an orange bill share; split labelled illustrative',
    html: stage(`
      ${eyebrow('Run each job where it is cheapest')}
      ${headline('Move three jobs, leave the other 897', 48)}
      ${well(drawExpensiveFew())}
      ${caption(`Per-job cost varies more than per-platform cost. A reversible test on three jobs is easier to approve than a migration, and it produces real cost data first.`)}
    `, 'D'),
  },
  {
    notes: 'Closer — claim: Yeedu is a control plane deployed in the customer\'s own cloud account or on-prem; VMs are billed by the cloud with no uplift, the platform fee is a fixed annual licence tier that stays flat while EMR\'s fee goes $2.88 → $28.80 at 10x the runs (blog), and auto start/stop, autoscaling, multi-version Spark and usage metering come with the control plane. YCU: 16 vCPU / 64 GB node = 10.4 YCU/hr. Bookend of the cover\'s three bills. CTA pill + sales@yeedu.com, no QR (no blog URL yet)',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Yeedu')}
      ${headline('Your cloud account, a flat licence', 50)}
      ${well(drawControlPlaneLanes(), { card: false })}
      ${caption(`Data stays in your account. Usage is metered in YCU, so a 16 vCPU, 64 GB node is 10.4 YCU an hour on AWS, Azure, GCP, OCI or on-prem. Start with the jobs that dominate the bill and leave the catalog and DAGs where they are.`)}
      ${cta}
    `, 'C'),
  },
];

const NAME = 'Self-Managed Spark vs Commercial Spark Platforms: The True Cost';

if (OLD_ID) await deleteCarousel(OLD_ID);
const id = await buildCarousel(NAME, slides);
if (!process.env.SKIP_EXPORT) await exportDeck(id, NAME);
