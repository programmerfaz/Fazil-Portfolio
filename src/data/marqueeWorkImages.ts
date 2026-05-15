/**
 * Work screenshots in `src/assets/*.png` (Vite resolves to hashed URLs).
 * Caps “tourism / Siyaha-style” frames (t7, t8) so the strip stays mixed.
 */
const modules = import.meta.glob('../assets/*.png', { eager: true, import: 'default' }) as Record<string, string>;

export type MarqueeImage = {
  src: string;
  layout: 'mobile' | 'wide';
  /** When true, never switch to phone framing from pixel aspect (desktop captures). */
  desktopLock: boolean;
};

function pathKey(fullPath: string): string {
  const seg = fullPath.split('/').pop() ?? fullPath;
  return seg.toLowerCase();
}

function isExcluded(path: string): boolean {
  const k = pathKey(path);
  return k === 'hero.png';
}

/** Likely SiyahaBH / tourism UI captures — show at most a couple per marquee */
function isTourismHeavy(path: string): boolean {
  const k = pathKey(path);
  return k === 't7.png' || k === 't8.png';
}

/** Explicit phone / SiyahaBH app captures only — not every portrait PNG in assets */
const MOBILE_APP_FILENAMES = new Set(['t7.png', 't8.png']);

function isMobileAppScreenshot(path: string): boolean {
  const k = pathKey(path);
  if (MOBILE_APP_FILENAMES.has(k)) return true;
  return /^screenshot/i.test(k);
}

/** Known desktop / chart / site captures — keep wide tile + object-cover */
function isDesktopLocked(path: string): boolean {
  const k = pathKey(path);
  if (k.startsWith('real_estate')) return true;
  if (k.startsWith('movie')) return true;
  if (k === 'svm.png') return true;
  if (k.includes('breast cancer')) return true;
  if (k.includes('ml ')) return true;
  return false;
}

function toMarqueeImage(path: string, url: string): MarqueeImage {
  return {
    src: url,
    layout: isMobileAppScreenshot(path) ? 'mobile' : 'wide',
    desktopLock: isDesktopLocked(path),
  };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MAX_TOURISM_IN_STRIP = 2;

/**
 * Returns [row1, row2] image arrays (not yet tripled). Random order each call.
 */
export function pickMarqueeRows(): [MarqueeImage[], MarqueeImage[]] {
  const entries = Object.entries(modules).filter(([path]) => !isExcluded(path));
  const tourism: MarqueeImage[] = [];
  const general: MarqueeImage[] = [];

  for (const [path, url] of entries) {
    const item = toMarqueeImage(path, url);
    if (isTourismHeavy(path)) tourism.push(item);
    else general.push(item);
  }

  const g = shuffle(general);
  const t = shuffle(tourism).slice(0, MAX_TOURISM_IN_STRIP);

  const pool = shuffle([...g, ...t]);
  if (pool.length === 0) return [[], []];

  const mid = Math.ceil(pool.length / 2);
  const row1 = pool.slice(0, mid);
  const row2 = pool.slice(mid);
  return [row1.length ? row1 : pool, row2.length ? row2 : pool];
}

export function tripleImages(items: MarqueeImage[]): MarqueeImage[] {
  if (items.length === 0) return [];
  return [...items, ...items, ...items];
}
