import { describe, it, expect } from 'vitest';
import { notFoundMarkdown, pageMarkdown, type MarkdownSite } from '../src/lib/page-markdown';

const base = 'https://kartiklabhshetwar.com';

const site: MarkdownSite = {
  base,
  profile: {
    name: 'Kartik Labhshetwar',
    role: 'Software Engineer',
    bio: 'I build from zero.',
    location: 'India',
    socials: [
      { label: 'GitHub', href: 'https://github.com/KartikLabhshetwar' },
      { label: 'X', href: 'https://x.com/code_kartik' },
      { label: 'LinkedIn', href: 'https://linkedin.com/in/kartikcode' },
      { label: 'Book a call', href: 'https://cal.com/kartik' },
    ],
  },
  projects: [
    { id: 'alpha', title: 'Alpha', description: 'Does alpha things.', impact: '10k downloads', liveLink: `${base}/a`, githubLink: 'https://github.com/x/alpha' },
    { id: 'beta', title: 'Beta', description: 'Does beta things.' },
  ],
  experience: [
    {
      companyName: 'Mem0',
      companyWebsite: 'https://mem0.ai',
      positions: [
        { title: 'Software Engineer', employmentPeriod: { start: 'Jan 2025' }, description: 'Built memory infrastructure.' },
      ],
    },
  ],
  posts: [
    { slug: 'first', title: 'First', description: 'About first.', pubDate: new Date('2026-01-02T00:00:00Z'), body: '## Body\n\nText.' },
    { slug: 'second', title: 'Second', description: 'About second.', pubDate: new Date('2025-12-01T00:00:00Z'), body: 'More.' },
  ],
};

describe('pageMarkdown', () => {
  it('renders the home page with identity and writing', () => {
    const md = pageMarkdown('/', site)!;
    expect(md).toContain('# Kartik Labhshetwar');
    expect(md).toContain('> Software Engineer. I build from zero.');
    expect(md).toContain('- GitHub: https://github.com/KartikLabhshetwar');
    expect(md).toContain(`[Work history](${base}/work)`);
    expect(md).not.toContain('## Experience');
    expect(md).not.toContain('## Projects');
    expect(md).not.toContain('### Alpha');
    expect(md).toContain('## Writing');
    expect(md).toContain(`- [First](${base}/blog/first): 2026-01-02: About first.`);
    expect(md).not.toContain('/api/subscribe');
  });

  it('renders work history and every project on the work page', () => {
    const md = pageMarkdown('/work', site)!;
    expect(md).toContain('# Work');
    expect(md).toContain('## [Mem0](https://mem0.ai)');
    expect(md).toContain('**Software Engineer** (Jan 2025 to Present)');
    expect(md).toContain('## Projects');
    expect(md).toContain('### Alpha');
    expect(md).toContain('### Beta');
    expect(md).toContain('[Live](https://kartiklabhshetwar.com/a) · [GitHub](https://github.com/x/alpha)');
  });

  it('lists every post on the blog index', () => {
    const md = pageMarkdown('/blog', site)!;
    expect(md).toContain('# Writing');
    expect(md).toContain(`${base}/blog/first`);
    expect(md).toContain(`${base}/blog/second`);
  });

  it('renders a blog post with its full body', () => {
    const md = pageMarkdown('/blog/first', site)!;
    expect(md).toContain('# First');
    expect(md).toContain('> About first.');
    expect(md).toContain('2026-01-02');
    expect(md).toContain('## Body');
  });

  it('renders the about page as a trust anchor', () => {
    const md = pageMarkdown('/about', site)!;
    expect(md).toContain('# About');
    expect(md).toContain('Kartik Labhshetwar');
    expect(md).toContain('India');
    expect(md).toContain('Software Engineer at Mem0');
    expect(md).toContain(`${base}/work#projects`);
    expect(md).toContain(`${base}/contact`);
    expect(md).toContain('- GitHub: https://github.com/KartikLabhshetwar');
  });

  it('renders the contact page with every channel', () => {
    const md = pageMarkdown('/contact', site)!;
    expect(md).toContain('# Contact');
    expect(md).toContain('https://cal.com/kartik');
    expect(md).toContain('https://x.com/code_kartik');
    expect(md).toContain('https://linkedin.com/in/kartikcode');
    expect(md).toContain('https://github.com/KartikLabhshetwar');
    expect(md).toContain(`${base}/api/subscribe`);
  });

  it('renders the privacy page covering every processor the site uses', () => {
    const md = pageMarkdown('/privacy', site)!;
    expect(md).toContain('# Privacy');
    for (const processor of ['Kit', 'Databuddy', 'Upstash', 'GitHub', 'Cloudflare']) {
      expect(md).toContain(processor);
    }
    expect(md).toContain(`${base}/contact`);
  });

  it('gives each trust anchor page the 500+ characters agents look for', () => {
    for (const path of ['/about', '/contact', '/privacy']) {
      expect(pageMarkdown(path, site)!.length).toBeGreaterThan(500);
    }
  });

  it('ignores trailing slashes', () => {
    expect(pageMarkdown('/work/', site)).toBe(pageMarkdown('/work', site));
    expect(pageMarkdown('', site)).toBe(pageMarkdown('/', site));
  });

  it('returns null for paths with no markdown representation', () => {
    expect(pageMarkdown('/blog/nope', site)).toBeNull();
    expect(pageMarkdown('/nope', site)).toBeNull();
    expect(pageMarkdown('/api/visitors', site)).toBeNull();
  });
});

describe('notFoundMarkdown', () => {
  it('points agents at every recovery entry point', () => {
    const md = notFoundMarkdown(base);
    expect(md).toContain('# 404');
    expect(md).toContain('## Where to look next');
    const paths = ['/', '/work', '/about', '/blog', '/contact', '/privacy', '/llms.txt', '/llms-full.txt', '/sitemap-index.xml'];
    for (const path of paths) {
      expect(md).toContain(`${base}${path}`);
    }
    expect(md).not.toContain(`${base}/projects`);
    expect(md).toContain('Accept: text/markdown');
  });
});
