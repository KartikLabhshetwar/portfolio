// RFC 9110 §12.5.1 Accept negotiation, per https://acceptmarkdown.com/guides/accept-parsing:
// rank by q, break ties by specificity then client order, honour q=0 as a rejection.
type AcceptEntry = { type: string; q: number; specificity: number };

function parseAccept(header: string): AcceptEntry[] {
  return header.split(',').map((raw) => {
    const parts = raw.trim().split(';').map((s) => s.trim());
    const type = (parts[0] ?? '').toLowerCase();
    let q = 1;
    for (const param of parts.slice(1)) {
      const [name, value] = param.split('=').map((s) => s.trim());
      if (name?.toLowerCase() === 'q') {
        const parsed = Number(value);
        if (!Number.isNaN(parsed)) q = Math.max(0, Math.min(1, parsed));
      }
    }
    const specificity = type === '*/*' ? 0 : type.endsWith('/*') ? 1 : 2;
    return { type, q, specificity };
  });
}

function matches(entry: AcceptEntry, candidate: string): boolean {
  if (entry.type === '*/*') return true;
  if (entry.type.endsWith('/*')) return candidate.startsWith(entry.type.slice(0, -1));
  return entry.type === candidate;
}

/** Best media type to serve, or null when nothing the client accepts can be produced (→ 406). */
export function negotiate(header: string | null | undefined, produces: readonly string[]): string | null {
  const fallback = produces[0] ?? null;
  if (!header?.trim()) return fallback;
  const entries = parseAccept(header);
  if (entries.length === 0) return fallback;

  let best: string | null = null;
  let bestQ = -1;
  let bestPosition = Infinity;

  for (const candidate of produces) {
    let matched: AcceptEntry | null = null;
    let matchedPosition = Infinity;
    for (let idx = 0; idx < entries.length; idx++) {
      const entry = entries[idx]!;
      if (!matches(entry, candidate)) continue;
      if (
        matched === null ||
        entry.specificity > matched.specificity ||
        (entry.specificity === matched.specificity && idx < matchedPosition)
      ) {
        matched = entry;
        matchedPosition = idx;
      }
    }
    if (matched === null || matched.q <= 0) continue;
    if (matched.q > bestQ || (matched.q === bestQ && matchedPosition < bestPosition)) {
      bestQ = matched.q;
      bestPosition = matchedPosition;
      best = candidate;
    }
  }

  return best;
}

// True when the client named this exact type, rather than landing on it via a
// wildcard. Lets an error response prefer Markdown for the wildcard-and-no-header
// clients (agents, curl) while browsers, which always name `text/html`, keep the
// styled page.
export function namesExplicitly(header: string | null | undefined, type: string): boolean {
  if (!header?.trim()) return false;
  return parseAccept(header).some((entry) => entry.type === type.toLowerCase() && entry.q > 0);
}
