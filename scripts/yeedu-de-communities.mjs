// ════════════════════════════════════════════════════════════════
// Top 7 Data Engineering Communities to Join in 2026
//
// 5 slides, 4:5. The article's argument: seven free, active, technical
// communities, grouped by what you need from them; pick by the problem you
// have this week; a well-formed question gets answered. No member counts on
// the slides (they come from each community's own page and age fast). Yeedu
// only on the closer, which also says no community is affiliated with Yeedu.
// QR to the live blog on the closer.
// ════════════════════════════════════════════════════════════════
import { C, stage, logoMark, eyebrow, headline, caption, well, svg, makeQr, ctaPill, buildCarousel, deleteCarousel, exportDeck } from './yeedu-chrome.mjs';
import { O, OL, MONO, em2, lbl, txt, card, arrow, points } from './yeedu-deck-parts.mjs';

const OLD_ID = process.env.OLD_ID || '';
const BLOG_URL = 'https://yeedu.com/blog/top-data-engineering-communities';

// ── 1. COVER: four groups, seven communities ─────────────────────
function drawGroups() {
  const groups = [
    ['BROAD DISCUSSION', ['r/dataengineering']],
    ['SPARK PROJECT', ['Mailing lists, Stack Overflow, JIRA']],
    ['TOOLS + TABLE FORMATS', ['dbt Slack', 'Airflow Slack', 'Delta + Iceberg Slacks']],
    ['LEARNING + MENTORSHIP', ['DataTalks.Club', 'Data Engineer Things']],
  ];
  let b = '';
  let y = 2;
  groups.forEach(([k, items], gi) => {
    b += lbl(4, y + 6, k, { size: 4.2, op: 1, fill: OL });
    let x = 4;
    items.forEach((t) => {
      const w = t.length * 2.55 + 12;
      b += `<rect x="${x}" y="${y + 9}" width="${w}" height="13" rx="6.5" fill="#fff" fill-opacity="0.08" stroke="#fff" stroke-opacity="0.3" stroke-width="0.6"/>`;
      b += txt(x + w / 2, y + 17.6, t, { anchor: 'middle', size: 4.6, op: 1, weight: 600 });
      x += w + 4;
    });
    y += 29;
  });
  return svg(200, y, b, 856);
}

// ── 2. THE SEVEN AT A GLANCE ─────────────────────────────────────
function drawTable() {
  const rows = [
    ['r/dataengineering', 'Reddit', 'Career, tooling, second opinions', 2],
    ['Spark project channels', 'List, SO, JIRA', 'Core Spark bugs, releases', 3],
    ['dbt Community', 'Slack + forum', 'Incremental models', 1],
    ['Airflow Slack', 'Slack', 'DAGs, retries, scheduling', 2],
    ['Delta + Iceberg', 'Two Slacks', 'Table-format internals', 3],
    ['DataTalks.Club', 'Slack + course', 'Learning fundamentals', 2],
    ['Data Engineer Things', 'Slack, Medium', 'Mentors, webinars, meetups', 2],
  ];
  let b = '';
  const x0 = 4, c1 = 62, c2 = 98, c3 = 176, rh = 19, y0 = 16;
  b += lbl(x0, 10, 'COMMUNITY', { size: 4, op: 0.55 });
  b += lbl(c1, 10, 'WHERE', { size: 4, op: 0.55 });
  b += lbl(c2, 10, 'BEST FOR', { size: 4, op: 0.8 });
  b += lbl(c3, 10, 'SPARK', { size: 4, op: 1, fill: OL });
  rows.forEach(([k, p, f, d], i) => {
    const y = y0 + i * rh;
    if (i % 2 === 0) b += `<rect x="${x0 - 2}" y="${y - 1}" width="198" height="${rh - 1}" rx="2" fill="#fff" fill-opacity="0.04"/>`;
    b += txt(x0, y + 10.5, k, { size: 4.5, op: 1, weight: 700 });
    b += txt(c1, y + 10.5, p, { size: 3.9, op: 0.65 });
    b += txt(c2, y + 10.5, f, { size: 4.1, op: 0.85 });
    for (let j = 0; j < 3; j++) b += `<circle cx="${c3 + 2 + j * 6}" cy="${y + 9}" r="2.1" fill="${j < d ? O : '#fff'}" fill-opacity="${j < d ? 1 : 0.15}"/>`;
  });
  b += txt(196, y0 + 7 * rh + 6, 'All seven are free to join', { anchor: 'end', size: 4.2, op: 0.9, fill: OL });
  return svg(200, y0 + 7 * rh + 9, b, 856);
}

// ── 3. PICK BY THE PROBLEM ───────────────────────────────────────
function drawPick() {
  const rows = [
    ['New to data engineering', 'DataTalks.Club + Zoomcamp'],
    ['Slow or failing Spark job', 'Spark mailing list, Stack Overflow'],
    ['DAG will not run', 'Airflow #user-troubleshooting'],
    ['Compaction, manifests, schema', 'Delta or Iceberg Slack'],
    ['dbt model performance', 'dbt Community forum'],
    ['Is this bill normal?', 'r/dataengineering'],
    ['Peers and mentors', 'Data Engineer Things'],
  ];
  let b = '';
  const rh = 19;
  b += lbl(4, 9, 'IF YOU ARE STUCK ON', { size: 4, op: 0.55 });
  b += lbl(108, 9, 'START HERE', { size: 4, op: 1, fill: OL });
  rows.forEach(([a, z], i) => {
    const y = 14 + i * rh;
    b += card(2, y, 92, rh - 3, a, '', { titleSize: 4.5 });
    b += arrow(96, y + (rh - 3) / 2, 104, y + (rh - 3) / 2, { op: 0.6, color: OL });
    b += txt(108, y + (rh - 3) / 2 + 1.6, z, { size: 4.5, op: 1, fill: OL, weight: 600 });
  });
  return svg(200, 14 + 7 * rh, b, 856);
}

// ── 4. HOW TO ASK ────────────────────────────────────────────────
function drawAsk() {
  const fields = [
    ['Spark version', '3.5.1, 8x r5.2xlarge'],
    ['Expected', 'join done in under 2 min'],
    ['Happened', '1 task straggles at 99/100'],
    ['Plan', 'df.explain(True), full output'],
    ['Error', 'the full trace, in backticks'],
    ['Already tried', 'broadcast hint, 400 partitions'],
  ];
  let b = '';
  b += `<rect x="2" y="2" width="196" height="${12 + fields.length * 14}" rx="4" fill="#000" fill-opacity="0.3" stroke="#fff" stroke-opacity="0.18" stroke-width="0.6"/>`;
  b += lbl(8, 11, 'A QUESTION THAT GETS ANSWERED', { size: 4, op: 1, fill: OL });
  fields.forEach(([k, v], i) => {
    const y = 23 + i * 14;
    b += txt(8, y, k + ':', { size: 4.4, op: 1, weight: 700, family: MONO });
    b += txt(66, y, v, { size: 4.4, op: 0.75, family: MONO });
  });
  const habits = ['Search history first', 'Code, not screenshots', 'State the version', 'One thread per question'];
  const hy = 104;
  habits.forEach((h, i) => {
    const x = 2 + (i % 2) * 99, y = hy + Math.floor(i / 2) * 18;
    b += card(x, y, 97, 15, h, '', { hot: true, titleSize: 4.5 });
  });
  return svg(200, hy + 36, b, 856);
}

const qr = await makeQr(BLOG_URL, 140);
const closerCta = `<div style="display:flex;align-items:center;justify-content:space-between;gap:28px;margin-top:30px;padding-top:28px;border-top:1px solid ${C.rule};">
  <div style="display:flex;flex-direction:column;gap:16px;">
    ${ctaPill('Talk to Yeedu')}
    <div style="display:flex;flex-direction:column;gap:6px;font-size:22px;color:${C.text2};font-weight:500;">
      <span>sales@yeedu.com</span><span>yeedu.com</span></div>
  </div>
  <div style="display:flex;align-items:center;gap:18px;">
    <div style="font-size:20px;color:${C.text2};text-align:right;line-height:1.35;">Read the<br/>full guide</div>
    ${qr}
  </div>
</div>`;

const slides = [
  {
    notes: 'Cover: the seven communities in four groups. Free, active, technical, relevant to Spark and lakehouse work',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Data engineering communities')}
      ${headline(`Seven communities ${em2('worth joining in 2026')}`, 56)}
      ${well(drawGroups(), { card: false })}
      ${caption(`Each one is free, active through 2026 and built around technical depth. Vendor forums that exist to sell one product were left out on purpose.`)}
    `, 'A'),
  },
  {
    notes: "The seven at a glance from the article's comparison table: platform, best for, Spark depth (low/medium/high as dots)",
    html: stage(`
      ${eyebrow('At a glance')}
      ${headline(`Where each one ${em2('is strongest')}`, 56)}
      ${well(drawTable(), { pad: 26 })}
      ${caption(`Spark depth runs from low to high. The Spark project channels and the table-format Slacks sit closest to the people who write the code.`)}
    `, 'B'),
  },
  {
    notes: 'Pick by the problem in front of you this week, from the article role guide',
    html: stage(`
      ${eyebrow('Which one first')}
      ${headline(`Pick by the problem ${em2('you have this week')}`, 54)}
      ${well(drawPick(), { pad: 26 })}
      ${caption(`A platform lead sizing up a migration needs a different room than an engineer stuck on a FetchFailedException at 11pm.`)}
    `, 'C'),
  },
  {
    notes: "How to ask: the article's question template fields plus the four habits that carry across every workspace",
    html: stage(`
      ${eyebrow('Getting an answer')}
      ${headline(`Ask so a volunteer ${em2('can answer in one pass')}`, 52)}
      ${well(drawAsk(), { pad: 26 })}
      ${caption(`"My job is slow, help" gets ignored almost everywhere. A minimal reproducible example often gets answered within the hour.`)}
    `, 'D'),
  },
  {
    notes: 'Closer: the two threads these communities keep returning to (slow Spark jobs, a rising bill) and what Yeedu does about each. Not affiliated with any community. CTA + QR to the blog',
    html: stage(`
      ${logoMark(32)}
      ${eyebrow('Yeedu')}
      ${headline(`Slow jobs and rising bills ${em2('the two threads that never end')}`, 50)}
      ${points([
        ['bolt', 'Existing Spark code runs faster on every job type, 4-10x on CPU-bound joins and aggregations, with zero code changes.'],
        ['wallet', 'A fixed annual licence with unlimited usage. More jobs add no platform fee.'],
        ['steps', 'Runs in your own cloud account, adopted one job at a time. No community on this list is affiliated with Yeedu.'],
      ])}
      ${closerCta}
    `, 'C'),
  },
];

const NAME = 'Top 7 Data Engineering Communities to Join in 2026';

if (OLD_ID) await deleteCarousel(OLD_ID);
const id = await buildCarousel(NAME, slides);
if (!process.env.SKIP_EXPORT) await exportDeck(id, NAME);
