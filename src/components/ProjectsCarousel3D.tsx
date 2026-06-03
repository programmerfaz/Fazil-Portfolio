import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, Github, type LucideIcon } from 'lucide-react';
import { projectStackLucideKey } from '../data/projectStackTech';
import { PROJECTS, type Project } from '../data/projects';
import { TechBrandIcon } from './TechBrandIcon';

/**
 * 3D ring carousel (Framer "Carousel 3D" pattern, ported to React).
 *
 * Each item sits on a circle around the Y-axis via `rotateY(angle) translateZ(R)`,
 * and the parent ring auto-rotates via `requestAnimationFrame` at the same pace as
 * the old CSS keyframes. Pauses when the pointer hovers a card, after arrow taps
 * (manual step mode), or when the carousel scrolls mostly off-screen. Manual mode
 * clears when the mouse leaves the carousel, when the user taps outside it
 * (touch / pen), or on scroll-away via intersection.
 *
 * Sizing is fully fluid: card width scales with the viewport (clamped to a
 * readable min/max) and radius/perspective/container height are all derived
 * from it via fixed geometric ratios, so the layout stays balanced from a
 * 320px phone through to a 4K monitor. Below 640px the projects section uses a
 * full-bleed wrapper so the ring can use the screen width; mobile card width is
 * capped well below 100% so perspective + translateZ leaves a comfortable buffer
 * inside `overflow-x-clip` on the section.
 */

type Dim = {
  cardW: number;
  cardH: number;
  radius: number;
  perspective: number;
  containerH: number;
};

const ROTATE_DURATION_SEC = 55;
const ROTATE_SPEED_DEG_PER_MS = 360 / (ROTATE_DURATION_SEC * 1000);
/** When the carousel is barely visible after using arrows, resume auto-spin (scroll-away / touch). */
const INTERSECTION_RESUME_RATIO = 0.12;

// Card sizing — <640px: keep cards noticeably smaller than the viewport so angled
// side faces stay inside the screen and the ring reads cleanly on real phones.
const CARD_W_MIN = 280;
const CARD_W_MIN_NARROW = 220;
const CARD_W_MAX = 560;
const CARD_W_VIEWPORT_FRACTION = 0.74;
/** <640px: conservative share so 3D side cards are not clipped or “broken”. */
const CARD_W_VIEWPORT_FRACTION_MOBILE = 0.66;
/** Hard ceiling vs viewport width on mobile after other clamps (leave margin for depth). */
const MOBILE_CARD_W_MAX_VIEWPORT_RATIO = 0.78;

// Geometry: ring radius scales with project count so adjacent cards don’t overlap.
//   chord between neighbours = 2·R·sin(π/n); need chord > cardW (with headroom).
//   Front-card perspective scale = P / (P − R). P = 3.5·R → scale ≈ 1.40.
const P_PER_R = 3.5;
const FRONT_SCALE = P_PER_R / (P_PER_R - 1); // ≈ 1.4
const RING_HEADROOM = 1.18;
const CONTAINER_VERTICAL_PAD = 40;
const CONTAINER_VERTICAL_PAD_MOBILE = 28;
/** Extra height so card shadows, border radius, and 3D paint are not clipped by the fixed-height shell. */
const CONTAINER_3D_VERTICAL_BLEED = 72;
const CONTAINER_3D_VERTICAL_BLEED_MOBILE = 88;
const PERSPECTIVE_MIN = 900;

/** Card height = width × factor — taller cards keep stack + action buttons visible. */
const CARD_HEIGHT_PER_WIDTH_DESKTOP = 1.42;
const CARD_HEIGHT_PER_WIDTH_MOBILE = 1.48;

/** Max stack chips on the card face; rest appear in a “+N” pill. */
const MAX_STACK_VISIBLE = 7;

function ringRadiusPerCardWidth(count: number): number {
  const chord = 2 * Math.sin(Math.PI / Math.max(count, 3));
  return RING_HEADROOM / chord;
}

function computeDim(viewportWidth: number, viewportHeight: number, projectCount: number): Dim {
  const narrow = viewportWidth < 640;
  const frac = narrow ? CARD_W_VIEWPORT_FRACTION_MOBILE : CARD_W_VIEWPORT_FRACTION;
  const floor = narrow && viewportWidth < 420 ? CARD_W_MIN_NARROW : CARD_W_MIN;
  let cardW = Math.round(Math.min(CARD_W_MAX, Math.max(floor, viewportWidth * frac)));

  /** Landscape / short viewports: shrink the ring so the front card fits vertically. */
  const verticalPad = viewportWidth < 640 ? CONTAINER_VERTICAL_PAD_MOBILE : CONTAINER_VERTICAL_PAD;
  const heightPerWidth = narrow ? CARD_HEIGHT_PER_WIDTH_MOBILE : CARD_HEIGHT_PER_WIDTH_DESKTOP;
  const maxViewportShare = viewportWidth < 640 ? 0.8 : 0.9;
  const maxContainerH = Math.max(200, viewportHeight * maxViewportShare);
  const maxCardHFromViewport = (maxContainerH - verticalPad) / FRONT_SCALE;
  const maxCardWFromHeight = Math.max(140, Math.floor(maxCardHFromViewport / heightPerWidth));
  cardW = Math.min(cardW, maxCardWFromHeight);
  /** Prefer the width floor only when it still fits vertically. */
  if (cardW < floor && maxCardWFromHeight >= floor) {
    cardW = floor;
  }

  if (narrow) {
    const motionCap = Math.floor(viewportWidth * MOBILE_CARD_W_MAX_VIEWPORT_RATIO);
    cardW = Math.min(cardW, motionCap);
  }

  const cardH = Math.round(cardW * heightPerWidth);
  const radius = Math.round(cardW * ringRadiusPerCardWidth(projectCount));
  const perspective = Math.max(PERSPECTIVE_MIN, Math.round(radius * P_PER_R));
  const bleed = narrow ? CONTAINER_3D_VERTICAL_BLEED_MOBILE : CONTAINER_3D_VERTICAL_BLEED;
  const containerH = Math.round(cardH * FRONT_SCALE + verticalPad + bleed);
  return { cardW, cardH, radius, perspective, containerH };
}

function readViewportWidth(): number {
  if (typeof window === 'undefined') return 1280;
  const vv = window.visualViewport;
  return Math.round(vv?.width ?? window.innerWidth);
}

function readViewportHeight(): number {
  if (typeof window === 'undefined') return 900;
  const vv = window.visualViewport;
  return Math.round(vv?.height ?? window.innerHeight);
}

/** Which project index is closest to facing the camera for ring rotation `phi` (deg). */
function snapFrontIndexFromPhi(phi: number, n: number, spread: number): number {
  const q = -phi / spread;
  let k = Math.round(q);
  return ((k % n) + n) % n;
}

/** Rotation (deg) that places `targetK` at the front, choosing the 360° wrap closest to `phi` for continuity. */
function nearestRotationForFrontIndex(phi: number, targetK: number, spread: number): number {
  const base = -targetK * spread;
  const m = Math.round((phi - base) / 360);
  return base + m * 360;
}

function useViewportSize(): { width: number; height: number } {
  const [{ width, height }, setSize] = useState(() => ({
    width: readViewportWidth(),
    height: readViewportHeight(),
  }));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let rafId = 0;
    const handler = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setSize({ width: readViewportWidth(), height: readViewportHeight() });
      });
    };
    window.addEventListener('resize', handler);
    window.visualViewport?.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
      window.visualViewport?.removeEventListener('resize', handler);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return { width, height };
}

export function ProjectsCarousel3D() {
  const total = PROJECTS.length;
  const { width: viewportWidth, height: viewportHeight } = useViewportSize();
  const dim = useMemo(
    () => computeDim(viewportWidth, viewportHeight, total),
    [viewportWidth, viewportHeight, total],
  );
  const reduceMotion = useReducedMotion();
  const [hoverCount, setHoverCount] = useState(0);
  const [manualPauseFromButtons, setManualPauseFromButtons] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const pausedRef = useRef(false);

  // Counter-based hover tracking handles fast pointer transitions between cards
  // (enter-on-next fires before leave-on-previous in some browsers) so the ring
  // doesn't briefly resume during the handoff.
  const handleHoverStart = useCallback(() => setHoverCount((n) => n + 1), []);
  const handleHoverEnd = useCallback(
    () => setHoverCount((n) => (n > 0 ? n - 1 : 0)),
    [],
  );

  const paused = hoverCount > 0 || manualPauseFromButtons;
  pausedRef.current = paused;
  const spreadAngle = 360 / total;

  const applyRingTransform = useCallback(() => {
    const el = ringRef.current;
    if (!el) return;
    el.style.transform = `translate(-50%, -50%) rotateY(${rotationRef.current}deg)`;
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      applyRingTransform();
      return;
    }

    let raf = 0;
    let prev = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(now - prev, 64);
      prev = now;
      if (!pausedRef.current) {
        rotationRef.current += ROTATE_SPEED_DEG_PER_MS * dt;
      }
      applyRingTransform();
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion, applyRingTransform]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        const ratio = entries[0]?.intersectionRatio ?? 1;
        if (ratio < INTERSECTION_RESUME_RATIO) {
          setManualPauseFromButtons(false);
        }
      },
      { threshold: [0, INTERSECTION_RESUME_RATIO, 0.25, 0.5] },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  /** Touch / pen: resume auto-spin when the user taps outside the carousel (no reliable pointerleave). */
  useEffect(() => {
    if (!manualPauseFromButtons) return;
    const root = containerRef.current;
    const onDocPointerDown = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof Node) || !root) return;
      if (!root.contains(t)) {
        setManualPauseFromButtons(false);
      }
    };
    document.addEventListener('pointerdown', onDocPointerDown, true);
    return () => document.removeEventListener('pointerdown', onDocPointerDown, true);
  }, [manualPauseFromButtons]);

  const stepRing = useCallback(
    (direction: 1 | -1) => {
      setManualPauseFromButtons(true);
      const phi = rotationRef.current;
      const k = snapFrontIndexFromPhi(phi, total, spreadAngle);
      const nextK = (k + direction + total) % total;
      rotationRef.current = nearestRotationForFrontIndex(phi, nextK, spreadAngle);
      applyRingTransform();
    },
    [applyRingTransform, spreadAngle, total],
  );

  const narrowViewport = viewportWidth < 640;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full overflow-visible"
      style={{ height: dim.containerH }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') {
          setManualPauseFromButtons(false);
        }
      }}
    >
      <div className="relative h-full w-full overflow-visible" style={{ perspective: dim.perspective }}>
        <div
          ref={ringRef}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: dim.cardW,
            height: dim.cardH,
            transform: 'translate(-50%, -50%) rotateY(0deg)',
            transformStyle: 'preserve-3d',
            willChange: reduceMotion ? undefined : 'transform',
          }}
        >
          {PROJECTS.map((project, i) => (
            <CarouselCard
              key={project.num}
              project={project}
              dim={dim}
              angle={i * spreadAngle}
              stackIconSize={narrowViewport ? 9 : 13}
              onHoverStart={handleHoverStart}
              onHoverEnd={handleHoverEnd}
            />
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between gap-2 px-1 sm:px-3">
        <button
          type="button"
          onClick={() => stepRing(-1)}
          className="pointer-events-auto flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full border border-portfolio bg-portfolio-deep/80 text-portfolio-ink shadow-glass-soft backdrop-blur-md transition-colors hover:border-portfolio-cyan/50 hover:text-portfolio-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-portfolio-cyan/70 sm:h-12 sm:w-12"
          aria-label="Rotate carousel left"
        >
          <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => stepRing(1)}
          className="pointer-events-auto flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full border border-portfolio bg-portfolio-deep/80 text-portfolio-ink shadow-glass-soft backdrop-blur-md transition-colors hover:border-portfolio-cyan/50 hover:text-portfolio-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-portfolio-cyan/70 sm:h-12 sm:w-12"
          aria-label="Rotate carousel right"
        >
          <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} aria-hidden />
        </button>
      </div>
    </div>
  );
}

type CardProps = {
  project: Project;
  dim: Dim;
  angle: number;
  stackIconSize: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
};

function CarouselCard({ project, dim, angle, stackIconSize, onHoverStart, onHoverEnd }: CardProps) {
  const visibleStack = project.stack.slice(0, MAX_STACK_VISIBLE);
  const hiddenStackCount = project.stack.length - visibleStack.length;
  const hiddenStackTitle =
    hiddenStackCount > 0 ? project.stack.slice(MAX_STACK_VISIBLE).join(', ') : undefined;

  return (
    <div
      className="absolute left-0 top-0"
      style={{
        width: dim.cardW,
        height: dim.cardH,
        transform: `rotateY(${angle}deg) translateZ(${dim.radius}px)`,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
      // Pointer events cover mouse hover on desktop and tap on touch devices.
      onPointerEnter={onHoverStart}
      onPointerLeave={onHoverEnd}
      onPointerCancel={onHoverEnd}
    >
      <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-portfolio bg-gradient-to-b from-portfolio-card/95 via-portfolio-surface/90 to-portfolio-deep p-2.5 shadow-glass-soft sm:rounded-3xl sm:p-5 md:p-6">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin]">
          <header className="flex min-w-0 items-start justify-between gap-1.5 sm:gap-3">
            <span className="min-w-0 flex-1 break-words text-[9px] font-medium uppercase leading-tight tracking-[0.14em] text-portfolio-cyan sm:text-[10px] sm:leading-snug sm:tracking-[0.22em]">
              {project.category}
            </span>
            <span className="shrink-0 font-black tabular-nums leading-none text-portfolio-ink/[0.12] text-[clamp(0.78rem,3.2vw,1.05rem)] sm:text-[clamp(1.35rem,5.5vw,3rem)]">
              {project.num}
            </span>
          </header>

          <h3 className="mt-1.5 min-w-0 break-words text-pretty text-[clamp(0.72rem,3.2vw,1rem)] font-medium uppercase leading-tight text-portfolio-ink [word-break:break-word] sm:mt-2.5 sm:text-[clamp(0.95rem,2.2vw,1.35rem)] sm:leading-tight">
            {project.title}
          </h3>
          <p className="mt-1 min-w-0 break-words text-pretty text-[clamp(0.62rem,2.6vw,0.78rem)] font-light leading-tight text-portfolio-muted [word-break:break-word] sm:mt-1.5 sm:text-[clamp(0.8rem,1.6vw,0.95rem)] sm:leading-snug">
            {project.summary}
          </p>

          <ul className="mt-1.5 min-w-0 space-y-1 pb-1 sm:mt-2.5 sm:space-y-1.5 sm:pb-2">
            {project.bullets.slice(0, 3).map((bullet) => (
              <li
                key={bullet}
                className="flex min-w-0 gap-1.5 text-[8px] leading-[1.25] text-portfolio-muted sm:gap-2 sm:text-sm sm:leading-snug"
              >
                <span className="mt-1 h-0.5 w-0.5 shrink-0 rounded-full bg-portfolio-cyan sm:mt-1.5 sm:h-1 sm:w-1" aria-hidden />
                <span className="min-w-0 flex-1 break-words [word-break:break-word]">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <footer className="mt-1.5 shrink-0 border-t border-portfolio/40 bg-portfolio-deep/35 pt-2 sm:mt-2 sm:pt-2.5">
          <div className="flex min-w-0 flex-wrap gap-1 sm:gap-1.5">
            {visibleStack.map((tech) => (
              <span
                key={tech}
                title={tech}
                className="inline-flex max-w-full min-w-0 items-center gap-0.5 rounded-full border border-portfolio bg-portfolio-surface/40 py-px pl-0.5 pr-1 text-[7px] font-medium uppercase leading-none tracking-wide text-portfolio-ink/90 sm:gap-1.5 sm:py-1 sm:pl-2 sm:pr-2.5 sm:text-[11px] sm:leading-normal"
              >
                <TechBrandIcon
                  name={tech}
                  lucideKey={projectStackLucideKey(tech)}
                  size={stackIconSize}
                  surface="dark"
                  className="shrink-0 !p-0 sm:!p-px"
                />
                <span className="min-w-0 max-w-[7.5rem] truncate sm:max-w-none">{tech}</span>
              </span>
            ))}
            {hiddenStackCount > 0 ? (
              <span
                title={hiddenStackTitle}
                className="inline-flex items-center rounded-full border border-portfolio-cyan/35 bg-portfolio-surface/50 px-1.5 py-px text-[7px] font-medium uppercase tracking-wide text-portfolio-cyan sm:px-2 sm:py-0.5 sm:text-[10px]"
              >
                +{hiddenStackCount}
              </span>
            ) : null}
          </div>

          {(project.liveUrl || project.repositoryUrl) ? (
            <div className="mt-2 flex min-w-0 flex-wrap gap-1.5 sm:mt-2.5 sm:gap-2">
              {project.liveUrl ? (
                <CarouselLink href={project.liveUrl} label="Live" Icon={ExternalLink} />
              ) : null}
              {project.repositoryUrl ? (
                <CarouselLink
                  href={project.repositoryUrl}
                  label="GitHub"
                  Icon={Github}
                  muted={Boolean(project.liveUrl)}
                />
              ) : null}
            </div>
          ) : null}
        </footer>
      </article>
    </div>
  );
}

type CarouselLinkProps = {
  href: string;
  label: string;
  Icon: LucideIcon;
  muted?: boolean;
};

function CarouselLink({ href, label, Icon, muted = false }: CarouselLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex max-w-full min-w-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest transition-colors hover:bg-portfolio-surface/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-portfolio-cyan/60 sm:gap-1.5 sm:px-4 sm:py-1.5 sm:text-[11px] ${
        muted ? 'border-portfolio text-portfolio-muted' : 'border-portfolio-cyan/50 text-portfolio-ink'
      }`}
    >
      <Icon className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" strokeWidth={2} aria-hidden />
      {label}
    </a>
  );
}
