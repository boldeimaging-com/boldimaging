import type { APIRoute } from 'astro';
import { getReps } from '../../lib/settings';

/**
 * GET /api/reps — the /ftp/ "Your Rep" choices, as edited at /admin/.
 *
 * /ftp/ stays prerendered with the built-in list in its markup and swaps in
 * this list when the page loads, so a rep added or removed in the admin shows
 * up without a rebuild, and the page still works if this request fails.
 * Names and addresses only: the address is already the select's value.
 */
export const prerender = false;

export const GET: APIRoute = async () => {
  const { reps } = await getReps();
  return new Response(JSON.stringify(reps.map(({ name, email }) => ({ name, email }))), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
};
