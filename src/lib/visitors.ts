import { Redis } from '@upstash/redis';

const KEY = 'unique_visitors';

export type RedisEnv = {
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
};

export function generateVisitorId(ip: string | null, userAgent: string | null, fingerprint?: string): string {
  const raw = `${ip ?? 'noip'}|${userAgent ?? 'noua'}|${fingerprint ?? 'nofp'}`;
  let h = 0;
  for (let i = 0; i < raw.length; i++) { h = (Math.imul(31, h) + raw.charCodeAt(i)) | 0; }
  return `v_${(h >>> 0).toString(36)}`;
}

// Construct the Upstash client from request-time env. On Cloudflare, runtime
// secrets live on locals.runtime.env (NOT process.env), so the caller resolves
// the env and passes it in. Returns null when creds are absent so the endpoint
// can degrade gracefully instead of throwing at module load.
export function getRedis(env: RedisEnv): Redis | null {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN });
}

export async function trackVisit(redis: Redis, visitorId: string): Promise<{ uniqueVisitors: number }> {
  await redis.sadd(KEY, visitorId);
  const uniqueVisitors = await redis.scard(KEY);
  return { uniqueVisitors };
}

export async function getVisitorStats(redis: Redis): Promise<{ uniqueVisitors: number }> {
  const uniqueVisitors = await redis.scard(KEY);
  return { uniqueVisitors };
}
