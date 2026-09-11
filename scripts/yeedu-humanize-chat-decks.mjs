// ════════════════════════════════════════════════════════════════
// Copy-only humanization pass for the two decks that were authored
// through the chat panel and therefore have no generator script.
//
// Every other deck's copy lives in its scripts/yeedu-*.mjs. These two
// exist only in data/carousels.json, so this script is their source of
// truth: it patches slide HTML through PUT /api/carousels/:id/slides/:slideId
// (never a direct fs write) and is idempotent — a replacement whose target
// is already gone is reported as "already applied", not as a failure.
//
//   node scripts/yeedu-humanize-chat-decks.mjs
//
// Rewrites are copy-only. No layout, no HTML structure, no numbers changed.
// ════════════════════════════════════════════════════════════════
const API = process.env.CARROUSEL_API || 'http://localhost:3000';

// Each entry is [find, replace] applied to the slide's stored HTML. The find
// strings are verbatim spans of the shipped markup, so a partial match is a
// bug rather than something to paper over.
const DECKS = [
  {
    id: 'c6e4149e-03cc-4c8f-87aa-38ce886c3956',
    name: 'Iceberg Compaction — Small Files Tax',
    edits: [
      // Sentence case throughout; the house Title Case was the loudest tell.
      ['>Compaction Can Cost <', '>Compaction can cost <'],
      ['>20&ndash;30&times; More</span>', '>20&ndash;30&times; more</span>'],

      // "Small Files Accumulate Faster Than Expected" — Title Case, and vague
      // where the slide itself carries the number that starts the pile-up.
      ['>Small Files Accumulate <', '>It starts at <'],
      ['>Faster Than Expected</span>', '>3% of rows changed</span>'],

      // "The Real Cost Isn't Where You'd Guess" — Title Case, and the actual
      // multiple is right there on the slide.
      [">The Real Cost Isn't <", '>You pay 29&times; for <'],
      [">Where You'd Guess</span>", '>the identical job</span>'],
      ['SAME COMPACTION JOB &mdash; ONE UNIT PER SQUARE',
       'SAME COMPACTION JOB &middot; ONE UNIT PER SQUARE'],

      // "Compaction Treats A Symptom. Fix The Disease Instead." — Title Case,
      // terminal period, and the two-beat symptom/disease shape.
      ['>Compaction Treats A Symptom. <', '>Fix the writer, <'],
      ['>Fix The Disease Instead.</span>', '>not the schedule</span>'],

      // The "30%" is its own styled span, so only the trailing clause is ours.
      ['>is the line. Past it, the table shape is the problem.<',
       '>is where we draw it. Past that, the table shape is the problem.<'],

      // The headline now says "fix the writer, not the schedule"; this label
      // said the same thing three lines below it.
      ['>change the strategy, not the schedule<',
       ">if it's over 30%, you can't schedule your way out<"],

      // A clause-break em dash that the extractor cannot see: it sits in its
      // own inline span, under the 4-word prose threshold the veto needs.
      ['never read again &mdash; still compacted',
       'never read again, still compacted'],

      // Stock carousel CTA -> a specific next action.
      ['Save this for your next cost review',
       'Run the ratio on your own table this week'],
    ],
  },
  {
    id: 'bf0395d4-05bc-4fd4-b948-9d48eed0c8ca',
    name: 'Database Branching — Git For Data',
    edits: [
      // "Branching Was The Easy Half. Merging Never Shipped." — Title Case,
      // terminal period, and the antithesis beat in its purest form.
      ['>Branching Was The Easy Half. <', '>Git for data, minus <'],
      ['>Merging Never Shipped.</span>', '>the merge</span>'],

      // "Branching Is Cheap. Storage Disagrees." — same beat again, one slide
      // later. Replaced with the write-amplification number the slide draws.
      ['>Branching Is Cheap. <', '>One row update, <'],
      ['>Storage Disagrees.</span>', '>16 page rewrites</span>'],

      ['>Only One Merges <', '>Only one of them <'],
      ['>At The Row Level</span>', '>merges rows</span>'],

      ["cannot reconcile rows they never tracked one by one",
       "can't reconcile rows they never tracked one by one"],

      [">Branching Isn't A <", ">Branching isn't <"],
      ['>Staging Replacement.</span>', '>a staging replacement</span>'],

      ['two branches need to become one &mdash; and that is the half of git that made it worth using.',
       "two branches need to become one, and that's the half of git that made it worth using."],

      ['Save this before your next branch',
       'Ask your vendor what it merges before you pick one'],
    ],
  },
];

const j = async (url, init) => {
  const r = await fetch(url, init);
  if (!r.ok) throw new Error(`${init?.method || 'GET'} ${url} -> ${r.status} ${await r.text()}`);
  return r.json();
};

let missed = 0;
for (const deck of DECKS) {
  console.log(`\n${deck.name}`);
  const carousel = await j(`${API}/api/carousels/${deck.id}`);
  const remaining = new Set(deck.edits.map(([find]) => find));

  for (const slide of carousel.slides) {
    let html = slide.html;
    const applied = [];
    for (const [find, replace] of deck.edits) {
      if (!html.includes(find)) continue;
      html = html.split(find).join(replace);
      remaining.delete(find);
      applied.push(find.slice(0, 48));
    }
    if (!applied.length) continue;
    await j(`${API}/api/carousels/${deck.id}/slides/${slide.id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ html }),
    });
    console.log(`  slide ${slide.order}: ${applied.length} edit(s)`);
    for (const a of applied) console.log(`    ${a}`);
  }

  for (const find of remaining) {
    // Already-rewritten copy is the expected state on a second run.
    console.log(`  already applied (or missing): ${find.slice(0, 60)}`);
    missed++;
  }
}

console.log(missed ? `\n${missed} target(s) not found` : '\nall edits applied');
