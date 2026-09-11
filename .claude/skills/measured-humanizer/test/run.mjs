#!/usr/bin/env node
/**
 * Regression suite for carousel_gate.mjs.
 *
 * Every "must fail" string below is verbatim from data/carousels.json as it
 * shipped. Every "must pass" string is a rewrite of the same claim that keeps
 * the fact and drops the shape. If a rule stops firing on its own motivating
 * example, the rule has rotted.
 *
 *   node .claude/skills/measured-humanizer/test/run.mjs
 */
import { gateDeck, extractSlide } from "../gate/carousel_gate.mjs";

let failed = 0;
const check = (name, ok, detail = "") => {
  console.log((ok ? "  ok   " : "  FAIL ") + name + (ok ? "" : "  <- " + detail));
  if (!ok) failed++;
};

/** Build a one-slide deck out of raw copy so a rule can be tested in isolation. */
const deckOf = (headline, body = "") => ({
  name: "test",
  slides: [{
    order: 0,
    html: `<div><h1 style="font-size:54px">${headline}</h1>` +
          (body ? `<p style="font-size:23px">${body}</p>` : "") + `</div>`,
  }],
});
const rulesFor = (headline, body) => Object.keys(gateDeck(deckOf(headline, body)).byRule);

console.log("shipped copy must trip its rule");
check("antithesis_beat: 'Storage is cheap. Compaction is not.'",
  rulesFor("Storage is cheap. Compaction is not.").includes("antithesis_beat"));
check("antithesis_beat: 'Branching Was The Easy Half. Merging Never Shipped.'",
  rulesFor("Branching Was The Easy Half. Merging Never Shipped.").includes("antithesis_beat"));
check("title_case_headline: \"EMR's Real Cost Is Operational.\"",
  rulesFor("EMR's Real Cost Is Operational.").includes("title_case_headline"));
check("headline_terminal_period: \"EMR's Real Cost Is Operational.\"",
  rulesFor("EMR's Real Cost Is Operational.").includes("headline_terminal_period"));
check("negation_reframe: 'is no longer which cluster is cheaper. It is ...'",
  rulesFor("Cost", "The 2026 question is no longer which cluster is cheaper. It is which operating model you still want in five years.")
    .includes("negation_reframe"));
check("emdash in a prose run",
  rulesFor("Cost", "Somebody has to pay to tidy up afterwards — and managed compaction is not free.")
    .includes("emdash"));
// Slides authored through the chat panel escape their punctuation, so the
// veto has to see through the entity as well as the raw glyph.
check("emdash written as &mdash; still trips the veto",
  rulesFor("Cost", "two branches need to become one &mdash; and that is the half of git that mattered.")
    .includes("emdash"));
check("cta_boilerplate: 'Save this for your next cost review'",
  rulesFor("Closing", "Save this for your next cost review").includes("cta_boilerplate"));
check("discourse_markers: 'The real problem is ...'",
  rulesFor("Cost", "The real problem is the compaction bill.").includes("discourse_markers"));
check("is_that_filler: 'The problem is that ...'",
  rulesFor("Cost", "The problem is that compaction runs hourly.").includes("is_that_filler"));
check("parallelism: \"it's not A, it's B\"",
  rulesFor("Cost", "It's not a storage problem, it's an operating problem.").includes("parallelism"));

console.log("\nlegitimate copy must not trip");
check("sentence-case headline with no terminal period",
  rulesFor("700 GB a day costs $500k on Datadog").length === 0,
  JSON.stringify(rulesFor("700 GB a day costs $500k on Datadog")));
check("proper nouns are not Title Case evidence",
  !rulesFor("Postgres CDC into Iceberg with Spark").includes("title_case_headline"));
check("a question headline keeps its mark",
  rulesFor("What does compaction actually cost?").length === 0,
  JSON.stringify(rulesFor("What does compaction actually cost?")));
check("two short factual beats without an inversion",
  !rulesFor("We ran it for 30 days. The bill came to $70k.").includes("antithesis_beat"));

console.log("\nthe matrix null glyph is exempt from the em-dash rule");
// infographics.md prescribes a faint em dash for an empty comparison cell.
const matrix = {
  name: "matrix",
  slides: [{
    order: 0,
    html: `<div><h1 style="font-size:54px">Engine comparison</h1>` +
          `<svg viewBox="0 0 200 100"><text x="10" y="10" font-size="6.4">—</text>` +
          `<text x="40" y="10" font-size="6.4">—</text></svg></div>`,
  }],
};
const mv = gateDeck(matrix);
check("standalone — in a matrix cell does not trip emdash", !("emdash" in mv.byRule),
  JSON.stringify(Object.keys(mv.byRule)));
check("that matrix deck passes overall", mv.pass, JSON.stringify(Object.keys(mv.byRule)));

console.log("\nextractor");
const nodes = extractSlide(
  `<div style="font-size:58px"><span>Branching</span> was the easy half</div>` +
  `<p style="font-size:23px">A caption line about merging.</p>` +
  `<div style="display:inline-flex">CHANGE DATA CAPTURE</div>`
);
check("inherited font-size marks a div headline",
  nodes.some((n) => n.role === "headline" && n.text === "Branching was the easy half"),
  JSON.stringify(nodes));
check("inline span does not split the headline",
  !nodes.some((n) => n.text === "Branching"), JSON.stringify(nodes));
check("<p> is a caption",
  nodes.some((n) => n.role === "caption" && n.text.startsWith("A caption")));
check("short ALL-CAPS run is a label, not prose",
  nodes.some((n) => n.role === "label" && n.text === "CHANGE DATA CAPTURE"));

console.log(failed === 0 ? "\nall assertions passed" : `\n${failed} assertion(s) failed`);
process.exit(failed === 0 ? 0 : 1);
