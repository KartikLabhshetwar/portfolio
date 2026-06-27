import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '../src/pages/api/subscribe';

// Stand in for Buttondown's create-subscriber response. The handler only reads
// status + { code, detail }, so the body shape is all that matters here.
const buttondown = (status: number, body: unknown) =>
  vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } }));

const post = (email: string) =>
  POST({
    request: new Request('https://site/api/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    }),
    clientAddress: '1.2.3.4',
  } as any);

describe('POST /api/subscribe — Buttondown error classification', () => {
  beforeEach(() => {
    process.env.BUTTONDOWN_API_KEY = 'test-key';
    delete process.env.UPSTASH_REDIS_REST_URL; // no redis -> rate limiting is skipped
  });
  afterEach(() => vi.unstubAllGlobals());

  it('reports a real success', async () => {
    vi.stubGlobal('fetch', buttondown(201, { email_address: 'a@b.com' }));
    expect(await (await post('a@b.com')).json()).toEqual({ ok: true });
  });

  // The regression: a firewall block (code `subscriber_blocked`) used to match the
  // old /subscrib/ regex and be reported as a fake "already subscribed", so the
  // signup silently vanished and the dashboard stayed empty.
  it('treats a firewall block as a FAILURE, not a fake "already subscribed"', async () => {
    vi.stubGlobal('fetch', buttondown(400, { code: 'subscriber_blocked', detail: 'This subscriber was blocked by your firewall.' }));
    const res = await post('blocked@b.com');
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.already).toBeUndefined();
    expect(res.status).toBe(400);
  });

  it('treats a genuine duplicate as a friendly success', async () => {
    vi.stubGlobal('fetch', buttondown(400, { code: 'email_already_exists', detail: 'That email address is already subscribed.' }));
    expect(await (await post('dupe@b.com')).json()).toEqual({ ok: true, already: true });
  });
});
