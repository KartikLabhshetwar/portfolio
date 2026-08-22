import { describe, it, expect, vi } from 'vitest';
import { subscribe, createBroadcastDraft } from '../src/lib/kit';

const env = { KIT_API_KEY: 'k123', KIT_FORM_ID: '99' };

// Queue of responses, one per fetch call, in order.
const fakeFetch = (...responses: Array<{ status: number; body: unknown }>) => {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const fn = vi.fn(async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    const r = responses.shift() ?? { status: 200, body: {} };
    return new Response(JSON.stringify(r.body), { status: r.status });
  });
  return { fn, calls };
};

const bodyOf = (init: RequestInit) => JSON.parse(init.body as string);

describe('subscribe', () => {
  it('creates the subscriber then adds them to the form', async () => {
    const { fn, calls } = fakeFetch(
      { status: 200, body: { subscriber: { id: 1 } } },
      { status: 200, body: { subscriber: { id: 1 } } },
    );
    const res = await subscribe(env, { email: 'a@b.com', referrer: 'https://site/x', ip: '1.2.3.4' }, fn as any);

    expect(res).toEqual({ ok: true });
    expect(calls).toHaveLength(2);
    expect(calls[0].url).toBe('https://api.kit.com/v4/subscribers');
    expect((calls[0].init.headers as any)['X-Kit-Api-Key']).toBe('k123');
    expect(bodyOf(calls[0].init).email_address).toBe('a@b.com');
    expect(calls[1].url).toBe('https://api.kit.com/v4/forms/99/subscribers');
    expect(bodyOf(calls[1].init).referrer).toBe('https://site/x');
  });

  it('treats a resubscribe as success because Kit upserts', async () => {
    const { fn } = fakeFetch(
      { status: 200, body: { subscriber: { id: 1 } } },
      { status: 200, body: { subscriber: { id: 1 } } },
    );
    expect(await subscribe(env, { email: 'a@b.com' }, fn as any)).toEqual({ ok: true });
  });

  it('surfaces a Kit error message', async () => {
    const { fn } = fakeFetch({ status: 401, body: { errors: ['Invalid API key'] } });
    expect(await subscribe(env, { email: 'a@b.com' }, fn as any)).toEqual({
      ok: false, error: 'Invalid API key', status: 401,
    });
  });

  it('reports missing configuration without calling the network', async () => {
    const { fn, calls } = fakeFetch();
    const res = await subscribe({}, { email: 'a@b.com' }, fn as any);
    expect(res).toEqual({ ok: false, error: 'Newsletter is not configured.', status: 503 });
    expect(calls).toHaveLength(0);
  });
});

describe('createBroadcastDraft', () => {
  it('posts a draft that is public and unscheduled', async () => {
    const { fn, calls } = fakeFetch({
      status: 201,
      body: { broadcast: { id: 64, public_url: 'https://kit.com/posts/64' } },
    });
    const res = await createBroadcastDraft(env, {
      subject: 'Hello', previewText: 'Preview', html: '<p>Hi</p>', publishedAt: '2026-01-01T00:00:00Z',
    }, fn as any);

    expect(res).toEqual({ ok: true, id: 64, url: 'https://kit.com/posts/64' });
    const sent = bodyOf(calls[0].init);
    expect(sent.send_at).toBeNull();
    expect(sent.public).toBe(true);
    expect(sent.subject).toBe('Hello');
    expect(sent.content).toBe('<p>Hi</p>');
  });

  it('surfaces a failure', async () => {
    const { fn } = fakeFetch({ status: 422, body: { errors: ['Subject required'] } });
    const res = await createBroadcastDraft(env, { subject: '', previewText: '', html: '' }, fn as any);
    expect(res).toEqual({ ok: false, error: 'Subject required', status: 422 });
  });
});
