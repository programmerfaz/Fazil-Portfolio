import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Award,
  Briefcase,
  Calendar,
  Flag,
  GraduationCap,
  Languages,
  MapPin,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { FadeIn } from '../components/FadeIn';
import { AnimatedText } from '../components/AnimatedText';
import { ACHIEVEMENTS, PROFILE } from '../data/profile';
import { PROJECTS } from '../data/projects';

const ease = [0.25, 0.1, 0.25, 1] as const;
const smoothEase = [0.22, 1, 0.36, 1] as const;

const KEYWORDS: ReadonlyArray<{ label: string; Icon: LucideIcon | null }> = [
  { label: 'Azure AI Engineer', Icon: Sparkles },
  { label: 'BSc Computer Science', Icon: GraduationCap },
  { label: 'ASP.NET Intern · Dimuma', Icon: Briefcase },
  { label: 'React · Vite · Tailwind', Icon: null },
  { label: 'OpenAI · Supabase · Postgres', Icon: null },
  { label: 'Hackathon Participant', Icon: Award },
  { label: 'Curious. Always shipping.', Icon: null },
  { label: 'CGPA 3.82 / 4.00', Icon: null },
];

const cgpaMain = PROFILE.cgpa.split(' / ')[0];
const cgpaScale = PROFILE.cgpa.split(' / ')[1];
const languagesCount = PROFILE.languagesPersonal.split(',').length;

const STATS: ReadonlyArray<{ value: string; suffix?: string; label: string }> = [
  { value: cgpaMain, suffix: `/ ${cgpaScale}`, label: 'CGPA' },
  { value: `${PROJECTS.length}+`, label: 'Projects shipped' },
  { value: `${languagesCount}`, label: 'Languages spoken' },
  { value: '2026', label: 'Expected graduation' },
];

type TimelineEntry = {
  period: string;
  primary: string;
  secondary?: string;
  meta?: string;
  current?: boolean;
};

const TIMELINE: ReadonlyArray<TimelineEntry> = [
  {
    period: PROFILE.educationPeriod,
    primary: PROFILE.university,
    secondary: PROFILE.degree,
    meta: `CGPA ${PROFILE.cgpa}`,
    current: true,
  },
  {
    period: PROFILE.schoolPeriod,
    primary: PROFILE.school,
    secondary: 'Secondary school',
  },
];

export function AboutSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="about"
      className="relative overflow-x-clip border-t border-[var(--surface-border-subtle)] bg-[var(--about-surface)] px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-28 lg:border-t-0 lg:bg-[var(--surface-dark)] lg:py-32"
    >
      <BackdropEffects />

      {/* Soft depth wash — matches Experience light panel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] lg:hidden"
        style={{
          backgroundImage: [
            'radial-gradient(ellipse 130% 70% at 50% -8%, rgba(109, 40, 217, 0.07) 0%, transparent 48%)',
            'radial-gradient(ellipse 80% 45% at 10% 0%, rgba(72, 229, 194, 0.06) 0%, transparent 45%)',
          ].join(', '),
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] hidden h-[min(11rem,30svh)] sm:h-[min(13rem,32svh)] lg:block"
        style={{
          background: [
            'linear-gradient(180deg, transparent 0%, rgba(12, 12, 12, 0.55) 52%, #0C0C0C 100%)',
            'radial-gradient(ellipse 110% 95% at 50% 100%, rgba(118, 33, 176, 0.28) 0%, transparent 58%)',
            'radial-gradient(ellipse 75% 70% at 14% 96%, rgba(72, 229, 194, 0.14) 0%, transparent 52%)',
            'radial-gradient(ellipse 70% 55% at 88% 98%, rgba(49, 46, 129, 0.2) 0%, transparent 50%)',
          ].join(', '),
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Heading — staggered smooth fade on mobile */}
        <motion.div
          className="text-center"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.4, margin: '0px 0px -10% 0px' }}
          variants={
            reduceMotion
              ? undefined
              : {
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
                }
          }
        >
          <motion.div
            variants={
              reduceMotion
                ? undefined
                : { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }
            }
            transition={{ duration: 0.75, ease: smoothEase }}
            className="max-lg:block lg:hidden"
          >
            <div className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-700 sm:gap-4 sm:text-[11px]">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#48E5C2]/75 sm:w-12" aria-hidden />
              Who I am
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#48E5C2]/75 sm:w-12" aria-hidden />
            </div>
          </motion.div>
          <FadeIn as="div" duration={0.6} className="hidden lg:block">
            <div className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-600 sm:gap-4 sm:text-[11px] lg:font-medium lg:tracking-[0.32em] lg:text-[#BBCCD7]/75">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#48E5C2]/75 sm:w-12" aria-hidden />
              Who I am
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#48E5C2]/75 sm:w-12" aria-hidden />
            </div>
          </FadeIn>

          <motion.h2
            variants={
              reduceMotion
                ? undefined
                : { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }
            }
            transition={{ duration: 0.85, ease: smoothEase }}
            className="about-section-heading hero-heading mt-3 font-black uppercase leading-none tracking-tight max-lg:block lg:hidden"
          >
            <span style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>About me</span>
          </motion.h2>
          <FadeIn
            as="h2"
            delay={0.05}
            duration={0.7}
            y={40}
            className="about-section-heading hero-heading mt-3 hidden font-black uppercase leading-none tracking-tight lg:block"
          >
            <span style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>About me</span>
          </FadeIn>
        </motion.div>

        {/* Mission — smooth fade on mobile; scroll reveal on desktop */}
        <div className="mt-12 sm:mt-14 md:mt-16">
          <AnimatedText />
        </div>

        {/* Identity marquee */}
        <FadeIn as="div" delay={0.18} duration={0.7} y={20} className="mt-10 sm:mt-12">
          <KeywordMarquee />
        </FadeIn>

        {/* Featured stats */}
        <FadeIn as="div" delay={0.22} duration={0.7} y={20} className="mt-12 sm:mt-16">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} {...stat} index={i} />
            ))}
          </div>
        </FadeIn>

        {/* Education timeline + at-a-glance facts */}
        <div className="mt-12 grid gap-5 sm:mt-16 sm:gap-6 md:grid-cols-2">
          <FadeIn as="div" delay={0.05} duration={0.7} y={28}>
            <SectionCard label="Education" badge="01">
              <EducationStack />
              <Timeline />
            </SectionCard>
          </FadeIn>

          <FadeIn as="div" delay={0.1} duration={0.7} y={28}>
            <SectionCard label="At a glance" badge="02">
              <dl className="grid min-w-0 grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 sm:gap-y-6">
                <MetaItem Icon={MapPin} label="Based in" value={PROFILE.location} />
                <MetaItem Icon={Flag} label="Nationality" value={PROFILE.nationality} />
                <MetaItem Icon={Languages} label="Languages" value={PROFILE.languagesPersonal} />
                <MetaItem Icon={Calendar} label="Born" value={PROFILE.dob} />
              </dl>
            </SectionCard>
          </FadeIn>
        </div>

        {/* Highlights — full width below */}
        <FadeIn as="div" delay={0.15} duration={0.7} y={28} className="mt-5 sm:mt-6">
          <SectionCard label="Highlights" badge="03">
            <ul className="space-y-3 sm:space-y-3.5">
              {ACHIEVEMENTS.map((line) => (
                <motion.li
                  key={line}
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.25, ease }}
                  className="group flex cursor-default gap-3 text-sm leading-relaxed text-[#DCE8F4] sm:text-[15px] lg:text-[#D7E2EA]/82"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#48E5C2] transition-shadow duration-300 group-hover:shadow-[0_0_14px_3px_rgba(72,229,194,0.5)]"
                    aria-hidden
                  />
                  <span className="transition-colors duration-300 group-hover:text-[#EEF4FA] lg:group-hover:text-[#D7E2EA]">{line}</span>
                </motion.li>
              ))}
            </ul>
          </SectionCard>
        </FadeIn>

      </div>
    </section>
  );
}

/* ---------- Backdrop ---------- */

function BackdropEffects() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 18% 22%, rgba(72, 229, 194, 0.07) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 82% 78%, rgba(118, 33, 176, 0.11) 0%, transparent 50%)',
        }}
      />
      {/* Faint dot grid masked to the upper portion so it fades into the page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden opacity-[0.22] lg:block"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(215, 226, 234, 0.16) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 70% 55% at 50% 30%, black 0%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 55% at 50% 30%, black 0%, transparent 75%)',
        }}
      />
    </>
  );
}

/* ---------- Keyword marquee ---------- */

function KeywordMarquee() {
  const items = [...KEYWORDS, ...KEYWORDS];
  return (
    <div
      className="relative overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)',
      }}
    >
      <style>{`
        @keyframes about-keywords-drift {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .about-keywords-track {
          animation: about-keywords-drift 38s linear infinite;
          will-change: transform;
        }
        .about-keywords-track:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .about-keywords-track { animation: none; }
        }
      `}</style>
      <div className="about-keywords-track flex w-max gap-2 sm:gap-3">
        {items.map((item, i) => (
          <KeywordChip key={`${item.label}-${i}`} label={item.label} Icon={item.Icon} />
        ))}
      </div>
    </div>
  );
}

function KeywordChip({ label, Icon }: { label: string; Icon: LucideIcon | null }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#1e2433] bg-[#141722] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#DCE8F4] shadow-sm sm:px-5 sm:py-2 sm:text-xs lg:border-[#D7E2EA]/15 lg:bg-[#141416]/60 lg:font-medium lg:tracking-[0.2em] lg:text-[#D7E2EA]/82 lg:shadow-none">
      {Icon ? (
        <Icon className="h-3 w-3 text-[#48E5C2]" strokeWidth={2.2} aria-hidden />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-[#48E5C2]" aria-hidden />
      )}
      {label}
    </span>
  );
}

/* ---------- Stats ---------- */

function StatCard({
  value,
  suffix,
  label,
  index,
}: {
  value: string;
  suffix?: string;
  label: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.06, ease }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-2xl border border-[#1e2433] bg-[#141722] p-4 shadow-[0_18px_44px_-22px_rgba(20,23,34,0.55)] sm:p-5 lg:border-[#D7E2EA]/12 lg:bg-gradient-to-b lg:from-[#16161A] lg:to-[#0B0B0D] lg:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
    >
      {/* Soft mint glow at the top corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#48E5C2]/15 blur-2xl lg:bg-[#48E5C2]/10"
      />
      <div className="relative flex items-baseline gap-1.5">
        <span
          className="font-black tabular-nums leading-none tracking-tight text-[#EEF4FA] lg:bg-gradient-to-br lg:from-white lg:via-[#D7E2EA] lg:to-[#48E5C2] lg:bg-clip-text lg:text-transparent"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}
        >
          {value}
        </span>
        {suffix ? (
          <span className="text-sm font-medium tabular-nums text-[#9EB4CC] sm:text-base lg:font-light lg:text-[#D7E2EA]/40">
            {suffix}
          </span>
        ) : null}
      </div>
      <p className="relative mt-2.5 text-xs font-semibold leading-snug text-[#B8D0E8] lg:mt-2 lg:text-[11px] lg:font-medium lg:uppercase lg:tracking-[0.22em] lg:text-[#D7E2EA]/55">
        {label}
      </p>
    </motion.div>
  );
}

/* ---------- Section card (gradient surface, hover lift, mint spotlight) ---------- */

type SectionCardProps = {
  label: string;
  badge: string;
  children: ReactNode;
};

function SectionCard({ label, badge, children }: SectionCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease }}
      className="group relative h-full overflow-hidden rounded-3xl border border-[#1e2433] bg-[#141722] p-5 shadow-[0_20px_50px_-24px_rgba(20,23,34,0.55)] sm:p-6 lg:border-[#D7E2EA]/12 lg:bg-gradient-to-b lg:from-[#16161A] lg:via-[#0F1014] lg:to-[#0B0B0D] lg:p-8 lg:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)_inset]"
    >
      {/* Hover spotlight from the top edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(72, 229, 194, 0.08) 0%, transparent 60%)',
        }}
      />
      <header className="relative mb-5 flex items-baseline justify-between gap-4 lg:mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#48E5C2] sm:text-[11px] lg:font-medium lg:tracking-[0.22em]">
          {label}
        </p>
        <span
          className="font-black tabular-nums leading-none text-[#D7E2EA]/22 lg:text-[#D7E2EA]/15"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
        >
          {badge}
        </span>
      </header>
      <div className="relative">{children}</div>
    </motion.div>
  );
}

/* ---------- Education — mobile stacked cards (readable on light section bg) ---------- */

function EducationStack() {
  return (
    <div className="space-y-4 lg:hidden">
      {TIMELINE.map((entry) => (
        <div
          key={entry.period}
          className="rounded-2xl border border-[#D7E2EA]/10 bg-[#1a1f2e] p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold tracking-wide text-[#48E5C2]">{entry.period}</p>
            {entry.current ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#48E5C2]/35 bg-[#48E5C2]/12 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#48E5C2]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#48E5C2]" aria-hidden />
                Now
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-base font-bold leading-snug text-[#EEF4FA]">{entry.primary}</p>
          {entry.secondary ? (
            <p className="mt-1.5 text-sm font-medium text-[#DCE8F4]">{entry.secondary}</p>
          ) : null}
          {entry.meta ? (
            <p className="mt-3 inline-flex rounded-lg bg-[#141722] px-3 py-1.5 text-xs font-semibold text-[#B8D0E8]">
              {entry.meta}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/* ---------- Education timeline — desktop ---------- */

function Timeline() {
  return (
    <ol className="relative hidden space-y-7 sm:space-y-8 lg:block">
      {/* Vertical rail running through the dots */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-3 left-[8px] top-3 w-px bg-gradient-to-b from-[#48E5C2]/45 via-neutral-200 to-neutral-100 lg:via-[#D7E2EA]/15 lg:to-[#D7E2EA]/0"
      />
      {TIMELINE.map((entry) => (
        <li key={entry.period} className="relative pl-9">
          <span
            aria-hidden
            className={
              entry.current
                ? 'absolute left-0 top-1.5 h-[17px] w-[17px] rounded-full bg-[#48E5C2] ring-4 ring-[#48E5C2]/12 shadow-[0_0_18px_-4px_rgba(72,229,194,0.7)]'
                : 'absolute left-0 top-1.5 h-[17px] w-[17px] rounded-full bg-neutral-300 ring-4 ring-neutral-200 lg:bg-[#D7E2EA]/30 lg:ring-[#D7E2EA]/8'
            }
          />
          <div className="flex flex-wrap items-baseline justify-between gap-2 sm:gap-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-500 sm:text-[11px] lg:text-[#D7E2EA]/55">
              {entry.period}
            </p>
            {entry.current ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#48E5C2]/30 bg-[#48E5C2]/10 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#48E5C2]">
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-[#48E5C2]"
                  aria-hidden
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 0.85, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
                Now
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-[15px] font-medium text-neutral-900 lg:text-[#D7E2EA]">{entry.primary}</p>
          {entry.secondary ? (
            <p className="mt-1 text-sm text-neutral-600 lg:text-[#D7E2EA]/72">{entry.secondary}</p>
          ) : null}
          {entry.meta ? (
            <p className="mt-2 inline-flex rounded-full border border-[color-mix(in_srgb,var(--surface-accent-muted)_22%,transparent)] bg-[color-mix(in_srgb,var(--surface-elevated)_88%,var(--surface-light))] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-600 lg:border-[#D7E2EA]/15 lg:bg-white/[0.03] lg:text-[#D7E2EA]/65">
              {entry.meta}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

/* ---------- At a glance meta items ---------- */

type MetaItemProps = {
  Icon: LucideIcon;
  label: string;
  value: string;
};

function MetaItem({ Icon, label, value }: MetaItemProps) {
  return (
    <div className="group min-w-0">
      <dt className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[#9EB4CC] transition-colors duration-300 group-hover:text-[#48E5C2] lg:text-[10px] lg:font-medium lg:uppercase lg:tracking-[0.18em] lg:text-[#D7E2EA]/50">
        <Icon className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden />
        {label}
      </dt>
      <dd className="mt-1.5 break-words text-sm font-semibold leading-snug text-[#EEF4FA] lg:font-medium lg:text-[#D7E2EA]">{value}</dd>
    </div>
  );
}
