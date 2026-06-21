export type Sponsor = { login: string; name: string; url: string; avatarUrl: string };

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
  const query = `query {
    viewer { sponsors(first: 100) { nodes {
      __typename
      ... on User { login name url avatarUrl }
      ... on Organization { login name url avatarUrl }
    } } }
  }`;
  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'portfolio' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) return [];
    const json = await res.json();
    const nodes = json?.data?.viewer?.sponsors?.nodes ?? [];
    return nodes
      .filter((n: any) => n && n.login)
      .map((n: any) => ({ login: n.login, name: n.name ?? n.login, url: n.url, avatarUrl: n.avatarUrl }));
  } catch {
    return [];
  }
}
