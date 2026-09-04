import type { Redis } from '@upstash/redis';

const key = (slug: string) => `post_views:${slug}`;

// ponytail: exact Redis sets are cheap at portfolio scale; use HyperLogLog if
// readership reaches millions and approximate counts become the better tradeoff.
export async function trackPostView(redis: Redis, slug: string, readerId: string): Promise<number> {
  await redis.sadd(key(slug), readerId);
  return redis.scard(key(slug));
}
