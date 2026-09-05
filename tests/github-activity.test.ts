import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadGitHubUser, toWeeks, weeksFor, type Contribution } from '../src/components/ui/github-activity';
import { GET } from '../src/pages/api/github/[username]';

afterEach(() => vi.unstubAllGlobals());

describe('GitHub activity layout', () => {
  it('keeps responsive history in seven-day columns', () => {
    const days = Array.from({ length: 15 }, (_, index): Contribution => ({
      date: `2026-01-${String(index + 1).padStart(2, '0')}`,
      count: index,
      level: 0,
    }));
    expect(toWeeks(days).map((week) => week.length)).toEqual([7, 7, 1]);
    expect(weeksFor(12)).toBeGreaterThanOrEqual(52);
  });
});

describe('GitHub activity loading', () => {
  const contributions = [{ date: '2026-08-30', count: 3, level: 1 }];

  it('renders the calendar before repositories finish, including when they fail', async () => {
    let failRepos!: (reason: Error) => void;
    const repos = new Promise<Response>((_, reject) => { failRepos = reject; });
    vi.stubGlobal('fetch', vi.fn((url: string) => url.includes('resource=calendar')
      ? Promise.resolve(Response.json({ contributions }))
      : repos));
    const update = vi.fn();
    const pending = loadGitHubUser('kartik-mem0', update);
    await vi.waitFor(() => expect(update).toHaveBeenCalledWith({ contributions }));
    failRepos(new Error('GitHub is unavailable'));
    await pending;
    expect(update).toHaveBeenCalledTimes(1);
  });

  it('keeps repositories available when the calendar fails and reports the failure', async () => {
    vi.stubGlobal('fetch', vi.fn((url: string) => Promise.resolve(url.includes('resource=calendar')
      ? new Response(null, { status: 503 })
      : Response.json([{ type: 'PushEvent', repo: { name: 'kartik-mem0/portfolio' } }]))));
    const update = vi.fn();
    await loadGitHubUser('kartik-mem0', update);
    expect(update).toHaveBeenCalledWith({ calendarUnavailable: true });
    expect(update).toHaveBeenCalledWith({ repos: [expect.objectContaining({ name: 'portfolio', count: 1 })] });
  });

  it('caches successful upstream requests, leaves failures uncached, and rejects invalid paths', async () => {
    const request = (username: string, resource = 'calendar') => GET({
      params: { username }, url: new URL(`https://example.com/api/github/${username}?resource=${resource}`),
    } as unknown as Parameters<typeof GET>[0]);
    const upstream = vi.fn().mockResolvedValue(Response.json({ contributions }));
    vi.stubGlobal('fetch', upstream);
    const success = await request('kartik-mem0');
    expect(await success.json()).toEqual({ contributions });
    expect(success.headers.get('Cache-Control')).toBe('public, max-age=300');
    expect(upstream).toHaveBeenCalledWith(
      'https://github-contributions-api.jogruber.de/v4/kartik-mem0?y=last',
      expect.objectContaining({ cf: { cacheEverything: true, cacheTtlByStatus: { '200-299': 3600, '300-599': 0 } } }),
    );
    upstream.mockResolvedValue(new Response(null, { status: 429 }));
    const failure = await request('kartik-mem0');
    expect(failure.status).toBe(503);
    expect(failure.headers.get('Cache-Control')).toBe('no-store');
    upstream.mockRejectedValue(new Error('timeout'));
    expect((await request('kartik-mem0')).status).toBe(503);
    upstream.mockClear();
    expect((await request('../private')).status).toBe(400);
    expect((await request('kartik-mem0', 'secrets')).status).toBe(400);
    expect(upstream).not.toHaveBeenCalled();
  });
});
