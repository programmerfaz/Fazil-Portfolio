import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useMemo } from 'react';
import { ChevronDown, Mail } from 'lucide-react';
import fazilPhoto from '../assets/fazil.jpeg';
import { ContactButton } from '../components/ContactButton';
import { HeroQuickLinks } from '../components/HeroQuickLinks';
import { PROJECTS } from '../data/projects';
import { PROFILE } from '../data/profile';

const ease = [0.25, 0.1, 0.25, 1] as const;
const smoothEase = [0.22, 1, 0.36, 1] as const;

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

function HeroEmailLink({ className = '', align = 'center' }: { className?: string; align?: 'center' | 'start' }) {
  return (
    <a
      href={`mailto:${PROFILE.email}`}
      className={`group flex max-w-full items-center gap-2 text-sm font-medium tracking-[0.01em] text-[color-mix(in_srgb,var(--surface-accent)_92%,transparent)] transition-colors duration-200 hover:text-[#48E5C2] sm:text-base ${
        align === 'start' ? 'justify-start' : 'justify-center'
      } ${className}`}
    >
      <Mail
        className="h-4 w-4 shrink-0 text-[#48E5C2] transition-transform duration-200 group-hover:scale-110 sm:h-[1.125rem] sm:w-[1.125rem]"
        strokeWidth={2}
        aria-hidden
      />
      <span className="break-all sm:break-normal">{PROFILE.email}</span>
    </a>
  );
}

function HeroStats({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-x-10 gap-y-2 text-sm ${className}`}>
      <p>
        <span className="block text-xl font-light tabular-nums text-[var(--surface-accent-strong)] sm:text-2xl lg:text-[1.65rem]">
          {PROFILE.cgpa.split(' / ')[0]}
        </span>
        <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--surface-accent-muted)] sm:text-xs">
          CGPA
        </span>
      </p>
      <p>
        <span className="block text-xl font-light tabular-nums text-[var(--surface-accent-strong)] sm:text-2xl lg:text-[1.65rem]">
          {PROJECTS.length}+
        </span>
        <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--surface-accent-muted)] sm:text-xs">
          Projects
        </span>
      </p>
    </div>
  );
}

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const mobileNameChars = useMemo(() => PROFILE.name.split(''), []);

  return (
    <section className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-[#0a1014] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] font-hero text-[var(--surface-accent)]">
      {/* Atmospheric backdrop */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 78% 42%, rgba(72, 229, 194, 0.14) 0%, transparent 58%),
            radial-gradient(ellipse 55% 50% at 18% 30%, rgba(72, 140, 160, 0.1) 0%, transparent 55%),
            linear-gradient(165deg, #0e161c 0%, #0a1014 42%, #0c1218 100%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] hidden lg:block"
        aria-hidden
        style={{
          background:
            'linear-gradient(90deg, rgba(10,16,20,0.72) 0%, rgba(10,16,20,0.28) 40%, transparent 68%)',
        }}
      />

      {/* ——— Mobile / tablet: centered stack ——— */}
      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-lg flex-1 flex-col items-center justify-center px-5 py-[max(1.25rem,calc(env(safe-area-inset-top)+0.75rem))] pb-[max(5.5rem,calc(env(safe-area-inset-bottom)+4.5rem))] sm:max-w-xl sm:px-8 lg:hidden">
        <motion.div
          className="relative z-20 w-full shrink-0 text-center"
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
              className="relative mt-1 flex flex-wrap items-baseline justify-center font-bold leading-[1.05] tracking-[-0.02em] text-[var(--surface-accent-strong)]"
              style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)' }}
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
              className="mx-auto mt-1.5 max-w-[min(19rem,90vw)] text-sm font-normal leading-snug tracking-[0.02em] text-[color-mix(in_srgb,var(--surface-accent-strong)_92%,transparent)]"
            >
              {PROFILE.role}
            </motion.p>
            <motion.div
              variants={reduceMotion ? undefined : mobileNameDividerVariants}
              className="mx-auto mt-2.5 h-[2px] w-[min(12rem,78%)] origin-center rounded-full bg-gradient-to-r from-transparent via-[#48E5C2] to-transparent shadow-[0_0_12px_rgba(72,229,194,0.35)]"
              aria-hidden
            />
          </div>
          <motion.p
            variants={reduceMotion ? undefined : mobileGreetingVariants}
            className="hidden font-bold leading-[0.92] tracking-[-0.02em] text-[var(--surface-accent-strong)] sm:block"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 4.5rem)' }}
          >
            Hi.
          </motion.p>
          <motion.p
            variants={reduceMotion ? undefined : mobileNameTaglineVariants}
            className="mx-auto mt-1.5 hidden max-w-md text-pretty text-sm font-medium leading-snug text-[color-mix(in_srgb,var(--surface-accent)_80%,transparent)] sm:block"
          >
            This is {PROFILE.name}
          </motion.p>
        </motion.div>

        <div className="relative flex w-full shrink-0 items-center justify-center py-2 sm:py-3">
          <motion.div
            className="relative h-[min(38dvh,260px)] w-full max-w-[min(380px,92vw)] overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--surface-border-light)_40%,#48E5C2)] bg-[linear-gradient(160deg,#1a2a30_0%,#121c22_55%,#0e161c_100%)] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8),0_0_36px_-14px_rgba(72,229,194,0.2)] sm:h-[min(40dvh,300px)]"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: reduceMotion ? 0 : 0.5, ease: smoothEase }}
          >
            <img
              src={fazilPhoto}
              alt={PROFILE.name}
              className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
              draggable={false}
            />
          </motion.div>
        </div>

        <motion.div
          className="relative z-20 w-full shrink-0"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: reduceMotion ? 0 : 1.2, ease }}
        >
          <HeroQuickLinks className="mx-auto w-full max-w-[min(340px,94vw)] sm:max-w-[360px]" />
          <HeroEmailLink className="mx-auto mt-3 flex w-full max-w-[min(340px,94vw)] px-1 sm:max-w-[360px]" />
        </motion.div>

        <motion.div
          className="mt-4 flex w-full shrink-0 flex-col items-center gap-3.5 text-center sm:mt-5 sm:gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: reduceMotion ? 0 : 1.35, ease }}
        >
          <HeroStats className="justify-center" />
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
          <p className="max-w-md text-pretty text-sm font-light leading-relaxed text-[color-mix(in_srgb,var(--surface-accent)_72%,transparent)] [text-shadow:0_1px_12px_rgba(12,12,12,0.9)]">
            {PROFILE.tagline}
          </p>
          <ContactButton variant="dark" href="#contact" />
        </motion.div>
      </div>

      {/* ——— Desktop: copy left + portrait right — fits one viewport ——— */}
      <div className="relative z-10 mx-auto hidden min-h-[100dvh] w-full max-w-6xl flex-1 grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-center gap-8 px-10 py-10 xl:gap-12 xl:px-14 lg:grid">
        <motion.div
          className="relative flex min-w-0 flex-col items-start justify-center gap-4 pr-4 xl:gap-5"
          initial={reduceMotion ? false : { opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: smoothEase }}
        >
          {/* Soft local wash behind copy */}
          <div
            className="pointer-events-none absolute -inset-y-6 -left-6 right-8 rounded-3xl"
            aria-hidden
            style={{
              background:
                'radial-gradient(ellipse 90% 80% at 20% 50%, rgba(12,12,12,0.55) 0%, rgba(12,12,12,0.2) 55%, transparent 100%)',
            }}
          />
          <div className="relative z-[2]">
            <p
              className="font-bold leading-[0.9] tracking-[-0.03em] text-[var(--surface-accent-strong)]"
              style={{ fontSize: 'clamp(3.25rem, 6.5vw, 5.5rem)' }}
            >
              Hi.
            </p>
            <p className="mt-2 text-lg font-medium text-[color-mix(in_srgb,var(--surface-accent)_90%,transparent)] xl:text-xl">
              This is {PROFILE.name}
            </p>
            <p className="mt-1.5 max-w-lg text-sm font-medium leading-snug text-[color-mix(in_srgb,var(--surface-accent)_65%,transparent)] xl:text-[0.95rem]">
              {PROFILE.headerSubtitle}
            </p>
          </div>

          <div className="relative z-[2] w-full max-w-[22rem]">
            <HeroQuickLinks className="w-full" />
            <HeroEmailLink align="start" className="mt-3 w-full" />
          </div>

          <HeroStats className="relative z-[2]" />

          <div className="relative z-[2] max-w-md">
            <a
              href="#about"
              className="group inline-flex items-center gap-2.5"
            >
              <span
                className="h-px w-8 bg-[color-mix(in_srgb,var(--surface-accent)_50%,transparent)] transition-all duration-300 group-hover:w-11 group-hover:bg-[#48E5C2]"
                aria-hidden
              />
              <span className="font-hero text-[11px] font-bold uppercase tracking-[0.26em] text-[var(--surface-accent-strong)] transition-colors duration-300 group-hover:text-[#48E5C2]">
                About me
              </span>
              <ChevronDown
                className="h-3.5 w-3.5 text-[var(--surface-accent-muted)] transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-[#48E5C2]"
                strokeWidth={2}
                aria-hidden
              />
            </a>
            <p className="relative mt-3 text-pretty text-base font-light leading-relaxed text-[color-mix(in_srgb,var(--surface-accent)_88%,transparent)] xl:text-[1.05rem]">
              {PROFILE.tagline}
            </p>
          </div>

          <div className="relative z-[2]">
            <ContactButton variant="dark" href="#contact" />
          </div>
        </motion.div>

        <motion.div
          className="relative flex h-[min(78dvh,560px)] min-h-0 w-full items-center justify-center lg:justify-end"
          initial={reduceMotion ? false : { opacity: 0, x: 22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: reduceMotion ? 0 : 0.12, ease: smoothEase }}
        >
          <div className="relative h-full w-full max-w-xl overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--surface-border-light)_40%,#48E5C2)] bg-[linear-gradient(160deg,#1a2a30_0%,#121c22_55%,#0e161c_100%)] shadow-[0_28px_80px_-28px_rgba(0,0,0,0.85),0_0_40px_-18px_rgba(72,229,194,0.22)]">
            <img
              src={fazilPhoto}
              alt={PROFILE.name}
              className="absolute inset-0 h-full w-full object-cover object-[center_18%] hero-portrait-edge"
              draggable={false}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
