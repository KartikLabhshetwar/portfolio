import { Redis } from '@upstash/redis';

const KEY = 'unique_visitors';

export type RedisEnv = {
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
};

export function generateVisitorId(ip: string | null, userAgent: string | null, fingerprint?: string): string {
  // A real browser fingerprint is stable across networks, so key on it alone —
  // IP+UA change when the same person switches WiFi/cellular and would
  // otherwise count as new visitors. Fall back to an IP+UA hash only when no
  // fingerprint is sent (e.g. JS disabled, or the client request failed).
  if (fingerprint) return `fp_${fingerprint}`;
  const raw = `${ip ?? 'noip'}|${userAgent ?? 'noua'}`;
  let h = 0;
  for (let i = 0; i < raw.length; i++) { h = (Math.imul(31, h) + raw.charCodeAt(i)) | 0; }
  return `v_${(h >>> 0).toString(36)}`;
}

// Construct the Upstash client from request-time env. On Cloudflare, secrets
// are read from the `cloudflare:workers` env module by the caller and passed in
// here. Returns null when creds are absent so the endpoint can degrade
// gracefully instead of throwing at module load.
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
