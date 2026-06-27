import { describe, it, expect, vi, afterEach } from 'vitest';
import { parseRepo, fetchRepoStars, fetchSponsors } from '../src/lib/github';

describe('parseRepo', () => {
  it('parses owner/repo from a github url', () => {
    expect(parseRepo('https://github.com/KartikLabhshetwar/better-shot')).toEqual({
      owner: 'KartikLabhshetwar', repo: 'better-shot',
    });
  });
  it('strips trailing slash and .git', () => {
    expect(parseRepo('https://github.com/a/b.git/')).toEqual({ owner: 'a', repo: 'b' });
  });
  it('returns null for non-repo urls', () => {
    expect(parseRepo('https://github.com/KartikLabhshetwar')).toBeNull();
  });
});

afterEach(() => vi.unstubAllGlobals());

describe('fetchRepoStars', () => {
  it('returns stargazers_count', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true, json: async () => ({ stargazers_count: 42 }),
    }));
    expect(await fetchRepoStars('a', 'b')).toBe(42);
  });
  it('returns 0 on error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    expect(await fetchRepoStars('a', 'b')).toBe(0);
  });
});

describe('fetchSponsors', () => {
  it('maps amount + all-time total, sorted by total desc', async () => {
    // Freeze "now" so the recurring total is deterministic.
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-20T12:00:00Z'));
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { viewer: { sponsorshipsAsMaintainer: { nodes: [
        { isOneTimePayment: false, createdAt: '2025-12-15T12:00:00Z', tier: { monthlyPriceInDollars: 2 }, sponsorEntity: { login: 'octocat', name: 'The Octocat', url: 'https://github.com/octocat', avatarUrl: 'https://x/y.png' } },
        { isOneTimePayment: true, createdAt: '2026-01-01T12:00:00Z', tier: { monthlyPriceInDollars: 20 }, sponsorEntity: { login: 'mona', name: null, url: 'https://github.com/mona', avatarUrl: 'https://x/m.png' } },
      ] } } } }),
    }));
    process.env.GITHUB_TOKEN = 'tok';
    const s = await fetchSponsors();
    // octocat: $2/mo since 2025-12-15 → 7 monthly charges by 2026-06-20 = $14.
    // mona: one-time $20. Sorted by total desc → mona ($20), octocat ($14).
    expect(s).toEqual([
      { login: 'mona', name: 'mona', url: 'https://github.com/mona', avatarUrl: 'https://x/m.png', isOneTime: true, amount: 20, total: 20 },
      { login: 'octocat', name: 'The Octocat', url: 'https://github.com/octocat', avatarUrl: 'https://x/y.png', isOneTime: false, amount: 2, total: 14 },
    ]);
    vi.useRealTimers();
  });
  it('returns [] when no token', async () => {
    delete process.env.GITHUB_TOKEN;
    expect(await fetchSponsors()).toEqual([]);
  });
});
