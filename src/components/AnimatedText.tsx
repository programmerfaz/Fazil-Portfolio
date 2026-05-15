import { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { PROFILE_SUMMARY } from '../data/profile';

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

export function AnimatedText() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = useMemo(() => PROFILE_SUMMARY.split(''), []);

  return (
    <p
      ref={ref}
      className="mx-auto max-w-[620px] text-balance text-center font-medium leading-relaxed text-[#D7E2EA]"
      style={{ fontSize: 'clamp(0.95rem, 4.2vw, 1.35rem)' }}
    >
      {chars.map((c, i) => (
        <CharSpan key={`${i}-${c}`} char={c} index={i} total={chars.length} scrollProgress={scrollYProgress} />
      ))}
    </p>
  );
}
