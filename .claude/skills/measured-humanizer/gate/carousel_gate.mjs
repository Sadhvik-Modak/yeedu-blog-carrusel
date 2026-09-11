#!/usr/bin/env node
/**
 * carousel_gate.mjs - anti-generic linter for Instagram carousel copy.
 *
 * WHY THIS EXISTS SEPARATELY FROM style_gate.js
 * ---------------------------------------------
 * style_gate.js scores a weighted composite against ranges fitted on long-form
 * technical prose. Those ranges cannot be applied to slide copy honestly:
 * `para_stdev` (weight 0.90 of 5.34, the heaviest dimension) only counts
 * paragraphs of >= 10 words, so a deck of 8-word lines contributes zero
 * paragraphs, pstdev of < 2 items returns 0, and 0 < lo (14.37) fails the
 * dimension outright. Failing para_stdev alone puts the composite at 0.831
 * against a 0.84 cutoff, so every carousel would "fail" for being short rather
 * than for being generated. `sent_stdev` breaks by the same mechanism.
 *
 * The skill is explicit about both halves of this:
 *   "Marketing copy, fiction and academic prose will each want their own fit."
 *   "Do not hand-edit the ranges - a guessed threshold is the taste-based
 *    approach with extra steps."
 *
 * So this gate ships NO invented thresholds. It runs:
 *   1. the upstream ABSOLUTE rules, which are per-instance and therefore
 *      length-independent, mirroring style_gate.js;
 *   2. rules derived from this repo's own observed output, which is the path
 *      upstream sanctions: "Expect to add rules here from observed output, not
 *      from lists."
 * Deck texture is measured with metrics() from style_gate.js and printed for
 * information. The composite is never computed as a pass condition.
 *
 * Exit code is always 0 (matching style_gate.js). Read `pass` from stdout.
 */

import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../..");
const { metrics } = require(path.join(HERE, "style_gate.js"));

const EMDASH = "—";
const ENDASH = "–";

// ---------------------------------------------------------------- patterns
// The first three mirror style_gate.js verbatim so both gates name the same
// defect the same way. Keep them in sync if the vendored copy is re-synced.
const PARALLELISM = [
  /\bnot (?:just |merely |simply )?[\w\s]{2,30}, but\b/gi,
  /\bisn't (?:just |merely )?[\w\s]{2,30}, it's\b/gi,
  /\bit's not [\w\s]{2,30}, it's\b/gi,
];
const DISCOURSE = [
  /\bthe real problem is\b/gi, /\bthe trade-?off is\b/gi,
  /\bthe catch is\b/gi, /\bnone of (?:this|that) means\b/gi,
  /\bthe mistake is\b/gi, /\bthe point is\b/gi, /\bthe fix is\b/gi,
  /\bthe question becomes\b/gi, /\bthe (?:problem|issue) is that\b/gi,
  /\bworth adopting\b/gi, /\bthe lesson is\b/gi,
];
const IS_THAT = [/\b(?:is|was)\s+that\b/gi];

// ---- derived from this repo's six shipped decks -------------------------
// Each pattern carries the verbatim string from data/carousels.json that
// motivated it, so a future reader can tell measurement from folklore.
const NEGATION_REFRAME = [
  // "The 2026 question is no longer which cluster is cheaper. It is which
  //  operating model you still want to be running in five years."
  /\bno longer\b[^.?!]{0,90}[.?!]\s*(?:it|that|the question|the answer)\s+(?:is|becomes)\b/gi,
  // "It is not a cost problem. It is an operating problem."
  /\bit\s+is\s+not\s+[^.?!]{2,70}[.?!]\s*it\s+is\b/gi,
];
const CTA_BOILERPLATE = [
  // These three are hardcoded in chat-system-prompt.ts today.
  /\bfollow for more\b/gi, /\bsave this\b/gi,
  /\bshare (?:this )?with someone who\b/gi,
  /\blink in bio\b/gi, /\bdouble[- ]tap\b/gi, /\blet that sink in\b/gi,
  /\bhere'?s the thing\b/gi, /\blet'?s dive in\b/gi,
  /\bwhich brings us to\b/gi,
];
// Domain proper nouns are legitimately capitalised mid-sentence and must not
// count as evidence of Title Case.
const PROPER = new Set([
  "iceberg", "spark", "yeedu", "emr", "aws", "gcp", "azure", "postgres",
  "postgresql", "mysql", "datadog", "databricks", "snowflake", "kafka",
  "flink", "trino", "presto", "airflow", "hive", "parquet", "glue", "athena",
  "redshift", "kubernetes", "delta", "hudi", "git", "github", "gitlab", "cdc",
  "sql", "api", "cli", "json", "yaml", "orc", "avro", "dbt", "looker",
  "tableau", "grafana", "prometheus", "opentelemetry", "elasticsearch",
  "splunk", "clickhouse", "duckdb", "pyspark", "scala", "python", "java",
  "linux", "docker", "terraform", "jupyter", "lakehouse", "iceberg's",
]);

const matches = (text, pats) => {
  const out = [];
  for (const p of pats) for (const m of text.matchAll(p)) out.push(m[0].trim());
  return out;
};
const words = (s) => s.match(/[\w'’-]+/g) || [];

// ---------------------------------------------------------------- extract
function clean(raw) {
  return raw
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#34;/g, '"')
    // Slides written through the chat path escape their punctuation, so an em
    // dash reaches us as `&mdash;` and would slip past the veto as literal text.
    .replace(/&mdash;/gi, EMDASH)
    .replace(/&ndash;/gi, ENDASH)
    .replace(/&#(?:8212|x2014);/gi, EMDASH)
    .replace(/&#(?:8211|x2013);/gi, ENDASH)
    .replace(/&(?:times|divide|rarr|larr|hellip|infin|check|cross);/gi, " ")
    .replace(/&#x?[0-9a-f]+;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

const VOID_TAGS = new Set(["img", "br", "hr", "input", "meta", "link", "source"]);
// Inline tags never own a text run; their text belongs to the block around them.
// em() wraps a headline fragment in a <span>, so without this the headline
// would be split into two nodes and neither would read as a sentence.
const INLINE_TAGS = new Set(["span", "b", "strong", "i", "em", "u", "small", "a", "tspan"]);
// Headlines are set by font size. Both markup styles exist in
// data/carousels.json: newer decks use headline() -> <h1>, older ones use a
// bare <div style="font-size:58px">.
const HEADLINE_PX = 40;

/**
 * Walk the slide HTML and return its visible copy tagged by role.
 *
 * A tokenizer rather than a regex per tag, because font-size is the only thing
 * separating a headline from body copy in the older decks, and font-size is
 * inherited: a regex cannot see that a <div> is a headline because an ancestor
 * set font-size:58px.
 */
export function extractSlide(html) {
  const src = html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ");

  const nodes = [];
  const seen = new Set();
  const push = (role, text) => {
    if (!text) return;
    const key = role + " " + text;
    if (seen.has(key)) return;
    seen.add(key);
    nodes.push({ role, text });
  };

  const fontSizeOf = (attrs) => {
    const css = /font-size:\s*(\d+(?:\.\d+)?)px/i.exec(attrs);
    if (css) return parseFloat(css[1]);
    const attr = /\bfont-size\s*=\s*["']?(\d+(?:\.\d+)?)/i.exec(attrs);
    return attr ? parseFloat(attr[1]) : null;
  };

  // Each stack frame accumulates the text of its whole subtree.
  const root = { tag: "#root", px: null, inSvg: false, buf: "" };
  const stack = [root];
  const top = () => stack[stack.length - 1];

  const close = () => {
    const frame = stack.pop();
    // Only the innermost block that owns a run of text emits. Without this an
    // outer wrapper would re-emit its whole subtree as one node and glue
    // unrelated lines into sentences that were never on the slide.
    if (!INLINE_TAGS.has(frame.tag) && !frame.hasBlockEmit) {
      const t = clean(frame.buf);
      let role;
      if (frame.tag === "text") role = "annot";
      else if (frame.tag === "h1" || frame.tag === "h2") role = "headline";
      else if (frame.tag === "p") role = "caption";
      // The px heuristic only applies outside <svg>: inside, font-size is in
      // viewBox units (annot() uses 6.4 to 20) and means nothing in pixels.
      else if (!frame.inSvg && frame.px !== null && frame.px >= HEADLINE_PX) role = "headline";
      // Short ALL-CAPS runs are eyebrow chips and axis labels, not prose.
      else if (t && t === t.toUpperCase() && words(t).length <= 6) role = "label";
      else role = "other";
      if (t) {
        push(role, t);
        top().hasBlockEmit = true;
      }
    } else if (frame.hasBlockEmit) {
      top().hasBlockEmit = true;
    }
    top().buf += " " + frame.buf;
  };

  const TOKEN = /<\/?([a-zA-Z][a-zA-Z0-9]*)((?:"[^"]*"|'[^']*'|[^>])*?)(\/?)>/g;
  let last = 0;
  let m;
  while ((m = TOKEN.exec(src)) !== null) {
    const between = src.slice(last, m.index);
    if (between.trim()) top().buf += " " + between;
    last = TOKEN.lastIndex;

    const [raw, rawTag, attrs, selfClose] = m;
    const tag = rawTag.toLowerCase();

    if (raw[1] === "/") {
      // Unwind to the matching open tag, tolerating unbalanced markup.
      const at = stack.map((f) => f.tag).lastIndexOf(tag);
      if (at > 0) while (stack.length > at) close();
      continue;
    }
    if (selfClose || VOID_TAGS.has(tag)) continue;

    const parent = top();
    stack.push({
      tag,
      px: fontSizeOf(attrs) ?? parent.px,
      inSvg: parent.inSvg || tag === "svg",
      buf: "",
    });
  }
  if (src.slice(last).trim()) top().buf += " " + src.slice(last);
  while (stack.length > 1) close();

  return nodes;
}

// ---------------------------------------------------------------- rules
function isTitleCase(text) {
  const w = words(text);
  if (w.length < 4) return false;
  // Skip the first word: a capital there is just a sentence start.
  const eligible = w.slice(1).filter(
    (x) => x.length >= 4 && /^[A-Za-z]/.test(x) && !PROPER.has(x.toLowerCase())
  );
  if (eligible.length < 3) return false;
  const capped = eligible.filter((x) => /^[A-Z]/.test(x)).length;
  return capped / eligible.length >= 0.6;
}

function endsWithPeriod(text) {
  const t = text.trim();
  if (!/\.$/.test(t) || /\.\.\.$/.test(t)) return false;
  // Not a trailing abbreviation ("v1.", "etc.")
  return !/\b[A-Za-z]\.$/.test(t);
}

/**
 * Two short adjacent beats where the second inverts the first.
 *   "Storage is cheap. Compaction is not."
 *   "Branching Was The Easy Half. Merging Never Shipped."
 */
function antithesisBeats(text) {
  const parts = text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
  const hits = [];
  for (let i = 0; i + 1 < parts.length; i++) {
    const a = parts[i];
    const b = parts[i + 1];
    if (words(a).length > 9 || words(b).length > 9) continue;
    const asserts = /\b(?:is|are|was|were|has|have|had|does|did)\b/i.test(a);
    const inverts =
      /\b(?:is|are|was|were|does|did|has|have)\s+not\b/i.test(b) ||
      /\bnever\b/i.test(b) ||
      /\b(?:isn|wasn|aren|weren|doesn|didn|hasn|haven|won|can)'?t\b/i.test(b);
    if (asserts && inverts) hits.push(a + " " + b);
  }
  return hits;
}

/**
 * An em dash inside a prose run. The standalone glyph that infographics.md
 * prescribes for an empty comparison-matrix cell is deliberately exempt, which
 * is why this requires >= 4 words in the same text node.
 */
function emdashInProse(text) {
  if (words(text).length < 4) return [];
  const hits = [];
  if (text.includes(EMDASH)) hits.push(EMDASH);
  if (/\s--\s/.test(text)) hits.push("--");
  if (new RegExp("\\s" + ENDASH + "\\s").test(text)) hits.push(ENDASH + " (en dash as clause break)");
  return hits;
}

// ---------------------------------------------------------------- gate
export function gateDeck(deck) {
  const slides = deck.slides
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((s, i) => ({ n: i + 1, nodes: extractSlide(s.html) }));

  const findings = [];
  const add = (rule, severity, n, role, text, found) =>
    findings.push({ rule, severity, slide: n, role, text, found });

  const headlineShapes = { titleCase: 0, terminalPeriod: 0, total: 0 };

  for (const s of slides) {
    for (const { role, text } of s.nodes) {
      // --- upstream absolute rules (per-instance, length-independent) ---
      for (const f of matches(text, PARALLELISM)) add("parallelism", 10, s.n, role, text, f);
      for (const f of matches(text, DISCOURSE)) add("discourse_markers", 9, s.n, role, text, f);
      for (const f of matches(text, IS_THAT)) add("is_that_filler", 9, s.n, role, text, f);
      for (const f of emdashInProse(text)) add("emdash", 9, s.n, role, text, f);

      // --- derived from this repo's shipped output ---
      for (const f of matches(text, NEGATION_REFRAME)) add("negation_reframe", 9, s.n, role, text, f);
      for (const f of matches(text, CTA_BOILERPLATE)) add("cta_boilerplate", 9, s.n, role, text, f);
      for (const f of antithesisBeats(text)) add("antithesis_beat", 9, s.n, role, text, f);

      if (role === "headline") {
        headlineShapes.total++;
        if (isTitleCase(text)) {
          headlineShapes.titleCase++;
          add("title_case_headline", 9, s.n, role, text, text);
        }
        if (endsWithPeriod(text)) {
          headlineShapes.terminalPeriod++;
          add("headline_terminal_period", 9, s.n, role, text, text);
        }
      }
    }
  }

  // Deck-level texture, reported only. No fitted ranges exist for this length.
  const prose = slides
    .flatMap((s) => s.nodes.filter((n) => n.role !== "label").map((n) => n.text))
    .join("\n\n");
  const m = metrics(prose);

  const byRule = {};
  for (const f of findings) (byRule[f.rule] ||= []).push(f);

  return {
    pass: !findings.some((f) => f.severity >= 9),
    composite: null, // deliberately not scored; see the header comment
    slides: slides.length,
    findings,
    byRule,
    headlineShapes,
    texture: {
      words: m.words,
      emdash_rate: m.emdash_rate,
      contraction_rate: m.contraction_rate,
      first_person_rate: m.first_person_rate,
      concrete_rate: m.concrete_rate,
    },
  };
}

/** How much a deck's headline shapes look like the rest of the house. */
export function fingerprint(all) {
  return all.map(({ deck, verdict }) => {
    const t = verdict.headlineShapes.total || 1;
    return {
      name: deck.name,
      titleCase: verdict.headlineShapes.titleCase / t,
      terminalPeriod: verdict.headlineShapes.terminalPeriod / t,
      antithesis: (verdict.byRule.antithesis_beat || []).length,
    };
  });
}

// ---------------------------------------------------------------- cli
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function loadDecks() {
  const p = path.join(REPO, "data", "carousels.json");
  if (!existsSync(p)) {
    console.error("no carousels file at " + p);
    process.exit(2);
  }
  return JSON.parse(readFileSync(p, "utf8")).carousels;
}

function report(deck, v, brief) {
  console.log(
    (v.pass ? "PASS" : "FAIL") + "  " + deck.name +
    "  (" + v.slides + " slides, " + v.texture.words + " words)"
  );
  const rules = Object.keys(v.byRule).sort((a, b) => v.byRule[b].length - v.byRule[a].length);
  if (rules.length) {
    console.log("  failing=" + rules.length + ": " + rules.join(", "));
    const worst = v.byRule[rules[0]][0];
    console.log("  worst=" + rules[0] + " slide=" + worst.slide + " role=" + worst.role);
    console.log("    found: " + JSON.stringify(worst.found));
    console.log("    in:    " + JSON.stringify(worst.text.slice(0, 120)));
  }
  if (brief) return;
  console.log("  composite=n/a (uncalibrated at slide length; see reference/carousel-adaptation.md)");
  for (const r of rules) {
    console.log("  [" + r + "] " + v.byRule[r].length + " hit(s)");
    for (const f of v.byRule[r]) {
      console.log("    s" + f.slide + " " + f.role + ": " + JSON.stringify(f.found.slice(0, 90)));
    }
  }
  const t = v.texture;
  console.log("  texture/1k: emdash=" + t.emdash_rate + " contraction=" + t.contraction_rate +
    " first_person=" + t.first_person_rate + " concrete=" + t.concrete_rate);
  console.log("  headlines: " + v.headlineShapes.titleCase + "/" + v.headlineShapes.total +
    " Title Case, " + v.headlineShapes.terminalPeriod + "/" + v.headlineShapes.total + " end in a period");
}

function main() {
  const argv = process.argv.slice(2);
  const has = (f) => argv.includes(f);
  const val = (f) => {
    const i = argv.indexOf(f);
    return i >= 0 ? argv[i + 1] : null;
  };

  const decks = loadDecks();
  const target = val("--carousel");
  let selected;
  if (has("--all") || !target) {
    selected = decks;
  } else {
    const q = slug(target);
    selected = decks.filter((d) => d.id === target || slug(d.name) === q || slug(d.name).includes(q));
    if (!selected.length) {
      console.error("no carousel matching " + JSON.stringify(target) + ". available:");
      for (const d of decks) console.error("  " + d.id + "  " + slug(d.name));
      process.exit(2);
    }
  }

  const all = selected.map((deck) => ({ deck, verdict: gateDeck(deck) }));

  if (has("--json")) {
    console.log(JSON.stringify(
      all.map(({ deck, verdict }) => ({ id: deck.id, name: deck.name, ...verdict })), null, 1));
    return;
  }

  const brief = has("--brief");
  for (const { deck, verdict } of all) {
    report(deck, verdict, brief);
    console.log("");
  }

  if (all.length > 1) {
    console.log("house fingerprint (share of headlines per deck):");
    for (const r of fingerprint(all)) {
      console.log(
        "  " + (r.titleCase * 100).toFixed(0).padStart(3) + "% TitleCase  " +
        (r.terminalPeriod * 100).toFixed(0).padStart(3) + "% period  " +
        String(r.antithesis).padStart(2) + " antithesis   " + r.name
      );
    }
    const failed = all.filter((a) => !a.verdict.pass).length;
    console.log("\n" + (all.length - failed) + "/" + all.length + " decks pass.");
  }
}

if (import.meta.url === "file://" + process.argv[1]) main();
