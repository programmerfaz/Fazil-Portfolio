import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const AWAY_MS = 5 * 60 * 1000;
const FIRST_APPEAR_MS = 2500;
const VISIT_MS = 18_000;
const HELLO_MS = 2200;

type Phase = 'live' | 'dying' | 'away' | 'hello';

function DebuggerBeetle({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 88"
      className={`h-[3.35rem] w-12 overflow-visible drop-shadow-[0_0_10px_rgba(72,229,194,0.45)] sm:h-16 sm:w-14 ${className}`}
      fill="none"
      aria-hidden
    >
      <path className="hero-bug-leg" d="M16 34 L4 24" stroke="#7ee8c8" strokeWidth="2.6" strokeLinecap="round" />
      <path className="hero-bug-leg" d="M64 34 L76 24" stroke="#7ee8c8" strokeWidth="2.6" strokeLinecap="round" />
      <path className="hero-bug-leg hero-bug-leg-delay" d="M14 46 L2 46" stroke="#7ee8c8" strokeWidth="2.6" strokeLinecap="round" />
      <path className="hero-bug-leg hero-bug-leg-delay" d="M66 46 L78 46" stroke="#7ee8c8" strokeWidth="2.6" strokeLinecap="round" />
      <path className="hero-bug-leg" d="M18 58 L6 70" stroke="#7ee8c8" strokeWidth="2.6" strokeLinecap="round" />
      <path className="hero-bug-leg" d="M62 58 L74 70" stroke="#7ee8c8" strokeWidth="2.6" strokeLinecap="round" />
      <path className="hero-bug-antenna" d="M30 18 C24 8 16 6 10 5" stroke="#48E5C2" strokeWidth="2.2" strokeLinecap="round" />
      <path className="hero-bug-antenna hero-bug-antenna-delay" d="M50 18 C56 8 64 6 70 5" stroke="#48E5C2" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="10" cy="5" r="2.1" fill="#48E5C2" />
      <circle cx="70" cy="5" r="2.1" fill="#48E5C2" />
      <ellipse cx="40" cy="20" rx="12" ry="10" fill="#0f2a22" stroke="#48E5C2" strokeWidth="2.4" />
      <circle cx="35" cy="19" r="2.4" fill="#48E5C2" />
      <circle cx="45" cy="19" r="2.4" fill="#48E5C2" />
      <path
        d="M22 30 C22 24 30 22 40 22 C50 22 58 24 58 30 L58 62 C58 72 50 78 40 78 C30 78 22 72 22 62 Z"
        fill="#12352b"
        stroke="#48E5C2"
        strokeWidth="2.6"
      />
      <path d="M40 24 L40 76" stroke="#48E5C2" strokeWidth="2.2" />
      <ellipse cx="31" cy="48" rx="6" ry="9" fill="#1d5c4a" opacity="0.55" />
      <ellipse cx="49" cy="48" rx="6" ry="9" fill="#1d5c4a" opacity="0.55" />
      <circle cx="40" cy="50" r="5.2" fill="#ef4444" stroke="#0b1216" strokeWidth="1.4" />
    </svg>
  );
}

function randomViewportSpot() {
  const pad = 64;
  return {
    x: pad + Math.random() * Math.max(40, window.innerWidth - pad * 2),
    y: pad + Math.random() * Math.max(40, window.innerHeight - pad * 2),
    angle: 0,
  };
}

export function SiteBug() {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 80, y: 120 });
  const vel = useRef({ x: 1.1, y: 0.6 });
  const angleRef = useRef(0);
  const [phase, setPhase] = useState<Phase>('away');
  const [spot, setSpot] = useState({ x: 80, y: 120, angle: 0 });
  const firstVisit = useRef(true);

  const crawling = phase === 'live';

  useEffect(() => {
    if (reduceMotion || !crawling) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    pos.current = {
      x: 64 + Math.random() * Math.max(80, window.innerWidth - 128),
      y: 64 + Math.random() * Math.max(80, window.innerHeight - 128),
    };

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(32, now - last) / 16.67;
      last = now;
      const pad = 40;
      const maxX = Math.max(pad, window.innerWidth - pad);
      const maxY = Math.max(pad, window.innerHeight - pad);

      if (Math.random() < 0.028) {
        vel.current.x += (Math.random() - 0.5) * 1.6;
        vel.current.y += (Math.random() - 0.5) * 1.6;
      }

      const speed = Math.hypot(vel.current.x, vel.current.y) || 1;
      vel.current.x = (vel.current.x / speed) * 1.7;
      vel.current.y = (vel.current.y / speed) * 1.7;

      pos.current.x += vel.current.x * dt * 2.2;
      pos.current.y += vel.current.y * dt * 2.2;

      if (pos.current.x < pad || pos.current.x > maxX) {
        vel.current.x *= -1;
        pos.current.x = Math.min(maxX, Math.max(pad, pos.current.x));
      }
      if (pos.current.y < pad || pos.current.y > maxY) {
        vel.current.y *= -1;
        pos.current.y = Math.min(maxY, Math.max(pad, pos.current.y));
      }

      const angle = (Math.atan2(vel.current.y, vel.current.x) * 180) / Math.PI + 90;
      angleRef.current = angle;
      wrap.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%) rotate(${angle}deg)`;
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [reduceMotion, crawling]);

  useEffect(() => {
    if (phase !== 'dying') return;
    const id = window.setTimeout(() => setPhase('away'), 780);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'away') return;
    const wait = firstVisit.current ? FIRST_APPEAR_MS : AWAY_MS;
    const id = window.setTimeout(() => {
      firstVisit.current = false;
      setSpot(randomViewportSpot());
      setPhase('hello');
    }, wait);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'live') return;
    const id = window.setTimeout(() => setPhase('away'), VISIT_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'hello') return;
    pos.current = { x: spot.x, y: spot.y };
    const id = window.setTimeout(() => setPhase('live'), HELLO_MS);
    return () => window.clearTimeout(id);
  }, [phase, spot.x, spot.y]);

  const squash = () => {
    if (phase !== 'live' && phase !== 'hello') return;
    setSpot({ x: pos.current.x, y: pos.current.y, angle: angleRef.current });
    setPhase('dying');
  };

  if (reduceMotion) return null;

  const parked = phase !== 'live';

  return (
    <div
      ref={wrapRef}
      className="pointer-events-auto fixed left-0 top-0 z-[45]"
      style={
        parked
          ? {
              transform: `translate3d(${spot.x}px, ${spot.y}px, 0) translate(-50%, -50%)`,
            }
          : undefined
      }
    >
      <AnimatePresence mode="wait">
        {phase === 'dying' ? (
          <motion.div
            key="dying"
            className="relative flex h-16 w-16 items-center justify-center"
            initial={{ scale: 1, rotate: spot.angle }}
            animate={{ scale: [1, 1.25, 0.2], rotate: spot.angle + 220, opacity: [1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            <DebuggerBeetle />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.span
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-[#48E5C2]"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((i / 6) * Math.PI * 2) * 28,
                  y: Math.sin((i / 6) * Math.PI * 2) * 28,
                  opacity: 0,
                  scale: 0.2,
                }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
              />
            ))}
            <motion.span
              className="absolute font-mono text-[11px] font-bold uppercase tracking-wider text-[#ef4444]"
              initial={{ opacity: 0, y: 8, scale: 0.7 }}
              animate={{ opacity: [0, 1, 0], y: -18, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              404
            </motion.span>
          </motion.div>
        ) : null}

        {phase === 'hello' ? (
          <motion.div
            key="hello"
            className="relative flex flex-col items-center"
            initial={{ scale: 0, y: 18, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 18 }}
          >
            <button
              type="button"
              aria-label="Debug the bug"
              onPointerDown={(e) => {
                e.stopPropagation();
                squash();
              }}
              className="border-0 bg-transparent p-0"
            >
              <DebuggerBeetle />
            </button>
            <motion.p
              initial={{ opacity: 0, y: 6, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.12, type: 'spring', stiffness: 300, damping: 20 }}
              className="mt-1 whitespace-nowrap rounded-full border border-[#48E5C2]/35 bg-[#0b1216]/90 px-2.5 py-1 font-mono text-[10px] font-semibold text-[#48E5C2] shadow-[0_8px_20px_-10px_rgba(0,0,0,0.7)] backdrop-blur-sm sm:text-[11px]"
            >
              I&apos;ll come later
            </motion.p>
          </motion.div>
        ) : null}

        {phase === 'live' ? (
          <motion.button
            key="live"
            type="button"
            aria-label="Debug the bug"
            onPointerDown={(e) => {
              e.stopPropagation();
              squash();
            }}
            className="cursor-none border-0 bg-transparent p-0"
            initial={{ scale: 0.9, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <DebuggerBeetle />
          </motion.button>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
