import Markdoc from '@markdoc/markdoc';

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

function absolutize(html: string, base: string): string {
  return html.replace(RELATIVE_URL, (_m, attr, path) => `${attr}="${base}/${path}"`);
}

export function postToEmail(post: PostInput, baseUrl: string): PostEmail {
  const base = baseUrl.replace(/\/$/, '');
  const url = `${base}/blog/${post.slug}`;

  // Kit wraps this in its own email template, so plain semantic HTML is all we
  // owe it. No template to build, no CSS to inline.
  const rendered = Markdoc.renderers.html(Markdoc.transform(Markdoc.parse(post.body)));

  return {
    subject: post.title,
    previewText: post.description,
    html: `${absolutize(rendered, base)}\n<p><a href="${url}">Read this on the web →</a></p>`,
  };
}
