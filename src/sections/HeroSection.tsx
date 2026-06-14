import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, FileText, Linkedin } from 'lucide-react';
import { ContactButton } from '../components/ContactButton';
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

const linkButtonMotion = {
  whileHover: { y: -2, scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { type: 'spring', stiffness: 420, damping: 28 },
} as const;

/** Full-height bridge at the text/image boundary — wide, soft fade. */
const SEAM_BLEND =
  'linear-gradient(to right, #f2f1ef 0%, #f2f1ef 14%, rgba(242,241,239,0.98) 28%, rgba(242,241,239,0.92) 38%, rgba(242,241,239,0.78) 48%, rgba(242,241,239,0.58) 58%, rgba(242,241,239,0.36) 68%, rgba(242,241,239,0.16) 78%, rgba(242,241,239,0.04) 88%, transparent 96%)';

const PORTRAIT_LEFT_WASH =
  'linear-gradient(to right, #f2f1ef 0%, rgba(242,241,239,0.88) 35%, rgba(242,241,239,0.35) 65%, transparent 100%)';

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const whatsappHref = `https://wa.me/${PROFILE.phoneWhatsappDigits}?text=${encodeURIComponent(PROFILE.whatsappPrefillMessage)}`;

  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#f2f1ef] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] text-neutral-900">
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
      <div className="relative z-10 flex min-h-[100dvh] flex-1 flex-col">
        <motion.header
          className="absolute inset-x-0 top-0 z-30 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 pt-4 pb-2 sm:px-10 sm:pt-5 sm:pb-12 lg:pl-12 xl:pl-16 xl:pr-10"
          initial={reduceMotion ? false : { opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: smoothEase }}
        >
          <motion.div
            className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6 sm:gap-y-3"
            variants={reduceMotion ? undefined : headerContainerVariants}
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
          >
            <motion.div
              variants={reduceMotion ? undefined : headerItemVariants}
              className="relative z-40 hidden min-w-0 flex-col gap-1 sm:flex lg:max-w-[42%]"
            >
              <p className="hidden font-display text-base font-extrabold uppercase tracking-[0.12em] text-neutral-900 sm:block sm:text-xl md:text-2xl">
                {PROFILE.name}
              </p>
              <p
                className="text-[11px] font-semibold leading-snug text-neutral-900 sm:text-sm"
                style={{ textShadow: '0 1px 14px rgba(242, 241, 239, 0.95), 0 0 2px rgba(242, 241, 239, 0.8)' }}
              >
                {PROFILE.headerSubtitle}
              </p>
            </motion.div>
            <motion.div
              variants={reduceMotion ? undefined : headerItemVariants}
              className="mx-auto w-fit shrink-0 sm:ml-auto sm:mr-0 lg:-translate-x-8 lg:translate-y-0.5 xl:-translate-x-12"
            >
              <div className="rounded-2xl bg-[#f2f1ef]/95 px-2.5 py-2.5 shadow-[0_10px_40px_-10px_rgba(242,241,239,1),0_2px_12px_rgba(23,23,23,0.06)] backdrop-blur-md ring-1 ring-white/60 sm:px-3.5 sm:py-3 max-lg:shadow-[0_8px_28px_-6px_rgba(242,241,239,0.95)]">
                <motion.nav
                  className="flex flex-nowrap items-center justify-center gap-2 sm:gap-3"
                  aria-label="Resume and social links"
                >
              <motion.a
                href={PROFILE.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                {...(reduceMotion ? {} : linkButtonMotion)}
                className="group relative inline-flex shrink-0 items-center gap-2 overflow-hidden whitespace-nowrap rounded-lg border-2 border-neutral-900 bg-neutral-900 px-3.5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition-[background-color,box-shadow,border-color] duration-300 ease-out hover:border-neutral-700 hover:bg-neutral-800 hover:shadow-[0_10px_28px_-12px_rgba(23,23,23,0.55)] sm:px-5 sm:py-3 sm:tracking-[0.16em]"
              >
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                  aria-hidden
                />
                <FileText
                  className="relative h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:scale-110 sm:h-[1.125rem] sm:w-[1.125rem]"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="whitespace-nowrap">View CV</span>
              </motion.a>
              <motion.span
                variants={reduceMotion ? undefined : headerItemVariants}
                className="hidden h-6 w-px shrink-0 origin-center bg-neutral-300 sm:block"
                aria-hidden
              />
              <motion.a
                href={PROFILE.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                {...(reduceMotion ? {} : linkButtonMotion)}
                className="group relative inline-flex shrink-0 items-center gap-2 overflow-hidden whitespace-nowrap rounded-lg border-2 border-[#0A66C2] bg-[#0A66C2] px-3.5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-none transition-[background-color,box-shadow,border-color] duration-300 ease-out hover:border-[#004182] hover:bg-[#004182] sm:px-5 sm:py-3 sm:tracking-[0.16em] sm:shadow-[0_8px_24px_-10px_rgba(10,102,194,0.65)] sm:hover:shadow-[0_12px_32px_-8px_rgba(10,102,194,0.75)]"
              >
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                  aria-hidden
                />
                <Linkedin
                  className="relative h-4 w-4 shrink-0 fill-white transition-transform duration-300 ease-out group-hover:scale-110 sm:h-[1.125rem] sm:w-[1.125rem]"
                  strokeWidth={0}
                  aria-hidden
                />
                <span className="whitespace-nowrap">LinkedIn</span>
              </motion.a>
              <motion.span
                variants={reduceMotion ? undefined : headerItemVariants}
                className="hidden h-6 w-px shrink-0 origin-center bg-neutral-300 sm:block"
                aria-hidden
              />
              <motion.a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Message Fazil on WhatsApp"
                {...(reduceMotion ? {} : linkButtonMotion)}
                className="group relative inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-[#25D366] bg-[#25D366] text-white shadow-[0_8px_24px_-10px_rgba(37,211,102,0.55)] transition-[background-color,box-shadow,border-color] duration-300 ease-out hover:border-[#1DA851] hover:bg-[#1DA851] hover:shadow-[0_12px_32px_-8px_rgba(37,211,102,0.7)] sm:h-12 sm:w-12"
              >
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                  aria-hidden
                />
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="relative h-5 w-5 transition-transform duration-300 ease-out group-hover:scale-110 sm:h-[1.35rem] sm:w-[1.35rem]"
                  aria-hidden
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </motion.a>
                </motion.nav>
              </div>
            </motion.div>
          </motion.div>
        </motion.header>

        <div className="relative flex min-h-0 flex-1 flex-col pt-[5.25rem] sm:pt-[6.75rem] lg:flex-row lg:items-stretch lg:pt-32">
          {/* Copy */}
          <div className="relative z-20 order-2 flex flex-col justify-center px-5 py-10 pb-12 pt-6 sm:px-10 sm:py-12 lg:order-1 lg:w-[46%] lg:max-w-2xl lg:shrink-0 lg:py-16 lg:pl-12 xl:pl-16 xl:pr-8">
            <motion.div
              className="flex flex-col gap-8 sm:gap-10 max-lg:items-center max-lg:text-center lg:items-stretch lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05, ease }}
            >
              <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 border-b border-neutral-200/90 pb-8 text-sm text-neutral-500 lg:justify-start">
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
                  className="text-center leading-[0.92] tracking-tight text-neutral-900 sm:hidden"
                  style={{ fontSize: 'clamp(2.25rem, 9vw, 4.5rem)' }}
                >
                  <span className="font-extralight">Hi,</span>{' '}
                  <span className="font-semibold">{PROFILE.name}</span>
                </p>
                <p
                  className="hidden font-extralight leading-[0.92] tracking-tight text-neutral-900 sm:block"
                  style={{ fontSize: 'clamp(3.5rem, 12vw, 7.25rem)' }}
                >
                  Hi.
                </p>
                <p className="mt-5 hidden max-w-md text-lg font-normal leading-snug text-neutral-600 sm:block sm:text-xl">
                  <span className="text-neutral-400">—</span> I{"\u2019"}m{' '}
                  <span className="font-semibold text-neutral-900">{PROFILE.name}</span>, {PROFILE.role.toLowerCase()}.
                </p>
                <div className="mt-3 flex justify-center lg:hidden">
                  <motion.a
                    href="#about"
                    className="group inline-flex items-center gap-2.5"
                    whileHover={reduceMotion ? undefined : { y: 2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  >
                    <span
                      className="h-px w-8 bg-neutral-300 transition-all duration-300 group-hover:w-11 group-hover:bg-neutral-900"
                      aria-hidden
                    />
                    <span className="font-display text-[11px] font-bold uppercase tracking-[0.26em] text-neutral-500 transition-colors duration-300 group-hover:text-neutral-900">
                      About me
                    </span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300/90 bg-white/50 transition-all duration-300 group-hover:border-neutral-900 group-hover:bg-neutral-900">
                      <ChevronDown
                        className="h-3.5 w-3.5 text-neutral-500 transition-all duration-300 group-hover:translate-y-0.5 group-hover:text-white"
                        strokeWidth={2}
                        aria-hidden
                      />
                    </span>
                  </motion.a>
                </div>
                <p className="mx-auto mt-6 max-w-lg text-pretty text-base font-light leading-relaxed text-neutral-500 sm:text-lg lg:mx-0 lg:text-left">
                  {PROFILE.tagline}
                </p>
              </div>

              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8 lg:items-start">
                <ContactButton variant="light" href="#contact" />
              </div>
            </motion.div>
          </div>

          {/* Mobile portrait — below header with spacing so the face stays visible */}
          <div className="relative order-1 -mt-2 h-[min(52svh,440px)] w-full shrink-0 overflow-hidden sm:-mt-3 sm:h-[min(58vh,520px)] md:-mt-4 md:h-[min(62vh,580px)] lg:hidden">
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
                className="h-full w-full object-cover object-[center_18%]"
                style={{ filter: 'grayscale(1) contrast(1.05) brightness(1.02)' }}
              />
            </motion.div>
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[clamp(3rem,10%,4.5rem)]"
              style={{
                background:
                  'linear-gradient(to bottom, #f2f1ef 0%, rgba(242,241,239,0.55) 55%, transparent 100%)',
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f2f1ef] via-[#f2f1ef]/50 to-transparent sm:h-28"
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
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30"
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
