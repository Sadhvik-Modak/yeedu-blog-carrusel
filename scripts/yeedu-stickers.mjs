// ════════════════════════════════════════════════════════════════
// Yeedu Identity Stickers — varied shapes, logo-forward (1080×1080)
// 5 designer-led stickers. Each shape distinct. Yeedu logo embedded
// in every one as the credentialing mark.
// ════════════════════════════════════════════════════════════════
import fs from 'fs';

const BASE = 'http://localhost:3000';
const LOGO = '/uploads/7d95c235-aa75-4cb1-a3c2-e84314ceca33.png';

const C = {
  orange:'#f2600c', orangeLight:'#ff8a3d', orangeSoft:'#ffae7a',
  orangeGlow:'rgba(242,96,12,0.45)', orangeDim:'rgba(242,96,12,0.16)',
  brown:'#26221d', brownDeep:'#14110d', brownInk:'#0a0807',
  cream:'#fff6e8', red:'#d8351a',
  aws:'#ff9900', azure:'#0089d6',
  gcpBlue:'#4285f4', gcpRed:'#ea4335', gcpYellow:'#fbbc04', gcpGreen:'#34a853',
  spark:'#e25a1c', k8s:'#326ce5',
  text:'#ffffff', text2:'rgba(255,255,255,0.78)', text3:'rgba(255,255,255,0.48)',
  rule:'rgba(255,255,255,0.10)', ruleWarm:'rgba(242,140,90,0.30)',
};

const W = 1080, H = 1080;

// Yeedu attribution chip — used on every sticker
function yeeduStamp({ size = 'md', dark = false } = {}) {
  const cfg = {
    sm: { pad:'8px 16px', logoH:24, fs:14 },
    md: { pad:'12px 22px', logoH:34, fs:18 },
    lg: { pad:'16px 30px', logoH:42, fs:22 },
  }[size];
  return `<div style="display:inline-flex;align-items:center;gap:14px;padding:${cfg.pad};background:${dark?'rgba(0,0,0,0.4)':C.orange};border:${dark?`1px solid ${C.orangeLight}`:'none'};border-radius:999px;box-shadow:0 12px 30px ${C.orangeGlow};">
    <img src="${LOGO}" style="height:${cfg.logoH}px;filter:brightness(0) invert(1);"/>
    <span style="font-family:'Inter',sans-serif;font-size:${cfg.fs}px;font-weight:800;color:#fff;letter-spacing:3px;text-transform:uppercase;">sponsored by yeedu</span>
  </div>`;
}

// Real Yeedu logo image (color-preserved on warm dark bg)
function yeeduLogoMark(h = 90) {
  return `<img src="${LOGO}" style="height:${h}px;filter:drop-shadow(0 0 24px ${C.orangeGlow});"/>`;
}

// Background grain + glow
const bgLayers = `
  <div style="position:absolute;inset:0;background-image:radial-gradient(circle at 1px 1px,rgba(255,255,255,0.05) 1px,transparent 0);background-size:24px 24px;opacity:0.5;pointer-events:none;"></div>
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse 70% 50% at 50% 20%,rgba(242,96,12,0.28),transparent 60%);pointer-events:none;"></div>
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse 60% 40% at 50% 95%,rgba(242,140,60,0.22),transparent 60%);pointer-events:none;"></div>
`;
const bgGradient = `radial-gradient(circle at 30% 25%, ${C.brown}, ${C.brownDeep} 60%, ${C.brownInk} 100%)`;

// Generic shell — die-cut white border + inner shape
function shell(shapeCss, innerHTML) {
  return `<div style="width:${W}px;height:${H}px;position:relative;background:transparent;font-family:'Inter',sans-serif;color:${C.text};-webkit-font-smoothing:antialiased;">
    <!-- die-cut shape -->
    <div style="position:absolute;inset:50px;background:#fff;${shapeCss};box-shadow:0 30px 80px rgba(0,0,0,0.45);"></div>
    <div style="position:absolute;inset:72px;${shapeCss}background:${bgGradient};overflow:hidden;">
      ${bgLayers}
      <div style="position:relative;z-index:2;width:100%;height:100%;">${innerHTML}</div>
    </div>
  </div>`;
}

// curved arc text for circular emblems
const arcTop = (text, radius, fs, color = C.orangeLight, weight = 800, gap = 0.20) => {
  const id = 'at'+Math.random().toString(36).slice(2,7);
  return `<svg viewBox="0 0 ${W} ${H}" style="position:absolute;inset:-72px;width:${W}px;height:${H}px;">
    <defs><path id="${id}" d="M ${W/2-radius},${H/2} a ${radius},${radius} 0 1,1 ${radius*2},0" fill="none"/></defs>
    <text font-family="Montserrat,sans-serif" font-weight="${weight}" font-size="${fs}" fill="${color}" letter-spacing="${fs*gap}px">
      <textPath href="#${id}" startOffset="50%" text-anchor="middle">${text}</textPath>
    </text></svg>`;
};
const arcBot = (text, radius, fs, color = C.orangeLight, weight = 800, gap = 0.20) => {
  const id = 'ab'+Math.random().toString(36).slice(2,7);
  return `<svg viewBox="0 0 ${W} ${H}" style="position:absolute;inset:-72px;width:${W}px;height:${H}px;">
    <defs><path id="${id}" d="M ${W/2-radius},${H/2} a ${radius},${radius} 0 1,0 ${radius*2},0" fill="none"/></defs>
    <text font-family="Montserrat,sans-serif" font-weight="${weight}" font-size="${fs}" fill="${color}" letter-spacing="${fs*gap}px">
      <textPath href="#${id}" startOffset="50%" text-anchor="middle">${text}</textPath>
    </text></svg>`;
};

// ──────────────────────────────────────────────────────────────────
// 1. SOFTWARE ENGINEER — "Hello, I'm a" name-tag (rounded rectangle)
// ──────────────────────────────────────────────────────────────────
function s1_softwareEngineer() {
  return shell(`border-radius:64px;`, `
    <!-- top red band -->
    <div style="position:absolute;top:0;left:0;right:0;height:240px;background:linear-gradient(180deg,${C.red},#a82613);display:flex;align-items:center;justify-content:center;border-radius:64px 64px 0 0;border-bottom:6px solid #fff;">
      <div style="text-align:center;">
        <div style="font-family:'Caveat','Brush Script MT',cursive;font-weight:700;font-size:72px;color:#fff;letter-spacing:-1px;line-height:1;">Hello,</div>
        <div style="margin-top:6px;font-family:'Inter',sans-serif;font-size:28px;color:#fff;letter-spacing:8px;text-transform:uppercase;font-weight:800;">I'm a</div>
      </div>
    </div>

    <!-- white "name" area in the middle -->
    <div style="position:absolute;top:280px;left:60px;right:60px;height:520px;background:#fff;border-radius:24px;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 2px ${C.brown};">
      <div style="text-align:center;">
        <h1 style="margin:0;font-family:'Montserrat',sans-serif;font-weight:800;font-size:108px;line-height:0.95;letter-spacing:-3.5px;color:${C.brownDeep};">SOFTWARE</h1>
        <h1 style="margin:6px 0 0;font-family:'Montserrat',sans-serif;font-weight:800;font-size:108px;line-height:0.95;letter-spacing:-3.5px;color:${C.orange};">ENGINEER</h1>
        <div style="margin-top:30px;display:inline-flex;align-items:center;gap:8px;padding:6px 22px;background:${C.brownDeep};border-radius:999px;">
          <span style="width:8px;height:8px;background:${C.orange};border-radius:50%;"></span>
          <span style="font-family:'Inter',sans-serif;font-size:18px;font-weight:700;color:#fff;letter-spacing:3px;text-transform:uppercase;">ships code · 2024</span>
        </div>
      </div>
    </div>

    <!-- bottom strip with Yeedu logo -->
    <div style="position:absolute;bottom:0;left:0;right:0;height:140px;background:linear-gradient(180deg,${C.brownDeep},${C.brownInk});display:flex;align-items:center;justify-content:center;gap:18px;border-radius:0 0 64px 64px;border-top:3px solid ${C.orange};">
      ${yeeduLogoMark(60)}
      <div style="font-family:'Inter',sans-serif;font-size:20px;color:${C.text2};letter-spacing:4px;text-transform:uppercase;font-weight:700;">— sponsored by yeedu.com —</div>
    </div>
  `);
}

// ──────────────────────────────────────────────────────────────────
// 2. DATA ENGINEER — refined circular heritage with Yeedu logo center
// ──────────────────────────────────────────────────────────────────
function s2_dataEngineer() {
  return shell(`border-radius:50%;`, `
    ${arcTop('· DATA ENGINEER ·', 400, 72, C.orangeLight, 900, 0.22)}
    ${arcTop('ETL · PIPELINES · SPARK · CLOUD', 332, 22, C.text2, 800, 0.32)}
    ${arcBot('· EST. 2024 · YEEDU ·', 400, 36, C.orangeLight, 800, 0.22)}

    <!-- inner double ring -->
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:600px;border-radius:50%;border:2px solid ${C.ruleWarm};"></div>
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:590px;height:590px;border-radius:50%;border:1px dashed ${C.rule};"></div>

    <!-- side stars -->
    ${[80, 856].map(x=>`
      <svg style="position:absolute;left:${x}px;top:50%;transform:translate(-50%,-50%);" width="42" height="42" viewBox="0 0 36 36">
        <path d="M 18 0 L 21 15 L 36 18 L 21 21 L 18 36 L 15 21 L 0 18 L 15 15 Z" fill="${C.orangeLight}" style="filter:drop-shadow(0 0 8px ${C.orangeGlow});"/>
      </svg>
    `).join('')}

    <!-- center medallion: DB icon + Yeedu logo paired -->
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;width:520px;">
      <div style="font-family:'Inter',sans-serif;font-size:18px;color:${C.text3};letter-spacing:5px;text-transform:uppercase;font-weight:800;margin-bottom:16px;">Built the pipeline</div>

      <svg width="300" height="220" viewBox="0 0 200 150" style="margin:0 auto;display:block;">
        <defs><linearGradient id="deg2" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="${C.orangeLight}"/></linearGradient></defs>
        <g transform="translate(70 4)">
          <ellipse cx="30" cy="10" rx="30" ry="9" fill="url(#deg2)"/>
          <path d="M 0 10 L 0 60 Q 0 70 30 70 Q 60 70 60 60 L 60 10" fill="url(#deg2)" opacity="0.92"/>
          <ellipse cx="30" cy="10" rx="30" ry="9" fill="none" stroke="${C.brown}" stroke-width="2"/>
          <path d="M 0 28 Q 0 38 30 38 Q 60 38 60 28" fill="none" stroke="${C.brown}" stroke-width="1.5"/>
          <path d="M 0 46 Q 0 56 30 56 Q 60 56 60 46" fill="none" stroke="${C.brown}" stroke-width="1.5"/>
        </g>
        <g transform="translate(0 110)">
          <line x1="10" y1="0" x2="60" y2="0" stroke="${C.orangeLight}" stroke-width="4" stroke-linecap="round"/>
          <polygon points="55,-8 65,0 55,8" fill="${C.orangeLight}"/>
          <circle cx="100" cy="0" r="14" fill="none" stroke="${C.orangeLight}" stroke-width="3"/>
          <circle cx="100" cy="0" r="4" fill="${C.orangeLight}"/>
          ${[0,60,120,180,240,300].map(deg=>{
            const a=deg*Math.PI/180, x=100+18*Math.cos(a), y=18*Math.sin(a);
            return `<rect x="${x-3}" y="${y-3}" width="6" height="6" fill="${C.orangeLight}" transform="rotate(${deg} ${x} ${y})"/>`;
          }).join('')}
          <line x1="135" y1="0" x2="185" y2="0" stroke="${C.orangeLight}" stroke-width="4" stroke-linecap="round"/>
          <polygon points="180,-8 190,0 180,8" fill="${C.orangeLight}"/>
        </g>
      </svg>

      <!-- Yeedu logo as the stamp of authenticity -->
      <div style="margin-top:14px;display:flex;align-items:center;justify-content:center;gap:14px;padding-top:14px;border-top:1px solid ${C.ruleWarm};">
        ${yeeduLogoMark(46)}
        <span style="font-family:'Inter',sans-serif;font-size:18px;color:${C.orangeLight};letter-spacing:3px;text-transform:uppercase;font-weight:800;">member · 2024</span>
      </div>
    </div>
  `);
}

// ──────────────────────────────────────────────────────────────────
// 3. ML ENGINEER — hexagon (technical / honeycomb feel)
// ──────────────────────────────────────────────────────────────────
function s3_mlEngineer() {
  const hexClip = `clip-path:polygon(50% 1%, 95% 25%, 95% 75%, 50% 99%, 5% 75%, 5% 25%);`;
  return shell(hexClip, `
    <!-- corner ticks -->
    ${[[150,180,'tl'],[930,180,'tr'],[150,900,'bl'],[930,900,'br']].map(([x,y,p])=>{
      const r = p==='tl'?'M0 50 L0 0 L50 0':p==='tr'?'M0 0 L50 0 L50 50':p==='bl'?'M0 0 L0 50 L50 50':'M50 0 L50 50 L0 50';
      return `<svg style="position:absolute;left:${x-25}px;top:${y-25}px;" width="50" height="50" viewBox="0 0 50 50"><path d="${r}" fill="none" stroke="${C.orangeLight}" stroke-width="5"/></svg>`;
    }).join('')}

    <!-- top: role + spec line -->
    <div style="position:absolute;top:200px;left:0;right:0;text-align:center;">
      <div style="font-family:'Inter',sans-serif;font-size:24px;color:${C.text2};letter-spacing:7px;text-transform:uppercase;font-weight:700;margin-bottom:12px;">// ML</div>
      <h1 style="margin:0;font-family:'Montserrat',sans-serif;font-weight:800;font-size:118px;line-height:0.95;letter-spacing:-4px;color:#fff;">ENGINEER</h1>
    </div>

    <!-- center: neural net -->
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);margin-top:80px;">
      <svg width="500" height="300" viewBox="0 0 280 200">
        ${(()=>{
          const layers = [[30,[40,90,140]],[110,[20,60,100,140,180]],[190,[40,80,120,160]],[270,[100]]];
          let svg = '';
          for (let i=0;i<layers.length-1;i++){
            const [x1,ys1]=layers[i], [x2,ys2]=layers[i+1];
            ys1.forEach(y1=>ys2.forEach(y2=>{
              svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.orangeLight}" stroke-width="1" opacity="0.35"/>`;
            }));
          }
          layers.forEach(([x,ys])=>ys.forEach(y=>{
            svg += `<circle cx="${x}" cy="${y}" r="10" fill="${C.orange}" style="filter:drop-shadow(0 0 8px ${C.orangeGlow});"/>`;
          }));
          return svg;
        })()}
      </svg>
    </div>

    <!-- bottom: stack pills + Yeedu logo -->
    <div style="position:absolute;bottom:200px;left:0;right:0;text-align:center;">
      <div style="display:flex;gap:8px;justify-content:center;margin-bottom:24px;">
        ${['Python','PyTorch','Spark','MLflow'].map(t=>`
          <span style="padding:6px 16px;background:rgba(255,255,255,0.06);border:1px solid ${C.ruleWarm};border-radius:999px;font-family:'Inter',sans-serif;font-size:15px;font-weight:700;color:${C.orangeLight};letter-spacing:2px;">${t}</span>
        `).join('')}
      </div>
      <div style="display:inline-flex;align-items:center;gap:14px;padding:10px 22px;background:rgba(0,0,0,0.4);border:2px solid ${C.orangeLight};border-radius:999px;">
        ${yeeduLogoMark(34)}
        <span style="font-family:'Inter',sans-serif;font-size:16px;color:${C.orangeLight};letter-spacing:3px;text-transform:uppercase;font-weight:800;">accelerated by yeedu</span>
      </div>
    </div>
  `);
}

// ──────────────────────────────────────────────────────────────────
// 4. CLOUD ARCHITECT — horizontal luggage tag (landscape rectangle)
// ──────────────────────────────────────────────────────────────────
function s4_cloudArchitect() {
  return shell(`border-radius:38px;`, `
    <!-- punch hole top (luggage tag aesthetic) -->
    <div style="position:absolute;top:60px;left:50%;transform:translateX(-50%);width:140px;height:30px;background:#fff;border-radius:999px;box-shadow:inset 0 2px 6px rgba(0,0,0,0.3);"></div>
    <div style="position:absolute;top:64px;left:50%;transform:translateX(-50%);width:130px;height:22px;background:${C.brownInk};border-radius:999px;"></div>

    <!-- title block -->
    <div style="position:absolute;top:170px;left:0;right:0;text-align:center;">
      <div style="font-family:'Inter',sans-serif;font-size:24px;color:${C.text2};letter-spacing:7px;text-transform:uppercase;font-weight:700;margin-bottom:8px;">— certified —</div>
      <h1 style="margin:0;font-family:'Montserrat',sans-serif;font-weight:800;font-size:108px;line-height:0.95;letter-spacing:-4px;color:#fff;">CLOUD</h1>
      <h1 style="margin:4px 0 0;font-family:'Montserrat',sans-serif;font-weight:300;font-style:italic;font-size:108px;line-height:0.95;letter-spacing:-4px;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">ARCHITECT</h1>
    </div>

    <!-- 3 cloud icons row -->
    <div style="position:absolute;top:600px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:60px;">
      ${[
        ['AWS', C.aws],
        ['GCP', null],
        ['AZURE', C.azure],
      ].map(([name,col]) => `
        <div style="text-align:center;">
          ${name==='GCP' ? `
            <svg width="120" height="84" viewBox="0 0 100 70">
              <defs><linearGradient id="gcpg3" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stop-color="${C.gcpBlue}"/><stop offset="33%" stop-color="${C.gcpRed}"/>
                <stop offset="66%" stop-color="${C.gcpYellow}"/><stop offset="100%" stop-color="${C.gcpGreen}"/>
              </linearGradient></defs>
              <path d="M 25 60 Q 5 60 5 45 Q 5 30 22 28 Q 25 12 42 12 Q 60 12 65 26 Q 90 24 92 45 Q 92 60 75 60 Z" fill="url(#gcpg3)"/>
            </svg>
          ` : `
            <svg width="120" height="84" viewBox="0 0 100 70">
              <path d="M 25 60 Q 5 60 5 45 Q 5 30 22 28 Q 25 12 42 12 Q 60 12 65 26 Q 90 24 92 45 Q 92 60 75 60 Z" fill="${col}" style="filter:drop-shadow(0 4px 12px ${col}66);"/>
            </svg>
          `}
          <div style="margin-top:6px;font-family:'Montserrat',sans-serif;font-weight:800;font-size:22px;color:${col || C.gcpBlue};letter-spacing:2px;">${name}</div>
        </div>
      `).join('')}
    </div>

    <!-- bottom Yeedu strip -->
    <div style="position:absolute;bottom:60px;left:60px;right:60px;padding:22px 28px;background:rgba(0,0,0,0.4);border:1px solid ${C.orangeLight};border-radius:18px;display:flex;align-items:center;justify-content:space-between;">
      <div style="display:flex;align-items:center;gap:14px;">
        ${yeeduLogoMark(40)}
        <div>
          <div style="font-family:'Inter',sans-serif;font-size:13px;color:${C.text3};letter-spacing:2px;text-transform:uppercase;font-weight:700;">runs anywhere</div>
          <div style="margin-top:1px;font-family:'Montserrat',sans-serif;font-size:22px;color:${C.orangeLight};font-weight:800;letter-spacing:-0.5px;">Multi-cloud · Zero lock-in</div>
        </div>
      </div>
      <div style="font-family:'Inter',sans-serif;font-size:14px;color:${C.text3};letter-spacing:2px;text-transform:uppercase;font-weight:800;">yeedu.com</div>
    </div>
  `);
}

// ──────────────────────────────────────────────────────────────────
// 5. SPARK ENGINEER — diamond (rotated square) — striking & unique
// ──────────────────────────────────────────────────────────────────
function s5_sparkEngineer() {
  const diamondClip = `clip-path:polygon(50% 2%, 98% 50%, 50% 98%, 2% 50%);`;
  return shell(diamondClip, `
    <!-- top label -->
    <div style="position:absolute;top:140px;left:0;right:0;text-align:center;">
      <div style="font-family:'Inter',sans-serif;font-size:22px;color:${C.text2};letter-spacing:7px;text-transform:uppercase;font-weight:700;">/// THE PATCH</div>
    </div>

    <!-- big role -->
    <div style="position:absolute;top:230px;left:0;right:0;text-align:center;">
      <h1 style="margin:0;font-family:'Montserrat',sans-serif;font-weight:800;font-size:84px;line-height:0.95;letter-spacing:-2.8px;color:#fff;">SPARK</h1>
      <h1 style="margin:4px 0 0;font-family:'Montserrat',sans-serif;font-weight:300;font-style:italic;font-size:84px;line-height:0.95;letter-spacing:-2.8px;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">ENGINEER</h1>
    </div>

    <!-- center: spark star -->
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">
      <svg width="280" height="280" viewBox="0 0 100 100">
        <defs><linearGradient id="spg2" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#fff"/><stop offset="60%" stop-color="${C.orangeLight}"/><stop offset="100%" stop-color="${C.orange}"/></linearGradient></defs>
        <path d="M 50 6 L 56 36 L 86 42 L 60 54 L 66 84 L 50 62 L 34 84 L 40 54 L 14 42 L 44 36 Z" fill="url(#spg2)" style="filter:drop-shadow(0 0 30px ${C.orangeGlow});"/>
      </svg>
    </div>

    <!-- bottom: Yeedu logo lockup -->
    <div style="position:absolute;bottom:230px;left:0;right:0;text-align:center;">
      <div style="display:inline-flex;align-items:center;gap:16px;padding:14px 28px;background:${C.orange};border-radius:999px;box-shadow:0 14px 36px ${C.orangeGlow};">
        ${yeeduLogoMark(46)}
        <span style="font-family:'Montserrat',sans-serif;font-size:24px;font-weight:800;color:#fff;letter-spacing:1px;">× Yeedu Turbo</span>
      </div>
      <div style="margin-top:14px;font-family:'Inter',sans-serif;font-size:18px;color:${C.text2};letter-spacing:4px;text-transform:uppercase;font-weight:700;">PySpark · Scala · SQL</div>
    </div>
  `);
}

// ─── build ───────────────────────────────────────────────────────
const STICKERS = [
  { name: '1 · Software Engineer — name-tag (rect)',  render: s1_softwareEngineer },
  { name: '2 · Data Engineer — heritage circle',      render: s2_dataEngineer },
  { name: '3 · ML Engineer — hexagon',                render: s3_mlEngineer },
  { name: '4 · Cloud Architect — luggage tag (rect)', render: s4_cloudArchitect },
  { name: '5 · Spark Engineer — diamond',             render: s5_sparkEngineer },
];

// Cleanup previous sticker carousels
const oldRes = await fetch(`${BASE}/api/carousels`);
const oldList = await oldRes.json();
for (const c of (oldList.carousels || oldList)) {
  if (c.name && c.name.includes('Sticker')) {
    await fetch(`${BASE}/api/carousels/${c.id}`, { method:'DELETE' });
  }
}

const cRes = await fetch(`${BASE}/api/carousels`, {
  method:'POST',
  headers:{'content-type':'application/json'},
  body: JSON.stringify({ name: 'Yeedu Identity Stickers (1:1)', aspectRatio: '1:1' })
});
const carousel = await cRes.json();
if (!carousel.id) { console.log('FAIL', carousel); process.exit(1); }

for (const s of STICKERS) {
  const html = s.render();
  const r = await fetch(`${BASE}/api/carousels/${carousel.id}/slides`, {
    method:'POST',
    headers:{'content-type':'application/json'},
    body: JSON.stringify({ html, notes: s.name })
  });
  if (r.status !== 201) console.log(' err', s.name, r.status);
  else console.log('✓', s.name);
}

console.log('\n→ http://localhost:3000/?carousel=' + carousel.id);
