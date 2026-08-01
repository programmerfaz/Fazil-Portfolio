import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Transition,
} from 'framer-motion';

export type CarouselItemType = 'image' | 'video' | 'card';

export type CarouselItem = {
  id?: string | number;
  type: CarouselItemType;
  src?: string;
  srcUrl?: string;
  alt?: string;
  poster?: string;
  /** Text face when type is "card" (or fallback when image src is missing). */
  label?: string;
  sublabel?: string;
};

export type Direction = 'left' | 'right' | 'top' | 'bottom';

export type BoxCarouselProps = {
  items: CarouselItem[];
  direction?: Direction;
  imageWidth?: number;
  imageHeight?: number;
  animation?: 'autoplay' | 'drag';
  ease?: Transition;
  dragSensitivity?: number;
  onIndexChange?: (index: number) => void;
  transition?: Transition;
  snapTransition?: Transition;
  className?: string;
  style?: CSSProperties;
};

const DEFAULT_EASE: [number, number, number, number] = [0.953, 0.001, 0.019, 0.995];

function resolveSrc(input: string | undefined): string {
  return input?.trim() ?? '';
}

function padItems(items: CarouselItem[] | undefined): CarouselItem[] {
  if (!items || items.length === 0) return [];
  if (items.length >= 4) return items;
  const padded: CarouselItem[] = [];
  for (let i = 0; i < 4; i++) padded.push(items[i % items.length]!);
  return padded;
}

function modIdx(i: number, n: number): number {
  if (n <= 0) return 0;
  return ((i % n) + n) % n;
}

const COMPONENT_DEFAULTS = {
  imageWidth: 500,
  imageHeight: 300,
  direction: 'right' as Direction,
  animation: 'autoplay' as const,
  ease: {
    type: 'tween' as const,
    duration: 1,
    delay: 1.6,
    ease: [0.44, 0, 0.56, 1] as [number, number, number, number],
  },
  dragSensitivity: 5,
};

/**
 * 3D cube/box carousel — adapted from fancycomponents / Originkit BoxCarousel.
 * Four faces; rotate to reveal next/previous. Drag, keyboard, and autoplay.
 */
export function BoxCarousel(props: BoxCarouselProps) {
  const {
    items: rawItems,
    direction = COMPONENT_DEFAULTS.direction,
    ease = COMPONENT_DEFAULTS.ease,
    animation = COMPONENT_DEFAULTS.animation,
    dragSensitivity = COMPONENT_DEFAULTS.dragSensitivity,
    imageWidth = COMPONENT_DEFAULTS.imageWidth,
    imageHeight = COMPONENT_DEFAULTS.imageHeight,
    onIndexChange,
    transition: transitionOverride,
    snapTransition: snapTransitionOverride,
    className,
    style,
  } = props;

  const prefersReducedMotion = useReducedMotion();
  const autoPlay = animation === 'autoplay';
  /** Drag only when not autoplaying — matches Originkit behavior. */
  const enableDrag = animation === 'drag';

  const items = useMemo(() => padItems(rawItems), [rawItems]);
  const itemCount = Math.max(1, rawItems?.length ?? 0);

  const transition: Transition = useMemo(
    () =>
      transitionOverride ??
      (prefersReducedMotion
        ? { duration: 0 }
        : (ease ?? {
            duration: 1.25,
            ease: DEFAULT_EASE,
          })),
    [transitionOverride, ease, prefersReducedMotion],
  );

  const snapTransition: Transition = useMemo(
    () =>
      snapTransitionOverride ?? {
        type: 'spring',
        damping: prefersReducedMotion ? 100 : 30,
        stiffness: prefersReducedMotion ? 1000 : 200,
      },
    [snapTransitionOverride, prefersReducedMotion],
  );

  const cubeW = Math.max(1, imageWidth);
  const cubeH = Math.max(1, imageHeight);
  const isHorizontal = direction === 'left' || direction === 'right';
  const isForward = direction === 'left' || direction === 'top';
  const depth = isHorizontal ? cubeW : cubeH;
  const halfDepth = depth / 2;

  const [currentIndex, setCurrentIndexState] = useState(0);
  const currentIndexRef = useRef(0);
  const setCurrentIndex = useCallback((i: number) => {
    currentIndexRef.current = i;
    setCurrentIndexState(i);
  }, []);
  const rotation = useMotionValue(0);
  const frontSlotRef = useRef(0);

  const [faceItems, setFaceItems] = useState<number[]>(() => {
    const n = Math.max(1, itemCount);
    return [0, 1 % n, modIdx(2, n), modIdx(-1, n)];
  });

  const isAnimatingRef = useRef(false);

  const stepDegrees = useMemo(() => {
    if (isHorizontal) return isForward ? -90 : 90;
    return isForward ? 90 : -90;
  }, [isHorizontal, isForward]);

  const advanceFrontSlot = useCallback((deltaDeg: number) => {
    const norm = ((deltaDeg % 360) + 360) % 360;
    if (norm === 90) frontSlotRef.current = (frontSlotRef.current + 3) % 4;
    else if (norm === 270) frontSlotRef.current = (frontSlotRef.current + 1) % 4;
    else if (norm === 180) frontSlotRef.current = (frontSlotRef.current + 2) % 4;
  }, []);

  const incomingFrontSlot = useCallback((deltaDeg: number, fromSlot: number) => {
    const norm = ((deltaDeg % 360) + 360) % 360;
    if (norm === 90) return (fromSlot + 3) % 4;
    if (norm === 270) return (fromSlot + 1) % 4;
    if (norm === 180) return (fromSlot + 2) % 4;
    return fromSlot;
  }, []);

  const buildFaces = useCallback(
    (curIdx: number): number[] => {
      const n = Math.max(1, itemCount);
      const fs = frontSlotRef.current;
      const fwd = incomingFrontSlot(stepDegrees, fs);
      const bwd = incomingFrontSlot(-stepDegrees, fs);
      const back = (fs + 2) % 4;
      const faces = [0, 0, 0, 0];
      faces[fs] = modIdx(curIdx, n);
      faces[fwd] = modIdx(curIdx + 1, n);
      faces[bwd] = modIdx(curIdx - 1, n);
      faces[back] = modIdx(curIdx + 2, n);
      return faces;
    },
    [itemCount, stepDegrees, incomingFrontSlot],
  );

  useEffect(() => {
    setFaceItems(buildFaces(currentIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rebuild when cube geometry changes
  }, [buildFaces]);

  const navigate = useCallback(
    (dir: 'next' | 'prev') => {
      if (isAnimatingRef.current) return;
      if (itemCount === 0) return;

      const delta = dir === 'next' ? stepDegrees : -stepDegrees;
      const from = rotation.get();
      const to = from + delta;
      const cur = currentIndexRef.current;
      const newIndex = modIdx(dir === 'next' ? cur + 1 : cur - 1, itemCount);

      isAnimatingRef.current = true;
      animate(rotation, to, {
        ...transition,
        onComplete: () => {
          isAnimatingRef.current = false;
          advanceFrontSlot(delta);
          setCurrentIndex(newIndex);
          setFaceItems(buildFaces(newIndex));
          onIndexChange?.(newIndex);
        },
      });
    },
    [
      itemCount,
      stepDegrees,
      rotation,
      transition,
      advanceFrontSlot,
      buildFaces,
      setCurrentIndex,
      onIndexChange,
    ],
  );

  // Autoplay: poll while idle; each move uses ease.delay + ease.duration as pacing.
  useEffect(() => {
    if (!autoPlay || prefersReducedMotion) return;
    if (itemCount <= 1) return;
    const id = window.setInterval(() => {
      if (!isAnimatingRef.current) navigate('next');
    }, 120);
    return () => window.clearInterval(id);
  }, [autoPlay, prefersReducedMotion, navigate, itemCount]);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isHoveredRef.current) return;
      if (isHorizontal) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          navigate(isForward ? 'next' : 'prev');
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          navigate(isForward ? 'prev' : 'next');
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigate(isForward ? 'next' : 'prev');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigate(isForward ? 'prev' : 'next');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isHorizontal, isForward, navigate]);

  const dragStateRef = useRef<{
    active: boolean;
    pointerId: number;
    startX: number;
    startY: number;
    startRotation: number;
    committedSteps: number;
  } | null>(null);

  const applyStep = useCallback(
    (dir: 'next' | 'prev') => {
      const deltaSlot = dir === 'next' ? stepDegrees : -stepDegrees;
      advanceFrontSlot(deltaSlot);
      const cur = currentIndexRef.current;
      const ni = modIdx(dir === 'next' ? cur + 1 : cur - 1, Math.max(1, itemCount));
      setCurrentIndex(ni);
      setFaceItems(buildFaces(ni));
      onIndexChange?.(ni);
    },
    [stepDegrees, itemCount, advanceFrontSlot, setCurrentIndex, buildFaces, onIndexChange],
  );

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!enableDrag) return;
      if (isAnimatingRef.current) return;
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      dragStateRef.current = {
        active: true,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        startRotation: rotation.get(),
        committedSteps: 0,
      };
      setFaceItems(buildFaces(currentIndexRef.current));
    },
    [enableDrag, rotation, buildFaces],
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const s = dragStateRef.current;
      if (!s || !s.active || s.pointerId !== e.pointerId) return;
      const dx = e.clientX - s.startX;
      const dy = e.clientY - s.startY;
      const axisDelta = isHorizontal ? dx : dy;
      const correctedSign = isHorizontal ? 1 : -1;
      const sens = Math.max(1, Math.min(10, dragSensitivity)) * 0.5;
      const dragDeg = ((axisDelta * correctedSign) / Math.max(1, depth)) * 90 * sens;
      rotation.set(s.startRotation + dragDeg);

      const want = Math.round(dragDeg / stepDegrees);
      while (s.committedSteps < want) {
        applyStep('next');
        s.committedSteps++;
      }
      while (s.committedSteps > want) {
        applyStep('prev');
        s.committedSteps--;
      }
    },
    [isHorizontal, depth, dragSensitivity, rotation, stepDegrees, applyStep],
  );

  const onPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const s = dragStateRef.current;
      if (!s || !s.active || s.pointerId !== e.pointerId) return;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      dragStateRef.current = null;

      const target = s.startRotation + s.committedSteps * stepDegrees;
      isAnimatingRef.current = true;

      if (s.committedSteps === 0) {
        animate(rotation, target, {
          ...snapTransition,
          onComplete: () => {
            isAnimatingRef.current = false;
          },
        });
        return;
      }

      onIndexChange?.(currentIndexRef.current);
      animate(rotation, target, {
        ...transition,
        delay: 0,
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });
    },
    [rotation, stepDegrees, transition, snapTransition, onIndexChange],
  );

  const cubeTransform = useTransform(rotation, (r) =>
    isHorizontal ? `rotateY(${r}deg)` : `rotateX(${r}deg)`,
  );

  if (items.length === 0) return null;

  const containerStyle: CSSProperties = {
    ...style,
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    touchAction: 'none',
    userSelect: 'none',
  };

  const cubeBoxStyle: CSSProperties = {
    position: 'relative',
    width: cubeW,
    height: cubeH,
  };

  return (
    <div
      ref={wrapperRef}
      className={className}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Currently doing carousel"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      onFocus={() => {
        isHoveredRef.current = true;
      }}
      onBlur={() => {
        isHoveredRef.current = false;
      }}
      style={{
        ...containerStyle,
        overflow: 'visible',
        cursor: enableDrag ? 'grab' : 'default',
        perspective: '1000px',
        perspectiveOrigin: '50% 50%',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <motion.div
        style={{
          ...cubeBoxStyle,
          transformStyle: 'preserve-3d',
          transform: cubeTransform,
        }}
      >
        {[0, 1, 2, 3].map((slot) => {
          const baseAngle = slot * 90;
          const axis = isHorizontal ? 'Y' : 'X';
          const itemIdx = faceItems[slot] ?? 0;
          const item = items[modIdx(itemIdx, Math.max(1, items.length))];
          return (
            <div
              key={slot}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                transformStyle: 'preserve-3d',
                transform: `rotate${axis}(${baseAngle}deg) translateZ(${halfDepth}px)`,
                backfaceVisibility: 'hidden',
                overflow: 'hidden',
                background: '#000',
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.25)',
              }}
            >
              <FaceContent item={item} />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

function FaceContent({ item }: { item: CarouselItem | undefined }) {
  if (!item) {
    return <div style={{ width: '100%', height: '100%', background: '#111' }} />;
  }

  if (item.type === 'video') {
    const src = resolveSrc(item.srcUrl) || resolveSrc(item.src);
    const poster = resolveSrc(item.poster);
    return (
      <video
        src={src}
        poster={poster || undefined}
        muted
        playsInline
        loop
        autoPlay
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          pointerEvents: 'none',
        }}
      />
    );
  }

  if (item.type === 'card') {
    return <CardFace label={item.label || item.alt || 'Update'} sublabel={item.sublabel} />;
  }

  const src = resolveSrc(item.srcUrl) || resolveSrc(item.src);
  if (!src) {
    return <CardFace label={item.label || item.alt || 'Add an image'} sublabel={item.sublabel} />;
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <img
        src={src}
        alt={item.alt || ''}
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
      {item.label ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '16px 18px',
            background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.78) 100%)',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontFamily: 'Montserrat, system-ui, sans-serif',
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#EEF2F6',
            }}
          >
            {item.label}
          </span>
          {item.sublabel ? (
            <span
              style={{
                marginTop: 4,
                fontFamily: 'Montserrat, system-ui, sans-serif',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(187,204,215,0.75)',
              }}
            >
              {item.sublabel}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function CardFace({ label, sublabel }: { label: string; sublabel?: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        padding: 22,
        boxSizing: 'border-box',
        background:
          'radial-gradient(ellipse 90% 70% at 20% 0%, rgba(118,33,176,0.45) 0%, transparent 55%), radial-gradient(ellipse 80% 60% at 90% 100%, rgba(72,229,194,0.18) 0%, transparent 50%), linear-gradient(145deg, #171a24 0%, #0c0c0c 55%, #141018 100%)',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <span
        style={{
          fontFamily: 'Montserrat, system-ui, sans-serif',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(45,212,191,0.9)',
        }}
      >
        {sublabel || 'Now'}
      </span>
      <span
        style={{
          marginTop: 10,
          fontFamily: 'Montserrat, system-ui, sans-serif',
          fontSize: 20,
          fontWeight: 900,
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          lineHeight: 1.15,
          color: '#EEF2F6',
        }}
      >
        {label}
      </span>
    </div>
  );
}
