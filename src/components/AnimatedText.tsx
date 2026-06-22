import { useMemo, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { PROFILE_SUMMARY } from '../data/profile';

const smoothEase = [0.22, 1, 0.36, 1] as const;

type CharSpanProps = {
  char: string;
  index: number;
  total: number;
  scrollProgress: MotionValue<number>;
};

function CharSpan({ char, index, total, scrollProgress }: CharSpanProps) {
  const start = total > 1 ? index / total : 0;
  const end = total > 1 ? (index + 1) / total : 1;
  const opacity = useTransform(scrollProgress, [start, end], [0.2, 1], { clamp: true });
  const display = char === ' ' ? '\u00A0' : char;

  return (
    <span className="relative inline-block whitespace-pre">
      <span className="invisible">{display}</span>
      <motion.span className="absolute left-0 top-0" style={{ opacity }}>
        {display}
      </motion.span>
    </span>
  );
}

function DesktopScrollText() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });
  const chars = useMemo(() => PROFILE_SUMMARY.split(''), []);

  return (
    <p
      ref={ref}
      className="mx-auto hidden max-w-[620px] px-4 text-balance text-center font-medium leading-relaxed text-[var(--surface-accent)] sm:px-5 md:px-0 lg:block"
      style={{ fontSize: 'clamp(0.95rem, 4.2vw, 1.35rem)' }}
    >
      {chars.map((c, i) => (
        <CharSpan key={`${i}-${c}`} char={c} index={i} total={chars.length} scrollProgress={scrollYProgress} />
      ))}
    </p>
  );
}

function MobileFadeText() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.p
      className="mx-auto max-w-[620px] px-4 text-balance text-center text-[15px] font-medium leading-relaxed text-neutral-900 sm:px-5 sm:text-base md:px-0 lg:hidden"
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.95, ease: smoothEase, delay: 0.08 }}
    >
      {PROFILE_SUMMARY}
    </motion.p>
  );
}

export function AnimatedText() {
  return (
    <>
      <MobileFadeText />
      <DesktopScrollText />
    </>
  );
}
