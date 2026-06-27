import { describe, it, expect, vi } from 'vitest';
import { rateLimited } from '../src/lib/ratelimit';

// Fake redis whose incr counts up from `start`; no module mocking needed.
const fakeRedis = (start = 0) => {
  let n = start;
  return { incr: vi.fn(async () => ++n), expire: vi.fn().mockResolvedValue(1) } as any;
};

describe('rateLimited', () => {
  it('allows hits up to the limit and sets the TTL only on the first', async () => {
    const r = fakeRedis();
    expect(await rateLimited(r, 'ip', 2, 600)).toBe(false); // n=1
    expect(r.expire).toHaveBeenCalledWith('rl:ip', 600);
    expect(await rateLimited(r, 'ip', 2, 600)).toBe(false); // n=2
    expect(r.expire).toHaveBeenCalledTimes(1);
  });

  it('blocks once over the limit', async () => {
    const r = fakeRedis(2); // next incr -> 3 > 2
    expect(await rateLimited(r, 'ip', 2, 600)).toBe(true);
  });
});
