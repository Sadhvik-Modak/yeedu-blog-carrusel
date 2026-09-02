// ════════════════════════════════════════════════════════════════
// Carousel: "Dumping Observability Data Into Iceberg Lakehouses"
// Source: https://yeedu.com/blog/dumping-observability-data-into-iceberg-lakehouses
// 5 slides, 4:5 (Instagram portrait) — reuses the shared render helpers
// established in scripts/yeedu-mega-build.mjs.
// ════════════════════════════════════════════════════════════════
import QRCode from 'qrcode';

const BASE = 'http://localhost:3000';
const LOGO = '/uploads/7d95c235-aa75-4cb1-a3c2-e84314ceca33.png';
const BLOG_URL = 'https://yeedu.com/blog/dumping-observability-data-into-iceberg-lakehouses';

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

const R = { w:1080, h:1350, padX:80, padTop:90, eyebrow:16, h1:88, h1tight:108, h2:46, body:22, bigStat:200, card:22, gap:18 };

const cardBg = `background:linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015));border:1px solid ${C.rule};backdrop-filter:blur(8px);`;

// ── QR pre-render (CTA slide, points at the source blog post) ──
const qrSvg = await QRCode.toString(BLOG_URL, {
  type: 'svg', margin: 0, errorCorrectionLevel: 'M',
  color: { dark: '#ffffff', light: '#00000000' },
});
const qrInner = qrSvg.replace(/<svg[^>]*>/, '').replace('</svg>', '');
function qrCode(size = 180) {
  return `<svg viewBox="0 0 29 29" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${qrInner}</svg>`;
}

// ── Stage shell ──────────────────────────────────────────────────
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
const variantSeq = ['A', 'B', 'C', 'B', 'D'];

function stage(innerHTML, variant = 'A') {
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

function eyebrow(text) {
  return `<div style="display:inline-flex;align-items:center;gap:10px;padding:7px 14px;background:${C.orangeDim};border:1px solid ${C.ruleWarm};border-radius:999px;font-size:${R.eyebrow}px;font-weight:600;color:${C.orangeLight};letter-spacing:1.5px;text-transform:uppercase;">
    <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${C.orange};box-shadow:0 0 10px ${C.orange};"></span>${text}
  </div>`;
}

function headline(lines, { tight = false } = {}) {
  const size = tight ? R.h1tight : R.h1;
  return `<h1 style="margin:24px 0 0;font-family:'Montserrat',sans-serif;font-weight:800;font-size:${size}px;line-height:0.95;letter-spacing:-2.5px;">
    ${lines[0]}<br/><span style="font-weight:300;font-style:italic;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">${lines[1]||''}</span>
  </h1>`;
}

function tagline(text) {
  return `<p style="margin-top:18px;font-size:${R.body}px;line-height:1.45;color:${C.text2};max-width:${Math.round(R.w*0.78)}px;">${text}</p>`;
}

const ICONS = {
  chart:  '<path d="M4 20V8m6 12V4m6 16v-7m6 7V11" stroke="white" stroke-width="1.8" stroke-linecap="round"/>',
  layers: '<path d="M12 2l10 6-10 6L2 8l10-6zM2 14l10 6 10-6M2 11l10 6 10-6" stroke="white" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
  cube:   '<path d="M12 2l9 5v10l-9 5-9-5V7l9-5zM3 7l9 5 9-5M12 12v10" stroke="white" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
  rocket: '<path d="M5 17l2 2c2 2 4 0 5-2l8-13c-7 1-12 6-13 13l-2 5z" stroke="white" stroke-width="1.8" fill="none" stroke-linejoin="round"/><circle cx="15" cy="9" r="2" stroke="white" stroke-width="1.8" fill="none"/>',
};
function icon(name, size = 28) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="color:white;">${ICONS[name] || ICONS.chart}</svg>`;
}

// ── Slide renderers (same shape/spacing as yeedu-mega-build.mjs) ──

function renderCover(d, variant) {
  const padX = R.padX;
  const heroSize = Math.min(R.w * 0.32, 360);
  const inner = `
    <div style="position:absolute;top:${R.padTop}px;left:${padX}px;">
      <img src="${LOGO}" style="height:42px;" />
    </div>
    <svg viewBox="0 0 420 420" style="position:absolute;top:${R.padTop*0.7}px;right:${padX*0.6}px;width:${heroSize}px;height:${heroSize}px;">
      <defs><radialGradient id="cv-obs" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${C.orange}" stop-opacity="1"/><stop offset="60%" stop-color="${C.orange}" stop-opacity="0.4"/><stop offset="100%" stop-color="${C.orange}" stop-opacity="0"/></radialGradient></defs>
      ${[190,160,130,100].map((r,i)=>`<circle cx="210" cy="210" r="${r}" fill="none" stroke="rgba(255,255,255,${0.05+i*0.04})" stroke-width="1"/>`).join('')}
      <circle cx="210" cy="210" r="175" fill="none" stroke="${C.orangeGlow}" stroke-width="1.5" stroke-dasharray="4 10"/>
      ${[0,30,60,90,120,150,180,210,240,270,300,330].map(deg=>{const r=175,x=210+r*Math.cos(deg*Math.PI/180),y=210+r*Math.sin(deg*Math.PI/180),big=deg%90===0;return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${big?5:3}" fill="${C.orangeLight}" style="${big?`filter:drop-shadow(0 0 6px ${C.orange});`:''}"/>`;}).join('')}
      <circle cx="210" cy="210" r="84" fill="url(#cv-obs)"/>
      <circle cx="210" cy="210" r="52" fill="${C.orange}" style="filter:drop-shadow(0 0 36px ${C.orange});"/>
      <text x="210" y="220" text-anchor="middle" fill="#fff" font-family="Montserrat" font-weight="800" font-size="22" letter-spacing="2">ICEBERG</text>
    </svg>
    <div style="position:absolute;top:${Math.round(R.h*0.40)}px;left:${padX}px;right:${padX}px;">
      ${eyebrow(d.eyebrow)}
      ${headline(d.headline, { tight: true })}
      ${tagline(d.tagline)}
    </div>
    <div style="position:absolute;left:${padX}px;right:${padX}px;bottom:${Math.round(R.padTop*1.5)}px;display:flex;gap:0;padding-top:${R.gap}px;border-top:1px solid ${C.ruleWarm};">
      ${d.stats.map(([n,l],i)=>`<div style="flex:1;${i>0?`border-left:1px solid ${C.rule};padding-left:${R.gap}px;`:''}">
        <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:${Math.round(R.h1*0.4)}px;letter-spacing:-1.5px;line-height:1;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">${n}</div>
        <div style="margin-top:6px;font-size:${R.eyebrow-2}px;color:${C.text2};letter-spacing:1px;text-transform:uppercase;">${l}</div>
      </div>`).join('')}
    </div>
  `;
  return stage(inner, variant);
}

function renderPain(d, variant) {
  const inner = `
    <div style="position:absolute;top:${R.padTop}px;left:${R.padX}px;right:${R.padX}px;">
      ${eyebrow(d.eyebrow)}
      ${headline(d.headline)}
      ${d.tagline ? tagline(d.tagline) : ''}
    </div>
    <div style="position:absolute;left:${R.padX}px;right:${R.padX}px;top:${Math.round(R.h*0.44)}px;display:flex;flex-direction:column;gap:${R.gap+6}px;">
      ${d.items.map(([iconName, title, body])=>`
        <div style="display:flex;gap:${R.gap+8}px;padding:${R.card+6}px;${cardBg}border-radius:18px;align-items:flex-start;">
          <div style="width:72px;height:72px;border-radius:14px;background:rgba(242,96,12,0.15);border:1px solid rgba(242,96,12,0.3);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            ${icon(iconName, 36)}
          </div>
          <div>
            <div style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:${R.h2*0.55}px;color:${C.text};letter-spacing:-0.3px;">${title}</div>
            <div style="margin-top:6px;font-size:${R.body-3}px;color:${C.text2};line-height:1.45;">${body}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  return stage(inner, variant);
}

function renderHeroStat(d, variant) {
  const inner = `
    <div style="position:absolute;top:${R.padTop}px;left:${R.padX}px;right:${R.padX}px;">
      ${eyebrow(d.eyebrow)}
    </div>
    <div style="position:absolute;top:${Math.round(R.h*0.30)}px;left:${R.padX}px;right:${R.padX}px;">
      <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:${R.bigStat*1.05}px;line-height:0.88;letter-spacing:-${R.bigStat*0.05}px;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">${d.number}</div>
      <div style="margin-top:${R.gap+10}px;font-family:'Montserrat',sans-serif;font-weight:600;font-size:${R.h2}px;line-height:1.15;letter-spacing:-1px;max-width:${R.w*0.85}px;">${d.subheadline}</div>
      <div style="margin-top:${R.gap}px;font-size:${R.body-2}px;color:${C.text2};line-height:1.5;max-width:${R.w*0.82}px;">${d.body}</div>
    </div>
    <div style="position:absolute;left:${R.padX}px;right:${R.padX}px;bottom:${Math.round(R.padTop*1.7)}px;display:flex;gap:${R.gap}px;">
      ${d.stats.map(([k,v])=>`<div style="flex:1;padding:${R.card}px;${cardBg}border-radius:14px;">
        <div style="font-size:${R.eyebrow-3}px;color:${C.text3};letter-spacing:1.5px;text-transform:uppercase;">${k}</div>
        <div style="margin-top:6px;font-family:'Montserrat',sans-serif;font-weight:800;font-size:${R.h2*0.6}px;color:${C.orangeLight};line-height:1.15;">${v}</div>
      </div>`).join('')}
    </div>
  `;
  return stage(inner, variant);
}

function renderCTA(d, variant) {
  const qrSize = 180;
  const inner = `
    <div style="position:absolute;top:${R.padTop}px;left:${R.padX}px;">
      <img src="${LOGO}" style="height:42px;" />
    </div>
    <svg style="position:absolute;top:${R.padTop*0.7}px;right:${R.padX*0.6}px;width:${R.w*0.2}px;height:${R.w*0.2}px;opacity:0.8;" viewBox="0 0 220 220">
      ${[40,60,80,100].map((r,i)=>`<circle cx="110" cy="110" r="${r}" fill="none" stroke="${C.orange}" stroke-width="1" opacity="${0.3-i*0.05}"/>`).join('')}
      <circle cx="110" cy="110" r="22" fill="${C.orange}" style="filter:drop-shadow(0 0 30px ${C.orange});"/>
    </svg>
    <div style="position:absolute;top:${Math.round(R.h*0.27)}px;left:${R.padX}px;right:${R.padX}px;">
      ${headline(d.headline, { tight: true })}
      <p style="margin-top:${R.gap+10}px;font-size:${R.body+2}px;color:${C.text2};line-height:1.45;max-width:${R.w*0.78}px;">${d.tagline}</p>
    </div>
    <div style="position:absolute;left:${R.padX}px;right:${R.padX}px;top:${Math.round(R.h*0.58)}px;display:flex;gap:${R.gap}px;">
      ${d.steps.map(([n,t,sub])=>`
        <div style="flex:1;padding:${R.card}px;${cardBg}border-radius:14px;">
          <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:${R.h2*0.45}px;color:${C.orangeLight};letter-spacing:1px;">${n}</div>
          <div style="margin-top:${R.gap-4}px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:${R.h2*0.48}px;color:${C.text};letter-spacing:-0.3px;">${t}</div>
          <div style="margin-top:4px;font-size:${R.body-6}px;color:${C.text2};line-height:1.4;">${sub}</div>
        </div>
      `).join('')}
    </div>
    <div style="position:absolute;left:${R.padX}px;right:${R.padX}px;bottom:${Math.round(R.padTop*1.4)}px;display:flex;gap:${R.gap+6}px;align-items:center;">
      <div style="padding:${R.gap}px;background:#fff;border-radius:14px;display:inline-block;">
        ${qrCode(qrSize)}
      </div>
      <div style="flex:1;">
        <div style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:${R.h2*0.55}px;color:#fff;letter-spacing:-0.3px;">Scan to read the full breakdown</div>
        <div style="margin-top:4px;font-size:${R.body-2}px;color:${C.text2};">yeedu.com/blog · sales@yeedu.io</div>
      </div>
    </div>
  `;
  return stage(inner, variant);
}

// ── Content spec — 5 slides ─────────────────────────────────────

const SLIDES = [
  { kind:'cover', data:{
    eyebrow:'Observability × Iceberg',
    headline:['85% cheaper telemetry.','The catch nobody prices in.'],
    tagline:'Moving logs, traces, and metrics into an Iceberg lakehouse can cut spend 50–90% vs. SaaS — but only if you budget for latency and compaction separately.',
    stats:[['$0.10','/GB SaaS'],['$0.023','/GB-mo S3'],['85%','cost cut'],['20–30×','compaction gap']],
  }},
  { kind:'pain', data:{
    eyebrow:'The trade-off',
    headline:['What the cost slide','leaves out.'],
    items:[
      ['chart','Latency isn’t sub-second anymore','SaaS dashboards return in milliseconds. Iceberg queries take seconds to tens of seconds — a permanent architectural trade-off, not a bug to fix.'],
      ['layers','The small-files death spiral','Observability writes millions of tiny continuous records; Iceberg wants few large batch commits. Skip compaction and you get 100,000+ small files — and a collapsed query engine.'],
    ],
  }},
  { kind:'heroStat', data:{
    eyebrow:'Compaction economics',
    number:'20–30×',
    subheadline:'Self-managed compaction beats AWS’s managed option by 20–30×.',
    body:'At 100GB, managed compaction runs $5.04 vs. $0.17 self-managed on EMR spot — and most teams still need a custom write-ahead log, conditional S3 writes, and metadata caching to make it production-ready.',
    stats:[['SELF-MANAGED','$0.17/100GB'],['AWS MANAGED','$5.04/100GB'],['AT ~954GB','20.8×']],
  }},
  { kind:'pain', data:{
    eyebrow:'Where specialization wins',
    headline:['Purpose-built engines','still take the hot path.'],
    items:[
      ['cube','Point queries still hurt','Pulling a single trace or log line during an incident means decompressing entire Parquet pages — metadata contention causes commit retries as manifests grow to millions of entries.'],
      ['rocket','Uber’s compressed log processor: 169×','A custom encoder cut storage from $180K/yr (3-day retention) to $10K/yr (30-day retention) — 17× cheaper, purpose-built for logs.'],
    ],
  }},
  { kind:'cta', data:{
    headline:['Migrate the','right way.'],
    tagline:'A realistic rollout for observability on Iceberg — without the surprise compaction bill.',
    steps:[
      ['01','Split by signal','Logs, metrics, traces in separate tables'],
      ['02','Budget compaction','Write-ahead log + named ownership, day one'],
      ['03','Benchmark first','Test point-query latency before migrating off SaaS'],
    ],
  }},
];

const RENDERERS = { cover: renderCover, pain: renderPain, heroStat: renderHeroStat, cta: renderCTA };

// ── Build ────────────────────────────────────────────────────────

const carouselName = 'Dumping Observability Data Into Iceberg Lakehouses';

const cRes = await fetch(`${BASE}/api/carousels`, {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ name: carouselName, aspectRatio: '4:5' }),
});
const carousel = await cRes.json();
if (!carousel.id) {
  console.log('FAIL creating carousel', carousel);
  process.exit(1);
}

for (let i = 0; i < SLIDES.length; i++) {
  const { kind, data } = SLIDES[i];
  const variant = variantSeq[i % variantSeq.length];
  const html = RENDERERS[kind](data, variant);
  const r = await fetch(`${BASE}/api/carousels/${carousel.id}/slides`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ html, notes: `${kind} slide` }),
  });
  if (r.status !== 201) console.log(' slide err', kind, r.status, await r.text());
}

console.log('✓', carouselName);
console.log('id:', carousel.id);
console.log('url:', `http://localhost:3000/?carousel=${carousel.id}`);
