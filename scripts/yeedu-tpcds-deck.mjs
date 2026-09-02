import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = "/home/sc2302/workarea/marketing/open-carrusel/yeedu-tpcds-deck";
fs.mkdirSync(OUT_DIR, { recursive: true });

const LOGO = fs.readFileSync(
  "/home/sc2302/workarea/marketing/open-carrusel/public/uploads/7d95c235-aa75-4cb1-a3c2-e84314ceca33.png"
);
const LOGO_DATA_URI = `data:image/png;base64,${LOGO.toString("base64")}`;

// ---------- Validated palette (dataviz skill: node scripts/validate_palette.js) ----------
const C = {
  bg: "#1c1712",
  bgDeep: "#100d0a",
  orange: "#f2600c", // Yeedu primary — used for: Yeedu/Turbo metric, hero accents
  orangeLight: "#ff9a52",
  blue: "#3987e5", // validated dark-mode tint of Yeedu accent #0050bd — used for: comparison/secondary metric
  blueDeep: "#1c5cab",
  white: "#ffffff",
  ink2: "#c3c2b7", // secondary ink
  muted: "#898781", // axis / muted labels
  grid: "#332d27", // gridline on our surface (warmer than skill default, matches bg hue)
  baseline: "#4a423a",
  good: "#3ecf5e", // status green, sparingly, checkmarks only
  cardBg: "rgba(255,255,255,0.04)",
  cardBorder: "rgba(255,255,255,0.09)",
};

const FONT = `font-family:'Inter',-apple-system,sans-serif;`;
const HEAD = `font-family:'Montserrat',sans-serif;`;

// ================= ICON LIBRARY =================
// consistent 48x48 viewBox, stroke-based, currentColor
function iconWrap(inner, { color = C.white, size = 48 } = {}) {
  return `<svg viewBox="0 0 48 48" width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}
const Icon = {
  check: (o) => iconWrap(`<circle cx="24" cy="24" r="19"/><path d="M15 24l6 6 12-13"/>`, o),
  dollar: (o) => iconWrap(`<circle cx="24" cy="24" r="19"/><path d="M24 12v24M29 17c0-3-3-4-5.5-4-3 0-5.5 1.6-5.5 4.4 0 5.6 11 2.6 11 8.4 0 3-3 4.6-5.5 4.6-3 0-6-1.4-6-4.6"/>`, o),
  gauge: (o) => iconWrap(`<path d="M8 30a16 16 0 0132 0"/><path d="M24 30l7-9"/><circle cx="24" cy="30" r="2.2" fill="${o?.color || C.white}"/>`, o),
  code: (o) => iconWrap(`<path d="M17 15L8 24l9 9M31 15l9 9-9 9"/>`, o),
  cpu: (o) => iconWrap(`<rect x="14" y="14" width="20" height="20" rx="3"/><rect x="20" y="20" width="8" height="8" rx="1"/><path d="M20 8v6M28 8v6M20 34v6M28 34v6M8 20h6M8 28h6M34 20h6M34 28h6"/>`, o),
  spark: (o) => iconWrap(`<path d="M24 8l3.5 11.5L39 23l-11.5 3.5L24 38l-3.5-11.5L9 23l11.5-3.5z"/>`, o),
  medal: (o) => iconWrap(`<circle cx="24" cy="20" r="11"/><path d="M18 30l-5 10 6-2 5 5 4-9M30 30l5 10-6-2-5 5-4-9"/><path d="M20 20l3 3 6-6"/>`, o),
  magnifier: (o) => iconWrap(`<circle cx="21" cy="21" r="12"/><path d="M30 30l9 9"/>`, o),
  tree: (o) => iconWrap(`<circle cx="24" cy="10" r="4"/><circle cx="12" cy="34" r="4"/><circle cx="36" cy="34" r="4"/><path d="M24 14v8M24 22l-12 8M24 22l12 8"/>`, o),
  doc: (o) => iconWrap(`<path d="M14 8h13l7 7v25H14z"/><path d="M27 8v7h7M18 24h12M18 30h12"/>`, o),
  split: (o) => iconWrap(`<path d="M10 24h9M29 24h9M19 24l-5-8M19 24l-5 8M29 24l5-8M29 24l5 8"/><circle cx="24" cy="24" r="3" fill="${o?.color || C.white}"/>`, o),
  cores: (o) => iconWrap(`<rect x="8" y="8" width="13" height="13" rx="2"/><rect x="27" y="8" width="13" height="13" rx="2"/><rect x="8" y="27" width="13" height="13" rx="2"/><rect x="27" y="27" width="13" height="13" rx="2"/>`, o),
  server: (o) => iconWrap(`<rect x="12" y="8" width="24" height="10" rx="2"/><rect x="12" y="22" width="24" height="10" rx="2"/><circle cx="17" cy="13" r="1.4" fill="${o?.color || C.white}"/><circle cx="17" cy="27" r="1.4" fill="${o?.color || C.white}"/><path d="M12 36h24"/>`, o),
  serverSmall: (o) => iconWrap(`<rect x="14" y="16" width="20" height="9" rx="1.5"/><circle cx="18" cy="20.5" r="1.1" fill="${o?.color || C.white}"/>`, o),
  upload: (o) => iconWrap(`<path d="M24 32V12M16 20l8-8 8 8"/><path d="M10 36h28"/>`, o),
  play: (o) => iconWrap(`<circle cx="24" cy="24" r="17"/><path d="M20 16l14 8-14 8z"/>`, o),
  chartUp: (o) => iconWrap(`<path d="M8 34h32"/><path d="M12 30V20M20 30v-9M28 30V16M36 30v-6"/><path d="M28 10l8-2 2 8"/>`, o),
  arrowRight: (o) => iconWrap(`<path d="M8 24h30M28 14l10 10-10 10"/>`, o),
};

function eyebrow(text) {
  return `<div style="display:inline-flex;align-items:center;gap:10px;padding:9px 20px;background:rgba(242,96,12,0.16);border:1px solid rgba(242,96,12,0.3);border-radius:999px;font-size:16px;font-weight:700;color:${C.orangeLight};letter-spacing:2px;text-transform:uppercase;${FONT}">
    <span style="width:6px;height:6px;border-radius:50%;background:${C.orange};box-shadow:0 0 8px ${C.orange};"></span>${text}
  </div>`;
}

function logoBlock() {
  return `<div style="position:absolute;top:56px;left:96px;display:flex;align-items:center;gap:12px;z-index:5;">
    <img src="${LOGO_DATA_URI}" style="height:30px;" />
  </div>`;
}
function footer(pageNum) {
  return `<div style="position:absolute;left:96px;right:96px;bottom:44px;display:flex;justify-content:space-between;align-items:center;font-size:15px;color:${C.muted};${FONT}z-index:5;">
    <span>Yeedu™ &middot; TPC-DS Benchmark</span>
    <span style="display:flex;gap:28px;align-items:center;"><span>yeedu.io</span><span style="opacity:0.6;">0${pageNum}/08</span></span>
  </div>`;
}

// bg texture shared across all pages
function bgLayers() {
  return `
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse 45% 60% at 100% 0%,rgba(242,96,12,0.14),transparent 60%);"></div>
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse 40% 50% at 0% 100%,rgba(57,135,229,0.10),transparent 60%);"></div>
  <div style="position:absolute;inset:0;background-image:radial-gradient(circle at 1px 1px, rgba(255,255,255,0.035) 1px, transparent 0);background-size:28px 28px;"></div>
  `;
}

function page(n, inner) {
  return `<section style="width:1920px;height:1080px;position:relative;overflow:hidden;background:linear-gradient(160deg, ${C.bg} 0%, ${C.bgDeep} 100%);color:${C.white};${FONT}-webkit-font-smoothing:antialiased;page-break-after:always;">
    ${bgLayers()}
    ${logoBlock()}
    <div style="position:relative;z-index:2;width:100%;height:100%;">${inner}</div>
    ${footer(n)}
  </section>`;
}

// ---------- Chart builders ----------
function barChart({ title, unit, color, bars, w = 640, h = 380 }) {
  const max = Math.max(...bars.map((b) => b.v));
  const padL = 10, padR = 10, padB = 50, padT = 30;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const bw = plotW / bars.length / 2.1;
  const gap = plotW / bars.length;
  const bars_svg = bars
    .map((b, i) => {
      const bh = (b.v / max) * plotH;
      const x = padL + i * gap + gap / 2 - bw / 2;
      const y = padT + plotH - bh;
      return `
      <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="6" fill="${color}" style="filter:drop-shadow(0 6px 18px ${color}55);"/>
      <text x="${x + bw / 2}" y="${y - 14}" text-anchor="middle" fill="${C.white}" font-size="24" font-weight="800" style="${HEAD}">${b.label}</text>
      <text x="${x + bw / 2}" y="${padT + plotH + 30}" text-anchor="middle" fill="${C.muted}" font-size="15" style="${FONT}">${b.sub}</text>`;
    })
    .join("");
  return `<div style="width:${w}px;">
    <div style="font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted};margin-bottom:10px;${FONT}">${title}</div>
    <svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
      <line x1="${padL}" y1="${padT + plotH}" x2="${w - padR}" y2="${padT + plotH}" stroke="${C.baseline}" stroke-width="1.5"/>
      ${bars_svg}
    </svg>
  </div>`;
}

function ring({ pct = 100, label, sub, size = 220, color = C.orange }) {
  const r = size / 2 - 14;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${C.grid}" stroke-width="14"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="14" stroke-linecap="round"
      stroke-dasharray="${c}" stroke-dashoffset="${off}" transform="rotate(-90 ${size / 2} ${size / 2})" style="filter:drop-shadow(0 0 14px ${color}88);"/>
    <text x="50%" y="47%" text-anchor="middle" fill="${C.white}" font-size="40" font-weight="800" style="${HEAD}">${label}</text>
    <text x="50%" y="62%" text-anchor="middle" fill="${C.muted}" font-size="15" style="${FONT}">${sub}</text>
  </svg>`;
}

function pipelineFlow(steps) {
  const n = steps.length;
  const w = 1728, nodeR = 54, y = 70;
  const gap = w / n;
  let svg = `<svg viewBox="0 0 ${w} 170" width="${w}" height="170">`;
  for (let i = 0; i < n - 1; i++) {
    const x1 = gap * i + gap / 2 + nodeR + 6;
    const x2 = gap * (i + 1) + gap / 2 - nodeR - 6;
    svg += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${C.orange}" stroke-width="2.5" stroke-dasharray="2 8" opacity="0.6"/>
      <polygon points="${x2},${y - 6} ${x2 + 10},${y} ${x2},${y + 6}" fill="${C.orange}" opacity="0.8"/>`;
  }
  steps.forEach((s, i) => {
    const cx = gap * i + gap / 2;
    svg += `<circle cx="${cx}" cy="${y}" r="${nodeR}" fill="${C.bgDeep}" stroke="${C.orange}" stroke-width="2.5" style="filter:drop-shadow(0 0 16px rgba(242,96,12,0.35));"/>
      <g transform="translate(${cx - 15},${y - 15})">${Icon[s.icon]({ color: C.orangeLight, size: 30 })}</g>
      <text x="${cx}" y="${y + nodeR + 26}" text-anchor="middle" fill="${C.muted}" font-size="15" font-weight="700" style="${HEAD}">0${i + 1}</text>`;
  });
  svg += `</svg>`;
  const labels = `<div style="display:flex;width:${w}px;margin-top:6px;">
    ${steps
      .map(
        (s) => `<div style="flex:1;padding:0 14px;text-align:center;">
        <div style="font-size:19px;font-weight:700;${HEAD}">${s.title}</div>
        <div style="margin-top:6px;font-size:13.5px;color:${C.ink2};line-height:1.45;">${s.body}</div>
      </div>`
      )
      .join("")}
  </div>`;
  return `<div>${svg}${labels}</div>`;
}

function statTile(iconName, value, label, color = C.orange) {
  return `<div style="display:flex;align-items:center;gap:16px;">
    <div style="width:56px;height:56px;border-radius:14px;background:${color}22;border:1px solid ${color}55;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
      ${Icon[iconName]({ color, size: 28 })}
    </div>
    <div>
      <div style="font-size:28px;font-weight:800;${HEAD}line-height:1;">${value}</div>
      <div style="margin-top:4px;font-size:13px;color:${C.muted};letter-spacing:0.5px;">${label}</div>
    </div>
  </div>`;
}

function card(inner, extra = "") {
  return `<div style="padding:26px 28px;background:${C.cardBg};border:1px solid ${C.cardBorder};border-radius:18px;backdrop-filter:blur(6px);${extra}">${inner}</div>`;
}

// medal / award graphic (used slides 1 & 2)
function medalGraphic({ size = 380 } = {}) {
  return `<svg viewBox="0 0 400 400" width="${size}" height="${size}">
    <circle cx="200" cy="200" r="185" fill="none" stroke="${C.orange}" stroke-width="1" stroke-dasharray="2 8" opacity="0.35"/>
    <circle cx="200" cy="200" r="150" fill="none" stroke="${C.blue}" stroke-width="1" stroke-dasharray="2 8" opacity="0.3"/>
    <circle cx="200" cy="150" r="90" fill="url(#medalGrad)" stroke="${C.orangeLight}" stroke-width="3"/>
    <path d="M140 210 L100 320 L160 300 L195 360 L235 250" fill="${C.blueDeep}" opacity="0.85"/>
    <path d="M260 210 L300 320 L240 300 L205 360 L165 250" fill="${C.orange}" opacity="0.9"/>
    <path d="M170 150 l20 20 45 -45" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="200" y="150" text-anchor="middle" dy="72" fill="#fff" font-size="17" font-weight="800" style="${HEAD}" letter-spacing="1.5">TPC-DS</text>
    <defs>
      <radialGradient id="medalGrad" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stop-color="${C.orangeLight}"/>
        <stop offset="100%" stop-color="${C.orange}"/>
      </radialGradient>
    </defs>
  </svg>`;
}

function tag(text) {
  return `<span style="padding:9px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:999px;font-size:14px;color:${C.ink2};">${text}</span>`;
}

// ================= SLIDES =================

// ---- 1: Cover / Hook ----
const s1 = page(1, `
  <div style="position:absolute;top:230px;left:96px;width:880px;">
    ${eyebrow("The Benchmark")}
    <h1 style="margin:26px 0 0;font-size:78px;line-height:1.02;letter-spacing:-2.5px;${HEAD}font-weight:800;">
      The Fastest.<br/>The Cheapest.<br/>
      <span style="font-weight:300;font-style:italic;background:linear-gradient(120deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">Spark, Reengineered.</span>
    </h1>
    <p style="margin-top:26px;font-size:21px;color:${C.ink2};line-height:1.5;max-width:640px;">Verified on TPC-DS, the industry-standard benchmark for enterprise analytics workloads.</p>
  </div>
  <div style="position:absolute;top:190px;right:150px;">
    ${medalGraphic({ size: 400 })}
  </div>
  <div style="position:absolute;left:96px;right:96px;bottom:150px;display:flex;gap:64px;padding-top:32px;border-top:1px solid rgba(255,255,255,0.1);">
    ${statTile("check", "99/99", "QUERIES PASSED", C.orange)}
    ${statTile("dollar", "$0.52", "PER TB", C.blue)}
    ${statTile("gauge", "4–10×", "FASTER EXECUTION", C.orange)}
    ${statTile("code", "0", "CODE REWRITES", C.blue)}
  </div>
`);

// ---- 2: The Test ----
const s2 = page(2, `
  <div style="position:absolute;top:190px;left:96px;width:760px;">
    ${eyebrow("The Test")}
    <h1 style="margin:24px 0 0;font-size:56px;line-height:1.12;letter-spacing:-1.5px;${HEAD}font-weight:800;">
      TPC-DS is the <span style="font-style:italic;font-weight:300;color:${C.orangeLight};">Academy Awards</span> of data platforms.
    </h1>
    <p style="margin-top:26px;font-size:19px;color:${C.ink2};line-height:1.55;max-width:620px;">An independent body. A fixed, brutal set of criteria. No vendor grades its own homework.</p>
    <p style="margin-top:16px;font-size:17px;color:${C.muted};line-height:1.55;max-width:600px;">99 complex SQL queries across 24 tables — the exact patterns behind real enterprise dashboards, ML pipelines, and financial reporting.</p>
    <div style="margin-top:34px;display:flex;flex-wrap:wrap;gap:12px;max-width:600px;">
      ${["Correlated subqueries", "Multi-pass window functions", "Multi-channel rollups", "Full scale — not a sample"].map(tag).join("")}
    </div>
  </div>
  <div style="position:absolute;top:150px;right:180px;">
    ${medalGraphic({ size: 460 })}
  </div>
`);

// ---- 3: The Result ----
const resultItems = [
  { icon: "check", title: "99 out of 99", body: "Every query completed — correlated subqueries, multi-pass windows, 3-channel rollups. No rewrites. No retries.", color: C.orange },
  { icon: "dollar", title: "Sub-dollar at TB scale", body: "The full suite against 1TB for $0.52. This is what production looks like when the engine is built right.", color: C.blue },
  { icon: "cpu", title: "Pure engine performance", body: "Same data. Same queries. Standard cloud hardware anyone can rent. The only variable is the engine.", color: C.orange },
  { icon: "spark", title: "Compute headroom for AI", body: "When ML, feature stores, and real-time analytics compete for budget, efficiency decides who ships.", color: C.blue },
];
const s3 = page(3, `
  <div style="position:absolute;top:130px;left:96px;">
    ${eyebrow("The Result")}
    <h1 style="margin:22px 0 0;font-size:58px;letter-spacing:-1.5px;${HEAD}font-weight:800;">99 Queries. 99 Passes. <span style="font-style:italic;font-weight:300;color:${C.orangeLight};">Zero shortcuts.</span></h1>
  </div>
  <div style="position:absolute;top:300px;left:96px;">
    ${ring({ pct: 100, label: "99/99", sub: "QUERIES PASSED", size: 260 })}
  </div>
  <div style="position:absolute;top:300px;left:470px;right:96px;display:grid;grid-template-columns:1fr 1fr;gap:22px;">
    ${resultItems
      .map(
        (r) => card(`
        <div style="display:flex;gap:18px;align-items:flex-start;">
          <div style="width:46px;height:46px;border-radius:12px;background:${r.color}22;border:1px solid ${r.color}55;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${Icon[r.icon]({ color: r.color, size: 24 })}</div>
          <div>
            <div style="font-size:19px;font-weight:700;${HEAD}margin-bottom:6px;">${r.title}</div>
            <div style="font-size:14.5px;color:${C.ink2};line-height:1.5;">${r.body}</div>
          </div>
        </div>`)
      )
      .join("")}
  </div>
`);

// ---- 4: Performance at scale ----
const s4 = page(4, `
  <div style="position:absolute;top:120px;left:96px;">
    ${eyebrow("Performance At Scale")}
    <h1 style="margin:22px 0 0;font-size:54px;letter-spacing:-1.5px;${HEAD}font-weight:800;">Insights in minutes — <span style="font-style:italic;font-weight:300;color:${C.orangeLight};">not hours.</span></h1>
    <p style="margin-top:14px;font-size:18px;color:${C.ink2};max-width:760px;">Dashboards, ML, and decisions move at the speed of the business — not the cluster.</p>
  </div>
  <div style="position:absolute;top:330px;left:96px;display:flex;gap:56px;">
    ${card(barChart({ title: "Cost per Benchmark (USD)", color: C.orange, bars: [
      { label: "$0.52", sub: "1 TB", v: 0.52 },
      { label: "$2.33", sub: "3 TB", v: 2.33 },
      { label: "$12.57", sub: "10 TB", v: 12.57 },
    ] }))}
    ${card(barChart({ title: "Time to Complete (99 queries)", color: C.blue, bars: [
      { label: "17m", sub: "1 TB", v: 17 },
      { label: "40m", sub: "3 TB", v: 40 },
      { label: "190m", sub: "10 TB (3.16h)", v: 190 },
    ] }))}
  </div>
  <div style="position:absolute;left:96px;right:96px;bottom:150px;text-align:center;font-size:18px;color:${C.muted};">Linear scaling. Predictable cost. Full 99-query suite at every scale.</div>
`);

// ---- 5: One machine, no cluster ----
function clusterVsSingle() {
  const smallServers = Array.from({ length: 6 })
    .map((_, i) => {
      const x = (i % 3) * 90 + 20;
      const y = Math.floor(i / 3) * 70 + 10;
      return `<g transform="translate(${x},${y})" opacity="0.85">${Icon.serverSmall({ color: C.muted, size: 60 })}</g>`;
    })
    .join("");
  return `<div style="display:flex;align-items:center;gap:36px;">
    <div style="text-align:center;">
      <div style="font-size:13px;letter-spacing:1.5px;color:${C.muted};margin-bottom:14px;text-transform:uppercase;">Traditional Spark</div>
      <svg viewBox="0 0 300 160" width="300" height="160">
        <rect x="4" y="4" width="292" height="152" rx="16" fill="none" stroke="${C.baseline}" stroke-dasharray="4 6"/>
        ${smallServers}
        <line x1="65" y1="35" x2="155" y2="35" stroke="${C.baseline}" stroke-width="1.5"/>
        <line x1="65" y1="105" x2="155" y2="105" stroke="${C.baseline}" stroke-width="1.5"/>
        <line x1="155" y1="35" x2="245" y2="35" stroke="${C.baseline}" stroke-width="1.5"/>
        <line x1="65" y1="35" x2="65" y2="105" stroke="${C.baseline}" stroke-width="1.5"/>
        <line x1="155" y1="35" x2="155" y2="105" stroke="${C.baseline}" stroke-width="1.5"/>
      </svg>
      <div style="margin-top:8px;font-size:14px;color:${C.muted};">Distributed cluster · network shuffle</div>
    </div>
    <div>${Icon.arrowRight({ color: C.orange, size: 44 })}</div>
    <div style="text-align:center;">
      <div style="font-size:13px;letter-spacing:1.5px;color:${C.orangeLight};margin-bottom:14px;text-transform:uppercase;">Yeedu Turbo</div>
      <svg viewBox="0 0 300 160" width="300" height="160">
        <rect x="4" y="4" width="292" height="152" rx="16" fill="none" stroke="rgba(242,96,12,0.4)"/>
        <g transform="translate(90,40)" style="filter:drop-shadow(0 0 18px rgba(242,96,12,0.55));">${Icon.server({ color: C.orangeLight, size: 120 })}</g>
      </svg>
      <div style="margin-top:8px;font-size:14px;color:${C.ink2};">Single machine · zero network shuffle</div>
    </div>
  </div>`;
}
function specCard(tb, machine, vcpu, mem, storage, net) {
  return card(`
    <div style="font-size:13px;color:${C.muted};letter-spacing:1.5px;text-transform:uppercase;">${tb}</div>
    <div style="margin-top:8px;font-size:20px;font-weight:800;${HEAD}color:${C.orangeLight};">${machine}</div>
    <div style="margin-top:16px;display:flex;flex-direction:column;gap:9px;font-size:14.5px;color:${C.ink2};">
      <div style="display:flex;justify-content:space-between;"><span style="color:${C.muted};">vCPU</span><span>${vcpu}</span></div>
      <div style="display:flex;justify-content:space-between;"><span style="color:${C.muted};">Memory</span><span>${mem}</span></div>
      <div style="display:flex;justify-content:space-between;"><span style="color:${C.muted};">Storage</span><span>${storage}</span></div>
      <div style="display:flex;justify-content:space-between;"><span style="color:${C.muted};">Network</span><span>${net}</span></div>
    </div>
  `, "flex:1;");
}
const s5 = page(5, `
  <div style="position:absolute;top:110px;left:96px;">
    ${eyebrow("One Machine. No Cluster.")}
    <h1 style="margin:20px 0 0;font-size:52px;letter-spacing:-1.5px;${HEAD}font-weight:800;">The entire benchmark. <span style="font-style:italic;font-weight:300;color:${C.orangeLight};">One machine.</span></h1>
    <p style="margin-top:12px;font-size:17px;color:${C.ink2};max-width:820px;">Modern cloud hardware is finally ready for big data at scale — standard instances, no custom silicon.</p>
  </div>
  <div style="position:absolute;top:300px;left:96px;">${clusterVsSingle()}</div>
  <div style="position:absolute;top:300px;left:780px;right:96px;display:flex;gap:20px;">
    ${specCard("1 TB", "m8gd.8xlarge", "32", "128 GiB", "1× 1,900GB NVMe", "15 Gbps")}
    ${specCard("3 TB", "r8gd.12xlarge", "48", "384 GiB", "3× 950GB NVMe", "22.5 Gbps")}
    ${specCard("10 TB", "i8g.12xlarge", "64", "512 GiB", "4× 3,750GB NVMe", "Up to 37.5 Gbps")}
  </div>
`);

// ---- 6: How Turbo Wins ----
const pipelineSteps = [
  { icon: "doc", title: "Parse", body: "Spark SQL comes in completely unchanged." },
  { icon: "tree", title: "Extract", body: "Turbo extracts the logical plan — same as Spark's Catalyst would build." },
  { icon: "magnifier", title: "Understand", body: "Analyzes schema, size, distribution before executing." },
  { icon: "split", title: "Split & Compile", body: "Split across CPU cores, compiled to Turbo-native SQL." },
  { icon: "cores", title: "Execute", body: "Runs across every core of one machine — no network shuffle." },
];
const s6 = page(6, `
  <div style="position:absolute;top:100px;left:96px;">
    ${eyebrow("How Turbo Wins")}
    <h1 style="margin:20px 0 0;font-size:50px;letter-spacing:-1.5px;${HEAD}font-weight:800;">Same Spark SQL in. <span style="font-style:italic;font-weight:300;color:${C.orangeLight};">A different engine underneath.</span></h1>
  </div>
  <div style="position:absolute;top:310px;left:96px;right:96px;">
    ${pipelineFlow(pipelineSteps)}
  </div>
  <div style="position:absolute;top:660px;left:96px;right:96px;display:flex;justify-content:center;gap:14px;">
    ${["SIMD vector execution", "Columnar batch processing", "Off-heap memory · no GC pauses"].map(tag).join("")}
  </div>
  <div style="position:absolute;left:96px;right:96px;bottom:180px;text-align:center;">
    <p style="font-size:19px;font-style:italic;color:${C.ink2};margin:0;">"Same logical plan Spark already built. Compiled to metal, not garbage-collected. Nothing to rewrite. Nothing to re-validate."</p>
  </div>
`);

// ---- 7: Reinvestment ----
function budgetFlow() {
  return `<svg viewBox="0 0 900 260" width="900" height="260">
    <text x="120" y="30" text-anchor="middle" fill="${C.muted}" font-size="13" letter-spacing="1.5">INFRASTRUCTURE SPEND</text>
    <rect x="40" y="50" width="160" height="150" rx="10" fill="${C.orange}22" stroke="${C.orange}" stroke-width="2"/>
    <rect x="40" y="140" width="160" height="60" rx="10" fill="${C.orange}" opacity="0.9"/>
    <text x="120" y="230" text-anchor="middle" fill="${C.ink2}" font-size="14">shrinks ↓</text>

    <g transform="translate(330,90)">${Icon.arrowRight({ color: C.blue, size: 70 })}</g>

    <text x="740" y="30" text-anchor="middle" fill="${C.muted}" font-size="13" letter-spacing="1.5">ANALYTICS &amp; ML BUDGET</text>
    <rect x="660" y="50" width="160" height="150" rx="10" fill="${C.blue}22" stroke="${C.blue}" stroke-width="2"/>
    <rect x="660" y="70" width="160" height="130" rx="10" fill="${C.blue}" opacity="0.9"/>
    <text x="740" y="230" text-anchor="middle" fill="${C.ink2}" font-size="14">grows ↑</text>
  </svg>`;
}
const s7 = page(7, `
  <div style="position:absolute;top:150px;left:96px;width:900px;">
    ${eyebrow("The Payoff")}
    <h1 style="margin:26px 0 0;font-size:58px;line-height:1.15;letter-spacing:-1.5px;${HEAD}font-weight:800;">Every dollar saved on big data is a dollar <span style="font-style:italic;font-weight:300;background:linear-gradient(120deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;">reinvested in analytics and ML.</span></h1>
    <p style="margin-top:24px;font-size:19px;color:${C.ink2};line-height:1.5;max-width:760px;">Lower infrastructure spend doesn't just cut costs — it funds the use cases that were previously too expensive to justify.</p>
  </div>
  <div style="position:absolute;top:640px;left:96px;">${budgetFlow()}</div>
`);

// ---- 8: CTA ----
const ctaSteps = [
  { icon: "upload", title: "Send your workload", body: "We profile it on our side." },
  { icon: "play", title: "Run the benchmark", body: "Apples-to-apples comparison." },
  { icon: "chartUp", title: "See your savings", body: "Concrete $ + speed delta." },
];
const s8 = page(8, `
  <div style="position:absolute;top:130px;left:96px;">
    ${eyebrow("Get Started")}
    <h1 style="margin:22px 0 0;font-size:64px;letter-spacing:-2px;${HEAD}font-weight:800;">Bring your workload. <span style="font-style:italic;font-weight:300;color:${C.orangeLight};">We'll show you the gap.</span></h1>
  </div>
  <div style="position:absolute;top:360px;left:96px;right:96px;">${pipelineFlow(ctaSteps)}</div>
  <div style="position:absolute;left:96px;right:96px;bottom:180px;display:flex;gap:20px;align-items:center;">
    <span style="padding:20px 36px;background:${C.orange};border-radius:999px;font-weight:700;font-size:20px;color:#fff;display:inline-flex;align-items:center;gap:10px;box-shadow:0 16px 50px rgba(242,96,12,0.45);${HEAD}">Get your estimate →</span>
    <span style="padding:20px 36px;border:1.5px solid rgba(255,255,255,0.15);border-radius:999px;font-size:18px;color:${C.ink2};background:rgba(255,255,255,0.03);">sales@yeedu.io</span>
  </div>
`);

const allSlides = [s1, s2, s3, s4, s5, s6, s7, s8];

const fullHtml = `<!doctype html>
<html><head><meta charset="utf-8">
<style>
  @page { margin: 0; size: 1920px 1080px; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1920px; }
  @font-face { font-family:'Montserrat'; src: local('Montserrat'); }
</style>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head><body>${allSlides.join("\n")}</body></html>`;

fs.writeFileSync(path.join(OUT_DIR, "deck.html"), fullHtml);

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page_ = await browser.newPage();
await page_.setViewport({ width: 1920, height: 1080 });
await page_.goto(`file://${path.join(OUT_DIR, "deck.html")}`, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 500)); // font settle

// screenshot each section individually
const sections = await page_.$$("section");
for (let i = 0; i < sections.length; i++) {
  await sections[i].screenshot({ path: path.join(OUT_DIR, `slide-${i + 1}.png`) });
  console.log(`slide-${i + 1}.png written`);
}

// full PDF
await page_.pdf({
  path: path.join(OUT_DIR, "Yeedu-TPCDS-Benchmark.pdf"),
  width: "1920px",
  height: "1080px",
  printBackground: true,
  margin: { top: 0, bottom: 0, left: 0, right: 0 },
});
console.log("PDF written");

await browser.close();
