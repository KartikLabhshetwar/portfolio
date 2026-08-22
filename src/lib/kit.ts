const API = 'https://api.kit.com/v4';

export type KitEnv = { KIT_API_KEY?: string; KIT_FORM_ID?: string };

export type KitResult = { ok: true } | { ok: false; error: string; status: number };

type Fetch = typeof fetch;

const NOT_CONFIGURED = { ok: false, error: 'Newsletter is not configured.', status: 503 } as const;

function headers(apiKey: string) {
  return { 'X-Kit-Api-Key': apiKey, 'Content-Type': 'application/json' };
}

// Kit v4 returns { errors: [...] } on failure. Fall back to the status so a
// gateway error or an HTML error page still produces something readable.
async function errorFrom(res: Response): Promise<{ ok: false; error: string; status: number }> {
  const body = (await res.json().catch(() => ({}))) as { errors?: string[] };
  return { ok: false, error: body.errors?.[0] ?? `Kit request failed (${res.status})`, status: res.status };
}

export async function subscribe(
  env: KitEnv,
  input: { email: string; referrer?: string },
  doFetch: Fetch = fetch,
): Promise<KitResult> {
  if (!env.KIT_API_KEY || !env.KIT_FORM_ID) return NOT_CONFIGURED;

  // Two calls because Kit requires it: the form endpoint only accepts subscribers
  // that already exist. Whether the second call sends a confirmation email is a
  // property of the form in Kit's dashboard, not of this request, so single vs
  // double opt-in is a toggle there rather than a deploy here.
  const created = await doFetch(`${API}/subscribers`, {
    method: 'POST',
    headers: headers(env.KIT_API_KEY),
    body: JSON.stringify({ email_address: input.email }),
  });
  if (!created.ok) return errorFrom(created);

  const added = await doFetch(`${API}/forms/${env.KIT_FORM_ID}/subscribers`, {
    method: 'POST',
    headers: headers(env.KIT_API_KEY),
    body: JSON.stringify({ email_address: input.email, ...(input.referrer ? { referrer: input.referrer } : {}) }),
  });
  if (!added.ok) return errorFrom(added);

  return { ok: true };
}

export async function createBroadcastDraft(
  env: KitEnv,
  input: { subject: string; previewText: string; html: string; publishedAt?: string },
  doFetch: Fetch = fetch,
): Promise<KitResult & { id?: number; url?: string }> {
  if (!env.KIT_API_KEY) return NOT_CONFIGURED;

  // send_at: null makes this a draft. That is the human gate before the list gets
  // mailed, and it is why nothing here needs an idempotency key: running twice
  // leaves two drafts, not two sends. public: true also posts it to the Kit
  // Creator Profile feed, which feeds Creator Network recommendations.
  const res = await doFetch(`${API}/broadcasts`, {
    method: 'POST',
    headers: headers(env.KIT_API_KEY),
    body: JSON.stringify({
      subject: input.subject,
      preview_text: input.previewText,
      content: input.html,
      public: true,
      send_at: null,
      ...(input.publishedAt ? { published_at: input.publishedAt } : {}),
    }),
  });
  if (!res.ok) return errorFrom(res);

  const body = (await res.json().catch(() => ({}))) as { broadcast?: { id: number; public_url: string } };
  return { ok: true, id: body.broadcast?.id, url: body.broadcast?.public_url };
}
