import type { APIRoute } from 'astro';
import { generateVisitorId, getRedis, trackVisit, getVisitorStats, type RedisEnv } from '../../lib/visitors';
import { resolveEnv } from '../../lib/env';

export const prerender = false;

export const GET: APIRoute = async () => {
  const redis = getRedis(await resolveEnv<RedisEnv>());
  if (!redis) return Response.json({ success: false, uniqueVisitors: 0 });
  try {
    return Response.json({ success: true, ...(await getVisitorStats(redis)) });
  } catch {
    return Response.json({ success: false, uniqueVisitors: 0 }, { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const redis = getRedis(await resolveEnv<RedisEnv>());
  if (!redis) return Response.json({ success: false, uniqueVisitors: 0 });
  try {
    const body = (await request.json().catch(() => ({}))) as { fingerprint?: string };
    const ua = request.headers.get('user-agent');
    const id = generateVisitorId(clientAddress ?? null, ua, body.fingerprint);
    return Response.json({ success: true, ...(await trackVisit(redis, id)) });
  } catch {
    return Response.json({ success: false, uniqueVisitors: 0 }, { status: 500 });
  }
};
