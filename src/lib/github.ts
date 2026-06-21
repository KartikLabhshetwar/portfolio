export type Sponsor = { login: string; name: string; url: string; avatarUrl: string; isOneTime: boolean };

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

export async function fetchSponsors(): Promise<Sponsor[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return [];
  // `sponsorshipsAsMaintainer` returns BOTH recurring and one-time sponsors
  // (the `sponsors` connection alone omits the recurring/one-time distinction).
  // Requires a token with the `read:user` scope. `includePrivate: false` returns
  // only sponsors who chose to be public; `activeOnly: true` = current sponsors.
  const query = `query {
    viewer {
      sponsorshipsAsMaintainer(first: 100, includePrivate: false, activeOnly: true) {
        nodes {
          isOneTimePayment
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
      .map((n: any) => ({ entity: n?.sponsorEntity, isOneTime: !!n?.isOneTimePayment }))
      .filter((n: any) => n.entity && n.entity.login)
      .map((n: any) => ({
        login: n.entity.login,
        name: n.entity.name ?? n.entity.login,
        url: n.entity.url,
        avatarUrl: n.entity.avatarUrl,
        isOneTime: n.isOneTime,
      }));
  } catch {
    return [];
  }
}
