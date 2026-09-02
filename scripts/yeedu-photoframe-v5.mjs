// PREMIUM REALISTIC PHOTO BOOTH FRAMES — Yeedu warm-dark + orange theme
// 4 designs simulating real materials: brass on leather, concrete + copper, dark
// spotlight gallery, and letterpressed editorial paper. NO cartoony elements.
const API = 'http://localhost:3000';
const LOGO = '/uploads/7d95c235-aa75-4cb1-a3c2-e84314ceca33.png';
const W = 1080, H = 1350;

// Yeedu brand palette + premium material accents
const C = {
  warm: '#26221d', warmDeep: '#14110d', warmInk: '#0a0807',
  orange: '#f2600c', orangeLight: '#ff8a3d', orangeSoft: '#ffb076',
  orangeGlow: 'rgba(242,96,12,0.35)',
  cream: '#f7f3ec', creamDeep: '#ecdec5', champagne: '#e8dcc4',
  // brushed copper / brass band stops
  cu1: '#3a2410', cu2: '#5a3a18', cu3: '#8a5a28', cu4: '#b07840', cu5: '#d8985a', cu6: '#f2b676',
};

// Brushed copper gradient (left→right banding) — simulates real brushed metal
const brushedCopper = `linear-gradient(90deg,
  ${C.cu2} 0%, ${C.cu3} 8%, ${C.cu4} 16%, ${C.cu5} 24%, ${C.cu6} 32%,
  ${C.cu5} 40%, ${C.cu4} 50%, ${C.cu3} 60%, ${C.cu4} 68%, ${C.cu5} 76%,
  ${C.cu6} 84%, ${C.cu5} 92%, ${C.cu3} 100%)`;
const brushedCopperFine = `repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px),
  repeating-linear-gradient(90deg, rgba(0,0,0,0.07) 0, rgba(0,0,0,0.07) 2px, transparent 2px, transparent 5px)`;

// ---------- QR mockup ----------
function qrCode(size = 80, seed = 42) {
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

// Premium cutout — thin refined frame with hairline cut indicator and small crop marks
function premiumCut({ x, y, w, h, frameColor, accentColor, captionColor, caption = 'cut to expose subject' }) {
  const cropMark = (cx, cy) => `
    <div style="position:absolute;left:${cx - 9}px;top:${cy - 0.5}px;width:18px;height:1px;background:${accentColor};opacity:0.85;"></div>
    <div style="position:absolute;left:${cx - 0.5}px;top:${cy - 9}px;width:1px;height:18px;background:${accentColor};opacity:0.85;"></div>`;
  return `
    <!-- frame outer hairline -->
    <div style="position:absolute;left:${x - 2}px;top:${y - 2}px;width:${w + 4}px;height:${h + 4}px;border:1.5px solid ${frameColor};box-sizing:border-box;"></div>
    <!-- subtle cut window fill -->
    <div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:rgba(245,236,220,0.06);"></div>
    <!-- hairline dashed cut indicator -->
    <div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border:1px dashed ${accentColor};box-sizing:border-box;opacity:0.55;"></div>
    ${[[x, y], [x + w, y], [x, y + h], [x + w, y + h]].map(([cx, cy]) => cropMark(cx, cy)).join('')}
    <div style="position:absolute;left:${x + 14}px;top:${y + h - 22}px;font-family:'Inter',sans-serif;font-size:9px;font-weight:600;letter-spacing:0.28em;text-transform:uppercase;color:${captionColor};opacity:0.45;">— ${caption}</div>
  `;
}

function canvas(inner, bg) {
  return `<div style="width:${W}px;height:${H}px;position:relative;overflow:hidden;font-family:'Inter',-apple-system,system-ui,sans-serif;">${bg}${inner}</div>`;
}

// =====================================================================
// DESIGN 1 — BRASS PLAQUE ON WARM LEATHER
// =====================================================================
function p1_brassPlaque() {
  const bg = `
    <!-- warm leather base -->
    <div style="position:absolute;inset:0;background:
      radial-gradient(ellipse 80% 60% at 30% 25%,#2e2820 0%,#1d1813 45%,#0e0a07 100%);"></div>
    <!-- subtle leather grain -->
    <div style="position:absolute;inset:0;background:
      repeating-radial-gradient(circle at 25% 30%,rgba(0,0,0,0.05) 0,rgba(0,0,0,0.05) 0.5px,transparent 0.5px,transparent 3px),
      repeating-radial-gradient(circle at 70% 70%,rgba(255,180,120,0.03) 0,rgba(255,180,120,0.03) 0.7px,transparent 0.7px,transparent 5px);"></div>
    <!-- soft warm spotlight -->
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse 60% 45% at 50% 38%,rgba(255,180,120,0.10),transparent 70%);"></div>
    <!-- vignette -->
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse 100% 90% at 50% 50%,transparent 50%,rgba(0,0,0,0.55) 100%);"></div>
  `;

  const CX = 180, CY = 360, CW = 720, CH = 720;

  // Brass plaque slab around cutout — wider on bottom for engraving
  const plateOuter = { x: 90, y: 270, w: 900, h: 990 };
  const plate = `
    <!-- plate cast shadow -->
    <div style="position:absolute;left:${plateOuter.x + 6}px;top:${plateOuter.y + 18}px;width:${plateOuter.w}px;height:${plateOuter.h}px;background:rgba(0,0,0,0.55);filter:blur(22px);border-radius:6px;"></div>
    <!-- plate body (brushed copper) -->
    <div style="position:absolute;left:${plateOuter.x}px;top:${plateOuter.y}px;width:${plateOuter.w}px;height:${plateOuter.h}px;background:${brushedCopper};border-radius:6px;box-shadow:
      inset 0 2px 0 rgba(255,255,255,0.25),
      inset 0 -3px 0 rgba(0,0,0,0.35),
      inset 0 0 80px rgba(0,0,0,0.35),
      0 30px 60px rgba(0,0,0,0.4);"></div>
    <!-- brushing texture overlay -->
    <div style="position:absolute;left:${plateOuter.x}px;top:${plateOuter.y}px;width:${plateOuter.w}px;height:${plateOuter.h}px;background:${brushedCopperFine};border-radius:6px;opacity:0.6;mix-blend-mode:overlay;"></div>
    <!-- inner bezel ring (deeper copper) -->
    <div style="position:absolute;left:${plateOuter.x + 18}px;top:${plateOuter.y + 18}px;width:${plateOuter.w - 36}px;height:${plateOuter.h - 36}px;border:1.5px solid rgba(0,0,0,0.4);border-radius:3px;box-shadow:inset 0 0 0 1px rgba(255,255,255,0.18);"></div>
    <!-- four corner screws -->
    ${[[plateOuter.x + 22, plateOuter.y + 22], [plateOuter.x + plateOuter.w - 22, plateOuter.y + 22], [plateOuter.x + 22, plateOuter.y + plateOuter.h - 22], [plateOuter.x + plateOuter.w - 22, plateOuter.y + plateOuter.h - 22]].map(([sx, sy]) => `
      <div style="position:absolute;left:${sx - 8}px;top:${sy - 8}px;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#f2c896 0%,#a07040 50%,#3a2410 100%);box-shadow:inset 0 -1px 2px rgba(0,0,0,0.6),0 1px 2px rgba(255,255,255,0.2);"></div>
      <div style="position:absolute;left:${sx - 5}px;top:${sy - 0.5}px;width:10px;height:1px;background:#1a0c04;transform:rotate(35deg);"></div>`).join('')}
  `;

  // Headline — engraved into the brass (deboss effect via shadows)
  const debossText = (label, size, weight, color = C.warmInk) => `
    <span style="display:inline-block;color:${color};font-weight:${weight};font-size:${size}px;
      text-shadow:
        0 1px 0 rgba(255,220,170,0.35),
        0 -1px 0 rgba(0,0,0,0.55),
        0 0 2px rgba(0,0,0,0.4);">${label}</span>
  `;

  return canvas(`
    ${plate}

    <!-- top supertitle (small engraved) -->
    <div style="position:absolute;top:300px;left:0;right:0;text-align:center;">
      <div style="font-family:'Inter',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.5em;text-transform:uppercase;color:rgba(20,12,4,0.7);">— established 2026 —</div>
    </div>

    <!-- engraved headline -->
    <div style="position:absolute;top:330px;left:0;right:0;text-align:center;">
      <div style="font-family:'Playfair Display','Bodoni Moda',Georgia,serif;font-style:italic;letter-spacing:-0.01em;line-height:1;">
        ${debossText('Petabyte.', 92, 900, '#1a0c04')}
      </div>
    </div>

    <!-- hairline rule -->
    <div style="position:absolute;top:438px;left:50%;transform:translateX(-50%);width:140px;height:1px;background:rgba(20,12,4,0.5);"></div>

    <!-- cutout window inside plate -->
    ${premiumCut({ x: CX, y: CY, w: CW, h: CH, frameColor: '#1a0c04', accentColor: '#3a2410', captionColor: '#1a0c04', caption: 'subject of the evening' })}

    <!-- bottom engraved spec line -->
    <div style="position:absolute;top:${CY + CH + 30}px;left:0;right:0;text-align:center;">
      <div style="font-family:'Playfair Display',Georgia,serif;font-size:22px;font-style:italic;font-weight:700;color:rgba(20,12,4,0.85);">An evening with Big Data</div>
      <div style="margin-top:8px;font-family:'Inter',sans-serif;font-size:10px;font-weight:700;letter-spacing:0.42em;text-transform:uppercase;color:rgba(20,12,4,0.65);">may · 2026 · #BigDataMeetup</div>
    </div>

    <!-- bottom sponsor strip on leather -->
    <div style="position:absolute;bottom:36px;left:0;right:0;display:flex;justify-content:center;align-items:center;gap:18px;">
      <div style="display:inline-flex;align-items:center;gap:10px;padding:8px 18px;background:rgba(0,0,0,0.35);border:1px solid rgba(242,180,118,0.3);border-radius:2px;">
        <span style="font-family:'Inter',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.34em;text-transform:uppercase;color:${C.orangeSoft};">underwritten by</span>
        <img src="${LOGO}" style="height:18px;filter:drop-shadow(0 0 8px ${C.orangeGlow});"/>
      </div>
      <div style="background:${C.cream};padding:4px;border-radius:2px;">${qrCode(48, 17)}</div>
    </div>
  `, bg);
}

// =====================================================================
// DESIGN 2 — ARCHITECTURAL CONCRETE + COPPER BAND
// =====================================================================
function p2_architectural() {
  const bg = `
    <!-- warm dark base -->
    <div style="position:absolute;inset:0;background:linear-gradient(170deg,${C.warm} 0%,${C.warmDeep} 50%,${C.warmInk} 100%);"></div>
    <!-- concrete mottle -->
    <div style="position:absolute;inset:0;background:
      radial-gradient(ellipse 40% 30% at 22% 18%,rgba(255,200,140,0.07),transparent 60%),
      radial-gradient(ellipse 50% 40% at 80% 65%,rgba(0,0,0,0.35),transparent 60%),
      radial-gradient(ellipse 30% 25% at 60% 35%,rgba(255,200,140,0.04),transparent 60%);"></div>
    <!-- fine grain -->
    <div style="position:absolute;inset:0;background:
      repeating-radial-gradient(circle at 30% 40%,rgba(255,180,120,0.025) 0,rgba(255,180,120,0.025) 0.5px,transparent 0.5px,transparent 4px),
      repeating-radial-gradient(circle at 70% 80%,rgba(0,0,0,0.06) 0,rgba(0,0,0,0.06) 0.7px,transparent 0.7px,transparent 6px);"></div>
    <!-- vignette -->
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse 100% 90% at 50% 50%,transparent 55%,rgba(0,0,0,0.6) 100%);"></div>
  `;

  const CX = 132, CY = 396, CW = 720, CH = 720;

  // Single architectural orange band running horizontally
  const orangeBand = `
    <div style="position:absolute;left:0;right:0;top:296px;height:4px;background:${C.orange};box-shadow:0 0 24px ${C.orangeGlow},0 4px 0 rgba(0,0,0,0.4);"></div>
    <div style="position:absolute;left:0;right:0;top:302px;height:1px;background:rgba(242,96,12,0.4);"></div>
  `;

  // Right-side brushed copper spec plate (vertical, narrow)
  const specPlate = `
    <div style="position:absolute;right:60px;top:${CY}px;width:140px;height:${CH}px;background:${brushedCopper};box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.2),
      inset 0 -2px 0 rgba(0,0,0,0.4),
      0 8px 24px rgba(0,0,0,0.5);overflow:hidden;">
      <div style="position:absolute;inset:0;background:${brushedCopperFine};opacity:0.55;mix-blend-mode:overlay;"></div>
      <div style="position:absolute;inset:14px 12px;border:1px solid rgba(20,12,4,0.4);box-sizing:border-box;"></div>
      <!-- vertical engraved data -->
      <div style="position:absolute;top:30px;left:0;right:0;text-align:center;">
        <div style="font-family:'Inter',sans-serif;font-size:9px;font-weight:800;letter-spacing:0.32em;text-transform:uppercase;color:#1a0c04;">spec sheet</div>
      </div>
      <div style="position:absolute;top:74px;left:0;right:0;text-align:center;display:flex;flex-direction:column;gap:30px;">
        ${[
          ['volume', '3 TB'],
          ['runtime', '40 min'],
          ['queries', '99 / 99'],
          ['cost', '$2.33'],
          ['drama', '0'],
        ].map(([k, v]) => `
          <div>
            <div style="font-family:'Inter',sans-serif;font-size:8px;font-weight:700;letter-spacing:0.34em;text-transform:uppercase;color:rgba(20,12,4,0.7);">${k}</div>
            <div style="margin-top:4px;font-family:'Playfair Display',Georgia,serif;font-size:24px;font-style:italic;font-weight:900;color:#1a0c04;line-height:1;text-shadow:0 1px 0 rgba(255,220,170,0.35),0 -1px 0 rgba(0,0,0,0.4);">${v}</div>
          </div>`).join('')}
      </div>
    </div>
  `;

  return canvas(`
    ${orangeBand}

    <!-- top kicker -->
    <div style="position:absolute;top:80px;left:60px;">
      <div style="font-family:'Inter',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.42em;text-transform:uppercase;color:${C.orangeLight};">— big data, on the record</div>
    </div>
    <!-- headline -->
    <div style="position:absolute;top:118px;left:60px;right:60px;">
      <div style="font-family:'Inter','Helvetica Neue',sans-serif;font-size:124px;font-weight:900;letter-spacing:-0.04em;line-height:0.88;color:${C.cream};">Petabyte</div>
      <div style="font-family:'Playfair Display',Georgia,serif;font-size:62px;font-style:italic;font-weight:600;letter-spacing:-0.01em;color:${C.orangeLight};margin-top:-6px;">at scale.</div>
    </div>

    ${specPlate}

    <!-- cutout (copper hairline frame) -->
    ${premiumCut({ x: CX, y: CY, w: CW, h: CH, frameColor: C.cu4, accentColor: C.cu5, captionColor: C.cream, caption: 'subject — pose center' })}

    <!-- bottom rule + meta -->
    <div style="position:absolute;bottom:124px;left:60px;right:60px;height:1px;background:rgba(255,255,255,0.15);"></div>
    <div style="position:absolute;bottom:60px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:flex-end;">
      <div>
        <div style="font-family:'Playfair Display',Georgia,serif;font-size:26px;font-weight:700;font-style:italic;color:${C.cream};line-height:1;">Big Data Meetup</div>
        <div style="margin-top:6px;font-family:'Inter',sans-serif;font-size:10px;font-weight:700;letter-spacing:0.32em;text-transform:uppercase;color:rgba(247,243,236,0.55);">may · 2026 · #BigDataMeetup</div>
      </div>
      <div style="display:flex;align-items:center;gap:14px;">
        <div style="text-align:right;">
          <div style="font-family:'Inter',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.34em;text-transform:uppercase;color:rgba(247,243,236,0.5);">underwritten by</div>
          <img src="${LOGO}" style="height:22px;margin-top:6px;filter:drop-shadow(0 0 10px ${C.orangeGlow});"/>
        </div>
        <div style="background:${C.cream};padding:4px;">${qrCode(56, 31)}</div>
      </div>
    </div>
  `, bg);
}

// =====================================================================
// DESIGN 3 — GALLERY SPOTLIGHT (warm dark wall + foil-stamped title)
// =====================================================================
function p3_gallerySpot() {
  const bg = `
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,${C.warmInk} 0%,${C.warmDeep} 50%,${C.warm} 100%);"></div>
    <!-- top spotlight cone -->
    <div style="position:absolute;inset:0;background:
      radial-gradient(ellipse 55% 40% at 50% 28%,rgba(255,200,140,0.22),transparent 60%),
      radial-gradient(ellipse 70% 50% at 50% 65%,rgba(255,180,120,0.06),transparent 70%);"></div>
    <!-- wall texture -->
    <div style="position:absolute;inset:0;background:
      repeating-radial-gradient(circle at 28% 35%,rgba(255,180,120,0.018) 0,rgba(255,180,120,0.018) 0.6px,transparent 0.6px,transparent 5px),
      repeating-radial-gradient(circle at 72% 78%,rgba(0,0,0,0.06) 0,rgba(0,0,0,0.06) 0.5px,transparent 0.5px,transparent 4px);"></div>
    <!-- vignette deep -->
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse 80% 75% at 50% 45%,transparent 45%,rgba(0,0,0,0.65) 100%);"></div>
  `;

  const CX = 160, CY = 410, CW = 760, CH = 700;

  // Foil-stamped title via gradient-clipped text
  const foilTitle = `
    <div style="position:absolute;top:130px;left:0;right:0;text-align:center;">
      <div style="font-family:'Inter',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.5em;text-transform:uppercase;color:${C.orangeSoft};opacity:0.8;">— now showing —</div>
      <div style="margin-top:14px;display:inline-block;font-family:'Playfair Display','Bodoni Moda',Georgia,serif;font-size:148px;font-style:italic;font-weight:900;letter-spacing:-0.025em;line-height:0.9;
        background:linear-gradient(180deg,#f2c896 0%,${C.orangeLight} 25%,${C.orange} 50%,#a04806 80%,${C.orangeLight} 100%);
        -webkit-background-clip:text;background-clip:text;color:transparent;
        text-shadow:0 2px 4px rgba(0,0,0,0.35);
        filter:drop-shadow(0 6px 24px rgba(242,96,12,0.35));">Petabyte.</div>
      <div style="margin-top:12px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.38em;text-transform:uppercase;color:rgba(247,243,236,0.55);">a portrait series · 2026</div>
    </div>
  `;

  // Hairline rules above & below cutout
  const rules = `
    <div style="position:absolute;left:160px;right:160px;top:${CY - 28}px;height:1px;background:linear-gradient(90deg,transparent 0%,${C.orangeLight} 50%,transparent 100%);opacity:0.6;"></div>
    <div style="position:absolute;left:160px;right:160px;top:${CY + CH + 28}px;height:1px;background:linear-gradient(90deg,transparent 0%,${C.orangeLight} 50%,transparent 100%);opacity:0.6;"></div>
  `;

  return canvas(`
    ${foilTitle}
    ${rules}

    <!-- subtle floor shadow under cutout -->
    <div style="position:absolute;left:${CX + 60}px;right:${W - CX - CW + 60}px;top:${CY + CH + 4}px;height:40px;background:radial-gradient(ellipse 60% 80% at 50% 0%,rgba(0,0,0,0.5),transparent 70%);filter:blur(4px);"></div>

    <!-- cutout — thin copper frame, dark wall behind -->
    ${premiumCut({ x: CX, y: CY, w: CW, h: CH, frameColor: C.cu5, accentColor: C.cu6, captionColor: C.cream, caption: 'fig. 01 — portrait' })}

    <!-- caption plaque under cutout (like a real gallery plaque) -->
    <div style="position:absolute;top:${CY + CH + 60}px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:16px;padding:10px 22px;background:linear-gradient(180deg,${C.cu4} 0%,${C.cu3} 100%);border:1px solid rgba(0,0,0,0.4);box-shadow:inset 0 1px 0 rgba(255,220,170,0.3),0 6px 18px rgba(0,0,0,0.5);">
      <div style="font-family:'Playfair Display',Georgia,serif;font-size:18px;font-style:italic;font-weight:700;color:#1a0c04;text-shadow:0 1px 0 rgba(255,220,170,0.35),0 -1px 0 rgba(0,0,0,0.4);">"untitled"</div>
      <div style="width:1px;height:18px;background:rgba(20,12,4,0.5);"></div>
      <div style="font-family:'Inter',sans-serif;font-size:9px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:rgba(20,12,4,0.85);">you · 2026 · digital</div>
    </div>

    <!-- bottom credit -->
    <div style="position:absolute;bottom:50px;left:0;right:0;text-align:center;">
      <div style="font-family:'Inter',sans-serif;font-size:10px;font-weight:700;letter-spacing:0.42em;text-transform:uppercase;color:rgba(247,243,236,0.55);">big data meetup · may 2026 · #BigDataMeetup</div>
      <div style="margin-top:14px;display:inline-flex;align-items:center;gap:14px;padding:8px 20px;border:1px solid rgba(242,180,118,0.25);">
        <span style="font-family:'Inter',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.34em;text-transform:uppercase;color:${C.orangeSoft};">curated by</span>
        <img src="${LOGO}" style="height:18px;filter:drop-shadow(0 0 8px ${C.orangeGlow});"/>
        <div style="width:1px;height:16px;background:rgba(242,180,118,0.3);"></div>
        <div style="background:${C.cream};padding:3px;">${qrCode(40, 53)}</div>
      </div>
    </div>
  `, bg);
}

// =====================================================================
// DESIGN 4 — LETTERPRESS EDITORIAL (warm champagne paper, deep ink, copper foil)
// =====================================================================
function p4_letterpress() {
  const bg = `
    <!-- champagne paper base -->
    <div style="position:absolute;inset:0;background:linear-gradient(165deg,#f5e9d2 0%,#eddcb9 50%,#e4cf9e 100%);"></div>
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse 70% 50% at 50% 32%,rgba(255,255,255,0.45),transparent 70%);"></div>
    <!-- subtle paper grain (dual radial repeat) -->
    <div style="position:absolute;inset:0;background:
      repeating-radial-gradient(circle at 22% 28%,rgba(60,40,15,0.045) 0,rgba(60,40,15,0.045) 0.6px,transparent 0.6px,transparent 3px),
      repeating-radial-gradient(circle at 72% 78%,rgba(60,40,15,0.035) 0,rgba(60,40,15,0.035) 0.7px,transparent 0.7px,transparent 5px),
      repeating-linear-gradient(45deg,rgba(60,40,15,0.018) 0,rgba(60,40,15,0.018) 1px,transparent 1px,transparent 3px);"></div>
    <!-- edges darker -->
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse 110% 90% at 50% 50%,transparent 55%,rgba(80,50,15,0.18) 100%);"></div>
  `;

  const CX = 168, CY = 410, CW = 744, CH = 700;
  const ink = '#1a120a';

  // Letterpress impressed text — uses dark fill + subtle inset shadow
  const pressed = (text, size, weight = 900, family = "'Playfair Display','Bodoni Moda',Georgia,serif", italic = true) => `
    <span style="display:inline-block;font-family:${family};font-style:${italic ? 'italic' : 'normal'};font-weight:${weight};font-size:${size}px;color:${ink};letter-spacing:-0.015em;line-height:1;
      text-shadow:0 1px 0 rgba(255,245,225,0.6),inset 0 1px 0 rgba(0,0,0,0.2);">${text}</span>
  `;

  // Copper foil flourish (small ornamental rule)
  const foilRule = (w = 120) => `
    <svg width="${w + 40}" height="14" viewBox="0 0 ${w + 40} 14" style="display:inline-block;vertical-align:middle;">
      <defs>
        <linearGradient id="foil-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f2c896"/>
          <stop offset="40%" stop-color="${C.orangeLight}"/>
          <stop offset="70%" stop-color="${C.orange}"/>
          <stop offset="100%" stop-color="#9c4806"/>
        </linearGradient>
      </defs>
      <circle cx="6" cy="7" r="3" fill="url(#foil-g)"/>
      <rect x="14" y="6" width="${w}" height="2" fill="url(#foil-g)"/>
      <circle cx="${w + 22}" cy="7" r="3" fill="url(#foil-g)"/>
      <rect x="${w + 30}" y="6" width="8" height="2" fill="url(#foil-g)"/>
    </svg>
  `;

  return canvas(`
    <!-- top printed border -->
    <div style="position:absolute;top:54px;left:60px;right:60px;height:1.5px;background:${ink};opacity:0.85;"></div>
    <div style="position:absolute;top:60px;left:60px;right:60px;height:0.5px;background:${ink};opacity:0.55;"></div>

    <!-- top kicker -->
    <div style="position:absolute;top:96px;left:0;right:0;text-align:center;">
      <div style="font-family:'Inter',sans-serif;font-size:10px;font-weight:700;letter-spacing:0.55em;text-transform:uppercase;color:${ink};opacity:0.75;">est. mmxxvi</div>
    </div>

    <!-- copper foil ornament -->
    <div style="position:absolute;top:130px;left:0;right:0;text-align:center;">${foilRule(120)}</div>

    <!-- letterpress hero -->
    <div style="position:absolute;top:166px;left:0;right:0;text-align:center;">${pressed('Petabyte.', 124, 900)}</div>

    <!-- engraved sub -->
    <div style="position:absolute;top:312px;left:0;right:0;text-align:center;">
      <div style="font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.42em;text-transform:uppercase;color:${ink};opacity:0.7;">an evening with big data</div>
    </div>

    <!-- cutout (deep ink hairline + small crops) -->
    ${premiumCut({ x: CX, y: CY, w: CW, h: CH, frameColor: ink, accentColor: '#5a3a18', captionColor: ink, caption: 'guest of honour' })}

    <!-- bottom ornament -->
    <div style="position:absolute;top:${CY + CH + 30}px;left:0;right:0;text-align:center;">${foilRule(90)}</div>

    <!-- ribbon copper foil callout -->
    <div style="position:absolute;top:${CY + CH + 56}px;left:0;right:0;text-align:center;">
      <div style="font-family:'Playfair Display',Georgia,serif;font-size:24px;font-style:italic;font-weight:700;color:${ink};">— the guest of honour —</div>
    </div>

    <!-- bottom triple-rule print -->
    <div style="position:absolute;bottom:130px;left:60px;right:60px;height:1.5px;background:${ink};opacity:0.85;"></div>
    <div style="position:absolute;bottom:124px;left:60px;right:60px;height:0.5px;background:${ink};opacity:0.55;"></div>

    <!-- bottom dateline + sponsor + QR -->
    <div style="position:absolute;bottom:48px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:flex-end;color:${ink};">
      <div>
        <div style="font-family:'Playfair Display',Georgia,serif;font-size:20px;font-style:italic;font-weight:700;line-height:1;">May · 2026</div>
        <div style="margin-top:4px;font-family:'Inter',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.34em;text-transform:uppercase;opacity:0.65;">big data meetup · #BigDataMeetup</div>
      </div>
      <div style="text-align:center;">
        ${foilRule(40)}
        <div style="margin-top:2px;font-family:'Inter',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.34em;text-transform:uppercase;opacity:0.55;">no. 001</div>
      </div>
      <div style="display:flex;align-items:center;gap:14px;">
        <div style="text-align:right;">
          <div style="font-family:'Inter',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.34em;text-transform:uppercase;opacity:0.7;">presented by</div>
          <img src="${LOGO}" style="height:18px;margin-top:4px;"/>
        </div>
        <div style="background:#ffffff;padding:4px;border:1px solid ${ink};">${qrCode(48, 91)}</div>
      </div>
    </div>
  `, bg);
}

// ============ Build ============
async function build() {
  const create = await fetch(`${API}/api/carousels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Big Data Photo Booth — v5 (realistic, Yeedu theme)', aspectRatio: '4:5' }),
  });
  if (!create.ok) throw new Error(`Create failed: ${create.status} ${await create.text()}`);
  const { id } = await create.json();
  console.log('Carousel:', id);

  const slides = [
    { name: 'Brass Plaque on Leather', html: p1_brassPlaque() },
    { name: 'Architectural Concrete + Copper', html: p2_architectural() },
    { name: 'Gallery Spotlight (foil-stamped)', html: p3_gallerySpot() },
    { name: 'Letterpress Editorial', html: p4_letterpress() },
  ];
  for (const s of slides) {
    const r = await fetch(`${API}/api/carousels/${id}/slides`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: s.html, notes: s.name }),
    });
    if (!r.ok) throw new Error(`Slide failed: ${s.name} — ${r.status} ${await r.text()}`);
    console.log('Added:', s.name);
  }
  console.log(`\nView: ${API}/?carousel=${id}`);
}
build().catch(e => { console.error(e); process.exit(1); });
