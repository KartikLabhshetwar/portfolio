import type { APIRoute } from 'astro';
import { generateVisitorId, getRedis, trackVisit, getVisitorStats, type RedisEnv } from '../../lib/visitors';

export const prerender = false;

// In Astro v6 + Cloudflare adapter, runtime secrets are available via
// `cloudflare:workers` env module (both prod and dev via workerd).
// Fall back to process.env for plain Node.js environments (e.g. testing).
async function resolveEnv(): Promise<RedisEnv> {
  try {
    const cfModule = await import('cloudflare:workers' as any);
    return cfModule.env as RedisEnv;
  } catch {
    return typeof process !== 'undefined' ? (process.env as RedisEnv) : {};
  }
}

export const GET: APIRoute = async () => {
  const redis = getRedis(await resolveEnv());
  if (!redis) return Response.json({ success: false, uniqueVisitors: 0 });
  try {
    return Response.json({ success: true, ...(await getVisitorStats(redis)) });
  } catch {
    return Response.json({ success: false, uniqueVisitors: 0 }, { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const redis = getRedis(await resolveEnv());
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
