/**
 * The "Our Work" entries, from Postgres (portfolio_items), edited at
 * /admin/work/. See migrations/0004_portfolio.sql.
 *
 * /services/, /portfolio/<slug>/ and the two sitemaps that list them render on
 * demand from getPortfolio(), so an entry the client adds is live at once,
 * the way a blog post would be. Reads never throw: if Postgres is unreachable
 * they fall back to src/data/portfolio.ts, the committed seed, which is what
 * the site showed before this table existed.
 */
import { getPool, moveByPosition } from './db';
import { media } from '../consts';
import { PORTFOLIO, type PortfolioItem } from '../data/portfolio';
import { LASTMOD } from '../data/lastmod';

export interface WorkItem extends PortfolioItem {
  id: number | null;
  /** ISO timestamp of the last content edit; the portfolio sitemap's <lastmod>. */
  updatedAt: string | null;
}

/** The two categories the site has archive pages for. */
export const CATEGORIES = ['Exterior', 'Interior'] as const;

/**
 * Longest title the page can carry: SEO.astro allows 70 characters and the
 * page title adds " – BolDe Imaging" (16).
 */
export const MAX_TITLE = 54;

/** Uploaded images are served from the bucket at this address. */
export const WORK_MEDIA = '/work-media/';

/** An image reference as stored -> a URL the page can use. */
export const workImage = (src: string) => (src.startsWith('/') ? src : media(src));

/** Body copy as paragraphs; a blank line starts a new one. */
export const paragraphs = (body: string) =>
  body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

const FALLBACK: WorkItem[] = PORTFOLIO.map((p) => ({
  ...p,
  id: null,
  updatedAt: LASTMOD[`/portfolio/${p.slug}/`] ?? null,
}));

interface Row {
  id: string;
  slug: string;
  title: string;
  body: string;
  categories: string[];
  grid: string;
  image: string;
  image_width: number;
  image_height: number;
  updated_at: Date;
}

const fromRow = (r: Row): WorkItem => ({
  id: Number(r.id),
  slug: r.slug,
  title: r.title,
  body: r.body,
  categories: r.categories,
  grid: r.grid,
  image: r.image,
  imageWidth: r.image_width,
  imageHeight: r.image_height,
  updatedAt: r.updated_at.toISOString().replace(/\.\d{3}Z$/, '+00:00'),
});

const COLUMNS = 'id, slug, title, body, categories, grid, image, image_width, image_height, updated_at';

const problem = (e: unknown) => (e instanceof Error ? e.message : String(e)).slice(0, 300);

export async function getPortfolio(): Promise<{
  items: WorkItem[];
  source: 'database' | 'fallback';
  error?: string;
}> {
  const db = getPool();
  if (!db) return { items: FALLBACK, source: 'fallback', error: 'no DATABASE_URL' };
  try {
    const res = await db.query<Row>(`SELECT ${COLUMNS} FROM portfolio_items ORDER BY position, id`);
    return { items: res.rows.map(fromRow), source: 'database' };
  } catch (e) {
    console.error('[portfolio] falling back to the committed list:', problem(e));
    return { items: FALLBACK, source: 'fallback', error: problem(e) };
  }
}

export async function getWorkItem(id: number): Promise<WorkItem | null> {
  const db = getPool();
  if (!db) throw new Error('DATABASE_URL is not set');
  const res = await db.query<Row>(`SELECT ${COLUMNS} FROM portfolio_items WHERE id = $1`, [id]);
  return res.rows[0] ? fromRow(res.rows[0]) : null;
}

/** Checked before an upload, so a clashing title does not leave an orphaned image in the bucket. */
export async function slugTaken(slug: string): Promise<boolean> {
  const res = await requirePool().query('SELECT 1 FROM portfolio_items WHERE slug = $1', [slug]);
  return Boolean(res.rowCount);
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');
}

export interface WorkFields {
  title: string;
  body: string;
  categories: string[];
  /** Only when a new image was uploaded. */
  image?: { src: string; width: number; height: number };
}

function requirePool() {
  const db = getPool();
  if (!db) throw new Error('DATABASE_URL is not set');
  return db;
}

const isUniqueViolation = (e: unknown) => (e as { code?: string })?.code === '23505';

/** Adds the entry at the end of the list and returns its id. */
export async function createWorkItem(slug: string, f: WorkFields & { image: NonNullable<WorkFields['image']> }) {
  try {
    const res = await requirePool().query<{ id: string }>(
      `INSERT INTO portfolio_items
         (slug, title, body, categories, grid, image, image_width, image_height, position)
       SELECT $1, $2, $3, $4, $5, $5, $6, $7, COALESCE(MAX(position), 0) + 1 FROM portfolio_items
       RETURNING id`,
      [slug, f.title, f.body, f.categories, f.image.src, f.image.width, f.image.height],
    );
    return Number(res.rows[0].id);
  } catch (e) {
    if (isUniqueViolation(e)) throw new Error(`There is already an entry at /portfolio/${slug}/. Try a different title.`);
    throw e;
  }
}

export async function updateWorkItem(id: number, f: WorkFields) {
  const res = f.image
    ? await requirePool().query(
        `UPDATE portfolio_items SET title = $2, body = $3, categories = $4,
           grid = $5, image = $5, image_width = $6, image_height = $7, updated_at = now()
         WHERE id = $1`,
        [id, f.title, f.body, f.categories, f.image.src, f.image.width, f.image.height],
      )
    : await requirePool().query(
        `UPDATE portfolio_items SET title = $2, body = $3, categories = $4, updated_at = now()
         WHERE id = $1`,
        [id, f.title, f.body, f.categories],
      );
  if (!res.rowCount) throw new Error('That entry no longer exists.');
}

/**
 * The uploaded image stays in the bucket: it is small, and keeping it means a
 * mistaken removal loses only the row.
 */
export async function removeWorkItem(id: number) {
  const res = await requirePool().query('DELETE FROM portfolio_items WHERE id = $1', [id]);
  if (!res.rowCount) throw new Error('That entry no longer exists.');
}

export const moveWorkItem = (id: number, dir: -1 | 1) => moveByPosition('portfolio_items', id, dir);
