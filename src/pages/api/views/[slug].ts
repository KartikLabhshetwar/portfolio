import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { resolveEnv } from '../../../lib/env';
import { getRedis, type RedisEnv } from '../../../lib/ratelimit';
import { trackPostView } from '../../../lib/post-views';

export const prerender = false;

const slugs = new Set(
  (await getCollection('blog', ({ data }) => !data.draft)).map((post) => post.id.replace(/\/index$/, '')),
);

export const POST: APIRoute = async ({ params, cookies, request }) => {
  const slug = params.slug ?? '';
  if (!slugs.has(slug)) return Response.json({ error: 'Post not found.' }, { status: 404 });

  const redis = getRedis(await resolveEnv<RedisEnv>());
  if (!redis) return Response.json({ configured: false, views: 0 });

  let readerId = cookies.get('reader_id')?.value;
  if (!readerId) {
    readerId = crypto.randomUUID();
    cookies.set('reader_id', readerId, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: new URL(request.url).protocol === 'https:',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  try {
    const views = await trackPostView(redis, slug, readerId);
    return Response.json({ configured: true, views }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ configured: false, views: 0 }, { status: 503 });
  }
};
