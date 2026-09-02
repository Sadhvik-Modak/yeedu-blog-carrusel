// ════════════════════════════════════════════════════════════════
// Top AWS EMR Alternatives In 2026
// Source: https://yeedu.com/blog/top-aws-emr-alternatives-in-2026-cost-effective-big-data-tools-for-modern-data-platforms
//
// 5 slides, 4:5. One bespoke drawing per slide. No drawing is shared
// with the CDC, observability or CLI decks — and the five drawings
// here deliberately use five different visual grammars: a cycle, an
// ownership matrix, a layer stack, a lane swap, a criteria grid.
//
// Visual argument: the source article is a landscape piece, so the
// deck earns its claim by *placing* the alternatives rather than
// listing them. Slide 3 is the pivot — every platform optimizes some
// layer; only one optimizes the layer where the job actually runs.
// ════════════════════════════════════════════════════════════════
import {
  C, stage, logoMark, eyebrow, headline, em, caption, well, svg, annot,
  makeQr, ctaPill, buildCarousel, deleteCarousel, exportDeck,
} from './yeedu-chrome.mjs';

const BLOG_URL = 'https://yeedu.com/blog/top-aws-emr-alternatives-in-2026-cost-effective-big-data-tools-for-modern-data-platforms';
const OLD_ID = '63ffa047-1c61-4543-9cbe-e9c44566f1d8';   // set to the previous deck's id to replace it

const O = C.orange, OL = C.orangeLight;

// ── 1. COVER ─────────────────────────────────────────────────────
// Claim: EMR's cost is an operating model, not a line item. Drawn as a
// closed loop you re-enter forever, against one box you don't.
// The return channel is the whole point — it is the only closed path
// in the deck.
function drawOpsLoop() {
  let b = '';

  b += `<text x="11" y="10" font-family="Inter" font-size="5.6" font-weight="600" letter-spacing="0.9" fill="#fff" opacity="0.4">THE INFRASTRUCTURE MODEL</text>`;

  // five stages, each one a thing your team owns forever
  const stages = ['SIZE', 'LAUNCH', 'TUNE', 'MONITOR', 'UPGRADE'];
  const bw = 33, gap = 3, x0 = 11;
  stages.forEach((s, i) => {
    const x = x0 + i * (bw + gap);
    b += `<rect x="${x}" y="18" width="${bw}" height="15" rx="3" fill="#fff" fill-opacity="0.05" stroke="#fff" stroke-opacity="0.2" stroke-width="1"/>`;
    b += `<text x="${x + bw / 2}" y="27.8" text-anchor="middle" font-family="Inter" font-size="5" font-weight="600" letter-spacing="0.5" fill="#fff" opacity="0.6">${s}</text>`;
    if (i < stages.length - 1) {
      const gx = x + bw;
      b += `<polygon points="${gx + 2.6},25.5 ${gx + 0.2},23.6 ${gx + 0.2},27.4" fill="#fff" fill-opacity="0.3"/>`;
    }
  });

  // The return channel is what makes this a model and not a checklist, so it has to
  // read as a return: drop from the last box, run back, and point *up* into the first.
  // Routed inside the box row (not out to the viewBox edge) or it reads as a stray rule.
  const lastMid = x0 + 4 * (bw + gap) + bw / 2;   // centre of UPGRADE
  const firstMid = x0 + bw / 2;                   // centre of SIZE
  b += `<path d="M${lastMid},33 V48 H${firstMid} V38" fill="none" stroke="#fff" stroke-opacity="0.26" stroke-width="1.1" stroke-dasharray="2.5 2.5"/>`;
  b += `<polygon points="${firstMid},33.4 ${firstMid - 2.2},38 ${firstMid + 2.2},38" fill="#fff" fill-opacity="0.4"/>`;
  b += `<text x="100" y="59" text-anchor="middle" font-family="Inter" font-size="5.5" font-weight="500" fill="#fff" opacity="0.32">repeat for every version, every workload</text>`;

  b += `<line x1="11" y1="68" x2="188" y2="68" stroke="#fff" stroke-opacity="0.08" stroke-width="1"/>`;

  // the same job, no loop around it
  b += `<text x="11" y="84" font-family="Inter" font-size="5.6" font-weight="600" letter-spacing="0.9" fill="${OL}">THE EXECUTION MODEL</text>`;
  b += `<rect x="11" y="92" width="177" height="20" rx="5" fill="${O}" fill-opacity="0.16" stroke="${O}" stroke-width="1.2"/>`;
  b += `<text x="99.5" y="105" text-anchor="middle" font-family="Inter" font-size="7" font-weight="600" letter-spacing="0.9" fill="${OL}">RUN THE SAME CODE — FASTER</text>`;

  b += annot(14, 126, {
    label: 'TWO OPERATING MODELS, ONE BILL',
    value: 'stop tuning clusters',
    note: 'the loop above is the cost nobody puts on the invoice',
  });
  return svg(200, 176, b);
}

// ── 2. WHO CARRIES THE OPERATIONS ────────────────────────────────
// Claim: EMR hands the duties to you. Drawn as an ownership matrix —
// the same four duties, two columns, and the word in the cell changes.
function drawOwnership() {
  let b = '';

  const colA = { x: 84, w: 50 }, colB = { x: 138, w: 50 };

  // column headers — "EXECUTION LAYER" needs two lines at this width
  b += `<text x="${colA.x + colA.w / 2}" y="14" text-anchor="middle" font-family="Inter" font-size="5.4" font-weight="700" letter-spacing="0.9" fill="#fff" opacity="0.45">AWS EMR</text>`;
  b += `<text x="${colB.x + colB.w / 2}" y="10" text-anchor="middle" font-family="Inter" font-size="5.4" font-weight="700" letter-spacing="0.9" fill="${OL}">EXECUTION</text>`;
  b += `<text x="${colB.x + colB.w / 2}" y="17" text-anchor="middle" font-family="Inter" font-size="5.4" font-weight="700" letter-spacing="0.9" fill="${OL}">LAYER</text>`;

  // only duties the article actually names
  const duties = ['CLUSTER SIZING', 'INFRA TUNING', 'MONITORING', 'COST EXPLANATION'];
  duties.forEach((d, i) => {
    const y = 30 + i * 26;
    b += `<text x="8" y="${y + 12}" font-family="Inter" font-size="5.5" font-weight="600" letter-spacing="0.5" fill="#fff" opacity="0.62">${d}</text>`;

    // your column — filled, because you are the one holding it
    b += `<rect x="${colA.x}" y="${y}" width="${colA.w}" height="18" rx="4" fill="#fff" fill-opacity="0.07" stroke="#fff" stroke-opacity="0.16" stroke-width="1"/>`;
    b += `<text x="${colA.x + colA.w / 2}" y="${y + 11.8}" text-anchor="middle" font-family="Inter" font-size="5.4" font-weight="700" letter-spacing="0.8" fill="#fff" opacity="0.62">YOU</text>`;

    b += `<rect x="${colB.x}" y="${y}" width="${colB.w}" height="18" rx="4" fill="${O}" fill-opacity="0.16" stroke="${O}" stroke-opacity="0.75" stroke-width="1"/>`;
    b += `<text x="${colB.x + colB.w / 2}" y="${y + 11.8}" text-anchor="middle" font-family="Inter" font-size="5.4" font-weight="700" letter-spacing="0.8" fill="${OL}">PLATFORM</text>`;
  });

  b += annot(14, 140, {
    label: 'WHAT FLEXIBILITY ACTUALLY COSTS',
    value: 'four standing duties',
    note: 'none of them are analytics outcomes',
  });
  return svg(200, 180, b);
}

// ── 3. WHERE EACH ALTERNATIVE OPTIMIZES ──────────────────────────
// Claim: the alternatives are not interchangeable — they act on
// different layers. Drawn as a stack with the named platforms pinned
// to the layer each one works on. Yeedu is alone on the bottom layer,
// and that emptiness is the argument.
function drawLayers() {
  let b = '';

  const layers = [
    { name: 'ANALYTICS · SQL',          chips: ['SNOWFLAKE'] },
    { name: 'PLATFORM & GOVERNANCE',    chips: ['DATABRICKS', 'AZURE SYNAPSE', 'IBM ANALYTICS'] },
    { name: 'CLUSTER & INFRASTRUCTURE', chips: ['GOOGLE DATAPROC', 'CLOUDERA CDP'] },
    { name: 'EXECUTION ENGINE',         chips: ['YEEDU'], accent: true },
  ];

  layers.forEach((layer, i) => {
    const ly = 10 + i * 34;
    const by = ly + 5;
    b += `<text x="8" y="${ly}" font-family="Inter" font-size="5" font-weight="600" letter-spacing="0.8" fill="${layer.accent ? OL : '#fff'}" opacity="${layer.accent ? 1 : 0.38}">${layer.name}</text>`;
    b += `<rect x="8" y="${by}" width="184" height="20" rx="4" fill="${layer.accent ? O : '#fff'}" fill-opacity="${layer.accent ? 0.1 : 0.035}" stroke="${layer.accent ? O : '#fff'}" stroke-opacity="${layer.accent ? 0.7 : 0.1}" stroke-width="1"/>`;

    // chips are sized from the label: uppercase Inter at 4.6 runs ~3.53 units/char
    let cx = 14;
    layer.chips.forEach((chip) => {
      const w = chip.length * 3.53 + 11;
      b += `<rect x="${cx.toFixed(1)}" y="${by + 4}" width="${w.toFixed(1)}" height="12" rx="3" fill="${layer.accent ? O : '#fff'}" fill-opacity="${layer.accent ? 1 : 0.08}" stroke="${layer.accent ? O : '#fff'}" stroke-opacity="${layer.accent ? 1 : 0.16}" stroke-width="1"/>`;
      b += `<text x="${(cx + w / 2).toFixed(1)}" y="${by + 12.4}" text-anchor="middle" font-family="Inter" font-size="4.6" font-weight="700" letter-spacing="0.4" fill="${layer.accent ? '#fff' : '#fff'}" opacity="${layer.accent ? 1 : 0.55}">${chip}</text>`;
      cx += w + 5;
    });

    if (layer.accent) {
      b += `<text x="${cx + 3}" y="${by + 12.4}" font-family="Inter" font-size="5" font-weight="500" fill="${OL}" opacity="0.7">the only one on this layer</text>`;
    }
  });

  b += annot(14, 148, {
    label: 'WHERE THE OPTIMIZATION HAPPENS',
    value: '$0.53/TB',
    note: 'TPC-DS 99-query suite, not a bigger cluster',
  });
  return svg(200, 196, b);
}

// ── 4. SAME CODE, DIFFERENT ENGINE ───────────────────────────────
// Claim: the migration is a runtime swap, not a rewrite. Drawn as one
// shared block on top splitting into two engines — the top of the
// diagram never changes, which is the entire promise.
function drawSameCode() {
  let b = '';

  // the part that does not change
  b += `<rect x="24" y="8" width="152" height="28" rx="5" fill="#fff" fill-opacity="0.06" stroke="#fff" stroke-opacity="0.28" stroke-width="1.1" stroke-dasharray="4 3"/>`;
  b += `<text x="100" y="22" text-anchor="middle" font-family="Inter" font-size="6.4" font-weight="600" letter-spacing="0.9" fill="#fff" opacity="0.85">YOUR PYSPARK · SCALA · JAVA</text>`;
  b += `<text x="100" y="31" text-anchor="middle" font-family="Inter" font-size="5" font-weight="500" fill="#fff" opacity="0.4">unchanged</text>`;

  // the split
  b += `<line x1="100" y1="36" x2="100" y2="45" stroke="#fff" stroke-opacity="0.22" stroke-width="1.1"/>`;
  b += `<path d="M100,45 H60 V54" fill="none" stroke="#fff" stroke-opacity="0.22" stroke-width="1.1"/>`;
  b += `<path d="M100,45 H140 V54" fill="none" stroke="${O}" stroke-opacity="0.7" stroke-width="1.3"/>`;

  // two engines under the same code
  b += `<rect x="22" y="54" width="76" height="18" rx="4" fill="#fff" fill-opacity="0.05" stroke="#fff" stroke-opacity="0.18" stroke-width="1"/>`;
  b += `<text x="60" y="65.8" text-anchor="middle" font-family="Inter" font-size="5.2" font-weight="700" letter-spacing="0.7" fill="#fff" opacity="0.55">AWS EMR SPARK</text>`;
  b += `<rect x="102" y="54" width="76" height="18" rx="4" fill="${O}" fill-opacity="0.18" stroke="${O}" stroke-width="1.2"/>`;
  b += `<text x="140" y="65.8" text-anchor="middle" font-family="Inter" font-size="5.2" font-weight="700" letter-spacing="0.7" fill="${OL}">YEEDU TURBO ENGINE</text>`;

  // runtime, drawn on one shared scale so the two tracks are comparable
  b += `<rect x="22" y="84" width="76" height="10" rx="2" fill="#fff" fill-opacity="0.12"/>`;
  b += `<rect x="102" y="84" width="22" height="10" rx="2" fill="${O}"/>`;
  b += `<rect x="124" y="84" width="54" height="10" rx="2" fill="#fff" fill-opacity="0.04"/>`;
  b += `<text x="22" y="105" font-family="Inter" font-size="5" font-weight="600" letter-spacing="0.6" fill="#fff" opacity="0.42">BASELINE RUNTIME</text>`;
  b += `<text x="102" y="105" font-family="Inter" font-size="5" font-weight="600" letter-spacing="0.6" fill="${OL}">4–10× FASTER</text>`;

  b += annot(14, 124, {
    label: 'WHAT YOU REWRITE TO GET IT',
    value: '0 lines',
    note: 'faster execution is simply less compute consumed',
  });
  return svg(200, 170, b);
}

// ── 5. CLOSER ────────────────────────────────────────────────────
// Inverts the cover: the cover said the model matters more than the
// logo, so the closer hands over the four questions that decide it.
function drawCriteria() {
  let b = '';

  const cells = [
    ['01', 'TEAM MATURITY',     'who operates it'],
    ['02', 'WORKLOAD MIX',      'ETL, SQL, ML'],
    ['03', 'COST SENSITIVITY',  'predictable or not'],
    ['04', 'ABSTRACTION LEVEL', 'infra or outcomes'],
  ];

  cells.forEach(([num, label, hint], i) => {
    const x = 10 + (i % 2) * 92;
    const y = 8 + Math.floor(i / 2) * 50;
    b += `<rect x="${x}" y="${y}" width="88" height="44" rx="5" fill="#fff" fill-opacity="0.04" stroke="#fff" stroke-opacity="0.12" stroke-width="1"/>`;
    b += `<text x="${x + 9}" y="${y + 15}" font-family="Montserrat" font-size="8" font-weight="800" fill="${O}" opacity="0.85">${num}</text>`;
    b += `<text x="${x + 9}" y="${y + 27}" font-family="Inter" font-size="5.4" font-weight="700" letter-spacing="0.6" fill="#fff" opacity="0.82">${label}</text>`;
    b += `<text x="${x + 9}" y="${y + 36}" font-family="Inter" font-size="4.6" font-weight="500" fill="#fff" opacity="0.38">${hint}</text>`;
  });

  return svg(200, 110, b);
}

// ── SLIDES ───────────────────────────────────────────────────────
const qr = await makeQr(BLOG_URL, 150);

const slides = [
  {
    notes: 'Cover — the infrastructure model is a loop, the execution model is not',
    html: stage(
      logoMark(34) +
      eyebrow('EMR alternatives') +
      // ~34 characters is the one-line budget at this size; longer wraps mid-italic.
      headline(`EMR's Real Cost ${em('Is Operational.')}`, 54) +
      caption('The 2026 question is no longer which cluster is cheaper. It is which operating model you still want to be running in five years.') +
      well(drawOpsLoop()),
      'A'
    ),
  },
  {
    notes: 'The overhead — EMR hands four standing duties to your team',
    html: stage(
      eyebrow('The overhead') +
      headline(`Flexibility ${em('Becomes Operations.')}`, 54) +
      caption('Cluster sizing, infrastructure tuning, continuous monitoring and cost explanation all land on your team rather than on the platform.') +
      well(drawOwnership()),
      'B'
    ),
  },
  {
    notes: 'The landscape — every alternative optimizes a different layer',
    html: stage(
      eyebrow('The landscape') +
      headline(`Every Platform ${em('Optimizes Something.')}`, 50) +
      caption('Most EMR alternatives move the work to a different layer of the stack. Only one of them optimizes the layer where the job actually runs.') +
      well(drawLayers()),
      'D'
    ),
  },
  {
    notes: 'Zero rewrites — the migration is a runtime swap',
    html: stage(
      eyebrow('Zero rewrites') +
      headline(`Same Code. ${em('Different Engine.')}`, 54) +
      caption('Yeedu changes how Spark executes, not what you wrote. Existing PySpark, Scala and Java run in their original form.') +
      well(drawSameCode()),
      'C'
    ),
  },
  {
    notes: 'Closer — the four criteria, CTA and QR',
    html: stage(
      logoMark(34) +
      eyebrow('How to choose') +
      headline(`Pick The Trade-Off, ${em('Not The Logo.')}`, 50) +
      caption('Four questions decide this more reliably than any feature matrix.') +
      well(drawCriteria()) +
      `<div style="display:flex;align-items:center;justify-content:space-between;gap:36px;margin-top:34px;">
         <div>
           ${ctaPill('Compare your EMR bill')}
           <div style="margin-top:18px;font-size:21px;font-weight:600;color:${C.text2};">sales@yeedu.io</div>
         </div>
         <div style="text-align:center;">
           ${qr}
           <div style="margin-top:10px;font-size:14px;letter-spacing:0.6px;color:${C.text3};">Read the comparison</div>
         </div>
       </div>`,
      'A'
    ),
  },
];

// ── BUILD ────────────────────────────────────────────────────────
const NAME = 'Top AWS EMR Alternatives In 2026';

if (OLD_ID) { console.log('Removing superseded deck…'); await deleteCarousel(OLD_ID); }
const id = await buildCarousel(NAME, slides);
await exportDeck(id, NAME);
