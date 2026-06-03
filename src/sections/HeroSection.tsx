import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ContactButton } from '../components/ContactButton';
import portraitImg from '../assets/fazil.jpeg';
import { PROJECTS } from '../data/projects';
import { PROFILE } from '../data/profile';

const ease = [0.25, 0.1, 0.25, 1] as const;

/** Dark navy for portrait side */
const NAVY = '#0a1020';
const NAVY_MID = '#0f172a';
/** Cool white — cyan / indigo tint, no slate gray */
const ICE = '#ecfeff';
const MIST = '#eef4ff';

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-[100dvh] flex-col overflow-x-clip pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]"
      style={{ backgroundColor: NAVY }}
    >
      <motion.div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <motion.div className="relative flex flex-1 flex-col lg:flex-row lg:items-stretch">
          {/* Left — crisp cyan-indigo panel, deep navy text */}
          <div
            className="relative order-2 flex flex-col justify-center px-5 py-10 pb-12 pt-8 sm:px-10 sm:py-12 lg:order-1 lg:w-[44%] lg:max-w-2xl lg:shrink-0 lg:py-16 lg:pl-12 xl:pl-16 xl:pr-10"
            style={{
              background: `linear-gradient(165deg, #ffffff 0%, ${ICE} 42%, ${MIST} 78%, #ede9fe 100%)`,
            }}
          >
            <motion.div
              className="pointer-events-none absolute inset-0 opacity-70"
              aria-hidden
              style={{
                background:
                  'radial-gradient(ellipse 80% 60% at 10% 15%, rgba(6, 182, 212, 0.18) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 90% 85%, rgba(139, 92, 246, 0.12) 0%, transparent 50%)',
              }}
            />

            <motion.div
              className="pointer-events-none absolute -left-1 top-[20%] z-0 select-none overflow-hidden lg:top-[24%]"
              aria-hidden
            >
              <span
                className="block whitespace-nowrap font-black uppercase leading-none tracking-[-0.06em] text-cyan-600/[0.07]"
                style={{ fontSize: 'clamp(3rem, 12vw, 7.5rem)' }}
              >
                Portfolio
              </span>
            </motion.div>

            <motion.div
              className="relative z-10 flex flex-col gap-8 sm:gap-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05, ease }}
            >
              <div className="flex flex-wrap gap-x-10 gap-y-3 rounded-2xl border border-cyan-200/70 bg-white/90 px-5 py-6 shadow-[0_16px_40px_-20px_rgba(6,182,212,0.25)] backdrop-blur-sm sm:px-6">
                <p>
                  <span className="block text-2xl font-light tabular-nums text-portfolio-ink-dark sm:text-3xl">
                    {PROJECTS.length}+
                  </span>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.14em] text-cyan-900/75">
                    Projects
                  </span>
                </p>
                <p>
                  <span className="block text-2xl font-light tabular-nums text-portfolio-ink-dark sm:text-3xl">
                    {PROFILE.cgpa.split(' / ')[0]}
                  </span>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.14em] text-cyan-900/75">
                    CGPA
                  </span>
                </p>
              </div>

              <div>
                <p
                  className="hero-heading-light font-extralight leading-[0.92] tracking-tight"
                  style={{ fontSize: 'clamp(3.5rem, 12vw, 7.25rem)' }}
                >
                  Hi.
                </p>
                <p className="mt-5 max-w-md text-lg font-normal leading-snug text-[#0c4a6e] sm:text-xl">
                  <span className="text-cyan-700/60">—</span> I{"\u2019"}m{' '}
                  <span className="font-semibold text-portfolio-ink-dark">{PROFILE.name}</span>, {PROFILE.role.toLowerCase()}.
                </p>
                <p className="mt-6 max-w-lg text-pretty text-base font-normal leading-relaxed text-indigo-900/80 sm:text-lg">
                  {PROFILE.tagline}
                </p>
              </div>

              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                <ContactButton variant="light" />
                <a
                  href="#about"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-800/80 transition-colors hover:text-cyan-600 lg:hidden"
                >
                  About me
                  <ChevronDown className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                </a>
              </div>
            </motion.div>

            <div
              className="pointer-events-none absolute inset-y-0 -right-px z-20 hidden w-16 bg-gradient-to-r from-transparent to-[#0a1020] lg:block xl:w-24"
              aria-hidden
            />
          </div>

          {/* Right — dark navy, portrait blended in */}
          <motion.div
            className="relative order-1 min-h-[min(50svh,420px)] w-full shrink-0 sm:min-h-[min(58vh,520px)] md:min-h-[min(62vh,580px)] lg:absolute lg:inset-y-0 lg:right-0 lg:min-h-[100dvh] lg:w-[min(56%,820px)] lg:max-w-none"
            style={{ backgroundColor: NAVY }}
          >
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden
              style={{
                background: [
                  `radial-gradient(ellipse 90% 80% at 72% 35%, rgba(6, 182, 212, 0.16) 0%, transparent 55%)`,
                  `radial-gradient(ellipse 80% 70% at 40% 90%, rgba(139, 92, 246, 0.14) 0%, transparent 50%)`,
                  `linear-gradient(105deg, ${ICE} 0%, transparent 20%, ${NAVY} 44%)`,
                ].join(', '),
              }}
            />

            <motion.div
              className="relative h-full w-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.1, ease }}
            >
              <img
                src={portraitImg}
                alt={PROFILE.name}
                width={840}
                height={1120}
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover object-[center_14%] lg:object-[center_10%]"
                style={{
                  filter: 'grayscale(1) contrast(1.08) brightness(0.9) sepia(0.06) hue-rotate(195deg) saturate(0.95)',
                  maskImage:
                    'linear-gradient(to right, transparent 0%, black 22%, black 88%, transparent 100%), linear-gradient(to bottom, black 0%, black 78%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to right, transparent 0%, black 22%, black 88%, transparent 100%), linear-gradient(to bottom, black 0%, black 78%, transparent 100%)',
                  maskComposite: 'intersect',
                  WebkitMaskComposite: 'source-in',
                }}
              />

              <motion.div
                className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-65"
                style={{
                  background: `linear-gradient(125deg, ${ICE} 0%, transparent 30%, ${NAVY_MID} 58%, ${NAVY} 100%)`,
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a1020] via-transparent to-[#0a1020]/25"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-[min(42%,280px)] bg-gradient-to-r from-[#ecfeff] via-[#0a1020]/88 to-transparent lg:from-[#eef4ff]/95"
                aria-hidden
              />

              <div
                className="pointer-events-none absolute inset-y-[8%] left-0 w-px bg-gradient-to-b from-transparent via-cyan-400/45 to-transparent"
                aria-hidden
              />
            </motion.div>
          </motion.div>
        </motion.div>

        <a
          href="#about"
          className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-20 hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/70 transition-colors hover:text-cyan-300 lg:inline-flex lg:bottom-[max(2.5rem,env(safe-area-inset-bottom))] lg:right-[max(2.5rem,env(safe-area-inset-right))]"
        >
          Scroll down
          <ChevronDown className="h-4 w-4" strokeWidth={2} aria-hidden />
        </a>
      </motion.div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-24 bg-gradient-to-b from-transparent to-portfolio-light sm:h-28"
        aria-hidden
      />
    </section>
  );
}
