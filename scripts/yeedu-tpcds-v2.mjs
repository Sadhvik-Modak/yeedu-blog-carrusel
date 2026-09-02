import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = "/home/sc2302/workarea/marketing/open-carrusel/yeedu-tpcds-v2";
fs.mkdirSync(OUT_DIR, { recursive: true });

const LOGO = fs.readFileSync(
  "/home/sc2302/workarea/marketing/open-carrusel/public/uploads/7d95c235-aa75-4cb1-a3c2-e84314ceca33.png"
);
const LOGO_DATA_URI = `data:image/png;base64,${LOGO.toString("base64")}`;

// ---------- Palette — dark Yeedu theme, sourced live from yeedu.com computed styles ----------
// body bg rgb(22,21,21)=#161515 · panel bg rgb(38,34,29)=#26221d (= brand secondary, confirmed
// live on-site) · card border rgb(58,59,53) · headings #fff · body text rgba(255,255,255,.7)
// · primary orange rgb(242,96,12)=#f2600c exact. yeedu.com's dark pages don't use the brand
// blue accent visibly — kept here as the validated dark-mode tint (#3987e5, from the earlier
// dataviz palette-validator run against a dark surface) for two-series comparisons only.
const C = {
  page: "#161515", // yeedu.com body bg, exact
  pageDeep: "#0c0b0b",
  ink: "#ffffff",
  ink2: "rgba(255,255,255,0.7)", // yeedu.com body paragraph color, exact
  muted: "rgba(255,255,255,0.48)",
  rule: "rgba(255,255,255,0.1)",
  orange: "#f2600c", // yeedu.com primary orange, exact
  orangeDeep: "#f2600c",
  orangeLight: "#ff9a52", // lightened step for small text/icons on dark, contrast-safe
  orangeTint: "rgba(242,96,12,0.14)",
  blue: "#3987e5", // validated dark-mode tint of brand accent #0050bd
  blueTint: "rgba(57,135,229,0.14)",
  cardBg: "#26221d", // yeedu.com panel surface, exact (= brand secondary)
  cardBorder: "rgb(58,59,53)", // yeedu.com card border, exact
  good: "#3ecf5e",
  logoChip: "transparent", // logo is white-on-transparent, no chip needed on dark bg
};

const FONT = `font-family:'Inter',-apple-system,sans-serif;`;
const HEAD = `font-family:'Montserrat',sans-serif;`;

// A4 @ 300dpi
const PW = 2480, PH = 3508;
const MX = 220; // margin x

// ================= ICON LIBRARY (line icons, ink-colored) =================
function iconWrap(inner, { color = C.ink, size = 44 } = {}) {
  return `<svg viewBox="0 0 48 48" width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}
const Icon = {
  check: (o) => iconWrap(`<circle cx="24" cy="24" r="19"/><path d="M15 24l6 6 12-13"/>`, o),
  dollar: (o) => iconWrap(`<circle cx="24" cy="24" r="19"/><path d="M24 12v24M29 17c0-3-3-4-5.5-4-3 0-5.5 1.6-5.5 4.4 0 5.6 11 2.6 11 8.4 0 3-3 4.6-5.5 4.6-3 0-6-1.4-6-4.6"/>`, o),
  gauge: (o) => iconWrap(`<path d="M8 30a16 16 0 0132 0"/><path d="M24 30l7-9"/><circle cx="24" cy="30" r="2.2" fill="${o?.color || C.ink}"/>`, o),
  code: (o) => iconWrap(`<path d="M17 15L8 24l9 9M31 15l9 9-9 9"/>`, o),
  cpu: (o) => iconWrap(`<rect x="14" y="14" width="20" height="20" rx="3"/><rect x="20" y="20" width="8" height="8" rx="1"/><path d="M20 8v6M28 8v6M20 34v6M28 34v6M8 20h6M8 28h6M34 20h6M34 28h6"/>`, o),
  spark: (o) => iconWrap(`<path d="M24 8l3.5 11.5L39 23l-11.5 3.5L24 38l-3.5-11.5L9 23l11.5-3.5z"/>`, o),
  magnifier: (o) => iconWrap(`<circle cx="21" cy="21" r="12"/><path d="M30 30l9 9"/>`, o),
  tree: (o) => iconWrap(`<circle cx="24" cy="10" r="4"/><circle cx="12" cy="34" r="4"/><circle cx="36" cy="34" r="4"/><path d="M24 14v8M24 22l-12 8M24 22l12 8"/>`, o),
  doc: (o) => iconWrap(`<path d="M14 8h13l7 7v25H14z"/><path d="M27 8v7h7M18 24h12M18 30h12"/>`, o),
  split: (o) => iconWrap(`<path d="M10 24h9M29 24h9M19 24l-5-8M19 24l-5 8M29 24l5-8M29 24l5 8"/><circle cx="24" cy="24" r="3" fill="${o?.color || C.ink}"/>`, o),
  cores: (o) => iconWrap(`<rect x="8" y="8" width="13" height="13" rx="2"/><rect x="27" y="8" width="13" height="13" rx="2"/><rect x="8" y="27" width="13" height="13" rx="2"/><rect x="27" y="27" width="13" height="13" rx="2"/>`, o),
  server: (o) => iconWrap(`<rect x="12" y="8" width="24" height="10" rx="2"/><rect x="12" y="22" width="24" height="10" rx="2"/><circle cx="17" cy="13" r="1.4" fill="${o?.color || C.ink}"/><circle cx="17" cy="27" r="1.4" fill="${o?.color || C.ink}"/><path d="M12 36h24"/>`, o),
  serverSmall: (o) => iconWrap(`<rect x="14" y="16" width="20" height="9" rx="1.5"/><circle cx="18" cy="20.5" r="1.1" fill="${o?.color || C.ink}"/>`, o),
  upload: (o) => iconWrap(`<path d="M24 32V12M16 20l8-8 8 8"/><path d="M10 36h28"/>`, o),
  play: (o) => iconWrap(`<circle cx="24" cy="24" r="17"/><path d="M20 16l14 8-14 8z"/>`, o),
  chartUp: (o) => iconWrap(`<path d="M8 34h32"/><path d="M12 30V20M20 30v-9M28 30V16M36 30v-6"/><path d="M28 10l8-2 2 8"/>`, o),
  arrowRight: (o) => iconWrap(`<path d="M8 24h30M28 14l10 10-10 10"/>`, o),
  quote: (o) => iconWrap(`<path d="M10 26V16a6 6 0 016-6M10 26h8v8a6 6 0 01-6 6M28 26V16a6 6 0 016-6M28 26h8v8a6 6 0 01-6 6"/>`, o),
};

function kicker(num, text) {
  return `<div style="display:flex;align-items:center;gap:14px;">
    <span style="width:40px;height:2px;background:${C.orange};display:inline-block;"></span>
    <span style="font-size:19px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:${C.orangeDeep};${FONT}">${num ? num + " &middot; " : ""}${text}</span>
  </div>`;
}

function logoChip() {
  return `<img src="${LOGO_DATA_URI}" style="height:34px;" />`;
}

const SECTIONS = ["Cover", "Benchmark & Result", "Infra & Engine", "Business Case"];

function chapterRail(current) {
  return `<div style="display:flex;gap:8px;margin-bottom:56px;">
    ${SECTIONS.map((label, i) => {
      const n = i + 1;
      const isCurrent = n === current;
      const isDone = n < current;
      const bg = isCurrent ? C.orange : "transparent";
      const border = isCurrent ? C.orange : isDone ? "rgba(242,96,12,0.5)" : C.cardBorder;
      const color = isCurrent ? "#1a1108" : isDone ? C.orangeLight : C.muted;
      return `<div style="flex:1;display:flex;align-items:center;gap:8px;padding:9px 14px;border-radius:999px;background:${bg};border:1px solid ${border};">
        <span style="font-size:12.5px;font-weight:800;color:${color};${HEAD}">0${n}</span>
        <span style="font-size:12.5px;color:${color};letter-spacing:0.5px;text-transform:uppercase;">${label}</span>
      </div>`;
    }).join("")}
  </div>`;
}

function pageHeader(docTitle) {
  return `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:36px;">
    ${logoChip()}
    <div style="text-align:right;font-size:17px;color:${C.muted};letter-spacing:0.5px;${FONT}">${docTitle}</div>
  </div>`;
}

function pageFooter(n) {
  return `<div style="position:absolute;left:${MX}px;right:${MX}px;bottom:90px;padding-top:24px;border-top:1px solid ${C.rule};display:flex;justify-content:space-between;font-size:16px;color:${C.muted};${FONT}">
    <span>Yeedu™ &middot; TPC-DS Benchmark &middot; Technical Summary</span>
    <span>Page 0${n} / 04</span>
  </div>`;
}

function footnote(text) {
  return `<div style="margin-top:auto;padding-top:28px;font-size:15.5px;line-height:1.6;color:${C.muted};${FONT}font-style:italic;border-top:1px solid ${C.rule};">${text}</div>`;
}

function page(n, docTitle, inner) {
  return `<section style="width:${PW}px;height:${PH}px;position:relative;background:linear-gradient(160deg, ${C.page} 0%, ${C.pageDeep} 100%);color:${C.ink};${FONT}-webkit-font-smoothing:antialiased;page-break-after:always;padding:150px ${MX}px 0;box-sizing:border-box;display:flex;flex-direction:column;">
    ${pageHeader(docTitle)}
    ${chapterRail(n)}
    <div style="flex:1;display:flex;flex-direction:column;">${inner}</div>
    ${pageFooter(n)}
  </section>`;
}

function statTile(iconName, value, label, color = C.orange, tint = C.orangeTint) {
  return `<div style="flex:1;padding:40px 34px;background:${tint};border:1px solid ${C.cardBorder};border-radius:16px;">
    <div style="width:64px;height:64px;border-radius:12px;background:${C.cardBg};border:1.5px solid ${color};display:flex;align-items:center;justify-content:center;">
      ${Icon[iconName]({ color, size: 32 })}
    </div>
    <div style="margin-top:24px;font-size:54px;font-weight:800;${HEAD}line-height:1;color:${C.ink};">${value}</div>
    <div style="margin-top:10px;font-size:17px;color:${C.ink2};letter-spacing:0.5px;">${label}</div>
  </div>`;
}

function dataTable(headers, rows, textLastCol = false) {
  const lastIdx = headers.length - 1;
  const align = (i) => (i === 0 || (textLastCol && i === lastIdx) ? "left" : "right");
  return `<table style="width:100%;border-collapse:collapse;${FONT}">
    <thead><tr>
      ${headers.map((h, i) => `<th style="text-align:${align(i)};padding:22px 14px;font-size:17px;letter-spacing:1px;text-transform:uppercase;color:${C.muted};border-bottom:2px solid ${C.ink};">${h}</th>`).join("")}
    </tr></thead>
    <tbody>
      ${rows
        .map(
          (r) => `<tr>${r
            .map((c, i) => `<td style="text-align:${align(i)};padding:28px 14px;font-size:${textLastCol && i === lastIdx ? 18 : 24};${i === 0 ? "font-weight:700;" + HEAD : ""}${textLastCol && i === lastIdx ? `color:${C.ink2};` : ""}border-bottom:1px solid ${C.rule};">${c}</td>`)
            .join("")}</tr>`
        )
        .join("")}
    </tbody>
  </table>`;
}

function archFlowDiagram(nodes) {
  const w = 2040, nodeW = 336, nodeH = 168, gap = (w - nodeW) / (nodes.length - 1), y = 20;
  let svg = `<svg viewBox="0 0 ${w} ${nodeH + 40}" width="100%" height="${nodeH + 40}">`;
  for (let i = 0; i < nodes.length - 1; i++) {
    const x1 = i * gap + nodeW + 4;
    const x2 = (i + 1) * gap - 4;
    const midY = y + nodeH / 2;
    svg += `<line x1="${x1}" y1="${midY}" x2="${x2}" y2="${midY}" stroke="${C.orange}" stroke-width="2.5" stroke-dasharray="1 8" opacity="0.7"/>
      <polygon points="${x2},${midY - 7} ${x2 + 12},${midY} ${x2},${midY + 7}" fill="${C.orange}"/>`;
  }
  nodes.forEach((n, i) => {
    const x = i * gap;
    svg += `<rect x="${x}" y="${y}" width="${nodeW}" height="${nodeH}" rx="14" fill="${C.cardBg}" stroke="${C.orange}" stroke-width="1.5" opacity="0.95"/>
      <g transform="translate(${x + 24},${y + 24})">${Icon[n.icon]({ color: C.orangeLight, size: 34 })}</g>
      <text x="${x + 24}" y="${y + 96}" fill="${C.ink}" font-size="21" font-weight="700" style="${HEAD}">${n.title}</text>
      <text x="${x + 24}" y="${y + 126}" fill="${C.muted}" font-size="14.5" style="${FONT}">${n.sub}</text>
      <text x="${x + nodeW - 20}" y="${y + 30}" text-anchor="end" fill="${C.orangeLight}" font-size="14" font-weight="800" style="${HEAD}">0${i + 1}</text>`;
  });
  svg += `</svg>`;
  return svg;
}

function tag(text) {
  return `<span style="padding:15px 28px;background:${C.cardBg};border:1px solid ${C.cardBorder};border-radius:999px;font-size:18px;color:${C.ink2};">${text}</span>`;
}

function ring({ pct = 100, label, sub, size = 200, color = C.orange, trackColor = C.rule }) {
  const r = size / 2 - 13;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${trackColor}" stroke-width="13"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="13" stroke-linecap="round"
      stroke-dasharray="${c}" stroke-dashoffset="${off}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
    <text x="50%" y="47%" text-anchor="middle" fill="${C.ink}" font-size="34" font-weight="800" style="${HEAD}">${label}</text>
    <text x="50%" y="63%" text-anchor="middle" fill="${C.muted}" font-size="13" style="${FONT}">${sub}</text>
  </svg>`;
}

function twoSegmentDonut({ a, b, size = 200 }) {
  const r = size / 2 - 13;
  const c = 2 * Math.PI * r;
  const aLen = c * (a.value / (a.value + b.value));
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${b.color}" stroke-width="13"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${a.color}" stroke-width="13"
      stroke-dasharray="${aLen} ${c - aLen}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
    <text x="50%" y="47%" text-anchor="middle" fill="${C.ink}" font-size="30" font-weight="800" style="${HEAD}">24</text>
    <text x="50%" y="63%" text-anchor="middle" fill="${C.muted}" font-size="13" style="${FONT}">TABLES</text>
  </svg>`;
}

function budgetReallocationChart() {
  const w = 900, h = 300, baseY = h - 50;
  const groups = [
    { label: "Infrastructure Spend", color: C.orange, before: 100, after: 42, x: 60 },
    { label: "Analytics &amp; ML Headroom", color: C.blue, before: 30, after: 88, x: 500 },
  ];
  const scale = 190 / 100;
  let svg = `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}">`;
  svg += `<line x1="20" y1="${baseY}" x2="${w - 20}" y2="${baseY}" stroke="${C.rule}" stroke-width="2"/>`;
  groups.forEach((g) => {
    const bh1 = g.before * scale, bh2 = g.after * scale;
    svg += `
      <rect x="${g.x}" y="${baseY - bh1}" width="70" height="${bh1}" rx="5" fill="${g.color}" opacity="0.35"/>
      <text x="${g.x + 35}" y="${baseY + 28}" text-anchor="middle" fill="${C.muted}" font-size="14" style="${FONT}">Before</text>
      <rect x="${g.x + 90}" y="${baseY - bh2}" width="70" height="${bh2}" rx="5" fill="${g.color}"/>
      <text x="${g.x + 125}" y="${baseY + 28}" text-anchor="middle" fill="${C.ink2}" font-size="14" font-weight="700" style="${FONT}">With Turbo</text>
      <text x="${g.x + 80}" y="${baseY - Math.max(bh1, bh2) - 18}" text-anchor="middle" fill="${g.color}" font-size="16" font-weight="800" style="${HEAD}">${g.after > g.before ? "&#8593;" : "&#8595;"}</text>
      <text x="${g.x + 80}" y="${h - 8}" text-anchor="middle" fill="${C.ink}" font-size="15" font-weight="700" style="${HEAD}">${g.label}</text>`;
  });
  svg += `</svg>`;
  return svg;
}

function miniTable(headers, rows) {
  return `<table style="width:100%;border-collapse:collapse;${FONT}">
    <thead><tr>
      ${headers.map((h, i) => `<th style="text-align:${i === 0 ? "left" : "center"};padding:20px 12px;font-size:16.5px;letter-spacing:1px;text-transform:uppercase;color:${C.muted};border-bottom:2px solid ${C.ink};">${h}</th>`).join("")}
    </tr></thead>
    <tbody>
      ${rows
        .map(
          (r) => `<tr>${r
            .map((c, i) => `<td style="text-align:${i === 0 ? "left" : "center"};padding:23px 12px;font-size:19px;${i === 0 ? "font-weight:700;" : ""}color:${i === 0 ? C.ink : C.ink2};border-bottom:1px solid ${C.rule};">${c}</td>`)
            .join("")}</tr>`
        )
        .join("")}
    </tbody>
  </table>`;
}

// =============== PAGE 1: COVER ===============
const s1 = page(1, "Technical Benchmark Summary", `
  <div style="margin-top:40px;display:flex;justify-content:space-between;gap:40px;">
    <div style="flex:1;">
      ${kicker("", "TPC-DS Benchmark Report")}
      <h1 style="margin:36px 0 0;font-size:78px;line-height:1.15;letter-spacing:-2px;${HEAD}font-weight:800;">
        The Fastest. The Most Cost-Efficient.<br/><span style="color:${C.orangeDeep};">Spark, Reengineered.</span>
      </h1>
      <p style="margin-top:36px;font-size:28px;color:${C.ink2};line-height:1.55;max-width:1550px;">
        An independent, industry-standard evaluation of the Yeedu Turbo engine against the TPC-DS decision-support benchmark — the de-facto standard for measuring Big Data and analytics platform performance.
      </p>
      <div style="margin-top:52px;display:flex;gap:70px;font-size:19px;color:${C.ink2};">
        <div><div style="color:${C.muted};font-size:15px;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">Prepared for</div>Data Platform Architects &amp; Engineering Leadership</div>
        <div><div style="color:${C.muted};font-size:15px;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">Standard</div>TPC-DS v2</div>
        <div><div style="color:${C.muted};font-size:15px;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">Environment</div>AWS &middot; Graviton4</div>
      </div>
    </div>
    <div style="flex-shrink:0;padding:34px;background:${C.cardBg};border:1px solid ${C.cardBorder};border-radius:16px;display:flex;flex-direction:column;align-items:center;gap:10px;height:fit-content;">
      ${ring({ pct: 100, label: "99/99", sub: "QUERIES PASSED", size: 210 })}
    </div>
  </div>

  <div style="margin-top:110px;">
    <div style="font-size:17px;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted};margin-bottom:28px;">Executive Summary</div>
    <div style="display:flex;gap:26px;">
      ${statTile("check", "99/99", "TPC-DS QUERIES PASSED", C.orange, C.orangeTint)}
      ${statTile("dollar", "$0.52", "COST PER TB PROCESSED", C.blue, C.blueTint)}
      ${statTile("gauge", "4–10×", "FASTER EXECUTION", C.orange, C.orangeTint)}
      ${statTile("code", "0", "CODE REWRITES REQUIRED", C.blue, C.blueTint)}
    </div>
  </div>

  <div style="margin-top:90px;">
    <div style="font-size:17px;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted};margin-bottom:26px;">Abstract</div>
    <p style="font-size:21px;color:${C.ink2};line-height:1.7;max-width:1900px;">
      This document summarizes an independent benchmark run of the Yeedu Turbo engine against TPC-DS, the industry-standard decision-support benchmark maintained by the Transaction Processing Performance Council (TPC). It is written for engineering audiences evaluating Yeedu as a drop-in replacement for an existing Apache Spark deployment. It covers: the benchmark standard, methodology, and measured cost/execution-time results across three data scales (Section 01); the single-machine compute infrastructure and query-execution architecture behind those results (Section 02); and the operational and financial implications for a team currently running Spark in production (Section 03).
    </p>
  </div>

  <div style="margin-top:72px;">
    <div style="font-size:17px;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted};margin-bottom:26px;">Contents</div>
    <div style="display:flex;flex-direction:column;">
      ${[
        ["01", "The Benchmark &amp; The Result", "What TPC-DS measures, and the cost/time results it produced across 1TB, 3TB, and 10TB."],
        ["02", "Infrastructure &amp; The Architecture", "The single-machine compute each result ran on, and how the Turbo engine executes a query."],
        ["03", "What This Means", "The operational and budget case for evaluating Yeedu against your current Spark spend."],
      ]
        .map(
          ([n, t, d]) => `<div style="display:flex;gap:30px;align-items:baseline;padding:24px 0;border-bottom:1px solid ${C.rule};">
          <span style="font-size:23px;font-weight:800;color:${C.orangeDeep};${HEAD}width:54px;flex-shrink:0;">${n}</span>
          <span style="font-size:23px;font-weight:700;${HEAD}width:460px;flex-shrink:0;">${t}</span>
          <span style="font-size:19px;color:${C.ink2};">${d}</span>
        </div>`
        )
        .join("")}
    </div>
  </div>
`);

// =============== PAGE 2: THE BENCHMARK & THE RESULT (merged) ===============
const resultItems = [
  { icon: "check", title: "99 out of 99", body: "Correlated subqueries, multi-pass window functions, rollups across 3 sales channels. No rewrites, no retries." },
  { icon: "dollar", title: "Sub-dollar at TB scale", body: "Full TPC-DS suite against 1TB for $0.52 — production-grade efficiency, not a tuned demo." },
  { icon: "cpu", title: "Pure engine performance", body: "Same data, same queries, standard cloud hardware anyone can rent. Only variable is the engine." },
  { icon: "spark", title: "Compute headroom for AI", body: "Efficiency at the analytics layer directly increases budget available for ML workloads." },
];
const s2 = page(2, "01 &middot; The Benchmark &amp; The Result", `
  ${kicker("01", "The Benchmark Standard")}
  <h1 style="margin:40px 0 0;font-size:56px;letter-spacing:-1.4px;${HEAD}font-weight:800;">What Is TPC-DS, and What Did It Show?</h1>

  <div style="margin-top:52px;display:flex;gap:28px;align-items:flex-start;padding:42px 46px;background:${C.cardBg};border:1px solid ${C.cardBorder};border-left:4px solid ${C.orange};border-radius:12px;">
    <div style="flex-shrink:0;margin-top:2px;">${Icon.quote({ color: C.orange, size: 38 })}</div>
    <div>
      <p style="font-size:23px;line-height:1.7;color:${C.ink};font-style:italic;">
        "TPC-DS is the de-facto industry standard benchmark for measuring the performance of decision support solutions, including but not limited to Big Data systems&hellip; designed to be broadly representative of modern decision support systems," which <strong>&ldquo;run on Big Data solutions, such as RDBMS as well as Hadoop/Spark-based systems.&rdquo;</strong>
      </p>
      <div style="margin-top:16px;font-size:16px;color:${C.muted};">&mdash; TPC Benchmarks Overview, <span style="color:${C.ink2};">tpc.org</span></div>
    </div>
  </div>

  <div style="margin-top:48px;display:flex;gap:18px;flex-wrap:wrap;">
    ${["24 tables (7 fact / 17 dimension)", "99 distinct queries", "Retail-supplier schema", "Power + Throughput + Data-Maintenance tests"].map(tag).join("")}
  </div>

  <div style="margin-top:48px;display:flex;gap:28px;align-items:stretch;">
    <div style="flex-shrink:0;padding:32px;background:${C.cardBg};border:1px solid ${C.cardBorder};border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;">
      ${twoSegmentDonut({ a: { value: 7, color: C.orange }, b: { value: 17, color: C.blue }, size: 200 })}
    </div>
    <div style="flex:1;padding:30px 34px;background:${C.cardBg};border:1px solid ${C.cardBorder};border-radius:12px;">
      <div style="font-size:15px;letter-spacing:1.2px;text-transform:uppercase;color:${C.orangeLight};font-weight:700;margin-bottom:10px;">Fact Tables (7)</div>
      <div style="font-size:17px;color:${C.ink2};line-height:1.9;font-family:monospace;">store_sales &middot; store_returns &middot; catalog_sales &middot; catalog_returns &middot; web_sales &middot; web_returns &middot; inventory</div>
      <div style="font-size:15px;letter-spacing:1.2px;text-transform:uppercase;color:${C.blue};font-weight:700;margin:22px 0 10px;">Dimension Tables (17)</div>
      <div style="font-size:16px;color:${C.ink2};line-height:1.85;font-family:monospace;">customer &middot; customer_address &middot; customer_demographics &middot; household_demographics &middot; income_band &middot; date_dim &middot; time_dim &middot; item &middot; promotion &middot; reason &middot; ship_mode &middot; store &middot; call_center &middot; catalog_page &middot; web_page &middot; web_site &middot; warehouse</div>
    </div>
  </div>
  <p style="margin-top:30px;font-size:19px;color:${C.ink2};line-height:1.75;max-width:1900px;">A retailer selling through store, catalog, and web channels — every query in the suite joins against this full schema. TPC-DS is difficult to game the way a vendor microbenchmark can be: it's maintained by an independent, vendor-neutral standards body, the query set is fixed and public, and the schema is deliberately representative of real decision-support workloads rather than tuned to one product.</p>

  <div style="margin-top:44px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:18px;">
    ${[
      ["Ad-hoc", "Exploratory queries against the full schema."],
      ["Reporting", "Fixed, recurring queries against known dimensions."],
      ["Iterative OLAP", "Multi-pass, drill-down queries refining a prior result."],
      ["Data Mining", "Complex joins/aggregations behind feature engineering."],
    ]
      .map(
        ([t, d]) => `<div style="padding:26px 24px;background:${C.cardBg};border:1px solid ${C.cardBorder};border-radius:12px;">
        <div style="font-size:18px;font-weight:700;${HEAD}margin-bottom:10px;">${t}</div>
        <div style="font-size:15px;color:${C.ink2};line-height:1.5;">${d}</div>
      </div>`
      )
      .join("")}
  </div>

  <div style="margin-top:60px;height:1px;background:${C.rule};"></div>

  <div style="margin-top:48px;">${kicker("02", "The Result")}</div>
  <h1 style="margin:26px 0 0;font-size:46px;letter-spacing:-1.2px;${HEAD}font-weight:800;">99 Queries. 99 Passes. Zero Shortcuts.</h1>

  <div style="margin-top:40px;display:grid;grid-template-columns:1fr 1fr;gap:22px;">
    ${resultItems
      .map(
        (r) => `<div style="display:flex;gap:20px;padding:30px 32px;background:${C.cardBg};border:1px solid ${C.cardBorder};border-radius:12px;">
        <div style="width:48px;height:48px;border-radius:10px;background:${C.orangeTint};border:1px solid ${C.orange};display:flex;align-items:center;justify-content:center;flex-shrink:0;">${Icon[r.icon]({ color: C.orangeDeep, size: 24 })}</div>
        <div>
          <div style="font-size:20px;font-weight:700;${HEAD}margin-bottom:8px;">${r.title}</div>
          <div style="font-size:17px;color:${C.ink2};line-height:1.55;">${r.body}</div>
        </div>
      </div>`
      )
      .join("")}
  </div>

  <div style="margin-top:44px;padding:20px 40px;background:${C.cardBg};border:1px solid ${C.cardBorder};border-radius:12px;">
    ${dataTable(
      ["Scale", "Total Cost", "Query Time", "Queries", "In Human Terms"],
      [
        ["1 TB", "$0.52", "17 min", "99/99", "less than a pack of chewing gum"],
        ["3 TB", "$2.33", "40 min", "99/99", "less than a gas-station coffee"],
        ["10 TB", "$12.57", "3.16 hrs", "99/99", "less than a casual weekday lunch"],
      ],
      true
    )}
  </div>
  <p style="margin-top:32px;font-size:20px;color:${C.ink2};line-height:1.75;max-width:1950px;">Cost scales near-linearly with data volume rather than degrading at higher scale — a 10× increase in data volume produces roughly a 10× increase in cost, not a super-linear one. This is the signal architects look for when validating that a benchmark result holds at production scale rather than only at a favorably small test size. "Query Time" reflects the Power Test — the full 99-query suite run sequentially, with no query rewrites, no manual tuning between queries, and no cached results carried over between runs.</p>

  ${footnote(`Source: TPC-DS Specification &amp; TPC Benchmarks Overview — tpc.org/tpcds/, tpc.org/information/benchmarks5.asp. Yeedu TPC-DS Benchmark — yeedu.com/benchmarks/. TPC Benchmark™ DS (TPC-DS) is a trademark of the Transaction Processing Performance Council (TPC).`)}
`);

// =============== PAGE 4: ONE MACHINE ===============
function clusterVsSingleLight() {
  // driver at top, 4 workers below — task-assignment lines from driver, plus
  // worker-to-worker shuffle lines (the actual network cost during joins/aggregations)
  const workerX = [40, 110, 180, 250];
  const driver = { x: 145, y: 22 };
  const workerY = 110;
  const driverLines = workerX.map((wx) => `<line x1="${driver.x}" y1="${driver.y + 14}" x2="${wx + 12}" y2="${workerY}" stroke="${C.muted}" stroke-width="1.3" opacity="0.6"/>`).join("");
  const shuffleLines = [];
  for (let i = 0; i < workerX.length; i++) {
    for (let j = i + 1; j < workerX.length; j++) {
      shuffleLines.push(`<line x1="${workerX[i] + 12}" y1="${workerY + 18}" x2="${workerX[j] + 12}" y2="${workerY + 18}" stroke="${C.orange}" stroke-width="1.2" stroke-dasharray="2 4" opacity="0.55"/>`);
    }
  }
  const workers = workerX.map((wx) => `<g transform="translate(${wx},${workerY})">${Icon.serverSmall({ color: C.muted, size: 48 })}</g>`).join("");
  return `<div style="display:flex;align-items:center;gap:52px;">
    <div style="text-align:center;">
      <div style="font-size:17px;letter-spacing:1.5px;color:${C.muted};margin-bottom:20px;text-transform:uppercase;">Distributed Spark</div>
      <svg viewBox="0 0 300 175" width="380" height="222">
        <rect x="4" y="4" width="292" height="167" rx="14" fill="none" stroke="${C.cardBorder}" stroke-dasharray="5 7"/>
        <g transform="translate(${driver.x - 20},${driver.y})">${Icon.cpu({ color: C.orangeLight, size: 40 })}</g>
        <text x="150" y="70" text-anchor="middle" fill="${C.muted}" font-size="10" letter-spacing="0.5">driver</text>
        ${driverLines}
        ${shuffleLines}
        ${workers}
        <text x="150" y="168" text-anchor="middle" fill="${C.muted}" font-size="10" letter-spacing="0.5">4 workers &middot; shuffle over network</text>
      </svg>
      <div style="margin-top:14px;font-size:17px;color:${C.muted};">Driver + workers &middot; network shuffle on every join</div>
    </div>
    <div>${Icon.arrowRight({ color: C.orange, size: 48 })}</div>
    <div style="text-align:center;">
      <div style="font-size:17px;letter-spacing:1.5px;color:${C.orangeLight};margin-bottom:20px;text-transform:uppercase;">Single-Node Spark &mdash; Yeedu Turbo</div>
      <svg viewBox="0 0 300 175" width="380" height="222">
        <rect x="4" y="4" width="292" height="167" rx="14" fill="${C.orangeTint}" stroke="${C.orange}"/>
        <rect x="70" y="30" width="160" height="110" rx="10" fill="none" stroke="${C.orangeLight}" stroke-width="1.5"/>
        <g transform="translate(96,50)">${Icon.cores({ color: C.orangeLight, size: 34 })}</g>
        <g transform="translate(146,50)">${Icon.cores({ color: C.orangeLight, size: 34 })}</g>
        <g transform="translate(96,90)">${Icon.cores({ color: C.orangeLight, size: 34 })}</g>
        <g transform="translate(146,90)">${Icon.cores({ color: C.orangeLight, size: 34 })}</g>
        <text x="150" y="160" text-anchor="middle" fill="${C.ink2}" font-size="10" letter-spacing="0.5">all cores, one machine, no network</text>
      </svg>
      <div style="margin-top:14px;font-size:17px;color:${C.ink2};">One machine, one Spark node &middot; zero network shuffle</div>
    </div>
  </div>`;
}
const s3 = page(3, "02 &middot; Infrastructure &amp; The Architecture", `
  ${kicker("02", "Infrastructure")}
  <h1 style="margin:38px 0 0;font-size:54px;letter-spacing:-1.4px;${HEAD}font-weight:800;">Big Data in a Box.</h1>
  <p style="margin-top:22px;font-size:20px;color:${C.ink2};max-width:1900px;line-height:1.6;">All three scales — 1TB, 3TB, and 10TB — ran on single-node Spark, not a distributed cluster, each on a different machine size. Modern cloud hardware has reached the point where big data at this scale no longer requires distributing the compute.</p>

  <div style="margin-top:46px;display:flex;gap:40px;align-items:flex-start;">
    <div style="flex-shrink:0;">${clusterVsSingleLight()}</div>
    <div style="flex:1;padding:32px 36px;background:${C.cardBg};border:1px solid ${C.cardBorder};border-left:4px solid ${C.orange};border-radius:12px;">
      <div style="font-size:15px;letter-spacing:1.3px;text-transform:uppercase;color:${C.orangeDeep};font-weight:700;margin-bottom:10px;">Why This Matters For Architects</div>
      <div style="font-size:17px;color:${C.ink2};line-height:1.65;">No distributed coordination layer, no cross-node shuffle, no partial-cluster failure modes to design around. Capacity planning reduces to a single question: how many cores does this workload need.</div>
      <div style="font-size:15px;letter-spacing:1.3px;text-transform:uppercase;color:${C.blue};font-weight:700;margin:24px 0 10px;">Deployment Model</div>
      <div style="font-size:17px;color:${C.ink2};line-height:1.65;">Control plane and compute run inside the customer's own cloud account (AWS, Azure, or GCP) — inside the customer's VPC. No data leaves the customer's environment to reach Yeedu.</div>
    </div>
  </div>

  <div style="margin-top:76px;padding:14px 38px;background:${C.cardBg};border:1px solid ${C.cardBorder};border-radius:12px;">
    ${dataTable(
      ["Spec", "1 TB", "3 TB", "10 TB"],
      [
        ["Machine Type", "m8gd.8xlarge", "r8gd.12xlarge", "i8g.12xlarge"],
        ["vCPU", "32", "48", "64"],
        ["Memory", "128 GiB", "384 GiB", "512 GiB"],
        ["Storage", "1× 1,900GB NVMe", "3× 950GB NVMe", "4× 3,750GB NVMe"],
        ["Network", "15 Gbps", "22.5 Gbps", "Up to 37.5 Gbps"],
      ]
    )}
  </div>

  <div style="margin-top:64px;height:1px;background:${C.rule};"></div>

  <div style="margin-top:52px;">${kicker("03", "The Architecture")}</div>
  <h1 style="margin:26px 0 0;font-size:46px;letter-spacing:-1.2px;${HEAD}font-weight:800;">What Makes Yeedu Turbo a More Efficient Engine</h1>
  <p style="margin-top:18px;font-size:19px;color:${C.ink2};max-width:1800px;line-height:1.6;">The same Spark SQL goes in — PySpark, Scala, or SQL, unmodified. What changes is everything underneath the query submission layer.</p>

  <div style="margin-top:46px;">
    ${archFlowDiagram([
      { icon: "doc", title: "Spark SQL", sub: "PySpark &middot; Scala &middot; SQL" },
      { icon: "tree", title: "Logical Plan", sub: "Same plan Catalyst builds" },
      { icon: "magnifier", title: "Data Profile", sub: "Schema &middot; size &middot; dist." },
      { icon: "split", title: "N Partitions", sub: "Compiled to Turbo-native SQL" },
      { icon: "cores", title: "Parallel Execute", sub: "Every core, one machine" },
    ])}
  </div>

  <div style="margin-top:26px;">
    ${[
      ["Parse", "Spark SQL received completely unchanged — same code the customer already runs in production.", "doc"],
      ["Extract the logical plan", "Turbo extracts the same logical plan Spark's own Catalyst optimizer would build from the identical input.", "tree"],
      ["Understand the data", "Before choosing an execution strategy, Turbo inspects the underlying data: schema, size, and distribution.", "magnifier"],
      ["Split &amp; compile", `The logical plan is split into parallel units sized against the data itself: <code style="background:rgba(255,255,255,0.08);padding:3px 9px;border-radius:4px;font-size:17px;color:${C.orangeLight};">numPartitions = (dataSizeMB &times; multiplier) &divide; (memoryLimitGB &times; 1024)</code> — partition count scales with data volume and available memory per core, not a fixed split. Compiled into Turbo-native SQL, not JVM Spark bytecode.`, "split"],
      ["Execute", "Compiled units run across every core of a single machine in parallel — no network shuffle between machines.", "cores"],
    ]
      .map(
        ([t, b, ic], i) => `<div style="display:flex;gap:26px;padding:26px 0;border-bottom:1px solid ${C.rule};">
        <div style="width:56px;height:56px;border-radius:50%;border:2px solid ${C.orange};display:flex;align-items:center;justify-content:center;flex-shrink:0;">${Icon[ic]({ color: C.orangeDeep, size: 27 })}</div>
        <div>
          <div style="font-size:21px;font-weight:700;${HEAD}margin-bottom:7px;">0${i + 1} &middot; ${t}</div>
          <div style="font-size:17.5px;color:${C.ink2};line-height:1.6;max-width:1850px;">${b}</div>
        </div>
      </div>`
      )
      .join("")}
  </div>

  <div style="margin-top:44px;display:flex;gap:30px;align-items:stretch;">
    <div style="flex:1;padding:30px 34px;background:${C.cardBg};border:1px solid ${C.cardBorder};border-radius:12px;">
      <div style="font-size:15px;letter-spacing:1.3px;text-transform:uppercase;color:${C.muted};font-weight:700;margin-bottom:18px;">Execution-Layer Techniques</div>
      <div style="font-size:17px;color:${C.ink2};line-height:1.65;"><strong style="color:${C.ink};">SIMD-accelerated execution</strong> — vector ALU instructions process multiple data values per CPU cycle, exploiting hardware parallelism a JVM-based engine leaves unused.</div>
      <div style="font-size:17px;color:${C.ink2};line-height:1.65;margin-top:16px;"><strong style="color:${C.ink};">Columnar batch processing</strong> — filters, joins, and aggregations run through a native columnar engine on batches, not row-by-row.</div>
      <div style="font-size:17px;color:${C.ink2};line-height:1.65;margin-top:16px;"><strong style="color:${C.ink};">Off-heap memory</strong> — managed outside the JVM heap, avoiding the garbage-collection pause overhead that affects traditional JVM-based Spark under load.</div>
    </div>
    <div style="flex:1;padding:30px 34px;background:${C.cardBg};border:1px solid ${C.cardBorder};border-radius:12px;">
      ${miniTable(
        ["Layer", "Status"],
        [
          ["Application code", "Unchanged"],
          ["Logical query plan", "Unchanged — Catalyst's own plan"],
          ["Physical execution engine", "Replaced — C++ native, not JVM"],
          ["Cluster topology", "Removed — single machine"],
          ["Memory management", "Replaced — off-heap, no GC"],
        ]
      )}
    </div>
  </div>

  ${footnote(`Source: Yeedu TPC-DS Benchmark infrastructure disclosure — yeedu.com/benchmarks/. Each scale tier ran on a single, differently-sized instance — single-node compute, not a distributed cluster.`)}
`);

// =============== PAGE 4: BUSINESS CASE + CTA ===============
const s4 = page(4, "03 &middot; What This Means", `
  ${kicker("03", "What This Means")}
  <h1 style="margin:32px 0 0;font-size:58px;line-height:1.2;letter-spacing:-1.6px;${HEAD}font-weight:800;">Every Dollar Saved on Big Data Is a Dollar Reinvested in Analytics and ML.</h1>
  <p style="margin-top:28px;font-size:22px;color:${C.ink2};line-height:1.6;max-width:1750px;">Lower infrastructure spend doesn't just cut costs — it funds the use cases that were previously too expensive to justify: feature stores, model training, real-time inference, and the analytics workloads competing for the same compute budget.</p>

  <div style="margin-top:48px;padding:36px 40px;background:${C.cardBg};border:1px solid ${C.cardBorder};border-radius:12px;">
    ${budgetReallocationChart()}
    <p style="margin-top:18px;font-size:16px;color:${C.muted};line-height:1.5;">Illustrative reallocation — the actual split depends on your current infrastructure spend and workload mix; the onboarding process below measures your specific numbers.</p>
  </div>

  <div style="margin-top:56px;font-size:17px;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted};margin-bottom:24px;">Getting Started</div>
  <div style="display:flex;gap:28px;">
    ${[
      ["01", "Send your workload", "We profile it on our side."],
      ["02", "Run the benchmark", "Apples-to-apples comparison against your current platform."],
      ["03", "See your savings", "A concrete dollar figure and speed delta — in days, not quarters."],
    ]
      .map(
        ([n, t, b]) => `<div style="flex:1;padding:34px;background:${C.cardBg};border:1px solid ${C.cardBorder};border-radius:12px;">
        <div style="font-size:25px;font-weight:800;color:${C.orangeDeep};${HEAD}">${n}</div>
        <div style="margin-top:16px;font-size:23px;font-weight:700;${HEAD}">${t}</div>
        <div style="margin-top:10px;font-size:17px;color:${C.ink2};line-height:1.5;">${b}</div>
      </div>`
      )
      .join("")}
  </div>

  <div style="margin-top:60px;">
    <div style="font-size:17px;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted};margin-bottom:24px;">Qualitative Comparison</div>
    <div style="padding:8px 30px;background:${C.cardBg};border:1px solid ${C.cardBorder};border-radius:12px;">
    ${miniTable(
      ["Dimension", "Traditional Spark Cluster", "Yeedu Turbo"],
      [
        ["Cost per TB processed", "Baseline", "$0.52 (1TB) — TPC-DS measured"],
        ["Cluster operations overhead", "Ongoing — sizing, patching, monitoring", "None — single instance"],
        ["Code changes required", "N/A", "Zero — same PySpark/Scala/SQL"],
        ["Execution model", "Distributed, network shuffle", "Single-machine, multi-core"],
      ]
    )}
    </div>
  </div>

  <p style="margin-top:44px;font-size:19px;color:${C.ink2};line-height:1.65;max-width:1900px;">
    This is a starting point for evaluation, not a replacement for one. The onboarding process below runs the same TPC-DS-style comparison against your actual workload, on your actual data shape, so the cost and speed delta reported back is specific to your environment rather than this benchmark's.
  </p>

  <div style="margin-top:52px;display:flex;gap:22px;align-items:center;">
    <span style="padding:26px 46px;background:${C.orange};border-radius:10px;font-weight:700;font-size:22px;color:#fff;${HEAD}">Get Your Estimate &rarr;</span>
    <span style="padding:26px 46px;border:1.5px solid ${C.cardBorder};border-radius:10px;font-size:21px;color:${C.ink2};">sales@yeedu.io</span>
  </div>

  ${footnote(`Yeedu™ is a trademark of Yeedu. TPC Benchmark™ DS (TPC-DS) is a trademark of the Transaction Processing Performance Council. All figures in this document are sourced from published Yeedu benchmark disclosures; see prior pages for citations.`)}
`);

const allPages = [s1, s2, s3, s4];

const fullHtml = `<!doctype html>
<html><head><meta charset="utf-8">
<style>
  @page { margin: 0; size: ${PW}px ${PH}px; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:${PW}px; }
</style>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head><body>${allPages.join("\n")}</body></html>`;

fs.writeFileSync(path.join(OUT_DIR, "onepager.html"), fullHtml);

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page_ = await browser.newPage();
await page_.setViewport({ width: PW, height: PH });
await page_.goto(`file://${path.join(OUT_DIR, "onepager.html")}`, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 500));

const sections = await page_.$$("section");
for (let i = 0; i < sections.length; i++) {
  await sections[i].screenshot({ path: path.join(OUT_DIR, `page-${i + 1}.png`) });
  console.log(`page-${i + 1}.png written`);
}

await page_.pdf({
  path: path.join(OUT_DIR, "Yeedu-TPCDS-Technical-Summary.pdf"),
  width: `${PW}px`,
  height: `${PH}px`,
  printBackground: true,
  margin: { top: 0, bottom: 0, left: 0, right: 0 },
});
console.log("PDF written");

await browser.close();
