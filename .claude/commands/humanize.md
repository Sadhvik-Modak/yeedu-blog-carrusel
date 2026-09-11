---
description: Audit carousel copy for AI tells (accepts a carousel id or slug; no arg audits every deck).
allowed-tools: Bash(node *)
---

!`node .claude/skills/measured-humanizer/gate/carousel_gate.mjs ${ARGUMENTS:+--carousel "$ARGUMENTS"} ${ARGUMENTS:---all} 2>&1; exit 0`

Read the output above. Exit code is always 0, so the verdict is the `PASS`/`FAIL`
on each deck line.

If a deck fails, act on the single rule reported as `worst` — not all of them at
once, which stops the loop converging. Fix the copy in the deck's generator under
`scripts/`, which is the source of truth; editing `data/carousels.json` directly
gets overwritten on the next run. Then re-run this command.

Rule meanings, the corpus numbers behind them, and the rewrite table are in
`.claude/skills/measured-humanizer/SKILL.md`. Do not respond to a failure by
inventing a banned-word list — hedging and promotional adjectives measured at
chance and are deliberately not gated.

If every deck passes, say so and report the house fingerprint line: decks whose
headline shapes all match each other are templated even when no single line
trips a rule.
