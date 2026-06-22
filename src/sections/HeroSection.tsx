import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useMemo } from 'react';
import { ChevronDown, Mail } from 'lucide-react';
import { ContactButton } from '../components/ContactButton';
import { HeroQuickLinks } from '../components/HeroQuickLinks';
import portraitImg from '../assets/fazil.jpeg';
import { PROJECTS } from '../data/projects';
import { PROFILE } from '../data/profile';

const ease = [0.25, 0.1, 0.25, 1] as const;
const smoothEase = [0.22, 1, 0.36, 1] as const;

const headerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

const headerItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: smoothEase },
  },
};

/** Mobile hero load-in — slower letter reveal + portrait curtain rise. */
const MOBILE_LETTER_STAGGER = 0.11;

const mobileIntroRootVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.28, delayChildren: 0.35 },
  },
};

const mobileGreetingVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: smoothEase },
  },
};

const mobileNameRowVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: MOBILE_LETTER_STAGGER, delayChildren: 0.16 },
  },
};

const mobileLetterVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 185, damping: 26, mass: 1.05 },
  },
};

const mobileNameDividerVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: smoothEase },
  },
};

const mobileNameTaglineVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: smoothEase },
  },
};

const mobilePortraitShellVariants: Variants = {
  hidden: {
    opacity: 0,
    clipPath: 'inset(100% 0 0 0 round 1rem)',
  },
  visible: {
    opacity: 1,
    clipPath: 'inset(0% 0 0 0 round 1rem)',
    transition: { duration: 1.05, ease: smoothEase, delay: 0.85 },
  },
};

const mobilePortraitImageVariants: Variants = {
  hidden: { scale: 1.1 },
  visible: {
    scale: 1,
    transition: { duration: 1.2, ease: smoothEase, delay: 0.85 },
  },
};

function HeroEmailLink({ variant = 'dark', className = '' }: { variant?: 'dark' | 'light'; className?: string }) {
  const isLight = variant === 'light';

  return (
    <a
      href={`mailto:${PROFILE.email}`}
      className={`group flex max-w-full items-center justify-center gap-2 transition-colors duration-200 ${className} ${
        isLight
          ? 'text-sm font-medium text-neutral-600 hover:text-neutral-900 sm:text-base'
          : 'text-sm font-medium tracking-[0.01em] text-[color-mix(in_srgb,var(--surface-accent)_88%,transparent)] hover:text-[#48E5C2] sm:text-base'
      }`}
    >
      <Mail
        className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
          isLight
            ? 'h-4 w-4 text-neutral-500 group-hover:text-neutral-800 sm:h-[1.125rem] sm:w-[1.125rem]'
            : 'h-4 w-4 text-[#48E5C2] sm:h-[1.125rem] sm:w-[1.125rem]'
        }`}
        strokeWidth={2}
        aria-hidden
      />
      <span className="truncate">{PROFILE.email}</span>
    </a>
  );
}

/** Full-height bridge at the text/image boundary — wide, soft fade. */
const SEAM_BLEND =
  'linear-gradient(to right, #f2f1ef 0%, #f2f1ef 14%, rgba(242,241,239,0.98) 28%, rgba(242,241,239,0.92) 38%, rgba(242,241,239,0.78) 48%, rgba(242,241,239,0.58) 58%, rgba(242,241,239,0.36) 68%, rgba(242,241,239,0.16) 78%, rgba(242,241,239,0.04) 88%, transparent 96%)';

const PORTRAIT_LEFT_WASH =
  'linear-gradient(to right, #f2f1ef 0%, rgba(242,241,239,0.88) 35%, rgba(242,241,239,0.35) 65%, transparent 100%)';

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const mobileNameChars = useMemo(() => PROFILE.name.split(''), []);

  return (
    <section className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-[var(--surface-dark)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] font-hero text-[var(--surface-accent)] lg:bg-[#f2f1ef] lg:text-neutral-900">
      {/* Giant watermark — desktop only */}
      <div
        className="pointer-events-none absolute inset-0 hidden select-none items-center justify-center overflow-hidden lg:flex"
        aria-hidden
      >
        <span
          className="whitespace-nowrap font-hero font-black uppercase leading-none tracking-[-0.04em] text-[color-mix(in_srgb,var(--surface-accent-strong)_14%,transparent)] lg:text-neutral-900/[0.045]"
          style={{ fontSize: 'clamp(4.5rem, 24vw, 20rem)' }}
        >
          Portfolio
        </span>
      </div>

      {/* Desktop portrait — full hero height, fixed right column */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden h-full w-[min(58%,820px)] lg:block">
        <motion.div
          className="relative h-full w-full"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.08, ease }}
        >
          <img
            src={portraitImg}
            alt={PROFILE.name}
            width={840}
            height={1120}
            draggable={false}
            className="hero-portrait-edge h-full w-full object-cover object-[center_12%] lg:object-[68%_8%]"
            style={{ filter: 'grayscale(1) contrast(1.05) brightness(1.02)' }}
          />
          <div
            className="absolute inset-y-0 left-0 w-[48%]"
            style={{ background: PORTRAIT_LEFT_WASH }}
            aria-hidden
          />
        </motion.div>
        <div
          className="absolute inset-x-0 bottom-0 z-10"
          style={{
            height: 'clamp(10rem, 28vw, 18rem)',
            background:
              'linear-gradient(to top, #0C0C0C 0%, rgba(12,12,12,0.88) 35%, rgba(12,12,12,0.45) 65%, transparent 100%)',
          }}
          aria-hidden
        />
      </div>

      {/* Seam blend — spans entire hero including header zone */}
      <div
        className="pointer-events-none absolute inset-y-0 z-[12] hidden lg:block"
        style={{
          left: 'calc(100% - min(58vw, 820px) - 10rem)',
          width: 'clamp(18rem, 42vw, 30rem)',
          background: SEAM_BLEND,
        }}
        aria-hidden
      />

      {/* Editorial layout: copy + oversized portrait (desktop image bleeds right) */}
      <div className="relative z-10 flex min-h-[100dvh] w-full flex-1 flex-col font-hero">
        <motion.header
          className="relative z-30 hidden shrink-0 px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 sm:px-10 sm:pb-4 lg:absolute lg:inset-x-0 lg:top-0 lg:block lg:px-10 lg:pb-12 lg:pt-5 xl:pl-16 xl:pr-10"
          initial={reduceMotion ? false : { opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: smoothEase }}
        >
          <motion.div
            className="flex w-full max-w-[calc(100vw-min(58vw,820px)-2.5rem)] flex-col gap-4"
            variants={reduceMotion ? undefined : headerContainerVariants}
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
          >
            <motion.div
              variants={reduceMotion ? undefined : headerItemVariants}
              className="relative z-40 hidden min-w-0 flex-col gap-1.5 sm:flex"
            >
              <p className="hidden font-hero text-base font-extrabold uppercase tracking-[0.12em] text-[var(--surface-accent)] sm:block sm:text-xl md:text-2xl lg:text-neutral-900">
                {PROFILE.name}
              </p>
              <p className="max-w-[min(100%,20rem)] text-pretty text-[11px] font-semibold leading-snug text-[color-mix(in_srgb,var(--surface-accent)_82%,transparent)] sm:max-w-[21rem] sm:text-sm lg:max-w-[min(20rem,calc(100vw-min(58vw,820px)-4rem))] lg:text-neutral-900 lg:[text-shadow:0_1px_14px_rgba(242,241,239,0.95),0_0_2px_rgba(242,241,239,0.8)] xl:max-w-[22rem]">
                {PROFILE.headerSubtitle}
              </p>
            </motion.div>
            <motion.div
              variants={reduceMotion ? undefined : headerItemVariants}
              className="hidden w-full min-w-0 shrink-0 sm:block"
            >
              <div className="flex w-full max-w-[min(24rem,calc(100vw-min(58vw,820px)-3rem))] flex-col gap-3 rounded-2xl bg-[#f2f1ef]/95 px-3.5 py-3 shadow-[0_10px_40px_-10px_rgba(242,241,239,1),0_2px_12px_rgba(23,23,23,0.06)] ring-1 ring-white/60">
                <HeroQuickLinks variant="light" className="w-full" />
                <HeroEmailLink variant="light" className="w-full justify-center sm:justify-start" />
              </div>
            </motion.div>
          </motion.div>
        </motion.header>

        <div className="relative flex min-h-0 flex-1 flex-col pt-[max(1.25rem,calc(env(safe-area-inset-top)+0.5rem))] sm:pt-[max(1.5rem,calc(env(safe-area-inset-top)+0.5rem))] lg:flex-row lg:items-stretch lg:pt-60">
          {/* Mobile name — first below header (max-lg only) */}
          <motion.div
            className="relative z-20 order-1 px-5 pt-1 pb-0 font-hero text-center sm:px-10 sm:pt-2 lg:hidden"
            variants={reduceMotion ? undefined : mobileIntroRootVariants}
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
          >
            <div className="sm:hidden">
              <motion.p
                variants={reduceMotion ? undefined : mobileGreetingVariants}
                className="text-[0.9375rem] font-normal tracking-[0.04em] text-[var(--surface-accent)]"
              >
                Hi, I{'\u2019'}m
              </motion.p>
              <motion.p
                variants={reduceMotion ? undefined : mobileNameRowVariants}
                className="relative mt-1.5 flex flex-wrap items-baseline justify-center font-bold leading-[1.05] tracking-[-0.02em] text-[var(--surface-accent-strong)]"
                style={{ fontSize: 'clamp(2.25rem, 9vw, 4.75rem)' }}
              >
                <motion.span
                  variants={reduceMotion ? undefined : mobileLetterVariants}
                  className="inline-block text-[#48E5C2]"
                  aria-hidden
                >
                  {'<'}
                </motion.span>
                {mobileNameChars.map((char, i) => {
                  const display = char === ' ' ? '\u00A0' : char;
                  return (
                    <motion.span
                      key={`mobile-name-${i}-${char}`}
                      variants={reduceMotion ? undefined : mobileLetterVariants}
                      className={`inline-block ${char === ' ' ? 'w-[0.28em]' : ''}`}
                    >
                      {display}
                    </motion.span>
                  );
                })}
                <motion.span
                  variants={reduceMotion ? undefined : mobileLetterVariants}
                  className="inline-block text-[#48E5C2]"
                  aria-hidden
                >
                  {'/>'}
                </motion.span>
                <span className="sr-only">{PROFILE.name}</span>
              </motion.p>
              <motion.p
                variants={reduceMotion ? undefined : mobileNameTaglineVariants}
                className="mx-auto mt-2 max-w-[min(19rem,90vw)] text-sm font-normal leading-snug tracking-[0.02em] text-[color-mix(in_srgb,var(--surface-accent-strong)_92%,transparent)]"
              >
                {PROFILE.role}
              </motion.p>
              <motion.div
                variants={reduceMotion ? undefined : mobileNameDividerVariants}
                className="mx-auto mt-3 h-[2px] w-[min(12rem,78%)] origin-center rounded-full bg-gradient-to-r from-transparent via-[#48E5C2] to-transparent shadow-[0_0_12px_rgba(72,229,194,0.35)]"
                aria-hidden
              />
            </div>
            <motion.p
              variants={reduceMotion ? undefined : mobileGreetingVariants}
              className="hidden font-bold leading-[0.92] tracking-[-0.02em] text-[var(--surface-accent-strong)] sm:block"
              style={{ fontSize: 'clamp(3.5rem, 12vw, 7.25rem)' }}
            >
              Hi.
            </motion.p>
          </motion.div>

          {/* Mobile portrait — second on small screens */}
          <div className="relative order-2 flex w-full shrink-0 items-center justify-center px-5 pb-4 pt-0 sm:px-10 sm:pb-5 lg:hidden">
            <motion.div
              className="relative aspect-[3/4] w-full max-w-[min(260px,72vw)] overflow-hidden rounded-2xl border-2 border-[color-mix(in_srgb,var(--surface-border-light)_75%,#48E5C2)] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75),0_0_40px_-14px_rgba(72,229,194,0.22)] sm:max-w-[min(300px,68vw)]"
              variants={reduceMotion ? undefined : mobilePortraitShellVariants}
              initial={reduceMotion ? false : 'hidden'}
              animate="visible"
            >
              <motion.img
                src={portraitImg}
                alt={PROFILE.name}
                width={840}
                height={1120}
                draggable={false}
                variants={reduceMotion ? undefined : mobilePortraitImageVariants}
                className="h-full w-full object-cover object-[center_18%]"
                style={{ filter: 'grayscale(1) contrast(1.05) brightness(1.02)' }}
              />
            </motion.div>
          </div>

          {/* Mobile quick links — single row below portrait */}
          <motion.div
            className="relative z-20 order-3 w-full px-5 pt-1 pb-0 sm:px-10 lg:hidden"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: reduceMotion ? 0 : 1.55, ease }}
          >
            <HeroQuickLinks className="mx-auto w-full max-w-[min(340px,94vw)] sm:max-w-[min(380px,90vw)]" />
            <HeroEmailLink className="mx-auto mt-4 flex w-full max-w-[min(340px,94vw)] justify-center px-1 sm:mt-4.5 sm:max-w-[min(380px,90vw)]" />
          </motion.div>

          {/* Copy */}
          <div className="relative z-20 order-4 flex flex-col justify-center px-5 pb-12 pt-2 sm:px-10 sm:pt-3 lg:order-1 lg:w-[46%] lg:max-w-2xl lg:shrink-0 lg:py-16 lg:pl-12 lg:pt-16 xl:pl-16 xl:pr-8">
            <motion.div
              className="flex flex-col gap-5 sm:gap-8 max-lg:items-center max-lg:gap-4 max-lg:text-center lg:gap-10 lg:items-stretch lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05, ease }}
            >
              {/* Greeting — desktop only (mobile name is above portrait) */}
              <div className="hidden lg:order-2 lg:block">
                <p
                  className="font-extralight leading-[0.92] tracking-tight text-neutral-900"
                  style={{ fontSize: 'clamp(3.5rem, 12vw, 7.25rem)' }}
                >
                  Hi.
                </p>
                <p className="mt-5 max-w-md text-lg font-normal leading-snug text-neutral-600 sm:text-xl">
                  <span className="text-neutral-400">—</span> I{"\u2019"}m{' '}
                  <span className="font-semibold text-neutral-900">{PROFILE.name}</span>, {PROFILE.role.toLowerCase()}.
                </p>
              </div>

              {/* Stats — mobile: after portrait; desktop: first */}
              <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 border-b border-[var(--surface-border-subtle)] pb-8 text-sm text-[color-mix(in_srgb,var(--surface-accent)_58%,transparent)] max-lg:order-1 max-lg:border-b-0 max-lg:pb-0 lg:order-1 lg:justify-start lg:border-neutral-200/90 lg:border-b lg:pb-8 lg:text-neutral-500">
                <p className="max-lg:order-1 lg:order-2">
                  <span className="block text-2xl font-light tabular-nums text-[var(--surface-accent-strong)] sm:text-3xl lg:text-neutral-900">
                    {PROFILE.cgpa.split(' / ')[0]}
                  </span>
                  <span className="mt-1 block text-xs font-medium uppercase tracking-[0.14em] text-[var(--surface-accent-muted)] lg:text-neutral-400">CGPA</span>
                </p>
                <p className="max-lg:order-2 lg:order-1">
                  <span className="block text-2xl font-light tabular-nums text-[var(--surface-accent-strong)] sm:text-3xl lg:text-neutral-900">{PROJECTS.length}+</span>
                  <span className="mt-1 block text-xs font-medium uppercase tracking-[0.14em] text-[var(--surface-accent-muted)] lg:text-neutral-400">Projects</span>
                </p>
              </div>

              {/* About + tagline — mobile: after stats; desktop: with greeting block */}
              <div className="max-lg:order-2 lg:order-2">
                <div className="mt-0 flex justify-center lg:hidden">
                  <motion.a
                    href="#about"
                    className="group inline-flex items-center gap-2.5"
                    whileHover={reduceMotion ? undefined : { y: 2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  >
                    <span
                      className="h-px w-8 bg-[color-mix(in_srgb,var(--surface-accent)_58%,transparent)] transition-all duration-300 group-hover:w-11 group-hover:bg-[#48E5C2]"
                      aria-hidden
                    />
                    <span className="font-hero text-[11px] font-bold uppercase tracking-[0.26em] text-[var(--surface-accent-strong)] transition-colors duration-300 group-hover:text-[#48E5C2]">
                      About me
                    </span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--surface-border-subtle)] bg-[color-mix(in_srgb,var(--surface-accent)_10%,transparent)] transition-all duration-300 group-hover:border-[#48E5C2] group-hover:bg-[#48E5C2]">
                      <ChevronDown
                        className="h-3.5 w-3.5 text-[var(--surface-accent-strong)] transition-all duration-300 group-hover:translate-y-0.5 group-hover:text-[var(--surface-dark)]"
                        strokeWidth={2}
                        aria-hidden
                      />
                    </span>
                  </motion.a>
                </div>
                <p className="mx-auto mt-6 max-w-lg text-pretty text-base font-light leading-relaxed text-[color-mix(in_srgb,var(--surface-accent)_58%,transparent)] sm:text-lg lg:mx-0 lg:mt-6 lg:text-left lg:text-neutral-500">
                  {PROFILE.tagline}
                </p>
              </div>

              <div className="flex flex-col items-center gap-6 max-lg:order-3 sm:flex-row sm:items-center sm:gap-8 lg:order-3 lg:items-start">
                <ContactButton variant="light" href="#contact" className="max-lg:!hidden" />
                <ContactButton variant="dark" href="#contact" className="lg:!hidden" />
              </div>
            </motion.div>
          </div>
        </div>

        <a
          href="#about"
          className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-20 hidden items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 transition-colors hover:text-neutral-900 lg:inline-flex lg:bottom-[max(2.5rem,env(safe-area-inset-bottom))] lg:right-[max(2.5rem,env(safe-area-inset-right))]"
        >
          Scroll down
          <ChevronDown className="h-4 w-4" strokeWidth={2} aria-hidden />
        </a>
      </div>

      {/* Smooth fade into the next dark section — desktop / light hero only */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 hidden lg:block"
        style={{
          height: 'clamp(8rem, 22vw, 14rem)',
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(12,12,12,0.06) 18%, rgba(12,12,12,0.28) 42%, rgba(12,12,12,0.62) 68%, rgba(12,12,12,0.9) 88%, #0C0C0C 100%)',
        }}
        aria-hidden
      />
    </section>
  );
}
