import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Award, Cloud, Cpu, FileCode2, GraduationCap, Shield, X, type LucideIcon } from 'lucide-react';
import { CertificatePdfViewer } from './CertificatePdfViewer';
import { CERTIFICATE_PDFS, type CertificateAccent, type CertificateItem } from '../data/certificates';
import { useMediaQuery } from '../hooks/useMediaQuery';
const GLASS_CARD_DESKTOP =
  'absolute bottom-0 flex cursor-pointer flex-col overflow-hidden rounded-xl border border-white/75 bg-white/50 text-left shadow-[0_18px_48px_-14px_rgba(15,23,42,0.3)] backdrop-blur-xl sm:rounded-2xl md:rounded-3xl';

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
};

type MobileCertRowProps = {
  cert: CertificateItem;
  index: number;
  onOpen: () => void;
  reduceMotion: boolean;
  /** Spring hover lifts are for real hover pointers only — touch “hover” sticks and fights the tap + modal open. */
  motionHover: boolean;
  hoveredIndex: number | null;
  onHoverStart: () => void;
  onHoverEnd: () => void;
};

/** Horizontal stagger + tilt (column “zigzag”), mirroring the desktop deck’s alternating rhythm. */
const MOBILE_ZIG_X = 14;
const MOBILE_ZIG_ROT = 2.35;
const MOBILE_HOVER_LIFT = 20;
const MOBILE_HOVER_SCALE = 1.045;

function MobileCertRow({
  cert,
  index,
  onOpen,
  reduceMotion,
  motionHover,
  hoveredIndex,
  onHoverStart,
  onHoverEnd,
}: MobileCertRowProps) {
  const BrandIcon = ACCENT[cert.accent].Icon;
  const a = ACCENT[cert.accent];
  const zigLeft = index % 2 === 0;
  const baseX = zigLeft ? -MOBILE_ZIG_X : MOBILE_ZIG_X;
  const baseRot = zigLeft ? -MOBILE_ZIG_ROT : MOBILE_ZIG_ROT;
  const z = hoveredIndex === null ? index + 1 : hoveredIndex === index ? 60 : index + 1;

  const springHover = { type: 'spring' as const, stiffness: 420, damping: 28, mass: 0.78 };

  return (
    <motion.button
      type="button"
      layout={false}
      className="group relative mx-auto flex min-h-[196px] w-full max-w-[min(268px,88vw)] touch-manipulation flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/60 px-3 pb-4 pt-0 text-left shadow-[0_14px_36px_-12px_rgba(15,23,42,0.28)] backdrop-blur-md"
      style={{ zIndex: z, transformOrigin: '50% 50%' }}
      initial={false}
      animate={
        reduceMotion
          ? { x: 0, y: 0, rotate: 0, scale: 1 }
          : { x: baseX, y: 0, rotate: baseRot, scale: 1 }
      }
      transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 32 }}
      whileHover={
        reduceMotion || !motionHover
          ? undefined
          : {
              x: baseX * 0.72,
              y: -MOBILE_HOVER_LIFT,
              scale: MOBILE_HOVER_SCALE,
              rotate: baseRot * 0.62,
              transition: springHover,
            }
      }
      whileTap={{ scale: reduceMotion ? 1 : 0.985 }}
      onClick={onOpen}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onPointerCancel={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.72),transparent_44%),radial-gradient(circle_at_82%_92%,rgba(139,92,246,0.06),transparent_48%)]" />

      <div className={`relative z-[1] h-1.5 w-full shrink-0 rounded-b-sm ${a.bar}`} aria-hidden />

      <div className="relative z-[1] flex min-h-0 flex-1 flex-col gap-3 pt-3">
        <div className="flex gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ${a.iconWrap}`}
          >
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
          <Award
            className="h-5 w-5 text-neutral-400 transition-colors duration-200 group-hover:text-violet-600"
            aria-hidden
          />
          <span className="font-mono text-xl font-black tabular-nums text-neutral-300 transition-colors duration-200 group-hover:text-neutral-400">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-[inherit] px-2 pb-2 pt-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 group-active:opacity-100">
        <div
          className="rounded-b-xl px-2 py-2 shadow-[0_-10px_24px_-4px_rgba(0,0,0,0.32)]"
          style={{
            background:
              'linear-gradient(to top, rgb(10 10 12 / 0.97) 0%, rgb(23 23 26 / 0.92) 38%, rgb(38 38 42 / 0.55) 68%, transparent 100%)',
          }}
        >
          <p className="text-center text-xs font-bold leading-snug tracking-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
            {cert.title}
          </p>
        </div>
      </div>

      <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-neutral-500 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 group-active:opacity-100">
        View
      </span>
    </motion.button>
  );
}

export function CertificatePdfStack() {
  const reduceMotion = useReducedMotion();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const motionHover = !reduceMotion && finePointer;
  const isLg = useMediaQuery('(min-width: 1024px)');
  const isMd = useMediaQuery('(min-width: 768px)');

  const deck = useMemo<DeckMetrics>(() => {
    if (isLg) {
      return { cardW: 300, zigY: 40, hoverLift: 26, trackHeight: 'min(540px, 56vh)' };
    }
    if (isMd) {
      return { cardW: 260, zigY: 32, hoverLift: 22, trackHeight: 'min(480px, 54vh)' };
    }
    return { cardW: 220, zigY: 26, hoverLift: 20, trackHeight: 'min(420px, 50vh)' };
  }, [isLg, isMd]);

  const [lightbox, setLightbox] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [hoveredMobile, setHoveredMobile] = useState<number | null>(null);
  const n = CERTIFICATE_PDFS.length;

  const openCert = useCallback((certIndex: number) => {
    setLightbox(certIndex);
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (ev: globalThis.KeyboardEvent) => {
      if (ev.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKey);

    const scrollY = window.scrollY;
    const html = document.documentElement;
    const prev = {
      bodyOverflow: document.body.style.overflow,
      bodyPosition: document.body.style.position,
      bodyTop: document.body.style.top,
      bodyLeft: document.body.style.left,
      bodyRight: document.body.style.right,
      bodyWidth: document.body.style.width,
      htmlOverflow: html.style.overflow,
    };

    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';

    return () => {
      window.removeEventListener('keydown', onKey);
      html.style.overflow = prev.htmlOverflow;
      document.body.style.overflow = prev.bodyOverflow;
      document.body.style.position = prev.bodyPosition;
      document.body.style.top = prev.bodyTop;
      document.body.style.left = prev.bodyLeft;
      document.body.style.right = prev.bodyRight;
      document.body.style.width = prev.bodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [lightbox]);

  const modalCert = lightbox !== null ? CERTIFICATE_PDFS[lightbox]! : null;

  const springHover = { type: 'spring' as const, stiffness: 420, damping: 28, mass: 0.78 };

  const { cardW, zigY, hoverLift, trackHeight } = deck;

  return (
    <>
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {modalCert ? (
              <motion.div
                key={modalCert.src}
                className="fixed inset-0 z-[200] flex touch-manipulation items-end justify-center p-0 sm:items-center sm:p-4 md:p-6"
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
              >
                <button
                  type="button"
                  aria-label="Close certificate"
                  className="absolute inset-0 touch-manipulation bg-neutral-900/55 backdrop-blur-[2px]"
                  onClick={() => setLightbox(null)}
                />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Certificate"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  className="relative z-10 flex min-h-0 max-h-[100dvh] w-full max-w-4xl touch-manipulation flex-col overflow-hidden overscroll-contain rounded-t-2xl border-2 border-neutral-200 bg-neutral-100 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.45)] sm:max-h-[min(92vh,880px)] sm:rounded-2xl md:rounded-3xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative min-h-0 min-w-0 flex-1 p-2 pt-12 sm:p-3 sm:pt-14">
                    <div className="absolute left-3 top-3 z-[1] flex max-w-[calc(100%-5rem)] items-center gap-2 sm:left-4 sm:top-4">
                      <a
                        href={modalCert.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-xs font-medium text-neutral-600 underline-offset-2 hover:text-neutral-900 hover:underline"
                      >
                        Open in new tab
                      </a>
                    </div>
                    <button
                      type="button"
                      aria-label="Close"
                      className="absolute right-3 top-3 z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-md transition-colors hover:bg-neutral-100 sm:right-4 sm:top-4"
                      onClick={() => setLightbox(null)}
                    >
                      <X className="h-5 w-5" aria-hidden />
                    </button>
                    <div className="rounded-lg bg-white sm:rounded-xl">
                      <CertificatePdfViewer key={modalCert.src} url={modalCert.src} title={modalCert.title} />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body,
        )}

      <div
        className="mx-auto flex w-full max-w-full flex-col items-stretch gap-3 px-0 sm:gap-5 md:gap-6"
        role="region"
        aria-label="Certificates. On small screens credentials stack vertically with a staggered zigzag; on wider screens they appear as a horizontal deck."
      >
        {/* Mobile: vertical column with card-level zigzag (stagger + tilt) + deck hover like sm+ */}
        <div className="-mx-2 flex max-w-full flex-col gap-3 overflow-x-clip px-[max(0.75rem,env(safe-area-inset-left),env(safe-area-inset-right))] pb-1 sm:hidden">
          {CERTIFICATE_PDFS.map((cert, i) => (
            <MobileCertRow
              key={cert.src}
              cert={cert}
              index={i}
              reduceMotion={!!reduceMotion}
              motionHover={motionHover}
              hoveredIndex={hoveredMobile}
              onHoverStart={() => setHoveredMobile(i)}
              onHoverEnd={() => setHoveredMobile((h) => (h === i ? null : h))}
              onOpen={() => openCert(i)}
            />
          ))}
        </div>

        {/* sm+: horizontal zigzag deck */}
        <div className="hidden w-full overflow-x-auto overflow-y-visible overscroll-x-contain pb-4 pt-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] sm:block sm:overflow-x-visible sm:pb-4 sm:pt-2">
          <div
            className="relative mx-auto w-full min-w-0 max-w-full px-1 sm:px-0"
            style={{ height: trackHeight }}
          >
            {CERTIFICATE_PDFS.map((cert, i) => {
              const up = i % 2 === 0;
              const baseY = up ? -zigY : zigY;
              const baseRot = -2.4 + i * 0.45 + (up ? -2 : 2);
              const z = hovered === null ? i + 1 : hovered === i ? 90 : i + 1;
              const BrandIcon = ACCENT[cert.accent].Icon;

              return (
                <motion.button
                  key={cert.src}
                  type="button"
                  layout={false}
                  className={`group ${GLASS_CARD_DESKTOP}`}
                  style={{
                    width: cardW,
                    aspectRatio: '3 / 4',
                    left: cardLeftPercent(i, n, cardW),
                    transformOrigin: '50% 100%',
                    zIndex: z,
                  }}
                  initial={false}
                  animate={{
                    y: baseY,
                    rotate: baseRot,
                    scale: 1,
                  }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 360, damping: 32 }
                  }
                  whileHover={
                    reduceMotion || !motionHover
                      ? undefined
                      : {
                          y: baseY - hoverLift,
                          scale: 1.055,
                          rotate: baseRot * 0.68,
                          transition: springHover,
                        }
                  }
                  onHoverStart={() => setHovered(i)}
                  onHoverEnd={() => setHovered((h) => (h === i ? null : h))}
                  onPointerCancel={() => setHovered((h) => (h === i ? null : h))}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered((h) => (h === i ? null : h))}
                  onClick={() => openCert(i)}
                >
                  <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_22%_12%,rgba(255,255,255,0.75),transparent_46%),radial-gradient(circle_at_78%_88%,rgba(139,92,246,0.07),transparent_50%)]" />

                  <div className={`pointer-events-none h-2 w-full shrink-0 sm:h-2.5 md:h-3 ${ACCENT[cert.accent].bar}`} aria-hidden />
                  <div className="pointer-events-none flex min-h-0 flex-1 flex-col gap-2 p-2.5 pt-2 sm:gap-3 sm:p-3.5 sm:pt-3 md:gap-4 md:p-4 md:pt-3.5">
                    <div className="flex gap-2 sm:gap-3 md:gap-4">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 backdrop-blur-sm sm:h-12 sm:w-12 sm:rounded-2xl md:h-14 md:w-14 ${ACCENT[cert.accent].iconWrap}`}
                      >
                        <BrandIcon
                          className={`h-5 w-5 sm:h-7 sm:w-7 md:h-9 md:w-9 lg:h-10 lg:w-10 ${ACCENT[cert.accent].iconColor}`}
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
                        className="h-5 w-5 shrink-0 text-neutral-400/90 transition-colors duration-200 group-hover:text-violet-600 sm:h-6 sm:w-6 md:h-7 md:w-7"
                        aria-hidden
                      />
                      <span className="font-mono text-[clamp(1.5rem,5vw+0.5rem,3rem)] font-black tabular-nums leading-none text-neutral-300/95 transition-colors duration-200 group-hover:text-neutral-400">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-[inherit] px-1.5 pb-1.5 pt-12 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 group-active:opacity-100 sm:px-2 sm:pb-2 sm:pt-14">
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

                  <span className="pointer-events-none absolute right-2 top-10 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-neutral-500 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:right-3 sm:top-12 sm:px-3 sm:py-1 sm:text-[11px]">
                    View
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
