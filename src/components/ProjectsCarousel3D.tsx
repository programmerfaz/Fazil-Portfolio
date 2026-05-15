import { useCallback, useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ExternalLink, Github, type LucideIcon } from 'lucide-react';
import { PROJECTS, type Project } from '../data/projects';

/**
 * 3D ring carousel (Framer "Carousel 3D" pattern, ported to React).
 *
 * Each item sits on a circle around the Y-axis via `rotateY(angle) translateZ(R)`,
 * and the parent ring auto-rotates via a CSS keyframe that preserves the
 * `translate(-50%, -50%)` centering. The ring keeps spinning continuously —
 * the only thing that pauses it is the pointer entering a card. Leaving the
 * card (or moving into empty space between cards) resumes rotation.
 *
 * Sizing is fully fluid: card width scales with the viewport (clamped to a
 * readable min/max) and radius/perspective/container height are all derived
 * from it via fixed geometric ratios, so the layout stays balanced from a
 * 320px phone through to a 4K monitor. Below 640px the card uses a wider share
 * of the viewport and flex `min-w-0` + wrapping so copy does not clip.
 */

type Dim = {
  cardW: number;
  cardH: number;
  radius: number;
  perspective: number;
  containerH: number;
};

const ROTATE_DURATION_SEC = 55;

// Card sizing — narrow phones need a higher viewport share + lower floor so text fits inside the face.
const CARD_W_MIN = 240;
const CARD_W_MIN_NARROW = 208;
const CARD_W_MAX = 440;
const CARD_W_VIEWPORT_FRACTION = 0.62;
/** ≥640px: ring margin; <640px: wider card to reduce clipping (still clears chord geometry). */
const CARD_W_VIEWPORT_FRACTION_MOBILE = 0.76;

// Geometry ratios (7 cards on the ring)
//   Adjacent chord = 2·R·sin(π/7) ≈ 0.868·R; want chord > cardW so cards don't
//   touch. R = 1.3·cardW gives ~13% headroom.
//   Front-card perspective scale = P / (P − R). P = 3.5·R → scale ≈ 1.40,
//   which determines how much vertical room the front card needs.
const R_PER_CARD_W = 1.3;
const P_PER_R = 3.5;
const FRONT_SCALE = P_PER_R / (P_PER_R - 1); // ≈ 1.4
const CONTAINER_VERTICAL_PAD = 32;
const CONTAINER_VERTICAL_PAD_MOBILE = 22;
const PERSPECTIVE_MIN = 900;

function computeDim(viewportWidth: number): Dim {
  const narrow = viewportWidth < 640;
  const frac = narrow ? CARD_W_VIEWPORT_FRACTION_MOBILE : CARD_W_VIEWPORT_FRACTION;
  const floor = narrow && viewportWidth < 420 ? CARD_W_MIN_NARROW : CARD_W_MIN;
  const cardW = Math.round(Math.min(CARD_W_MAX, Math.max(floor, viewportWidth * frac)));
  const cardH = Math.round(cardW * (440 / 380)); // aspect ratio from original desktop tier
  const radius = Math.round(cardW * R_PER_CARD_W);
  const perspective = Math.max(PERSPECTIVE_MIN, Math.round(radius * P_PER_R));
  const verticalPad = viewportWidth < 640 ? CONTAINER_VERTICAL_PAD_MOBILE : CONTAINER_VERTICAL_PAD;
  const containerH = Math.round(cardH * FRONT_SCALE + verticalPad);
  return { cardW, cardH, radius, perspective, containerH };
}

function readViewportWidth(): number {
  if (typeof window === 'undefined') return 1280;
  const vv = window.visualViewport;
  return Math.round(vv?.width ?? window.innerWidth);
}

function useViewportWidth(): number {
  const [width, setWidth] = useState(() => readViewportWidth());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let rafId = 0;
    const handler = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setWidth(readViewportWidth()));
    };
    window.addEventListener('resize', handler);
    window.visualViewport?.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
      window.visualViewport?.removeEventListener('resize', handler);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return width;
}

export function ProjectsCarousel3D() {
  const viewportWidth = useViewportWidth();
  const dim = useMemo(() => computeDim(viewportWidth), [viewportWidth]);
  const reduceMotion = useReducedMotion();
  const [hoverCount, setHoverCount] = useState(0);

  // Counter-based hover tracking handles fast pointer transitions between cards
  // (enter-on-next fires before leave-on-previous in some browsers) so the ring
  // doesn't briefly resume during the handoff.
  const handleHoverStart = useCallback(() => setHoverCount((n) => n + 1), []);
  const handleHoverEnd = useCallback(
    () => setHoverCount((n) => (n > 0 ? n - 1 : 0)),
    [],
  );

  const paused = hoverCount > 0;
  const total = PROJECTS.length;
  const spreadAngle = 360 / total;

  return (
    <div className="relative mx-auto w-full" style={{ height: dim.containerH }}>
      <style>{`
        @keyframes projects-carousel-spin {
          from { transform: translate(-50%, -50%) rotateY(0deg); }
          to   { transform: translate(-50%, -50%) rotateY(360deg); }
        }
        .projects-carousel-ring--auto {
          animation: projects-carousel-spin ${ROTATE_DURATION_SEC}s linear infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .projects-carousel-ring--auto { animation: none; }
        }
      `}</style>

      <div className="relative h-full w-full" style={{ perspective: dim.perspective }}>
        <div
          className={reduceMotion ? '' : 'projects-carousel-ring--auto'}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: dim.cardW,
            height: dim.cardH,
            transform: 'translate(-50%, -50%)',
            transformStyle: 'preserve-3d',
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {PROJECTS.map((project, i) => (
            <CarouselCard
              key={project.num}
              project={project}
              dim={dim}
              angle={i * spreadAngle}
              onHoverStart={handleHoverStart}
              onHoverEnd={handleHoverEnd}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

type CardProps = {
  project: Project;
  dim: Dim;
  angle: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
};

function CarouselCard({ project, dim, angle, onHoverStart, onHoverEnd }: CardProps) {
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
      <article className="flex h-full min-h-0 min-w-0 flex-col overflow-x-hidden rounded-2xl border border-[#D7E2EA]/15 bg-gradient-to-b from-[#16161A] via-[#0F1014] to-[#0B0B0D] p-3.5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)_inset] sm:rounded-3xl sm:p-6">
        <header className="flex min-w-0 items-start justify-between gap-2 sm:gap-3">
          <span className="min-w-0 flex-1 break-words text-[10px] font-medium uppercase leading-snug tracking-[0.18em] text-[#48E5C2] sm:tracking-[0.22em]">
            {project.category}
          </span>
          <span
            className="shrink-0 font-black tabular-nums leading-none text-[#D7E2EA]/15"
            style={{ fontSize: 'clamp(1.35rem, 5.5vw, 3rem)' }}
          >
            {project.num}
          </span>
        </header>

        <h3
          className="mt-2 min-w-0 break-words text-pretty font-medium uppercase leading-snug text-[#D7E2EA] sm:mt-3 sm:leading-tight"
          style={{ fontSize: 'clamp(0.88rem, 3.8vw, 1.25rem)', wordBreak: 'break-word' }}
        >
          {project.title}
        </h3>
        <p
          className="mt-1.5 min-w-0 break-words text-pretty font-light leading-snug text-[#D7E2EA]/75 sm:mt-2"
          style={{ fontSize: 'clamp(0.75rem, 2.8vw, 0.875rem)', wordBreak: 'break-word' }}
        >
          {project.summary}
        </p>

        <ul className="mt-2.5 min-w-0 space-y-1.5 sm:mt-3">
          {project.bullets.slice(0, 3).map((bullet) => (
            <li
              key={bullet}
              className="flex min-w-0 gap-2 text-[10px] leading-snug text-[#D7E2EA]/70 sm:text-xs sm:leading-snug"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#48E5C2] sm:mt-1.5" aria-hidden />
              <span className="min-w-0 flex-1 break-words" style={{ wordBreak: 'break-word' }}>
                {bullet}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex min-w-0 flex-wrap gap-1.5 pt-2.5 sm:pt-3">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="max-w-full truncate rounded-full border border-[#D7E2EA]/15 px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wide text-[#D7E2EA]/75 sm:px-2 sm:text-[10px]"
            >
              {tech}
            </span>
          ))}
        </div>

        {(project.liveUrl || project.repositoryUrl) ? (
          <div className="mt-2 flex min-w-0 flex-wrap gap-2 sm:mt-3">
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
      className={`inline-flex max-w-full min-w-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest transition-colors hover:bg-[#D7E2EA]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D7E2EA]/60 sm:px-4 sm:py-1.5 sm:text-[11px] ${
        muted ? 'border-[#D7E2EA]/35 text-[#D7E2EA]/85' : 'border-[#D7E2EA] text-[#D7E2EA]'
      }`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      {label}
    </a>
  );
}
