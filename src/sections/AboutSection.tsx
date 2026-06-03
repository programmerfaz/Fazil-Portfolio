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
      className="relative overflow-x-clip bg-portfolio-light-alt px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-28 lg:py-32"
    >
      <BackdropEffects />

      {/* Soft bridge into Skills */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[min(8rem,22svh)] sm:h-[min(10rem,24svh)]"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(241, 245, 249, 0.85) 55%, #f1f5f9 100%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Heading */}
        <div className="text-center">
          <FadeIn as="div" duration={0.6}>
            <div className="inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.32em] text-portfolio-muted-dark sm:gap-4 sm:text-[11px]">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-portfolio-cyan/75 sm:w-12" aria-hidden />
              Who I am
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-portfolio-cyan/75 sm:w-12" aria-hidden />
            </div>
          </FadeIn>
          <FadeIn
            as="h2"
            delay={0.05}
            duration={0.7}
            y={40}
            className="hero-heading-light mt-3 font-black uppercase leading-none tracking-tight"
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
                  className="group flex cursor-default gap-3 text-sm leading-relaxed text-portfolio-muted sm:text-[15px]"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-portfolio-cyan transition-shadow duration-300 group-hover:shadow-[0_0_16px_4px_rgba(6,182,212,0.45)]"
                    aria-hidden
                  />
                  <span className="transition-colors duration-300 group-hover:text-portfolio-ink">{line}</span>
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
            'radial-gradient(ellipse 80% 50% at 18% 22%, rgba(6, 182, 212, 0.06) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 82% 78%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)',
        }}
      />
      {/* Faint dot grid masked to the upper portion so it fades into the page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(15, 23, 42, 0.06) 1px, transparent 1px)',
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
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-portfolio-light bg-white/75 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-portfolio-ink-dark/85 shadow-glass-light backdrop-blur-sm sm:px-5 sm:py-2 sm:text-xs">
      {Icon ? (
        <Icon className="h-3 w-3 text-portfolio-cyan" strokeWidth={2.2} aria-hidden />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-portfolio-cyan" aria-hidden />
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
      className="glass-panel relative overflow-hidden rounded-2xl p-4 sm:p-5"
    >
      {/* Soft mint glow at the top corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-portfolio-cyan/10 blur-2xl"
      />
      <div className="relative flex items-baseline gap-1.5">
        <span
          className="bg-gradient-to-br from-portfolio-ink via-portfolio-muted to-portfolio-cyan bg-clip-text font-black tabular-nums leading-none tracking-tight text-transparent"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}
        >
          {value}
        </span>
        {suffix ? (
          <span className="text-sm font-light tabular-nums text-portfolio-muted/50 sm:text-base">
            {suffix}
          </span>
        ) : null}
      </div>
      <p className="relative mt-2 text-[10px] font-medium uppercase tracking-[0.22em] text-portfolio-muted sm:text-[11px]">
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
      className="group glass-panel relative h-full overflow-hidden rounded-3xl p-6 sm:p-8"
    >
      {/* Hover spotlight from the top edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(6, 182, 212, 0.1) 0%, transparent 60%)',
        }}
      />
      <header className="relative mb-6 flex items-baseline justify-between gap-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-portfolio-cyan sm:text-[11px]">
          {label}
        </p>
        <span
          className="font-black tabular-nums leading-none text-portfolio-ink/[0.12]"
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
        className="pointer-events-none absolute bottom-3 left-[8px] top-3 w-px bg-gradient-to-b from-portfolio-cyan/50 via-portfolio-muted/20 to-transparent"
      />
      {TIMELINE.map((entry) => (
        <li key={entry.period} className="relative pl-9">
          <span
            aria-hidden
            className={
              entry.current
                ? 'absolute left-0 top-1.5 h-[17px] w-[17px] rounded-full bg-portfolio-cyan ring-4 ring-portfolio-cyan/15 shadow-[0_0_18px_-4px_rgba(6,182,212,0.65)]'
                : 'absolute left-0 top-1.5 h-[17px] w-[17px] rounded-full bg-portfolio-muted/35 ring-4 ring-portfolio-ink/[0.06]'
            }
          />
          <div className="flex flex-wrap items-baseline justify-between gap-2 sm:gap-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-portfolio-muted sm:text-[11px]">
              {entry.period}
            </p>
            {entry.current ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-portfolio-cyan/35 bg-portfolio-cyan/10 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-portfolio-cyan">
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-portfolio-cyan"
                  aria-hidden
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 0.85, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
                Now
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-[15px] font-medium text-portfolio-ink">{entry.primary}</p>
          {entry.secondary ? (
            <p className="mt-1 text-sm text-portfolio-muted">{entry.secondary}</p>
          ) : null}
          {entry.meta ? (
            <p className="mt-2 inline-flex rounded-full border border-portfolio bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-portfolio-muted">
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
      <dt className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-portfolio-muted/80 transition-colors duration-300 group-hover:text-portfolio-cyan">
        <Icon className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden />
        {label}
      </dt>
      <dd className="mt-1.5 break-words text-sm font-medium leading-snug text-portfolio-ink">{value}</dd>
    </div>
  );
}
