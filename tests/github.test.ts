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
  it('maps recurring and one-time sponsors from sponsorshipsAsMaintainer', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { viewer: { sponsorshipsAsMaintainer: { nodes: [
        { isOneTimePayment: false, sponsorEntity: { login: 'octocat', name: 'The Octocat', url: 'https://github.com/octocat', avatarUrl: 'https://x/y.png' } },
        { isOneTimePayment: true, sponsorEntity: { login: 'mona', name: null, url: 'https://github.com/mona', avatarUrl: 'https://x/m.png' } },
      ] } } } }),
    }));
    process.env.GITHUB_TOKEN = 'tok';
    const s = await fetchSponsors();
    expect(s).toEqual([
      { login: 'octocat', name: 'The Octocat', url: 'https://github.com/octocat', avatarUrl: 'https://x/y.png', isOneTime: false },
      { login: 'mona', name: 'mona', url: 'https://github.com/mona', avatarUrl: 'https://x/m.png', isOneTime: true },
    ]);
  });
  it('returns [] when no token', async () => {
    delete process.env.GITHUB_TOKEN;
    expect(await fetchSponsors()).toEqual([]);
  });
});
