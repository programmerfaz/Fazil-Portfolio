import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BoxCarousel } from '../components/BoxCarousel';
import { CURRENTLY_DOING, CURRENTLY_DOING_CAROUSEL } from '../data/currentlyDoing';
import { useMediaQuery } from '../hooks/useMediaQuery';

const ease = [0.25, 0.1, 0.25, 1] as const;

export function CurrentlyDoingSection() {
  const [index, setIndex] = useState(0);
  const isNarrow = useMediaQuery('(max-width: 640px)');
  const isMid = useMediaQuery('(max-width: 900px)');

  const cubeW = isNarrow ? 280 : isMid ? 400 : 500;
  const cubeH = isNarrow ? 190 : isMid ? 250 : 300;

  const onIndexChange = useCallback((i: number) => {
    setIndex(i);
  }, []);

  const active = CURRENTLY_DOING[index] ?? CURRENTLY_DOING[0]!;

  return (
    <section
      id="now"
      className="relative overflow-x-clip bg-[var(--surface-dark)] pb-10 pt-10 scroll-mt-[max(5rem,12vh)] sm:pb-14 sm:pt-14 sm:scroll-mt-[max(6rem,14vh)] md:pb-16 md:pt-16"
      aria-labelledby="currently-doing-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 80% 20%, rgba(118, 33, 176, 0.1) 0%, transparent 55%), radial-gradient(ellipse 70% 45% at 10% 80%, rgba(72, 229, 194, 0.06) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-8 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease }}
          className="text-center"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#BBCCD7]/75 sm:text-xs">
            Last 1–2 months
          </p>
          <h2
            id="currently-doing-heading"
            className="hero-heading mt-3 font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)' }}
          >
            Currently doing
          </h2>
          <p
            className="mx-auto mt-4 max-w-lg text-pretty font-light leading-relaxed text-[#D7E2EA]/55"
            style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)' }}
          >
            Two-month internship at Seen, grinding NeetCode problems, and jumping into hackathons when I can.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="relative mx-auto mt-10 flex items-center justify-center sm:mt-12 md:mt-14"
          style={{
            height: cubeH + 64,
            // Extra horizontal room so side faces aren't clipped mid-rotate
            width: 'min(100%, ' + (cubeW + 120) + 'px)',
            overflow: 'visible',
          }}
        >
          <BoxCarousel
            items={CURRENTLY_DOING_CAROUSEL}
            direction="left"
            animation="autoplay"
            imageWidth={cubeW}
            imageHeight={cubeH}
            dragSensitivity={6}
            onIndexChange={onIndexChange}
            ease={{
              type: 'tween',
              duration: 1.1,
              delay: 2.2,
              ease: [0.44, 0, 0.56, 1],
            }}
            style={{ width: '100%', height: '100%' }}
          />
        </motion.div>

        <div className="mx-auto mt-8 min-h-[7.5rem] max-w-xl text-center sm:mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease }}
            >
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-400/90 sm:text-xs">
                  {active.period}
                </p>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#BBCCD7]/45">
                  {active.status}
                </span>
              </div>
              <h3
                className="mt-2.5 font-bold uppercase leading-snug text-[#EEF2F6]"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
              >
                {active.title}
              </h3>
              <p
                className="mx-auto mt-2 max-w-prose font-medium leading-relaxed text-[#BBCCD7]/65"
                style={{ fontSize: 'clamp(0.8rem, 1.4vw, 0.95rem)' }}
              >
                {active.detail}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-center gap-2" aria-hidden>
            {CURRENTLY_DOING.map((item, i) => (
              <span
                key={item.title}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-6 bg-teal-400/90' : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
