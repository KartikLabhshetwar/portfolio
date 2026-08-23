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

// Mirrors the date shown on /privacy; both move only when the practices change.
const PRIVACY_UPDATED = '23 August 2026';

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

Thank you to everyone who supports this work. The list itself renders live from the GitHub Sponsors API, so it only appears in the HTML page at ${site.base}/sponsors.

## What sponsorship funds

Most of what ${site.profile.name} builds is open source and free to use, and none of it is funded by anything else. Sponsorship pays for the parts nobody sees: time to answer issues, review pull requests, cut releases, keep Apple developer and domain renewals paid, and keep hosting running for the tools that need a server.

Sponsoring is monthly or one-off, from a few dollars up, and runs through GitHub Sponsors, so it can be cancelled at any time. Companies using these tools in production are the most welcome: for an invoice or a different arrangement, ask at ${site.base}/contact.

Become a sponsor: https://github.com/sponsors/KartikLabhshetwar
`;
}

function aboutPage(site: MarkdownSite): string {
  const current = site.experience[0];
  const title = current?.positions[0]?.title ?? site.profile.role;
  return `# About

${site.profile.name} is a software engineer based in ${site.profile.location}, currently ${title} at ${current?.companyName ?? 'Mem0'}.

## What I work on

Memory infrastructure for AI agents at ${current?.companyName ?? 'Mem0'}: the Python and TypeScript SDKs, the self-hosted server, vector-store integrations, editor plugins, and the CLI. In practice that means making retrieval return the right memories instead of the closest ones, cutting search latency, hardening a server other teams run in production, and closing security holes in the vector stores underneath. Most of it is open source, so the work happens in public: reviewing community pull requests, triaging the backlog, keeping SDK releases moving. Before that, software engineering intern at Turbo ML on scheduling, messaging integrations, and real-time scraping over Next.js, Supabase, and Cloudflare Workers.

## What I've built

${site.projects.length} projects shipped. The ones with real usage behind them: Screenshot Studio (20k+ monthly users), BetterShot, an open-source CleanShot X alternative for macOS (12k+ downloads), Lazy Commit, a CLI that writes git commit messages (195k+ downloads on npm), and OneURL, a self-hostable Linktree alternative. Full list: ${site.base}/projects

## What I write

Experience reports rather than tutorials: what retrieval-augmented generation is and where it breaks, running text-to-speech for 25,000 users without melting a server, a working guide to SSH, and how to choose problems worth solving. All posts: ${site.base}/blog

## Elsewhere

${site.profile.socials.map((s) => `- ${s.label}: ${s.href}`).join('\n')}

Contact: ${site.base}/contact
`;
}

function contactPage(site: MarkdownSite): string {
  const social = (label: string) => site.profile.socials.find((s) => s.label === label)?.href ?? '';
  return `# Contact

Ways to reach ${site.profile.name}. Say what you are building and what you want in the first two lines and you will hear back faster.

## Where to reach me

- **Book a 15-minute call**: ${social('Book a call')} — best for anything worth a conversation: hiring, collaboration, or advice on a project.
- **X (Twitter)**: ${social('X')} — DMs are open. Quickest for short questions.
- **LinkedIn**: ${social('LinkedIn')} — for roles, contracts, and anything that needs a paper trail.
- **GitHub**: ${social('GitHub')} — for bugs, feature requests, and contributions, open an issue on the repository rather than messaging.

## Working together

The day job is ${site.profile.role}, so time outside it is limited and replies are selective. Always worth asking about: agent memory and retrieval, feedback on something you are building in that space, and helping people earlier in their career work out what to build next. Sponsoring the open-source work: ${site.base}/sponsors

## Stay in touch

New posts by email, nothing else. Subscribe at ${site.base}/contact, or POST \`{"email":"you@example.com"}\` to ${site.base}/api/subscribe.
`;
}

function privacyPage(site: MarkdownSite): string {
  return `# Privacy

A personal site with no accounts, no ads, and nothing for sale. Everything it collects, and every third party that sees any of it, is below. Last updated ${PRIVACY_UPDATED}.

## Newsletter

Subscribing sends your email address to Kit (formerly ConvertKit), which stores it and delivers the emails. Kit sends a confirmation email first, so nothing arrives unless you click the link in it. The address is used only to announce new posts. It is never sold, rented, or shared, and every email carries a one-click unsubscribe link.

## Visitor count

The footer count is unique visitors. Your browser computes an opaque identifier (FingerprintJS) and the site stores it in a set in Upstash Redis so one person is not counted twice across networks. If that fails (JavaScript off, a blocker on), the server falls back to a non-reversible hash of IP address and user agent. Either way one opaque string is stored, no raw IP is kept, nothing is tied to a name, and only the total is ever read back.

## Analytics

Page analytics run through Databuddy, loaded from cdn.databuddy.cc: page views, outbound link clicks, interactions, and web vitals. Blocking the script breaks nothing on this site.

## Hosting and storage on your device

The site runs on Cloudflare Workers, so Cloudflare handles every request and keeps its own standard request logs. Your light or dark theme choice stays in your browser's local storage. GitHub's API is called server-side for star counts and the sponsor list, carrying nothing about you.

## Your choices

Unsubscribe from any email to be removed. Block the analytics script or browse privately to stay out of the counts. To ask what is held about you, or to have it deleted, get in touch at ${site.base}/contact.
`;
}

/** Markdown for a page path, or null when that path has no Markdown representation. */
export function pageMarkdown(pathname: string, site: MarkdownSite): string | null {
  const path = normalize(pathname);
  if (path === '/') return home(site);
  if (path === '/projects') return projectsPage(site);
  if (path === '/blog') return blogIndex(site);
  if (path === '/sponsors') return sponsorsPage(site);
  if (path === '/about') return aboutPage(site);
  if (path === '/contact') return contactPage(site);
  if (path === '/privacy') return privacyPage(site);
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
- [About](${base}/about) — who runs this site, and what they work on
- [Projects](${base}/projects) — everything shipped
- [Blog](${base}/blog) — all posts
- [Contact](${base}/contact) — how to get in touch
- [Sponsors](${base}/sponsors) — GitHub sponsors
- [Privacy](${base}/privacy) — what this site collects
- [llms.txt](${base}/llms.txt) — structured index of this site, plus when to use it
- [llms-full.txt](${base}/llms-full.txt) — every page and full post text in one Markdown file
- [Sitemap](${base}/sitemap-index.xml) — every canonical URL

Any page URL also serves Markdown when you send \`Accept: text/markdown\`.
`;
}
