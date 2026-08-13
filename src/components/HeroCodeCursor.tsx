import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

type HeroCodeCursorProps = {
  active: boolean;
};

export function HeroCodeCursor({ active }: HeroCodeCursorProps) {
  const reduceMotion = useReducedMotion();
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const [hoveringLink, setHoveringLink] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active || reduceMotion) return;

    let raf = 0;
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.22;
      pos.current.y += (target.current.y - pos.current.y) * 0.22;
      const el = cursorRef.current;
      if (el) {
        el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [active, reduceMotion]);

  useEffect(() => {
    if (!active || reduceMotion) {
      setVisible(false);
      return;
    }

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      setVisible(true);
      const hit = (e.target as HTMLElement | null)?.closest('a, button, [role="button"]');
      setHoveringLink(Boolean(hit));
    };

    const onLeave = () => setVisible(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [active, reduceMotion]);

  if (reduceMotion || !active) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden
      className={`pointer-events-none fixed left-0 top-0 z-[80] hidden lg:block ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ willChange: 'transform' }}
    >
      <div
        className={`relative flex items-center gap-2.5 transition-transform duration-200 ${
          hoveringLink ? 'scale-110' : 'scale-100'
        }`}
      >
        <span className="hero-code-cursor-caret h-9 w-[3px] rounded-full bg-[#48E5C2] shadow-[0_0_16px_rgba(72,229,194,0.95)]" />
        <span className="rounded-lg border border-[#48E5C2]/40 bg-[#0b1216]/85 px-2.5 py-1 font-mono text-sm font-bold tracking-wide text-[#48E5C2] shadow-[0_10px_24px_-10px_rgba(0,0,0,0.85)] backdrop-blur-sm">
          {hoveringLink ? '→ click' : '</>'}
        </span>
      </div>
    </div>
  );
}
