# Carousel adaptation

Why the composite scorer is switched off for slide copy, which dimensions
survive, and what a real refit would take. `calibration.md` (byte-identical to
upstream) records how the original thresholds were derived; this file records
what happens when you point them at an Instagram carousel.

## The short version

`gate/thresholds.json` was fitted against long-form technical prose. Slide copy
is 200–400 words of 4–12 word lines. Three of the seven gated dimensions do not
merely drift at that length — they are structurally undefined, and they fail in
the direction that says "generated" no matter what the copy says.

Shipping a composite score on top of that would be a number that looks like
measurement and is not. So `carousel_gate.mjs` prints
`composite=n/a (uncalibrated at slide length)` and gates on vetoes only.

## Dimension by dimension

| Dimension | Weight | At slide length | Kept? |
|---|---|---|---|
| `para_stdev` [14.37, 85.02] | 0.90 | Paragraphs are counted only at ≥ 10 words. A deck of 8-word lines yields zero paragraphs; `pstdev` of < 2 items returns 0; 0 < 14.37 fails. **Failing this alone puts the composite at 0.831 against a 0.84 cutoff** — every carousel fails for being short. | **dropped** |
| `sent_stdev` [6.35, 77.14] | 0.72 | Sentences counted only at ≥ 3 words. A stdev of 6.35 needs a genuine long/short mix; slide lines land at or near 0. | **dropped** |
| `long_word_rate` [65.07, 200] | 0.74 | Rewards the dense diction of technical prose (≥ 6.5% of words at 9+ chars). Marketing headlines deliberately use short words. Directionally hostile to good slide copy. | **dropped** |
| `emdash_rate` [0, 4.67] | 0.74 | Survives, and hardens: on a 200-word deck one em dash is 5.0/1k, already over the ceiling. Effectively the absolute ban that upstream rule 7 states anyway. | **veto** |
| `first_person_rate` [0.73, 26.03] | 0.89 | Survives. The floor is low enough that one "we" in a deck clears it, so it is reported rather than gated — but the human mean is 8.18/1k and the shipped decks sit at 0.00. | reported |
| `contraction_rate` [5.12, 24.06] | 0.66 | Survives. Roughly one contraction per 200 words clears the floor. Reported. | reported |
| `concrete_rate` [11.09, 98.79] | 0.69 | The *rule* survives and is the single best anti-generic lever on a slide. The *regexes* do not: `CONCRETE` recognises semver, `--flags`, `snake.case`, `SCREAMING_CASE` and units like `ms/GB/vCPU`. A brand-concrete line ("3 clients, 11 days, $4,200") mostly misses. Reported, with the caveat that a low number here can mean "wrong detector" rather than "vague copy". | reported |

Also dropped: **heading zoning** (H2 statement / H3 question) is an article/GEO
shape rule. Worse, `proseOnly()` deletes every `#`-prefixed line before
measuring, so slide titles written as markdown headings would vanish from the
metrics while still tripping the `question_h2` veto. Always `--no-zoning` if you
ever run `style_gate.js` over carousel text.

Also dropped: the **`integrity` / `--before` check** compares fenced code blocks
and markdown link URLs. Carousel copy has neither, so it always reports `ok:
true` and gives false confidence.

## What replaced it

The four upstream absolute rules, which are per-instance matches and therefore
length-independent, plus five rules read off this repo's own six shipped decks.
Upstream sanctions exactly this move:

> "The last three cannot be derived from the corpora, and that is the point:
> both classes measure ~0.00 while generated output measures 0.80 and 0.74. AUC
> is blind to a defect neither reference class exhibits. **The corpora describe
> good writing; they do not describe how a generator fails.** Expect to add
> rules here from observed output, not from lists."

| Added rule | Motivating string, verbatim from `data/carousels.json` |
|---|---|
| `antithesis_beat` | `Storage is cheap. Compaction is not.` |
| `antithesis_beat` | `Branching Was The Easy Half. Merging Never Shipped.` |
| `negation_reframe` | `The 2026 question is no longer which cluster is cheaper. It is which operating model you still want to be running in five years.` |
| `title_case_headline` | `EMR's Real Cost Is Operational.` |
| `headline_terminal_period` | `The storage math is obvious.` |
| `cta_boilerplate` | `Save this for your next cost review` |

These were not guessed. Each one was a repeated shape across independent decks,
and the prompt that produced them prescribed it: the voice line in
`yeedu-carousel-designer/SKILL.md` read *"contrast-driven — the sentence
structure is usually 'the thing you accept' → 'what it actually costs'"*, and
`chat-system-prompt.ts` hardcoded the three boilerplate CTAs. Both were changed
alongside this gate; a linter that fights its own prompt just produces churn.

## The em-dash exemption

`references/infographics.md` prescribes a faint `—` for an empty cell in a
comparison matrix. That is a glyph standing in for "no value", not punctuation,
and banning it would break a documented brand pattern. So the rule fires only on
an em dash inside a text node of ≥ 4 words. A matrix cell containing nothing but
`—` passes; `afterwards — and managed compaction` does not.

The rule also catches ` -- ` and a spaced en dash, which the upstream `EMDASH`
regex (`/—/g`, U+2014 only) does not — those are the obvious workarounds once
the em dash is banned.

## What a real refit would take

Not done here, and deliberately not faked:

1. Collect ~30+ human-written and ~30+ generated carousels in this register.
2. Run `metrics()` from `gate/style_gate.js` over both sets.
3. Keep dimensions with AUC ≥ 0.65.
4. Set each range to the human percentile band. Two-sided, not a floor — upstream
   found a one-sided floor on sentence variance is satisfied by injecting one
   stray four-word sentence, which games the gate without improving the prose.
5. Sweep the cutoff for best separation by Youden's J.
6. Re-author the `CONCRETE` regexes for marketing specifics — prices, dates,
   counts, product and city names — instead of flags and semver.

The sweep scripts (`calibrate_gates.py`, `validate_gate.js`) are referenced in
the `style_gate.js` header but are not shipped in the skill; they would have to
be written against the exported `metrics()`.

Until that exists, the honest position is: vetoes catch the shapes we have
actually observed, and the texture numbers are context, not a verdict.
