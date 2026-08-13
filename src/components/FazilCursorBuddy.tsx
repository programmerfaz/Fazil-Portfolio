import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { speakAbout } from '../data/cursorGuide';

type Mood = 'idle' | 'run' | 'wave' | 'think';

function FazilMini({ mood, flip }: { mood: Mood; flip: boolean }) {
  return (
    <svg
      viewBox="0 0 72 92"
      className={`h-16 w-12 overflow-visible drop-shadow-[0_0_10px_rgba(72,229,194,0.4)] sm:h-[4.25rem] sm:w-14 ${
        flip ? '-scale-x-100' : ''
      } ${mood === 'wave' ? 'scale-110' : ''}`}
      fill="none"
      aria-hidden
    >
      <ellipse cx="36" cy="88" rx="14" ry="2.6" fill="rgba(0,0,0,0.28)" />
      <rect x="24" y="60" width="24" height="24" rx="7" fill="#12352b" stroke="#48E5C2" strokeWidth="2.2" />
      <rect x="28" y="64" width="16" height="7" rx="2" fill="#e8eef2" />
      <path
        d="M24 66 H14"
        stroke="#48E5C2"
        strokeWidth="3.2"
        strokeLinecap="round"
        className={mood === 'wave' ? 'fazil-buddy-wave' : ''}
      />
      <path d="M48 66 H58" stroke="#48E5C2" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="36" cy="34" r="20" fill="#c48a5a" stroke="#48E5C2" strokeWidth="2.2" />
      <path d="M18 30 C22 8 50 8 54 30 C48 16 24 16 18 30 Z" fill="#1a1a1a" />
      <path d="M22 47 C25 60 47 60 50 47 C46 56 26 56 22 47 Z" fill="#2a1c14" />
      <rect x="19" y="31" width="34" height="12" rx="3.5" stroke="#111" strokeWidth="2.6" fill="rgba(11,18,22,0.15)" />
      <path d="M36 31 V43" stroke="#111" strokeWidth="2.2" />
      <circle cx="28" cy="37" r="2.3" fill="#111" className="fazil-buddy-blink" />
      <circle cx="44" cy="37" r="2.3" fill="#111" className="fazil-buddy-blink" />
      <path d="M30 49 Q36 53 42 49" stroke="#5a331f" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}


export function FazilCursorBuddy() {
  const reduceMotion = useReducedMotion();
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 80, y: 80 });
  const target = useRef({ x: 80, y: 80 });
  const lastSpeak = useRef(0);
  const lastKey = useRef('');
  const [visible, setVisible] = useState(false);
  const [flip, setFlip] = useState(false);
  const [mood, setMood] = useState<Mood>('idle');
  const [line, setLine] = useState("That's me — Fazil. Hover around, I'll tell you what's what.");
  const [hoveringLink, setHoveringLink] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    document.documentElement.classList.add('fazil-buddy-on');
    return () => document.documentElement.classList.remove('fazil-buddy-on');
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;
    const tick = () => {
      const dx = target.current.x - pos.current.x;
      pos.current.x += dx * 0.2;
      pos.current.y += (target.current.y - pos.current.y) * 0.2;
      const el = cursorRef.current;
      if (el) {
        el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-20%, -80%)`;
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;

    const onMove = (e: PointerEvent) => {
      if (e.clientX > target.current.x + 2) setFlip(false);
      else if (e.clientX < target.current.x - 2) setFlip(true);
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      setVisible(true);

      const hit = (e.target as HTMLElement | null)?.closest('a, button, [role="button"]');
      const overLink = Boolean(hit);
      setHoveringLink(overLink);
      setMood(overLink ? 'wave' : 'run');

      const now = performance.now();
      const section = (e.target as HTMLElement | null)?.closest('section[id], [id]');
      const link = (e.target as HTMLElement | null)?.closest('a');
      const key = `${section?.id ?? ''}|${link?.getAttribute('href') ?? ''}|${(e.target as HTMLElement | null)?.innerText?.slice(0, 40) ?? ''}`;
      if (key !== lastKey.current || now - lastSpeak.current > 3200) {
        lastKey.current = key;
        lastSpeak.current = now;
        setLine(speakAbout(e.target as Element | null));
      }
    };

    const onStop = () => {
      window.setTimeout(() => {
        setMood((m) => (m === 'wave' ? m : 'idle'));
      }, 180);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', () => setVisible(false));
    window.addEventListener('pointerup', onStop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onStop);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || hoveringLink) return;
    const id = window.setTimeout(() => setMood('idle'), 420);
    return () => window.clearTimeout(id);
  }, [line, hoveringLink, reduceMotion]);

  if (reduceMotion) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden
      className={`pointer-events-none fixed left-0 top-0 z-[85] hidden lg:block ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ willChange: 'transform' }}
    >
      <div className={`relative ${mood === 'run' ? 'fazil-buddy-bob' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 8, scale: 0.86 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.9 }}
            transition={{ duration: 0.22 }}
            className="absolute -top-2 left-[88%] z-10 w-[min(16.5rem,58vw)] rounded-2xl rounded-bl-sm border border-[#48E5C2]/35 bg-[#0b1216]/92 px-3 py-2 font-sans text-[11px] font-medium leading-snug text-[#d7e2ea] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.8)] sm:text-xs"
          >
            {line}
          </motion.p>
        </AnimatePresence>
        <FazilMini mood={mood} flip={flip} />
      </div>
    </div>
  );
}
