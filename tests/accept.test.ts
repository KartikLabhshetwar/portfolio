import { describe, it, expect } from 'vitest';
import { namesExplicitly, negotiate } from '../src/lib/accept';

const produces = ['text/html', 'text/markdown'];

describe('negotiate', () => {
  it('serves html when the client sends no Accept header', () => {
    expect(negotiate(null, produces)).toBe('text/html');
    expect(negotiate(undefined, produces)).toBe('text/html');
    expect(negotiate('   ', produces)).toBe('text/html');
  });

  it('serves html for */*', () => {
    expect(negotiate('*/*', produces)).toBe('text/html');
  });

  it('serves markdown when the client asks for it', () => {
    expect(negotiate('text/markdown', produces)).toBe('text/markdown');
  });

  it('ranks by q value', () => {
    expect(negotiate('text/markdown, text/html;q=0.8', produces)).toBe('text/markdown');
    expect(negotiate('text/markdown;q=0.5, text/html;q=0.9', produces)).toBe('text/html');
  });

  it('treats q=0 as a rejection', () => {
    expect(negotiate('text/markdown;q=0, text/html', produces)).toBe('text/html');
    expect(negotiate('text/html;q=0, text/markdown', produces)).toBe('text/markdown');
  });

  it('returns null when nothing acceptable can be produced', () => {
    expect(negotiate('application/pdf', produces)).toBeNull();
    expect(negotiate('image/png, application/json', produces)).toBeNull();
    expect(negotiate('text/markdown;q=0', ['text/markdown'])).toBeNull();
  });

  it('scores each candidate by its most specific matching range', () => {
    expect(negotiate('*/*;q=0.5, text/markdown', produces)).toBe('text/markdown');
    expect(negotiate('text/markdown, */*', produces)).toBe('text/markdown');
    expect(negotiate('text/markdown;q=0.9, */*;q=1.0', produces)).toBe('text/html');
  });

  it('honours a rejecting wildcard when nothing more specific matches', () => {
    expect(negotiate('*/*;q=0, text/markdown', produces)).toBe('text/markdown');
    expect(negotiate('*/*;q=0', produces)).toBeNull();
  });

  it('matches type wildcards', () => {
    expect(negotiate('text/*', produces)).toBe('text/html');
    expect(negotiate('image/*', produces)).toBeNull();
  });

  it('serves html to a real browser Accept header', () => {
    const chrome = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8';
    expect(negotiate(chrome, produces)).toBe('text/html');
  });

  it('breaks equal-q ties by client order', () => {
    expect(negotiate('text/markdown, text/html', produces)).toBe('text/markdown');
    expect(negotiate('text/html, text/markdown', produces)).toBe('text/html');
  });

  it('ignores whitespace, casing, and unknown parameters', () => {
    expect(negotiate('  TEXT/Markdown ; charset=utf-8 ; q=1 ', produces)).toBe('text/markdown');
  });

  it('clamps malformed q values instead of throwing', () => {
    expect(negotiate('text/markdown;q=abc, text/html;q=0.1', produces)).toBe('text/markdown');
    expect(negotiate('text/markdown;q=5, text/html', produces)).toBe('text/markdown');
    expect(negotiate('text/markdown;q=-1, text/html', produces)).toBe('text/html');
  });
});

describe('namesExplicitly', () => {
  it('is true only when the client lists the exact type', () => {
    expect(namesExplicitly('text/html,application/xhtml+xml,*/*;q=0.8', 'text/html')).toBe(true);
    expect(namesExplicitly('text/markdown', 'text/markdown')).toBe(true);
    expect(namesExplicitly('TEXT/HTML;q=0.9', 'text/html')).toBe(true);
  });

  it('is false for wildcards, absent headers, and rejections', () => {
    expect(namesExplicitly('*/*', 'text/html')).toBe(false);
    expect(namesExplicitly('text/*', 'text/html')).toBe(false);
    expect(namesExplicitly(null, 'text/html')).toBe(false);
    expect(namesExplicitly('   ', 'text/html')).toBe(false);
    expect(namesExplicitly('text/html;q=0', 'text/html')).toBe(false);
    expect(namesExplicitly('text/markdown', 'text/html')).toBe(false);
  });
});
