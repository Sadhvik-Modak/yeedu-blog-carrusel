# Yeedu Infographics — Archetype Catalogue & Craft Rules

Extracted from the two reference decks: **Iceberg Compaction — The Small Files Tax** and
**Database Branching — Git For Data**. Across their eight slides the chrome is 100% identical and
the drawings are 0% shared — six distinct hand-drawn SVGs, no reuse.

**These are not clip art.** Each archetype is a *shape of argument*. You re-derive the drawing
from your own numbers every time; what you reuse is the strategy for making a claim visible, plus
the craft rules in Part B.

---

## PART A — THE EIGHT ARCHETYPES

### 1. Many-things → connector → outcome token
**Says:** *"all of these cause that."*

A grid or cluster of small stroked rectangles (the many), a dashed path leaving the cluster, a
drawn chevron arrowhead, and a single stroked circle containing `<text>` (the outcome).

- The many are **stroked, not filled**, at low opacity — they are the mechanism.
- The connector is `stroke-dasharray="4 5"` — dashes mean *"flows to / causes."*
- The outcome token is the only shape at full opacity, usually orange.
- **The count of rectangles is data.** Draw 24 if the number is large; don't draw 5 and label it 24.

Use for: fan-in causation, "N sources → one consequence", pipeline convergence.

### 2. Ragged comb → funnel → thin output
**Says:** *"many became few"* — throughput or file-count collapse.

Left: many vertical hairlines at **jittered heights and x-spacing** (ragged = disordered, and the
raggedness is the point). Middle: a faint unfilled trapezoid, `fill:none`, opacity ~0.25 — the
process, deliberately dim. Right: far fewer lines, thicker, orange, evenly spaced.

- In-count and out-count are **literal data**. 40 lines in, 3 out, is a 13:1 claim the eye reads
  without a label.
- Label each side with an in-SVG annotation stack (Part B).

Use for: compaction, deduplication, consolidation, batching, any N→M reduction.

### 3. Stat ladder (typography as chart)
**Says:** three things at once when they share no common unit.

Three glass cards stacked vertically, each `border-left: 4px solid #f2600c`, each containing a
Montserrat 800 / ~36px value and an Inter / ~17px clause beneath it.

- This is the **legitimate escape from drawing** — use it when the numbers genuinely have no
  shared axis ("$0.53/TB", "0 failures", "0 rewrites").
- Still structural: the ladder ranks, the orange rails align, the values are the largest type on
  the slide. It is a chart made of type, not a list of bullets.
- **Never** more than three. Four is a table; use archetype 7.

### 4. Two-outcome fork, valence by height
**Says:** *"this path ends worse than that one"* — without writing "worse."

A root dot, a short stem, a vertical rail, and two limbs drawn as **identical `<g>` groups**
translated to different y: `<g transform="translate(0,20)">` and `<g transform="translate(0,74)">`.

- Because the limbs are *structurally identical*, the only difference the eye sees is **vertical
  position** — and down reads as worse. The valence is carried entirely by geometry.
- Tint the lower limb's terminal shape orange to confirm which one is the problem.

Use for: with/without, before/after, the branch where things go wrong.

### 5. Git-graph with a ghost edge
**Says:** *"this thing exists; that thing doesn't."*

A vertical trunk, two branches as `Q` beziers whose control point sits **below** the fork (giving
the correct git-graph swing), filled `r=5` nodes at commits — and one edge that *should* be there
drawn `stroke-dasharray="1 8"` with `stroke-linecap="round"`, reading as a dotted ghost.

- **Solid = real, dotted = absent.** This is the single highest-value semantic in the vocabulary.
- Filled nodes = things that happened; unfilled = things that could.

Use for: missing capability, the merge that can't happen, an unsupported path, a gap in a matrix.

### 6. Proportional nested rects + leader fan
**Says:** *"this is N× that"* — instantly, pre-verbally.

An outer rectangle `fill:none` with its label **above**, and an inner filled rectangle with its
label **below**. Then three thin leader lines fanning from the figure to a stacked text block.

- **The area ratio must equal the data ratio.** If the claim is 4×, the outer must be 4× the area
  — not 4× the width. This is the one archetype where sloppiness destroys the argument.
- Fill vs. stroke does real work here: the stroked outer is a *container*, the filled inner is
  *content*.
- Leader lines at `stroke-width:1.5`, opacity ~0.3 — they must not compete with the figure.

Use for: cost ratios, utilization, "you pay for the box, you use this much", any ratio ≥ 2×.

### 7. Comparison matrix with a hero row
**Says:** *"one of these is not like the others."*

An HTML table (not SVG): header rule `rgba(255,255,255,0.15)`, body rules
`rgba(255,255,255,0.06)`, nulls as an em-dash `—` at `rgba(255,255,255,0.25)`.

- The winning row is **triple-encoded**: background tint + orange text + heavier weight. One
  signal is a hint; three is a conclusion.
- **Nulls are faint em-dashes, never ✗ and never red.** A column of pale dashes with one bright
  "Yes" is the entire infographic — the eye finds it before reading a single word.
- Keep to 4–5 rows and 3–4 columns. Beyond that, nobody reads it on a phone.

Use for: feature/capability comparison, vendor matrix, format support.

### 8. Convergence bookend
**Says:** *"and that's the argument"* — structurally, on the closer.

Take the cover's visual vocabulary and **complete or invert it**: two verticals joined by one arc,
terminating in an oversized `r=6` node. If the cover showed divergence, the closer shows
convergence. If the cover showed a broken path, the closer shows it whole.

- This is what makes five slides feel like one deck rather than five posts.
- Decide the bookend when you design the **cover**, not when you reach the closer.

---

## PART B — CRAFT RULES (these are what make the archetypes look expensive)

### Geometry
- **Design in a ~200-unit viewBox, render at 480–520px** — i.e. `viewBox="0 0 200 110"` on an
  element ~2.4–2.6× that size. Every coordinate stays an integer, and the upscale is crisp at 4×
  export density. Fighting with decimal coordinates in a 500-unit viewBox is how diagrams end up
  looking hand-wobbled.
- Arrowheads are **drawn as 3-point open paths** (`M x y L x2 y2 L x3 y3`, `fill:none`), never
  `<defs><marker>`. Markers inherit stroke-width unpredictably across the preview iframe and the
  Puppeteer export.

### Stroke weight = hierarchy (three steps, no more)
| Weight | Role |
|---|---|
| 1.5 | leader lines, axes, ticks |
| 2–2.5 | structure — containers, rails, the frame of the idea |
| 3–4 | **the data** — the line the slide is actually about |

### Opacity runs in parallel
| Opacity | Role |
|---|---|
| 0.25–0.3 | mechanism / process / scaffolding |
| 0.4 | neutral context |
| 1.0 + orange | the claim |

> **Dim the mechanism, brighten the claim.** Almost every amateurish diagram fails by drawing the
> plumbing at the same weight as the point.

### Dash patterns are semantic, never decorative
- `stroke-dasharray="4 5"` → *"flows to / causes / leads to"*
- `stroke-dasharray="1 8"` + `stroke-linecap="round"` → *"this does not happen"*
- Solid → it's real.

Never dash a line because it looked too plain solid.

### Fill vs. stroke
Stroked = a container or a boundary. Filled = a unit or a quantity. Hold this consistently within
a deck and the reader learns the language by slide 3.

### `<g>` inheritance
Put shared attributes on the group (`<g stroke="#fff" stroke-width="2" fill="none">`) and repeat
glyphs with `<g transform="translate(x,y)">`. Repetition-by-transform is what makes archetype 4
work — identical groups differing only in position.

### In-SVG annotation stacks
Label a figure *inside* the SVG with three lines, three sizes:

```
label      ~9px   Inter 600   uppercase  letter-spacing 1  opacity 0.42
hero value ~26px  Montserrat 800  fill #ff8a3d
qualifier  ~9px   Inter 400   opacity 0.6
```

Keeping annotations in the SVG means they scale with the figure and stay locked to it.

### Colour discipline
Orange marks **the point**, once per drawing. A diagram with three orange elements has no point.
Everything else is white at an opacity from the table above.

---

## PART C — IDEA SHAPE → ARCHETYPE

Match on the *shape of the claim*, not the topic.

| The claim you're making | Archetype |
|---|---|
| "N different things all cause this one problem" | 1 — many → connector → token |
| "Many became few" (compaction, batching, dedup) | 2 — ragged comb → funnel |
| "Three facts, no shared unit" | 3 — stat ladder |
| "This path ends badly; that one doesn't" | 4 — two-outcome fork |
| "X exists, Y is missing / impossible" | 5 — git-graph with ghost edge |
| "This is N× that" (N ≥ 2) | 6 — proportional nested rects |
| "Compare 4 options on 3 attributes" | 7 — comparison matrix, hero row |
| "…and that's the argument" (closer) | 8 — convergence bookend |
| "This grows until it hits a limit" | curve rising toward a horizontal rule — craft rules of 6 |
| "Two costs diverge over time" | two lines from a shared origin, gap annotated at both ends |
| "A trade-off: better on one axis, worse on another" | two bands on one axis, orange on the one being argued for |

**If nothing matches**, you have not sharpened the claim enough. Rewrite the sentence the picture
must assert until it takes one of these shapes. Do not fall back to an icon card — that is the
failure this catalogue exists to prevent.

---

## PART D — SELF-CHECK BEFORE SHIPPING A SLIDE

1. Cover the text. Does the picture still make the claim?
2. Is any number from the source encoded as a **dimension** (area, count, length, height)?
3. Is exactly one thing orange?
4. Are there exactly three stroke weights?
5. Does every dash pattern mean something?
6. Is this drawing **absent from every other slide** in the deck?
7. Does the cover's vocabulary return on the closer?

Seven yeses. Otherwise it's a caption with decoration.
