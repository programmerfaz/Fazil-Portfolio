import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ContactButton } from '../components/ContactButton';
import portraitImg from '../assets/fazil.jpeg';
import { PROJECTS } from '../data/projects';
import { PROFILE } from '../data/profile';

const ease = [0.25, 0.1, 0.25, 1] as const;

export function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-x-clip bg-[#f2f1ef] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] text-neutral-900">
      {/* Giant watermark — reference-style depth */}
      <div
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden"
        aria-hidden
      >
        <span
          className="whitespace-nowrap font-black uppercase leading-none tracking-[-0.04em] text-neutral-900/[0.045]"
          style={{ fontSize: 'clamp(4.5rem, 24vw, 20rem)' }}
        >
          Portfolio
        </span>
      </div>

      {/* Editorial layout: copy + oversized portrait (desktop image bleeds right) */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="relative flex flex-1 flex-col lg:flex-row lg:items-stretch">
          {/* Copy */}
          <div className="order-2 flex flex-col justify-center px-5 py-10 pb-12 pt-6 sm:px-10 sm:py-12 lg:order-1 lg:w-[46%] lg:max-w-2xl lg:shrink-0 lg:py-16 lg:pl-12 xl:pl-16 xl:pr-8">
            <motion.div
              className="flex flex-col gap-8 sm:gap-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05, ease }}
            >
              <div className="flex flex-wrap gap-x-10 gap-y-3 border-b border-neutral-200/90 pb-8 text-sm text-neutral-500">
                <p>
                  <span className="block text-2xl font-light tabular-nums text-neutral-900 sm:text-3xl">{PROJECTS.length}+</span>
                  <span className="mt-1 block text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">Projects</span>
                </p>
                <p>
                  <span className="block text-2xl font-light tabular-nums text-neutral-900 sm:text-3xl">
                    {PROFILE.cgpa.split(' / ')[0]}
                  </span>
                  <span className="mt-1 block text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">CGPA</span>
                </p>
              </div>

              <div>
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
                <p className="mt-6 max-w-lg text-pretty text-base font-light leading-relaxed text-neutral-500 sm:text-lg">
                  {PROFILE.tagline}
                </p>
              </div>

              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                <ContactButton variant="light" />
                <a
                  href="#about"
                  className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 transition-colors hover:text-neutral-900 lg:hidden"
                >
                  About me
                  <ChevronDown className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Portrait — large; grayscale editorial */}
          <div className="relative order-1 h-[min(50svh,420px)] w-full shrink-0 overflow-hidden bg-neutral-200 sm:h-[min(58vh,520px)] md:h-[min(62vh,580px)] lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:min-h-[100dvh] lg:w-[min(58%,820px)] lg:max-w-none">
            <motion.div
              className="h-full w-full"
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
                className="h-full w-full object-cover object-[center_12%] lg:object-[center_8%]"
                style={{
                  filter: 'grayscale(1) contrast(1.05) brightness(1.02)',
                }}
              />
            </motion.div>
            {/* Soft blend into page on desktop left edge */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-[#f2f1ef] to-transparent lg:block xl:w-32"
              aria-hidden
            />
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

      {/* Smooth fade into the next dark section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-24 bg-gradient-to-b from-transparent via-[#0C0C0C]/55 to-[#0C0C0C] sm:h-28 md:h-32"
        aria-hidden
      />
    </section>
  );
}
