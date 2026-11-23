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

/**
 * Below this a description leaves most of the snippet empty. Four portfolio
 * bodies come in at 75-107 characters ("Whether you need a short banner or the
 * longest banner, we have you covered.") and say nothing about who or where.
 */
const SHORT = 110;

/**
 * Add who and where to a description too short to carry them, choosing the
 * longest suffix that still fits inside MAX. A description that is already
 * long enough, or that no suffix fits, is returned unchanged. The facts are
 * the ones the footer and JSON-LD already state (Mississauga, since 1976).
 */
export function withBusinessContext(description: string, what: string): string {
  const d = description.trim();
  if (d.length >= SHORT) return d;
  const suffixes = [
    `${what} by BolDe Imaging, signage manufacturer in Mississauga since 1976.`,
    `BolDe Imaging, signage manufacturer in Mississauga since 1976.`,
    `BolDe Imaging, Mississauga.`,
  ];
  for (const s of suffixes) {
    const out = `${d} ${s}`;
    if (out.length <= MAX) return out;
  }
  return d;
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
