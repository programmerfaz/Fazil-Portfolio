import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { TechBrandIcon } from './TechBrandIcon';
import { SKILL_GROUPS } from '../data/profile';
import { useMediaQuery } from '../hooks/useMediaQuery';

/**
 * Skill cards — rose / amber / lime sunset theme on all viewports (matches former “web” ≥640px look).
 */
const P = {
  /** Web — saturated sunset header + dark shell */
  webHeaderTop: '#2a0410',
  webHeaderMid: '#9f1239',
  webHeaderBot: '#ea580c',
  webAccentAmber: '#fcd34d',
  webAccentLime: '#bef264',
  webGlowA: '250, 204, 21',
  webGlowB: '244, 63, 94',
  webShellTop: '#1f0d14',
  webShellMid: '#14060c',
  webShellBot: '#0a0306',
  webBody: '#160810',
  webTechPanel: '#080304',
} as const;

type SkillGroup = (typeof SKILL_GROUPS)[number];

/** Shortest signed distance from active index on a circle (for 5 cards → -2..2). */
function carouselOffset(i: number, active: number, n: number): number {
  let d = i - active;
  const half = n / 2;
  if (d > half) d -= n;
  if (d < -half) d += n;
  return d;
}

type SlotMotion = {
  x: number;
  z: number;
  rotateY: number;
  rotateX: number;
  scale: number;
  opacity: number;
};

/** Web (≥768) and tablet (640–767) match existing layout; only &lt;640px tightens 3D offsets. */
type SlotTier = 'wide' | 'cozy' | 'compact';

function slotForOffset(offset: number, tier: SlotTier): SlotMotion {
  const cfg =
    tier === 'wide'
      ? { tx1: 268, tx2: 438, rot1: 32, rot2: 46, zFar: 420, rotFar: 48 }
      : tier === 'cozy'
        ? { tx1: 158, tx2: 268, rot1: 28, rot2: 40, zFar: 280, rotFar: 44 }
        : { tx1: 92, tx2: 158, rot1: 22, rot2: 30, zFar: 200, rotFar: 40 };
  const { tx1, tx2, rot1, rot2, zFar, rotFar } = cfg;
  switch (offset) {
    case 0:
      return { x: 0, z: 88, rotateY: 0, rotateX: 0, scale: 1, opacity: 1 };
    case -1:
      return { x: -tx1, z: 12, rotateY: rot1, rotateX: 4, scale: 0.9, opacity: 1 };
    case 1:
      return { x: tx1, z: 12, rotateY: -rot1, rotateX: 4, scale: 0.9, opacity: 1 };
    case -2:
      return { x: -tx2, z: -52, rotateY: rot2, rotateX: 7, scale: 0.82, opacity: 0.94 };
    case 2:
      return { x: tx2, z: -52, rotateY: -rot2, rotateX: 7, scale: 0.82, opacity: 0.94 };
    default:
      return { x: offset * zFar, z: -90, rotateY: offset * -rotFar, rotateX: 8, scale: 0.72, opacity: 0 };
  }
}

const springTransition = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 32,
  mass: 0.85,
};

const reducedMotionTransition = { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const };

type SkillFlipCardProps = {
  group: SkillGroup;
  isActive: boolean;
};

function SkillFlipCard({ group, isActive }: SkillFlipCardProps) {
  const { title, tagline, summary, technologies } = group;
  const previewIcons = useMemo(() => technologies.slice(0, 8), [technologies]);
  const canHover = useMediaQuery('(hover: hover)');
  /** Icon raster size only — slightly smaller on narrow phones so chips still wrap cleanly. */
  const roomy = useMediaQuery('(min-width: 640px)');
  const previewIconSize = roomy ? 38 : 30;
  const backTechIconSize = roomy ? 30 : 26;
  const [touchFlipped, setTouchFlipped] = useState(false);
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setTouchFlipped(false);
    setHover(false);
    setFocused(false);
  }, [group.n]);

  const interactive = isActive;

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isActive) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty('--gx', `${x}%`);
    el.style.setProperty('--gy', `${y}%`);
  }, [isActive]);

  const handleTouchFlipToggle = useCallback(() => {
    if (!interactive || canHover) return;
    setTouchFlipped((v) => !v);
  }, [interactive, canHover]);

  const handleTouchKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!interactive || canHover) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setTouchFlipped((v) => !v);
      }
    },
    [interactive, canHover],
  );

  /** CSS group-hover breaks easily under nested 3D transforms — drive flip explicitly */
  const showBack =
    interactive &&
    ((!canHover && touchFlipped) || (canHover && (hover || focused)));

  return (
    <div
        className={`relative isolate mx-auto w-[min(96vw,600px)] max-w-[600px] max-sm:max-w-[min(calc(100%-1.5rem),600px)] ${!interactive ? 'pointer-events-none select-none' : ''}`}
      style={
        {
          perspective: '2000px',
        } as React.CSSProperties
      }
    >
      <div
        onPointerMove={interactive ? onPointerMove : undefined}
        onMouseEnter={() => interactive && canHover && setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocusCapture={() => interactive && canHover && setFocused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
        }}
        onClick={interactive && !canHover ? handleTouchFlipToggle : undefined}
        onKeyDown={handleTouchKeyDown}
        role={interactive && !canHover ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-pressed={interactive && !canHover ? showBack : undefined}
        className={`relative h-[min(820px,88vh)] min-h-[640px] rounded-[36px] outline-none ring-offset-2 ring-offset-[#0a0306] max-sm:h-[min(calc(100dvh-12rem),600px)] max-sm:min-h-[min(420px,calc(100dvh-11rem))] max-sm:max-h-[calc(100dvh-5rem)] max-sm:rounded-2xl ${
          interactive && canHover
            ? 'cursor-pointer focus-visible:ring-2 focus-visible:ring-fuchsia-400 focus-visible:ring-offset-2 max-sm:focus-visible:ring-offset-1'
            : interactive && !canHover
              ? 'cursor-pointer touch-manipulation focus-visible:ring-2 focus-visible:ring-fuchsia-400 focus-visible:ring-offset-2 max-sm:focus-visible:ring-offset-1'
              : ''
        }`}
        aria-hidden={!interactive}
        aria-label={
          interactive && canHover
            ? `${title}. ${tagline} Hover or focus to flip for details.`
            : interactive && !canHover
              ? `${title}. ${tagline} Tap to flip the card and see tools and notes.`
              : interactive
                ? `${title}. ${tagline}`
                : undefined
        }
      >
        {/* Cursor shimmer — warm flare on web */}
        <div
          className={`pointer-events-none absolute -inset-px rounded-[36px] transition-opacity duration-300 max-sm:rounded-2xl ${
            interactive && (hover || focused) && !showBack ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden
          style={{
            background: `radial-gradient(520px circle at var(--gx,50%) var(--gy,50%), rgba(${P.webGlowA},0.38), rgba(${P.webGlowB},0.22) 38%, transparent 68%)`,
          }}
        />

        <div
          className={`relative h-full rounded-[36px] [transform-style:preserve-3d] transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:duration-200 max-sm:rounded-2xl ${
            interactive && (hover || focused)
              ? 'shadow-[0_40px_90px_-20px_rgba(244,63,94,0.45)] ring-2 ring-fuchsia-400/70'
              : ''
          }`}
          style={{
            transform: showBack ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformOrigin: 'center center',
          }}
        >
          {/* Front — vivid dark header; no white fade over headline text */}
          <div
            className={`absolute inset-0 flex flex-col overflow-hidden rounded-2xl border-2 border-fuchsia-900/50 text-amber-50/95 shadow-[0_48px_100px_-28px_rgba(190,24,93,0.35)] [backface-visibility:hidden] sm:rounded-[36px] sm:border-[3px] sm:border-slate-800/80 ${!interactive ? 'opacity-[0.82] saturate-[0.92]' : ''} ${showBack ? 'pointer-events-none' : ''}`}
            style={{
              background: `linear-gradient(180deg, ${P.webShellTop} 0%, ${P.webShellMid} 42%, ${P.webShellBot} 100%)`,
            }}
          >
            <div
              className="relative h-[40%] shrink-0 overflow-hidden rounded-t-2xl border-b-2 border-amber-400/85 sm:rounded-t-[28px]"
              style={{
                background: `linear-gradient(165deg, ${P.webHeaderTop} 0%, ${P.webHeaderMid} 42%, ${P.webHeaderBot} 100%)`,
              }}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-300 via-fuchsia-500 to-rose-600"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-80"
                style={{
                  background: `radial-gradient(ellipse 95% 75% at 50% 0%, rgba(${P.webGlowA},0.2) 0%, rgba(${P.webGlowB},0.18) 35%, transparent 58%)`,
                }}
              />
              <div className="relative z-10 flex flex-col px-5 pb-4 pt-6 max-sm:px-3 max-sm:pb-3 max-sm:pt-5 sm:px-8 sm:pb-5 sm:pt-7">
                <h3
                  className="text-center text-2xl font-black uppercase tracking-tight text-white max-sm:text-lg max-sm:leading-tight sm:text-[2.15rem] sm:leading-tight"
                  style={{
                    textShadow: `0 0 48px rgba(${P.webGlowB},0.55), 0 0 28px rgba(${P.webGlowA},0.35), 0 3px 14px rgba(0,0,0,0.95)`,
                  }}
                >
                  {title}
                </h3>
                <p
                  className="mx-auto mt-2 max-w-[28ch] text-center text-[13px] font-extrabold leading-snug max-sm:mt-1.5 max-sm:text-[11px] sm:mt-2.5 sm:text-sm sm:leading-relaxed"
                  style={{
                    color: P.webAccentAmber,
                    textShadow: `0 2px 16px rgba(0,0,0,0.95), 0 0 26px rgba(${P.webGlowA},0.45)`,
                  }}
                >
                  {tagline}
                </p>
              </div>
            </div>

            <div
              className="relative flex flex-1 flex-col px-6 pb-8 pt-6 max-sm:px-3 max-sm:pb-5 max-sm:pt-4 sm:px-10 sm:pb-10 sm:pt-8"
              style={{ backgroundColor: P.webBody }}
            >
              <div className="mb-4 flex flex-wrap justify-center gap-3 max-sm:mb-2 max-sm:gap-2 sm:gap-3.5">
                {previewIcons.map((tech) => (
                  <span
                    key={`front-${tech.name}`}
                    className="inline-flex rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-white via-amber-50 to-orange-100 p-3.5 shadow-[0_4px_20px_rgba(251,191,36,0.45)] ring-2 ring-fuchsia-500/50 max-sm:rounded-xl max-sm:p-2"
                    title={tech.name}
                  >
                    <TechBrandIcon
                      name={tech.name}
                      lucideKey={tech.icon}
                      size={previewIconSize}
                      surface="light"
                    />
                  </span>
                ))}
              </div>

              <p className="mx-auto mt-1 max-w-[96%] px-1 text-center text-xs font-medium leading-snug text-rose-100/75 max-sm:text-[10px] sm:max-w-lg sm:text-sm">
                {interactive
                  ? canHover
                    ? 'Hover to flip — full stack and notes on the other side.'
                    : 'Tap anywhere on the card to flip — see tools and notes on the other side.'
                  : 'Use arrows to bring this card forward.'}
              </p>

              <div className="mt-auto flex items-center justify-end gap-2 pt-4 font-black text-lime-300 drop-shadow-[0_0_12px_rgba(190,242,100,0.55)]">
                <RotateCw className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.25} aria-hidden />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] sm:text-[11px]">Flip</span>
              </div>
            </div>
          </div>

          {/* Back — matches front energy on web */}
          <div
            className={`absolute inset-0 flex flex-col overflow-hidden rounded-2xl border-2 border-fuchsia-900/50 text-amber-50/95 shadow-[0_48px_100px_-28px_rgba(190,24,93,0.35)] [backface-visibility:hidden] [transform:rotateY(180deg)] [transform-style:preserve-3d] sm:rounded-[36px] sm:border-[3px] sm:border-slate-800/80 ${!showBack ? 'pointer-events-none' : ''}`}
            style={{
              background: P.webShellMid,
            }}
          >
            <div
              className="relative max-h-[min(280px,38vh)] shrink-0 overflow-hidden rounded-t-2xl border-b-2 border-amber-400/85 max-sm:max-h-[min(220px,42svh)] sm:max-h-[min(300px,36vh)] sm:rounded-t-[28px]"
              style={{
                background: `linear-gradient(165deg, ${P.webHeaderTop} 0%, ${P.webHeaderMid} 42%, ${P.webHeaderBot} 100%)`,
              }}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-300 via-fuchsia-500 to-rose-600"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-80"
                style={{
                  background: `radial-gradient(ellipse 95% 75% at 50% 0%, rgba(${P.webGlowA},0.18) 0%, rgba(${P.webGlowB},0.16) 40%, transparent 58%)`,
                }}
              />
              <div className="relative z-10 flex max-h-[inherit] min-h-0 flex-col overflow-y-auto overscroll-contain px-4 pb-5 pt-5 max-sm:px-3 max-sm:pb-4 max-sm:pt-4 sm:px-7 sm:pb-6 sm:pt-6">
                <h3
                  className="shrink-0 text-center text-lg font-black uppercase tracking-tight text-white max-sm:text-base sm:text-xl"
                  style={{
                    textShadow: `0 0 36px rgba(${P.webGlowB},0.5), 0 2px 14px rgba(0,0,0,0.95)`,
                  }}
                >
                  {title}
                </h3>
                <p
                  className="mx-auto mt-1.5 max-w-[34ch] shrink-0 text-center text-[12px] font-extrabold leading-snug max-sm:mt-1 max-sm:text-[11px] sm:text-[13px]"
                  style={{
                    color: P.webAccentAmber,
                    textShadow: `0 2px 12px rgba(0,0,0,0.95), 0 0 20px rgba(${P.webGlowA},0.35)`,
                  }}
                >
                  {tagline}
                </p>
                <p
                  className="mx-auto mt-3 max-w-[42ch] shrink-0 text-pretty text-center text-[12px] font-bold leading-relaxed text-amber-50/95 max-sm:mt-2 max-sm:text-[11px] sm:text-[13px]"
                >
                  {summary}
                </p>
              </div>
            </div>

            <div
              className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden border-t border-fuchsia-950/50 px-4 py-3 max-sm:gap-1.5 max-sm:px-2 max-sm:py-2 sm:gap-3 sm:px-6 sm:py-4"
              style={{ backgroundColor: P.webTechPanel }}
            >
              <p className="shrink-0 text-[11px] font-black uppercase tracking-[0.24em] text-amber-200/90 max-sm:text-[10px] max-sm:tracking-[0.2em]">
                Technologies
              </p>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch] pr-0.5">
                <div className="grid auto-rows-min grid-cols-3 gap-1.5 pb-3 max-sm:gap-1 max-sm:pb-2 sm:gap-2">
                  {technologies.map((tech) => (
                    <div
                      key={`back-${tech.name}`}
                      title={tech.blurb ? `${tech.name} — ${tech.blurb}` : tech.name}
                      className="flex min-h-0 flex-col items-center gap-1 rounded-lg border-2 border-fuchsia-500 bg-gradient-to-b from-white to-amber-50 px-1.5 py-2 text-center shadow-[0_6px_22px_-6px_rgba(217,70,239,0.45)] max-sm:gap-0.5 max-sm:rounded-md max-sm:px-1 max-sm:py-1.5 sm:rounded-xl sm:px-2 sm:py-2"
                    >
                      <span
                        className="inline-flex rounded-lg border-2 border-amber-400 bg-white p-1.5 shadow-sm max-sm:rounded-md max-sm:p-1 sm:rounded-xl sm:p-2"
                      >
                        <TechBrandIcon
                          name={tech.name}
                          lucideKey={tech.icon}
                          size={backTechIconSize}
                          surface="light"
                        />
                      </span>
                      <p
                        className="w-full truncate text-[10px] font-bold leading-tight text-fuchsia-950 max-sm:text-[9px] sm:text-[11px]"
                      >
                        {tech.name}
                      </p>
                      {tech.blurb ? (
                        <p
                          className="line-clamp-2 w-full text-[8px] font-semibold leading-tight text-rose-800/90 max-sm:text-[7.5px] sm:text-[9px]"
                        >
                          {tech.blurb}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkillFlipCardCarousel() {
  const skills = useMemo(() => [...SKILL_GROUPS], []);
  const [index, setIndex] = useState(0);
  const total = skills.length;
  const wide768 = useMediaQuery('(min-width: 768px)');
  const cozy640 = useMediaQuery('(min-width: 640px)');
  const narrowPhone = useMediaQuery('(max-width: 639px)');
  const slotTier: SlotTier = wide768 ? 'wide' : cozy640 ? 'cozy' : 'compact';
  const reduceMotion = useReducedMotion();

  const perspectivePx = wide768 ? 1900 : narrowPhone ? 820 : 1250;

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + total) % total);
    },
    [total],
  );

  return (
    <div className="relative mx-auto w-full max-w-[1600px] px-0 sm:px-2 md:px-4">
      {/* Sunset / neon card chrome on all breakpoints */}
      <div
        className="relative mx-auto flex min-h-[min(820px,90vh)] w-full items-center justify-center overflow-visible py-6 max-sm:min-h-[min(calc(100dvh-10rem),620px))] max-sm:overflow-x-clip max-sm:py-4 max-sm:pb-[max(5.5rem,env(safe-area-inset-bottom))] sm:min-h-[min(900px,92vh)] sm:overflow-visible sm:py-10 sm:pb-10"
        aria-roledescription="carousel"
        aria-label="Skill areas"
      >
        <div
          className="relative mx-auto h-[min(820px,90vh)] w-full max-w-[1600px] outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0a0306] max-sm:h-[min(calc(100dvh-10rem),620px))] max-sm:focus-visible:ring-offset-2 sm:h-[min(900px,92vh)]"
          style={{ perspective: `${perspectivePx}px` }}
          tabIndex={0}
          role="region"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              go(-1);
            }
            if (e.key === 'ArrowRight') {
              e.preventDefault();
              go(1);
            }
          }}
        >
          <div className="absolute inset-0 [transform-style:preserve-3d]">
            {skills.map((group, i) => {
              const offset = carouselOffset(i, index, total);
              const slot = slotForOffset(offset, slotTier);
              const zBase = 30 - Math.abs(offset) * 10 + (offset === 0 ? 40 : 0);

              return (
                <div
                  key={group.n}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    zIndex: zBase,
                    pointerEvents: i === index ? 'auto' : 'none',
                  }}
                >
                  <motion.div
                    className="w-[min(96vw,600px)] max-w-[600px] max-sm:w-full max-sm:max-w-[min(calc(100%-1.5rem),600px)]"
                    initial={false}
                    animate={{
                      x: slot.x,
                      z: slot.z,
                      rotateY: slot.rotateY,
                      rotateX: slot.rotateX,
                      scale: slot.scale,
                      opacity: slot.opacity,
                    }}
                    transition={reduceMotion ? reducedMotionTransition : springTransition}
                    style={{
                      transformStyle: 'preserve-3d',
                      willChange: 'transform',
                    }}
                  >
                    <SkillFlipCard group={group} isActive={i === index} />
                  </motion.div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-[max(0.25rem,env(safe-area-inset-left))] top-1/2 z-[80] flex h-12 w-12 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full border-2 border-amber-400/90 bg-gradient-to-br from-rose-900 to-orange-900 text-amber-200 shadow-[0_0_24px_rgba(244,63,94,0.45)] transition hover:brightness-110 hover:shadow-lg active:scale-95 max-sm:top-[42%] max-sm:h-11 max-sm:min-h-[44px] max-sm:w-11 max-sm:min-w-[44px] sm:left-3 sm:top-1/2 sm:h-14 sm:min-h-0 sm:w-14 sm:min-w-0 md:left-5"
            aria-label="Previous skill card"
          >
            <ChevronLeft className="h-7 w-7 max-sm:h-6 max-sm:w-6 sm:h-8 sm:w-8" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-[max(0.25rem,env(safe-area-inset-right))] top-1/2 z-[80] flex h-12 w-12 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full border-2 border-amber-400/90 bg-gradient-to-br from-rose-900 to-orange-900 text-amber-200 shadow-[0_0_24px_rgba(244,63,94,0.45)] transition hover:brightness-110 hover:shadow-lg active:scale-95 max-sm:top-[42%] max-sm:h-11 max-sm:min-h-[44px] max-sm:w-11 max-sm:min-w-[44px] sm:right-3 sm:top-1/2 sm:h-14 sm:min-h-0 sm:w-14 sm:min-w-0 md:right-5"
            aria-label="Next skill card"
          >
            <ChevronRight className="h-7 w-7 max-sm:h-6 max-sm:w-6 sm:h-8 sm:w-8" strokeWidth={2.25} />
          </button>

          <div className="pointer-events-none absolute bottom-5 left-1/2 z-[75] -translate-x-1/2 max-sm:bottom-2 sm:bottom-8">
            <span
              className="rounded-full border-2 border-amber-400/80 bg-gradient-to-r from-rose-950 to-orange-950 px-4 py-2 font-mono text-xs font-black tabular-nums text-amber-200 shadow-[0_0_22px_rgba(244,63,94,0.4)] backdrop-blur-sm sm:text-sm"
              role="status"
              aria-live="polite"
            >
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
