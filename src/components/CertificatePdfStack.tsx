import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react';
import { Award, Cloud, Cpu, FileCode2, GraduationCap, Shield, Sparkles, type LucideIcon } from 'lucide-react';
import { CertificateLightbox } from './CertificateLightbox';
import { CERTIFICATE_PDFS, type CertificateAccent, type CertificateItem } from '../data/certificates';

/** Split into rows with near-equal counts (e.g. 11 → 6+5), not fixed-size chunks (7+4). */
function distributeCertsEvenly<T>(items: readonly T[], targetPerRow: number): T[][] {
  const n = items.length;
  if (n === 0) return [];
  if (n <= targetPerRow + 1) return [[...items]];

  const rowCount = Math.ceil(n / targetPerRow);
  const base = Math.floor(n / rowCount);
  const extra = n % rowCount;
  const rows: T[][] = [];
  let offset = 0;
  for (let r = 0; r < rowCount; r++) {
    const size = base + (r < extra ? 1 : 0);
    rows.push(items.slice(offset, offset + size));
    offset += size;
  }
  return rows;
}

const GLASS_CARD_DESKTOP =
  'cert-deck-card flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-white/80 bg-white/[0.94] text-left shadow-[0_18px_48px_-14px_rgba(15,23,42,0.28)] sm:rounded-2xl md:rounded-3xl';

const ACCENT: Record<
  CertificateAccent,
  { bar: string; Icon: LucideIcon; iconWrap: string; iconColor: string }
> = {
  microsoft: {
    bar: 'bg-[#0078d4]',
    Icon: Shield,
    iconWrap: 'bg-[#0078d4]/12 ring-[#0078d4]/25',
    iconColor: 'text-[#0078d4]',
  },
  nvidia: {
    bar: 'bg-[#76b900]',
    Icon: Cpu,
    iconWrap: 'bg-[#76b900]/15 ring-[#76b900]/30',
    iconColor: 'text-[#5a8f00]',
  },
  coursera: {
    bar: 'bg-[#0056d2]',
    Icon: GraduationCap,
    iconWrap: 'bg-[#0056d2]/12 ring-[#0056d2]/25',
    iconColor: 'text-[#0056d2]',
  },
  aws: {
    bar: 'bg-[#ff9900]',
    Icon: Cloud,
    iconWrap: 'bg-[#ff9900]/15 ring-[#ff9900]/35',
    iconColor: 'text-[#d87600]',
  },
  web: {
    bar: 'bg-gradient-to-r from-orange-500 via-rose-500 to-violet-600',
    Icon: FileCode2,
    iconWrap: 'bg-gradient-to-br from-orange-500/15 to-violet-600/15 ring-orange-400/25',
    iconColor: 'text-orange-700',
  },
  anthropic: {
    bar: 'bg-[#d97757]',
    Icon: Sparkles,
    iconWrap: 'bg-[#d97757]/12 ring-[#d97757]/25',
    iconColor: 'text-[#c45f3f]',
  },
};

function cardLeftPercent(i: number, n: number, cardPx: number): string {
  if (n <= 1) return `calc(50% - ${cardPx / 2}px)`;
  return `calc((100% - ${cardPx}px) * ${i} / ${n - 1})`;
}

type DeckMetrics = {
  cardW: number;
  zigY: number;
  hoverLift: number;
  trackHeight: string;
  /** Comfortable cards per row — used to pick an even row split, not a hard cap. */
  targetPerRow: number;
};

function deckFromWidth(width: number): DeckMetrics {
  if (width >= 1024) {
    return {
      cardW: 300,
      zigY: 40,
      hoverLift: 26,
      trackHeight: 'min(540px, 56vh)',
      targetPerRow: 6,
    };
  }
  if (width >= 768) {
    return {
      cardW: 260,
      zigY: 32,
      hoverLift: 22,
      trackHeight: 'min(480px, 54vh)',
      targetPerRow: 5,
    };
  }
  return {
    cardW: 220,
    zigY: 26,
    hoverLift: 20,
    trackHeight: 'min(420px, 50vh)',
    targetPerRow: 4,
  };
}

function useDeckMetrics(): DeckMetrics {
  const [deck, setDeck] = useState(() =>
    typeof window === 'undefined' ? deckFromWidth(1024) : deckFromWidth(window.innerWidth),
  );

  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setDeck(deckFromWidth(window.innerWidth)));
    };
    onResize();
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return deck;
}

type CertCardStyle = CSSProperties & {
  '--cert-x'?: string;
  '--cert-y'?: string;
  '--cert-r'?: string;
  '--cert-r-hover'?: string;
  '--cert-lift'?: string;
  '--cert-z'?: string;
};

const MOBILE_ZIG_X = 14;
const MOBILE_ZIG_ROT = 2.35;

type MobileCertRowProps = {
  cert: CertificateItem;
  index: number;
};

const MobileCertRow = memo(function MobileCertRow({ cert, index }: MobileCertRowProps) {
  const a = ACCENT[cert.accent];
  const BrandIcon = a.Icon;
  const zigLeft = index % 2 === 0;
  const baseRot = zigLeft ? -MOBILE_ZIG_ROT : MOBILE_ZIG_ROT;
  const cardStyle: CertCardStyle = {
    '--cert-x': `${zigLeft ? -MOBILE_ZIG_X : MOBILE_ZIG_X}px`,
    '--cert-y': '0px',
    '--cert-r': `${baseRot}deg`,
    '--cert-r-hover': `${baseRot * 0.62}deg`,
    '--cert-lift': '20px',
    '--cert-z': String(index + 1),
  };

  return (
    <button
      type="button"
      data-cert-index={index}
      className="cert-mobile-card group relative mx-auto flex min-h-[196px] w-full max-w-[min(268px,88vw)] touch-manipulation flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/[0.94] px-3 pb-4 pt-0 text-left shadow-[0_14px_36px_-12px_rgba(15,23,42,0.28)]"
      style={cardStyle}
    >
      <div className={`relative z-[1] h-1.5 w-full shrink-0 rounded-b-sm ${a.bar}`} aria-hidden />

      <div className="relative z-[1] flex min-h-0 flex-1 flex-col gap-3 pt-3">
        <div className="flex gap-3">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ${a.iconWrap}`}>
            <BrandIcon className={`h-6 w-6 ${a.iconColor}`} strokeWidth={2.1} aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold leading-snug text-neutral-900">{cert.gist}</p>
            <p className="mt-2 text-[11px] font-medium leading-relaxed text-neutral-600">{cert.title}</p>
          </div>
        </div>

        <ul className="space-y-2 border-t border-neutral-200/55 pt-3">
          {cert.highlights.map((line) => (
            <li key={line} className="flex gap-2 text-[11px] leading-relaxed text-neutral-600">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-400" aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between border-t border-neutral-200/60 pt-3">
          <Award className="h-5 w-5 text-neutral-400 group-hover:text-violet-600" aria-hidden />
          <span className="font-mono text-xl font-black tabular-nums text-neutral-300 group-hover:text-neutral-400">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>

      <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-neutral-500 opacity-0 shadow-sm group-hover:opacity-100 group-focus-visible:opacity-100">
        View
      </span>
    </button>
  );
});

type DesktopCertCardProps = {
  cert: CertificateItem;
  globalIndex: number;
  i: number;
  rowCount: number;
  cardW: number;
  zigY: number;
  hoverLift: number;
};

const DesktopCertCard = memo(function DesktopCertCard({
  cert,
  globalIndex,
  i,
  rowCount,
  cardW,
  zigY,
  hoverLift,
}: DesktopCertCardProps) {
  const a = ACCENT[cert.accent];
  const BrandIcon = a.Icon;
  const up = i % 2 === 0;
  const baseY = up ? -zigY : zigY;
  const baseRot = -2.4 + i * 0.45 + (up ? -2 : 2);

  const slotStyle: CertCardStyle = {
    width: cardW,
    aspectRatio: '3 / 4',
    left: cardLeftPercent(i, rowCount, cardW),
    '--cert-z': String(i + 1),
  };

  const cardStyle: CertCardStyle = {
    '--cert-y': `${baseY}px`,
    '--cert-r': `${baseRot}deg`,
    '--cert-r-hover': `${baseRot * 0.68}deg`,
    '--cert-lift': `${hoverLift}px`,
  };

  return (
    <div className="cert-deck-slot" style={slotStyle}>
      <button type="button" data-cert-index={globalIndex} className={`group ${GLASS_CARD_DESKTOP}`} style={cardStyle}>
      <div className={`pointer-events-none h-2 w-full shrink-0 sm:h-2.5 md:h-3 ${a.bar}`} aria-hidden />
      <div className="pointer-events-none flex min-h-0 flex-1 flex-col gap-2 p-2.5 pt-2 sm:gap-3 sm:p-3.5 sm:pt-3 md:gap-4 md:p-4 md:pt-3.5">
        <div className="flex gap-2 sm:gap-3 md:gap-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 sm:h-12 sm:w-12 sm:rounded-2xl md:h-14 md:w-14 ${a.iconWrap}`}
          >
            <BrandIcon
              className={`h-5 w-5 sm:h-7 sm:w-7 md:h-9 md:w-9 lg:h-10 lg:w-10 ${a.iconColor}`}
              strokeWidth={2.1}
              aria-hidden
            />
          </div>
          <div className="flex min-w-0 flex-1 items-center">
            <p className="text-[clamp(0.8rem,2.5vw+0.2rem,1.25rem)] font-bold leading-tight tracking-tight text-neutral-900">
              {cert.gist}
            </p>
          </div>
        </div>

        <ul className="pointer-events-none space-y-1 border-t border-neutral-200/55 pt-2 sm:space-y-2 sm:pt-3 md:space-y-2.5 md:pt-4">
          {cert.highlights.map((line) => (
            <li
              key={line}
              className="flex gap-2 text-[clamp(0.7rem,1.8vw+0.15rem,0.95rem)] font-medium leading-tight text-neutral-700 sm:gap-2.5"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400/90 sm:mt-2 sm:h-2 sm:w-2" aria-hidden />
              <span className="line-clamp-2 sm:line-clamp-1">{line}</span>
            </li>
          ))}
        </ul>

        <div className="pointer-events-none mt-auto flex items-end justify-between gap-2 border-t border-neutral-200/60 pt-2 sm:pt-3">
          <Award
            className="h-5 w-5 shrink-0 text-neutral-400/90 group-hover:text-violet-600 sm:h-6 sm:w-6 md:h-7 md:w-7"
            aria-hidden
          />
          <span className="font-mono text-[clamp(1.5rem,5vw+0.5rem,3rem)] font-black tabular-nums leading-none text-neutral-300/95 group-hover:text-neutral-400">
            {String(globalIndex + 1).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-[inherit] px-1.5 pb-1.5 pt-10 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 sm:px-2 sm:pb-2 sm:pt-14">
        <div
          className="rounded-b-xl px-2 py-2.5 shadow-[0_-12px_28px_-4px_rgba(0,0,0,0.35)] sm:rounded-b-2xl sm:py-3 md:rounded-b-3xl"
          style={{
            background:
              'linear-gradient(to top, rgb(10 10 12 / 0.97) 0%, rgb(23 23 26 / 0.92) 38%, rgb(38 38 42 / 0.55) 68%, transparent 100%)',
          }}
        >
          <p className="text-center text-[clamp(0.7rem,2vw+0.2rem,1rem)] font-bold leading-snug tracking-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
            {cert.title}
          </p>
        </div>
      </div>

      <span className="pointer-events-none absolute right-2 top-10 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-neutral-500 opacity-0 shadow-sm group-hover:opacity-100 group-focus-visible:opacity-100 sm:right-3 sm:top-12 sm:px-3 sm:py-1 sm:text-[11px]">
        View
      </span>
      </button>
    </div>
  );
});

export function CertificatePdfStack() {
  const deck = useDeckMetrics();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const { certRows, rowOffsets } = useMemo(() => {
    const rows = distributeCertsEvenly(CERTIFICATE_PDFS, deck.targetPerRow);
    const offsets: number[] = [];
    let sum = 0;
    for (const row of rows) {
      offsets.push(sum);
      sum += row.length;
    }
    return { certRows: rows, rowOffsets: offsets };
  }, [deck.targetPerRow]);

  const closeCert = useCallback(() => setLightbox(null), []);

  const modalCert = lightbox !== null ? CERTIFICATE_PDFS[lightbox]! : null;
  const deckLocked = lightbox !== null;

  const handleDeckClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const raw = (e.target as HTMLElement).closest<HTMLElement>('[data-cert-index]')?.dataset.certIndex;
    if (raw == null) return;
    const index = Number(raw);
    if (!Number.isNaN(index)) setLightbox(index);
  }, []);
  const { cardW, zigY, hoverLift, trackHeight } = deck;

  return (
    <>
      {modalCert ? (
        <CertificateLightbox title={modalCert.title} src={modalCert.src} onClose={closeCert} />
      ) : null}

      <div
        className="mx-auto flex w-full max-w-full flex-col items-stretch gap-3 px-0 sm:gap-5 md:gap-6"
        role="region"
        aria-label="Certificates. On small screens credentials stack vertically; on wider screens they appear as a horizontal deck."
      >
        <div
          className={`-mx-2 flex max-w-full flex-col gap-3 overflow-x-clip px-[max(0.75rem,env(safe-area-inset-left),env(safe-area-inset-right))] pb-1 sm:hidden ${deckLocked ? 'pointer-events-none' : ''}`}
          onClick={handleDeckClick}
        >
          {CERTIFICATE_PDFS.map((cert, i) => (
            <MobileCertRow key={cert.src} cert={cert} index={i} />
          ))}
        </div>

        <div
          className={`cert-deck-rows hidden w-full flex-col gap-10 pb-4 pt-2 sm:flex sm:gap-12 sm:pb-4 sm:pt-2 md:gap-14 ${deckLocked ? 'cert-deck-rows--locked' : ''}`}
          onClick={handleDeckClick}
        >
          {certRows.map((rowCerts, rowIndex) => {
            const rowOffset = rowOffsets[rowIndex] ?? 0;

            return (
              <div
                key={`cert-row-${rowOffset}`}
                className="cert-deck-row mx-auto min-w-0 max-w-full px-1 sm:px-0"
                style={{ height: trackHeight }}
              >
                {rowCerts.map((cert, i) => {
                  const globalIndex = rowOffset + i;
                  return (
                    <DesktopCertCard
                      key={cert.src}
                      cert={cert}
                      globalIndex={globalIndex}
                      i={i}
                      rowCount={rowCerts.length}
                      cardW={cardW}
                      zigY={zigY}
                      hoverLift={hoverLift}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
