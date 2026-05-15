import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
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
import { ContactButton } from '../components/ContactButton';
import { ACHIEVEMENTS, PROFILE } from '../data/profile';
import { PROJECTS } from '../data/projects';

const ease = [0.25, 0.1, 0.25, 1] as const;

const KEYWORDS: ReadonlyArray<{ label: string; Icon: LucideIcon | null }> = [
  { label: 'Azure AI Engineer', Icon: Sparkles },
  { label: 'BSc Computer Science', Icon: GraduationCap },
  { label: 'ASP.NET Intern · Dimuma', Icon: Briefcase },
  { label: 'React · Vite · Tailwind', Icon: null },
  { label: 'OpenAI · Supabase · Postgres', Icon: null },
  { label: 'Hackathon Participant', Icon: Award },
  { label: 'Curious. Always shipping.', Icon: null },
  { label: 'CGPA 3.81 / 4.00', Icon: null },
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
    secondary: 'Pre-university',
  },
];

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-x-clip bg-[#0C0C0C] px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-28 lg:py-32"
    >
      <BackdropEffects />

      {/* Bottom bridge into Skills — same language as About glows, resolves to #0C0C0C */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[min(11rem,30svh)] sm:h-[min(13rem,32svh)]"
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
        {/* Heading */}
        <div className="text-center">
          <FadeIn as="div" duration={0.6}>
            <div className="inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.32em] text-[#BBCCD7]/75 sm:gap-4 sm:text-[11px]">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#48E5C2]/75 sm:w-12" aria-hidden />
              Who I am
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#48E5C2]/75 sm:w-12" aria-hidden />
            </div>
          </FadeIn>
          <FadeIn
            as="h2"
            delay={0.05}
            duration={0.7}
            y={40}
            className="hero-heading mt-3 font-black uppercase leading-none tracking-tight"
          >
            <span style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>About me</span>
          </FadeIn>
        </div>

        {/* Mission — scroll-driven character reveal (kept as signature) */}
        <FadeIn as="div" delay={0.12} duration={0.7} y={20} className="mt-12 sm:mt-14 md:mt-16">
          <AnimatedText />
        </FadeIn>

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
              <Timeline />
            </SectionCard>
          </FadeIn>

          <FadeIn as="div" delay={0.1} duration={0.7} y={28}>
            <SectionCard label="At a glance" badge="02">
              <dl className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-5 sm:gap-y-6">
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
                  className="group flex cursor-default gap-3 text-sm leading-relaxed text-[#D7E2EA]/82 sm:text-[15px]"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#48E5C2] transition-shadow duration-300 group-hover:shadow-[0_0_14px_3px_rgba(72,229,194,0.5)]"
                    aria-hidden
                  />
                  <span className="transition-colors duration-300 group-hover:text-[#D7E2EA]">{line}</span>
                </motion.li>
              ))}
            </ul>
          </SectionCard>
        </FadeIn>

        <FadeIn
          as="div"
          delay={0.2}
          duration={0.7}
          y={24}
          className="mt-12 flex justify-center sm:mt-14"
        >
          <ContactButton />
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
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 18% 22%, rgba(72, 229, 194, 0.07) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 82% 78%, rgba(118, 33, 176, 0.11) 0%, transparent 50%)',
        }}
      />
      {/* Faint dot grid masked to the upper portion so it fades into the page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
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
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#D7E2EA]/15 bg-[#141416]/60 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#D7E2EA]/82 backdrop-blur-sm sm:px-5 sm:py-2 sm:text-xs">
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
      className="relative overflow-hidden rounded-2xl border border-[#D7E2EA]/12 bg-gradient-to-b from-[#16161A] to-[#0B0B0D] p-4 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)] sm:p-5"
    >
      {/* Soft mint glow at the top corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#48E5C2]/10 blur-2xl"
      />
      <div className="relative flex items-baseline gap-1.5">
        <span
          className="bg-gradient-to-br from-white via-[#D7E2EA] to-[#48E5C2] bg-clip-text font-black tabular-nums leading-none tracking-tight text-transparent"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}
        >
          {value}
        </span>
        {suffix ? (
          <span className="text-sm font-light tabular-nums text-[#D7E2EA]/40 sm:text-base">
            {suffix}
          </span>
        ) : null}
      </div>
      <p className="relative mt-2 text-[10px] font-medium uppercase tracking-[0.22em] text-[#D7E2EA]/55 sm:text-[11px]">
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
      className="group relative h-full overflow-hidden rounded-3xl border border-[#D7E2EA]/12 bg-gradient-to-b from-[#16161A] via-[#0F1014] to-[#0B0B0D] p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)_inset] sm:p-8"
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
      <header className="relative mb-6 flex items-baseline justify-between gap-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#48E5C2] sm:text-[11px]">
          {label}
        </p>
        <span
          className="font-black tabular-nums leading-none text-[#D7E2EA]/15"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
        >
          {badge}
        </span>
      </header>
      <div className="relative">{children}</div>
    </motion.div>
  );
}

/* ---------- Education timeline ---------- */

function Timeline() {
  return (
    <ol className="relative space-y-7 sm:space-y-8">
      {/* Vertical rail running through the dots */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-3 left-[8px] top-3 w-px bg-gradient-to-b from-[#48E5C2]/45 via-[#D7E2EA]/15 to-[#D7E2EA]/0"
      />
      {TIMELINE.map((entry) => (
        <li key={entry.period} className="relative pl-9">
          <span
            aria-hidden
            className={
              entry.current
                ? 'absolute left-0 top-1.5 h-[17px] w-[17px] rounded-full bg-[#48E5C2] ring-4 ring-[#48E5C2]/12 shadow-[0_0_18px_-4px_rgba(72,229,194,0.7)]'
                : 'absolute left-0 top-1.5 h-[17px] w-[17px] rounded-full bg-[#D7E2EA]/30 ring-4 ring-[#D7E2EA]/8'
            }
          />
          <div className="flex flex-wrap items-baseline justify-between gap-2 sm:gap-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#D7E2EA]/55 sm:text-[11px]">
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
          <p className="mt-2 text-[15px] font-medium text-[#D7E2EA]">{entry.primary}</p>
          {entry.secondary ? (
            <p className="mt-1 text-sm text-[#D7E2EA]/72">{entry.secondary}</p>
          ) : null}
          {entry.meta ? (
            <p className="mt-2 inline-flex rounded-full border border-[#D7E2EA]/15 bg-white/[0.03] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[#D7E2EA]/65">
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
      <dt className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#D7E2EA]/50 transition-colors duration-300 group-hover:text-[#48E5C2]">
        <Icon className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden />
        {label}
      </dt>
      <dd className="mt-1.5 break-words text-sm font-medium leading-snug text-[#D7E2EA]">{value}</dd>
    </div>
  );
}
