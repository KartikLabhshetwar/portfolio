import { Redis } from '@upstash/redis';

export type RedisEnv = {
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
};

export function getRedis(env: RedisEnv): Redis | null {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN });
}

// Fixed-window counter: allow `limit` hits per `windowS` seconds, keyed by `id`
// (e.g. an IP). The first hit sets the TTL and the key self-expires, so there's
// nothing to sweep. Callers skip the check when Redis credentials are absent.
//
// ponytail: fixed-window can allow up to 2× `limit` across a window boundary,
// and a crash between incr/expire could leave one key without a TTL. Fine for a
// signup brake; swap in @upstash/ratelimit's sliding window if abuse gets clever.
export async function rateLimited(
  redis: Redis,
  id: string,
  limit = 5,
  windowS = 600,
): Promise<boolean> {
  const key = `rl:${id}`;
  const n = await redis.incr(key);
  if (n === 1) await redis.expire(key, windowS);
  return n > limit;
}
