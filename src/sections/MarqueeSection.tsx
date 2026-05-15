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
        className={`relative block cursor-zoom-in text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BBCCD7] ${phoneFrame ? 'w-[200px] sm:w-[230px] md:w-[248px]' : ''}`}
        aria-label="View full-size preview"
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgba(187,204,215,0.22)_0%,rgba(118,33,176,0.12)_45%,transparent_72%)] opacity-50 blur-xl transition-opacity duration-500 group-hover:opacity-90"
          aria-hidden
        />
        <div className="relative">
          <div
            className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-[#D7E2EA]/35 via-[#7c3aed]/20 to-transparent opacity-70 transition duration-500 group-hover:opacity-100"
            aria-hidden
          />
          <motion.div
            className={`relative overflow-hidden rounded-3xl ring-1 ring-white/[0.08] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.06)] ${phoneFrame ? 'bg-[#0f0f11]' : ''}`}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.35, ease }}
          >
            <div
              className={
                phoneFrame
                  ? 'flex h-[270px] w-full items-center justify-center px-1.5 py-2 sm:px-2 sm:py-2.5'
                  : 'h-[270px] w-[420px]'
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
              className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0C0C0C]/0 transition-colors duration-300 group-hover:bg-[#0C0C0C]/25"
              aria-hidden
            >
              <span className="rounded-full border border-[#D7E2EA]/35 bg-[#0C0C0C]/75 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#D7E2EA] opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 sm:text-xs">
                View
              </span>
            </motion.div>
            <motion.div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0C0C0C]/50 via-transparent to-[#0C0C0C]/25 transition duration-500 ${phoneFrame ? 'opacity-25 group-hover:opacity-15' : 'opacity-60 group-hover:opacity-40'}`}
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
        className="absolute inset-0 bg-[#0C0C0C]/88 backdrop-blur-md"
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
          className="absolute -right-1 -top-11 flex h-10 w-10 items-center justify-center rounded-full border border-[#D7E2EA]/25 bg-[#141416]/90 text-[#D7E2EA] shadow-lg transition hover:border-[#D7E2EA]/45 hover:bg-[#1a1a1c] sm:-right-2 sm:-top-12"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <div className="overflow-hidden rounded-2xl border border-[#D7E2EA]/20 bg-[#0C0C0C] p-1.5 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.95)] sm:rounded-3xl sm:p-2">
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
      className="relative overflow-x-clip bg-[#0C0C0C] pb-14 pt-14 sm:pb-16 sm:pt-20 md:pb-20 md:pt-24"
      aria-label="Project highlights"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 90% 55% at 15% 40%, rgba(187, 204, 215, 0.09) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 85% 60%, rgba(118, 33, 176, 0.12) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(12, 12, 12, 0.95) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-10 text-center sm:px-8 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#BBCCD7]/75 sm:text-xs">Highlights</p>
          <h2 className="hero-heading mt-3 font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)' }}>
            Work in motion
          </h2>
          <p className="mx-auto mt-4 max-w-md text-pretty font-light leading-relaxed text-[#D7E2EA]/55" style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)' }}>
            A slow drift runs nonstop — scroll adds parallax, and tap any shot for a full preview.
          </p>
        </motion.div>
      </div>

      <div className="relative z-10">
        <div
          className="mx-auto"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
          }}
        >
          <div className="flex flex-col gap-5 md:gap-6">
            <div
              className="overflow-hidden pl-2 md:pl-4"
              style={{
                transform: `translate3d(${offset - 200}px, 0, 0)`,
                willChange: 'transform',
              }}
            >
              <div className="marquee-drift-right flex w-max gap-4 md:gap-5">
                {row1.map((item, i) => (
                  <MarqueeTile key={`r1-${i}`} image={item} index={i} onOpen={openPreview} />
                ))}
              </div>
            </div>
            <div
              className="overflow-hidden pr-2 md:pr-4"
              style={{
                transform: `translate3d(${-(offset - 200)}px, 0, 0)`,
                willChange: 'transform',
              }}
            >
              <div className="marquee-drift-left flex w-max gap-4 md:gap-5">
                {row2.map((item, i) => (
                  <MarqueeTile key={`r2-${i}`} image={item} index={i} onOpen={openPreview} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-20 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/40 to-transparent sm:h-24" aria-hidden />

      <AnimatePresence>{activeSrc ? <MarqueeLightbox src={activeSrc} onClose={closePreview} /> : null}</AnimatePresence>
    </section>
  );
}
