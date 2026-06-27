export type Sponsor = { login: string; name: string; url: string; avatarUrl: string; isOneTime: boolean; amount: number; total: number };

export function parseRepo(url: string): { owner: string; repo: string } | null {
  const m = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!m) return null;
  const owner = m[1];
  const repo = m[2].replace(/\.git$/, '');
  if (!owner || !repo) return null;
  return { owner, repo };
}

export async function fetchRepoStars(owner: string, repo: string): Promise<number> {
  const headers: Record<string, string> = { 'User-Agent': 'portfolio' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `bearer ${process.env.GITHUB_TOKEN}`;
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.stargazers_count ?? 0;
  } catch {
    return 0;
  }
}

// Number of monthly charges from a start date to now (min 1 — the initial
// charge). Estimates an active recurring sponsor's all-time total.
function monthsSince(iso: string | undefined): number {
  if (!iso) return 1;
  const start = new Date(iso);
  const now = new Date();
  let m = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (now.getDate() >= start.getDate()) m += 1;
  return Math.max(1, m);
}

// On Cloudflare, secrets live in the `cloudflare:workers` env module at RUNTIME
// (the same place the visitor counter reads UPSTASH). Falls back to process.env
// for build-time / Node. This lets an SSR page read GITHUB_TOKEN that's set as a
// Worker secret — no build-time variable required.
export async function resolveGithubToken(): Promise<string | undefined> {
  try {
    const m: any = await import('cloudflare:workers' as any);
    return m.env?.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;
  } catch {
    return process.env.GITHUB_TOKEN;
  }
}

export async function fetchSponsors(token?: string): Promise<Sponsor[]> {
  token = token ?? process.env.GITHUB_TOKEN;
  if (!token) return [];
  // `sponsorshipsAsMaintainer` returns BOTH recurring and one-time sponsors.
  // Token needs `read:org` (alongside `read:user`) or the sponsor login/name
  // fields fail with INSUFFICIENT_SCOPES. `includePrivate: false` = only public
  // sponsors; `activeOnly: false` = include past/one-time sponsors too. `tier`
  // carries the dollar amount (monthly price, or the one-time price).
  const query = `query {
    viewer {
      sponsorshipsAsMaintainer(first: 100, includePrivate: false, activeOnly: false) {
        nodes {
          isOneTimePayment
          createdAt
          tier { monthlyPriceInDollars }
          sponsorEntity {
            __typename
            ... on User { login name url avatarUrl }
            ... on Organization { login name url avatarUrl }
          }
        }
      }
    }
  }`;
  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'portfolio' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) return [];
    const json = await res.json();
    const nodes = json?.data?.viewer?.sponsorshipsAsMaintainer?.nodes ?? [];
    return nodes
      .map((n: any) => {
        const amount = n?.tier?.monthlyPriceInDollars ?? 0;
        const isOneTime = !!n?.isOneTimePayment;
        // All-time total: one-time = the single amount; recurring = rate × the
        // monthly charges since it started.
        const total = isOneTime ? amount : amount * monthsSince(n?.createdAt);
        return { entity: n?.sponsorEntity, isOneTime, amount, total };
      })
      .filter((n: any) => n.entity && n.entity.login)
      .map((n: any) => ({
        login: n.entity.login,
        name: n.entity.name ?? n.entity.login,
        url: n.entity.url,
        avatarUrl: n.entity.avatarUrl,
        isOneTime: n.isOneTime,
        amount: n.amount,
        total: n.total,
      }))
      .sort((a: Sponsor, b: Sponsor) => b.total - a.total);
  } catch {
    return [];
  }
}
