// ════════════════════════════════════════════════════════════════
// Yeedu Office Banners — 9:16 roll-ups (1080×1920)
// 7 unique poster designs, each with its own focal point.
// Built for legibility from across a room. Strong Yeedu lockup.
// ════════════════════════════════════════════════════════════════
import QRCode from 'qrcode';
import fs from 'fs';

const BASE = 'http://localhost:3000';
const LOGO = '/uploads/7d95c235-aa75-4cb1-a3c2-e84314ceca33.png';
const QR_URL = 'https://yeedu.com';

const C = {
  orange:'#f2600c', orangeLight:'#ff8a3d', orangeSoft:'#ffae7a',
  orangeGlow:'rgba(242,96,12,0.40)', orangeDim:'rgba(242,96,12,0.16)',
  brown:'#26221d', brownDeep:'#14110d',
  text:'#ffffff', text2:'rgba(255,255,255,0.74)', text3:'rgba(255,255,255,0.45)', text4:'rgba(255,255,255,0.22)',
  rule:'rgba(255,255,255,0.10)', ruleWarm:'rgba(242,140,90,0.20)',
};

// Clean up only 9:16 carousels from before; leave 1:1 and 4:5 intact
const oldIds = fs.existsSync('/tmp/yeedu-poster-ids.json') ? JSON.parse(fs.readFileSync('/tmp/yeedu-poster-ids.json','utf8')) : [];
for (const c of oldIds) if (c.ratio === '9:16') await fetch(`${BASE}/api/carousels/${c.id}`, { method:'DELETE' });

const qrSvg = await QRCode.toString(QR_URL, { type:'svg', margin:0, errorCorrectionLevel:'M', color:{dark:'#0d0b09',light:'#00000000'}});
const qrInner = qrSvg.replace(/<svg[^>]*>/, '').replace('</svg>', '');
const qrCode = size => `<svg viewBox="0 0 29 29" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${qrInner}</svg>`;

const W = 1080, H = 1920;

const icon = (name, size = 24) => {
  const paths = {
    ai: '<path d="M12 4v4M12 16v4M4 12h4M16 12h4M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3" stroke="white" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="12" r="3" stroke="white" stroke-width="1.8" fill="none"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">${paths[name]||paths.ai}</svg>`;
};

// ─────────────────────────────────────────────────────────────
// Shared atoms
// ─────────────────────────────────────────────────────────────

function backdrop({ glow = 'top-right', grain = true } = {}) {
  const glows = {
    'top-right':    'radial-gradient(ellipse 60% 40% at 95% -5%, rgba(242,96,12,0.34), transparent 55%)',
    'bottom-left':  'radial-gradient(ellipse 60% 40% at 5% 105%, rgba(242,140,60,0.28), transparent 55%)',
    'center':       'radial-gradient(ellipse 70% 40% at 50% 50%, rgba(242,96,12,0.20), transparent 60%)',
    'top-band':     'radial-gradient(ellipse 80% 30% at 50% 0%, rgba(242,96,12,0.32), transparent 60%)',
    'bottom-band':  'radial-gradient(ellipse 80% 30% at 50% 100%, rgba(242,96,12,0.34), transparent 60%)',
    'split':        'radial-gradient(ellipse 50% 30% at 100% 30%, rgba(242,96,12,0.36), transparent 55%), radial-gradient(ellipse 50% 30% at 0% 70%, rgba(242,140,60,0.24), transparent 55%)',
    'full':         'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(242,96,12,0.34), transparent 55%), radial-gradient(ellipse 60% 50% at 50% 80%, rgba(242,140,60,0.20), transparent 55%)',
  };
  return `
    <div style="position:absolute;inset:0;background:linear-gradient(168deg,${C.brown} 0%,${C.brownDeep} 50%,#0a0807 100%);pointer-events:none;"></div>
    <div style="position:absolute;inset:0;background:${glows[glow]};pointer-events:none;"></div>
    ${grain ? `<div style="position:absolute;inset:0;background-image:radial-gradient(circle at 1px 1px,rgba(255,255,255,0.05) 1px,transparent 0);background-size:36px 36px;opacity:0.55;pointer-events:none;"></div>` : ''}
    <svg style="position:absolute;top:0;right:0;width:520px;height:520px;opacity:0.14;pointer-events:none;" viewBox="0 0 400 400">
      ${[120,160,200,240,280,320,360].map(r=>`<circle cx="400" cy="0" r="${r}" fill="none" stroke="${C.orange}" stroke-width="1" stroke-dasharray="3 8"/>`).join('')}
    </svg>
    <svg style="position:absolute;bottom:0;left:0;width:380px;height:380px;opacity:0.10;pointer-events:none;" viewBox="0 0 400 400">
      ${[80,120,160,200,240,280,320].map(r=>`<circle cx="0" cy="400" r="${r}" fill="none" stroke="${C.orangeLight}" stroke-width="1"/>`).join('')}
    </svg>
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse 95% 95% at 50% 50%,transparent 55%,rgba(0,0,0,0.55) 100%);pointer-events:none;"></div>
  `;
}

// LEFT side of brand row — yeedu.com URL + tagline (no logo image here)
function logoLockup({ color = C.orangeLight, tagline = 'High-Performance Spark Engine' } = {}) {
  return `
    <div style="display:flex;flex-direction:column;align-items:flex-start;">
      <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:36px;color:#fff;letter-spacing:-0.8px;line-height:1;">yeedu.com</div>
      <div style="margin-top:8px;font-size:17px;color:${color};font-family:'Inter',sans-serif;font-weight:700;letter-spacing:2px;text-transform:uppercase;">${tagline}</div>
    </div>`;
}

// RIGHT side of brand row — Yeedu logo image (with optional context chip beneath)
function chipTopRight(label, opts = {}) {
  const logoSize = opts.logoSize || 72;
  return `<div style="display:flex;flex-direction:column;align-items:flex-end;gap:12px;">
    <img src="${LOGO}" style="height:${logoSize}px;" />
    ${label ? `<div style="display:inline-flex;align-items:center;gap:8px;padding:8px 18px;background:${C.orangeDim};border:1px solid ${C.ruleWarm};border-radius:999px;font-size:13px;font-weight:700;color:${C.orangeLight};letter-spacing:2px;text-transform:uppercase;">
      <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${C.orange};box-shadow:0 0 10px ${C.orange};"></span>${label}
    </div>` : ''}
  </div>`;
}

// QR + scan-to-X strip — universal "Scan here to know more" headline
function qrStrip({ qrSize = 200, headline, subtitle = 'yeedu.com · sales@yeedu.com', cta = 'Get estimate →' } = {}) {
  return `
    <div style="display:flex;align-items:center;gap:32px;">
      <div style="padding:18px;background:#fff;border-radius:20px;line-height:0;box-shadow:0 24px 64px rgba(0,0,0,0.45);flex-shrink:0;">${qrCode(qrSize)}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:42px;color:#fff;letter-spacing:-1px;line-height:1.05;">Scan here to know more</div>
        <div style="margin-top:10px;font-size:24px;color:${C.text2};">${subtitle}</div>
        <div style="margin-top:22px;display:inline-block;padding:20px 36px;background:${C.orange};border-radius:999px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:22px;color:#fff;box-shadow:0 16px 50px rgba(242,96,12,0.5);">${cta}</div>
      </div>
    </div>`;
}

// Footer band — printed bottom of every banner
function footerBand() {
  return `<div style="display:flex;align-items:center;justify-content:space-between;font-size:20px;color:${C.text3};font-family:'Inter',sans-serif;">
    <span style="display:flex;align-items:center;gap:10px;">
      <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${C.orange};box-shadow:0 0 8px ${C.orange};"></span>
      Run faster. Pay less. Stay portable.
    </span>
    <span style="font-weight:700;letter-spacing:1.5px;color:${C.orangeLight};">yeedu.com</span>
  </div>`;
}

// Banner shell
function banner(innerHTML, opts = {}) {
  return `<div style="width:${W}px;height:${H}px;position:relative;overflow:hidden;font-family:'Inter',sans-serif;color:${C.text};-webkit-font-smoothing:antialiased;">
    ${backdrop(opts)}
    <div style="position:relative;z-index:2;width:100%;height:100%;">${innerHTML}</div>
  </div>`;
}

// ─────────────────────────────────────────────────────────────
// 7 UNIQUE BANNER LAYOUTS
// ─────────────────────────────────────────────────────────────

// ── 1. BRAND / COVER ────────────────────────────────────────────
function banner1_brand() {
  return banner(`
    <div style="position:absolute;top:120px;left:90px;right:90px;display:flex;align-items:center;justify-content:space-between;">
      ${logoLockup({ size: 64 })}
      ${chipTopRight('Introducing')}
    </div>

    <!-- centered massive wordmark statement -->
    <div style="position:absolute;top:460px;left:90px;right:90px;text-align:center;">
      <div style="display:inline-block;width:160px;height:5px;background:linear-gradient(90deg,${C.orange},${C.orangeLight});margin:0 auto 50px;border-radius:3px;"></div>
      <h1 style="margin:0;font-family:'Montserrat',sans-serif;font-weight:800;font-size:148px;line-height:0.92;letter-spacing:-5px;color:#fff;">
        Apache Spark,
      </h1>
      <h1 style="margin:8px 0 0;font-family:'Montserrat',sans-serif;font-weight:300;font-style:italic;font-size:180px;line-height:0.92;letter-spacing:-6px;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">
        redefined.
      </h1>
      <div style="display:inline-block;width:160px;height:5px;background:linear-gradient(90deg,${C.orange},${C.orangeLight});margin:50px auto 0;border-radius:3px;"></div>
    </div>

    <!-- supporting tagline -->
    <div style="position:absolute;top:1100px;left:90px;right:90px;text-align:center;">
      <p style="margin:0;font-family:'Inter',sans-serif;font-size:36px;line-height:1.4;color:${C.text}; font-weight:500;max-width:920px;margin-left:auto;margin-right:auto;">
        The re-architected Spark engine that<br/>crunches <span style="color:${C.orangeLight};font-weight:700;">data,</span> not <span style="color:${C.orangeLight};font-weight:700;">dollars.</span>
      </p>
    </div>

    <!-- 2-up stat strip — the headline numbers -->
    <div style="position:absolute;top:1370px;left:90px;right:90px;display:flex;align-items:center;border-top:1px solid ${C.ruleWarm};border-bottom:1px solid ${C.ruleWarm};padding:36px 0;">
      ${[['4–10×','faster Spark'],['60–80%','cheaper compute']].map(([n,l],i)=>`
        <div style="flex:1;${i>0?`border-left:1px solid ${C.rule};`:''}text-align:center;">
          <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:74px;line-height:1;letter-spacing:-2.5px;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">${n}</div>
          <div style="margin-top:14px;font-size:20px;color:${C.text2};letter-spacing:1.8px;text-transform:uppercase;font-weight:600;">${l}</div>
        </div>
      `).join('')}
    </div>

    <!-- QR + CTA -->
    <div style="position:absolute;left:90px;right:90px;bottom:160px;">
      ${qrStrip({ cta:'yeedu.com →' })}
    </div>

    <div style="position:absolute;left:90px;right:90px;bottom:80px;">
      ${footerBand()}
    </div>
  `, { glow: 'full' });
}

// ── 2. TPC-DS HERO NUMBER ──────────────────────────────────────
function banner2_tpcds() {
  return banner(`
    <div style="position:absolute;top:120px;left:90px;right:90px;display:flex;align-items:center;justify-content:space-between;">
      ${logoLockup({ size: 58, tagline: 'Verified Benchmark' })}
      ${chipTopRight('TPC-DS · 99 Queries')}
    </div>

    <div style="position:absolute;top:380px;left:90px;right:90px;text-align:center;">
      <div style="font-size:28px;font-family:'Inter',sans-serif;color:${C.orangeLight};letter-spacing:4px;text-transform:uppercase;font-weight:700;">Verified · TPC-DS · 99 / 99 queries</div>
      <h1 style="margin:28px 0 0;font-family:'Montserrat',sans-serif;font-weight:800;font-size:124px;line-height:0.92;letter-spacing:-4px;color:#fff;">
        We broke
      </h1>
      <h1 style="margin:6px 0 0;font-family:'Montserrat',sans-serif;font-weight:300;font-style:italic;font-size:124px;line-height:0.92;letter-spacing:-4px;background:linear-gradient(180deg,#fff,${C.orangeLight} 80%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 30px rgba(242,96,12,0.3));">
        big data economics.
      </h1>
      <div style="margin-top:30px;font-family:'Inter',sans-serif;font-size:30px;color:${C.text2};line-height:1.35;max-width:920px;margin-left:auto;margin-right:auto;">
        Full TPC-DS suite at production scale — every query, zero rewrites,<br/>standard cloud hardware. The only variable is the engine.
      </div>
    </div>

    <!-- the proof: 3-tier bar chart (1/3/10 TB) — REAL benchmark numbers -->
    <div style="position:absolute;top:1000px;left:90px;right:90px;padding:32px 32px 28px;background:rgba(255,255,255,0.04);border:1px solid ${C.ruleWarm};border-radius:22px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <span style="font-size:15px;color:${C.orangeLight};letter-spacing:2px;text-transform:uppercase;font-weight:700;">Full TPC-DS benchmark · total cost & runtime</span>
        <span style="font-size:13px;color:${C.text3};letter-spacing:1.5px;font-weight:600;">99 queries · standard cloud instances</span>
      </div>
      <div style="display:flex;align-items:flex-end;justify-content:space-around;gap:28px;padding-top:14px;">
        ${[
          ['1 TB','$0.52','17 min','100','less than a pack of gum'],
          ['3 TB','$2.33','40 min','160','less than a gas-station coffee'],
          ['10 TB','$12.57','3h 10m','260','less than a weekday lunch'],
        ].map(([dataset,cost,time,h,quip])=>`
          <div style="display:flex;flex-direction:column;align-items:center;flex:1;">
            <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:54px;margin-bottom:14px;letter-spacing:-1.8px;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">${cost}</div>
            <div style="width:130px;height:${h}px;background:linear-gradient(180deg,${C.orangeLight},${C.orange});border-radius:12px;box-shadow:0 14px 36px ${C.orangeGlow};"></div>
            <div style="margin-top:18px;font-family:'Montserrat',sans-serif;font-size:34px;color:#fff;font-weight:700;letter-spacing:-1px;">${dataset}</div>
            <div style="margin-top:6px;font-size:16px;color:${C.text2};letter-spacing:1px;font-weight:600;">${time}</div>
            <div style="margin-top:6px;font-size:13px;color:${C.text3};line-height:1.3;text-align:center;max-width:160px;">${quip}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- methodology footer line -->
    <div style="position:absolute;top:1535px;left:90px;right:90px;text-align:center;">
      <div style="font-size:20px;color:${C.text2};font-family:'Inter',sans-serif;line-height:1.4;">
        <span style="color:${C.orangeLight};letter-spacing:1.5px;text-transform:uppercase;font-weight:700;">Methodology</span> &nbsp;·&nbsp;
        Full TPC-DS suite · zero failures · zero rewrites · reproducible on your cloud
      </div>
    </div>

    <div style="position:absolute;left:90px;right:90px;bottom:160px;">
      ${qrStrip({ headline:'Scan · Verify the run', cta:'Get methodology →' })}
    </div>

    <div style="position:absolute;left:90px;right:90px;bottom:80px;">
      ${footerBand()}
    </div>
  `, { glow: 'top-right' });
}

// ── 3. YEEDU TURBO — 10× ───────────────────────────────────────
function banner3_turbo() {
  return banner(`
    <!-- big engine schematic behind hero (decorative) -->
    <svg style="position:absolute;top:480px;left:50%;transform:translateX(-50%);width:780px;height:780px;opacity:0.16;pointer-events:none;" viewBox="0 0 420 420">
      ${[200,170,140,110,80].map((r,i)=>`<circle cx="210" cy="210" r="${r}" fill="none" stroke="${C.orange}" stroke-width="${i===0?1.5:1}" stroke-dasharray="${i===0?'3 12':'2 6'}"/>`).join('')}
      ${[0,30,60,90,120,150,180,210,240,270,300,330].map(deg=>{const a=deg*Math.PI/180,x=210+200*Math.cos(a),y=210+200*Math.sin(a);return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="${C.orangeLight}"/>`;}).join('')}
    </svg>

    <div style="position:absolute;top:120px;left:90px;right:90px;display:flex;align-items:center;justify-content:space-between;">
      ${logoLockup({ size: 58, tagline: 'Yeedu Turbo Engine' })}
      ${chipTopRight('C++ · SIMD · Vectorized')}
    </div>

    <div style="position:absolute;top:520px;left:90px;right:90px;text-align:center;">
      <h1 style="margin:0;font-family:'Montserrat',sans-serif;font-weight:800;font-size:440px;line-height:0.85;letter-spacing:-22px;background:linear-gradient(180deg,#fff,${C.orangeLight} 80%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 80px rgba(242,96,12,0.5));">
        10×
      </h1>
      <div style="margin-top:20px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:68px;color:#fff;letter-spacing:-2px;">faster Spark.</div>
    </div>

    <div style="position:absolute;top:1180px;left:90px;right:90px;text-align:center;">
      <div style="font-family:'Inter',sans-serif;font-size:30px;color:${C.text}; font-weight:500;line-height:1.4;max-width:920px;margin:0 auto;">
        A re-architected Apache Spark engine built in C++ with SIMD vectorization.<br/>Same PySpark. Same Scala. Same notebooks. <span style="color:${C.orangeLight};font-weight:700;">Different engine underneath.</span>
      </div>
    </div>

    <!-- three tech tags -->
    <div style="position:absolute;top:1360px;left:90px;right:90px;display:flex;gap:14px;justify-content:center;">
      ${['SIMD KERNELS','SMART SCHEDULER','JOB MULTIPLEXER'].map(t=>`
        <div style="padding:14px 22px;background:rgba(255,255,255,0.06);border:1px solid ${C.ruleWarm};border-radius:12px;font-family:'Inter',sans-serif;font-size:15px;font-weight:700;color:${C.orangeLight};letter-spacing:1.5px;">${t}</div>
      `).join('')}
    </div>

    <div style="position:absolute;left:90px;right:90px;bottom:160px;">
      ${qrStrip({ headline:'Scan · See the architecture', cta:'Talk to engineering →' })}
    </div>

    <div style="position:absolute;left:90px;right:90px;bottom:80px;">
      ${footerBand()}
    </div>
  `, { glow: 'center' });
}

// ── 4. MIGRATION — 0 REWRITES ──────────────────────────────────
function banner4_migration() {
  return banner(`
    <div style="position:absolute;top:120px;left:90px;right:90px;display:flex;align-items:center;justify-content:space-between;">
      ${logoLockup({ size: 58, tagline: 'Migration · As-Is' })}
      ${chipTopRight('Drop-in Compatibility')}
    </div>

    <div style="position:absolute;top:360px;left:90px;right:90px;text-align:center;">
      <div style="font-family:'Inter',sans-serif;font-size:30px;color:${C.text2};letter-spacing:3px;text-transform:uppercase;font-weight:600;">Code rewrites needed</div>
      <h1 style="margin:20px 0 0;font-family:'Montserrat',sans-serif;font-weight:800;font-size:300px;line-height:0.9;letter-spacing:-12px;background:linear-gradient(180deg,#fff,${C.orangeLight} 80%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 80px rgba(242,96,12,0.5));">
        Zero.
      </h1>
    </div>

    <div style="position:absolute;top:1000px;left:90px;right:90px;text-align:center;">
      <div style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:56px;color:#fff;line-height:1.1;letter-spacing:-1.5px;">
        Same PySpark.
      </div>
      <div style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:56px;color:#fff;line-height:1.1;letter-spacing:-1.5px;">
        Same Scala.
      </div>
      <div style="font-family:'Montserrat',sans-serif;font-weight:300;font-style:italic;font-size:56px;line-height:1.1;letter-spacing:-1.5px;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">
        Smaller bill.
      </div>
    </div>

    <!-- source platforms — compact pill row -->
    <div style="position:absolute;top:1260px;left:90px;right:90px;text-align:center;">
      <div style="font-size:14px;color:${C.orangeLight};letter-spacing:2.5px;text-transform:uppercase;font-weight:700;margin-bottom:14px;">Migrates from every managed Spark</div>
      <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;">
        ${['Databricks','AWS EMR','Google Dataproc','Cloudera'].map(name=>`
          <div style="display:inline-flex;align-items:center;gap:10px;padding:12px 22px;background:rgba(255,255,255,0.05);border:1px solid ${C.ruleWarm};border-radius:999px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="${C.orange}"/>
              <path d="M7 12 L 11 16 L 17 8" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span style="font-family:'Inter',sans-serif;font-size:20px;font-weight:600;color:#fff;">${name}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div style="position:absolute;left:90px;right:90px;bottom:160px;">
      ${qrStrip({ headline:'Scan · Migrate one workload', cta:'Start migration →' })}
    </div>

    <div style="position:absolute;left:90px;right:90px;bottom:80px;">
      ${footerBand()}
    </div>
  `, { glow: 'bottom-left' });
}

// ── 5. COST — 60-80% ───────────────────────────────────────────
function banner5_cost() {
  return banner(`
    <div style="position:absolute;top:120px;left:90px;right:90px;display:flex;align-items:center;justify-content:space-between;">
      ${logoLockup({ size: 58, tagline: 'Cost Optimization' })}
      ${chipTopRight('Documented')}
    </div>

    <div style="position:absolute;top:380px;left:90px;right:90px;text-align:center;">
      <div style="font-family:'Inter',sans-serif;font-size:30px;color:${C.text2};letter-spacing:3px;text-transform:uppercase;font-weight:600;">Less cloud spend</div>
      <div style="display:flex;align-items:center;justify-content:center;gap:24px;margin-top:24px;">
        <h1 style="margin:0;font-family:'Montserrat',sans-serif;font-weight:800;font-size:220px;line-height:0.88;letter-spacing:-9px;white-space:nowrap;background:linear-gradient(180deg,#fff,${C.orangeLight} 80%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 60px rgba(242,96,12,0.4));">
          60–80%
        </h1>
        <!-- big down arrow -->
        <svg width="90" height="220" viewBox="0 0 90 220" style="flex-shrink:0;filter:drop-shadow(0 0 30px ${C.orangeGlow});">
          <defs>
            <linearGradient id="dn" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="${C.orangeLight}"/>
              <stop offset="100%" stop-color="${C.orange}"/>
            </linearGradient>
          </defs>
          <rect x="32" y="10" width="26" height="150" rx="6" fill="url(#dn)"/>
          <polygon points="10,150 80,150 45,210" fill="url(#dn)"/>
        </svg>
      </div>
    </div>

    <!-- COST DROP visual: dramatic descending bars -->
    <div style="position:absolute;top:880px;left:90px;right:90px;padding:34px 32px 28px;background:rgba(255,255,255,0.04);border:1px solid ${C.ruleWarm};border-radius:22px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
        <span style="font-size:15px;color:${C.orangeLight};letter-spacing:2px;text-transform:uppercase;font-weight:700;">Your annual cloud bill — before vs after</span>
        <span style="font-size:13px;color:${C.text3};letter-spacing:1.5px;font-weight:600;">illustrative · documented case</span>
      </div>
      <div style="display:flex;align-items:flex-end;justify-content:space-around;gap:50px;padding-top:8px;height:280px;">
        <!-- BEFORE bar -->
        <div style="display:flex;flex-direction:column;align-items:center;flex:1;">
          <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:38px;color:#fff;margin-bottom:14px;letter-spacing:-1px;">$143K</div>
          <div style="width:140px;height:240px;background:rgba(255,255,255,0.16);border-radius:12px;border:1px solid ${C.rule};"></div>
          <div style="margin-top:14px;font-family:'Montserrat',sans-serif;font-size:24px;color:${C.text2};font-weight:700;letter-spacing:-0.5px;">BEFORE</div>
          <div style="margin-top:4px;font-size:14px;color:${C.text3};letter-spacing:1px;">previous platform</div>
        </div>
        <!-- big down arrow between bars -->
        <svg width="120" height="80" viewBox="0 0 120 80" style="flex-shrink:0;align-self:center;">
          <line x1="6" y1="20" x2="86" y2="60" stroke="${C.orangeLight}" stroke-width="4" stroke-linecap="round"/>
          <polygon points="74,46 96,76 100,40" fill="${C.orangeLight}" style="filter:drop-shadow(0 0 8px ${C.orangeGlow});"/>
          <text x="60" y="14" text-anchor="middle" fill="${C.orangeLight}" font-family="Montserrat" font-size="18" font-weight="800">−80%</text>
        </svg>
        <!-- AFTER bar -->
        <div style="display:flex;flex-direction:column;align-items:center;flex:1;">
          <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:38px;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:14px;letter-spacing:-1px;">$28K</div>
          <div style="width:140px;height:48px;background:linear-gradient(180deg,${C.orangeLight},${C.orange});border-radius:12px;box-shadow:0 18px 40px ${C.orangeGlow};"></div>
          <div style="margin-top:14px;font-family:'Montserrat',sans-serif;font-size:24px;color:${C.orangeLight};font-weight:800;letter-spacing:-0.5px;">AFTER YEEDU</div>
          <div style="margin-top:4px;font-size:14px;color:${C.text3};letter-spacing:1px;">same workload</div>
        </div>
      </div>
    </div>

    <!-- mechanism row -->
    <div style="position:absolute;top:1380px;left:90px;right:90px;display:flex;justify-content:space-around;gap:14px;">
      ${['Vectorized C++','Smart scheduling','Job multiplexing'].map(t=>`
        <div style="font-family:'Inter',sans-serif;font-size:14px;font-weight:700;color:${C.orangeLight};letter-spacing:1.5px;text-transform:uppercase;">${t}</div>
      `).join('')}
    </div>

    <div style="position:absolute;left:90px;right:90px;bottom:160px;">
      ${qrStrip({ headline:'Scan · Run your estimate', cta:'See your savings →' })}
    </div>

    <div style="position:absolute;left:90px;right:90px;bottom:80px;">
      ${footerBand()}
    </div>
  `, { glow: 'bottom-band' });
}

// ── 6. TRUST — IN YOUR ACCOUNT ─────────────────────────────────
function banner6_trust() {
  return banner(`
    <div style="position:absolute;top:120px;left:90px;right:90px;display:flex;align-items:center;justify-content:space-between;">
      ${logoLockup({ size: 58, tagline: 'Security · Architecture' })}
      ${chipTopRight('In Your Account')}
    </div>

    <div style="position:absolute;top:400px;left:90px;right:90px;text-align:center;">
      <div style="font-family:'Inter',sans-serif;font-size:32px;color:${C.text2};letter-spacing:3px;text-transform:uppercase;font-weight:600;">Compute runs</div>
      <h1 style="margin:24px 0 0;font-family:'Montserrat',sans-serif;font-weight:800;font-size:104px;line-height:0.96;letter-spacing:-3.5px;color:#fff;">
        In your account.
      </h1>
      <h1 style="margin:6px 0 0;font-family:'Montserrat',sans-serif;font-weight:300;font-style:italic;font-size:104px;line-height:0.96;letter-spacing:-3.5px;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">
        Open from day one.
      </h1>
    </div>

    <!-- compact architecture visual -->
    <div style="position:absolute;top:960px;left:90px;right:90px;display:flex;gap:14px;">
      <div style="flex:1.4;padding:22px;background:rgba(255,255,255,0.04);border:1px solid ${C.rule};border-radius:16px;">
        <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:16px;color:#fff;letter-spacing:1.5px;">YOUR CLOUD ACCOUNT</div>
        <div style="margin-top:4px;font-size:13px;color:${C.text3};">behind your firewall</div>
        <div style="margin-top:14px;display:flex;flex-direction:column;gap:8px;">
          ${[['Yeedu Compute','VPC-private'],['Your Data','S3 · ADLS · GCS'],['Your Catalog','Hive · Unity · Glue']].map(([t,sub])=>`
            <div style="padding:10px 14px;background:rgba(255,255,255,0.05);border:1px solid ${C.ruleWarm};border-radius:8px;">
              <div style="font-family:'Inter',sans-serif;font-weight:700;font-size:16px;color:#fff;">${t}</div>
              <div style="margin-top:1px;font-size:12px;color:${C.text2};">${sub}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div style="flex:1;padding:22px;background:linear-gradient(160deg,${C.orange},#c44a08);border-radius:16px;box-shadow:0 18px 50px ${C.orangeGlow};">
        <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:16px;color:#fff;letter-spacing:1.5px;">YEEDU CONTROL</div>
        <div style="margin-top:4px;font-size:13px;color:rgba(255,255,255,0.85);">SaaS · metadata only</div>
        <div style="margin-top:14px;display:flex;flex-direction:column;gap:6px;">
          ${['Orchestration','Observability','Cost & audit'].map(t=>`
            <div style="padding:9px 12px;background:rgba(0,0,0,0.22);border:1px solid rgba(255,255,255,0.2);border-radius:6px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;color:#fff;">${t}</div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- trust checklist -->
    <div style="position:absolute;top:1300px;left:90px;right:90px;padding:22px 28px;background:rgba(255,255,255,0.03);border:1px solid ${C.ruleWarm};border-radius:16px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        ${[
          'SOC 2 Type II posture',
          'Open-source Apache Spark',
          'Open table formats',
          'Zero data egress to SaaS',
        ].map(t=>`
          <div style="display:flex;align-items:center;gap:12px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="0" y="0" width="24" height="24" rx="6" fill="${C.orange}"/>
              <path d="M5 12 L 10 17 L 19 7" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span style="font-family:'Inter',sans-serif;font-size:17px;font-weight:600;color:#fff;">${t}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div style="position:absolute;left:90px;right:90px;bottom:160px;">
      ${qrStrip({ headline:'Scan · Architecture details', cta:'Talk to security →' })}
    </div>

    <div style="position:absolute;left:90px;right:90px;bottom:80px;">
      ${footerBand()}
    </div>
  `, { glow: 'split' });
}

// ── 7. CTA — TALK TO US TONIGHT (QR-centric) ──────────────────
function banner7_cta() {
  const giantQrSize = 460;
  return banner(`
    <div style="position:absolute;top:120px;left:90px;right:90px;display:flex;align-items:center;justify-content:space-between;">
      ${logoLockup({ size: 64, tagline: 'Talk to us' })}
      ${chipTopRight('Tonight')}
    </div>

    <div style="position:absolute;top:360px;left:90px;right:90px;text-align:center;">
      <h1 style="margin:0;font-family:'Montserrat',sans-serif;font-weight:800;font-size:118px;line-height:0.92;letter-spacing:-3.5px;color:#fff;">
        Talk to us
      </h1>
      <h1 style="margin:6px 0 0;font-family:'Montserrat',sans-serif;font-weight:300;font-style:italic;font-size:118px;line-height:0.92;letter-spacing:-3.5px;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">
        tonight.
      </h1>
    </div>

    <!-- GIANT QR — focal element -->
    <div style="position:absolute;top:760px;left:50%;transform:translateX(-50%);padding:32px;background:#fff;border-radius:36px;line-height:0;box-shadow:0 40px 100px rgba(242,96,12,0.5);">
      ${qrCode(giantQrSize)}
    </div>

    <div style="position:absolute;top:1380px;left:90px;right:90px;text-align:center;">
      <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:48px;color:#fff;letter-spacing:-1px;">Scan · Subscribe · Estimate</div>
      <div style="margin-top:16px;font-family:'Inter',sans-serif;font-size:26px;color:${C.text2};">yeedu.com · sales@yeedu.com</div>
    </div>

    <!-- find us strip -->
    <div style="position:absolute;left:90px;right:90px;bottom:280px;padding:24px 32px;background:rgba(255,255,255,0.04);border:1px solid ${C.ruleWarm};border-radius:18px;display:flex;align-items:center;gap:18px;justify-content:center;">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="${C.orangeLight}" stroke-width="2" fill="none"/>
        <circle cx="12" cy="10" r="3" stroke="${C.orangeLight}" stroke-width="2" fill="none"/>
      </svg>
      <div style="font-family:'Inter',sans-serif;font-size:24px;color:#fff;font-weight:600;letter-spacing:0.5px;">Find us at the back of the room</div>
    </div>

    <div style="position:absolute;left:90px;right:90px;bottom:80px;">
      ${footerBand()}
    </div>
  `, { glow: 'full' });
}

// ── 8. YEEDU ASSISTANT X — chat-mockup focused ─────────────────
function banner8_assistantX() {
  return banner(`
    <div style="position:absolute;top:120px;left:90px;right:90px;display:flex;align-items:center;justify-content:space-between;">
      ${logoLockup({ size: 58, tagline: 'Yeedu Assistant X' })}
      ${chipTopRight('AI Spark Companion')}
    </div>

    <!-- headline -->
    <div style="position:absolute;top:360px;left:90px;right:90px;">
      <h1 style="margin:0;font-family:'Montserrat',sans-serif;font-weight:800;font-size:148px;line-height:0.92;letter-spacing:-5px;color:#fff;">
        Spark
      </h1>
      <h1 style="margin:6px 0 0;font-family:'Montserrat',sans-serif;font-weight:300;font-style:italic;font-size:148px;line-height:0.92;letter-spacing:-5px;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 40px rgba(242,96,12,0.4));">
        made easy.
      </h1>
      <p style="margin:24px 0 0;font-family:'Inter',sans-serif;font-size:28px;line-height:1.4;color:${C.text2};max-width:900px;">
        From cryptic stack trace to actionable fix — in seconds. Claude + ChatGPT powered AI debugging built into your Spark workflow.
      </p>
    </div>

    <!-- chat mockup diagram (the proper diagram the user asked for) -->
    <div style="position:absolute;top:680px;left:90px;right:90px;background:linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02));border:1px solid ${C.rule};border-radius:22px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.4);">
      <!-- title bar -->
      <div style="padding:18px 22px;border-bottom:1px solid ${C.rule};display:flex;align-items:center;gap:10px;background:rgba(0,0,0,0.3);">
        <span style="width:12px;height:12px;border-radius:50%;background:#ff5f56;"></span>
        <span style="width:12px;height:12px;border-radius:50%;background:#ffbd2e;"></span>
        <span style="width:12px;height:12px;border-radius:50%;background:#27c93f;"></span>
        <span style="margin-left:14px;font-family:'Inter',sans-serif;font-size:13px;color:${C.text3};letter-spacing:1px;">Yeedu Assistant X · screen-aware</span>
      </div>
      <!-- conversation -->
      <div style="padding:24px;display:flex;flex-direction:column;gap:14px;">
        <!-- user msg -->
        <div style="display:flex;justify-content:flex-end;">
          <div style="max-width:78%;padding:14px 20px;background:rgba(255,255,255,0.08);border-radius:14px 14px 4px 14px;">
            <div style="font-family:'Inter',sans-serif;font-size:18px;color:#fff;line-height:1.4;">My job 15847 keeps failing with OutOfMemoryError</div>
          </div>
        </div>
        <!-- ai msg -->
        <div style="display:flex;gap:12px;">
          <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,${C.orange},${C.orangeLight});display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 0 12px ${C.orangeGlow};">
            ${icon('ai',18)}
          </div>
          <div style="flex:1;padding:16px 20px;background:rgba(242,96,12,0.10);border:1px solid ${C.orangeGlow};border-radius:14px 14px 14px 4px;">
            <div style="font-family:'Inter',sans-serif;font-size:13px;color:${C.orangeLight};letter-spacing:1.5px;font-weight:700;text-transform:uppercase;margin-bottom:8px;">Assistant X · analyzed in 4s</div>
            <div style="font-family:'Inter',sans-serif;font-size:18px;color:#fff;line-height:1.45;margin-bottom:10px;">Root cause: undersized executor memory vs your data volume.</div>
            <div style="font-family:monospace;font-size:14px;color:${C.text2};background:rgba(0,0,0,0.35);padding:12px 14px;border-radius:8px;border-left:3px solid ${C.orange};line-height:1.5;">
              executor.memory: <span style="color:${C.orangeLight};">12G</span><br/>
              executor.cores: <span style="color:${C.orangeLight};">4</span><br/>
              dynamicAllocation: <span style="color:${C.orangeLight};">true</span>
            </div>
            <div style="margin-top:12px;display:flex;gap:8px;">
              <span style="padding:8px 14px;background:${C.orange};border-radius:8px;font-size:13px;font-weight:600;color:#fff;">Apply Fix</span>
              <span style="padding:8px 14px;background:rgba(255,255,255,0.08);border:1px solid ${C.rule};border-radius:8px;font-size:13px;font-weight:600;color:${C.text2};">Show details</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- compact capability badges, single row -->
    <div style="position:absolute;top:1280px;left:90px;right:90px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
      ${['Conversational','Contextual','Screen-aware','Claude + ChatGPT'].map(t=>`
        <div style="padding:10px 18px;background:rgba(242,96,12,0.10);border:1px solid ${C.ruleWarm};border-radius:999px;font-family:'Inter',sans-serif;font-size:14px;font-weight:700;color:${C.orangeLight};letter-spacing:1px;">${t}</div>
      `).join('')}
    </div>

    <!-- before/after timeline -->
    <div style="position:absolute;top:1360px;left:90px;right:90px;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px 28px;background:rgba(255,255,255,0.04);border:1px solid ${C.ruleWarm};border-radius:18px;">
      <div style="text-align:center;flex:1;">
        <div style="font-size:13px;color:${C.text3};letter-spacing:1.5px;text-transform:uppercase;font-weight:700;">Without</div>
        <div style="margin-top:6px;font-family:'Montserrat',sans-serif;font-weight:800;font-size:42px;color:#fff;letter-spacing:-1px;line-height:1;">Hours</div>
        <div style="margin-top:4px;font-size:12px;color:${C.text2};">to resolution</div>
      </div>
      <svg width="80" height="24" viewBox="0 0 80 24">
        <line x1="0" y1="12" x2="64" y2="12" stroke="${C.orangeLight}" stroke-width="2.5"/>
        <polygon points="60,5 76,12 60,19" fill="${C.orangeLight}"/>
      </svg>
      <div style="text-align:center;flex:1;">
        <div style="font-size:13px;color:${C.orangeLight};letter-spacing:1.5px;text-transform:uppercase;font-weight:700;">With Assistant X</div>
        <div style="margin-top:6px;font-family:'Montserrat',sans-serif;font-weight:800;font-size:42px;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;letter-spacing:-1px;line-height:1;">Minutes</div>
        <div style="margin-top:4px;font-size:12px;color:${C.text2};">to resolution</div>
      </div>
    </div>

    <div style="position:absolute;left:90px;right:90px;bottom:160px;">
      ${qrStrip({ headline:'Scan · Try Assistant X', cta:'Book a demo →' })}
    </div>

    <div style="position:absolute;left:90px;right:90px;bottom:80px;">
      ${footerBand()}
    </div>
  `, { glow: 'split' });
}

// ── 9. YEEDU TURBO ENGINE — full architecture deep-dive ────────
function banner9_turboArch() {
  return banner(`
    <div style="position:absolute;top:120px;left:90px;right:90px;display:flex;align-items:center;justify-content:space-between;">
      ${logoLockup({ size: 58, tagline: 'Turbo Engine · Deep Dive' })}
      ${chipTopRight('C++ · SIMD · Columnar')}
    </div>

    <div style="position:absolute;top:340px;left:90px;right:90px;">
      <h1 style="margin:0;font-family:'Montserrat',sans-serif;font-weight:800;font-size:108px;line-height:0.92;letter-spacing:-4px;color:#fff;">
        Yeedu Turbo.
      </h1>
      <h1 style="margin:6px 0 0;font-family:'Montserrat',sans-serif;font-weight:300;font-style:italic;font-size:108px;line-height:0.92;letter-spacing:-4px;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 40px rgba(242,96,12,0.4));">
        Spark, re-engineered.
      </h1>
      <p style="margin:26px 0 0;font-family:'Inter',sans-serif;font-size:28px;line-height:1.4;color:${C.text2};max-width:900px;">
        A C++ execution layer that preserves full Apache Spark compatibility — vectorized, cache-aware, SIMD-accelerated. Same code, modern hardware, dramatically smaller bills.
      </p>
    </div>

    <!-- 4-layer architecture diagram (the proper diagram) -->
    <div style="position:absolute;top:780px;left:90px;right:90px;">
      <!-- top: your spark code -->
      <div style="padding:18px 22px;background:rgba(255,255,255,0.04);border:1px solid ${C.rule};border-radius:14px;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="font-family:'Inter',sans-serif;font-size:13px;color:${C.text3};letter-spacing:2px;font-weight:700;">YOUR SPARK CODE · UNCHANGED</div>
          <div style="display:flex;gap:8px;">
            ${['PySpark','Scala','SQL'].map(t=>`<span style="padding:5px 14px;background:rgba(255,255,255,0.06);border:1px solid ${C.rule};border-radius:6px;font-size:13px;font-weight:600;color:#fff;">${t}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- down arrow -->
      <div style="text-align:center;padding:6px 0;">
        <svg width="20" height="24"><line x1="10" y1="0" x2="10" y2="16" stroke="${C.orangeLight}" stroke-width="2"/><polygon points="4,14 16,14 10,22" fill="${C.orangeLight}"/></svg>
      </div>

      <!-- yeedu turbo engine — main block with 4 pillars -->
      <div style="padding:20px 22px;background:linear-gradient(160deg,${C.orange},#c44a08);border-radius:16px;box-shadow:0 20px 50px ${C.orangeGlow};">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:22px;color:#fff;letter-spacing:1px;">YEEDU TURBO ENGINE</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.85);letter-spacing:1.5px;font-weight:600;">C++ execution layer</div>
        </div>
        <!-- 2x2 pillar grid -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          ${[
            ['Vectorized SIMD','filters · projections · aggregations<br/>batched columnar paths'],
            ['Columnar Runtime','cache-aligned buffers<br/>predictable memory access'],
            ['CPU-Aware Caching','L2/L3-optimized<br/>hot columns + intermediate buffers'],
            ['Smart Scheduling','I/O idle-window packing<br/>2–4× cluster efficiency'],
          ].map(([t,sub])=>`
            <div style="padding:14px 16px;background:rgba(0,0,0,0.28);border:1px solid rgba(255,255,255,0.18);border-radius:10px;">
              <div style="font-family:'Inter',sans-serif;font-size:16px;font-weight:800;color:#fff;letter-spacing:-0.2px;">${t}</div>
              <div style="margin-top:4px;font-size:12px;color:rgba(255,255,255,0.82);line-height:1.4;">${sub}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- down arrow -->
      <div style="text-align:center;padding:6px 0;">
        <svg width="20" height="24"><line x1="10" y1="0" x2="10" y2="16" stroke="${C.orangeLight}" stroke-width="2"/><polygon points="4,14 16,14 10,22" fill="${C.orangeLight}"/></svg>
      </div>

      <!-- bottom: modern hardware -->
      <div style="padding:18px 22px;background:rgba(255,255,255,0.04);border:1px solid ${C.rule};border-radius:14px;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="font-family:'Inter',sans-serif;font-size:13px;color:${C.text3};letter-spacing:2px;font-weight:700;">MODERN CPU HARDWARE · IN YOUR ACCOUNT</div>
          <div style="display:flex;gap:8px;">
            ${['ARM','x86','Kubernetes'].map(t=>`<span style="padding:5px 14px;background:rgba(255,255,255,0.06);border:1px solid ${C.rule};border-radius:6px;font-size:13px;font-weight:600;color:#fff;">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- bottom 4-up stat strip -->
    <div style="position:absolute;top:1410px;left:90px;right:90px;display:flex;border-top:1px solid ${C.ruleWarm};border-bottom:1px solid ${C.ruleWarm};padding:18px 0;">
      ${[['4–10×','CPU pipelines'],['2–4×','I/O efficiency'],['60–80%','lower compute'],['0','code changes']].map(([n,l],i)=>`
        <div style="flex:1;${i>0?`border-left:1px solid ${C.rule};`:''}text-align:center;">
          <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:36px;line-height:1;letter-spacing:-1.2px;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">${n}</div>
          <div style="margin-top:6px;font-size:11px;color:${C.text2};letter-spacing:1px;text-transform:uppercase;font-weight:500;">${l}</div>
        </div>
      `).join('')}
    </div>

    <div style="position:absolute;left:90px;right:90px;bottom:160px;">
      ${qrStrip({ headline:'Scan · Benchmark Turbo Engine', cta:'30-day cost challenge →' })}
    </div>

    <div style="position:absolute;left:90px;right:90px;bottom:80px;">
      ${footerBand()}
    </div>
  `, { glow: 'top-right' });
}

// ── 10. CASE STUDY — Fortune 500 Finance (80% cost cut) ────────
function banner10_finance() {
  return banner(`
    <div style="position:absolute;top:120px;left:90px;right:90px;display:flex;align-items:center;justify-content:space-between;">
      ${logoLockup({ size: 58, tagline: 'Customer Case Study' })}
      ${chipTopRight('Fortune 500 · Finance')}
    </div>

    <div style="position:absolute;top:360px;left:90px;right:90px;">
      <h1 style="margin:0;font-family:'Montserrat',sans-serif;font-weight:800;font-size:128px;line-height:0.92;letter-spacing:-4px;color:#fff;">
        80% off
      </h1>
      <h1 style="margin:6px 0 0;font-family:'Montserrat',sans-serif;font-weight:300;font-style:italic;font-size:128px;line-height:0.92;letter-spacing:-4px;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">
        the cloud bill.
      </h1>
      <p style="margin:24px 0 0;font-family:'Inter',sans-serif;font-size:28px;line-height:1.4;color:${C.text2};max-width:900px;">
        A global Fortune 500 financial services firm. AWS · Spark streaming + cross-region replication · 1.9 TB · 7.6M+ S3 objects.
      </p>
    </div>

    <!-- Before / After cost comparison bars -->
    <div style="position:absolute;top:820px;left:90px;right:90px;padding:28px;background:rgba(255,255,255,0.04);border:1px solid ${C.ruleWarm};border-radius:20px;">
      <div style="font-size:12px;color:${C.text3};letter-spacing:2px;text-transform:uppercase;font-weight:700;margin-bottom:16px;">Streaming Pipeline · Annual Cost</div>
      <!-- Previous platform row -->
      <div style="margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">
          <span style="font-family:'Inter',sans-serif;font-size:22px;color:${C.text2};font-weight:700;">Previous platform</span>
          <span style="font-family:'Montserrat',sans-serif;font-size:28px;color:#fff;font-weight:800;">$143,523</span>
        </div>
        <div style="height:24px;background:rgba(255,255,255,0.18);border-radius:12px;width:100%;"></div>
      </div>
      <!-- Yeedu row -->
      <div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">
          <span style="font-family:'Inter',sans-serif;font-size:22px;color:${C.orangeLight};font-weight:800;">With Yeedu</span>
          <span style="font-family:'Montserrat',sans-serif;font-size:28px;color:${C.orangeLight};font-weight:800;">$28,506</span>
        </div>
        <div style="height:24px;background:rgba(255,255,255,0.10);border-radius:12px;width:100%;position:relative;">
          <div style="position:absolute;left:0;top:0;height:100%;width:20%;background:linear-gradient(90deg,${C.orange},${C.orangeLight});border-radius:12px;box-shadow:0 0 16px ${C.orangeGlow};"></div>
        </div>
      </div>
      <!-- savings callout -->
      <div style="margin-top:18px;padding:14px 18px;background:rgba(242,96,12,0.15);border:1px solid ${C.orangeGlow};border-radius:12px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-family:'Inter',sans-serif;font-size:13px;color:${C.text2};letter-spacing:1.5px;text-transform:uppercase;font-weight:700;">Saved annually</span>
        <span style="font-family:'Montserrat',sans-serif;font-size:32px;color:${C.orangeLight};font-weight:800;letter-spacing:-1px;">$115,017 · 80.1%</span>
      </div>
    </div>

    <!-- 4-up proof stats -->
    <div style="position:absolute;top:1280px;left:90px;right:90px;display:flex;border-top:1px solid ${C.ruleWarm};border-bottom:1px solid ${C.ruleWarm};padding:18px 0;">
      ${[['$143K','total saved'],['80%','cost reduction'],['2.5×','faster'],['75%','fewer nodes']].map(([n,l],i)=>`
        <div style="flex:1;${i>0?`border-left:1px solid ${C.rule};`:''}text-align:center;">
          <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:36px;line-height:1;letter-spacing:-1px;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">${n}</div>
          <div style="margin-top:6px;font-size:11px;color:${C.text2};letter-spacing:1px;text-transform:uppercase;font-weight:500;">${l}</div>
        </div>
      `).join('')}
    </div>

    <!-- customer quote -->
    <div style="position:absolute;top:1430px;left:90px;right:90px;padding:22px 28px;background:rgba(255,255,255,0.04);border-left:5px solid ${C.orange};border-radius:14px;">
      <div style="font-family:'Montserrat',sans-serif;font-weight:300;font-style:italic;font-size:22px;line-height:1.4;color:#fff;">
        "We expected cost savings, but we didn't expect to also see <span style="font-weight:800;color:${C.orangeLight};">performance improvements</span> simultaneously."
      </div>
      <div style="margin-top:10px;font-size:14px;color:${C.text2};letter-spacing:1px;text-transform:uppercase;font-weight:600;">— Fortune 500 Financial Services Firm</div>
    </div>

    <div style="position:absolute;left:90px;right:90px;bottom:160px;">
      ${qrStrip({ headline:'Scan · Read the case study', cta:'See full numbers →' })}
    </div>

    <div style="position:absolute;left:90px;right:90px;bottom:80px;">
      ${footerBand()}
    </div>
  `, { glow: 'bottom-left' });
}

// ── 11. CASE STUDY — Drug Discovery (Pharma · $2400 → $18) ─────
function banner11_pharma() {
  return banner(`
    <div style="position:absolute;top:120px;left:90px;right:90px;display:flex;align-items:center;justify-content:space-between;">
      ${logoLockup({ size: 58, tagline: 'Customer Case Study' })}
      ${chipTopRight('Pharma · Drug Discovery')}
    </div>

    <div style="position:absolute;top:340px;left:90px;right:90px;">
      <h1 style="margin:0;font-family:'Montserrat',sans-serif;font-weight:800;font-size:96px;line-height:0.94;letter-spacing:-3.5px;color:#fff;">
        Drug discovery,
      </h1>
      <h1 style="margin:6px 0 0;font-family:'Montserrat',sans-serif;font-weight:300;font-style:italic;font-size:96px;line-height:0.94;letter-spacing:-3.5px;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 30px rgba(242,96,12,0.4));">
        accelerated.
      </h1>
      <p style="margin:24px 0 0;font-family:'Inter',sans-serif;font-size:28px;line-height:1.4;color:${C.text2};max-width:900px;">
        ChEMBL database · 2.4M compounds · 5.76 trillion Tanimoto comparisons — run on Yeedu Turbo Engine.
      </p>
    </div>

    <!-- $2400 → $18 hero comparison -->
    <div style="position:absolute;top:780px;left:90px;right:90px;padding:28px;background:rgba(255,255,255,0.04);border:1px solid ${C.ruleWarm};border-radius:22px;">
      <div style="font-size:12px;color:${C.text3};letter-spacing:2px;text-transform:uppercase;font-weight:700;margin-bottom:18px;text-align:center;">Chemical similarity · 2.4M × 2.4M compound comparisons</div>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:24px;">
        <!-- traditional spark -->
        <div style="flex:1;text-align:center;">
          <div style="font-size:11px;color:${C.text3};letter-spacing:1.5px;text-transform:uppercase;font-weight:700;">Traditional Spark</div>
          <div style="margin-top:10px;font-family:'Montserrat',sans-serif;font-weight:800;font-size:60px;color:rgba(255,255,255,0.85);line-height:1;letter-spacing:-2px;">$2,400</div>
          <div style="margin-top:8px;font-size:13px;color:${C.text2};line-height:1.4;">100× r5.24xlarge<br/>4 hours</div>
        </div>
        <!-- arrow -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <svg width="80" height="40" viewBox="0 0 80 40">
            <line x1="0" y1="20" x2="64" y2="20" stroke="${C.orangeLight}" stroke-width="3"/>
            <polygon points="60,12 76,20 60,28" fill="${C.orangeLight}"/>
          </svg>
          <div style="font-family:'Montserrat',sans-serif;font-size:18px;font-weight:800;color:${C.orangeLight};letter-spacing:-0.5px;">133×</div>
        </div>
        <!-- yeedu -->
        <div style="flex:1;text-align:center;">
          <div style="font-size:11px;color:${C.orangeLight};letter-spacing:1.5px;text-transform:uppercase;font-weight:700;">Yeedu Turbo</div>
          <div style="margin-top:10px;font-family:'Montserrat',sans-serif;font-weight:800;font-size:96px;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;line-height:1;letter-spacing:-3px;filter:drop-shadow(0 0 24px rgba(242,96,12,0.4));">$18</div>
          <div style="margin-top:8px;font-size:13px;color:${C.text2};line-height:1.4;">1× C7i.48xlarge<br/>1h 45min</div>
        </div>
      </div>
    </div>

    <!-- scaling chart — quadratic vs sub-quadratic -->
    <div style="position:absolute;top:1190px;left:90px;right:90px;padding:18px 22px;background:rgba(255,255,255,0.04);border:1px solid ${C.ruleWarm};border-radius:18px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span style="font-size:12px;color:${C.text3};letter-spacing:1.5px;text-transform:uppercase;font-weight:700;">Scaling · time vs compounds</span>
        <span style="font-size:11px;color:${C.orangeLight};font-weight:600;">Yeedu scales sub-quadratically</span>
      </div>
      <svg viewBox="0 0 880 130" style="width:100%;height:130px;display:block;">
        <defs>
          <linearGradient id="qd-tr" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="rgba(255,255,255,0.25)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></linearGradient>
          <linearGradient id="qd-yd" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="rgba(242,96,12,0.45)"/><stop offset="100%" stop-color="rgba(242,96,12,0)"/></linearGradient>
        </defs>
        <!-- gridlines -->
        ${[0,1,2,3].map(i=>`<line x1="40" y1="${10+i*30}" x2="860" y2="${10+i*30}" stroke="${C.rule}"/>`).join('')}
        <!-- y axis labels -->
        <text x="32" y="14" text-anchor="end" fill="${C.text3}" font-size="9" font-family="Inter">4375h</text>
        <text x="32" y="44" text-anchor="end" fill="${C.text3}" font-size="9" font-family="Inter">28h</text>
        <text x="32" y="74" text-anchor="end" fill="${C.text3}" font-size="9" font-family="Inter">7h</text>
        <text x="32" y="104" text-anchor="end" fill="${C.text3}" font-size="9" font-family="Inter">0</text>
        <!-- x axis labels -->
        <text x="50" y="124" fill="${C.text3}" font-size="9" font-family="Inter">2M</text>
        <text x="280" y="124" fill="${C.text3}" font-size="9" font-family="Inter">4M</text>
        <text x="510" y="124" fill="${C.text3}" font-size="9" font-family="Inter">8M</text>
        <text x="850" y="124" text-anchor="end" fill="${C.text3}" font-size="9" font-family="Inter">100M compounds →</text>
        <!-- traditional quadratic curve -->
        <path d="M 50 100 Q 280 95 510 70 T 860 12 L 860 105 L 50 105 Z" fill="url(#qd-tr)"/>
        <path d="M 50 100 Q 280 95 510 70 T 860 12" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-dasharray="4 4"/>
        <text x="850" y="20" text-anchor="end" fill="${C.text2}" font-size="10" font-family="Inter" font-weight="600">Traditional · quadratic</text>
        <!-- yeedu sub-quadratic curve -->
        <path d="M 50 102 Q 280 100 510 95 T 860 80 L 860 105 L 50 105 Z" fill="url(#qd-yd)"/>
        <path d="M 50 102 Q 280 100 510 95 T 860 80" fill="none" stroke="${C.orange}" stroke-width="2.5" style="filter:drop-shadow(0 4px 10px ${C.orangeGlow});"/>
        <text x="850" y="74" text-anchor="end" fill="${C.orangeLight}" font-size="10" font-family="Inter" font-weight="700">Yeedu · sub-quadratic</text>
      </svg>
    </div>

    <!-- 4-up proof stats -->
    <div style="position:absolute;top:1430px;left:90px;right:90px;display:flex;border-top:1px solid ${C.ruleWarm};border-bottom:1px solid ${C.ruleWarm};padding:16px 0;">
      ${[['$18','total cost'],['1h 45m','run time'],['192','CPU cores'],['Sub-sec','small queries']].map(([n,l],i)=>`
        <div style="flex:1;${i>0?`border-left:1px solid ${C.rule};`:''}text-align:center;">
          <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:30px;line-height:1;letter-spacing:-1px;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">${n}</div>
          <div style="margin-top:6px;font-size:10px;color:${C.text2};letter-spacing:1px;text-transform:uppercase;font-weight:500;">${l}</div>
        </div>
      `).join('')}
    </div>

    <div style="position:absolute;left:90px;right:90px;bottom:160px;">
      ${qrStrip({ headline:'Scan · Read the full benchmark', cta:'Run yours →' })}
    </div>

    <div style="position:absolute;left:90px;right:90px;bottom:80px;">
      ${footerBand()}
    </div>
  `, { glow: 'top-right' });
}

// ── 12. SMART SCHEDULING — Job Multiplexing (CPU utilization) ─
function banner12_multiplexing() {
  // CPU core grid SVG generator. Pass active=true for orange, false for grey.
  const coreGrid = (pattern, label, util, sublabel, isYeedu) => {
    // pattern is array of 24 (6×4) booleans
    const coreSize = 36, gap = 8, cols = 6, rows = 4;
    const gridW = cols * coreSize + (cols-1) * gap;
    const gridH = rows * coreSize + (rows-1) * gap;
    const titleColor = isYeedu ? C.orangeLight : C.text3;
    const titleWeight = isYeedu ? 800 : 700;
    return `
      <div style="flex:1;padding:24px;background:rgba(255,255,255,0.04);border:1px solid ${isYeedu ? C.orangeGlow : C.rule};border-radius:18px;${isYeedu ? `box-shadow:0 0 40px ${C.orangeDim} inset;` : ''}">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
          <span style="font-size:13px;color:${titleColor};letter-spacing:2px;text-transform:uppercase;font-weight:${titleWeight};">${label}</span>
          <span style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:28px;color:${isYeedu ? '#fff' : C.text2};letter-spacing:-0.5px;">${util}</span>
        </div>
        <svg viewBox="0 0 ${gridW} ${gridH}" style="width:100%;height:auto;display:block;">
          ${pattern.map((active, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = col * (coreSize + gap);
            const y = row * (coreSize + gap);
            if (active) {
              return `<rect x="${x}" y="${y}" width="${coreSize}" height="${coreSize}" rx="5" fill="${C.orange}" style="filter:drop-shadow(0 0 6px ${C.orangeGlow});"/>
              <text x="${x+coreSize/2}" y="${y+coreSize/2+3}" text-anchor="middle" fill="#fff" font-family="Inter" font-size="9" font-weight="700">CPU</text>`;
            } else {
              return `<rect x="${x}" y="${y}" width="${coreSize}" height="${coreSize}" rx="5" fill="rgba(255,255,255,0.08)" stroke="${C.rule}"/>
              <text x="${x+coreSize/2}" y="${y+coreSize/2+3}" text-anchor="middle" fill="${C.text4}" font-family="Inter" font-size="9" font-weight="600">idle</text>`;
            }
          }).join('')}
        </svg>
        <div style="margin-top:16px;font-size:13px;color:${C.text2};line-height:1.4;text-align:center;">${sublabel}</div>
      </div>`;
  };

  // 24 cores. Traditional: ~10/24 active = 42% util. Yeedu: 24/24 = 100%.
  const tradPattern = [true,false,true,false,true,false, false,true,false,false,true,false, true,false,false,true,false,false, false,true,false,true,false,false];
  const yeeduPattern = new Array(24).fill(true);

  return banner(`
    <div style="position:absolute;top:120px;left:90px;right:90px;display:flex;align-items:center;justify-content:space-between;">
      ${logoLockup({ size: 58, tagline: 'Smart Scheduling · Job Multiplexing' })}
      ${chipTopRight('CPU Utilization')}
    </div>

    <div style="position:absolute;top:360px;left:90px;right:90px;">
      <h1 style="margin:0;font-family:'Montserrat',sans-serif;font-weight:800;font-size:108px;line-height:0.92;letter-spacing:-3.5px;color:#fff;">
        Every core,
      </h1>
      <h1 style="margin:6px 0 0;font-family:'Montserrat',sans-serif;font-weight:300;font-style:italic;font-size:108px;line-height:0.92;letter-spacing:-3.5px;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">
        working.
      </h1>
      <p style="margin:24px 0 0;font-family:'Inter',sans-serif;font-size:28px;line-height:1.4;color:${C.text2};max-width:900px;">
        Traditional Spark assigns one task per slot — when a task waits on I/O, the CPU sits idle. Yeedu's Job Multiplexer detects those windows and packs more work into them.
      </p>
    </div>

    <!-- The diagram: side-by-side cluster utilization grids -->
    <div style="position:absolute;top:780px;left:90px;right:90px;display:flex;gap:16px;">
      ${coreGrid(tradPattern, 'Traditional Spark', '~40%', 'idle cores wasted on I/O waits', false)}
      ${coreGrid(yeeduPattern, 'Yeedu Turbo', '100%', 'job multiplexing packs idle windows', true)}
    </div>

    <!-- Gantt timeline strip showing task packing difference -->
    <div style="position:absolute;top:1130px;left:90px;right:90px;padding:22px 26px;background:rgba(255,255,255,0.04);border:1px solid ${C.ruleWarm};border-radius:18px;">
      <div style="font-size:12px;color:${C.orangeLight};letter-spacing:2px;text-transform:uppercase;font-weight:700;margin-bottom:14px;">How job multiplexing works · scheduling timeline</div>
      <svg viewBox="0 0 900 180" style="width:100%;height:auto;display:block;">
        <!-- traditional row label + bars -->
        <text x="0" y="14" fill="${C.text3}" font-size="11" font-family="Inter" letter-spacing="1.5" font-weight="700">TRADITIONAL · gaps = idle CPU</text>
        ${[0,1,2].map(i=>{
          const y = 22 + i*22;
          // Tasks with gaps (idle)
          const blocks = [[0,160],[180,80],[290,140],[460,60],[540,180],[760,120]];
          return blocks.map(([x,w])=>`<rect x="${x}" y="${y}" width="${w}" height="14" rx="3" fill="rgba(255,255,255,0.30)"/>`).join('');
        }).join('')}

        <!-- yeedu row label + bars (packed) -->
        <text x="0" y="110" fill="${C.orangeLight}" font-size="11" font-family="Inter" letter-spacing="1.5" font-weight="700">YEEDU TURBO · packed = every cycle used</text>
        ${[0,1,2].map(i=>{
          const y = 118 + i*22;
          // Tasks packed tight, no gaps — alternating to show multiplexing
          const colors = [C.orange, C.orangeLight, C.orange, C.orangeLight, C.orange, C.orangeLight, C.orange];
          const blocks = [[0,140],[140,90],[230,130],[360,80],[440,160],[600,110],[710,190]];
          return blocks.map(([x,w],j)=>`<rect x="${x}" y="${y}" width="${w}" height="14" rx="3" fill="${colors[j]}" style="filter:drop-shadow(0 0 6px ${C.orangeGlow});"/>`).join('');
        }).join('')}

        <!-- time axis -->
        <text x="0" y="178" fill="${C.text3}" font-size="10" font-family="Inter">time →</text>
        <line x1="40" y1="174" x2="900" y2="174" stroke="${C.rule}"/>
      </svg>
    </div>

    <!-- 4-up proof stats -->
    <div style="position:absolute;top:1380px;left:90px;right:90px;display:flex;border-top:1px solid ${C.ruleWarm};border-bottom:1px solid ${C.ruleWarm};padding:18px 0;">
      ${[['2–4×','cluster efficiency'],['100%','core utilization'],['0','idle waits'],['No','over-provisioning']].map(([n,l],i)=>`
        <div style="flex:1;${i>0?`border-left:1px solid ${C.rule};`:''}text-align:center;">
          <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:34px;line-height:1;letter-spacing:-1px;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">${n}</div>
          <div style="margin-top:6px;font-size:11px;color:${C.text2};letter-spacing:1px;text-transform:uppercase;font-weight:500;">${l}</div>
        </div>
      `).join('')}
    </div>

    <div style="position:absolute;left:90px;right:90px;bottom:160px;">
      ${qrStrip({ headline:'Scan · Audit your cluster utilization', cta:'30-day cost challenge →' })}
    </div>

    <div style="position:absolute;left:90px;right:90px;bottom:80px;">
      ${footerBand()}
    </div>
  `, { glow: 'top-right' });
}

// ── build ──
const BANNERS = [
  { name: '1 · Brand — Spark redefined',       render: banner1_brand },
  { name: '2 · TPC-DS — $0.53/TB',             render: banner2_tpcds },
  { name: '3 · Yeedu Turbo — 10× faster',      render: banner3_turbo },
  { name: '4 · Migration — 0 rewrites',        render: banner4_migration },
  { name: '5 · Cost — 60–80% savings',         render: banner5_cost },
  { name: '6 · Trust — In your account',       render: banner6_trust },
  { name: '7 · CTA — Talk to us tonight',      render: banner7_cta },
  { name: '8 · Assistant X — AI Spark companion', render: banner8_assistantX },
  { name: '9 · Turbo Engine — Architecture deep-dive', render: banner9_turboArch },
  { name: '10 · Case Study — Fortune 500 Finance · 80% off', render: banner10_finance },
  { name: '11 · Case Study — Pharma · $2,400 → $18 drug discovery', render: banner11_pharma },
  { name: '12 · Smart Scheduling — Every core working', render: banner12_multiplexing },
];

const cRes = await fetch(`${BASE}/api/carousels`, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ name: 'Yeedu Office Banners — Story (9:16)', aspectRatio: '9:16' })});
const carousel = await cRes.json();
if (!carousel.id) { console.log('FAIL'); process.exit(1); }

for (const b of BANNERS) {
  const html = b.render();
  const r = await fetch(`${BASE}/api/carousels/${carousel.id}/slides`, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ html, notes: b.name })});
  if (r.status !== 201) console.log(' err', b.name, r.status);
  else console.log('✓', b.name);
}

// keep poster-ids fresh for next runs
const existing = fs.existsSync('/tmp/yeedu-poster-ids.json') ? JSON.parse(fs.readFileSync('/tmp/yeedu-poster-ids.json','utf8')) : [];
const non916 = existing.filter(c => c.ratio !== '9:16');
non916.push({ id: carousel.id, name: 'Yeedu Office Banners — Story (9:16)', ratio: '9:16', url: `http://localhost:3000/?carousel=${carousel.id}` });
fs.writeFileSync('/tmp/yeedu-poster-ids.json', JSON.stringify(non916, null, 2));

console.log('\n→ http://localhost:3000/?carousel=' + carousel.id);
