// ════════════════════════════════════════════════════════════════
// Shared drawing parts for the Oct 2026 decks (buy vs build, Databricks
// pricing, efficient Spark workloads). Chrome stays in ./yeedu-chrome.mjs;
// this file only holds the SVG text helpers, row cards and the closer that
// the three decks would otherwise copy from yeedu-vectorized-execution.mjs.
// ════════════════════════════════════════════════════════════════
import { C, ctaPill } from './yeedu-chrome.mjs';

export const O = C.orange, OL = C.orangeLight;
export const MONO = 'JetBrains Mono, monospace';

export const em2 = (t) => `<span style="display:block;font-weight:300;font-style:italic;background:linear-gradient(180deg,#fff,${C.orangeLight});-webkit-background-clip:text;background-clip:text;color:transparent;padding-right:0.14em;-webkit-box-decoration-break:clone;box-decoration-break:clone;">${t}</span>`;

export const lbl = (x, y, t, { anchor = 'start', fill = '#fff', op = 0.42, size = 6.2 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter" font-size="${size}" font-weight="600" letter-spacing="0.9" fill="${fill}" opacity="${op}">${t}</text>`;
export const txt = (x, y, t, { anchor = 'start', fill = '#fff', op = 0.75, size = 5.2, weight = 500, family = 'Inter' } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" opacity="${op}">${t}</text>`;

// A card: optional orange accent bar, title line, sub line.
export function card(x, y, w, h, title, sub, { hot = false, mono = false, titleSize = 4.6, subSize = 3.8, subFill = '#fff' } = {}) {
  let b = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${hot ? O : '#fff'}" fill-opacity="${hot ? 0.16 : 0.07}" stroke="${hot ? O : '#fff'}" stroke-opacity="${hot ? 1 : 0.3}" stroke-width="${hot ? 1 : 0.7}"/>`;
  b += `<rect x="${x}" y="${y}" width="2.4" height="${h}" rx="1" fill="${hot ? O : OL}"/>`;
  const ty = sub ? y + h / 2 - 1 : y + h / 2 + titleSize * 0.35;
  b += txt(x + 6, ty, title, { size: titleSize, op: 1, weight: 700, family: mono ? MONO : 'Inter' });
  if (sub) b += txt(x + 6, y + h / 2 + subSize + 0.6, sub, { size: subSize, op: 0.68, fill: subFill });
  return b;
}

export const arrow = (x1, y1, x2, y2, { color = '#fff', op = 0.45, w = 0.8 } = {}) => {
  const a = Math.atan2(y2 - y1, x2 - x1), s = 2.2;
  const p1 = `${x2 - s * Math.cos(a - 0.5)},${y2 - s * Math.sin(a - 0.5)}`;
  const p2 = `${x2 - s * Math.cos(a + 0.5)},${y2 - s * Math.sin(a + 0.5)}`;
  return `<path d="M${x1},${y1} L${x2},${y2}" stroke="${color}" stroke-opacity="${op}" stroke-width="${w}"/><path d="M${p1} L${x2},${y2} L${p2}" fill="none" stroke="${color}" stroke-opacity="${op}" stroke-width="${w}"/>`;
};

export const code = (t) => `<span style="font-family:'JetBrains Mono',monospace;color:#fff;">${t}</span>`;

// ── Closer ───────────────────────────────────────────────────────
const ICONS = {
  code: '<rect x="2" y="2" width="20" height="20" rx="6"/><path d="M8 10l-2 2 2 2M16 10l2 2-2 2M13.2 9l-2.4 6"/>',
  wallet: '<path d="M22 11.5V9c0-2.6-1.6-4-4-4H6C3.6 5 2 6.4 2 9v6c0 2.6 1.6 4 4 4h12c2.4 0 4-1.4 4-4v-.5"/><path d="M22 11.5h-3.5a1.75 1.75 0 0 0 0 3.5H22z"/><path d="M6 9.5h5"/>',
  cloud: '<path d="M7 18.5h10.5a4.5 4.5 0 0 0 .6-8.96A6 6 0 0 0 6.6 10.2 4.2 4.2 0 0 0 7 18.5z"/>',
  steps: '<path d="M4 19h5v-5h5V9h5V4"/><path d="M15 4h4v4"/>',
  bolt: '<path d="M13 2L4.5 13.5H12L11 22l8.5-11.5H12z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
};
const icon = (k) => `<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="${OL}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex:none;display:block;">${ICONS[k]}</svg>`;
export const point = (k, t) => `<div style="display:flex;align-items:center;gap:24px;padding:22px 26px;border-radius:20px;background:linear-gradient(160deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015));border:1px solid ${C.rule};">
  ${icon(k)}<div style="font-size:29px;line-height:1.35;color:#fff;font-weight:500;text-wrap:balance;">${t}</div></div>`;

export const points = (list) => `<div style="flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:20px;margin-top:30px;">
  ${list.map(([k, t]) => point(k, t)).join('\n')}
</div>`;

export const cta = (label = 'Talk to Yeedu') => `<div style="display:flex;align-items:center;justify-content:space-between;gap:28px;margin-top:36px;padding-top:30px;border-top:1px solid ${C.rule};">
  ${ctaPill(label)}
  <div style="display:flex;flex-direction:column;gap:6px;font-size:22px;color:${C.text2};font-weight:500;text-align:right;">
    <span>sales@yeedu.com</span><span>yeedu.com</span></div>
</div>`;
