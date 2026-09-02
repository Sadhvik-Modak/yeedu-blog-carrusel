---
name: yeedu-carousel-designer
description: Designs print-ready Yeedu marketing carousels (1:1, 4:5, 9:16) for the Open Carrusel app — locks Yeedu brand tokens, the infographic-first design mandate, and the API workflow so every output is on-brand and visually bespoke without re-discovery.
risk: safe
source: project
date_added: "2026-05-19"
---

# Yeedu Carousel Designer

Encodes the locked Yeedu brand shell, the infographic design mandate, and the build workflow for
producing premium Yeedu carousels through the Open Carrusel app. Invoke for any Yeedu carousel,
banner, social slide, or print poster.

**The chrome is 100% shared. The middle of every slide is 0% shared.** That ratio is the whole
design system. Everything below is organized around it.

---

## PART 1 — THE DESIGN MANDATE (read this before drawing anything)

### The one rule

> **Never place an icon where a diagram belongs.**
>
> Before you draw, write the sentence the picture must assert. Then draw a picture that would
> still assert it with all the text removed. If you can't, you don't understand the idea yet —
> go back to the source material, not to the icon library.

Text is what people read. Diagrams are what people *look* at, and on a social carousel most
viewers only look. A slide whose visual is a 24×24 glyph in a card has spent 60% of its frame
saying nothing.

### The test every slide must pass

**Cover the headline and the body copy with your hand. Does the remaining picture still make a
claim?**

- ✅ Two rectangles where one is 4× the area of the other → *"this is four times that."*
- ✅ A comb of 40 hairlines funneling into 3 thick ones → *"many became few."*
- ✅ A branch line drawn `stroke-dasharray="1 8"` next to solid ones → *"this one doesn't exist."*
- ❌ A cloud icon in a card titled "Cloud costs" → asserts nothing. The card is a caption with
  decoration, not an infographic.

### Where the data goes

The numbers from the source material must live in **visual dimensions**, not just in `<text>`:

| Data | Visual dimension |
|---|---|
| A ratio (4×, 85%, 10:1) | **area** of nested/adjacent rects, or bar length |
| A count (58,176 files → 3 files) | **number of drawn marks** — actually draw many vs. few |
| Growth against a limit | a **curve** rising toward a horizontal **rule** |
| "Worse" / "better" | **vertical offset** of otherwise identical shapes |
| Real vs. hypothetical | **solid vs. dashed** stroke |
| Mechanism vs. conclusion | **opacity** — dim the mechanism, brighten the claim |

If the claim genuinely has no shape — three numbers sharing no unit, or a categorical yes/no
matrix — use the **stat ladder** (archetype 3) or the **comparison matrix** (archetype 7). Those
are the only two legitimate escapes from drawing, and both still encode the point structurally.

### No template flow

There is **no standard slide sequence**, and there must be **no shared `RENDERERS` map reused
across topics**. A `{cover, pain, heroStat, cta}` dispatch table is exactly the failure mode this
skill exists to prevent — it produced two unrelated decks that were byte-identical in the middle.

Instead: read the source, list the 4–5 claims worth making, and give **each claim its own render
function named after that claim** (`renderWalGrowth`, `renderDeleteFileStack`) drawn to that
slide's actual numbers. Two slides in a deck never share a drawing. Two decks never share a
drawing at all.

**Cover and closer are slides too** — they get bespoke visuals, not a stock ring schematic. The
strongest decks establish a visual vocabulary on the cover and **invert or complete it on the
closer** (archetype 8), so five slides read as one argument.

### Slide composition

Diagram-led. Roughly:

- **~15%** eyebrow chip + headline — *one tight line*, optically fitted at **44–62px**. Not 88px,
  not two lines with a `<br/>`. The headline names the claim; the picture proves it.
- **~60–70%** the infographic well.
- **~15%** a caption (one or two short lines) + the footer band.

**Use flow layout, never absolute coordinates for content.** The stage is `position:relative` and
its background layers are absolute; the content column is a flex column with the infographic well
at `flex:1` and the footer at `margin-top:auto`. The diagram then takes whatever space the copy
leaves, which is why headlines can be optically fitted per slide without breaking anything.

See `references/infographics.md` for the archetype catalogue, the SVG craft rules, and the
idea-shape → archetype mapping table. **Read it before building.**

---

## PART 2 — WHAT YEEDU IS (get this right; it shapes every claim)

Yeedu is a **high-performance Apache Spark engine**. It runs your existing Spark workloads faster
and cheaper with **zero code rewrites**. It is *not* a lakehouse, *not* a catalog, *not* an
observability product, *not* a generic "data platform" — describing it that way is a factual
error, not a simplification.

**Problems it solves**: cloud bill shock from oversized/idle clusters · developer friction and
slow iteration · vendor lock-in on Databricks / EMR / Dataproc / Cloudera.

**Capabilities**: Turbo Engine (C++, SIMD vectorization) · Smart Scheduling (I/O-aware) · Job
Multiplexing (dense packing on shared nodes) · Yeedu AI Assistant (IDE-inline) · no-code migration
utility · multi-cloud and multi-catalog.

**Ecosystem**: migrates from Databricks, AWS EMR, Dataproc, Cloudera · runs on AWS, Azure, GCP,
Kubernetes, on-prem · catalogs: Hive Metastore, Unity Catalog, Iceberg, Delta Lake, Glue ·
languages: PySpark, Scala, Java, Python 3+.

**Voice**: senior B2B marketer. Technical credibility married to business framing. Declarative,
restrained, contrast-driven — the sentence structure is usually *"the thing you accept" → "what
it actually costs."* Hard numbers over adjectives. Italics for the one emotional beat per deck.

**Audience**: data engineers, data architects, CTOs, CFOs at mid-to-large enterprises already
running Spark at cost.

### Fact sheet — the only Yeedu numbers to cite

| Metric | Number | Context |
|---|---|---|
| Pipeline speedup | 4–10× | C++ Turbo Engine, SIMD vectorization |
| I/O speedup | 2–4× | Smart Scheduling |
| Cloud cost reduction | 60–80% | vs. traditional Spark platforms |
| Confirmed customer saving | 65% annual | Top-5 pharma director |
| TPC-DS cost | $0.53/TB | 99-query suite, 1/3/10TB, Graviton4 |
| Failures on benchmark | 0 | across 297 runs (99 queries × 3 sizes) |
| Code rewrites required | 0 | drop-in for PySpark/Scala/Python |
| Pricing floor | $2,000/month | tiered usage model |
| Benchmark dataset | 1.5B rows | real production data |

**Never invent a Yeedu stat.** Numbers about a *topic* (Iceberg, CDC, observability) come from the
source blog post and should be cited as belonging to that topic, not to Yeedu.

Founder: Milind Chitgupakar (CEO). Advisor: Dr. Mark Ramsey, ex-CDO GSK & Samsung Mobile.

---

## PART 3 — THE BRAND SHELL (LOCKED — never deviate)

### Tokens

```js
const C = {
  orange:      '#f2600c',  // primary signature
  orangeLight: '#ff8a3d',  // gradients, accents
  orangeGlow:  'rgba(242,96,12,0.35)',
  orangeDim:   'rgba(242,96,12,0.18)',
  brown:       '#26221d',  // warm dark base
  brownDeep:   '#14110d',  // bottom of gradient
  text:        '#ffffff',
  text2:       'rgba(255,255,255,0.72)',
  text3:       'rgba(255,255,255,0.42)',
  rule:        'rgba(255,255,255,0.08)',
  ruleWarm:    'rgba(242,140,90,0.15)',
};
```

**Fonts**: Montserrat (headings — 300/600/700/800) + Inter (body — 400/500/600). Headings use
letter-spacing -1.5 to -3px and 0.95–1.02 line-height.

**Logo**: `/uploads/7d95c235-aa75-4cb1-a3c2-e84314ceca33.png` — top-left on cover and closer, plus
a 28–34px mark in the footer band of every slide.

### The stage (every slide)

Five layered background passes, in order:

1. **Base gradient** — `linear-gradient(160deg, #26221d 0%, #14110d 50%, #0a0807 100%)`
2. **Ambient glows** — 2–3 radial orange/amber ellipses, variant A/B/C/D per slide for rhythm
3. **Dot grid** — `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)` at `32px 32px`
4. **Corner arcs** — dashed concentric arcs top-right + solid rings bottom-left, 12–18% opacity
5. **Vignette** — `radial-gradient(ellipse 90% 90% at 50% 50%, transparent 60%, rgba(0,0,0,0.45) 100%)`

Full CSS in `references/stage.md`.

| Glow variant | Use for |
|---|---|
| A | cover, hero |
| B | mid-deck |
| C | cost / value |
| D | wide architecture diagrams |

**Footer band on every slide**: 80px from edges, logo 28–34px left, `yeedu.io` right at
`rgba(255,255,255,0.42)`.

### Eyebrow chip

```html
<div style="display:inline-flex;align-items:center;gap:10px;padding:8px 16px;
  background:rgba(242,96,12,0.18);border:1px solid rgba(242,140,90,0.15);
  border-radius:999px;font-size:16px;font-weight:600;color:#ff8a3d;
  letter-spacing:1.5px;text-transform:uppercase;">
  <span style="display:inline-block;width:6px;height:6px;border-radius:50%;
    background:#f2600c;box-shadow:0 0 10px #f2600c;"></span>
  EYEBROW TEXT
</div>
```

### Headline

One line, Montserrat 800 white, optically fitted 44–62px. Where a two-part headline genuinely
helps, the second part is Montserrat 300 italic with a white→orange-light gradient via
`-webkit-background-clip:text` — but prefer one line and let the diagram carry the rest.

### Card / well

```css
background: linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015));
border: 1px solid rgba(255,255,255,0.08);
border-radius: 24px;
backdrop-filter: blur(8px);
padding: 30–36px;
/* border-left: 4px solid #f2600c for emphasis */
```

An infographic normally sits in one of these. A full-bleed diagram with no card is also correct
when the drawing is the whole slide.

### Ratios

| Ratio | Pixels | Use | Headline | Slides |
|---|---|---|---|---|
| 1:1 | 1080×1080 | IG square, LinkedIn | 44–54px | 4–5 |
| 4:5 | 1080×1350 | IG portrait (**default**) | 48–62px | 5 |
| 9:16 | 1080×1920 | story, roll-up banner | 56–72px | 5 |

Reflow, don't re-content: 1:1 tightens vertical and shrinks the diagram ~80%; 4:5 is the reference
layout; 9:16 gains breathing room and a taller diagram well. Build all three only when the user
asks for all three — a single 4:5 deck is the common request.

---

## PART 4 — HARD RULES

1. **Never use emojis** as content icons.
2. **Never use light/white backgrounds.** The stage is always warm dark. (A small white card
   behind a QR code is the one exception.)
3. **Never invent Yeedu stats.** Topic stats come from the source material.
4. **Never skip the footer band** (logo + `yeedu.io`).
5. **Every closer includes**: orange pill CTA, `sales@yeedu.io`, and a QR when a URL is given.
6. **Never reuse a drawing** across slides or across decks. Chrome is shared; drawings are not.
7. **Never let an icon stand in for a diagram.** See Part 1.
8. **For print banners**, confirm the export ran at `deviceScaleFactor: 4`.
9. **Never hand back a deck you have not looked at.** Every run ends in
   `output/<carousel-name>/1.jpg …` and every one of those files gets opened.

---

## PART 5 — BUILD WORKFLOW (Open Carrusel app at `http://localhost:3000`)

```javascript
// 1. Create
POST /api/carousels            { name, aspectRatio: '1:1' | '4:5' | '9:16' }  // → { id }
// 2. Add slides (max 10)
POST /api/carousels/{id}/slides { html, notes }
// 3. Update
PUT  /api/carousels/{id}/slides/{slideId} { html, notes }
// 4. Export — writes output/<name-slugified>/1.jpg … at 4× density, returns { dir, files, count }
POST /api/carousels/{id}/export
// 5. Remove a superseded deck — rebuild, don't accumulate
DELETE /api/carousels/{id}
```

**Slide HTML rules**: body-level only (no `<html>`/`<head>`/`<!DOCTYPE>`), no `<script>` (iframe
sandbox blocks JS), outer container must be
`width:{W}px;height:{H}px;position:relative;overflow:hidden`, logo referenced as
`/uploads/7d95c235-...png`, Google Font family names only, inline `<svg>` is fine (SVG *upload* is
blocked).

### The chrome module — don't rewrite it

`assets/yeedu-chrome.mjs` ships with this skill. Copy it to `scripts/yeedu-chrome.mjs` and
`import` from it. It is the *entire* shared surface, and it deliberately contains **no drawing
code at all** — that emptiness is the point.

| Export | Does |
|---|---|
| `C`, `R`, `BASE`, `LOGO`, `cardBg` | tokens, 1080×1350 dims, padding |
| `stage(inner, variant)` | the 5-layer background + flex content column + footer band |
| `logoMark(h)` | cover/closer logo — wrapped in a div, or flex stretches the `<img>` |
| `eyebrow(text)` | the pill chip |
| `headline(text, size)` | one optically-fitted line |
| `em(text)` | italic white→orange gradient fragment, for use inside a headline |
| `caption(text)` | the one or two lines under the diagram |
| `well(inner, {card, pad})` | `flex:1` infographic well — the diagram takes what the copy leaves |
| `svg(vbW, vbH, body, renderW)` | enforces the ~200-unit viewBox at 2.4–2.6× upscale |
| `annot(x, y, {label, value, note})` | the in-SVG 3-size annotation stack |
| `makeQr(url, size)` | dark-module QR on a white card, viewBox read off the generated SVG |
| `ctaPill(text)` | the orange gradient pill |
| `buildCarousel(name, slides, ratio)` | creates + posts every slide, returns the id |
| `deleteCarousel(id)` | removes the superseded deck |
| `exportDeck(id)` | calls the export endpoint, logs where the app wrote the JPGs |

**Script shape** — `scripts/yeedu-<topic>.mjs`:

1. `import` the chrome. Add nothing to it.
2. One render function **per slide**, named for its claim (`drawWalCeiling`,
   `drawDeleteAmplification`), holding that slide's own SVG and that slide's own numbers.
3. A `slides` array composing chrome + drawing. `notes` names the claim and the archetype —
   never `"pain slide"`.
4. `const id = await buildCarousel(NAME, slides); await exportDeck(id);`
5. Keep `OLD_ID` at the top and `deleteCarousel(OLD_ID)` before building — **replace the deck,
   don't accumulate versions.** Update `OLD_ID` to the new id after each run.

Two complete worked decks are in `examples/` — `cdc-deck.mjs` and `observability-deck.mjs`. They
share 100% of their chrome and **0% of their ten drawings**. Read one before writing a new deck.

### Output layout (required)

Every deck lands as JPGs, one directory per carousel, numbered from 1:

```
output/<carousel-name-slugified>/1.jpg
output/<carousel-name-slugified>/2.jpg
…
```

**The app owns this**, not the script. `src/lib/export-output.ts` slugifies the carousel name,
**wipes the directory first** (so a rebuilt deck never leaves a stale trailing slide behind), and
writes the numbered files; `src/lib/export-slides.ts` encodes them at quality 92 with 4:4:4 chroma
(no subsampling, so the orange stays crisp). `exportDeck()` is just the call plus a log line —
don't reimplement any of the above in a deck script.

### QR codes (closer)

```js
import QRCode from 'qrcode';
const qrSvg = await QRCode.toString(url, {
  type: 'svg', margin: 0,
  color: { dark: '#14110d', light: '#00000000' },   // DARK modules — see below
});
const vb = qrSvg.match(/viewBox="([^"]+)"/)[1];      // module count varies with URL length
```

⚠️ Two bugs that render a **blank but error-free** QR:
- `dark: '#ffffff'` on the white QR card → white-on-white, invisible. Use `#14110d`.
- Hardcoding `viewBox="0 0 29 29"` → wrong for most URLs. Always read the viewBox off the
  generated SVG string.

### Export gotchas

- **Exports are slow — budget minutes, not seconds.** Each slide renders at 1080×1350 ×
  `deviceScaleFactor 4` = 4320×5400. A five-slide deck runs several minutes; run it in the
  background rather than under a short timeout.
- **The endpoint serializes exports itself** (a process-wide mutex in `src/lib/export-slides.ts`),
  so overlapping requests queue instead of crashing the shared browser with
  `Protocol error (Page.captureScreenshot): Target closed`. Two more settings make long captures
  survivable and must stay: `protocolTimeout: 600_000` on `puppeteer.launch()` (the 180s default
  kills a 4320×5400 `Page.captureScreenshot` outright) and `maxDuration = 600` on the route.
- **Call the endpoint over `node:http`, not `fetch`.** Node's `fetch` has a 300s headers timeout
  that a 4× export exceeds, surfacing as an opaque `UND_ERR_HEADERS_TIMEOUT`.
- **Fonts reach the export only if `extractFontFamilies()` matches.** That helper in
  `src/lib/slide-html.ts` parses `font-family` out of the slide HTML and drives the base64
  `@font-face` inlining. A regex that misses the codebase's own `font-family:'Inter',sans-serif`
  style fails *silently* — every slide renders in a serif fallback and nothing errors. If
  headings come back looking like Times, check that function first.

### Verification — mandatory, not optional

A script that runs clean can still produce an unreadable slide. Always:

1. Run the deck, then **open `output/<name>/*.jpg` and look at every slide.** Downscale to
   ~520px first; defects that matter are visible at thumbnail size.
2. Per slide check: **cover the text — does the picture still make the claim?** · legible at
   thumbnail size · nothing overflows the frame · footer band present · no emoji · QR modules
   visibly dark · logo not stretched · headings in Montserrat, not a serif fallback · no two
   slides sharing a drawing.
3. **Read every `<text>` in the drawing.** `svg()` sets `overflow:visible`, so a label that runs
   past the 200-unit viewBox renders happily and is then sliced off by the card — silently. Two
   label bugs to look for specifically, both shipped in the first cut of these decks:
   - **Run-off**: a left-anchored label near the right edge. `annot()`'s `note` line is the usual
     culprit — it is the widest of the three. Anchor it at `x=10` across the full width, or set
     `anchor:'end'`.
   - **Collision**: two labels placed by separate coordinates that turn out to overlap
     (`2 GBOMPACTION`, `TCEBMESRGA V3 DAELLTYNEED`). Uppercase Inter at `font-size:6` with
     letter-spacing runs ≈4.6 units per character — estimate the width before trusting an `x`,
     and remember a sloping data line will cut through a label placed too close to it.

The blank-QR bug, a full-frame-stretched logo, and a whole app's worth of missing fonts each
shipped precisely because nobody opened the images.

---

## Companion skills

- **`iconsax-library`** — icons for genuinely iconic uses (a logo mark, a platform badge). One
  style per deck. Never as a substitute for a diagram.
- **`claude-d3js-skill`** — when a chart needs real axes and scales.

## File references

- `references/infographics.md` — **the archetype catalogue, SVG craft rules, and idea→archetype
  mapping. Read before building.**
- `references/stage.md` — full background CSS for all four glow variants.
- `assets/yeedu-chrome.mjs` — the shared chrome module. Copy to `scripts/`, import, don't extend.
- `examples/cdc-deck.mjs`, `examples/observability-deck.mjs` — two complete decks, 100% shared
  chrome and 0% shared drawings. The reference standard.
