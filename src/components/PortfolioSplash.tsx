import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { PROFILE } from '../data/profile';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const STAGGER_SEC = 0.07;
const HOLD_AFTER_MS = 320;
const LETTER_DONE_PAD_MS = 140;

const letterVariants: Variants = {
  hidden: { opacity: 0, scale: 0.75, y: 28 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 420, damping: 26 },
  },
};

function makeRowVariants(delayChildren: number): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: STAGGER_SEC, delayChildren },
    },
  };
}

const WORD1 = 'PORTFOLIO';

function scaleForWidth(w: number): number {
  if (w < 380) return 1.01;
  if (w < 480) return 1.02;
  if (w < 640) return 1.04;
  if (w < 768) return 1.06;
  if (w < 1024) return 1.1;
  return 1.12;
}

export function PortfolioSplash() {
  const nameUpper = useMemo(() => PROFILE.name.toUpperCase(), []);
  const chars1 = useMemo(() => WORD1.split(''), []);
  const chars2 = useMemo(() => nameUpper.split(''), [nameUpper]);

  const line2Delay = 0.08 + chars1.length * STAGGER_SEC;
  const row1 = useMemo(() => makeRowVariants(0.08), []);
  const row2 = useMemo(() => makeRowVariants(line2Delay), [line2Delay]);

  const letterDoneMs = useMemo(
    () => Math.round((line2Delay + chars2.length * STAGGER_SEC) * 1000) + LETTER_DONE_PAD_MS,
    [line2Delay, chars2.length],
  );

  const ZOOM_ANIM_MS = 720;
  const autoDismissMs = useMemo(
    () => letterDoneMs + ZOOM_ANIM_MS + HOLD_AFTER_MS,
    [letterDoneMs],
  );

  const [vw, setVw] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1024,
  );
  const scaleTarget = useMemo(() => scaleForWidth(vw), [vw]);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const [open, setOpen] = useState(() => !prefersReducedMotion());
  const [exiting, setExiting] = useState(false);
  const [phase, setPhase] = useState<'letters' | 'zoom'>('letters');

  const finish = useCallback(() => {
    setExiting(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => setPhase('zoom'), letterDoneMs);
    return () => window.clearTimeout(t);
  }, [open, letterDoneMs]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(finish, autoDismissMs);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, [open, finish, autoDismissMs]);

  useEffect(() => {
    if (!open) document.body.style.overflow = '';
  }, [open]);

  useEffect(
    () => () => {
      document.body.style.overflow = '';
    },
    [],
  );

  if (!open) return null;

  const zoom = phase === 'zoom';

  const fs1 = zoom
    ? 'clamp(2.4rem, min(10.5vw, 14dvh), 9rem)'
    : 'clamp(2.7rem, 12.5vw, 9.5rem)';
  const fs2 = zoom
    ? 'clamp(1.7rem, min(6.8vw, 9.5dvh), 6.2rem)'
    : 'clamp(1.9rem, 7.8vw, 6.2rem)';

  const rowTextClass = zoom
    ? 'hero-heading-light font-black uppercase leading-[0.9] transition-[font-size] duration-[420ms] ease-out [text-wrap:balance]'
    : 'font-black uppercase leading-[0.9] text-portfolio-ink-dark transition-[font-size] duration-[420ms] ease-out [text-wrap:balance]';

  return (
    <motion.div
      role="dialog"
      aria-label="Loading intro"
      aria-busy={!exiting}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-portfolio-light px-[max(0.75rem,env(safe-area-inset-left))] py-[max(0.75rem,env(safe-area-inset-top))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:px-4"
      style={{
        backgroundImage: [
          'radial-gradient(ellipse 100% 80% at 20% 10%, rgba(6, 182, 212, 0.07) 0%, transparent 52%)',
          'radial-gradient(ellipse 90% 70% at 85% 20%, rgba(139, 92, 246, 0.06) 0%, transparent 48%)',
        ].join(', '),
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
      onAnimationComplete={() => {
        if (exiting) setOpen(false);
      }}
    >
      <button
        type="button"
        className="absolute right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] text-[10px] font-medium uppercase tracking-[0.2em] text-portfolio-muted-dark transition-colors hover:text-portfolio-cyan sm:right-8 sm:top-8 sm:text-[11px]"
        onClick={finish}
      >
        Skip
      </button>

      <motion.div
        className={`flex w-full max-w-[100vw] flex-col items-center justify-center text-center will-change-transform ${
          zoom ? 'min-h-[70dvh] sm:min-h-[70vh]' : 'min-h-0'
        }`}
        initial={false}
        animate={{
          scale: zoom ? scaleTarget : 1,
        }}
        transition={{
          scale: { type: 'spring', stiffness: 150, damping: 22, mass: 0.65 },
        }}
        style={{ transformOrigin: 'center center' }}
      >
        <motion.div
          className={`flex max-w-full flex-col items-center text-center transition-[gap,letter-spacing] duration-[420ms] ease-out ${
            zoom
              ? 'w-full justify-center gap-[clamp(0.75rem,3.5dvh,2rem)] tracking-[0.02em]'
              : 'gap-8 sm:gap-12 md:gap-14'
          }`}
        >
          <motion.div
            className={`flex max-w-full flex-wrap justify-center ${rowTextClass}`}
            style={{ fontSize: fs1 }}
            variants={row1}
            initial="hidden"
            animate="visible"
          >
            {chars1.map((char, i) => (
              <motion.span key={`p-${i}-${char}`} variants={letterVariants} className="inline-block">
                {char}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            className={`flex max-w-full flex-wrap justify-center ${rowTextClass}`}
            style={{ fontSize: fs2 }}
            variants={row2}
            initial="hidden"
            animate="visible"
          >
            {chars2.map((char, i) => {
              const display = char === ' ' ? '\u00A0' : char;
              return (
                <motion.span
                  key={`n-${i}-${char}`}
                  variants={letterVariants}
                  className={`inline-block ${char === ' ' ? 'w-[0.35em]' : ''}`}
                >
                  {display}
                </motion.span>
              );
            })}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
