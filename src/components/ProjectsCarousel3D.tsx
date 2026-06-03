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
  /** <640px only — shrinks the 3D ring so faces don't spill past the viewport while spinning */
  mobileVisualScale?: number;
};

const ROTATE_DURATION_SEC = 55;
const ROTATE_SPEED_DEG_PER_MS = 360 / (ROTATE_DURATION_SEC * 1000);
/** When the carousel is barely visible after using arrows, resume auto-spin (scroll-away / touch). */
const INTERSECTION_RESUME_RATIO = 0.12;

// Card sizing — every face uses the same computed cardW × cardH (fixed aspect).
const CARD_W_MIN = 280;
const CARD_W_MIN_NARROW = 200;
const CARD_W_MAX = 580;
/** Desktop / tablet: wider cards (fraction of viewport, capped). */
const CARD_W_VIEWPORT_FRACTION = 0.78;
const CARD_W_DESKTOP_TARGET = 520;
/** <640px: narrower than viewport so 3D swipe doesn't feel wider than the screen. */
const CARD_W_VIEWPORT_FRACTION_MOBILE = 0.66;
const MOBILE_CARD_W_MAX_VIEWPORT_RATIO = 0.7;
/** Space for arrow buttons + perspective bleed at the sides */
const MOBILE_CARD_W_ARROW_GUTTER_PX = 76;
/** Pull the ring slightly inward on phones (less side spill while rotating) */
const MOBILE_RING_RADIUS_SCALE = 0.88;
/** Height = width × ratio — identical for every project on a given viewport. */
const CARD_ASPECT_DESKTOP = 1.1;
/** Taller faces on phones so title, stack, and actions fit. */
const CARD_ASPECT_MOBILE = 1.28;
/** Softer 3D scale on mobile — less vertical magnification/clipping (P/(P−1)). */
const P_PER_R_MOBILE = 5;
const FRONT_SCALE_MOBILE = P_PER_R_MOBILE / (P_PER_R_MOBILE - 1);

// Ring geometry — radius scales with card count so adjacent faces don't overlap.
//   Chord between neighbors = 2·R·sin(π/n). Target chord ≈ headroom × cardW.
const CARD_RING_HEADROOM = 1.2;
const P_PER_R = 3.5;
const FRONT_SCALE = P_PER_R / (P_PER_R - 1); // ≈ 1.4
const CONTAINER_VERTICAL_PAD = 40;
const CONTAINER_VERTICAL_PAD_MOBILE = 28;
/** Extra height so card shadows, border radius, and 3D paint are not clipped by the fixed-height shell. */
const CONTAINER_3D_VERTICAL_BLEED = 72;
const CONTAINER_3D_VERTICAL_BLEED_MOBILE = 64;
const PERSPECTIVE_MIN = 900;

/** Reserved vertical space inside every card (stack + action row). */
const CARD_FOOTER_MIN_H_PX = 132;
const CARD_FOOTER_MIN_H_MOBILE_PX = 88;
const CARD_ACTION_ROW_MIN_H_PX = 40;
const CARD_ACTION_ROW_MIN_H_MOBILE_PX = 36;

function ringRadiusPerCardWidth(cardCount: number): number {
  return CARD_RING_HEADROOM / (2 * Math.sin(Math.PI / cardCount));
}

function computeDim(viewportWidth: number, viewportHeight: number, cardCount: number): Dim {
  const narrow = viewportWidth < 640;
  const aspect = narrow ? CARD_ASPECT_MOBILE : CARD_ASPECT_DESKTOP;
  const frontScale = narrow ? FRONT_SCALE_MOBILE : FRONT_SCALE;
  const verticalPad = narrow ? CONTAINER_VERTICAL_PAD_MOBILE : CONTAINER_VERTICAL_PAD;
  const bleed = narrow ? CONTAINER_3D_VERTICAL_BLEED_MOBILE : CONTAINER_3D_VERTICAL_BLEED;
  const pPerR = narrow ? P_PER_R_MOBILE : P_PER_R;

  let cardW: number;
  let cardH: number;

  let mobileVisualScale: number | undefined;

  if (narrow) {
    const floor = viewportWidth < 380 ? 200 : CARD_W_MIN_NARROW;
    const widthCap = Math.min(
      Math.floor(viewportWidth * MOBILE_CARD_W_MAX_VIEWPORT_RATIO),
      viewportWidth - MOBILE_CARD_W_ARROW_GUTTER_PX,
    );
    cardW = Math.round(
      Math.min(CARD_W_MAX, widthCap, Math.max(floor, viewportWidth * CARD_W_VIEWPORT_FRACTION_MOBILE)),
    );

    const maxContainerH = Math.max(320, viewportHeight * 0.94);
    const maxCardH = Math.floor((maxContainerH - verticalPad - bleed) / frontScale);
    cardH = Math.min(Math.round(cardW * aspect), maxCardH);
    cardH = Math.max(cardH, Math.round(floor * aspect));
    cardW = Math.max(floor, Math.min(cardW, Math.floor(cardH / aspect)));
    cardH = Math.round(cardW * aspect);

    const swipeSafeW = viewportWidth - MOBILE_CARD_W_ARROW_GUTTER_PX;
    mobileVisualScale = Math.min(1, swipeSafeW / (cardW * frontScale * 1.04));
  } else {
    const floor = CARD_W_MIN;
    const frac = CARD_W_VIEWPORT_FRACTION;
    cardW = Math.round(Math.min(CARD_W_MAX, Math.max(floor, viewportWidth * frac)));

    if (viewportWidth >= 1024) {
      cardW = Math.max(cardW, Math.min(CARD_W_MAX, CARD_W_DESKTOP_TARGET));
    }

    const maxContainerH = Math.max(280, viewportHeight * 0.92);
    const maxCardHFromViewport = Math.floor((maxContainerH - verticalPad - bleed) / frontScale);
    const maxCardWFromHeight = Math.max(200, Math.floor(maxCardHFromViewport / aspect));
    cardW = Math.min(cardW, maxCardWFromHeight);
    if (cardW < floor && maxCardWFromHeight >= floor) {
      cardW = floor;
    }
    cardH = Math.round(cardW * aspect);
  }

  let radius = Math.round(cardW * ringRadiusPerCardWidth(cardCount));
  if (narrow) {
    radius = Math.round(radius * MOBILE_RING_RADIUS_SCALE);
  }
  const perspective = Math.max(PERSPECTIVE_MIN, Math.round(radius * pPerR));
  const containerH = Math.round(cardH * frontScale + verticalPad + bleed);
  return { cardW, cardH, radius, perspective, containerH, mobileVisualScale };
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

const PROJECT_COUNT = PROJECTS.length;

export function ProjectsCarousel3D() {
  const { width: viewportWidth, height: viewportHeight } = useViewportSize();
  const dim = useMemo(
    () => computeDim(viewportWidth, viewportHeight, PROJECT_COUNT),
    [viewportWidth, viewportHeight],
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

  const total = PROJECT_COUNT;
  const spreadAngle = 360 / total;

  const mobileRingScale = dim.mobileVisualScale ?? 1;

  const applyRingTransform = useCallback(() => {
    const el = ringRef.current;
    if (!el) return;
    const scale =
      mobileRingScale < 1 ? ` scale(${mobileRingScale.toFixed(4)})` : '';
    el.style.transform = `translate(-50%, -50%) rotateY(${rotationRef.current}deg)${scale}`;
  }, [mobileRingScale]);

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
      className="relative mx-auto w-full max-sm:max-w-[100vw] max-sm:overflow-x-clip sm:overflow-visible"
      style={{ height: dim.containerH }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') {
          setManualPauseFromButtons(false);
        }
      }}
    >
      <div
        className="relative mx-auto h-full w-full max-sm:max-w-full max-sm:overflow-x-clip sm:overflow-visible"
        style={{ perspective: dim.perspective }}
      >
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
              compact={narrowViewport}
              stackIconSize={narrowViewport ? 8 : 11}
              onHoverStart={handleHoverStart}
              onHoverEnd={handleHoverEnd}
            />
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between gap-1 px-0.5 sm:gap-2 sm:px-3">
        <button
          type="button"
          onClick={() => stepRing(-1)}
          className="pointer-events-auto flex h-9 w-9 shrink-0 touch-manipulation items-center justify-center rounded-full border border-[#D7E2EA]/25 bg-[#0C0C0C]/85 text-[#D7E2EA] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.85)] backdrop-blur-md transition-colors hover:border-[#48E5C2]/50 hover:text-[#48E5C2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#48E5C2]/70 sm:h-12 sm:w-12"
          aria-label="Rotate carousel left"
        >
          <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => stepRing(1)}
          className="pointer-events-auto flex h-9 w-9 shrink-0 touch-manipulation items-center justify-center rounded-full border border-[#D7E2EA]/25 bg-[#0C0C0C]/85 text-[#D7E2EA] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.85)] backdrop-blur-md transition-colors hover:border-[#48E5C2]/50 hover:text-[#48E5C2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#48E5C2]/70 sm:h-12 sm:w-12"
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
  compact: boolean;
  stackIconSize: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
};

function CarouselCard({
  project,
  dim,
  angle,
  compact,
  stackIconSize,
  onHoverStart,
  onHoverEnd,
}: CardProps) {
  const footerMinH = compact ? CARD_FOOTER_MIN_H_MOBILE_PX : CARD_FOOTER_MIN_H_PX;
  const actionMinH = compact ? CARD_ACTION_ROW_MIN_H_MOBILE_PX : CARD_ACTION_ROW_MIN_H_PX;
  const stackItems = compact ? project.stack.slice(0, 5) : project.stack;
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
      <article className="box-border flex h-full w-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-[#D7E2EA]/15 bg-gradient-to-b from-[#16161A] via-[#0F1014] to-[#0B0B0D] p-3 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)_inset] sm:rounded-3xl sm:p-6">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex shrink-0 min-w-0 items-start justify-between gap-2 sm:gap-3">
            <span className="min-w-0 flex-1 text-[9px] font-medium uppercase leading-tight tracking-[0.14em] text-[#48E5C2] sm:text-[10px] sm:leading-snug sm:tracking-[0.22em]">
              {project.category}
            </span>
            <span className="shrink-0 font-black tabular-nums leading-none text-[#D7E2EA]/15 text-lg sm:text-4xl">
              {project.num}
            </span>
          </header>

          <h3
            className={`mt-2 min-w-0 shrink-0 font-medium uppercase text-[#D7E2EA] sm:mt-3 sm:text-[1.05rem] sm:leading-tight ${
              compact
                ? 'text-[0.8rem] leading-snug'
                : 'line-clamp-3 text-[1.05rem] leading-tight'
            }`}
          >
            {project.title}
          </h3>
          <p
            className={`mt-1.5 min-w-0 shrink-0 font-light leading-snug text-[#D7E2EA]/75 sm:mt-2 sm:text-sm ${
              compact ? 'line-clamp-3 text-[0.7rem]' : 'line-clamp-2'
            }`}
          >
            {project.summary}
          </p>

          <ul className="mt-2 hidden min-h-0 flex-1 space-y-1 overflow-hidden sm:mt-3 sm:block sm:space-y-1.5">
            {project.bullets.slice(0, 3).map((bullet) => (
              <li
                key={bullet}
                className="flex min-w-0 gap-1.5 text-[8px] leading-snug text-[#D7E2EA]/70 sm:gap-2 sm:text-xs"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#48E5C2]" aria-hidden />
                <span className="line-clamp-2 min-w-0 flex-1">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="mt-2 flex shrink-0 flex-wrap content-end gap-1 overflow-hidden sm:mt-3 sm:gap-2"
          style={{ minHeight: footerMinH }}
        >
          {stackItems.map((tech) => (
            <span
              key={tech}
              title={tech}
              className="inline-flex max-w-full min-w-0 items-center gap-0.5 rounded-full border border-[#D7E2EA]/15 py-0.5 pl-1 pr-1.5 text-[7px] font-medium uppercase leading-none tracking-wide text-[#D7E2EA]/85 sm:gap-1.5 sm:py-0.5 sm:pl-1.5 sm:pr-2.5 sm:text-[10px] sm:leading-normal"
            >
              <TechBrandIcon
                name={tech}
                lucideKey={projectStackLucideKey(tech)}
                size={stackIconSize}
                surface="dark"
                className="shrink-0 !p-0 sm:!p-px"
              />
              <span className="min-w-0 truncate">{tech}</span>
            </span>
          ))}
        </div>

        <div
          className="mt-2 flex shrink-0 flex-wrap items-center gap-2 pb-0.5 sm:mt-3 sm:pb-0"
          style={{ minHeight: actionMinH }}
        >
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
      className={`inline-flex max-w-full min-w-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest transition-colors hover:bg-[#D7E2EA]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D7E2EA]/60 sm:gap-1.5 sm:px-4 sm:py-1.5 sm:text-[11px] ${
        muted ? 'border-[#D7E2EA]/35 text-[#D7E2EA]/85' : 'border-[#D7E2EA] text-[#D7E2EA]'
      }`}
    >
      <Icon className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" strokeWidth={2} aria-hidden />
      {label}
    </a>
  );
}
