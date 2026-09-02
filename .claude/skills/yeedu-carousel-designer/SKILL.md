---
name: yeedu-carousel-designer
description: Designs print-ready Yeedu marketing carousels (1:1, 4:5, 9:16) for the Open Carrusel app — locks Yeedu brand tokens, infographic patterns, and the API workflow so every output is on-brand without re-discovery.
risk: safe
source: project
date_added: "2026-05-19"
---

# Yeedu Carousel Designer

This skill encodes the locked design system, content patterns, and build workflow for producing premium Yeedu marketing carousels through the Open Carrusel app. Invoke when the user asks for any Yeedu carousel, banner, social slide, or print poster.

## Audience & purpose

- **Primary audience**: data engineers, data architects, CTOs, CFOs at mid-to-large enterprises running Spark on Databricks / EMR / Dataproc / Cloudera.
- **Voice**: senior B2B marketer — declarative, technical, restrained. Hard numbers over hype. Italics for emotional beats.
- **Goal of every carousel**: convert technically literate skeptics into a sales conversation.

## Brand tokens (LOCKED — never deviate)

```js
const C = {
  orange:      '#f2600c',  // primary signature
  orangeLight: '#ff8a3d',  // gradients, hover, accents
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

**Fonts**: Montserrat (headings, weights 300/600/700/800) + Inter (body, 400/500/600). Headings use letter-spacing -1.5 to -5px and 0.95 line-height.

**Logo**: `/uploads/7d95c235-aa75-4cb1-a3c2-e84314ceca33.png` — top-left of every cover and closer, plus a 28–34px footer mark on every slide.

## The Yeedu stage (every slide uses this canvas)

Layered background — five passes, in order:

1. **Base gradient**: `linear-gradient(160deg, #26221d 0%, #14110d 50%, #0a0807 100%)`
2. **Ambient glows**: 2–3 radial orange/amber ellipses placed differently per slide for rhythm. Variants A/B/C/D defined below.
3. **Dot grid texture**: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)` at `32px 32px` — adds tactility.
4. **Corner geometric arcs**: dashed concentric arcs top-right + solid concentric rings bottom-left (SVG, ~12–18% opacity).
5. **Vignette**: `radial-gradient(ellipse 90% 90% at 50% 50%, transparent 60%, rgba(0,0,0,0.45) 100%)`.

Footer band on every slide: 80px from edges, logo 28–34px left, "yeedu.io" right, `rgba(255,255,255,0.42)` text.

## Glow variants (rotate per slide for visual rhythm)

| Variant | Use for | Glow placement |
|---|---|---|
| A | Cover, hero | top-right + bottom-left + center |
| B | Mid-deck pages | top-left + bottom-right + middle |
| C | Cost/value pages | top-center + bottom-center + 20% |
| D | Architecture/wide diagrams | right side + left side + top |

See `references/stage.md` for the full CSS.

## Headline pattern

Two-line headline. First line: Montserrat 800, white. Second line: Montserrat 300 italic, gradient white→orange-light via `-webkit-background-clip:text`. Sizes scale per ratio (see "Layouts" below).

Eyebrow chip (pre-headline): pill, orange-dim bg + warm border + glowing orange dot + uppercase orange-light text.

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

## Card pattern (every infographic sits in one)

```css
background: linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015));
border: 1px solid rgba(255,255,255,0.08);
border-radius: 24px;
backdrop-filter: blur(8px);
padding: 30–36px;
/* optional: border-left: 4px solid #f2600c for emphasis */
```

## Standard slide flow (8 slides)

1. **Cover** — Logo + eyebrow + 2-line headline + tagline + 4-metric strip (10× · 70% · $0.53 · 0 rewrites) + hero engine schematic SVG
2. **Problem / Pain** — Eyebrow + 2-line headline + 3 cards each with iconsax icon + title + body
3. **Speed proof** — Big number ("10×" or "4–10×") + horizontal bar race comparing 4 workloads
4. **Cost proof** — Area chart, cumulative spend traditional vs Yeedu with migration marker + $$$ savings callout
5. **Benchmark** — TPC-DS scaling chart (1TB/3TB/10TB) + ±2% / 0 failures / 0 changes side panel + "$0.53/TB" hero
6. **Architecture** — 3-layer stack: your code → Yeedu Turbo Engine (4 internal components with mini bar visuals) → cloud targets
7. **How it works** — 3 stacked cards: SIMD vectorization (lanes diagram), I/O-aware scheduling (Gantt), job multiplexing (packed node)
8. **CTA** — Logo + 2-line headline + 3 onboarding steps + orange pill CTA + email + QR code (if event)

You can compress to 6 or expand to 10 depending on topic depth.

## Three ratios — layout reflow rules

For every topic, the user typically wants ALL THREE outputs. Same content, reflowed per ratio.

| Ratio | Pixels | Use case | Headline size | Slide count |
|---|---|---|---|---|
| 1:1 | 1080×1080 | Instagram square, LinkedIn feed | 78–88px | tighter — 6–8 slides |
| 4:5 | 1080×1350 | Instagram portrait (recommended) | 88–120px | full 8 slides |
| 9:16 | 1080×1920 | Story, roll-up banner, vertical display | 100–148px | 8 slides with more headroom |

**Reflow rules**:
- 1:1 → tighten vertical, two-column where possible, shrink charts ~80%
- 4:5 → reference layout (everything I've built defaults to this)
- 9:16 → expand vertical breathing room, add extra stat strip below hero, taller charts

See `references/layouts.md` for exact coordinates.

## Infographic library (reuse — don't redraw)

All are pure SVG, parameterized. Listed in `references/infographics.md`:

1. **Engine schematic** — concentric rings + orbiting nodes + glowing core
2. **Horizontal bar race** — 4-row comparison, traditional vs Yeedu with delta callouts
3. **Cumulative cost area chart** — two paths, migration marker, savings annotation
4. **Scaling bar chart** — 3 bars for 1TB/3TB/10TB cost-per-TB
5. **Architecture stack** — 3-layer with internal components and connector arrows
6. **SIMD lanes** — 4 lanes showing scalar in / vectorized out
7. **Gantt timeline** — 3 worker rows with dense task packing
8. **Multiplexed node** — single container packed with 6 task blocks
9. **Migration flow** — before/after with central conversion utility
10. **Concentric ring closer** — used on CTA slide

Always render in the orange-on-warm-dark palette. Numbers come from the **Yeedu fact sheet** below.

## Yeedu fact sheet (the only numbers to cite)

Drawn from yeedu.io. Use these — do not invent stats.

| Metric | Number | Source |
|---|---|---|
| Pipeline speedup | 4–10× | C++ Turbo Engine, SIMD vectorization |
| I/O speedup | 2–4× | Smart Scheduling |
| Cloud cost reduction | 60–80% | Versus traditional Spark platforms |
| Confirmed customer savings | 65% annual | Top-5 Pharma director |
| TPC-DS cost | $0.53/TB | 99-query suite on 1TB/3TB/10TB, Graviton4 |
| Failures on benchmark | 0 | On 297 runs (99 queries × 3 sizes) |
| Code rewrites required | 0 | Drop-in for PySpark/Scala/Python |
| Pricing floor | $2,000/month | Tiered usage model |
| Benchmark dataset | 1.5B rows | Real-world production data |

**Migrations supported**: Databricks, AWS EMR, Dataproc, Cloudera.
**Cloud targets**: AWS, Azure, GCP, Kubernetes, on-prem.
**Catalog support**: Hive Metastore, Unity Catalog, Iceberg, Delta Lake, Glue.
**Founder**: Milind Chitgupakar (CEO).
**Notable advisor / endorser**: Dr. Mark Ramsey, ex-CDO GSK & Samsung Mobile.

## API workflow (Open Carrusel app)

The app runs at `http://localhost:3000`. Build pattern:

```javascript
// 1. Create carousel (per ratio)
POST /api/carousels  { name, aspectRatio: '1:1' | '4:5' | '9:16' }
// → returns { id, ... }

// 2. Add slides (max 10 per carousel)
POST /api/carousels/{id}/slides  { html: '<div>...</div>', notes }

// 3. Update existing slide
PUT  /api/carousels/{id}/slides/{slideId}  { html, notes }

// 4. Export to ZIP of PNGs at 4× density
POST /api/carousels/{id}/export  // returns binary ZIP
```

**Slide HTML rules**:
- Body-level only — no `<html>`, `<head>`, `<!DOCTYPE>`, no `<script>` (iframe sandbox blocks JS).
- Outer container MUST be `width: <ratio_w>px; height: <ratio_h>px; position: relative; overflow: hidden`.
- Reference logo as `/uploads/7d95c235-aa75-4cb1-a3c2-e84314ceca33.png`.
- Use Google Font family names — the app loads them automatically.
- All images: PNG/JPG/WebP only (SVG blocked at upload, but inline `<svg>` is fine).

**Export resolution**: `deviceScaleFactor: 4` (set in `src/lib/export-slides.ts`) → every PNG is 4× native pixel density, suitable for print banners.

## Build script template

Use the `/tmp/yeedu-final-carousel.mjs` pattern as the canonical template. Key invariants:

1. Define `C` color tokens at the top.
2. Define `stage(inner, { variant })` shell function with all 5 background layers.
3. Define `eyebrow(text)` and `cardBg` constants.
4. Write 6–10 slide HTML strings using stage + eyebrow + card patterns.
5. Build for THREE ratios in parallel — same content, reflowed dimensions.
6. POST carousel + slides via fetch to `http://localhost:3000`.
7. Print the final URL: `http://localhost:3000/?carousel=<id>` for each ratio.

## Companion skills to invoke

- **`iconsax-library`** — for premium SVG icons inside cards. Use ONE style (Linear, Bold, or Two-tone) per carousel for cohesion.
- **`claude-d3js-skill`** — for upgraded charts (smooth axes, annotations) when the topic is data-viz heavy.
- **`unsplash-integration`** — only if Unsplash key is set; otherwise skip and rely on SVG + iconsax.

## Hard rules — do not break

1. **Never use emojis** as content icons. Use iconsax SVGs.
2. **Never use light/white backgrounds**. The Yeedu stage is always dark warm.
3. **Never invent stats**. Use only the fact sheet above.
4. **Never break the eyebrow → headline → body → infographic rhythm**.
5. **Never skip the footer band** (logo + yeedu.io).
6. **Every CTA closer must include**: orange pill CTA, sales@yeedu.io, and (if event) a QR code.
7. **For print banners**, always confirm the export ran with `deviceScaleFactor: 4`.

## Output contract

When the user gives N topics × 3 ratios:

- Create 3N carousels (one per topic-ratio combination).
- Name format: `<Topic> — Square (1:1)`, `<Topic> — Portrait (4:5)`, `<Topic> — Story (9:16)`.
- Report back: a table of carousel IDs + preview URLs, plus an Export-all command.

## QR code generation (closer slide)

When the destination URL is provided, embed a QR code as an inline SVG on the closer. Use Node's `qrcode` package server-side, or build via API. Reference snippet:

```js
import QRCode from 'qrcode';
const qrSvg = await QRCode.toString(url, { type: 'svg', margin: 0, color: { dark: '#ffffff', light: '#00000000' }});
```

If `qrcode` not installed, prompt the user or fall back to a stylized URL pill on the closer.

## File references

- `references/stage.md` — full background CSS for all 4 variants
- `references/layouts.md` — exact pixel coordinates per ratio (1:1, 4:5, 9:16)
- `references/infographics.md` — copy-paste SVG snippets for all 10 infographic types
