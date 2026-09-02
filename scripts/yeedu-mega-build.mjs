// ════════════════════════════════════════════════════════════════
// Yeedu Mega Carousel Build — 8 topics × 3 ratios = 24 carousels
// ════════════════════════════════════════════════════════════════
import QRCode from 'qrcode';

const BASE = 'http://localhost:3000';
const LOGO = '/uploads/7d95c235-aa75-4cb1-a3c2-e84314ceca33.png';
const QR_URL = 'https://yeedu.io';

const C = {
  orange:      '#f2600c',
  orangeLight: '#ff8a3d',
  orangeGlow:  'rgba(242,96,12,0.35)',
  orangeDim:   'rgba(242,96,12,0.18)',
  brown:       '#26221d',
  brownDeep:   '#14110d',
  text:        '#ffffff',
  text2:       'rgba(255,255,255,0.72)',
  text3:       'rgba(255,255,255,0.42)',
  rule:        'rgba(255,255,255,0.08)',
  ruleWarm:    'rgba(242,140,90,0.15)',
};

// ratio-dependent sizing
const RATIOS = {
  '1:1':  { w:1080, h:1080, padX:70, padTop:64, eyebrow:14, h1:64, h1tight:74, h2:36, body:18, bigStat:160, card:18, gap:14 },
  '4:5':  { w:1080, h:1350, padX:80, padTop:90, eyebrow:16, h1:88, h1tight:108, h2:46, body:22, bigStat:200, card:22, gap:18 },
  '9:16': { w:1080, h:1920, padX:80, padTop:110, eyebrow:18, h1:108, h1tight:140, h2:54, body:24, bigStat:240, card:26, gap:22 },
};

const cardBg = `background:linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015));border:1px solid ${C.rule};backdrop-filter:blur(8px);`;

// ── QR pre-render (single SVG reused on every CTA) ─────────────
const qrSvg = await QRCode.toString(QR_URL, {
  type: 'svg',
  margin: 0,
  errorCorrectionLevel: 'M',
  color: { dark: '#ffffff', light: '#00000000' },
});
// strip outer <svg> attrs so we can inject our own width
const qrInner = qrSvg.replace(/<svg[^>]*>/, '').replace('</svg>', '');
function qrCode(size = 180) {
  return `<svg viewBox="0 0 29 29" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${qrInner}</svg>`;
}

// ── Stage shell ─────────────────────────────────────────────────
const GLOW_VARIANTS = {
  A: { g1:'radial-gradient(ellipse 55% 45% at 90% -5%, rgba(242,96,12,0.32), transparent 55%)',
       g2:'radial-gradient(ellipse 50% 40% at 10% 100%, rgba(242,140,60,0.18), transparent 60%)',
       g3:'radial-gradient(circle at 65% 50%, rgba(255,138,61,0.08), transparent 50%)' },
  B: { g1:'radial-gradient(ellipse 60% 50% at 8% 0%, rgba(242,96,12,0.28), transparent 55%)',
       g2:'radial-gradient(ellipse 50% 40% at 95% 80%, rgba(242,140,60,0.22), transparent 55%)',
       g3:'radial-gradient(circle at 40% 60%, rgba(255,138,61,0.10), transparent 55%)' },
  C: { g1:'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(242,96,12,0.32), transparent 55%)',
       g2:'radial-gradient(ellipse 60% 45% at 50% 110%, rgba(242,140,60,0.22), transparent 55%)',
       g3:'radial-gradient(circle at 20% 40%, rgba(255,138,61,0.08), transparent 55%)' },
  D: { g1:'radial-gradient(ellipse 55% 45% at 100% 50%, rgba(242,96,12,0.30), transparent 55%)',
       g2:'radial-gradient(ellipse 45% 35% at 0% 50%, rgba(242,140,60,0.18), transparent 60%)',
       g3:'radial-gradient(circle at 50% 20%, rgba(255,138,61,0.10), transparent 55%)' },
};
const variantSeq = ['A','B','C','D','A','B','C','D'];

function stage(innerHTML, R, variant = 'A') {
  const v = GLOW_VARIANTS[variant];
  return `
<div style="width:${R.w}px;height:${R.h}px;position:relative;overflow:hidden;font-family:'Inter',sans-serif;color:${C.text};background:linear-gradient(160deg,${C.brown} 0%,${C.brownDeep} 50%,#0a0807 100%);-webkit-font-smoothing:antialiased;">
  <div style="position:absolute;inset:0;background:${v.g1};pointer-events:none;"></div>
  <div style="position:absolute;inset:0;background:${v.g2};pointer-events:none;"></div>
  <div style="position:absolute;inset:0;background:${v.g3};pointer-events:none;"></div>
  <div style="position:absolute;inset:0;background-image:radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0);background-size:32px 32px;opacity:0.7;pointer-events:none;"></div>
  <svg style="position:absolute;top:0;right:0;width:${Math.round(R.w*0.36)}px;height:${Math.round(R.w*0.36)}px;opacity:0.16;pointer-events:none;" viewBox="0 0 380 380">
    ${[120,160,200,240,280,320].map(r=>`<circle cx="380" cy="0" r="${r}" fill="none" stroke="${C.orange}" stroke-width="1" stroke-dasharray="2 6"/>`).join('')}
  </svg>
  <svg style="position:absolute;bottom:0;left:0;width:${Math.round(R.w*0.28)}px;height:${Math.round(R.w*0.28)}px;opacity:0.12;pointer-events:none;" viewBox="0 0 300 300">
    ${[60,100,140,180,220,260].map(r=>`<circle cx="0" cy="300" r="${r}" fill="none" stroke="${C.orangeLight}" stroke-width="1"/>`).join('')}
  </svg>
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse 90% 90% at 50% 50%,transparent 60%,rgba(0,0,0,0.45) 100%);pointer-events:none;"></div>
  <div style="position:relative;z-index:2;width:100%;height:100%;">${innerHTML}</div>
  <div style="position:absolute;left:${R.padX}px;right:${R.padX}px;bottom:${Math.round(R.padX*0.6)}px;display:flex;align-items:center;justify-content:space-between;font-size:16px;color:${C.text3};z-index:5;">
    <img src="${LOGO}" style="height:26px;opacity:0.9;" />
    <span style="font-weight:500;letter-spacing:0.5px;">yeedu.io</span>
  </div>
</div>`;
}

function eyebrow(text, R) {
  return `<div style="display:inline-flex;align-items:center;gap:10px;padding:7px 14px;background:${C.orangeDim};border:1px solid ${C.ruleWarm};border-radius:999px;font-size:${R.eyebrow}px;font-weight:600;color:${C.orangeLight};letter-spacing:1.5px;text-transform:uppercase;">
    <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${C.orange};box-shadow:0 0 10px ${C.orange};"></span>${text}
  </div>`;
}

function headline(lines, R, { tight = false } = {}) {
  const size = tight ? R.h1tight : R.h1;
  return `<h1 style="margin:24px 0 0;font-family:'Montserrat',sans-serif;font-weight:800;font-size:${size}px;line-height:0.95;letter-spacing:-2.5px;">
    ${lines[0]}<br/><span style="font-weight:300;font-style:italic;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">${lines[1]||''}</span>
  </h1>`;
}

function tagline(text, R) {
  return `<p style="margin-top:18px;font-size:${R.body}px;line-height:1.45;color:${C.text2};max-width:${Math.round(R.w*0.78)}px;">${text}</p>`;
}

// ── SVG icon (iconsax-style linear, 24-grid, white stroke) ─────
const ICONS = {
  bolt:    '<path d="M13 3L4 14h7l-1 8 9-11h-7l1-8z" stroke="white" stroke-width="1.8" stroke-linejoin="round" fill="none"/>',
  shield:  '<path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10z" stroke="white" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
  chart:   '<path d="M4 20V8m6 12V4m6 16v-7m6 7V11" stroke="white" stroke-width="1.8" stroke-linecap="round"/>',
  cube:    '<path d="M12 2l9 5v10l-9 5-9-5V7l9-5zM3 7l9 5 9-5M12 12v10" stroke="white" stroke-width="1.8" stroke-linejoin="round" fill="none"/>',
  cloud:   '<path d="M7 19a5 5 0 010-10 6 6 0 0111-3 5 5 0 011 10H7z" stroke="white" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
  code:    '<path d="M8 6l-6 6 6 6m8-12l6 6-6 6m-2-16l-4 20" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  dollar:  '<path d="M12 1v22m6-17H9a3 3 0 100 6h6a3 3 0 110 6H6" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  cpu:     '<rect x="5" y="5" width="14" height="14" rx="2" stroke="white" stroke-width="1.8" fill="none"/><rect x="9" y="9" width="6" height="6" stroke="white" stroke-width="1.8" fill="none"/><path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" stroke="white" stroke-width="1.6"/>',
  stream:  '<path d="M3 6h18M3 12h18M3 18h18" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="3 3"/><circle cx="6" cy="6" r="1.5" fill="white"/><circle cx="13" cy="12" r="1.5" fill="white"/><circle cx="9" cy="18" r="1.5" fill="white"/>',
  layers:  '<path d="M12 2l10 6-10 6L2 8l10-6zM2 14l10 6 10-6M2 11l10 6 10-6" stroke="white" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
  zap:     '<path d="M13 2L4 14h7l-1 8 9-11h-7l1-8z" stroke="white" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
  globe:   '<circle cx="12" cy="12" r="10" stroke="white" stroke-width="1.8" fill="none"/><path d="M2 12h20M12 2c3 3 5 6 5 10s-2 7-5 10c-3-3-5-6-5-10s2-7 5-10z" stroke="white" stroke-width="1.6" fill="none"/>',
  lock:    '<rect x="4" y="11" width="16" height="10" rx="2" stroke="white" stroke-width="1.8" fill="none"/><path d="M8 11V7a4 4 0 018 0v4" stroke="white" stroke-width="1.8" fill="none"/>',
  rocket:  '<path d="M5 17l2 2c2 2 4 0 5-2l8-13c-7 1-12 6-13 13l-2 5z" stroke="white" stroke-width="1.8" fill="none" stroke-linejoin="round"/><circle cx="15" cy="9" r="2" stroke="white" stroke-width="1.8" fill="none"/>',
  arrows:  '<path d="M3 12h18M3 12l4-4M3 12l4 4M21 8l-4 4M21 16l-4-4" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  ai:      '<path d="M12 4v4M12 16v4M4 12h4M16 12h4M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3" stroke="white" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="12" r="3" stroke="white" stroke-width="1.8" fill="none"/>',
};
function icon(name, size = 28) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="color:white;">${ICONS[name] || ICONS.bolt}</svg>`;
}

// ── Slide renderers ────────────────────────────────────────────

function renderCover(d, R, variant) {
  const padX = R.padX;
  const heroSize = Math.min(R.w * 0.32, 360);
  const inner = `
    <div style="position:absolute;top:${R.padTop}px;left:${padX}px;">
      <img src="${LOGO}" style="height:${R.h<1100?34:42}px;" />
    </div>
    <svg viewBox="0 0 420 420" style="position:absolute;top:${R.padTop*0.7}px;right:${padX*0.6}px;width:${heroSize}px;height:${heroSize}px;">
      <defs><radialGradient id="cv-${R.h}" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${C.orange}" stop-opacity="1"/><stop offset="60%" stop-color="${C.orange}" stop-opacity="0.4"/><stop offset="100%" stop-color="${C.orange}" stop-opacity="0"/></radialGradient></defs>
      ${[190,160,130,100].map((r,i)=>`<circle cx="210" cy="210" r="${r}" fill="none" stroke="rgba(255,255,255,${0.05+i*0.04})" stroke-width="1"/>`).join('')}
      <circle cx="210" cy="210" r="175" fill="none" stroke="${C.orangeGlow}" stroke-width="1.5" stroke-dasharray="4 10"/>
      ${[0,30,60,90,120,150,180,210,240,270,300,330].map(deg=>{const r=175,x=210+r*Math.cos(deg*Math.PI/180),y=210+r*Math.sin(deg*Math.PI/180),big=deg%90===0;return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${big?5:3}" fill="${C.orangeLight}" style="${big?`filter:drop-shadow(0 0 6px ${C.orange});`:''}"/>`;}).join('')}
      <circle cx="210" cy="210" r="84" fill="url(#cv-${R.h})"/>
      <circle cx="210" cy="210" r="52" fill="${C.orange}" style="filter:drop-shadow(0 0 36px ${C.orange});"/>
      <text x="210" y="220" text-anchor="middle" fill="#fff" font-family="Montserrat" font-weight="800" font-size="${R.h<1100?20:26}" letter-spacing="3">${d.coreLabel||'SPARK'}</text>
    </svg>
    <div style="position:absolute;top:${Math.round(R.h*0.40)}px;left:${padX}px;right:${padX}px;">
      ${eyebrow(d.eyebrow || 'Introducing', R)}
      ${headline(d.headline, R, { tight: true })}
      ${tagline(d.tagline, R)}
    </div>
    <div style="position:absolute;left:${padX}px;right:${padX}px;bottom:${Math.round(R.padTop*1.5)}px;display:flex;gap:0;padding-top:${R.gap}px;border-top:1px solid ${C.ruleWarm};">
      ${(d.stats||[]).map(([n,l],i)=>`<div style="flex:1;${i>0?`border-left:1px solid ${C.rule};padding-left:${R.gap}px;`:''}">
        <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:${Math.round(R.h1*0.4)}px;letter-spacing:-1.5px;line-height:1;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">${n}</div>
        <div style="margin-top:6px;font-size:${R.eyebrow-2}px;color:${C.text2};letter-spacing:1px;text-transform:uppercase;">${l}</div>
      </div>`).join('')}
    </div>
  `;
  return stage(inner, R, variant);
}

function renderPain(d, R, variant) {
  const items = d.items || [];
  const inner = `
    <div style="position:absolute;top:${R.padTop}px;left:${R.padX}px;right:${R.padX}px;">
      ${eyebrow(d.eyebrow, R)}
      ${headline(d.headline, R)}
      ${d.tagline ? tagline(d.tagline, R) : ''}
    </div>
    <div style="position:absolute;left:${R.padX}px;right:${R.padX}px;top:${Math.round(R.h*0.42)}px;display:flex;flex-direction:column;gap:${R.gap}px;">
      ${items.map(([iconName, title, body])=>`
        <div style="display:flex;gap:${R.gap+8}px;padding:${R.card+4}px;${cardBg}border-radius:18px;align-items:center;">
          <div style="width:${R.h<1100?56:72}px;height:${R.h<1100?56:72}px;border-radius:14px;background:rgba(242,96,12,0.15);border:1px solid rgba(242,96,12,0.3);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            ${icon(iconName, R.h<1100?28:36)}
          </div>
          <div>
            <div style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:${R.h2*0.55}px;color:${C.text};letter-spacing:-0.3px;">${title}</div>
            <div style="margin-top:4px;font-size:${R.body-2}px;color:${C.text2};line-height:1.4;">${body}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  return stage(inner, R, variant);
}

function renderHeroStat(d, R, variant) {
  const inner = `
    <div style="position:absolute;top:${R.padTop}px;left:${R.padX}px;right:${R.padX}px;">
      ${eyebrow(d.eyebrow, R)}
    </div>
    <div style="position:absolute;top:${Math.round(R.h*0.32)}px;left:${R.padX}px;right:${R.padX}px;">
      <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:${R.bigStat*2}px;line-height:0.88;letter-spacing:-${R.bigStat*0.05}px;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">${d.number}</div>
      <div style="margin-top:${R.gap+10}px;font-family:'Montserrat',sans-serif;font-weight:600;font-size:${R.h2}px;line-height:1.1;letter-spacing:-1px;max-width:${R.w*0.85}px;">${d.subheadline}</div>
      <div style="margin-top:${R.gap}px;font-size:${R.body}px;color:${C.text2};line-height:1.45;max-width:${R.w*0.8}px;">${d.body}</div>
    </div>
    ${d.stats ? `<div style="position:absolute;left:${R.padX}px;right:${R.padX}px;bottom:${Math.round(R.padTop*1.7)}px;display:flex;gap:${R.gap}px;">
      ${d.stats.map(([k,v])=>`<div style="flex:1;padding:${R.card}px;${cardBg}border-radius:14px;">
        <div style="font-size:${R.eyebrow-3}px;color:${C.text3};letter-spacing:1.5px;text-transform:uppercase;">${k}</div>
        <div style="margin-top:6px;font-family:'Montserrat',sans-serif;font-weight:800;font-size:${R.h2*0.7}px;color:${C.orangeLight};line-height:1;">${v}</div>
      </div>`).join('')}
    </div>` : ''}
  `;
  return stage(inner, R, variant);
}

function renderBars(d, R, variant) {
  const items = d.items.slice(0, R.h<1100 ? 3 : 4);
  const maxVal = Math.max(...items.flatMap(it=>[it[1], it[2]]));
  const chartW = R.w - 2*R.padX - 60;
  const rowH = R.h<1100 ? 100 : 130;
  const chartH = items.length * rowH + 60;
  const inner = `
    <div style="position:absolute;top:${R.padTop}px;left:${R.padX}px;right:${R.padX}px;">
      ${eyebrow(d.eyebrow, R)}
      ${headline(d.headline, R)}
      ${d.tagline ? tagline(d.tagline, R) : ''}
    </div>
    <div style="position:absolute;left:${R.padX}px;right:${R.padX}px;top:${Math.round(R.h*0.43)}px;padding:${R.card+8}px;${cardBg}border-radius:22px;">
      <svg viewBox="0 0 ${chartW} ${chartH}" style="width:100%;height:auto;display:block;">
        <defs><linearGradient id="br-${R.h}" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stop-color="${C.orange}"/><stop offset="100%" stop-color="${C.orangeLight}"/></linearGradient></defs>
        <text x="0" y="14" fill="${C.text3}" font-size="11" font-family="Inter" letter-spacing="1.5">WORKLOAD</text>
        <text x="${chartW}" y="14" text-anchor="end" fill="${C.text3}" font-size="11" font-family="Inter" letter-spacing="1.5">EXECUTION TIME</text>
        ${items.map(([name,trad,yeedu,delta],i)=>{
          const y = 44 + i*rowH;
          const tradW = (trad/maxVal)*(chartW-100);
          const yeeduW = (yeedu/maxVal)*(chartW-100);
          return `
            <text x="0" y="${y+14}" fill="#fff" font-size="${R.h<1100?16:20}" font-family="Inter" font-weight="600">${name}</text>
            <text x="${chartW}" y="${y+14}" text-anchor="end" fill="${C.orangeLight}" font-size="${R.h<1100?16:18}" font-family="Montserrat" font-weight="700">${delta}</text>
            <rect x="0" y="${y+24}" width="${tradW}" height="16" rx="3" fill="rgba(255,255,255,0.18)"/>
            <text x="${tradW+8}" y="${y+37}" fill="${C.text2}" font-size="11" font-family="Inter">${trad}s</text>
            <rect x="0" y="${y+46}" width="${yeeduW}" height="16" rx="3" fill="url(#br-${R.h})" style="filter:drop-shadow(0 0 12px ${C.orangeGlow});"/>
            <text x="${yeeduW+8}" y="${y+59}" fill="${C.orangeLight}" font-size="11" font-family="Inter" font-weight="600">${yeedu}s</text>
          `;
        }).join('')}
        <g transform="translate(0,${chartH-10})">
          <rect x="0" y="-10" width="12" height="12" rx="2" fill="rgba(255,255,255,0.18)"/>
          <text x="18" y="0" fill="${C.text2}" font-size="11" font-family="Inter">Traditional Spark</text>
          <rect x="170" y="-10" width="12" height="12" rx="2" fill="${C.orange}"/>
          <text x="188" y="0" fill="${C.text2}" font-size="11" font-family="Inter">Yeedu Turbo</text>
        </g>
      </svg>
    </div>
  `;
  return stage(inner, R, variant);
}

function renderArea(d, R, variant) {
  const chartW = R.w - 2*R.padX - 60;
  const chartH = R.h<1100 ? 320 : (R.h<1500 ? 420 : 540);
  const inner = `
    <div style="position:absolute;top:${R.padTop}px;left:${R.padX}px;right:${R.padX}px;">
      ${eyebrow(d.eyebrow, R)}
      ${headline(d.headline, R)}
      ${d.tagline ? tagline(d.tagline, R) : ''}
    </div>
    <div style="position:absolute;left:${R.padX}px;right:${R.padX}px;top:${Math.round(R.h*0.43)}px;padding:${R.card+8}px;${cardBg}border-radius:22px;">
      <svg viewBox="0 0 ${chartW} ${chartH}" style="width:100%;height:auto;display:block;">
        <defs>
          <linearGradient id="tr-${R.h}" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="rgba(255,255,255,0.22)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></linearGradient>
          <linearGradient id="ye-${R.h}" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="rgba(242,96,12,0.45)"/><stop offset="100%" stop-color="rgba(242,96,12,0)"/></linearGradient>
        </defs>
        ${[0,1,2,3,4].map(i=>`<line x1="60" y1="${30+i*((chartH-100)/4)}" x2="${chartW-20}" y2="${30+i*((chartH-100)/4)}" stroke="${C.rule}"/>`).join('')}
        ${['$1.0M','$750K','$500K','$250K','$0'].map((t,i)=>`<text x="50" y="${35+i*((chartH-100)/4)}" text-anchor="end" fill="${C.text3}" font-size="11" font-family="Inter">${t}</text>`).join('')}
        ${['Jan','Mar','May','Jul','Sep','Nov'].map((t,i)=>`<text x="${60+i*((chartW-80)/5)}" y="${chartH-50}" fill="${C.text3}" font-size="11" font-family="Inter">${t}</text>`).join('')}
        <path d="M 60 90 C 220 88, 400 70, 580 60 S 880 40, ${chartW-20} 35 L ${chartW-20} ${chartH-90} L 60 ${chartH-90} Z" fill="url(#tr-${R.h})"/>
        <path d="M 60 90 C 220 88, 400 70, 580 60 S 880 40, ${chartW-20} 35" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="2.5" stroke-dasharray="4 4"/>
        <text x="${chartW-20}" y="22" text-anchor="end" fill="${C.text2}" font-size="12" font-family="Inter" font-weight="500">Traditional · projected</text>
        <path d="M 60 90 C 110 100, 160 ${chartH*0.35}, 220 ${chartH*0.45} S 380 ${chartH*0.49}, 480 ${chartH*0.48} S 720 ${chartH*0.47}, ${chartW-20} ${chartH*0.46} L ${chartW-20} ${chartH-90} L 60 ${chartH-90} Z" fill="url(#ye-${R.h})"/>
        <path d="M 60 90 C 110 100, 160 ${chartH*0.35}, 220 ${chartH*0.45} S 380 ${chartH*0.49}, 480 ${chartH*0.48} S 720 ${chartH*0.47}, ${chartW-20} ${chartH*0.46}" fill="none" stroke="${C.orange}" stroke-width="3" style="filter:drop-shadow(0 4px 14px ${C.orangeGlow});"/>
        <circle cx="${chartW-20}" cy="${chartH*0.46}" r="6" fill="${C.orange}"/>
        <text x="${chartW-30}" y="${chartH*0.46-10}" text-anchor="end" fill="${C.orangeLight}" font-size="12" font-family="Inter" font-weight="600">Yeedu · actual</text>
        <line x1="200" y1="20" x2="200" y2="${chartH-80}" stroke="${C.orangeGlow}" stroke-width="1" stroke-dasharray="3 4"/>
        <text x="208" y="20" fill="${C.orangeLight}" font-size="11" font-family="Inter" font-weight="600">Migration begins</text>
        <g transform="translate(${chartW-360},${chartH-50})">
          <rect x="0" y="0" width="340" height="40" rx="10" fill="rgba(242,96,12,0.12)" stroke="${C.orangeGlow}"/>
          <text x="14" y="16" fill="${C.text2}" font-size="10" font-family="Inter" letter-spacing="1.5">ANNUALIZED SAVINGS</text>
          <text x="14" y="32" fill="${C.orangeLight}" font-size="16" font-family="Montserrat" font-weight="700">$680K · 68% reduction</text>
        </g>
      </svg>
    </div>
  `;
  return stage(inner, R, variant);
}

function renderScale(d, R, variant) {
  const bars = d.bars || [['1 TB','$0.54',0.54],['3 TB','$0.52',0.52],['10 TB','$0.53',0.53]];
  const chartW = R.w - 2*R.padX - 60;
  const chartH = R.h<1100 ? 280 : (R.h<1500 ? 360 : 460);
  const barW = R.h<1100 ? 100 : 140;
  const gap = (chartW - bars.length*barW) / (bars.length+1);
  const inner = `
    <div style="position:absolute;top:${R.padTop}px;left:${R.padX}px;right:${R.padX}px;">
      ${eyebrow(d.eyebrow, R)}
      <h1 style="margin:24px 0 0;font-family:'Montserrat',sans-serif;font-weight:800;font-size:${R.h1*1.2}px;line-height:1;letter-spacing:-3px;">
        <span style="background:linear-gradient(135deg,${C.orangeLight},${C.orange});-webkit-background-clip:text;background-clip:text;color:transparent;">${d.bigNumber}</span>
        <span style="color:${C.text2};font-weight:300;font-size:${R.h2}px;letter-spacing:-1px;"> ${d.unit||'/ TB'}</span>
      </h1>
      ${d.tagline ? tagline(d.tagline, R) : ''}
    </div>
    <div style="position:absolute;left:${R.padX}px;right:${R.padX}px;top:${Math.round(R.h*0.43)}px;padding:${R.card+8}px;${cardBg}border-radius:22px;">
      <svg viewBox="0 0 ${chartW} ${chartH}" style="width:100%;height:auto;display:block;">
        <defs><linearGradient id="sc-${R.h}" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="${C.orangeLight}"/><stop offset="100%" stop-color="${C.orange}"/></linearGradient></defs>
        <line x1="0" y1="${chartH-60}" x2="${chartW}" y2="${chartH-60}" stroke="${C.rule}"/>
        ${bars.map(([label,cost,val],i)=>{
          const x = gap + i*(barW+gap), h = val*(chartH-100);
          return `
            <rect x="${x}" y="${chartH-60-h}" width="${barW}" height="${h}" rx="12" fill="url(#sc-${R.h})" style="filter:drop-shadow(0 8px 28px ${C.orangeGlow});"/>
            <text x="${x+barW/2}" y="${chartH-70-h}" text-anchor="middle" fill="#fff" font-size="${R.h<1100?22:28}" font-family="Montserrat" font-weight="700">${cost}</text>
            <text x="${x+barW/2}" y="${chartH-30}" text-anchor="middle" fill="${C.text2}" font-size="16" font-family="Inter" font-weight="500">${label}</text>
          `;
        }).join('')}
      </svg>
      ${d.stats?`<div style="display:flex;gap:${R.gap}px;margin-top:${R.gap}px;">
        ${d.stats.map(([k,v,d])=>`<div style="flex:1;padding:${R.card-4}px;background:rgba(0,0,0,0.25);border:1px solid ${C.rule};border-radius:12px;">
          <div style="font-size:${R.eyebrow-4}px;color:${C.text3};letter-spacing:1.5px;text-transform:uppercase;">${k}</div>
          <div style="margin-top:4px;font-family:'Montserrat',sans-serif;font-weight:800;font-size:${R.h2*0.7}px;color:${C.orangeLight};line-height:1;">${v}</div>
          <div style="margin-top:4px;font-size:${R.body-6}px;color:${C.text2};">${d}</div>
        </div>`).join('')}
      </div>`:''}
    </div>
  `;
  return stage(inner, R, variant);
}

function renderArch(d, R, variant) {
  const chartW = R.w - 2*R.padX - 60;
  const top = d.layers?.top || ['PySpark','Scala','Python','SQL','Notebooks'];
  const mid = d.layers?.mid || ['SIMD Kernels','Smart Scheduler','Job Multiplexer','Adaptive Memory'];
  const bot = d.layers?.bot || ['AWS','Azure','GCP','Kubernetes','On-prem'];
  const inner = `
    <div style="position:absolute;top:${R.padTop}px;left:${R.padX}px;right:${R.padX}px;">
      ${eyebrow(d.eyebrow, R)}
      ${headline(d.headline, R)}
    </div>
    <div style="position:absolute;left:${R.padX}px;right:${R.padX}px;top:${Math.round(R.h*0.36)}px;padding:${R.card+4}px;${cardBg}border-radius:22px;">
      <svg viewBox="0 0 ${chartW} 660" style="width:100%;height:auto;display:block;">
        <defs><linearGradient id="ar-${R.h}" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="${C.orange}"/><stop offset="100%" stop-color="#c44a08"/></linearGradient></defs>
        <rect x="0" y="0" width="${chartW}" height="90" rx="12" fill="rgba(255,255,255,0.025)" stroke="${C.rule}"/>
        <text x="20" y="28" fill="${C.text3}" font-size="11" font-family="Inter" letter-spacing="2">${d.layers?.topLabel||'YOUR CODE · UNCHANGED'}</text>
        <g transform="translate(20, 44)">${top.map((t,i)=>{const w=(chartW-40)/top.length-8;return `<rect x="${i*(w+8)}" y="0" width="${w}" height="30" rx="5" fill="rgba(255,255,255,0.05)" stroke="${C.rule}"/><text x="${i*(w+8)+w/2}" y="20" text-anchor="middle" fill="#fff" font-size="13" font-family="Inter" font-weight="500">${t}</text>`;}).join('')}</g>
        ${[0.2,0.5,0.8].map(p=>`<line x1="${chartW*p}" y1="92" x2="${chartW*p}" y2="125" stroke="${C.ruleWarm}" stroke-width="1.5"/><polygon points="${chartW*p-4},123 ${chartW*p+4},123 ${chartW*p},130" fill="${C.orangeLight}"/>`).join('')}
        <rect x="0" y="140" width="${chartW}" height="260" rx="18" fill="url(#ar-${R.h})" style="filter:drop-shadow(0 18px 50px rgba(242,96,12,0.4));"/>
        <text x="22" y="175" fill="rgba(255,255,255,0.9)" font-size="12" font-family="Inter" font-weight="600" letter-spacing="2">${d.layers?.midLabel||'YEEDU TURBO ENGINE'}</text>
        <text x="22" y="222" fill="#fff" font-size="38" font-family="Montserrat" font-weight="800" letter-spacing="-1">${d.layers?.midTitle||'C++ · SIMD · Vectorized'}</text>
        <g transform="translate(22, 254)">${mid.map((p,i)=>{const w=(chartW-44)/mid.length-8;return `<g transform="translate(${i*(w+8)},0)"><rect x="0" y="0" width="${w}" height="120" rx="10" fill="rgba(0,0,0,0.22)" stroke="rgba(255,255,255,0.2)"/><text x="12" y="32" fill="#fff" font-size="15" font-family="Inter" font-weight="700">${p}</text><g transform="translate(12, 56)">${[14,10,16,12,18,14].map((h,j)=>`<rect x="${j*14}" y="${22-h}" width="9" height="${h}" rx="1.5" fill="rgba(255,255,255,0.55)"/>`).join('')}</g></g>`;}).join('')}</g>
        ${[0.2,0.5,0.8].map(p=>`<line x1="${chartW*p}" y1="402" x2="${chartW*p}" y2="438" stroke="${C.ruleWarm}" stroke-width="1.5"/><polygon points="${chartW*p-4},436 ${chartW*p+4},436 ${chartW*p},443" fill="${C.orangeLight}"/>`).join('')}
        <rect x="0" y="450" width="${chartW}" height="120" rx="12" fill="rgba(255,255,255,0.025)" stroke="${C.rule}"/>
        <text x="20" y="478" fill="${C.text3}" font-size="11" font-family="Inter" letter-spacing="2">${d.layers?.botLabel||'RUNS IN YOUR ACCOUNT · BEHIND YOUR FIREWALL'}</text>
        <g transform="translate(20, 498)">${bot.map((t,i)=>{const w=(chartW-40)/bot.length-8;return `<rect x="${i*(w+8)}" y="0" width="${w}" height="48" rx="6" fill="rgba(255,255,255,0.05)" stroke="${C.rule}"/><text x="${i*(w+8)+w/2}" y="30" text-anchor="middle" fill="#fff" font-size="14" font-family="Inter" font-weight="600">${t}</text>`;}).join('')}</g>
      </svg>
    </div>
  `;
  return stage(inner, R, variant);
}

function renderHow(d, R, variant) {
  const items = d.items || [];
  const inner = `
    <div style="position:absolute;top:${R.padTop}px;left:${R.padX}px;right:${R.padX}px;">
      ${eyebrow(d.eyebrow, R)}
      ${headline(d.headline, R)}
    </div>
    <div style="position:absolute;left:${R.padX}px;right:${R.padX}px;top:${Math.round(R.h*0.42)}px;display:flex;flex-direction:column;gap:${R.gap}px;">
      ${items.map(([iconName,title,body])=>`
        <div style="display:flex;gap:${R.gap+8}px;padding:${R.card+4}px;${cardBg}border-left:4px solid ${C.orange};border-radius:18px;align-items:center;">
          <div style="width:${R.h<1100?56:72}px;height:${R.h<1100?56:72}px;border-radius:14px;background:rgba(242,96,12,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            ${icon(iconName, R.h<1100?28:36)}
          </div>
          <div>
            <div style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:${R.h2*0.55}px;color:${C.text};letter-spacing:-0.3px;">${title}</div>
            <div style="margin-top:6px;font-size:${R.body-2}px;color:${C.text2};line-height:1.5;max-width:${R.w*0.65}px;">${body}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  return stage(inner, R, variant);
}

function renderFlow(d, R, variant) {
  const chartW = R.w - 2*R.padX - 60;
  const chartH = R.h<1100 ? 380 : (R.h<1500 ? 460 : 580);
  const sources = d.sources || [['Databricks',60],['AWS EMR',130],['Dataproc',200],['Cloudera',270]];
  const inner = `
    <div style="position:absolute;top:${R.padTop}px;left:${R.padX}px;right:${R.padX}px;">
      ${eyebrow(d.eyebrow, R)}
      ${headline(d.headline, R)}
      ${d.tagline ? tagline(d.tagline, R) : ''}
    </div>
    <div style="position:absolute;left:${R.padX}px;right:${R.padX}px;top:${Math.round(R.h*0.43)}px;padding:${R.card+8}px;${cardBg}border-radius:22px;">
      <svg viewBox="0 0 ${chartW} ${chartH}" style="width:100%;height:auto;display:block;">
        <defs><linearGradient id="fl-${R.h}" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stop-color="${C.orange}"/><stop offset="100%" stop-color="${C.orangeLight}"/></linearGradient></defs>
        <text x="0" y="14" fill="${C.text3}" font-size="11" font-family="Inter" letter-spacing="2">BEFORE</text>
        ${sources.map(([name,y])=>`
          <rect x="0" y="${y}" width="${chartW*0.3}" height="48" rx="10" fill="rgba(255,255,255,0.05)" stroke="${C.rule}"/>
          <circle cx="20" cy="${y+24}" r="5" fill="rgba(255,255,255,0.4)"/>
          <text x="36" y="${y+30}" fill="#fff" font-size="16" font-family="Inter" font-weight="600">${name}</text>
          <line x1="${chartW*0.3+5}" y1="${y+24}" x2="${chartW*0.4}" y2="${chartH/2-30}" stroke="${C.ruleWarm}" stroke-width="1.5"/>
        `).join('')}
        <text x="${chartW/2}" y="14" text-anchor="middle" fill="${C.orangeLight}" font-size="11" font-family="Inter" letter-spacing="2" font-weight="600">${d.midLabel||'MIGRATION UTILITY'}</text>
        <rect x="${chartW*0.4}" y="${chartH/2-50}" width="${chartW*0.2}" height="100" rx="14" fill="url(#fl-${R.h})" style="filter:drop-shadow(0 14px 44px rgba(242,96,12,0.5));"/>
        <text x="${chartW*0.5}" y="${chartH/2-10}" text-anchor="middle" fill="#fff" font-size="${R.h<1100?16:20}" font-family="Montserrat" font-weight="700">${d.midTitle||'Auto-convert'}</text>
        <text x="${chartW*0.5}" y="${chartH/2+12}" text-anchor="middle" fill="rgba(255,255,255,0.92)" font-size="12" font-family="Inter">${d.midSub||'PySpark · Scala · configs'}</text>
        <text x="${chartW*0.5}" y="${chartH/2+30}" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-size="11" font-family="Inter" font-style="italic">${d.midNote||'Zero code changes'}</text>
        <text x="${chartW}" y="14" text-anchor="end" fill="${C.text3}" font-size="11" font-family="Inter" letter-spacing="2">AFTER</text>
        <rect x="${chartW*0.66}" y="${chartH/2-60}" width="${chartW*0.34}" height="120" rx="12" fill="rgba(242,96,12,0.12)" stroke="${C.orangeGlow}" stroke-width="1.5"/>
        <text x="${chartW*0.66+18}" y="${chartH/2-30}" fill="${C.orangeLight}" font-size="11" font-family="Inter" letter-spacing="1.5" font-weight="600">YEEDU TURBO</text>
        <text x="${chartW*0.66+18}" y="${chartH/2+2}" fill="#fff" font-size="18" font-family="Inter" font-weight="700">Same code</text>
        <text x="${chartW*0.66+18}" y="${chartH/2+24}" fill="#fff" font-size="18" font-family="Inter" font-weight="700">Faster execution</text>
        <text x="${chartW*0.66+18}" y="${chartH/2+46}" fill="${C.orangeLight}" font-size="13" font-family="Inter" font-weight="600">60–80% lower cost</text>
        <line x1="${chartW*0.6}" y1="${chartH/2}" x2="${chartW*0.66-5}" y2="${chartH/2}" stroke="${C.orange}" stroke-width="2"/>
        <polygon points="${chartW*0.66-10},${chartH/2-4} ${chartW*0.66-2},${chartH/2} ${chartW*0.66-10},${chartH/2+4}" fill="${C.orange}"/>
      </svg>
    </div>
  `;
  return stage(inner, R, variant);
}

function renderCTA(d, R, variant) {
  const qrSize = R.h<1100 ? 140 : (R.h<1500 ? 180 : 220);
  const inner = `
    <div style="position:absolute;top:${R.padTop}px;left:${R.padX}px;">
      <img src="${LOGO}" style="height:${R.h<1100?34:42}px;" />
    </div>
    <svg style="position:absolute;top:${R.padTop*0.7}px;right:${R.padX*0.6}px;width:${R.w*0.2}px;height:${R.w*0.2}px;opacity:0.8;" viewBox="0 0 220 220">
      ${[40,60,80,100].map((r,i)=>`<circle cx="110" cy="110" r="${r}" fill="none" stroke="${C.orange}" stroke-width="1" opacity="${0.3-i*0.05}"/>`).join('')}
      <circle cx="110" cy="110" r="22" fill="${C.orange}" style="filter:drop-shadow(0 0 30px ${C.orange});"/>
    </svg>
    <div style="position:absolute;top:${Math.round(R.h*0.27)}px;left:${R.padX}px;right:${R.padX}px;">
      ${headline(d.headline, R, { tight: true })}
      <p style="margin-top:${R.gap+10}px;font-size:${R.body+2}px;color:${C.text2};line-height:1.45;max-width:${R.w*0.78}px;">${d.tagline}</p>
    </div>
    <div style="position:absolute;left:${R.padX}px;right:${R.padX}px;top:${Math.round(R.h*0.58)}px;display:flex;gap:${R.gap}px;">
      ${(d.steps||[['01','Send','workload'],['02','Run','benchmark'],['03','See','savings']]).map(([n,t,sub])=>`
        <div style="flex:1;padding:${R.card}px;${cardBg}border-radius:14px;">
          <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:${R.h2*0.45}px;color:${C.orangeLight};letter-spacing:1px;">${n}</div>
          <div style="margin-top:${R.gap-4}px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:${R.h2*0.5}px;color:${C.text};letter-spacing:-0.3px;">${t}</div>
          <div style="margin-top:4px;font-size:${R.body-4}px;color:${C.text2};line-height:1.4;">${sub}</div>
        </div>
      `).join('')}
    </div>
    <div style="position:absolute;left:${R.padX}px;right:${R.padX}px;bottom:${Math.round(R.padTop*1.4)}px;display:flex;gap:${R.gap+6}px;align-items:center;">
      <div style="padding:${R.gap}px;background:#fff;border-radius:14px;display:inline-block;">
        ${qrCode(qrSize)}
      </div>
      <div style="flex:1;">
        <div style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:${R.h2*0.55}px;color:#fff;letter-spacing:-0.3px;">Scan to subscribe</div>
        <div style="margin-top:4px;font-size:${R.body-2}px;color:${C.text2};">${QR_URL.replace('https://','')} · sales@yeedu.io</div>
        <div style="margin-top:${R.gap}px;display:inline-block;padding:${R.gap}px ${R.gap+12}px;background:${C.orange};border-radius:999px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:${R.body+2}px;color:#fff;box-shadow:0 14px 40px rgba(242,96,12,0.4);">
          Get your estimate →
        </div>
      </div>
    </div>
  `;
  return stage(inner, R, variant);
}

// ── Topic content specs ────────────────────────────────────────

const TOPICS = [
  // 1. TPC-DS
  {
    id: 'tpc-ds',
    name: 'TPC-DS Benchmark',
    slides: [
      { kind:'cover', data:{ eyebrow:'Benchmark', headline:['The number that','broke the math.'], tagline:'99 queries. 3 dataset sizes. Zero rewrites. Zero failures.', coreLabel:'TPC-DS', stats:[['$0.53','/TB'],['99','queries'],['0','failures'],['±2%','variance']] }},
      { kind:'heroStat', data:{ eyebrow:'TPC-DS · cost-per-terabyte', number:'$0.53', subheadline:'The lowest cost-per-TB ever benchmarked on a major cloud.', body:'Right-sized Graviton4 instances. 99-query TPC-DS suite. Identical workloads to Databricks/EMR baselines.', stats:[['CONSISTENCY','±2%'],['FAILURES','0'],['REWRITES','0']] }},
      { kind:'scale', data:{ eyebrow:'Linear scaling', bigNumber:'$0.53', unit:'/ TB', tagline:'Predictable cost across all dataset sizes — no surprises at scale.', bars:[['1 TB','$0.54',0.54],['3 TB','$0.52',0.52],['10 TB','$0.53',0.53]], stats:[['QUERIES','99','per run'],['RUNS','297','total'],['FAILURES','0','on all runs']] }},
      { kind:'bars', data:{ eyebrow:'Speed proof', headline:['Faster on every','workload type.'], tagline:'Real production query times on 1.5B-row dataset.', items:[['Aggregations',98,12,'8.2×'],['Joins (large)',142,18,'7.9×'],['Window functions',76,19,'4.0×'],['ETL pipeline',220,22,'10.0×']] }},
      { kind:'how', data:{ eyebrow:'Why it wins', headline:['Three engines.','One platform.'], items:[['cpu','Vectorized execution','C++ rewrite with SIMD. 4–10× CPU pipeline speedup.'],['arrows','I/O-aware scheduling','Tasks placed against data locality, not slots. 2–4× efficiency.'],['layers','Job multiplexing','Compatible tasks share compute. Zero idle cores.']] }},
      { kind:'cta', data:{ headline:['Same code.','Smaller bill.'], tagline:'Run your TPC-DS suite on Yeedu. See the math change in days.', steps:[['01','Send workload','We profile on our side'],['02','Run benchmark','Apples-to-apples'],['03','See savings','Concrete $ + speed']] }},
    ],
  },
  // 2. Spark Autoloader Streaming
  {
    id: 'streaming',
    name: 'Spark Autoloader Streaming',
    slides: [
      { kind:'cover', data:{ eyebrow:'Real-time data', headline:['Streams, without','the stream tax.'], tagline:'Native Spark streaming and incremental file ingestion — without the Databricks bill.', coreLabel:'STREAM', stats:[['Native','Spark'],['Zero','lock-in'],['Schema','evolution'],['Exactly','once']] }},
      { kind:'pain', data:{ eyebrow:'The streaming tax', headline:['Real-time data,','real-time costs.'], tagline:'Why streaming workloads spiral out of budget.', items:[['stream','Autoloader lock-in','Databricks-only feature — switching costs are massive.'],['dollar','Per-record pricing','Costs scale with event volume, not value.'],['cpu','Idle stream compute','Streaming clusters run 24/7 even when data is sparse.']] }},
      { kind:'heroStat', data:{ eyebrow:'Yeedu streaming', number:'2–4×', subheadline:'Higher I/O efficiency on streaming pipelines.', body:'Smart scheduling stacks ingestion, schema inference, and CDC tasks on the same compute. Same throughput, fraction of the bill.', stats:[['SCHEMA','Auto'],['DELIVERY','Exactly-once'],['BACKFILL','Native']] }},
      { kind:'how', data:{ eyebrow:'Capabilities', headline:['Autoloader, ','without the lock-in.'], items:[['stream','Incremental file detection','Watches your cloud storage for new files — like Autoloader, open-source.'],['code','Schema evolution','Detects added columns and type changes without pipeline restarts.'],['shield','Exactly-once delivery','Checkpointed offsets and idempotent writes. Production-grade.']] }},
      { kind:'arch', data:{ eyebrow:'Streaming architecture', headline:['One engine.','Batch and stream.'], layers:{ topLabel:'YOUR STREAMING JOBS · UNCHANGED', top:['Structured Streaming','Kafka','Kinesis','Pub/Sub','S3 events'], midLabel:'YEEDU STREAMING ENGINE', midTitle:'Continuous · Micro-batch · Exactly-once', mid:['File Detector','Schema Inference','Watermarking','CDC Capture'], botLabel:'SINKS · OPEN FORMATS', bot:['Iceberg','Delta','Parquet','Postgres','Snowflake'] } }},
      { kind:'cta', data:{ headline:['Stream smarter.','Pay less.'], tagline:'Replace Autoloader without rewriting your streaming jobs.', steps:[['01','Point at storage','Same path, same format'],['02','Yeedu detects','Files, schema, CDC'],['03','Pipeline runs','At a fraction of cost']] }},
    ],
  },
  // 3. Migration — Zero code changes
  {
    id: 'migration',
    name: 'Migration — Zero Code Changes',
    slides: [
      { kind:'cover', data:{ eyebrow:'Migration', headline:['Same code.','Smaller bill.'], tagline:'PySpark, Scala, and Python jobs migrate as-is. No rewrite. No vendor lock-in.', coreLabel:'PORT', stats:[['0','rewrites'],['60–80%','savings'],['4+','sources'],['Days','to deploy']] }},
      { kind:'pain', data:{ eyebrow:'Why migrations fail', headline:['The migration tax','nobody talks about.'], items:[['code','Rewrite costs','Months of engineer time before any savings show up.'],['lock','Format lock-in','Proprietary file formats and catalogs trap your data.'],['shield','Risk of regression','Every rewrite is a chance to break a production pipeline.']] }},
      { kind:'flow', data:{ eyebrow:'How it works', headline:['Drop in.','Day one.'], tagline:'Jobs, notebooks, and configs ingested as-is.', sources:[['Databricks',60],['AWS EMR',130],['Dataproc',200],['Cloudera',270]], midTitle:'Auto-convert', midSub:'Jobs · configs · catalogs', midNote:'Zero code changes' }},
      { kind:'heroStat', data:{ eyebrow:'Real customer', number:'65%', subheadline:'Anticipated annual cost savings, Top-5 Pharma.', body:'"Based on what we see in production we anticipate up to 65% annual cost savings with Yeedu." — Director, Top 5 Pharma', stats:[['CODE CHANGES','0'],['MIGRATION TIME','Days'],['LOCK-IN','None']] }},
      { kind:'how', data:{ eyebrow:'Migration sources', headline:['From four,','to one engine.'], items:[['cloud','Databricks','Drop usage-based licensing. Same notebooks, same PySpark.'],['cloud','AWS EMR · Dataproc','Move high-cost workloads off managed Spark services.'],['layers','Cloudera CDP','Modernize legacy clusters without rewriting jobs.']] }},
      { kind:'cta', data:{ headline:['Same code.','Smaller bill.'], tagline:'Pick one workload. We migrate it. You see the delta in days.', steps:[['01','Pick a workload','Highest-cost wins'],['02','Auto-migrate','Yeedu utility runs'],['03','See savings','Side-by-side proof']] }},
    ],
  },
  // 4. Yeedu AI Assistant
  {
    id: 'ai-assistant',
    name: 'Yeedu AI Assistant',
    slides: [
      { kind:'cover', data:{ eyebrow:'Yeedu AI', headline:['An AI that knows','your Spark code.'], tagline:'Inline suggestions, optimization tips, and debugging — powered by Spark context and execution data.', coreLabel:'AI', stats:[['Inline','suggestions'],['Real','context'],['Faster','debug'],['Better','tuning']] }},
      { kind:'pain', data:{ eyebrow:'Spark dev pain', headline:['Debugging Spark','shouldn\'t take a week.'], items:[['code','Cryptic stack traces','GC pauses, OOM, skew — every error is a scavenger hunt.'],['cpu','Tuning by guesswork','Partitioning, shuffles, caching — most teams trial-and-error.'],['ai','No code-aware AI','Generic copilots don\'t see your execution plans or skew patterns.']] }},
      { kind:'how', data:{ eyebrow:'What Assistant X does', headline:['Three superpowers.','One pane.'], items:[['ai','Inline optimization','Suggests partitioning, caching, and join strategy as you write.'],['shield','Smart debugging','Reads stack traces + plans. Points to the exact line that\'s skewed.'],['chart','Performance insights','Live metrics from your jobs — bottleneck spotted in seconds.']] }},
      { kind:'heroStat', data:{ eyebrow:'Built into your IDE', number:'Live', subheadline:'Context-aware. Production-aware. Right where you code.', body:'Yeedu Assistant X reads your Spark execution data and physical plans — not just your code text. It knows when a shuffle will spill, when a join will skew, and when a cache will pay for itself.', stats:[['IDE','VS Code · JetBrains'],['CONTEXT','Spark plans'],['TUNING','Live metrics']] }},
      { kind:'cta', data:{ headline:['Code smarter.','Ship sooner.'], tagline:'Get Assistant X in your IDE. See your next Spark bug fixed before you finish typing.', steps:[['01','Install plugin','VS Code or JetBrains'],['02','Connect Yeedu','One auth flow'],['03','Get suggestions','From line one']] }},
    ],
  },
  // 5. BYOC — Bring Your Own Catalog
  {
    id: 'byoc',
    name: 'BYOC — Bring Your Own Catalog',
    slides: [
      { kind:'cover', data:{ eyebrow:'BYOC', headline:['Your catalog.','Your rules.'], tagline:'Native integration with every major catalog. No data movement. No re-cataloging.', coreLabel:'BYOC', stats:[['5+','catalogs'],['Zero','data movement'],['Native','APIs'],['Open','formats']] }},
      { kind:'pain', data:{ eyebrow:'The catalog tax', headline:['Most platforms','want to own your catalog.'], items:[['lock','Forced re-cataloging','Switch platforms? Re-register every table. Months of work.'],['layers','Proprietary metadata','Lineage, tags, and ACLs stuck in vendor APIs.'],['arrows','Data movement','New platforms often demand data copies into their own stores.']] }},
      { kind:'how', data:{ eyebrow:'Yeedu approach', headline:['Plug in.','Keep your truth.'], items:[['layers','Native connectors','Hive, Unity, Iceberg, Delta, Glue — first-class API support.'],['shield','Read-through ACLs','Honors your existing permissions and policies. No re-grant.'],['cloud','Zero data movement','Files stay where they are. Yeedu compute reads in place.']] }},
      { kind:'arch', data:{ eyebrow:'Catalog architecture', headline:['One engine.','Every catalog.'], layers:{ topLabel:'YOUR APPLICATIONS · UNCHANGED', top:['Spark SQL','PySpark','Notebooks','BI tools','dbt'], midLabel:'YEEDU CATALOG LAYER', midTitle:'Read-through · Zero-copy · Open-format', mid:['Hive Adapter','Unity Adapter','Iceberg Native','Delta Native'], botLabel:'YOUR EXISTING CATALOGS · UNTOUCHED', bot:['Hive Metastore','Unity Catalog','Glue','Iceberg REST','Custom'] } }},
      { kind:'heroStat', data:{ eyebrow:'Zero migration', number:'0', subheadline:'Tables you need to re-register.', body:'Yeedu reads your existing Hive Metastore, Unity Catalog, Glue, or Iceberg tables — directly. Lineage, ACLs, and partitioning preserved.', stats:[['CATALOGS','Hive · Unity · Glue'],['FORMATS','Iceberg · Delta · Parquet'],['MOVEMENT','None']] }},
      { kind:'cta', data:{ headline:['Your catalog.','Your engine.'], tagline:'Connect Yeedu to your catalog in minutes. Query your existing tables instantly.', steps:[['01','Configure catalog','One JSON block'],['02','Auth check','Existing ACLs respected'],['03','Query at speed','No data moved']] }},
    ],
  },
  // 6. Cloud Agnostic — Single Control Plane
  {
    id: 'cloud-agnostic',
    name: 'Cloud Agnostic — Single Control Plane',
    slides: [
      { kind:'cover', data:{ eyebrow:'Multi-cloud', headline:['One plane.','Every cloud.'], tagline:'A single Yeedu control plane orchestrates Spark workloads across AWS, Azure, GCP, Kubernetes, and on-prem.', coreLabel:'PLANE', stats:[['1','control plane'],['4+','clouds'],['Unified','observability'],['Zero','lock-in']] }},
      { kind:'pain', data:{ eyebrow:'Multi-cloud reality', headline:['Multi-cloud,','multi-headache.'], items:[['cloud','Separate ops per cloud','Different runbooks, different consoles, different SLAs.'],['lock','Workload pinning','Once you\'re on a cloud-native engine, you\'re stuck there.'],['chart','No unified view','Costs and metrics scattered across 3+ dashboards.']] }},
      { kind:'arch', data:{ eyebrow:'Architecture', headline:['Run anywhere.','Manage from one place.'], layers:{ topLabel:'YOUR APPLICATIONS · CLOUD-AGNOSTIC', top:['PySpark','Scala','SQL','Notebooks','APIs'], midLabel:'YEEDU CONTROL PLANE · SINGLE PANE', midTitle:'Orchestration · Observability · Cost', mid:['Job Scheduler','Cluster Manager','Cost Tracker','Audit Log'], botLabel:'COMPUTE · ANYWHERE YOU RUN', bot:['AWS','Azure','GCP','Kubernetes','On-prem'] } }},
      { kind:'heroStat', data:{ eyebrow:'Portability', number:'100%', subheadline:'Your workloads survive any cloud move.', body:'Yeedu compute runs in your own cloud account, behind your firewall. The control plane is portable. The workloads are portable. The data stays in open formats.', stats:[['CLOUDS','AWS · Azure · GCP'],['ENGINES','VMs · K8s · On-prem'],['LOCK-IN','None']] }},
      { kind:'how', data:{ eyebrow:'What you get', headline:['Three certainties,','any cloud.'], items:[['globe','Cloud-native everywhere','Native VM and Kubernetes deployment on each major cloud.'],['shield','In-account compute','Yeedu runs in YOUR account. Your data never leaves your perimeter.'],['chart','One observability pane','Cost, throughput, error rates — across every cloud, one view.']] }},
      { kind:'cta', data:{ headline:['Cloud-flexible.','Engineering-simple.'], tagline:'Deploy Yeedu in one cloud today. Add more without changing a line of code.', steps:[['01','Pick a cloud','AWS, Azure, GCP, K8s'],['02','Deploy in-account','Behind your firewall'],['03','Add more clouds','Same control plane']] }},
    ],
  },
  // 7. Cost Savings
  {
    id: 'cost-savings',
    name: 'Cost Savings',
    slides: [
      { kind:'cover', data:{ eyebrow:'Cost optimization', headline:['Cut cloud spend','60–80%.'], tagline:'Same workloads. Smaller bills. Documented across enterprise migrations.', coreLabel:'$', stats:[['60–80%','reduction'],['$680K','typical savings'],['65%','pharma case'],['Days','to prove']] }},
      { kind:'pain', data:{ eyebrow:'Where money leaks', headline:['Three reasons','your bill is too high.'], items:[['dollar','Over-provisioned clusters','Spark workloads run on oversized clusters 24/7.'],['cpu','Idle compute','Workers wait on I/O while burning money.'],['lock','Usage-based platforms','Per-second pricing rewards inefficiency by design.']] }},
      { kind:'area', data:{ eyebrow:'Cumulative spend', headline:['Cloud spend.','Cut in half. Then cut again.'], tagline:'Same workloads, 11-month cumulative cost trajectory.' }},
      { kind:'how', data:{ eyebrow:'Three mechanisms', headline:['Compounding','savings.'], items:[['layers','Job multiplexing','Compatible tasks share compute. No idle cores.'],['arrows','Smart scheduling','I/O-aware task placement. 2–4× efficiency on read-heavy work.'],['cpu','Right-sized clusters','Graviton4-tuned. Vectorized. Fraction of the resources.']] }},
      { kind:'heroStat', data:{ eyebrow:'Documented case', number:'$680K', subheadline:'Annualized savings on a single 4PB analytics workload.', body:'AWS us-east-1. Enterprise customer. 68% reduction post-migration. Same code. Same data. Same SLAs.', stats:[['WORKLOAD','4 PB analytics'],['REDUCTION','68%'],['CODE CHANGES','0']] }},
      { kind:'cta', data:{ headline:['Same workload.','Smaller bill.'], tagline:'Send us one workload. We\'ll prove the savings in days.', steps:[['01','Pick workload','Highest-cost wins'],['02','Yeedu benchmarks','Apples-to-apples'],['03','See the delta','Hard numbers']] }},
    ],
  },
  // 8. Yeedu Turbo
  {
    id: 'turbo',
    name: 'Yeedu Turbo Engine',
    slides: [
      { kind:'cover', data:{ eyebrow:'Yeedu Turbo', headline:['Spark,','vectorized.'], tagline:'A C++ Spark engine with SIMD vectorization. Up to 10× faster execution on existing workloads.', coreLabel:'TURBO', stats:[['10×','faster'],['SIMD','vectorized'],['C++','engine'],['0','rewrites']] }},
      { kind:'pain', data:{ eyebrow:'JVM Spark, today', headline:['Spark engines','weren\'t built for SIMD.'], items:[['cpu','JVM-bound execution','Tungsten was a step. SIMD-native is the leap.'],['code','Tungsten ceiling','Whole-stage codegen still leaves vectorization on the table.'],['chart','CPU-bound pipelines','Filter, aggregate, join kernels run row-by-row.']] }},
      { kind:'heroStat', data:{ eyebrow:'Vectorized execution', number:'10×', subheadline:'Faster execution on real production workloads.', body:'C++ Turbo Engine with SIMD vectorization. CPU pipelines run 4× more rows per cycle. No code changes.', stats:[['ENGINE','C++ rewrite'],['SIMD','AVX-512'],['CHANGES','0']] }},
      { kind:'bars', data:{ eyebrow:'Workload speedup', headline:['Faster on every','kernel that matters.'], tagline:'Real TPC-DS query times. 1.5B-row dataset. Identical inputs.', items:[['Aggregations',98,12,'8.2×'],['Joins (large)',142,18,'7.9×'],['Window functions',76,19,'4.0×'],['ETL pipeline',220,22,'10.0×']] }},
      { kind:'how', data:{ eyebrow:'Why it\'s faster', headline:['Three compounding','optimizations.'], items:[['cpu','SIMD kernels','Vector ALU paths for filter, join, aggregation. 4× rows per cycle.'],['arrows','Smart scheduler','I/O-aware task placement. Idle cores eliminated.'],['layers','Job multiplexer','Compatible tasks share compute. Maximum throughput per node.']] }},
      { kind:'arch', data:{ eyebrow:'Engine architecture', headline:['The engine,','rewritten in C++.'], layers:{ topLabel:'YOUR CODE · UNCHANGED', top:['PySpark','Scala','Python','SQL','Notebooks'], midLabel:'YEEDU TURBO ENGINE', midTitle:'C++ · SIMD · Vectorized', mid:['SIMD Kernels','Smart Scheduler','Job Multiplexer','Adaptive Memory'], botLabel:'RUNS IN YOUR ACCOUNT · BEHIND YOUR FIREWALL', bot:['AWS','Azure','GCP','Kubernetes','On-prem'] } }},
      { kind:'cta', data:{ headline:['Same Spark.','Different engine.'], tagline:'Bring one workload. Run it on Turbo. See 10× the same day.', steps:[['01','Send workload','Existing PySpark'],['02','Run on Turbo','C++ engine takes over'],['03','See 10×','Hard timing data']] }},
    ],
  },
];

const RENDERERS = {
  cover: renderCover,
  pain: renderPain,
  heroStat: renderHeroStat,
  bars: renderBars,
  area: renderArea,
  scale: renderScale,
  arch: renderArch,
  how: renderHow,
  flow: renderFlow,
  cta: renderCTA,
};

// ── Build loop ─────────────────────────────────────────────────
const RATIO_ENTRIES = [
  ['1:1', RATIOS['1:1'], 'Square'],
  ['4:5', RATIOS['4:5'], 'Portrait'],
  ['9:16', RATIOS['9:16'], 'Story · Roll-up'],
];

const results = [];

for (const topic of TOPICS) {
  for (const [ratioKey, R, label] of RATIO_ENTRIES) {
    const carouselName = `${topic.name} — ${label} (${ratioKey})`;

    // create carousel
    const cRes = await fetch(`${BASE}/api/carousels`, {
      method:'POST', headers:{'content-type':'application/json'},
      body: JSON.stringify({ name: carouselName, aspectRatio: ratioKey }),
    });
    const carousel = await cRes.json();
    if (!carousel.id) { console.log('FAIL', carouselName, carousel); continue; }

    // add slides
    for (let i = 0; i < topic.slides.length; i++) {
      const { kind, data } = topic.slides[i];
      const variant = variantSeq[i % 8];
      const html = RENDERERS[kind](data, R, variant);
      const r = await fetch(`${BASE}/api/carousels/${carousel.id}/slides`, {
        method:'POST', headers:{'content-type':'application/json'},
        body: JSON.stringify({ html, notes: `${kind} slide` }),
      });
      if (r.status !== 201) console.log(' slide err', kind, r.status);
    }

    results.push({ id: carousel.id, name: carouselName, ratio: ratioKey, url: `http://localhost:3000/?carousel=${carousel.id}` });
    console.log('✓', carouselName);
  }
}

console.log('\n══ BUILT', results.length, 'CAROUSELS ══');
import('fs').then(fs => fs.writeFileSync('/tmp/yeedu-carousel-ids.json', JSON.stringify(results, null, 2)));
console.log('IDs saved to /tmp/yeedu-carousel-ids.json');
