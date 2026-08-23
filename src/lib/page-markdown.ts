// Markdown representations of the HTML pages, served from the same URLs via
// Accept negotiation (https://acceptmarkdown.com). Pure: the middleware hands in
// the same data the pages render, so the two can't drift.

export type MarkdownProject = {
  id: string;
  title: string;
  description: string;
  impact?: string;
  liveLink?: string;
  githubLink?: string;
};

export type MarkdownPosition = {
  title: string;
  employmentType?: string;
  employmentPeriod: { start: string; end?: string };
  description?: string;
};

export type MarkdownCompany = { companyName: string; companyWebsite?: string; positions: MarkdownPosition[] };

export type MarkdownPost = { slug: string; title: string; description: string; pubDate: Date; body: string };

export type MarkdownProfile = {
  name: string;
  role: string;
  bio: string;
  location: string;
  socials: { label: string; href: string }[];
};

export type MarkdownSite = {
  base: string;
  profile: MarkdownProfile;
  projects: MarkdownProject[];
  featuredIds: readonly string[];
  experience: MarkdownCompany[];
  posts: MarkdownPost[];
};

export const MARKDOWN_CONTENT_TYPE = 'text/markdown; charset=utf-8';

function normalize(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

function projectLine(p: MarkdownProject): string {
  const links = [p.liveLink && `[Live](${p.liveLink})`, p.githubLink && `[GitHub](${p.githubLink})`]
    .filter(Boolean)
    .join(' · ');
  const impact = p.impact ? ` — ${p.impact}` : '';
  return `### ${p.title}${impact}\n\n${p.description}${links ? `\n\n${links}` : ''}`;
}

function postLine(base: string, p: MarkdownPost): string {
  return `- [${p.title}](${base}/blog/${p.slug}) — ${p.pubDate.toISOString().slice(0, 10)}: ${p.description}`;
}

function identity(site: MarkdownSite): string {
  const links = site.profile.socials.map((s) => `- ${s.label}: ${s.href}`).join('\n');
  return `# ${site.profile.name}

> ${site.profile.role}. ${site.profile.bio}

- Location: ${site.profile.location}
${links}`;
}

function home(site: MarkdownSite): string {
  const experience = site.experience
    .flatMap((c) =>
      c.positions.map((p) => {
        const end = p.employmentPeriod.end ?? 'present';
        const company = c.companyWebsite ? `[${c.companyName}](${c.companyWebsite})` : c.companyName;
        return `### ${p.title} · ${company} (${p.employmentPeriod.start}–${end})\n\n${p.description ?? ''}`.trim();
      }),
    )
    .join('\n\n');
  const featured = site.featuredIds
    .map((id) => site.projects.find((p) => p.id === id))
    .filter((p): p is MarkdownProject => Boolean(p))
    .map(projectLine)
    .join('\n\n');
  const writing = site.posts.slice(0, 3).map((p) => postLine(site.base, p)).join('\n');

  return `${identity(site)}

## Experience

${experience}

## Projects

${featured}

[All projects](${site.base}/projects)

## Writing

${writing}

[All posts](${site.base}/blog)

## Sponsors

Sponsors render live from the GitHub Sponsors API at ${site.base}/sponsors.

## Newsletter

New posts by email — subscribe at ${site.base}/ or POST \`{"email":"you@example.com"}\` to ${site.base}/api/subscribe.
`;
}

function projectsPage(site: MarkdownSite): string {
  return `# Projects

Everything ${site.profile.name} has built and shipped. Star counts render live from GitHub on the HTML page.

${site.projects.map(projectLine).join('\n\n')}
`;
}

function blogIndex(site: MarkdownSite): string {
  return `# Blog

Posts by ${site.profile.name}. Full text of every post in one file: ${site.base}/llms-full.txt

${site.posts.map((p) => postLine(site.base, p)).join('\n')}
`;
}

function blogPost(site: MarkdownSite, post: MarkdownPost): string {
  return `# ${post.title}

> ${post.description}

${post.pubDate.toISOString().slice(0, 10)} · ${site.base}/blog/${post.slug} · by ${site.profile.name}

${post.body.trim()}
`;
}

function sponsorsPage(site: MarkdownSite): string {
  return `# Sponsors

Thank you to everyone who supports this work. The list renders live from the GitHub Sponsors API, so it only appears in the HTML page at ${site.base}/sponsors.

Become a sponsor: https://github.com/sponsors/KartikLabhshetwar
`;
}

/** Markdown for a page path, or null when that path has no Markdown representation. */
export function pageMarkdown(pathname: string, site: MarkdownSite): string | null {
  const path = normalize(pathname);
  if (path === '/') return home(site);
  if (path === '/projects') return projectsPage(site);
  if (path === '/blog') return blogIndex(site);
  if (path === '/sponsors') return sponsorsPage(site);
  const slug = path.startsWith('/blog/') ? path.slice('/blog/'.length) : null;
  if (slug) {
    const post = site.posts.find((p) => p.slug === slug);
    return post ? blogPost(site, post) : null;
  }
  return null;
}

/** Body of a 404: tells an agent where to look instead. */
export function notFoundMarkdown(base: string): string {
  return `# 404 — Page not found

There is nothing at this URL on ${base}.

## Where to look next

- [Home](${base}/) — profile, experience, featured projects, latest posts
- [Projects](${base}/projects) — everything shipped
- [Blog](${base}/blog) — all posts
- [Sponsors](${base}/sponsors) — GitHub sponsors
- [llms.txt](${base}/llms.txt) — structured index of this site, plus when to use it
- [llms-full.txt](${base}/llms-full.txt) — every page and full post text in one Markdown file
- [Sitemap](${base}/sitemap-index.xml) — every canonical URL

Any page URL also serves Markdown when you send \`Accept: text/markdown\`.
`;
}
