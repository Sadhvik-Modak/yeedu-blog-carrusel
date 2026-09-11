// ════════════════════════════════════════════════════════════════
// One-off: widen the gradient box on every shipped em() fragment.
//
// em() paints its italic text with `background-clip:text`, so the
// gradient is masked to the span's *padding box*. That box ends at the
// last glyph's advance width, and an italic glyph overhangs its advance
// — so the right edge of the final letter was being shaved off. On the
// EMR deck it was bad enough to change a word: "not the logo" rendered
// as "not the logc".
//
// The fix lives in scripts/yeedu-chrome.mjs (padding-right on the span),
// so every future rebuild is already correct. This script carries the
// same fix to the decks that are already built, through the API rather
// than a rebuild — a rebuild would issue new carousel ids for six decks
// to repair a style attribute.
//
//   node scripts/yeedu-patch-em-clip.mjs
//
// Idempotent: a slide that already carries the padding is skipped.
// ════════════════════════════════════════════════════════════════
const API = process.env.CARROUSEL_API || 'http://localhost:3000';

// The exact style em() emits. Matching the whole declaration list keeps
// this off the other gradient-filled text in the decks (hero numbers,
// which are centred and would shift if they gained right padding).
const FIND = 'font-weight:300;font-style:italic;background:linear-gradient(180deg,#fff,#ff8a3d);-webkit-background-clip:text;background-clip:text;color:transparent;';
const REPLACE = `${FIND}padding-right:0.12em;`;

const j = async (url, init) => {
  const r = await fetch(url, init);
  if (!r.ok) throw new Error(`${init?.method || 'GET'} ${url} -> ${r.status} ${await r.text()}`);
  return r.json();
};

const { carousels } = await j(`${API}/api/carousels`);
let patched = 0;

for (const deck of carousels) {
  const carousel = await j(`${API}/api/carousels/${deck.id}`);
  const touched = [];

  for (const slide of carousel.slides) {
    if (!slide.html.includes(FIND)) continue;
    const html = slide.html.split(FIND).join(REPLACE);
    await j(`${API}/api/carousels/${deck.id}/slides/${slide.id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ html }),
    });
    touched.push(slide.order);
    patched++;
  }

  console.log(touched.length ? `${deck.name}\n  slides ${touched.join(', ')}` : `${deck.name}\n  nothing to patch`);
}

console.log(`\n${patched} slide(s) patched`);
