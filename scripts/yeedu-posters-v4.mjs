// ════════════════════════════════════════════════════════════════
// Yeedu Posters v4 — 7 marketing-grade posters with credibility evidence
// ════════════════════════════════════════════════════════════════
import QRCode from 'qrcode';
import fs from 'fs';

const BASE = 'http://localhost:3000';
const LOGO = '/uploads/7d95c235-aa75-4cb1-a3c2-e84314ceca33.png';
const QR_URL = 'https://yeedu.io';

const C = {
  orange:'#f2600c', orangeLight:'#ff8a3d', orangeSoft:'#ffae7a',
  orangeGlow:'rgba(242,96,12,0.35)', orangeDim:'rgba(242,96,12,0.16)',
  brown:'#26221d', brownDeep:'#14110d',
  text:'#ffffff', text2:'rgba(255,255,255,0.72)', text3:'rgba(255,255,255,0.42)',
  rule:'rgba(255,255,255,0.10)', ruleWarm:'rgba(242,140,90,0.18)',
};

const oldIds = fs.existsSync('/tmp/yeedu-poster-ids.json') ? JSON.parse(fs.readFileSync('/tmp/yeedu-poster-ids.json','utf8')) : [];
for (const c of oldIds) await fetch(`${BASE}/api/carousels/${c.id}`, { method:'DELETE' });

const qrSvg = await QRCode.toString(QR_URL, { type:'svg', margin:0, errorCorrectionLevel:'M', color:{dark:'#0d0b09',light:'#00000000'}});
const qrInner = qrSvg.replace(/<svg[^>]*>/, '').replace('</svg>', '');
const qrCode = size => `<svg viewBox="0 0 29 29" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${qrInner}</svg>`;

const RATIOS = {
  '1:1':  { w:1080, h:1080, label:'Square',   mode:'compact' },
  '4:5':  { w:1080, h:1350, label:'Portrait', mode:'vertical' },
  '9:16': { w:1080, h:1920, label:'Story',    mode:'tall' },
};

const ICONS = {
  cpu:'<rect x="5" y="5" width="14" height="14" rx="2" stroke="white" stroke-width="1.8" fill="none"/><rect x="9" y="9" width="6" height="6" stroke="white" stroke-width="1.8" fill="none"/><path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" stroke="white" stroke-width="1.6"/>',
  cube:'<path d="M12 2l9 5v10l-9 5-9-5V7l9-5zM3 7l9 5 9-5M12 12v10" stroke="white" stroke-width="1.8" stroke-linejoin="round" fill="none"/>',
  layers:'<path d="M12 2l10 6-10 6L2 8l10-6zM2 14l10 6 10-6M2 11l10 6 10-6" stroke="white" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
  cloud:'<path d="M7 19a5 5 0 010-10 6 6 0 0111-3 5 5 0 011 10H7z" stroke="white" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
  code:'<path d="M8 6l-6 6 6 6m8-12l6 6-6 6m-2-16l-4 20" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  dollar:'<path d="M12 1v22m6-17H9a3 3 0 100 6h6a3 3 0 110 6H6" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  globe:'<circle cx="12" cy="12" r="10" stroke="white" stroke-width="1.8" fill="none"/><path d="M2 12h20M12 2c3 3 5 6 5 10s-2 7-5 10c-3-3-5-6-5-10s2-7 5-10z" stroke="white" stroke-width="1.6" fill="none"/>',
  shield:'<path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10z" stroke="white" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
  rocket:'<path d="M5 17l2 2c2 2 4 0 5-2l8-13c-7 1-12 6-13 13l-2 5z" stroke="white" stroke-width="1.8" fill="none" stroke-linejoin="round"/><circle cx="15" cy="9" r="2" stroke="white" stroke-width="1.8" fill="none"/>',
  check:'<path d="M4 12l5 5L20 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  chart:'<path d="M4 20V8m6 12V4m6 16v-7m6 7V11" stroke="white" stroke-width="1.8" stroke-linecap="round"/>',
  lock:'<rect x="4" y="11" width="16" height="10" rx="2" stroke="white" stroke-width="1.8" fill="none"/><path d="M8 11V7a4 4 0 018 0v4" stroke="white" stroke-width="1.8" fill="none"/>',
  zap:'<path d="M13 2L4 14h7l-1 8 9-11h-7l1-8z" stroke="white" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
};
const icon = (n,s=28) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none">${ICONS[n]||ICONS.cpu}</svg>`;

function bgLayers(R) {
  return `
    <div style="position:absolute;inset:0;background:linear-gradient(165deg,${C.brown} 0%,${C.brownDeep} 55%,#0a0807 100%);pointer-events:none;"></div>
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse 65% 50% at 92% -10%, rgba(242,96,12,0.32), transparent 55%);pointer-events:none;"></div>
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse 55% 40% at 6% 105%, rgba(242,140,60,0.22), transparent 55%);pointer-events:none;"></div>
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 55%, rgba(255,138,61,0.06), transparent 60%);pointer-events:none;"></div>
    <div style="position:absolute;inset:0;background-image:radial-gradient(circle at 1px 1px,rgba(255,255,255,0.045) 1px,transparent 0);background-size:34px 34px;opacity:0.7;pointer-events:none;"></div>
    <svg style="position:absolute;top:0;right:0;width:${R.w*0.40}px;height:${R.w*0.40}px;opacity:0.14;pointer-events:none;" viewBox="0 0 380 380">
      ${[100,140,180,220,260,300,340].map(r=>`<circle cx="380" cy="0" r="${r}" fill="none" stroke="${C.orange}" stroke-width="1" stroke-dasharray="2 7"/>`).join('')}
    </svg>
    <svg style="position:absolute;bottom:0;left:0;width:${R.w*0.30}px;height:${R.w*0.30}px;opacity:0.10;pointer-events:none;" viewBox="0 0 300 300">
      ${[60,100,140,180,220,260].map(r=>`<circle cx="0" cy="300" r="${r}" fill="none" stroke="${C.orangeLight}" stroke-width="1"/>`).join('')}
    </svg>
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse 95% 95% at 50% 50%,transparent 55%,rgba(0,0,0,0.50) 100%);pointer-events:none;"></div>`;
}

// ── CHARTS ─────────────────────────────────────────────────

// 1. Cover hero — engine schematic + 4-up stat
function chartHero(w, h) {
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;">
    <defs><radialGradient id="hh-${w}-${h}" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${C.orange}" stop-opacity="1"/><stop offset="60%" stop-color="${C.orange}" stop-opacity="0.4"/><stop offset="100%" stop-color="${C.orange}" stop-opacity="0"/></radialGradient></defs>
    <text x="0" y="14" fill="${C.text3}" font-size="11" font-family="Inter" letter-spacing="1.5">YEEDU TURBO ENGINE · WHAT POWERS THE NUMBERS</text>
    ${(()=>{ const cx=w/2,cy=h/2+10,r1=Math.min(w,h)*0.34; return `
      ${[r1*0.92,r1*0.76,r1*0.6,r1*0.46].map((rr,i)=>`<circle cx="${cx}" cy="${cy}" r="${rr}" fill="none" stroke="rgba(255,255,255,${0.05+i*0.04})" stroke-width="1"/>`).join('')}
      <circle cx="${cx}" cy="${cy}" r="${r1}" fill="none" stroke="${C.orangeGlow}" stroke-width="1.5" stroke-dasharray="4 10"/>
      ${[0,30,60,90,120,150,180,210,240,270,300,330].map(deg=>{const a=deg*Math.PI/180,x=cx+r1*Math.cos(a),y=cy+r1*Math.sin(a),big=deg%90===0;return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${big?5:3}" fill="${C.orangeLight}" style="${big?`filter:drop-shadow(0 0 6px ${C.orange});`:''}"/>`;}).join('')}
      <circle cx="${cx}" cy="${cy}" r="${r1*0.42}" fill="url(#hh-${w}-${h})"/>
      <circle cx="${cx}" cy="${cy}" r="${r1*0.28}" fill="${C.orange}" style="filter:drop-shadow(0 0 28px ${C.orange});"/>
      <text x="${cx}" y="${cy-4}" text-anchor="middle" fill="#fff" font-family="Montserrat" font-weight="800" font-size="${r1*0.18}" letter-spacing="2">SPARK</text>
      <text x="${cx}" y="${cy+r1*0.16}" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="Inter" font-size="${r1*0.08}" letter-spacing="3">C++ TURBO</text>
    `; })()}
  </svg>`;
}

// 2. TPC-DS bars + methodology footer
function chartTpcDS(w, h) {
  const bars = [['1 TB', '$0.54'], ['3 TB', '$0.52'], ['10 TB', '$0.53']];
  const methH = 38;
  const peakY = 56, baseY = h - 60 - methH;
  const barW = w * 0.16;
  const totalBarsW = barW * 3 + (w * 0.7 - barW*3);
  const startX = (w - totalBarsW) / 2 + barW/2;
  const gap = (totalBarsW - barW*3) / 2;
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;">
    <defs><linearGradient id="tpc-${w}-${h}" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="${C.orangeLight}"/><stop offset="100%" stop-color="${C.orange}"/></linearGradient></defs>
    <text x="0" y="14" fill="${C.text3}" font-size="11" font-family="Inter" letter-spacing="1.5">COST-PER-TERABYTE · TPC-DS 99-QUERY SUITE</text>
    <text x="${w}" y="14" text-anchor="end" fill="${C.orangeLight}" font-size="11" font-family="Inter" font-weight="600">Graviton4 · right-sized</text>
    ${[0.25, 0.5, 0.75, 1.0].map(p => `<line x1="48" y1="${baseY - p*(baseY-peakY)}" x2="${w-20}" y2="${baseY - p*(baseY-peakY)}" stroke="${C.rule}"/><text x="40" y="${baseY - p*(baseY-peakY)+4}" text-anchor="end" fill="${C.text3}" font-size="10" font-family="Inter">$${(p*0.70).toFixed(2)}</text>`).join('')}
    ${bars.map(([label, cost], i) => {
      const x = startX + i*(barW+gap) - barW/2;
      const barH = baseY - peakY;
      return `
        <rect x="${x}" y="${peakY}" width="${barW}" height="${barH}" rx="10" fill="url(#tpc-${w}-${h})" style="filter:drop-shadow(0 12px 30px ${C.orangeGlow});"/>
        <text x="${x+barW/2}" y="${peakY-12}" text-anchor="middle" fill="#fff" font-size="${Math.min(28, barW*0.22)}" font-family="Montserrat" font-weight="800">${cost}</text>
        <text x="${x+barW/2}" y="${baseY+22}" text-anchor="middle" fill="${C.text2}" font-size="14" font-family="Inter" font-weight="600">${label}</text>
        <text x="${x+barW/2}" y="${baseY+38}" text-anchor="middle" fill="${C.text3}" font-size="11" font-family="Inter">dataset</text>
      `;
    }).join('')}
    <line x1="${startX-barW/2}" y1="${peakY+12}" x2="${startX + 2*(barW+gap) + barW/2}" y2="${peakY+12}" stroke="${C.orangeSoft}" stroke-width="2" stroke-dasharray="6 4"/>
    <text x="${w/2}" y="${peakY-32}" text-anchor="middle" fill="${C.orangeLight}" font-size="12" font-family="Inter" font-weight="700" letter-spacing="1.5">LINEAR SCALING — COST STAYS FLAT</text>
    <!-- methodology footer band -->
    <rect x="0" y="${h-methH+4}" width="${w}" height="${methH-4}" rx="6" fill="rgba(255,255,255,0.04)" stroke="${C.rule}"/>
    <text x="14" y="${h-methH+24}" fill="${C.text3}" font-size="10" font-family="Inter" letter-spacing="1.2">METHODOLOGY</text>
    <text x="120" y="${h-methH+24}" fill="${C.text2}" font-size="11" font-family="Inter">99 queries · 1TB, 3TB, 10TB · Graviton4 instances · zero failures · zero rewrites · reproducible on customer cloud</text>
  </svg>`;
}

// 3. Engine architecture stack
function chartArch(w, h) {
  const top = ['PySpark','Scala','Python','SQL','Notebooks'];
  const mid = ['SIMD Kernels','Smart Scheduler','Job Multiplexer','Adaptive Memory'];
  const bot = ['AWS','Azure','GCP','Kubernetes','On-prem'];
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;">
    <defs><linearGradient id="ae-${w}-${h}" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="${C.orange}"/><stop offset="100%" stop-color="#c44a08"/></linearGradient></defs>
    <text x="0" y="14" fill="${C.text3}" font-size="11" font-family="Inter" letter-spacing="1.5">YOUR CODE → YEEDU TURBO ENGINE → YOUR CLOUD</text>
    <!-- top: your code -->
    <rect x="0" y="32" width="${w}" height="60" rx="10" fill="rgba(255,255,255,0.025)" stroke="${C.rule}"/>
    <text x="14" y="52" fill="${C.text3}" font-size="10" font-family="Inter" letter-spacing="1.8">YOUR CODE · UNCHANGED</text>
    <g transform="translate(14, 60)">${top.map((t,i)=>{const cw=(w-28)/top.length-6;return `<rect x="${i*(cw+6)}" y="0" width="${cw}" height="24" rx="5" fill="rgba(255,255,255,0.06)" stroke="${C.rule}"/><text x="${i*(cw+6)+cw/2}" y="16" text-anchor="middle" fill="#fff" font-size="12" font-family="Inter" font-weight="500">${t}</text>`;}).join('')}</g>
    <!-- mid: yeedu turbo -->
    <rect x="0" y="${h*0.30}" width="${w}" height="${h*0.42}" rx="14" fill="url(#ae-${w}-${h})" style="filter:drop-shadow(0 14px 36px ${C.orangeGlow});"/>
    <text x="14" y="${h*0.30+22}" fill="rgba(255,255,255,0.9)" font-size="10" font-family="Inter" font-weight="700" letter-spacing="2">YEEDU TURBO · C++ · SIMD · VECTORIZED</text>
    <g transform="translate(14, ${h*0.30+34})">${mid.map((t,i)=>{const cw=(w-28)/mid.length-6;return `<rect x="${i*(cw+6)}" y="0" width="${cw}" height="${h*0.30}" rx="8" fill="rgba(0,0,0,0.22)" stroke="rgba(255,255,255,0.18)"/><text x="${i*(cw+6)+cw/2}" y="20" text-anchor="middle" fill="#fff" font-size="13" font-family="Inter" font-weight="700">${t}</text><g transform="translate(${i*(cw+6)+cw/2-30}, ${h*0.20})">${[14,11,16,12,18,14,11,15].map((bh,j)=>`<rect x="${j*8}" y="${22-bh}" width="5" height="${bh}" rx="1" fill="rgba(255,255,255,0.55)"/>`).join('')}</g>`;}).join('')}</g>
    <!-- bot: cloud -->
    <rect x="0" y="${h-78}" width="${w}" height="60" rx="10" fill="rgba(255,255,255,0.025)" stroke="${C.rule}"/>
    <text x="14" y="${h-58}" fill="${C.text3}" font-size="10" font-family="Inter" letter-spacing="1.8">RUNS IN YOUR ACCOUNT · BEHIND YOUR FIREWALL</text>
    <g transform="translate(14, ${h-50})">${bot.map((t,i)=>{const cw=(w-28)/bot.length-6;return `<rect x="${i*(cw+6)}" y="0" width="${cw}" height="28" rx="6" fill="rgba(255,255,255,0.05)" stroke="${C.rule}"/><text x="${i*(cw+6)+cw/2}" y="18" text-anchor="middle" fill="#fff" font-size="13" font-family="Inter" font-weight="600">${t}</text>`;}).join('')}</g>
  </svg>`;
}

// 4. Compatibility matrix
function chartMatrix(w, h) {
  const cols = ['Yeedu','Databricks','EMR','Dataproc'];
  const rows = [
    ['PySpark / Scala APIs', [1,1,1,1]],
    ['Apache Spark SQL',    [1,1,1,1]],
    ['Iceberg native',      [1,1,1,0]],
    ['Delta Lake native',   [1,1,0,0]],
    ['Hive Metastore',      [1,1,1,1]],
    ['Unity Catalog',       [1,1,0,0]],
    ['Glue Catalog',        [1,0,1,0]],
    ['On-prem / hybrid',    [1,0,0,0]],
  ];
  const startY = 50;
  const rowH = (h - startY - 26) / rows.length;
  const labelW = w * 0.36;
  const colW = (w - labelW) / cols.length;
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;">
    <text x="0" y="14" fill="${C.text3}" font-size="11" font-family="Inter" letter-spacing="1.5">COMPATIBILITY MATRIX · MIGRATE FROM ANY MANAGED SPARK</text>
    <!-- column headers -->
    ${cols.map((c,i)=>{const x=labelW+i*colW+colW/2;return `<text x="${x}" y="38" text-anchor="middle" fill="${i===0?C.orangeLight:C.text2}" font-size="13" font-family="Inter" font-weight="${i===0?800:600}" letter-spacing="0.3">${c}</text>`;}).join('')}
    <line x1="0" y1="${startY-6}" x2="${w}" y2="${startY-6}" stroke="${C.ruleWarm}" stroke-width="1.2"/>
    <!-- rows -->
    ${rows.map(([label,vals],i)=>{
      const y = startY + i*rowH;
      const altBg = i%2===0 ? '' : `<rect x="0" y="${y}" width="${w}" height="${rowH}" fill="rgba(255,255,255,0.025)"/>`;
      return `
        ${altBg}
        <text x="0" y="${y+rowH/2+5}" fill="#fff" font-size="13" font-family="Inter" font-weight="500">${label}</text>
        ${vals.map((v,j)=>{
          const x = labelW + j*colW + colW/2;
          const isYeedu = j === 0;
          if (v) {
            return `<g transform="translate(${x-12},${y+rowH/2-12})">
              <rect x="0" y="0" width="24" height="24" rx="6" fill="${isYeedu?C.orange:'rgba(255,255,255,0.10)'}"${isYeedu?` style="filter:drop-shadow(0 0 8px ${C.orangeGlow});"`:''}/>
              <path d="M6 12 L 10 16 L 18 7" stroke="${isYeedu?'#fff':C.orangeLight}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </g>`;
          }
          return `<text x="${x}" y="${y+rowH/2+6}" text-anchor="middle" fill="${C.text3}" font-size="18" font-family="Inter">—</text>`;
        }).join('')}
      `;
    }).join('')}
    <!-- footer note -->
    <text x="0" y="${h-6}" fill="${C.text3}" font-size="10" font-family="Inter" letter-spacing="0.8">Migration utility ingests existing jobs, notebooks, and configs as-is. PySpark · Scala · Python 3+ supported.</text>
  </svg>`;
}

// 5. Vs-market comparison table (qualitative)
function chartCompare(w, h) {
  const cols = ['Yeedu','Managed Spark A','Managed Spark B'];
  const rows = [
    ['Cost-per-TB (TPC-DS)', ['$0.53','typically 3–6×','typically 3–6×']],
    ['Pricing model',        ['Tiered monthly','Per-second usage','Per-DBU/usage']],
    ['Code rewrites needed', ['0','0','Sometimes']],
    ['Vendor lock-in',       ['None','High','High']],
    ['Multi-cloud + on-prem',['AWS · Azure · GCP · K8s · on-prem','Limited','Limited']],
    ['Compute runs in your account', ['Yes','No (SaaS)','Partial']],
    ['Open formats by default', ['Iceberg · Delta · Parquet','Vendor-preferred','Vendor-preferred']],
  ];
  const startY = 48;
  const rowH = (h - startY - 22) / rows.length;
  const labelW = w * 0.36;
  const colW = (w - labelW) / cols.length;
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;">
    <text x="0" y="14" fill="${C.text3}" font-size="11" font-family="Inter" letter-spacing="1.5">VS THE MARKET · WHERE YEEDU LANDS</text>
    ${cols.map((c,i)=>{const x=labelW+i*colW+colW/2;return `<text x="${x}" y="36" text-anchor="middle" fill="${i===0?C.orangeLight:C.text2}" font-size="13" font-family="Inter" font-weight="${i===0?800:600}">${c}</text>`;}).join('')}
    <line x1="0" y1="${startY-4}" x2="${w}" y2="${startY-4}" stroke="${C.ruleWarm}" stroke-width="1.2"/>
    ${rows.map(([label,vals],i)=>{
      const y = startY + i*rowH;
      const altBg = i%2===0 ? '' : `<rect x="0" y="${y}" width="${w}" height="${rowH}" fill="rgba(255,255,255,0.025)"/>`;
      return `
        ${altBg}
        <text x="0" y="${y+rowH/2+5}" fill="#fff" font-size="12" font-family="Inter" font-weight="500">${label}</text>
        ${vals.map((v,j)=>{const x=labelW+j*colW+colW/2;const isYeedu=j===0;return `<text x="${x}" y="${y+rowH/2+5}" text-anchor="middle" fill="${isYeedu?C.orangeLight:C.text2}" font-size="${isYeedu?13:11}" font-family="Inter" font-weight="${isYeedu?700:400}">${v}</text>`;}).join('')}
      `;
    }).join('')}
    <text x="0" y="${h-6}" fill="${C.text3}" font-size="10" font-family="Inter" letter-spacing="0.6">Comparison reflects representative managed Spark platforms. Customer mileage varies — request your custom estimate.</text>
  </svg>`;
}

// 6. Trust network architecture
function chartNetArch(w, h) {
  const cx = w/2;
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;">
    <defs><linearGradient id="na-${w}-${h}" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stop-color="${C.orange}"/><stop offset="100%" stop-color="${C.orangeLight}"/></linearGradient></defs>
    <text x="0" y="14" fill="${C.text3}" font-size="11" font-family="Inter" letter-spacing="1.5">NETWORK ARCHITECTURE · DATA NEVER LEAVES YOUR ACCOUNT</text>

    <!-- left column: Customer Account -->
    <rect x="0" y="38" width="${w*0.55}" height="${h-60}" rx="14" fill="rgba(255,255,255,0.03)" stroke="${C.rule}" stroke-width="1"/>
    <text x="14" y="60" fill="#fff" font-size="13" font-family="Montserrat" font-weight="800" letter-spacing="1">CUSTOMER CLOUD ACCOUNT</text>
    <text x="14" y="78" fill="${C.text3}" font-size="11" font-family="Inter">behind your firewall · your IAM · your VPC</text>
    <!-- inside boxes -->
    ${[
      ['Yeedu Compute', 'C++ Turbo · ephemeral workers · VPC-private', h*0.18],
      ['Your Data Lake', 'S3 · ADLS · GCS · Iceberg · Delta · Parquet', h*0.40],
      ['Your Catalog', 'Hive · Unity · Glue · Iceberg REST · custom', h*0.62],
    ].map(([t,sub,y])=>`
      <rect x="20" y="${y}" width="${w*0.55-40}" height="${h*0.16}" rx="10" fill="rgba(255,255,255,0.05)" stroke="${C.ruleWarm}"/>
      <text x="34" y="${y+24}" fill="#fff" font-size="13" font-family="Inter" font-weight="700">${t}</text>
      <text x="34" y="${y+42}" fill="${C.text2}" font-size="11" font-family="Inter">${sub}</text>
    `).join('')}

    <!-- right column: Yeedu Control Plane -->
    <rect x="${w*0.62}" y="38" width="${w*0.38}" height="${h*0.5}" rx="14" fill="url(#na-${w}-${h})" style="filter:drop-shadow(0 12px 36px ${C.orangeGlow});"/>
    <text x="${w*0.62+14}" y="60" fill="#fff" font-size="13" font-family="Montserrat" font-weight="800" letter-spacing="1">YEEDU CONTROL PLANE</text>
    <text x="${w*0.62+14}" y="78" fill="rgba(255,255,255,0.9)" font-size="11" font-family="Inter">SaaS · metadata only</text>
    ${[
      ['Job Scheduler', h*0.18],
      ['Observability', h*0.26],
      ['Cost Tracker', h*0.34],
      ['Audit Log', h*0.42],
    ].map(([t,y])=>`
      <rect x="${w*0.62+14}" y="${y}" width="${w*0.38-28}" height="${h*0.06}" rx="6" fill="rgba(0,0,0,0.22)" stroke="rgba(255,255,255,0.2)"/>
      <text x="${w*0.62+24}" y="${y+h*0.04+4}" fill="#fff" font-size="12" font-family="Inter" font-weight="600">${t}</text>
    `).join('')}

    <!-- arrows: control plane → compute (orchestrate) -->
    <line x1="${w*0.55}" y1="${h*0.25}" x2="${w*0.62}" y2="${h*0.25}" stroke="${C.orangeLight}" stroke-width="2" stroke-dasharray="4 3"/>
    <text x="${w*0.575}" y="${h*0.23}" text-anchor="middle" fill="${C.orangeLight}" font-size="9" font-family="Inter" font-weight="600">orchestrate</text>

    <!-- compliance row -->
    <rect x="${w*0.62}" y="${h*0.62}" width="${w*0.38}" height="${h-h*0.62-22}" rx="12" fill="rgba(255,255,255,0.05)" stroke="${C.ruleWarm}"/>
    <text x="${w*0.62+14}" y="${h*0.62+22}" fill="${C.orangeLight}" font-size="11" font-family="Inter" font-weight="700" letter-spacing="1.5">SECURITY POSTURE</text>
    ${[
      ['SOC 2 Type II — equivalent posture'],
      ['Built on open-source Apache Spark'],
      ['Open table formats — fully portable'],
      ['Zero data egress to Yeedu SaaS'],
    ].map((t,i)=>`
      <g transform="translate(${w*0.62+14},${h*0.62+38+i*22})">
        <rect x="0" y="-10" width="14" height="14" rx="3" fill="${C.orange}"/>
        <path d="M3 -3 L 6 0 L 11 -7" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="22" y="0" fill="#fff" font-size="11" font-family="Inter">${t}</text>
      </g>
    `).join('')}
  </svg>`;
}

// 7. CTA centerpiece — bigger QR + customer quote
function chartCTA(w, h) {
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;">
    <text x="0" y="14" fill="${C.text3}" font-size="11" font-family="Inter" letter-spacing="1.5">FROM CUSTOMERS RUNNING YEEDU IN PRODUCTION</text>
    <rect x="0" y="36" width="${w}" height="${h*0.42}" rx="14" fill="rgba(255,255,255,0.04)" stroke="${C.rule}"/>
    <text x="24" y="${h*0.18}" fill="${C.orangeLight}" font-family="Montserrat" font-weight="800" font-size="64">"</text>
    <text x="68" y="${h*0.16}" fill="#fff" font-size="16" font-family="Inter" font-weight="500">Based on what we see in production we anticipate</text>
    <text x="68" y="${h*0.22}" fill="#fff" font-size="16" font-family="Inter" font-weight="500">up to <tspan fill="${C.orangeLight}" font-weight="800">65% annual cost savings</tspan> with Yeedu.</text>
    <text x="68" y="${h*0.34}" fill="${C.text2}" font-size="13" font-family="Inter">— Director, Top-5 Pharma</text>

    <rect x="0" y="${h*0.50}" width="${w}" height="${h*0.42}" rx="14" fill="rgba(255,255,255,0.04)" stroke="${C.rule}"/>
    <text x="24" y="${h*0.66}" fill="${C.orangeLight}" font-family="Montserrat" font-weight="800" font-size="64">"</text>
    <text x="68" y="${h*0.64}" fill="#fff" font-size="16" font-family="Inter" font-weight="500">Yeedu provides a transformative solution that</text>
    <text x="68" y="${h*0.70}" fill="#fff" font-size="16" font-family="Inter" font-weight="500"><tspan fill="${C.orangeLight}" font-weight="800">drastically reduces expenses</tspan> and eliminates this critical barrier.</text>
    <text x="68" y="${h*0.82}" fill="${C.text2}" font-size="13" font-family="Inter">— Dr. Mark Ramsey · Ex-CDO, GSK &amp; Samsung Mobile</text>
  </svg>`;
}

const CHART = { hero:chartHero, tpc:chartTpcDS, arch:chartArch, matrix:chartMatrix, compare:chartCompare, netarch:chartNetArch, cta:chartCTA };

// ── reusable components ────────────────────────────────────────
function buildHeader(P, R, logoH, eyebrowSize) {
  return `<div style="display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
    <img src="${LOGO}" style="height:${logoH}px;" />
    <div style="display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:${C.orangeDim};border:1px solid ${C.ruleWarm};border-radius:999px;font-size:${eyebrowSize}px;font-weight:600;color:${C.orangeLight};letter-spacing:1.8px;text-transform:uppercase;">
      <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${C.orange};box-shadow:0 0 10px ${C.orange};"></span>${P.eyebrow}
    </div>
  </div>`;
}

function buildHeadline(P, R, size, taglineSize, taglineGap) {
  return `<div style="flex-shrink:0;">
    <h1 style="margin:0;font-family:'Montserrat',sans-serif;font-weight:800;font-size:${size}px;line-height:0.93;letter-spacing:-${size*0.03}px;">
      ${P.headline[0]}<br/>
      <span style="font-weight:300;font-style:italic;background:linear-gradient(180deg,#fff 0%,${C.orangeLight} 100%);-webkit-background-clip:text;background-clip:text;color:transparent;">${P.headline[1]}</span>
    </h1>
    <div style="margin-top:${size*0.16}px;height:3px;width:${size*1.0}px;background:linear-gradient(90deg,${C.orange},transparent);border-radius:2px;"></div>
    <p style="margin:${taglineGap}px 0 0;font-size:${taglineSize}px;line-height:1.45;color:${C.text2};max-width:${R.w*0.88}px;">${P.tagline}</p>
  </div>`;
}

function buildHeroStat(P, R, numSize, unitSize, labelSize, labelMax) {
  return `<div style="display:flex;align-items:center;gap:${R.mode==='compact'?18:26}px;padding:${R.mode==='compact'?18:22}px ${R.mode==='compact'?22:28}px;background:linear-gradient(160deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015));border:1px solid ${C.rule};border-radius:18px;flex-shrink:0;">
    <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:${numSize}px;line-height:0.85;letter-spacing:-${numSize*0.045}px;background:linear-gradient(180deg,#fff 0%,${C.orangeLight} 80%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 28px rgba(242,96,12,0.25));flex-shrink:0;">${P.bigStat.number}</div>
    <div style="border-left:1px solid ${C.ruleWarm};padding-left:${R.mode==='compact'?16:22}px;flex:1;max-width:${labelMax}px;">
      <div style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:${unitSize}px;color:${C.orangeLight};">${P.bigStat.unit}</div>
      <div style="margin-top:${R.mode==='compact'?6:10}px;font-size:${labelSize}px;color:${C.text2};line-height:1.45;">${P.bigStat.label}</div>
    </div>
  </div>`;
}

function buildProofStrip(items, R) {
  const numSize = R.mode==='compact'?22:(R.mode==='vertical'?28:34);
  const labelSize = R.mode==='compact'?9:(R.mode==='vertical'?11:13);
  const pad = R.mode==='compact'?10:14;
  return `<div style="display:flex;align-items:center;padding:${pad}px 0;border-top:1px solid ${C.rule};border-bottom:1px solid ${C.rule};flex-shrink:0;">
    ${items.map(([n,l],i)=>`<div style="flex:1;${i>0?`border-left:1px solid ${C.rule};padding-left:${R.mode==='compact'?12:18}px;`:''}">
      <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:${numSize}px;color:${C.orangeLight};line-height:1;letter-spacing:-0.5px;">${n}</div>
      <div style="margin-top:4px;font-size:${labelSize}px;color:${C.text2};letter-spacing:1px;text-transform:uppercase;">${l}</div>
    </div>`).join('')}
  </div>`;
}

function buildChartCard(P, R, chartH) {
  return `<div style="padding:${R.mode==='compact'?16:22}px;background:linear-gradient(160deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015));border:1px solid ${C.rule};border-radius:20px;flex-shrink:0;height:${chartH}px;overflow:hidden;">
    <div style="width:100%;height:100%;">${CHART[P.chart.kind](980, chartH-40, P.chart.data)}</div>
  </div>`;
}

function buildMechRow(items, R) {
  const cols = items.slice(0,3);
  const iconBoxSize = R.mode==='compact'?32:(R.mode==='vertical'?38:46);
  const titleSize = R.mode==='compact'?13:(R.mode==='vertical'?16:20);
  const bodySize = R.mode==='compact'?11:(R.mode==='vertical'?13:16);
  return `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:${R.mode==='compact'?14:22}px;padding-top:${R.mode==='compact'?14:18}px;border-top:1px solid ${C.rule};flex-shrink:0;">
    ${cols.map(([ic,t,b])=>`
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div style="width:${iconBoxSize}px;height:${iconBoxSize}px;border-radius:8px;background:rgba(242,96,12,0.15);border:1px solid ${C.ruleWarm};display:flex;align-items:center;justify-content:center;">
          ${icon(ic, iconBoxSize*0.55)}
        </div>
        <div style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:${titleSize}px;color:${C.text};letter-spacing:-0.3px;">${t}</div>
        <div style="font-size:${bodySize}px;color:${C.text2};line-height:1.45;">${b}</div>
      </div>
    `).join('')}
  </div>`;
}

function buildCTA(R, larger=false) {
  const qrSize = larger ? (R.mode==='compact' ? 110 : (R.mode==='vertical' ? 150 : 180)) : (R.mode==='compact' ? 78 : (R.mode==='vertical' ? 110 : 142));
  const padBox = R.mode==='compact'?8:(R.mode==='vertical'?12:14);
  const titleSize = R.mode==='compact'?16:(R.mode==='vertical'?22:28);
  const subSize = R.mode==='compact'?11:(R.mode==='vertical'?14:17);
  const btnPad = R.mode==='compact'?'12px 20px':(R.mode==='vertical'?'16px 26px':'22px 36px');
  const btnSize = R.mode==='compact'?13:(R.mode==='vertical'?17:21);
  return `<div style="display:flex;align-items:center;gap:${R.mode==='compact'?14:20}px;flex-shrink:0;">
    <div style="padding:${padBox}px;background:#fff;border-radius:${R.mode==='compact'?10:14}px;line-height:0;box-shadow:0 12px 36px rgba(0,0,0,0.3);">${qrCode(qrSize)}</div>
    <div style="flex:1;min-width:0;">
      <div style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:${titleSize}px;color:#fff;letter-spacing:-0.3px;">Scan to subscribe</div>
      <div style="margin-top:${R.mode==='compact'?2:6}px;font-size:${subSize}px;color:${C.text2};">yeedu.io · sales@yeedu.io</div>
    </div>
    <div style="padding:${btnPad};background:${C.orange};border-radius:999px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:${btnSize}px;color:#fff;box-shadow:0 14px 50px rgba(242,96,12,0.5);white-space:nowrap;">Get estimate →</div>
  </div>`;
}

function buildFooter(R) {
  return `<div style="display:flex;align-items:center;justify-content:space-between;font-size:${R.mode==='compact'?12:14}px;color:${C.text3};flex-shrink:0;margin-top:auto;padding-top:${R.mode==='compact'?12:16}px;">
    <span style="display:flex;align-items:center;gap:8px;">
      <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${C.orange};"></span>
      High-Performance Spark Engine
    </span>
    <span style="font-weight:500;letter-spacing:1px;">yeedu.io</span>
  </div>`;
}

// ── poster renderer ────────────────────────────────────────────
function renderPoster(P, R) {
  const pad = R.mode === 'compact' ? 50 : (R.mode === 'vertical' ? 70 : 84);
  const eyebrowSize = R.mode==='compact'?12:(R.mode==='vertical'?14:16);
  const logoH = R.mode==='compact'?30:(R.mode==='vertical'?40:50);

  const sizes = R.mode === 'compact'
    ? { headline:60, taglineSize:14, taglineGap:12, heroNum:110, heroUnit:16, heroLabel:13, chartH:200, gap:14 }
    : R.mode === 'vertical'
    ? { headline:84, taglineSize:19, taglineGap:18, heroNum:160, heroUnit:22, heroLabel:17, chartH:300, gap:18 }
    : { headline:104, taglineSize:22, taglineGap:24, heroNum:196, heroUnit:26, heroLabel:19, chartH:440, gap:24 };

  return `<div style="width:${R.w}px;height:${R.h}px;position:relative;overflow:hidden;font-family:'Inter',sans-serif;color:${C.text};-webkit-font-smoothing:antialiased;">
    ${bgLayers(R)}
    <div style="position:absolute;inset:${pad}px;display:flex;flex-direction:column;gap:${sizes.gap}px;z-index:2;">
      ${buildHeader(P, R, logoH, eyebrowSize)}
      ${buildHeadline(P, R, sizes.headline, sizes.taglineSize, sizes.taglineGap)}
      ${buildHeroStat(P, R, sizes.heroNum, sizes.heroUnit, sizes.heroLabel, R.w*0.55)}
      ${buildProofStrip(P.proofPoints, R)}
      ${buildChartCard(P, R, sizes.chartH)}
      ${buildMechRow(P.mechanisms, R)}
      ${buildCTA(R)}
      ${buildFooter(R)}
    </div>
  </div>`;
}

// ─────────────────────────────────────────────────────────────
// 7 POSTERS — marketing + credibility
// ─────────────────────────────────────────────────────────────
const POSTERS = [
  // 1. COVER / HERO
  { id:'cover', name:'Cover — Spark Redefined',
    eyebrow:'Introducing Yeedu',
    headline:['Same code.','Smaller bill.'],
    tagline:'A high-performance Spark engine, rewritten in C++ with SIMD vectorization. Runs your existing PySpark and Scala workloads — at a fraction of the cost.',
    bigStat:{ number:'4–10×', unit:'faster · 60–80% cheaper', label:'C++ Turbo Engine + Smart Scheduling + Job Multiplexing. Zero code changes. Zero vendor lock-in.' },
    chart:{ kind:'hero' },
    mechanisms:[
      ['cpu','Vectorized engine','SIMD-vectorized C++ kernels. 4–10× CPU speedup.'],
      ['layers','I/O scheduling','Task-aware placement. 2–4× I/O efficiency.'],
      ['check','Zero rewrites','Same PySpark, Scala, SQL — engine swaps in.'],
    ],
    proofPoints:[['4–10×','faster'],['60–80%','cheaper'],['$0.53','/TB · TPC-DS'],['0','rewrites']],
  },

  // 2. TPC-DS PROOF + METHODOLOGY
  { id:'tpc-ds', name:'TPC-DS Proof',
    eyebrow:'TPC-DS · Verified',
    headline:['Production-grade.','Audit-ready.'],
    tagline:'Yeedu executed the full 99-query TPC-DS suite across 1TB, 3TB, and 10TB datasets — with zero failures, zero rewrites, and the lowest cost-per-terabyte we have benchmarked.',
    bigStat:{ number:'$0.53', unit:'/ Terabyte', label:'Cost-per-terabyte processed on the complete 99-query suite. Linear scaling across all dataset sizes — predictable, repeatable, reproducible on your own cloud.' },
    chart:{ kind:'tpc' },
    mechanisms:[
      ['cpu','Vectorized execution','C++ SIMD kernels. Filter, join, aggregate at vector speed.'],
      ['layers','Linear scaling','±consistent cost-per-TB from 1TB to 10TB datasets.'],
      ['check','Reproducible','Customer runs verifiable on their own AWS account.'],
    ],
    proofPoints:[['99','TPC-DS queries'],['1–10','TB scale'],['0','failures'],['0','rewrites']],
  },

  // 3. YEEDU TURBO — engine
  { id:'turbo', name:'Yeedu Turbo Engine',
    eyebrow:'Yeedu Turbo',
    headline:['Spark,','vectorized.'],
    tagline:'A re-architected Spark engine — built in C++ with SIMD vectorization, smart scheduling, and job multiplexing. The same PySpark you write today, executed at the speed it deserves.',
    bigStat:{ number:'10×', unit:'pipeline speedup', label:'C++ Turbo Engine processes filter, join, and aggregation kernels at SIMD speed. Smart Scheduling adds 2–4× I/O. Drop-in for any existing Spark workload.' },
    chart:{ kind:'arch' },
    mechanisms:[
      ['zap','SIMD kernels','Vector ALU paths. Multiple rows per CPU cycle.'],
      ['layers','Smart scheduler','I/O-aware placement. Idle cores eliminated.'],
      ['rocket','Drop-in engine','Same PySpark, same Scala, same notebooks — no rewrite.'],
    ],
    proofPoints:[['4–10×','faster'],['2–4×','I/O boost'],['C++','engine'],['0','rewrites']],
  },

  // 4. MIGRATION + COMPATIBILITY MATRIX
  { id:'migration', name:'Migration — Compatibility',
    eyebrow:'Migration · Compatibility',
    headline:['Same code.','Every source.'],
    tagline:'PySpark, Scala, and Python jobs migrate as-is from Databricks, EMR, Dataproc, and Cloudera. Catalogs, table formats, and storage stay exactly where they are.',
    bigStat:{ number:'0', unit:'code rewrites', label:'Yeedu\'s migration utility ingests your existing jobs, notebooks, and configurations — converted to Yeedu-ready pipelines with minimal effort. Documented 60% average savings.' },
    chart:{ kind:'matrix' },
    mechanisms:[
      ['code','As-is jobs','PySpark and Scala migrate without rewrite. Python 3+ supported.'],
      ['layers','Catalog continuity','Hive, Unity, Iceberg, Delta, Glue — native, read-through.'],
      ['dollar','60% avg savings','Documented across enterprise migrations off managed Spark.'],
    ],
    proofPoints:[['0','rewrites'],['4+','source platforms'],['8','catalog/format integrations'],['60%','avg savings']],
  },

  // 5. COST + VS MARKET COMPARISON
  { id:'cost', name:'Cost — Vs Market',
    eyebrow:'Cost · Vs Market',
    headline:['Cut cloud spend.','Then cut again.'],
    tagline:'Yeedu typically reduces enterprise Spark costs by 60–80% — through C++ vectorization, smart scheduling, and job multiplexing. Documented up to 65% in production at top-5 pharma.',
    bigStat:{ number:'60–80%', unit:'cloud spend reduction', label:'Same workloads. Smaller bills. No vendor pricing tricks — no per-second usage traps, no DBU multipliers, no proprietary file formats. Open Spark. Open formats. Tiered monthly licensing from $2K.' },
    chart:{ kind:'compare' },
    mechanisms:[
      ['dollar','Predictable pricing','Tiered monthly licensing from $2K. No surprises.'],
      ['layers','Job multiplexing','Compatible tasks share compute. No idle cores.'],
      ['cpu','Right-sized compute','Vectorized engine on Graviton4 — fraction of resources.'],
    ],
    proofPoints:[['60–80%','reduction'],['65%','pharma case'],['$2K','starting'],['Days','to prove']],
  },

  // 6. TRUST — Security & Architecture
  { id:'trust', name:'Trust — In Your Account',
    eyebrow:'Security · Architecture',
    headline:['In your account.','Open from day one.'],
    tagline:'Yeedu compute runs inside your own cloud account, behind your firewall. Built on open-source Apache Spark and open table formats. Your data never leaves your perimeter.',
    bigStat:{ number:'100%', unit:'in-account compute', label:'No data egress to Yeedu SaaS. The control plane handles orchestration and observability. Your data lake and catalog stay where they are, governed by your IAM and ACLs.' },
    chart:{ kind:'netarch' },
    mechanisms:[
      ['lock','In-account compute','Yeedu workers run in your VPC. IAM-scoped. VPC-private.'],
      ['shield','SOC 2 posture','SOC 2 Type II equivalent. Built on open-source Spark.'],
      ['globe','Open formats','Iceberg, Delta, Parquet. Always portable. Always yours.'],
    ],
    proofPoints:[['100%','in-account'],['SOC 2','posture'],['Open','Spark'],['Open','formats']],
  },

  // 7. CTA — Talk to us
  { id:'cta', name:'CTA — Talk To Us',
    eyebrow:'Talk to us tonight',
    headline:['Run one workload.','See the math change.'],
    tagline:'Bring us one high-cost Spark job. We\'ll profile it, benchmark it on Yeedu, and show you the speed-and-cost delta — in days, not quarters.',
    bigStat:{ number:'65%', unit:'documented savings', label:'"Based on what we see in production we anticipate up to 65% annual cost savings with Yeedu." — Director, Top-5 Pharma. The math has been done. The proof is repeatable.' },
    chart:{ kind:'cta' },
    mechanisms:[
      ['rocket','Get an estimate','Send us a workload spec. Custom benchmark in days.'],
      ['code','Talk to engineering','We\'ll show you the C++ architecture, plan to plan.'],
      ['dollar','Pilot trial','Onboard one workload. See savings before you sign.'],
    ],
    proofPoints:[['Days','to estimate'],['Weeks','to migrate'],['65%','typical savings'],['0','lock-in']],
  },
];

const results = [];
for (const [ratioKey, R] of Object.entries(RATIOS)) {
  const carouselName = `Yeedu Banners — ${R.label} (${ratioKey})`;
  const cRes = await fetch(`${BASE}/api/carousels`, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ name: carouselName, aspectRatio: ratioKey })});
  const carousel = await cRes.json();
  if (!carousel.id) { console.log('FAIL', carouselName); continue; }
  for (const P of POSTERS) {
    const html = renderPoster(P, R);
    const r = await fetch(`${BASE}/api/carousels/${carousel.id}/slides`, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ html, notes: P.name })});
    if (r.status !== 201) console.log(' err', P.id, r.status);
  }
  results.push({ id: carousel.id, name: carouselName, ratio: ratioKey, url: `http://localhost:3000/?carousel=${carousel.id}` });
  console.log('✓', carouselName);
}
fs.writeFileSync('/tmp/yeedu-poster-ids.json', JSON.stringify(results, null, 2));
console.log('built', results.length, 'carousels · 7 posters each');
results.forEach(r => console.log(' →', r.url));
