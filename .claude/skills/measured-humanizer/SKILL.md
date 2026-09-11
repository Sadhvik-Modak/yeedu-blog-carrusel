---
name: measured-humanizer
description: "Make carousel copy read as human-written using a corpus-calibrated deterministic gate (36 human vs 45 AI documents) instead of AI-tell folklore. Use when writing or auditing slide headlines and captions, humanizing a deck, or checking whether copy reads as generated. Prefer this over phrase-list skills - the classic tell lists measured at chance."
risk: none
license: MIT
---

# Measured humanizer (carousel build)

Vendored from `~/.claude/skills/measured-humanizer`, upstream
`github.com/…/measured-humanizer` (MIT). `gate/style_gate.js`,
`gate/thresholds.json` and `reference/calibration.md` are **byte-identical
copies** so this can be re-synced upstream; verify with:

```
md5sum gate/style_gate.js   # b8b8efaf637ef64e3ac034c90f43ae32
```

Two things are local to this repo: this file, retuned for slide copy, and
`gate/carousel_gate.mjs`. Re-sync the three upstream files freely; do not
overwrite these two.

## When to use this

Any time you write or edit copy that lands on a slide: headlines, captions,
in-SVG annotations, the closer, the Instagram caption. Also when auditing a
deck someone else generated.

## Read this before you edit anything

Humanizing by taste does not converge. You rewrite, it reads differently, and
you have no way to know whether it reads *more human* or just *different*. So
the judgement is replaced by a scorer that names one defect at a time.

**The classic tell lists measure at chance.** From a 36-human / 45-AI corpus
(AUC 0.5 = coin flip):

| Signal | Separation | Verdict |
|---|---|---|
| hedging words (*may*, *might*, *typically*) | 0.516 | useless — humans hedged **more** |
| bridge phrases (*moreover*, *furthermore*) | 0.527 | useless — near-zero in both classes |
| promotional adjectives (*robust*, *seamless*) | 0.535 | useless — no direction |

Banning the word "may" accomplishes nothing. **Do not add a banned-words list
to this repo.** Where a phrase-replacement skill disagrees with this one, this
one wins, because this one was measured.

What actually separates is structural:

| Signal | Separation | Human | AI |
|---|---|---|---|
| paragraph length variance | 0.897 | 28.6 | 12.8 |
| first-person rate | 0.889 | 8.18 /1k words | 0.00 |
| em-dash rate | 0.736 | 0.00 | higher |
| sentence length variance | 0.720 | 10.3 | 7.7 |
| concrete-specific density | 0.686 | 28.0 | 19.9 |
| contraction rate | 0.663 | 10.2 | 7.9 |
| long-word rate | 0.740 | denser | sparser |

## What does and does not survive at slide length

The composite scorer is **fitted to long-form technical prose and is not valid
on slide copy**. `para_stdev` (the heaviest dimension, 0.90 of 5.34) counts
only paragraphs of ≥ 10 words, so a deck of 8-word lines scores 0, below the
`lo` of 14.37, and fails — for being short, not for being generated. Failing
that one dimension alone lands the composite at 0.831 against a 0.84 cutoff.
`sent_stdev` breaks the same way.

Upstream says so itself: *"Marketing copy, fiction and academic prose will each
want their own fit"* and *"Do not hand-edit the ranges — a guessed threshold is
the taste-based approach with extra steps."*

So there is **no fitted composite for carousels and none is invented**.
`reference/carousel-adaptation.md` has the full dimension-by-dimension
breakdown and the refit path if you ever collect the corpora.

What runs instead: the absolute rules, which are per-instance and therefore
length-independent, plus rules derived from this repo's own shipped output.

## The loop

```bash
GATE=.claude/skills/measured-humanizer/gate/carousel_gate.mjs

node "$GATE" --carousel <id-or-slug> --brief   # one deck
node "$GATE" --all                             # every deck + house fingerprint
node "$GATE" --carousel <id> --json            # machine-readable
```

Exit code is always 0. Read `pass` from stdout.

1. Read `worst` only. **Fix that one rule.** Fixing several at once trades one
   failing check against another and the loop stops converging.
2. Make the **minimum edit**. Copy you are not fixing comes back byte-identical.
   Never rewrite a whole deck to clear one headline.
3. Fix the copy in `scripts/<deck>.mjs`, which is the source of truth, then
   re-run the script. Editing `data/carousels.json` by hand gets overwritten.
4. Stop when `pass=true`, or after **4 passes**. If a rule survives four
   targeted edits the claim itself needs rethinking, not restyling.

## Absolute rules — vetoes, not scores

These bypass any score. A deck tripping any of them fails.

**From the corpus:**

- **`parallelism`** — "not X, but Y", "it isn't A, it's B". Zero occurrences
  across 36 human documents, 8 in the AI set.
- **`discourse_markers`** — "the real problem is", "the tradeoff is", "the catch
  is", "none of this means", "the mistake is", "the point is", "the fix is".
  1.30/1k in generated text against **0.00 in both reference corpora**.
- **`is_that_filler`** — "The problem is that…", "What this means is that…".
  0.82/1k generated vs 0.24 human. State the thing directly.
- **`emdash`** — the human corpus rate is **0.00**. Comma, colon, or full stop.
  At deck length a single em dash is ~5/1k, over the 4.67 ceiling anyway.
  Exempt: the faint standalone `—` that `infographics.md` prescribes for an
  empty comparison-matrix cell. That is a glyph, not punctuation.

**Added from this repo's observed output** — which is the sanctioned way to
extend this list: *"Expect to add rules here from observed output, not from
lists."* AUC is blind to a defect neither reference class exhibits. Each rule
carries the shipped string that motivated it:

- **`antithesis_beat`** — two short beats where the second inverts the first.
  `Storage is cheap. Compaction is not.` /
  `Branching Was The Easy Half. Merging Never Shipped.`
- **`negation_reframe`** — `The 2026 question is no longer which cluster is
  cheaper. It is which operating model you still want to be running in five
  years.`
- **`title_case_headline`** — `EMR's Real Cost Is Operational.` Sentence case,
  always. Proper nouns do not count as evidence.
- **`headline_terminal_period`** — same example. A headline is not a sentence;
  it does not need a full stop. `?` and `!` are fine.
- **`cta_boilerplate`** — "Follow for more", "Save this", "Share with someone
  who needs this", "Link in bio", "Here's the thing", "Let's dive in".

## Writing rules that survive at slide length

Upstream's rules 1, 4 and 8 (vary paragraph length, one sentence over 25 words,
no mandatory `## Conclusion`) and the H2/H3 heading zoning are article-shaped
and do not apply here. These four do:

1. **Name real things.** The strongest anti-generic lever on a slide. The actual
   number, the actual product, the actual version, the actual price: `700 GB/day`,
   `$70k`, `v2.4.1`, `--max-retries=2`. Not "significant cost", not "the relevant
   configuration". At least two specifics per deck concrete enough that only
   someone who ran the thing would know them. Never invent a Yeedu stat.
2. **First person.** we / our / us. The corpus floor is only 0.73/1k — one "we"
   in a deck clears it — but the human mean is 8.18/1k, so aim above the floor.
   If we ran it, say we ran it.
3. **Contractions are normal.** Their absence is measurable. "doesn't", "won't",
   "you're". The shipped decks have almost none, which is part of why they read
   as generated.
4. **State facts flatly.** Confidence is not overclaiming. Never soften a claim
   that is true — hedging measured at chance and does not make writing read as
   human. An unsupported claim gets removed, not hedged.

**Vary the shape across the deck.** The one structural rule that does survive:
if every headline in a deck has the same grammar, the deck has a fingerprint
even when no single line trips a rule. `--all` prints the house fingerprint —
the share of headlines per deck that are Title Case, end in a period, or run
the antithesis beat. Watch it move.

## Register

The corpus informs sentence *texture*, not register. Yeedu decks stay senior
B2B: technical credibility with business framing, hard numbers over adjectives.
Human-sounding does not mean chatty, and a slide that reads like a forum post is
a failure however it measures.

## Recalibrating

`gate/thresholds.json` is fitted to technical practitioner long-form. To fit it
to marketing copy: collect ~30+ human and ~30+ generated decks, run `metrics()`
from `gate/style_gate.js` over both, keep dimensions with AUC ≥ 0.65, set each
range to the human percentile band, and sweep the cutoff by Youden's J. The
sweep scripts are not shipped; you would write them against the exported
`metrics()`.

## Do not

- Do not fix more than one rule per pass.
- Do not rewrite wholesale to clear a rule. A deck that games the gate is not
  better copy.
- Do not add a banned-phrase list. The measurement says those signals are noise.
- Do not hand-edit `thresholds.json`.
- Do not point `style_gate.js` at slide copy and report the composite. It will
  fail for length and tell you nothing.
- Do not treat this as a guarantee about any third-party AI detector. It
  measures properties of prose, not a classifier you have never seen.

## Tests

```
node .claude/skills/measured-humanizer/test/run.mjs
```

Every "must fail" fixture is verbatim shipped copy from `data/carousels.json`.
If a rule stops firing on its own motivating example, it has rotted.
