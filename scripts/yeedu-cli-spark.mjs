// ════════════════════════════════════════════════════════════════
// Run A Spark Job From The Command Line
// Source: https://yeedu.com/blog/run-spark-job-from-command-line
//
// 5 slides, 4:5. One bespoke drawing per slide — no shared renderer
// map, and no drawing shared with the CDC or observability decks.
//
// Visual argument: the cover splits one destination into two routes
// of very different length; the closer collapses them back onto one
// control plane. Everything between is why the short route is safe.
// ════════════════════════════════════════════════════════════════
import {
  C, stage, logoMark, eyebrow, headline, em, caption, well, svg, annot,
  makeQr, ctaPill, buildCarousel, deleteCarousel, exportDeck,
} from './yeedu-chrome.mjs';

const BLOG_URL = 'https://yeedu.com/blog/run-spark-job-from-command-line';
const OLD_ID = '6828580a-0e08-4ddc-9de8-b0a0cdfeb24f';   // set to the previous deck's id to replace it

const O = C.orange, OL = C.orangeLight;

// ── 1. COVER ─────────────────────────────────────────────────────
// Claim: same destination, two routes. Drawn as stop count — five boxes
// against one. The eye reads "many hops vs none" before any label.
function drawTwoRoutes() {
  let b = '';

  // column headers
  b += `<text x="52" y="12" text-anchor="middle" font-family="Inter" font-size="6" font-weight="600" letter-spacing="0.9" fill="#fff" opacity="0.42">UI CONSOLE</text>`;
  b += `<text x="52" y="20" text-anchor="middle" font-family="Inter" font-size="6" font-weight="500" fill="#fff" opacity="0.3">several minutes</text>`;
  b += `<text x="150" y="12" text-anchor="middle" font-family="Inter" font-size="6" font-weight="600" letter-spacing="0.9" fill="${OL}">YEEDU CLI</text>`;
  b += `<text x="150" y="20" text-anchor="middle" font-family="Inter" font-size="6" font-weight="500" fill="${OL}" opacity="0.75">seconds</text>`;

  // left route — five stops, each trailing a page load
  const steps = ['WORKSPACE', 'CLUSTER', 'START JOB', 'REFRESH', 'LOGS'];
  steps.forEach((s, i) => {
    const y = 26 + i * 19;
    b += `<rect x="29" y="${y}" width="46" height="12" rx="2.5" fill="#fff" fill-opacity="0.05" stroke="#fff" stroke-opacity="0.22" stroke-width="1"/>`;
    b += `<text x="52" y="${y + 8}" text-anchor="middle" font-family="Inter" font-size="5" font-weight="600" letter-spacing="0.4" fill="#fff" opacity="0.6">${s}</text>`;
    if (i < steps.length - 1) {
      // the gap between stops is the page load, drawn as waiting dots
      b += `<line x1="52" y1="${y + 12}" x2="52" y2="${y + 19}" stroke="#fff" stroke-opacity="0.18" stroke-width="1" stroke-dasharray="1.5 2"/>`;
      [0, 1, 2].forEach(d => {
        b += `<circle cx="${60 + d * 3.2}" cy="${y + 15.5}" r="0.9" fill="#fff" fill-opacity="0.22"/>`;
      });
    }
  });
  b += `<line x1="52" y1="114" x2="52" y2="122" stroke="#fff" stroke-opacity="0.18" stroke-width="1" stroke-dasharray="1.5 2"/>`;

  // right route — one command, one uninterrupted line
  b += `<rect x="112" y="26" width="76" height="12" rx="2.5" fill="${O}" fill-opacity="0.18" stroke="${O}" stroke-width="1.2"/>`;
  b += `<text x="150" y="34.2" text-anchor="middle" font-family="monospace" font-size="4.6" fill="${OL}" textLength="66" lengthAdjust="spacingAndGlyphs">yeedu job start --follow</text>`;
  b += `<line x1="150" y1="38" x2="150" y2="122" stroke="${O}" stroke-width="2"/>`;
  b += `<polygon points="150,122 147.4,117 152.6,117" fill="${O}"/>`;

  // shared destination
  b += `<rect x="40" y="122" width="120" height="16" rx="8" fill="${O}" fill-opacity="0.16" stroke="${O}" stroke-width="1.2"/>`;
  b += `<text x="100" y="132.6" text-anchor="middle" font-family="Inter" font-size="6.4" font-weight="600" letter-spacing="1" fill="${OL}">JOB RUNNING</text>`;

  b += annot(14, 152, {
    label: 'SAME DESTINATION, FIVE FEWER STOPS',
    value: 'one command',
    note: 'the CLI calls the same APIs the console does',
  });
  return svg(200, 190, b);
}

// ── 2. THE UI TAX ────────────────────────────────────────────────
// Claim: the work is a sliver; the rest is navigation and page loads.
// Drawn as area — only the orange segment is the thing you wanted to do.
function drawUiTax() {
  const x0 = 40, span = 146;
  // each row sums to `span`; only 'act' is the actual work
  const rows = [
    ['CREATE CLUSTER', [26, 40, 10, 34, 36]],
    ['START JOB',      [30, 36,  8, 38, 34]],
    ['CHECK STATUS',   [22, 30,  6, 44, 44]],
    ['FETCH LOGS',     [34, 42,  9, 31, 30]],
  ];
  const ACT = 2;   // index of the work segment within each row

  let b = '';
  // legend — the dim swatch needs naming, the orange one is named by the CLI row
  b += `<rect x="40" y="5" width="8" height="6" rx="1.5" fill="#fff" fill-opacity="0.12"/>`;
  b += `<text x="52" y="10.2" font-family="Inter" font-size="5.6" font-weight="600" letter-spacing="0.8" fill="#fff" opacity="0.38">NAVIGATE · PAGE LOAD · REFRESH</text>`;

  rows.forEach(([label, segs], r) => {
    const y = 30 + r * 20;
    b += `<text x="40" y="${y - 4}" font-family="Inter" font-size="6" font-weight="600" letter-spacing="0.8" fill="#fff" opacity="0.55">${label}</text>`;
    let cx = x0;
    segs.forEach((w, i) => {
      const isAct = i === ACT;
      b += `<rect x="${cx.toFixed(1)}" y="${y}" width="${(w - 1).toFixed(1)}" height="11" rx="1.5" fill="${isAct ? O : '#fff'}" fill-opacity="${isAct ? 1 : 0.1}"/>`;
      cx += w;
    });
  });

  // the same four actions, one command each — the stub is the whole bar
  b += `<text x="40" y="110" font-family="Inter" font-size="6" font-weight="600" letter-spacing="0.8" fill="${OL}">ONE CLI COMMAND</text>`;
  b += `<rect x="40" y="114" width="10" height="11" rx="1.5" fill="${O}"/>`;
  // the dash stops short of the label — at size 6 that string is ~77 units wide, so a line
  // running to 186 would be struck straight through it.
  b += `<line x1="50" y1="119.5" x2="104" y2="119.5" stroke="#fff" stroke-opacity="0.12" stroke-width="1" stroke-dasharray="2 3"/>`;
  b += `<text x="186" y="121.8" text-anchor="end" font-family="Inter" font-size="6" font-weight="500" fill="#fff" opacity="0.3">no navigation, no reload</text>`;

  b += annot(14, 142, {
    label: 'WHAT THE CONSOLE ACTUALLY SPENDS',
    value: 'minutes → seconds',
    note: 'the orange slice is the only part that was the job',
  });
  return svg(200, 180, b);
}

// ── 3. ANATOMY OF THE COMMAND ────────────────────────────────────
// Claim: the whole workflow is one line. Drawn as a labelled dissection —
// textLength pins the glyph advance so the leaders land on the right tokens.
function drawCommandAnatomy() {
  const CMD = 'yeedu job start --job_id 1 --workspace_id 1 --follow';
  const cx0 = 20, len = 162, cw = len / CMD.length;
  const at = i => cx0 + i * cw;

  let b = '';
  // terminal chrome
  b += `<rect x="8" y="24" width="184" height="34" rx="5" fill="#fff" fill-opacity="0.05" stroke="#fff" stroke-opacity="0.1" stroke-width="1"/>`;
  [16, 22, 28].forEach(d => {
    b += `<circle cx="${d}" cy="32" r="1.5" fill="#fff" fill-opacity="0.18"/>`;
  });
  b += `<text x="13" y="50" font-family="monospace" font-size="5.2" fill="${O}">$</text>`;
  b += `<text x="${cx0}" y="50" font-family="monospace" font-size="5.2" fill="#fff" textLength="${len}" lengthAdjust="spacingAndGlyphs">${CMD}</text>`;
  // the flag the next slide is about
  b += `<line x1="${at(44).toFixed(1)}" y1="53.5" x2="${at(52).toFixed(1)}" y2="53.5" stroke="${O}" stroke-width="1.4"/>`;

  // leaders, staggered so the labels cannot collide
  const pins = [
    [at(16), 68,  74,  'start', 'WHICH JOB'],
    [at(27), 82,  88,  'start', 'WHICH WORKSPACE'],
    [at(44), 96, 100,  'end',   'STREAMS UNTIL IT ENDS'],
  ];
  pins.forEach(([px, dropTo, ty, anchor, label]) => {
    const lx = px + 4;
    b += `<line x1="${lx.toFixed(1)}" y1="58" x2="${lx.toFixed(1)}" y2="${dropTo}" stroke="#fff" stroke-opacity="0.22" stroke-width="1"/>`;
    b += `<circle cx="${lx.toFixed(1)}" cy="${dropTo}" r="1.2" fill="#fff" fill-opacity="0.35"/>`;
    const tx = anchor === 'end' ? 192 : px;
    b += `<text x="${tx}" y="${ty}" text-anchor="${anchor}" font-family="Inter" font-size="5.5" font-weight="600" letter-spacing="0.7" fill="#fff" opacity="0.6">${label}</text>`;
  });

  b += annot(14, 120, {
    label: 'THE WHOLE WORKFLOW',
    value: 'one line',
    note: 'pip install yeedu-cli==4.10.4 — Windows, Linux, macOS',
  });
  return svg(200, 162, b);
}

// ── 4. --FOLLOW ──────────────────────────────────────────────────
// Claim: the command does not return early — it resolves to exactly one
// of four terminal states. Drawn as a state machine, not a bullet list.
function drawFollowStates() {
  let b = '';

  // entry
  b += `<line x1="6" y1="70" x2="18" y2="70" stroke="#fff" stroke-opacity="0.3" stroke-width="1.4"/>`;
  b += `<polygon points="20,70 15,67.6 15,72.4" fill="#fff" fill-opacity="0.3"/>`;
  // below the arrow, not above it: at y=63 the label ran into the RUNNING box, which starts at x=20.
  b += `<text x="6" y="89" font-family="Inter" font-size="5.5" font-weight="600" letter-spacing="0.6" fill="#fff" opacity="0.4">job start</text>`;

  // the running state, with the poll loop that --follow keeps open
  b += `<rect x="20" y="58" width="64" height="24" rx="5" fill="${O}" fill-opacity="0.16" stroke="${O}" stroke-width="1.4"/>`;
  b += `<text x="52" y="73" text-anchor="middle" font-family="Montserrat" font-size="9" font-weight="800" fill="${OL}">RUNNING</text>`;
  b += `<path d="M34,58 C34,40 70,40 70,58" fill="none" stroke="${O}" stroke-opacity="0.6" stroke-width="1.3"/>`;
  b += `<polygon points="70,58 67.5,53.4 72.5,53.4" fill="${O}" fill-opacity="0.6"/>`;
  b += `<text x="52" y="44" text-anchor="middle" font-family="Inter" font-size="5.5" font-weight="600" letter-spacing="0.7" fill="${OL}" opacity="0.8">STATUS POLL</text>`;

  // exactly four terminal states — DONE is the only one you want
  const terms = [
    ['DONE', 30, true],
    ['ERROR', 58, false],
    ['STOPPED', 86, false],
    ['TERMINATED', 114, false],
  ];
  terms.forEach(([label, cy, good]) => {
    b += `<path d="M84,70 C102,70 104,${cy} 118,${cy}" fill="none" stroke="#fff" stroke-opacity="${good ? 0.5 : 0.2}" stroke-width="1.2"/>`;
    b += `<polygon points="120,${cy} 115,${cy - 2.4} 115,${cy + 2.4}" fill="#fff" fill-opacity="${good ? 0.5 : 0.2}"/>`;
    b += `<rect x="120" y="${cy - 9}" width="70" height="18" rx="4" fill="${good ? O : '#fff'}" fill-opacity="${good ? 1 : 0.05}" stroke="${good ? O : '#fff'}" stroke-opacity="${good ? 1 : 0.16}" stroke-width="1"/>`;
    b += `<text x="155" y="${cy + 2.6}" text-anchor="middle" font-family="Inter" font-size="7" font-weight="700" letter-spacing="0.8" fill="#fff" opacity="${good ? 1 : 0.5}">${label}</text>`;
  });

  b += annot(14, 142, {
    label: 'ONE OF FOUR TERMINAL STATES',
    value: '--follow',
    note: 'polls until the run reaches a terminal state, then exits',
  });
  return svg(200, 180, b);
}

// ── 5. CLOSER ────────────────────────────────────────────────────
// Inverts the cover: the two routes were never two systems. Same plane,
// same permissions — the CLI is not a side door around the console.
function drawOnePlane() {
  let b = '';

  [['UI CONSOLE', 32], ['YEEDU CLI', 112]].forEach(([label, x], i) => {
    const accent = i === 1;
    b += `<rect x="${x}" y="8" width="56" height="17" rx="4" fill="${accent ? O : '#fff'}" fill-opacity="${accent ? 0.18 : 0.05}" stroke="${accent ? O : '#fff'}" stroke-opacity="${accent ? 1 : 0.2}" stroke-width="1.1"/>`;
    b += `<text x="${x + 28}" y="19.4" text-anchor="middle" font-family="Inter" font-size="6.2" font-weight="600" letter-spacing="0.8" fill="${accent ? OL : '#fff'}" opacity="${accent ? 1 : 0.62}">${label}</text>`;
    b += `<line x1="${x + 28}" y1="25" x2="${x + 28}" y2="44" stroke="#fff" stroke-opacity="${accent ? 0.45 : 0.25}" stroke-width="1.2"/>`;
  });

  // the single control plane both land on
  b += `<rect x="16" y="44" width="168" height="22" rx="6" fill="#fff" fill-opacity="0.07" stroke="#fff" stroke-opacity="0.18" stroke-width="1.1"/>`;
  b += `<text x="100" y="58" text-anchor="middle" font-family="Inter" font-size="6.6" font-weight="600" letter-spacing="1" fill="#fff" opacity="0.7">SAME APIs · SAME PERMISSIONS</text>`;

  ['WORKSPACES', 'CLUSTERS', 'JOBS', 'NOTEBOOKS'].forEach((label, i) => {
    const x = 16 + i * 43;
    b += `<line x1="${x + 19.5}" y1="66" x2="${x + 19.5}" y2="78" stroke="#fff" stroke-opacity="0.18" stroke-width="1"/>`;
    b += `<rect x="${x}" y="78" width="39" height="16" rx="4" fill="#fff" fill-opacity="0.04" stroke="#fff" stroke-opacity="0.14" stroke-width="1"/>`;
    b += `<text x="${x + 19.5}" y="88.2" text-anchor="middle" font-family="Inter" font-size="5" font-weight="600" letter-spacing="0.5" fill="#fff" opacity="0.55">${label}</text>`;
  });

  return svg(200, 102, b);
}

// ── SLIDES ───────────────────────────────────────────────────────
const qr = await makeQr(BLOG_URL, 150);

const slides = [
  {
    notes: 'Cover — two routes to the same running job',
    html: stage(
      logoMark(34) +
      eyebrow('Yeedu CLI') +
      headline(`Run Spark ${em('Without The Browser.')}`, 58) +
      caption('The Yeedu CLI drives clusters, jobs and notebooks from the terminal — over the same APIs the console calls.') +
      well(drawTwoRoutes()),
      'A'
    ),
  },
  {
    notes: 'The UI tax — navigation and page loads dominate every action',
    html: stage(
      eyebrow('Where the time goes') +
      headline(`The Console Tax ${em('Is Mostly Waiting.')}`, 54) +
      caption('Navigation, page loads and manual refreshes surround every action. The thing you meant to do is the thin slice.') +
      well(drawUiTax()),
      'C'
    ),
  },
  {
    notes: 'Anatomy — one line starts the job',
    html: stage(
      eyebrow('Anatomy') +
      headline(`One Line ${em('Starts The Job.')}`, 56) +
      caption('Install once with pip, then drive Yeedu from any shell — the flags name the job, the workspace, and how you want to wait.') +
      well(drawCommandAnatomy()),
      'B'
    ),
  },
  {
    notes: '--follow — resolves to one of four terminal states',
    html: stage(
      eyebrow('--follow') +
      headline(`It Blocks ${em('Until It Is Done.')}`, 56) +
      caption('Instead of refreshing a page, the command keeps fetching status until the run reaches a terminal state.') +
      well(drawFollowStates()),
      'D'
    ),
  },
  {
    notes: 'Closer — one control plane, CTA and QR',
    html: stage(
      logoMark(34) +
      eyebrow('Get started') +
      headline(`Same Platform. ${em('No Side Door.')}`, 54) +
      caption('The CLI runs on the same APIs, security model and permissions as the UI.') +
      well(drawOnePlane()) +
      `<div style="display:flex;align-items:center;justify-content:space-between;gap:36px;margin-top:34px;">
         <div>
           ${ctaPill('pip install yeedu-cli')}
           <div style="margin-top:18px;font-size:21px;font-weight:600;color:${C.text2};">sales@yeedu.io</div>
         </div>
         <div style="text-align:center;">
           ${qr}
           <div style="margin-top:10px;font-size:14px;letter-spacing:0.6px;color:${C.text3};">Read the guide</div>
         </div>
       </div>`,
      'A'
    ),
  },
];

// ── BUILD ────────────────────────────────────────────────────────
const NAME = 'Run A Spark Job From The Command Line';

if (OLD_ID) { console.log('Removing superseded deck…'); await deleteCarousel(OLD_ID); }
const id = await buildCarousel(NAME, slides);
await exportDeck(id, NAME);
