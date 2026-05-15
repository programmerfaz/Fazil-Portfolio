/**
 * Vite sometimes emits root-absolute `/assets/...` URLs. Those ignore `import.meta.url`
 * as a base, so they break on subpath deploys (e.g. GitHub Pages `/<repo>/`).
 * Call at runtime so `import.meta.env.BASE_URL` is applied when needed.
 */
export function publicAssetUrl(href: string): string {
  const base = import.meta.env.BASE_URL ?? '/';
  if (base === '/') return href;
  if (typeof window === 'undefined') return href;

  const prefix = base.endsWith('/') ? base.slice(0, -1) : base;

  try {
    const u = new URL(href, window.location.origin);
    const { pathname } = u;
    if (pathname.startsWith('/assets/') && !pathname.startsWith(`${prefix}/`)) {
      return `${u.origin}${prefix}${pathname}${u.search}${u.hash}`;
    }
  } catch {
    /* ignore */
  }

  return href;
}
