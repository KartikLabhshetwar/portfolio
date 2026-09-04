import { describe, expect, it, vi } from 'vitest';
import { trackPostView } from '../src/lib/post-views';

describe('trackPostView', () => {
  it('adds a reader to the post set and returns the unique count', async () => {
    const redis = { sadd: vi.fn().mockResolvedValue(1), scard: vi.fn().mockResolvedValue(42) } as any;
    await expect(trackPostView(redis, 'an-article', 'reader-1')).resolves.toBe(42);
    expect(redis.sadd).toHaveBeenCalledWith('post_views:an-article', 'reader-1');
    expect(redis.scard).toHaveBeenCalledWith('post_views:an-article');
  });
});
