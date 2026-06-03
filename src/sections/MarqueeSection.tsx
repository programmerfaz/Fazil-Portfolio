import { useCallback, useEffect, useMemo, useRef, useState, type SyntheticEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { pickMarqueeRows, tripleImages, type MarqueeImage } from '../data/marqueeWorkImages';

const ease = [0.25, 0.1, 0.25, 1] as const;

type MarqueeTileProps = {
  image: MarqueeImage;
  index: number;
  onOpen: (src: string) => void;
};

/** Tall phone-style frame (e.g. 9:19); avoids 4:3 portrait photos (~1.33) */
const PHONE_ASPECT_MIN = 1.52;

function MarqueeTile({ image, index, onOpen }: MarqueeTileProps) {
  const { src, layout, desktopLock } = image;
  const [tallPhoneAspect, setTallPhoneAspect] = useState(false);

  const onImgLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    if (desktopLock) return;
    const { naturalWidth: nw, naturalHeight: nh } = e.currentTarget;
    if (nw <= 0) return;
    if (nh / nw >= PHONE_ASPECT_MIN) setTallPhoneAspect(true);
  };

  const phoneFrame = layout === 'mobile' || tallPhoneAspect;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '80px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.03, 0.35), ease }}
      className="group relative shrink-0"
    >
      <motion.button
        type="button"
        onClick={() => onOpen(src)}
        className={`relative block cursor-zoom-in text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-portfolio-cyan ${phoneFrame ? 'w-[min(340px,calc(100vw-12px))] sm:w-[230px] md:w-[248px]' : ''}`}
        aria-label="View full-size preview"
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.18)_0%,rgba(139,92,246,0.14)_45%,transparent_72%)] opacity-50 blur-xl transition-opacity duration-500 group-hover:opacity-90"
          aria-hidden
        />
        <div className="relative">
          <div
            className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-portfolio-cyan/30 via-portfolio-purple/25 to-transparent opacity-70 transition duration-500 group-hover:opacity-100"
            aria-hidden
          />
          <motion.div
            className={`relative overflow-hidden rounded-3xl border border-portfolio shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75),inset_0_1px_0_0_rgba(255,255,255,0.05)] ${phoneFrame ? 'bg-portfolio-surface' : ''}`}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.35, ease }}
          >
            <div
              className={
                phoneFrame
                  ? 'flex h-[min(270px,42svh)] w-full items-center justify-center px-1.5 py-2 sm:h-[270px] sm:px-2 sm:py-2.5'
                  : 'h-[min(270px,42svh)] w-[min(420px,calc(100vw-12px))] sm:h-[270px] sm:w-[min(420px,calc(100vw-3rem))]'
              }
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                width={phoneFrame ? 260 : 420}
                height={270}
                draggable={false}
                onLoad={onImgLoad}
                className={
                  phoneFrame
                    ? 'max-h-full max-w-full object-contain object-center transition duration-700 ease-out group-hover:brightness-[1.05]'
                    : 'h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.045] group-hover:brightness-[1.05]'
                }
              />
            </div>
            <motion.div
              className="pointer-events-none absolute inset-0 flex items-center justify-center bg-portfolio-bg/0 transition-colors duration-300 group-hover:bg-portfolio-bg/30"
              aria-hidden
            >
              <span className="rounded-full border border-portfolio bg-portfolio-surface/80 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-portfolio-ink opacity-0 shadow-glow-cyan backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 sm:text-xs">
                View
              </span>
            </motion.div>
            <motion.div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-portfolio-bg/55 via-transparent to-portfolio-bg/25 transition duration-500 ${phoneFrame ? 'opacity-25 group-hover:opacity-15' : 'opacity-60 group-hover:opacity-40'}`}
              aria-hidden
            />
          </motion.div>
        </div>
      </motion.button>
    </motion.div>
  );
}

type MarqueeLightboxProps = {
  src: string;
  onClose: () => void;
};

function MarqueeLightbox({ src, onClose }: MarqueeLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Project preview"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease }}
    >
      <motion.button
        type="button"
        aria-label="Close preview"
        className="absolute inset-0 bg-portfolio-bg/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="relative z-[1] w-full max-w-5xl"
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.35, ease }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute -right-1 -top-11 flex h-10 w-10 items-center justify-center rounded-full border border-portfolio bg-portfolio-surface/95 text-portfolio-ink shadow-lg transition hover:border-portfolio-cyan/40 hover:bg-portfolio-card sm:-right-2 sm:-top-12"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <div className="overflow-hidden rounded-2xl border border-portfolio bg-portfolio-bg p-1.5 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.85),0_0_60px_-24px_rgba(6,182,212,0.15)] sm:rounded-3xl sm:p-2">
          <img
            src={src}
            alt="Project preview"
            className="max-h-[min(82vh,900px)] w-full rounded-xl object-contain sm:rounded-2xl"
          />
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

export function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const [activeSrc, setActiveSrc] = useState<string | null>(null);

  const [row1, row2] = useMemo(() => {
    const [a, b] = pickMarqueeRows();
    return [tripleImages(a), tripleImages(b)] as const;
  }, []);

  const openPreview = useCallback((src: string) => {
    setActiveSrc(src);
  }, []);

  const closePreview = useCallback(() => {
    setActiveSrc(null);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const factor = window.innerWidth < 640 ? 0.12 : 0.3;
      const y = (window.scrollY - sectionTop + window.innerHeight) * factor;
      setOffset(y);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (row1.length === 0 && row2.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-x-clip bg-portfolio-light pb-14 pt-10 sm:pb-16 sm:pt-14 md:pb-20 md:pt-16"
      aria-label="Project highlights"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 90% 55% at 15% 40%, rgba(6, 182, 212, 0.06) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 85% 60%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-10 text-center sm:px-8 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-portfolio-muted-dark sm:text-xs">Highlights</p>
          <h2 className="hero-heading-light mt-3 font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)' }}>
            Work in motion
          </h2>
          <p className="mx-auto mt-4 max-w-md text-pretty font-light leading-relaxed text-portfolio-muted-dark" style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)' }}>
            A slow drift runs nonstop — scroll adds parallax, and tap any shot for a full preview.
          </p>
        </motion.div>
      </div>

      <div className="relative z-10">
        <div className="marquee-edge-fade mx-auto w-full">
          <div className="flex flex-col gap-3 sm:gap-5 md:gap-6">
            <div
              className="overflow-hidden max-sm:pl-0 sm:pl-2 md:pl-4"
              style={{
                transform: `translate3d(${offset - 200}px, 0, 0)`,
                willChange: 'transform',
              }}
            >
              <div className="marquee-drift-right flex w-max gap-3 sm:gap-4 md:gap-5">
                {row1.map((item, i) => (
                  <MarqueeTile key={`r1-${i}`} image={item} index={i} onOpen={openPreview} />
                ))}
              </div>
            </div>
            <div
              className="overflow-hidden max-sm:pr-0 sm:pr-2 md:pr-4"
              style={{
                transform: `translate3d(${-(offset - 200)}px, 0, 0)`,
                willChange: 'transform',
              }}
            >
              <div className="marquee-drift-left flex w-max gap-3 sm:gap-4 md:gap-5">
                {row2.map((item, i) => (
                  <MarqueeTile key={`r2-${i}`} image={item} index={i} onOpen={openPreview} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-20 bg-gradient-to-t from-portfolio-light-alt to-transparent sm:h-24" aria-hidden />

      <AnimatePresence>{activeSrc ? <MarqueeLightbox src={activeSrc} onClose={closePreview} /> : null}</AnimatePresence>
    </section>
  );
}
