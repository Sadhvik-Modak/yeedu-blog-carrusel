// Yeedu BYOC banner — Bring Your Own Catalog (Hive · Unity · Glue), RBAC preserved
// 9:16 (1080×1920) — same warm-dark + orange Yeedu theme as the office banners
const API = 'http://localhost:3000';
const LOGO = '/uploads/7d95c235-aa75-4cb1-a3c2-e84314ceca33.png';
const W = 1080, H = 1920;

const C = {
  bg: '#050505',
  panel: '#0e0c0a',
  panelLine: '#1c1814',
  panelHi: '#15110d',
  accent: '#ff6b1a',
  accentDeep: '#f2600c',
  accentLight: '#ff8a3d',
  accentSoft: 'rgba(255,107,26,0.10)',
  text: '#ffffff',
  mute: '#9a948c',
  mute2: '#6e6862',
  goodBg: 'rgba(62,207,106,0.10)',
  good: '#3ecf6a',
};

// ---------- QR mockup ----------
function qrCode(size = 130, seed = 42) {
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

// ---------- corner concentric arcs (matches reference) ----------
function cornerArcs({ x, y, count = 5, baseR = 240, step = 80, opacity = 0.18 }) {
  const circles = [];
  for (let i = 0; i < count; i++) {
    circles.push(`<circle cx="${x}" cy="${y}" r="${baseR + i * step}" fill="none" stroke="${C.accent}" stroke-width="1.2" opacity="${(opacity - i * 0.022).toFixed(3)}"/>`);
  }
  return circles.join('');
}

// ---------- 3-layer architecture diagram ----------
function archDiagram() {
  // SVG: layered stacks with vertical flow arrows
  const w = 960, h = 700;
  const layerH = 138;
  const layerGap = 70;
  // Y positions
  const yTop = 20;
  const yMid = yTop + layerH + layerGap;
  const yBot = yMid + layerH + layerGap;

  // Pill cluster generator (centered)
  const pillRow = (items, y, color = C.text, bgColor = '#1a1612', borderColor = C.panelLine) => {
    const gap = 14;
    // Estimate widths by char count (12px per char + 28 padding)
    const widths = items.map(t => Math.max(110, t.length * 11 + 36));
    const total = widths.reduce((a, b) => a + b, 0) + gap * (widths.length - 1);
    let x = (w - total) / 2;
    const els = items.map((t, i) => {
      const ww = widths[i];
      const cell = `
        <g>
          <rect x="${x}" y="${y}" width="${ww}" height="40" rx="6" fill="${bgColor}" stroke="${borderColor}" stroke-width="1"/>
          <text x="${x + ww / 2}" y="${y + 26}" text-anchor="middle" font-family="Inter,sans-serif" font-size="14" font-weight="700" fill="${color}" letter-spacing="0.06em">${t}</text>
        </g>`;
      x += ww + gap;
      return cell;
    });
    return els.join('');
  };

  // Down arrow between layers
  const downArrow = (cx, cy, color = C.accent) => `
    <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy + 40}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M ${cx - 6} ${cy + 32} L ${cx} ${cy + 42} L ${cx + 6} ${cy + 32}" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <circle cx="${cx}" cy="${cy + 4}" r="3" fill="${color}"/>
  `;

  return `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <!-- TOP LAYER: apps -->
      <rect x="0" y="${yTop}" width="${w}" height="${layerH}" rx="14" fill="${C.panel}" stroke="${C.panelLine}" stroke-width="1.5"/>
      <text x="32" y="${yTop + 30}" font-family="Inter,sans-serif" font-size="11" font-weight="800" letter-spacing="0.32em" fill="${C.mute}">YOUR APPLICATIONS · UNCHANGED</text>
      <text x="${w - 32}" y="${yTop + 30}" text-anchor="end" font-family="Inter,sans-serif" font-size="11" font-weight="700" letter-spacing="0.18em" fill="${C.mute2}">no rewrites</text>
      ${pillRow(['Spark SQL', 'PySpark', 'Notebooks', 'BI Tools', 'dbt'], yTop + 56)}

      <!-- arrow down -->
      ${downArrow(w / 2, yTop + layerH - 4)}

      <!-- MIDDLE LAYER: Yeedu compute (highlighted) -->
      <rect x="0" y="${yMid}" width="${w}" height="${layerH}" rx="14" fill="${C.panelHi}" stroke="${C.accent}" stroke-width="1.5"/>
      <rect x="0" y="${yMid}" width="${w}" height="${layerH}" rx="14" fill="url(#yeedu-glow)" opacity="0.6"/>
      <defs>
        <linearGradient id="yeedu-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${C.accent}" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="${C.accent}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <text x="32" y="${yMid + 30}" font-family="Inter,sans-serif" font-size="11" font-weight="800" letter-spacing="0.32em" fill="${C.accent}">YEEDU COMPUTE LAYER</text>
      <text x="${w - 32}" y="${yMid + 30}" text-anchor="end" font-family="Inter,sans-serif" font-size="11" font-weight="700" letter-spacing="0.18em" fill="${C.accentLight}">read-through · acl-aware · zero-copy</text>
      ${pillRow(['Hive Adapter', 'Unity Adapter', 'Glue Adapter', 'Iceberg Native', 'Delta Native'], yMid + 56, '#ffe9d4', 'rgba(255,107,26,0.12)', 'rgba(255,107,26,0.45)')}

      <!-- arrow down -->
      ${downArrow(w / 2, yMid + layerH - 4)}

      <!-- BOTTOM LAYER: customer catalogs -->
      <rect x="0" y="${yBot}" width="${w}" height="${layerH}" rx="14" fill="${C.panel}" stroke="${C.panelLine}" stroke-width="1.5"/>
      <text x="32" y="${yBot + 30}" font-family="Inter,sans-serif" font-size="11" font-weight="800" letter-spacing="0.32em" fill="${C.mute}">YOUR CATALOGS · UNTOUCHED</text>
      <text x="${w - 32}" y="${yBot + 30}" text-anchor="end" font-family="Inter,sans-serif" font-size="11" font-weight="700" letter-spacing="0.18em" fill="${C.mute2}">rbac · lineage · partitioning preserved</text>
      ${pillRow(['Hive Metastore', 'Unity Catalog', 'AWS Glue', 'Iceberg REST', 'Custom'], yBot + 56)}
    </svg>
  `;
}

// ---------- RBAC mini-diagram (user → policy → table) ----------
function rbacRow() {
  const items = [
    { label: 'YOUR USER', sub: 'analyst@you.com', icon: 'user' },
    { label: 'YOUR GRANTS', sub: 'IAM · group · table ACL', icon: 'shield' },
    { label: 'YEEDU', sub: 'reads only what is allowed', icon: 'yeedu' },
    { label: 'YOUR DATA', sub: 'files stay in place', icon: 'data' },
  ];
  // arrow between cells
  const arrow = `<svg width="32" height="22" viewBox="0 0 32 22" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;">
    <path d="M 0 11 L 22 11 M 18 4 L 26 11 L 18 18" stroke="${C.accent}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const iconFor = (k) => {
    const stroke = k === 'yeedu' ? C.accent : C.accentLight;
    if (k === 'user') return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>`;
    if (k === 'shield') return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>`;
    if (k === 'data') return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>`;
    // yeedu mark — small circle with orange dot
    return `<div style="width:22px;height:22px;border-radius:6px;background:${C.accent};display:flex;align-items:center;justify-content:center;"><img src="${LOGO}" style="height:14px;filter:brightness(0) invert(1);"/></div>`;
  };

  const cell = (it, isYeedu) => `
    <div style="flex:1;padding:14px 14px;background:${isYeedu ? 'rgba(255,107,26,0.08)' : C.panel};border:1px solid ${isYeedu ? 'rgba(255,107,26,0.45)' : C.panelLine};border-radius:10px;">
      <div style="display:flex;align-items:center;gap:10px;">
        ${it.icon === 'yeedu' ? iconFor('yeedu') : iconFor(it.icon)}
        <div style="font-family:'Inter',sans-serif;font-size:11px;font-weight:800;letter-spacing:0.24em;text-transform:uppercase;color:${isYeedu ? C.accent : C.mute};">${it.label}</div>
      </div>
      <div style="margin-top:6px;font-family:'Inter',sans-serif;font-size:13px;color:${isYeedu ? C.text : C.text};">${it.sub}</div>
    </div>
  `;

  // Build with arrows interleaved
  return `
    <div style="display:flex;align-items:stretch;gap:8px;">
      ${cell(items[0], false)}
      <div style="display:flex;align-items:center;">${arrow}</div>
      ${cell(items[1], false)}
      <div style="display:flex;align-items:center;">${arrow}</div>
      ${cell(items[2], true)}
      <div style="display:flex;align-items:center;">${arrow}</div>
      ${cell(items[3], false)}
    </div>
  `;
}

// ---------- Banner ----------
function buildBanner() {
  // Header
  const header = `
    <div style="position:absolute;top:60px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:flex-start;">
      <img src="${LOGO}" style="height:48px;filter:brightness(0) invert(1);"/>
      <div style="text-align:right;">
        <div style="font-family:'Inter',sans-serif;font-size:18px;font-weight:600;color:${C.text};line-height:1;">yeedu.com</div>
        <div style="margin-top:4px;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.34em;text-transform:uppercase;color:${C.accent};">native catalog integration</div>
      </div>
    </div>
  `;

  // Headline section
  const headline = `
    <div style="position:absolute;top:180px;left:0;right:0;text-align:center;">
      <div style="display:inline-block;padding:6px 18px;border:1px solid ${C.accent};border-radius:999px;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.32em;text-transform:uppercase;color:${C.accent};">
        ★ bring your own catalog ★
      </div>
    </div>
    <div style="position:absolute;top:240px;left:60px;right:60px;text-align:center;">
      <div style="font-family:'Inter','Helvetica Neue',sans-serif;font-size:104px;font-weight:900;color:${C.text};letter-spacing:-0.035em;line-height:0.95;">Your catalog,</div>
      <div style="font-family:'Inter','Helvetica Neue',sans-serif;font-size:104px;font-style:italic;font-weight:900;color:${C.text};letter-spacing:-0.035em;line-height:0.95;margin-top:4px;">your rules.</div>
    </div>
    <div style="position:absolute;top:480px;left:120px;right:120px;text-align:center;">
      <div style="font-family:'Inter',sans-serif;font-size:21px;font-weight:400;color:${C.mute};letter-spacing:-0.005em;line-height:1.45;">
        Yeedu reads your <span style="color:${C.text};font-weight:600;">Hive · Unity · Glue</span> catalogs natively. <span style="color:${C.accent};font-weight:700;">RBAC, lineage, and partitioning preserved</span> — without re-registration or data movement.
      </div>
    </div>
  `;

  // Architecture diagram
  const arch = `
    <div style="position:absolute;top:620px;left:60px;right:60px;">
      ${archDiagram()}
    </div>
  `;

  // RBAC row — preserving access controls
  const rbac = `
    <div style="position:absolute;top:1370px;left:60px;right:60px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:14px;">
        <div style="font-family:'Inter',sans-serif;font-size:11px;font-weight:800;letter-spacing:0.32em;text-transform:uppercase;color:${C.mute};">how rbac stays intact</div>
        <div style="font-family:'Inter',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:${C.accent};">no re-grants. ever.</div>
      </div>
      ${rbacRow()}
    </div>
  `;

  // Stats row — 4 columns
  const stats = `
    <div style="position:absolute;top:1570px;left:60px;right:60px;display:flex;justify-content:space-between;gap:8px;border-top:1px solid ${C.panelLine};border-bottom:1px solid ${C.panelLine};padding:18px 0;">
      ${[
        ['0', 'tables to re-register', C.accent],
        ['Native', 'rbac preserved', C.text],
        ['Zero', 'data movement', C.text],
        ['5+', 'catalogs supported', C.text],
      ].map(([num, label, col]) => `
        <div style="flex:1;text-align:center;">
          <div style="font-family:'Inter','Helvetica Neue',sans-serif;font-size:48px;font-weight:900;color:${col};letter-spacing:-0.03em;line-height:1;">${num}</div>
          <div style="margin-top:10px;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.26em;text-transform:uppercase;color:${C.mute};">${label}</div>
        </div>
      `).join('<div style="width:1px;background:#1c1814;"></div>')}
    </div>
  `;

  // Footer
  const footer = `
    <div style="position:absolute;bottom:60px;left:60px;right:60px;border:1px solid ${C.panelLine};border-radius:14px;background:${C.panel};padding:24px 26px;display:flex;align-items:center;gap:24px;">
      <div style="background:${C.text};padding:8px;border-radius:6px;flex-shrink:0;">
        ${qrCode(132, 91)}
      </div>
      <div style="flex:1;">
        <div style="font-family:'Inter','Helvetica Neue',sans-serif;font-size:32px;font-weight:900;color:${C.text};letter-spacing:-0.015em;line-height:1;">Scan here to know more</div>
        <div style="margin-top:8px;font-family:'Inter',sans-serif;font-size:16px;color:${C.mute};">yeedu.com &nbsp;·&nbsp; sales@yeedu.io</div>
        <div style="margin-top:10px;display:inline-flex;align-items:center;gap:8px;font-family:'Inter',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${C.accent};">
          <span style="width:6px;height:6px;background:${C.accent};border-radius:50%;display:inline-block;"></span>
          plug in. keep your truth.
        </div>
      </div>
    </div>
  `;

  // Decorative arcs
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
      <!-- subtle warm vignette -->
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse 90% 70% at 50% 40%,rgba(255,107,26,0.05),transparent 70%);"></div>
      ${header}
      ${headline}
      ${arch}
      ${rbac}
      ${stats}
      ${footer}
    </div>
  `;
}

// ---------- Build ----------
async function build() {
  const create = await fetch(`${API}/api/carousels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Yeedu — BYOC (Hive · Unity · Glue, RBAC preserved) 9:16', aspectRatio: '9:16' }),
  });
  if (!create.ok) throw new Error(`Create failed: ${create.status} ${await create.text()}`);
  const { id } = await create.json();
  console.log('Carousel:', id);

  const r = await fetch(`${API}/api/carousels/${id}/slides`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html: buildBanner(), notes: 'BYOC — Hive · Unity · Glue · RBAC preserved' }),
  });
  if (!r.ok) throw new Error(`Slide failed: ${r.status} ${await r.text()}`);
  console.log(`\nView: ${API}/?carousel=${id}`);
}
build().catch(e => { console.error(e); process.exit(1); });
