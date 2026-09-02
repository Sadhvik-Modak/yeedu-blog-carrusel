// Event-style photo booth backdrops — conventional conference/red-carpet style
// Logo-forward + QR-forward. 4 designs at 4:5 (1080x1350).
const API = 'http://localhost:3000';
const LOGO = '/uploads/7d95c235-aa75-4cb1-a3c2-e84314ceca33.png';
const W = 1080, H = 1350;

const C = {
  brown: '#26221d',
  brownDeep: '#14110d',
  brownInk: '#0a0807',
  orange: '#f2600c',
  orangeLight: '#ff8a3d',
  orangeGlow: 'rgba(242,96,12,0.55)',
  cream: '#f7f3ec',
};

const bgWarm = `
  <div style="position:absolute;inset:0;background:linear-gradient(165deg,${C.brown} 0%,${C.brownDeep} 50%,${C.brownInk} 100%);"></div>
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse 60% 40% at 90% 5%,rgba(242,96,12,0.32),transparent 55%);"></div>
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse 50% 35% at 10% 95%,rgba(242,96,12,0.20),transparent 55%);"></div>
  <div style="position:absolute;inset:0;background:repeating-linear-gradient(45deg,rgba(255,255,255,0.012) 0,rgba(255,255,255,0.012) 2px,transparent 2px,transparent 10px);"></div>
`;

function frame(innerHTML, bg = bgWarm) {
  return `<div style="width:${W}px;height:${H}px;position:relative;overflow:hidden;font-family:'Inter',-apple-system,system-ui,sans-serif;color:${C.cream};">
    ${bg}
    <div style="position:relative;z-index:2;width:100%;height:100%;">${innerHTML}</div>
  </div>`;
}

// Realistic-looking QR mockup (replace with real QR for production printing)
function qrCode(size = 220, seed = 42) {
  const N = 25;
  const cell = size / N;
  let s = seed;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const inCorner = (x, y) => (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
  const cells = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (inCorner(x, y)) continue;
      if (rand() > 0.48) cells.push(`<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="#0a0807"/>`);
    }
  }
  const posSquare = (px, py) => `
    <rect x="${px * cell}" y="${py * cell}" width="${7 * cell}" height="${7 * cell}" fill="#0a0807"/>
    <rect x="${(px + 1) * cell}" y="${(py + 1) * cell}" width="${5 * cell}" height="${5 * cell}" fill="#ffffff"/>
    <rect x="${(px + 2) * cell}" y="${(py + 2) * cell}" width="${3 * cell}" height="${3 * cell}" fill="#0a0807"/>
  `;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#ffffff"/>
    ${cells.join('')}
    ${posSquare(0, 0)}
    ${posSquare(N - 7, 0)}
    ${posSquare(0, N - 7)}
  </svg>`;
}

function qrCard(size = 180, label = 'Scan to know more', seed = 42) {
  const pad = 16;
  return `<div style="display:inline-block;background:#ffffff;padding:${pad}px ${pad}px ${pad - 4}px;border-radius:16px;box-shadow:0 14px 48px rgba(0,0,0,0.45);text-align:center;">
    ${qrCode(size, seed)}
    <div style="margin-top:8px;font-size:13px;font-weight:800;letter-spacing:0.12em;color:#0a0807;text-transform:uppercase;">${label}</div>
  </div>`;
}

// ============ Design 1: Classic Step-and-Repeat ============
function p1_stepRepeat() {
  const cols = 3, rows = 5;
  const tiles = [];
  const cellW = W / cols;
  const cellH = (H - 200) / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = cellW * c + cellW / 2;
      const cy = cellH * r + cellH / 2;
      const stagger = (r % 2 === 0) ? 0 : cellW * 0.18;
      tiles.push(`<div style="position:absolute;left:${cx + stagger}px;top:${cy}px;transform:translate(-50%,-50%);opacity:0.85;">
        <img src="${LOGO}" style="height:${cellH * 0.34}px;filter:drop-shadow(0 0 14px ${C.orangeGlow});"/>
      </div>`);
    }
  }
  return frame(`
    <div style="position:absolute;inset:0;">${tiles.join('')}</div>
    <!-- gradient fade on bottom band so it doesn't fight tiles -->
    <div style="position:absolute;left:0;right:0;bottom:0;height:230px;background:linear-gradient(0deg,${C.brownInk} 55%,rgba(10,8,7,0.92) 80%,rgba(10,8,7,0) 100%);"></div>
    <!-- bottom band content -->
    <div style="position:absolute;left:0;right:0;bottom:0;height:200px;border-top:2px solid ${C.orange};display:flex;align-items:center;justify-content:space-between;padding:0 56px;">
      <div>
        <div style="font-size:16px;letter-spacing:0.22em;color:${C.orangeLight};text-transform:uppercase;font-weight:800;">data engineering meetup</div>
        <div style="margin-top:8px;font-size:54px;font-weight:900;color:${C.cream};letter-spacing:-0.015em;line-height:1;">yeedu.com</div>
        <div style="margin-top:8px;font-size:15px;color:rgba(247,243,236,0.65);letter-spacing:0.04em;">#YeeduMeetup</div>
      </div>
      ${qrCard(130, 'yeedu.com', 73)}
    </div>
  `);
}

// ============ Design 2: Hero Logo Wall ============
function p2_heroLogo() {
  return frame(`
    <!-- top URL chip -->
    <div style="position:absolute;top:54px;left:0;right:0;text-align:center;">
      <div style="display:inline-block;padding:12px 26px;border:1.5px solid rgba(247,243,236,0.25);border-radius:999px;font-size:13px;letter-spacing:0.24em;color:rgba(247,243,236,0.85);text-transform:uppercase;font-weight:800;">
        yeedu &nbsp;·&nbsp; data engineering meetup
      </div>
    </div>

    <!-- hero center -->
    <div style="position:absolute;top:48%;left:50%;transform:translate(-50%,-50%);text-align:center;width:920px;">
      <img src="${LOGO}" style="height:240px;filter:drop-shadow(0 0 64px ${C.orangeGlow});"/>
      <div style="margin-top:44px;font-size:92px;font-weight:900;letter-spacing:-0.025em;line-height:0.92;color:${C.cream};">
        We re-architected<br/><span style="color:${C.orangeLight};font-style:italic;">Spark.</span>
      </div>
      <div style="margin-top:30px;font-size:24px;font-weight:600;color:rgba(247,243,236,0.7);letter-spacing:0.03em;">Same code. Faster results. Smaller bills.</div>
    </div>

    <!-- bottom-right QR -->
    <div style="position:absolute;bottom:48px;right:48px;">
      ${qrCard(180, 'yeedu.com', 17)}
    </div>

    <!-- bottom-left hashtag block -->
    <div style="position:absolute;bottom:74px;left:56px;">
      <div style="font-size:13px;letter-spacing:0.24em;text-transform:uppercase;font-weight:800;color:${C.orangeLight};">stand here · smile</div>
      <div style="margin-top:8px;font-size:38px;font-weight:900;color:${C.cream};letter-spacing:-0.01em;line-height:1;">#YeeduMeetup</div>
    </div>
  `);
}

// ============ Design 3: Brand Statement + benchmark proof ============
function p3_statement() {
  return frame(`
    <!-- top header -->
    <div style="position:absolute;top:56px;left:0;right:0;display:flex;justify-content:space-between;align-items:center;padding:0 56px;">
      <img src="${LOGO}" style="height:70px;filter:drop-shadow(0 0 16px ${C.orangeGlow});"/>
      <div style="font-size:13px;letter-spacing:0.24em;color:rgba(247,243,236,0.65);text-transform:uppercase;font-weight:800;">data engineering meetup · 2026</div>
    </div>

    <!-- big tagline -->
    <div style="position:absolute;top:44%;left:50%;transform:translate(-50%,-50%);text-align:center;width:980px;">
      <div style="font-size:152px;font-weight:900;letter-spacing:-0.04em;line-height:0.86;color:${C.cream};">
        Spark<br/>made<br/><span style="color:${C.orangeLight};font-style:italic;">easy.</span>
      </div>
    </div>

    <!-- stat strip -->
    <div style="position:absolute;bottom:260px;left:0;right:0;text-align:center;">
      <div style="display:inline-flex;gap:38px;padding:18px 32px;background:rgba(255,255,255,0.05);border:1px solid rgba(247,243,236,0.14);border-radius:18px;backdrop-filter:blur(6px);">
        <div><div style="font-size:32px;font-weight:900;color:${C.orangeLight};letter-spacing:-0.01em;">3TB</div><div style="font-size:11px;letter-spacing:0.2em;color:rgba(247,243,236,0.6);text-transform:uppercase;margin-top:2px;">workload</div></div>
        <div style="width:1px;background:rgba(247,243,236,0.18);"></div>
        <div><div style="font-size:32px;font-weight:900;color:${C.orangeLight};letter-spacing:-0.01em;">$2.33</div><div style="font-size:11px;letter-spacing:0.2em;color:rgba(247,243,236,0.6);text-transform:uppercase;margin-top:2px;">total cost</div></div>
        <div style="width:1px;background:rgba(247,243,236,0.18);"></div>
        <div><div style="font-size:32px;font-weight:900;color:${C.orangeLight};letter-spacing:-0.01em;">40<span style="font-size:18px;">min</span></div><div style="font-size:11px;letter-spacing:0.2em;color:rgba(247,243,236,0.6);text-transform:uppercase;margin-top:2px;">99 queries</div></div>
      </div>
      <div style="margin-top:10px;font-size:12px;letter-spacing:0.18em;color:rgba(247,243,236,0.45);text-transform:uppercase;">tpc-ds · yeedu turbo · standard cloud</div>
    </div>

    <!-- bottom -->
    <div style="position:absolute;bottom:48px;left:0;right:0;display:flex;justify-content:space-between;align-items:center;padding:0 56px;">
      <div>
        <div style="font-size:13px;letter-spacing:0.24em;color:${C.orangeLight};text-transform:uppercase;font-weight:800;">benchmarks · live</div>
        <div style="margin-top:8px;font-size:54px;font-weight:900;color:${C.cream};letter-spacing:-0.015em;line-height:1;">yeedu.com</div>
        <div style="margin-top:6px;font-size:15px;color:rgba(247,243,236,0.6);">#YeeduMeetup</div>
      </div>
      ${qrCard(150, 'Scan benchmarks', 31)}
    </div>
  `);
}

// ============ Design 4: Geometric brand block (split) ============
function p4_geoBlock() {
  return frame(`
    <!-- diagonal orange block bottom -->
    <div style="position:absolute;inset:0;clip-path:polygon(0 76%,100% 60%,100% 100%,0 100%);background:linear-gradient(135deg,${C.orange} 0%,#d44e08 100%);"></div>
    <div style="position:absolute;inset:0;clip-path:polygon(0 78%,100% 62%,100% 63%,0 79%);background:rgba(0,0,0,0.20);"></div>
    <!-- subtle dot grid on top half -->
    <div style="position:absolute;inset:0 0 28% 0;background-image:radial-gradient(rgba(247,243,236,0.06) 1.5px,transparent 1.5px);background-size:32px 32px;"></div>

    <!-- top: yeedu mark + meetup chip -->
    <div style="position:absolute;top:56px;left:56px;right:56px;display:flex;justify-content:space-between;align-items:flex-start;">
      <img src="${LOGO}" style="height:84px;filter:drop-shadow(0 0 18px ${C.orangeGlow});"/>
      <div style="text-align:right;">
        <div style="font-size:12px;letter-spacing:0.28em;color:rgba(247,243,236,0.75);text-transform:uppercase;font-weight:800;">data engineering meetup</div>
        <div style="margin-top:6px;font-size:14px;color:rgba(247,243,236,0.55);">vol. 01 · 2026</div>
      </div>
    </div>

    <!-- center headline -->
    <div style="position:absolute;top:36%;left:50%;transform:translate(-50%,-50%);text-align:center;width:920px;">
      <div style="font-size:108px;font-weight:900;letter-spacing:-0.025em;line-height:0.9;color:${C.cream};">
        SHIP IT.<br/>RUN IT.<br/><span style="color:${C.orangeLight};font-style:italic;">OWN IT.</span>
      </div>
    </div>

    <!-- bottom orange band: URL + QR -->
    <div style="position:absolute;bottom:48px;left:56px;right:56px;display:flex;align-items:flex-end;justify-content:space-between;">
      <div style="color:#1a0d04;">
        <div style="font-size:13px;letter-spacing:0.24em;text-transform:uppercase;font-weight:900;opacity:0.85;">scan here</div>
        <div style="margin-top:8px;font-size:74px;font-weight:900;letter-spacing:-0.025em;line-height:0.95;">yeedu<span style="opacity:0.55;">.com</span></div>
        <div style="margin-top:8px;font-size:18px;font-weight:800;opacity:0.85;">3TB &nbsp;·&nbsp; $2.33 &nbsp;·&nbsp; 40 min &nbsp;·&nbsp; 99 queries</div>
      </div>
      ${qrCard(180, 'yeedu.com', 91)}
    </div>
  `);
}

// ============ Build ============
async function build() {
  const create = await fetch(`${API}/api/carousels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Yeedu Photo Booth — Event Style v2', aspectRatio: '4:5' }),
  });
  if (!create.ok) throw new Error(`Create failed: ${create.status} ${await create.text()}`);
  const { id } = await create.json();
  console.log('Carousel:', id);

  const slides = [
    { name: 'Step-and-Repeat', html: p1_stepRepeat() },
    { name: 'Hero Logo Wall', html: p2_heroLogo() },
    { name: 'Brand Statement', html: p3_statement() },
    { name: 'Geometric Block', html: p4_geoBlock() },
  ];

  for (const s of slides) {
    const r = await fetch(`${API}/api/carousels/${id}/slides`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: s.html, notes: s.name }),
    });
    if (!r.ok) throw new Error(`Slide failed: ${s.name} — ${r.status} ${await r.text()}`);
    console.log('Added:', s.name);
  }

  console.log(`\nView: ${API}/?carousel=${id}`);
}

build().catch(e => { console.error(e); process.exit(1); });
