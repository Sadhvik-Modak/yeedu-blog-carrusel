// Re-export decks to output/<slug>/ without rebuilding their slides.
// Puppeteer occasionally drops the page mid-run ("Target closed"), so this
// retries each deck rather than forcing a full rebuild for a flaky screenshot.
//
//   node scripts/yeedu-reexport.mjs [carousel-id ...]
//
// With no arguments it re-exports every deck in data/carousels.json.
import { exportDeck } from './yeedu-chrome.mjs';

const API = process.env.CARROUSEL_API || 'http://localhost:3000';
const wanted = process.argv.slice(2);

const { carousels: decks } = await (await fetch(`${API}/api/carousels`)).json();
const targets = wanted.length ? decks.filter((c) => wanted.includes(c.id)) : decks;

let failed = 0;
for (const c of targets) {
  console.log(`${c.name}`);
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await exportDeck(c.id, c.name);
      break;
    } catch (err) {
      console.log(`  attempt ${attempt} failed: ${String(err.message).slice(0, 120)}`);
      if (attempt === 3) failed++;
    }
  }
}

console.log(failed ? `\n${failed} deck(s) did not export` : '\nall decks exported');
process.exit(failed ? 1 : 0);
