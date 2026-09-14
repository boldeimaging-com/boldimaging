/**
 * Turning page copy into a meta description that fits.
 *
 * The 160-character bound in SEO.astro is where Google truncates. A longer
 * description is not rejected by anyone, it is simply invisible past the cut —
 * so the useful thing is to end on a whole word, deliberately, rather than let
 * a search engine slice mid-syllable.
 *
 * Every portfolio body on this site is between 160 and 371 characters, so this
 * runs on almost every page rather than being a rare edge case.
 */

const MAX = 160;
const MIN = 50;

/**
 * Prefer a whole sentence that fits; otherwise cut on a word boundary and mark
 * the cut with an ellipsis.
 */
export function metaDescription(body: string, fallback: string): string {
  const text = body.replace(/\s+/g, ' ').trim();
  if (!text || text.length < MIN) return clamp(fallback);
  if (text.length <= MAX) return text;

  // A run of complete sentences that still fits reads better than a hard cut.
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [];
  let built = '';
  for (const s of sentences) {
    if ((built + s).trim().length > MAX) break;
    built += s;
  }
  built = built.trim();
  if (built.length >= MIN) return built;

  // Otherwise trim to the last space that leaves room for the ellipsis.
  const cut = text.slice(0, MAX - 1);
  const atWord = cut.slice(0, cut.lastIndexOf(' '));
  return `${(atWord.length >= MIN ? atWord : cut).replace(/[,;:\s]+$/, '')}…`;
}

/** Last resort: keep a generated fallback inside the same bounds. */
function clamp(s: string): string {
  const t = s.replace(/\s+/g, ' ').trim();
  if (t.length <= MAX) return t;
  const cut = t.slice(0, MAX - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:\s]+$/, '')}…`;
}

/**
 * Used where a page has no copy of its own to describe it — the empty
 * portfolio body, and the category archives, which are lists rather than
 * written pages.
 */
export function describeListing(what: string): string {
  return clamp(
    `${what} manufactured and installed by BolDe Imaging, signage specialists in ` +
      `Mississauga since 1976. Interior and exterior signage, coast to coast.`,
  );
}
