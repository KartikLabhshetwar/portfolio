// On Cloudflare, runtime secrets live in the `cloudflare:workers` env module
// (prod and dev-via-workerd alike) rather than process.env. Plain Node has no
// such module, so scripts and vitest fall back to process.env.
export async function resolveEnv<T>(): Promise<T> {
  try {
    const m: any = await import('cloudflare:workers' as any);
    return m.env as T;
  } catch {
    return (typeof process !== 'undefined' ? process.env : {}) as T;
  }
}
