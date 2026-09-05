import type { APIRoute } from 'astro';
import type { RequestInitCfProperties } from '@cloudflare/workers-types';

export const prerender = false;

export const GET: APIRoute = async ({ params, url }) => {
  const username = params.username ?? '';
  const resource = url.searchParams.get('resource');
  if (!/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(username) ||
      (resource !== 'calendar' && resource !== 'repos')) {
    return Response.json({ error: 'Invalid GitHub activity request.' }, { status: 400 });
  }

  const upstream = resource === 'calendar'
    ? `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
    : `https://api.github.com/users/${username}/events/public?per_page=100`;

  try {
    const options = {
      headers: { Accept: 'application/json', 'User-Agent': 'kartik-portfolio' },
      signal: AbortSignal.timeout(5000),
      cf: { cacheEverything: true, cacheTtlByStatus: { '200-299': 3600, '300-599': 0 } },
    } satisfies RequestInit & { cf: RequestInitCfProperties };
    const response = await fetch(upstream, options);
    if (!response.ok) throw new Error(`GitHub activity: ${response.status}`);
    return new Response(response.body, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch {
    return Response.json({ error: 'GitHub activity is temporarily unavailable.' }, {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
};
