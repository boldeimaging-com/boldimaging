import type { APIRoute } from 'astro';
import { getUploadStore } from '../../lib/uploads';

/**
 * GET /work-media/<name> — an image uploaded for an Our Work entry at
 * /admin/work/.
 *
 * The uploads bucket is private, so the image is streamed through this site
 * rather than linked directly. Every upload gets a new timestamped name and is
 * never overwritten, so it can be cached as immutable, like /media.
 */
export const prerender = false;

const NAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,200}\.(jpg|png|webp)$/;

export const GET: APIRoute = async ({ params }) => {
  const name = params.name ?? '';
  const store = getUploadStore();
  if (!NAME.test(name) || !store) return new Response('Not found', { status: 404 });

  const res = await store.get(`work/${name}`).catch(() => null);
  if (!res?.ok || !res.body) return new Response('Not found', { status: res?.status === 404 ? 404 : 502 });

  return new Response(res.body, {
    headers: {
      'content-type': res.headers.get('content-type') ?? 'application/octet-stream',
      ...(res.headers.get('content-length') ? { 'content-length': res.headers.get('content-length')! } : {}),
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
};
