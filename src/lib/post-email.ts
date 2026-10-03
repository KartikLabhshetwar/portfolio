import Markdoc from '@markdoc/markdoc';
import { profile } from '../data/profile.ts';

export type PostInput = { title: string; description: string; body: string; slug: string };
export type PostEmail = { subject: string; previewText: string; html: string };

// Root-relative only, and `(?!\/)` keeps protocol-relative `//cdn.example.com`
// out of it.
//
// ponytail: post-local relative paths (`./diagram.png`) are not rewritten,
// because resolving them means knowing where Astro's asset pipeline will emit
// them and this reads the raw .mdoc instead. Use root-relative or absolute URLs
// for images in posts. Revisit if that ever bites.
const RELATIVE_URL = /\b(href|src)="\/(?!\/)([^"]*)"/g;

const FOOTER_LINKS = ['X', 'LinkedIn', 'GitHub'];

function absolutize(html: string, base: string): string {
  return html.replace(RELATIVE_URL, (_m, attr, path) => `${attr}="${base}/${path}"`);
}

function banner(base: string): string {
  return `<img src="${base}/newsletter/banner.png" alt="${profile.newsletter} by ${profile.name}" style="display:block;width:100%;height:auto;border:0;border-radius:12px;margin:0 0 24px">`;
}

function footer(): string {
  const links = profile.socials
    .filter((s) => FOOTER_LINKS.includes(s.label))
    .map((s) => `<a href="${s.href}" style="color:#FBFBFA;font-weight:600;text-decoration:none">${s.label}</a>`)
    .join(' &nbsp;·&nbsp; ');
  const line = 'max-width:none;text-align:center;color:#FBFBFA;font-size:14px;line-height:1.6';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;background:#5D18EB;border-radius:12px"><tr><td align="center" style="padding:28px 24px;text-align:center;color:#FBFBFA"><p style="margin:0 auto 8px;${line}">${links}</p><p style="margin:0 auto;${line};opacity:0.8">© ${new Date().getFullYear()} ${profile.newsletter} by ${profile.name}</p></td></tr></table>`;
}

function withoutHero(body: string, slug: string): string {
  return body.replace(new RegExp(`^!\\[[^\\]]*\\]\\(/blog/${slug}/hero\\.\\w+\\)\\s*`, 'm'), '');
}

export function postToEmail(post: PostInput, baseUrl: string): PostEmail {
  const base = baseUrl.replace(/\/$/, '');
  const url = `${base}/blog/${post.slug}`;

  // Kit wraps this in its own email template, which adds the unsubscribe link
  // and postal address under our footer.
  const rendered = Markdoc.renderers.html(Markdoc.transform(Markdoc.parse(withoutHero(post.body, post.slug))));

  return {
    subject: post.title,
    previewText: post.description,
    html: `${banner(base)}\n${absolutize(rendered, base)}\n<p><a href="${url}">Read this on the web →</a></p>\n${footer()}`,
  };
}
