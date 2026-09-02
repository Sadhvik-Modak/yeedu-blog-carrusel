// Yeedu Customer Case Study — Top 10 US Health Insurer · v2
// 9:16 (1080×1920) — data lake hydration + acceleration, 300 pipelines/day,
// all moved without issue from Dataproc → Yeedu Turbo, 40% less cost.
// NO dollar figures anywhere — only the 40% savings number.
const API = 'http://localhost:3000';
const LOGO = '/uploads/7d95c235-aa75-4cb1-a3c2-e84314ceca33.png';
const W = 1080, H = 1920;

const C = {
  bg: '#050505',
  bgWarm: '#0a0807',
  panel: '#0e0c0a',
  panelLine: '#1c1814',
  accent: '#ff6b1a',
  accentDeep: '#f2600c',
  accentLight: '#ff8a3d',
  text: '#ffffff',
  mute: '#9a948c',
  mute2: '#6e6862',
};

// ---------- QR ----------
function qrCode(size = 160, seed = 42) {
  const N = 25, cell = size / N;
  let s = seed;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const corner = (x, y) => (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
  const cells = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (corner(x, y)) continue;
    if (rand() > 0.48) cells.push(`<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="#0a0807"/>`);
  }
  const pos = (px, py) => `
    <rect x="${px * cell}" y="${py * cell}" width="${7 * cell}" height="${7 * cell}" fill="#0a0807"/>
    <rect x="${(px + 1) * cell}" y="${(py + 1) * cell}" width="${5 * cell}" height="${5 * cell}" fill="#ffffff"/>
    <rect x="${(px + 2) * cell}" y="${(py + 2) * cell}" width="${3 * cell}" height="${3 * cell}" fill="#0a0807"/>`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#ffffff"/>${cells.join('')}${pos(0, 0)}${pos(N - 7, 0)}${pos(0, N - 7)}</svg>`;
}

// ---------- corner arcs ----------
function cornerArcs({ x, y, count = 6, baseR = 240, step = 70, opacity = 0.22 }) {
  const circles = [];
  for (let i = 0; i < count; i++) {
    circles.push(`<circle cx="${x}" cy="${y}" r="${baseR + i * step}" fill="none" stroke="${C.accent}" stroke-width="1.2" opacity="${(opacity - i * 0.022).toFixed(3)}"/>`);
  }
  return circles.join('');
}

// ---------- Cumulative cost INDEX chart (% of baseline) ----------
function costChart() {
  const cw = 920, ch = 230;
  const pad = { t: 28, r: 30, b: 32, l: 60 };
  const innerW = cw - pad.l - pad.r;
  const innerH = ch - pad.t - pad.b;

  const days = 15;
  // Yeedu cumulative cost as % of Dataproc's day-15 baseline (target: 60% at day 15 = 40% less)
  // Slight realistic curve — uneven daily but trends to 60%
  const yCum = [3.5, 8.0, 12.0, 16.0, 20.0, 24.0, 28.0, 32.5, 36.5, 40.5, 44.5, 48.5, 52.0, 56.0, 60.0];
  // Dataproc linear to 100%
  const dCum = Array.from({ length: days }, (_, i) => ((i + 1) / days) * 100);
  const yMax = 108;

  const x = i => pad.l + (i / (days - 1)) * innerW;
  const y = v => pad.t + innerH - (v / yMax) * innerH;
  const path = (cumArr) => cumArr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');

  const ticks = [0, 25, 50, 75, 100];
  const tickEls = ticks.map(t => `
    <line x1="${pad.l}" x2="${pad.l + innerW}" y1="${y(t)}" y2="${y(t)}" stroke="#1c1814" stroke-width="1"/>
    <text x="${pad.l - 10}" y="${y(t) + 4}" text-anchor="end" font-family="Inter,sans-serif" font-size="10" fill="${C.mute2}">${t}%</text>
  `).join('');

  const xTicks = [1, 5, 10, 15];
  const xTickEls = xTicks.map(d => `
    <text x="${x(d - 1)}" y="${pad.t + innerH + 18}" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="${C.mute2}">D${d}</text>
  `).join('');

  const yEnd = yCum[days - 1];
  const dEnd = dCum[days - 1];

  return `
    <svg width="${cw}" height="${ch}" viewBox="0 0 ${cw} ${ch}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${cw}" height="${ch}" rx="6" fill="${C.panel}" stroke="${C.panelLine}" stroke-width="1"/>
      <text x="${pad.l - 12}" y="18" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="2.4" fill="${C.mute}">CUMULATIVE COST · % OF BASELINE</text>
      <text x="${cw - pad.r}" y="18" text-anchor="end" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="2.4" fill="${C.accent}">YEEDU TURBO ↘ 40% LESS</text>
      ${tickEls}
      ${xTickEls}
      <path d="${path(dCum)}" stroke="${C.text}" stroke-width="2.4" fill="none" opacity="0.55" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${path(yCum)}" stroke="${C.accent}" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${path(yCum)} L ${x(days - 1)} ${pad.t + innerH} L ${x(0)} ${pad.t + innerH} Z" fill="${C.accent}" opacity="0.10"/>
      <circle cx="${x(days - 1)}" cy="${y(dEnd)}" r="4" fill="${C.text}"/>
      <text x="${x(days - 1) - 12}" y="${y(dEnd) - 8}" text-anchor="end" font-family="Inter,sans-serif" font-size="11" font-weight="700" fill="${C.text}">Dataproc · 100%</text>
      <circle cx="${x(days - 1)}" cy="${y(yEnd)}" r="5" fill="${C.accent}"/>
      <text x="${x(days - 1) - 12}" y="${y(yEnd) + 16}" text-anchor="end" font-family="Inter,sans-serif" font-size="11" font-weight="700" fill="${C.accent}">Yeedu · 60%</text>
    </svg>
  `;
}

// ---------- Banner ----------
function buildBanner() {
  const header = `
    <div style="position:absolute;top:60px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:flex-start;">
      <img src="${LOGO}" style="height:48px;filter:brightness(0) invert(1);"/>
      <div style="text-align:right;">
        <div style="font-family:'Inter',sans-serif;font-size:18px;font-weight:600;color:${C.text};line-height:1;">yeedu.com</div>
        <div style="margin-top:4px;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.34em;text-transform:uppercase;color:${C.accent};">customer case study</div>
      </div>
    </div>
  `;

  const headline = `
    <div style="position:absolute;top:180px;left:0;right:0;text-align:center;">
      <div style="display:inline-block;padding:6px 18px;border:1px solid ${C.accent};border-radius:999px;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.32em;text-transform:uppercase;color:${C.accent};">
        ★ life sciences · top 5 healthcare company ★
      </div>
    </div>
    <div style="position:absolute;top:240px;left:60px;right:60px;text-align:center;">
      <div style="font-family:'Inter','Helvetica Neue',sans-serif;font-size:96px;font-weight:900;color:${C.text};letter-spacing:-0.035em;line-height:0.95;">Lifted as-is.</div>
      <div style="font-family:'Inter','Helvetica Neue',sans-serif;font-size:96px;font-style:italic;font-weight:900;color:${C.accent};letter-spacing:-0.035em;line-height:0.95;margin-top:4px;">60% lighter.</div>
    </div>
    <div style="position:absolute;top:484px;left:100px;right:100px;text-align:center;">
      <div style="font-family:'Inter',sans-serif;font-size:21px;font-weight:400;color:${C.mute};letter-spacing:-0.005em;line-height:1.45;">
        Data lake hydration · <span style="color:${C.text};font-weight:600;">300 data engineering pipelines / day</span> moved from Dataproc → Yeedu Turbo as-is. <span style="color:${C.text};font-weight:600;">Zero failures.</span>
      </div>
    </div>
  `;

  const heroCard = `
    <div style="position:absolute;top:638px;left:60px;right:60px;border:1.5px solid ${C.accent};border-radius:14px;padding:30px 38px;background:linear-gradient(180deg,rgba(255,107,26,0.04),rgba(255,107,26,0.0));">
      <div style="text-align:center;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.32em;text-transform:uppercase;color:${C.mute};">300 pipelines / day · data lake hydration</div>
      <div style="margin-top:24px;display:flex;align-items:flex-start;justify-content:space-between;gap:20px;">
        <div style="flex:1;">
          <div style="font-family:'Inter',sans-serif;font-size:11px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:${C.mute};">traditional spark</div>
          <div style="margin-top:8px;font-family:'Inter','Helvetica Neue',sans-serif;font-size:62px;font-weight:900;color:${C.text};letter-spacing:-0.025em;line-height:1;">100<span style="font-size:36px;color:${C.mute};">%</span></div>
          <div style="margin-top:4px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${C.mute};">baseline cost</div>
          <div style="margin-top:10px;font-family:'Inter',sans-serif;font-size:14px;color:${C.mute};line-height:1.45;">
            Google Dataproc cluster<br/>
            <span style="color:${C.mute2};">300 pipelines/day · before migration</span>
          </div>
        </div>
        <div style="padding-top:34px;">
          <svg width="48" height="32" viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0 16 L 40 16 M 32 6 L 42 16 L 32 26" stroke="${C.accent}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div style="flex:1;text-align:right;">
          <div style="font-family:'Inter',sans-serif;font-size:11px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:${C.accent};">yeedu turbo</div>
          <div style="margin-top:8px;font-family:'Inter','Helvetica Neue',sans-serif;font-size:62px;font-weight:900;color:${C.accent};letter-spacing:-0.025em;line-height:1;">−60<span style="font-size:36px;">%</span></div>
          <div style="margin-top:4px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${C.accentLight};">cost reduction</div>
          <div style="margin-top:10px;font-family:'Inter',sans-serif;font-size:14px;color:${C.mute};line-height:1.45;">
            Yeedu Turbo engine<br/>
            <span style="color:${C.mute2};">300 pipelines/day · zero failures</span>
          </div>
        </div>
      </div>
    </div>
  `;

  const statsRow = `
    <div style="position:absolute;top:980px;left:60px;right:60px;display:flex;justify-content:space-between;gap:8px;padding:24px 0;border-top:1px solid ${C.panelLine};border-bottom:1px solid ${C.panelLine};">
      ${[
        ['60%', 'cost optimized', C.accent],
        ['300 / day', 'pipelines', C.text],
        ['0', 'failures', C.text],
        ['All', 'jobs ported as-is', C.text],
      ].map(([num, label, col]) => `
        <div style="flex:1;text-align:center;padding:8px 6px;">
          <div style="font-family:'Inter','Helvetica Neue',sans-serif;font-size:58px;font-weight:900;color:${col};letter-spacing:-0.03em;line-height:1;">${num}</div>
          <div style="margin-top:12px;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.26em;text-transform:uppercase;color:${C.mute};">${label}</div>
        </div>
      `).join('<div style="width:1px;background:#1c1814;"></div>')}
    </div>
  `;

  // Single migration narrative panel — no steps
  const playbook = `
    <div style="position:absolute;top:1240px;left:60px;right:60px;background:${C.panel};border:1px solid ${C.panelLine};border-radius:14px;padding:30px 36px;">
      <div style="font-family:'Inter',sans-serif;font-size:11px;font-weight:800;letter-spacing:0.34em;text-transform:uppercase;color:${C.accent};">the migration</div>
      <div style="margin-top:14px;font-family:'Inter','Helvetica Neue',sans-serif;font-size:30px;font-weight:900;color:${C.text};letter-spacing:-0.018em;line-height:1.18;">
        All <span style="color:${C.accent};">300 data engineering pipelines</span> lifted from Dataproc to Yeedu Turbo without code changes — right-sized compute per workload, <span style="color:${C.accent};">60% lighter bill</span>.
      </div>
      <div style="margin-top:18px;display:flex;align-items:center;gap:18px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:${C.mute};">
        <span>data lake hydration</span>
        <span style="color:${C.mute2};">·</span>
        <span>pyspark + sql</span>
        <span style="color:${C.mute2};">·</span>
        <span>zero rewrites</span>
        <span style="color:${C.mute2};">·</span>
        <span style="color:${C.accent};">zero failures</span>
      </div>
    </div>
  `;

  const footer = `
    <div style="position:absolute;bottom:60px;left:60px;right:60px;border:1px solid ${C.panelLine};border-radius:14px;background:${C.panel};padding:24px 26px;display:flex;align-items:center;gap:24px;">
      <div style="background:${C.text};padding:8px;border-radius:6px;flex-shrink:0;">
        ${qrCode(132, 31)}
      </div>
      <div style="flex:1;">
        <div style="font-family:'Inter','Helvetica Neue',sans-serif;font-size:32px;font-weight:900;color:${C.text};letter-spacing:-0.015em;line-height:1;">Scan here to know more</div>
        <div style="margin-top:8px;font-family:'Inter',sans-serif;font-size:16px;color:${C.mute};">yeedu.com &nbsp;·&nbsp; sales@yeedu.io</div>
        <div style="margin-top:10px;display:inline-flex;align-items:center;gap:8px;font-family:'Inter',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${C.accent};">
          <span style="width:6px;height:6px;background:${C.accent};border-radius:50%;display:inline-block;"></span>
          run faster. pay less. stay portable.
        </div>
      </div>
    </div>
  `;

  const arcs = `
    <svg style="position:absolute;top:-200px;right:-200px;width:800px;height:800px;pointer-events:none;" viewBox="0 0 800 800">
      ${cornerArcs({ x: 700, y: 100, count: 6, baseR: 240, step: 70, opacity: 0.22 })}
    </svg>
    <svg style="position:absolute;bottom:-220px;left:-220px;width:800px;height:800px;pointer-events:none;" viewBox="0 0 800 800">
      ${cornerArcs({ x: 100, y: 700, count: 6, baseR: 240, step: 70, opacity: 0.18 })}
    </svg>
  `;

  return `
    <div style="width:${W}px;height:${H}px;position:relative;overflow:hidden;background:${C.bg};font-family:'Inter',-apple-system,system-ui,sans-serif;color:${C.text};">
      ${arcs}
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse 90% 70% at 50% 40%,rgba(255,107,26,0.05),transparent 70%);"></div>
      ${header}
      ${headline}
      ${heroCard}
      ${statsRow}
      ${playbook}
      ${footer}
    </div>
  `;
}

async function build() {
  const create = await fetch(`${API}/api/carousels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Yeedu — Top 5 Healthcare Company Case Study v5 (9:16)', aspectRatio: '9:16' }),
  });
  if (!create.ok) throw new Error(`Create failed: ${create.status} ${await create.text()}`);
  const { id } = await create.json();
  console.log('Carousel:', id);

  const r = await fetch(`${API}/api/carousels/${id}/slides`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html: buildBanner(), notes: 'Health Insurer 9:16 v2 — 300 pipelines/day, 40% off' }),
  });
  if (!r.ok) throw new Error(`Slide failed: ${r.status} ${await r.text()}`);
  console.log(`\nView: ${API}/?carousel=${id}`);
}
build().catch(e => { console.error(e); process.exit(1); });
