import { describe, it, expect, vi } from 'vitest';
import { generateVisitorId, getRedis, trackVisit, getVisitorStats } from '../src/lib/visitors';

describe('generateVisitorId', () => {
  it('is stable for the same inputs', () => {
    expect(generateVisitorId('1.2.3.4', 'UA', 'fp')).toBe(generateVisitorId('1.2.3.4', 'UA', 'fp'));
  });
  it('differs for different inputs', () => {
    expect(generateVisitorId('1.1.1.1', 'UA')).not.toBe(generateVisitorId('2.2.2.2', 'UA'));
  });
});

describe('getRedis', () => {
  it('returns null when creds are missing', () => {
    expect(getRedis({})).toBeNull();
  });
  it('returns a client when creds are present', () => {
    expect(getRedis({ UPSTASH_REDIS_REST_URL: 'https://test.upstash.io', UPSTASH_REDIS_REST_TOKEN: 't' })).not.toBeNull();
  });
});

describe('visitor stats', () => {
  // Pass a fake redis instance — no need to mock the module.
  const redis = { sadd: vi.fn().mockResolvedValue(1), scard: vi.fn().mockResolvedValue(7) } as any;
  it('trackVisit adds the id and returns uniqueVisitors from scard', async () => {
    expect(await trackVisit(redis, 'id')).toEqual({ uniqueVisitors: 7 });
    expect(redis.sadd).toHaveBeenCalledWith('unique_visitors', 'id');
  });
  it('getVisitorStats returns uniqueVisitors', async () => {
    expect(await getVisitorStats(redis)).toEqual({ uniqueVisitors: 7 });
  });
});
