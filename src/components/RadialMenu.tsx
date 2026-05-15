import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from 'framer-motion';
import {
  Award,
  Briefcase,
  FolderKanban,
  Mail,
  Menu as MenuIcon,
  Sparkles,
  User,
  X as XIcon,
  type LucideIcon,
} from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';

type Item = {
  href: string;
  label: string;
  Icon: LucideIcon;
  /** Math angle in degrees, CCW from +X axis. 90 = top, 180 = left, 270 = bottom, 0 = right. */
  angleDeg: number;
  /** Symmetric stagger bucket. Items sharing a stagger value reveal together. */
  stagger: number;
};

type Dim = {
  wheel: number;
  iconRadius: number;
  toggle: number;
  itemW: number;
  itemH: number;
  glow: number;
  iconSize: number;
  labelSize: number;
};

const DIM_DESKTOP: Dim = {
  wheel: 256,
  iconRadius: 88,
  toggle: 56,
  itemW: 76,
  itemH: 54,
  glow: 118,
  iconSize: 18,
  labelSize: 8,
};

const DIM_MOBILE: Dim = {
  wheel: 216,
  iconRadius: 74,
  toggle: 50,
  itemW: 68,
  itemH: 50,
  glow: 98,
  iconSize: 17,
  labelSize: 7.25,
};

/**
 * Hexagon layout — clockwise from top in scroll order:
 * About → Skills → Experience → Certs → Projects → Contact.
 * Angles measured CCW from +X: 90° = top; each step −60° advances clockwise on screen.
 */
const ITEMS: readonly Item[] = [
  { href: '#about', label: 'About', Icon: User, angleDeg: 90, stagger: 0 },
  { href: '#skills', label: 'Skills', Icon: Sparkles, angleDeg: 30, stagger: 1 },
  { href: '#experience', label: 'Experience', Icon: Briefcase, angleDeg: 330, stagger: 1 },
  { href: '#certificates', label: 'Certs', Icon: Award, angleDeg: 270, stagger: 2 },
  { href: '#projects', label: 'Projects', Icon: FolderKanban, angleDeg: 210, stagger: 2 },
  { href: '#contact', label: 'Contact', Icon: Mail, angleDeg: 150, stagger: 3 },
] as const;

const COLORS = {
  toggleBg: 'rgb(231, 231, 231)',
  toggleIcon: 'rgb(47, 48, 52)',
  wheelBg: 'rgb(47, 48, 52)',
  iconIdle: 'rgb(197, 198, 202)',
  iconActive: 'rgb(255, 255, 255)',
  labelIdle: 'rgba(255, 255, 255, 0.6)',
  labelActive: 'rgb(255, 255, 255)',
} as const;

const WHEEL_SPRING = { type: 'spring' as const, stiffness: 320, damping: 26, mass: 0.85 };
const ITEM_SPRING = { type: 'spring' as const, stiffness: 360, damping: 24, mass: 0.8 };
const GLOW_SPRING = { type: 'spring' as const, stiffness: 260, damping: 24, mass: 0.9 };
const TOGGLE_SPRING = { type: 'spring' as const, stiffness: 420, damping: 24 };

function radialOffset(deg: number, r: number): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180;
  return { x: Math.cos(rad) * r, y: -Math.sin(rad) * r };
}

function hapticTap(strength: number) {
  if (typeof navigator === 'undefined') return;
  const nav = navigator as Navigator & { vibrate?: (pattern: number | number[]) => boolean };
  if (typeof nav.vibrate !== 'function') return;
  try {
    nav.vibrate(strength);
  } catch {
    /* iOS does not implement Vibration API — silently ignore. */
  }
}

export function RadialMenu() {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const dim = isMobile ? DIM_MOBILE : DIM_DESKTOP;

  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [toggleFlash, setToggleFlash] = useState(0);
  const [itemFlash, setItemFlash] = useState<{ id: number; index: number } | null>(null);
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Two-layer ripple controllers (light ring + dark ring) so the effect reads on any background.
  const togglePulseLight = useAnimationControls();
  const togglePulseDark = useAnimationControls();
  const itemPulseLight = useAnimationControls();
  const itemPulseDark = useAnimationControls();

  const navTimerRef = useRef<number | null>(null);
  const flashClearRef = useRef<number | null>(null);
  const itemFlashClearRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      setHover(null);
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (navTimerRef.current !== null) window.clearTimeout(navTimerRef.current);
      if (flashClearRef.current !== null) window.clearTimeout(flashClearRef.current);
      if (itemFlashClearRef.current !== null) window.clearTimeout(itemFlashClearRef.current);
    };
  }, []);

  const triggerTogglePulse = () => {
    if (reduceMotion) return;
    const rippleLight = {
      opacity: [0, 0.85, 0],
      scale: [0.85, 1.6, 2.6],
      transition: { duration: 0.8, times: [0, 0.22, 1], ease: 'easeOut' as const },
    };
    const rippleDark = {
      opacity: [0, 0.55, 0],
      scale: [0.95, 1.55, 2.4],
      transition: { duration: 0.8, times: [0, 0.22, 1], ease: 'easeOut' as const },
    };
    togglePulseLight.set({ opacity: 0, scale: 0.85 });
    togglePulseDark.set({ opacity: 0, scale: 0.95 });
    void togglePulseLight.start(rippleLight);
    void togglePulseDark.start(rippleDark);
  };

  const triggerItemPulse = (index: number) => {
    if (reduceMotion) return;
    const { x, y } = radialOffset(ITEMS[index].angleDeg, dim.iconRadius);
    const baseLight = { x, y, opacity: 0, scale: 0.7 };
    const baseDark = { x, y, opacity: 0, scale: 0.8 };
    itemPulseLight.set(baseLight);
    itemPulseDark.set(baseDark);
    void itemPulseLight.start({
      opacity: [0, 0.85, 0],
      scale: [0.7, 1.35, 2.2],
      transition: { duration: 0.6, times: [0, 0.22, 1], ease: 'easeOut' },
    });
    void itemPulseDark.start({
      opacity: [0, 0.5, 0],
      scale: [0.8, 1.3, 2.05],
      transition: { duration: 0.6, times: [0, 0.22, 1], ease: 'easeOut' },
    });
  };

  const flashTogglePressed = () => {
    setToggleFlash((id) => id + 1);
    if (flashClearRef.current !== null) window.clearTimeout(flashClearRef.current);
    flashClearRef.current = window.setTimeout(() => {
      setToggleFlash((id) => id + 1);
      flashClearRef.current = null;
    }, 220);
  };

  const flashItemPressed = (index: number) => {
    const id = Date.now();
    setItemFlash({ id, index });
    if (itemFlashClearRef.current !== null) window.clearTimeout(itemFlashClearRef.current);
    itemFlashClearRef.current = window.setTimeout(() => {
      setItemFlash((curr) => (curr && curr.id === id ? null : curr));
      itemFlashClearRef.current = null;
    }, 220);
  };

  const navigate = (href: string) => {
    const id = href.replace(/^#/, '');
    const target = typeof document !== 'undefined' ? document.getElementById(id) : null;
    if (target) {
      target.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      if (typeof history !== 'undefined' && 'replaceState' in history) {
        history.replaceState(null, '', `#${id}`);
      }
    }
  };

  const handleToggle = () => {
    hapticTap(8);
    flashTogglePressed();
    triggerTogglePulse();
    setOpen((value) => !value);
  };

  const handleItem = (index: number, href: string) => {
    hapticTap(5);
    flashItemPressed(index);
    triggerItemPulse(index);
    if (navTimerRef.current !== null) window.clearTimeout(navTimerRef.current);
    navTimerRef.current = window.setTimeout(
      () => {
        navigate(href);
        setOpen(false);
      },
      reduceMotion ? 0 : 180,
    );
  };

  const hoverItem = hover !== null ? ITEMS[hover] : null;
  const hoverPos = hoverItem
    ? radialOffset(hoverItem.angleDeg, dim.iconRadius)
    : { x: 0, y: 0 };

  const togglePressed = toggleFlash % 2 === 1;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed bottom-[max(6.75rem,env(safe-area-inset-bottom)+5.5rem)] left-1/2 z-[120] -translate-x-1/2 sm:bottom-[max(7.5rem,env(safe-area-inset-bottom)+6.5rem)]"
    >
      <div
        className="pointer-events-auto relative"
        style={{ width: dim.toggle, height: dim.toggle }}
      >
        {/* Wheel — circular dark disc centered on the toggle. */}
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: dim.wheel,
            height: dim.wheel,
            marginLeft: -dim.wheel / 2,
            marginTop: -dim.wheel / 2,
            backgroundColor: COLORS.wheelBg,
            boxShadow: [
              '0 22px 60px -16px rgba(0,0,0,0.55)',
              '0 0 0 1px rgba(255,255,255,0.06) inset',
              '0 -14px 36px -12px rgba(255,255,255,0.05) inset',
              '0 14px 36px -12px rgba(0,0,0,0.4) inset',
            ].join(', '),
          }}
          initial={false}
          animate={
            open
              ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
              : { opacity: 0, scale: 0.4, filter: 'blur(5px)' }
          }
          transition={WHEEL_SPRING}
        />

        {/* Item press ripples — dark ring (for light backgrounds) + light ring (for dark backgrounds). */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: dim.itemW,
            height: dim.itemW,
            marginLeft: -dim.itemW / 2,
            marginTop: -dim.itemW / 2,
            border: '2px solid rgba(15, 15, 18, 0.55)',
          }}
          initial={{ opacity: 0, scale: 0.8, x: 0, y: 0 }}
          animate={itemPulseDark}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: dim.itemW,
            height: dim.itemW,
            marginLeft: -dim.itemW / 2,
            marginTop: -dim.itemW / 2,
            border: '2px solid rgba(255,255,255,0.9)',
          }}
          initial={{ opacity: 0, scale: 0.7, x: 0, y: 0 }}
          animate={itemPulseLight}
        />

        {/* Light overlay — soft radial spotlight that tracks the hovered/pressed icon. */}
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: dim.glow,
            height: dim.glow,
            marginLeft: -dim.glow / 2,
            marginTop: -dim.glow / 2,
            background:
              'radial-gradient(circle at center, rgba(255,255,255,0.22), rgba(255,255,255,0) 65%)',
            mixBlendMode: 'plus-lighter',
            filter: 'blur(4px)',
            pointerEvents: 'none',
          }}
          initial={false}
          animate={
            open && hoverItem
              ? { x: hoverPos.x, y: hoverPos.y, opacity: 1, scale: 1 }
              : { x: 0, y: 0, opacity: 0, scale: 0.6 }
          }
          transition={GLOW_SPRING}
        />

        {/* Radial nav items — icon + label per item, with bg flash on press. */}
        {ITEMS.map((item, i) => {
          const { x, y } = radialOffset(item.angleDeg, dim.iconRadius);
          const isHovered = hover === i;
          const isPressed = itemFlash?.index === i;
          return (
            <motion.button
              key={item.href}
              type="button"
              aria-label={item.label}
              onClick={() => handleItem(i, item.href)}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover((curr) => (curr === i ? null : curr))}
              onFocus={() => setHover(i)}
              onBlur={() => setHover((curr) => (curr === i ? null : curr))}
              className="absolute left-1/2 top-1/2 flex select-none flex-col items-center justify-center gap-[3px] overflow-hidden rounded-2xl px-px outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              style={{
                width: dim.itemW,
                height: dim.itemH,
                marginLeft: -dim.itemW / 2,
                marginTop: -dim.itemH / 2,
                pointerEvents: open ? 'auto' : 'none',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
              }}
              tabIndex={open ? 0 : -1}
              initial={false}
              animate={
                open
                  ? { x, y, opacity: 1, scale: 1, filter: 'blur(0px)' }
                  : { x: 0, y: 0, opacity: 0, scale: 0.4, filter: 'blur(5px)' }
              }
              transition={{
                ...ITEM_SPRING,
                delay: open && !reduceMotion ? 0.06 + item.stagger * 0.06 : 0,
              }}
              whileHover={open && !reduceMotion ? { scale: 1.08 } : undefined}
              whileTap={open && !reduceMotion ? { scale: 0.82 } : undefined}
            >
              {/* Press flash overlay — white wash inside the item rect. */}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.35)' }}
                initial={false}
                animate={{ opacity: isPressed ? 1 : 0 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
              />
              <motion.span
                className="relative z-10 flex"
                animate={{ color: isHovered || isPressed ? COLORS.iconActive : COLORS.iconIdle }}
                transition={{ duration: 0.18 }}
              >
                <item.Icon
                  style={{ width: dim.iconSize, height: dim.iconSize }}
                  strokeWidth={1.7}
                  aria-hidden
                />
              </motion.span>
              <motion.span
                className="relative z-10 max-w-[5.75rem] text-center whitespace-nowrap font-semibold uppercase leading-none tracking-[0.1em]"
                style={{ fontSize: `${dim.labelSize}px` }}
                animate={{ color: isHovered || isPressed ? COLORS.labelActive : COLORS.labelIdle }}
                transition={{ duration: 0.18 }}
              >
                {item.label}
              </motion.span>
            </motion.button>
          );
        })}

        {/* Toggle press ripples — dark + light layers for cross-background visibility. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: dim.toggle,
            height: dim.toggle,
            marginLeft: -dim.toggle / 2,
            marginTop: -dim.toggle / 2,
            border: '2.5px solid rgba(15, 15, 18, 0.6)',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={togglePulseDark}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: dim.toggle,
            height: dim.toggle,
            marginLeft: -dim.toggle / 2,
            marginTop: -dim.toggle / 2,
            border: '2.5px solid rgba(255,255,255,0.9)',
          }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={togglePulseLight}
        />

        {/* Toggle — always on top of the wheel. */}
        <motion.button
          type="button"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          onClick={handleToggle}
          className="relative z-10 flex items-center justify-center overflow-hidden rounded-full outline-none focus-visible:ring-2 focus-visible:ring-black/30"
          style={{
            width: dim.toggle,
            height: dim.toggle,
            backgroundColor: COLORS.toggleBg,
            color: COLORS.toggleIcon,
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
            boxShadow: [
              '0 14px 36px -10px rgba(0,0,0,0.5)',
              '0 0 32px -12px rgba(109,40,217,0.28)',
              '0 1px 0 rgba(255,255,255,0.65) inset',
              '0 0 0 1px rgba(0,0,0,0.06)',
            ].join(', '),
          }}
          whileHover={reduceMotion ? undefined : { scale: 1.04 }}
          whileTap={reduceMotion ? undefined : { scale: 0.84 }}
          transition={TOGGLE_SPRING}
        >
          {/* Press flash on the button surface itself — visible on any background. */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{ backgroundColor: 'rgb(255, 255, 255)' }}
            initial={false}
            animate={{ opacity: togglePressed ? 1 : 0 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
          />
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="x"
                className="relative z-10 flex"
                initial={reduceMotion ? { opacity: 0 } : { rotate: -90, opacity: 0, scale: 0.6 }}
                animate={reduceMotion ? { opacity: 1 } : { rotate: 0, opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              >
                <XIcon
                  style={{ width: dim.iconSize + 2, height: dim.iconSize + 2 }}
                  strokeWidth={2.2}
                  aria-hidden
                />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                className="relative z-10 flex"
                initial={reduceMotion ? { opacity: 0 } : { rotate: 90, opacity: 0, scale: 0.6 }}
                animate={reduceMotion ? { opacity: 1 } : { rotate: 0, opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { rotate: -90, opacity: 0, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              >
                <MenuIcon
                  style={{ width: dim.iconSize + 2, height: dim.iconSize + 2 }}
                  strokeWidth={2.2}
                  aria-hidden
                />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
