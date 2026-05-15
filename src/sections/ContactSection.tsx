import { Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';
import { ContactButton } from '../components/ContactButton';
import { ElectricContactCard } from '../components/ElectricContactCard';
import { PROFILE } from '../data/profile';

const linkRow =
  'flex items-center gap-3 rounded-xl border border-[#D7E2EA]/15 bg-[#141416]/60 px-4 py-3 backdrop-blur-sm transition-colors hover:border-[#D7E2EA]/35 max-sm:gap-2.5 max-sm:px-3 max-sm:py-2.5 sm:gap-4 sm:rounded-2xl sm:px-5 sm:py-3.5';

export function ContactSection() {
  return (
    <section
      id="contact"
      className="px-4 py-16 max-sm:mt-8 max-sm:px-3 max-sm:pt-24 sm:mt-0 sm:px-8 md:px-10 md:py-24 pb-[max(6rem,calc(env(safe-area-inset-bottom)+5rem))]"
      style={{
        background:
          'linear-gradient(to bottom, #0C0C0C 0px, rgba(12,12,12,0) min(220px, 28vw)), radial-gradient(ellipse 130% 85% at 50% 6%, rgba(109, 40, 217, 0.26) 0%, transparent 52%), radial-gradient(ellipse 90% 55% at 85% 105%, rgba(49, 46, 129, 0.35) 0%, transparent 42%), #0C0C0C',
      }}
    >
      <FadeIn duration={0.62} y={18}>
        <ElectricContactCard>
          <>
            <div className="flex flex-col items-center text-center">
              <span className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e2e8f0] max-sm:px-3 max-sm:py-1 max-sm:text-[9px] max-sm:tracking-[0.18em] sm:text-[11px]">
                Open to opportunities
              </span>
              <h2 className="hero-heading mt-5 font-black uppercase leading-[0.92] tracking-tight text-[clamp(1.85rem,7vw,3.75rem)] max-sm:mt-4 max-sm:text-[clamp(1.65rem,10vw,2.65rem)] sm:mt-6 md:mt-7">
                Contact
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm font-light leading-snug text-[#D7E2EA]/75 max-sm:mt-2.5 max-sm:text-[0.875rem] sm:mt-4 sm:text-base sm:leading-relaxed md:text-lg">
                Let&apos;s build something ambitious — internships, collaborations, or open source.
              </p>
            </div>

            <div className="flex justify-center pt-1">
              <ContactButton />
            </div>

            <div className="grid w-full gap-2.5 max-sm:gap-2 sm:grid-cols-2 sm:gap-3">
              <a href={`mailto:${PROFILE.email}`} className={linkRow}>
                <Mail className="h-6 w-6 shrink-0 text-[#BBCCD7] max-sm:h-5 max-sm:w-5" aria-hidden />
                <div className="min-w-0 text-left">
                  <p className="text-xs uppercase tracking-widest text-[#D7E2EA]/45">Email</p>
                  <p className="truncate font-medium text-[#D7E2EA]">{PROFILE.email}</p>
                </div>
              </a>
              <a href={PROFILE.phoneTel} className={linkRow}>
                <Phone className="h-6 w-6 shrink-0 text-[#BBCCD7] max-sm:h-5 max-sm:w-5" aria-hidden />
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#D7E2EA]/45">Phone</p>
                  <p className="font-medium text-[#D7E2EA]">{PROFILE.phoneDisplay}</p>
                </div>
              </a>
              <a href={PROFILE.linkedinUrl} target="_blank" rel="noopener noreferrer" className={linkRow}>
                <Linkedin className="h-6 w-6 shrink-0 text-[#BBCCD7] max-sm:h-5 max-sm:w-5" aria-hidden />
                <div className="min-w-0 text-left">
                  <p className="text-xs uppercase tracking-widest text-[#D7E2EA]/45">LinkedIn</p>
                  <p className="truncate text-sm font-medium text-[#D7E2EA]/90">linkedin.com/in/fazil-shahbaz</p>
                </div>
              </a>
              <a href={PROFILE.githubUrl} target="_blank" rel="noopener noreferrer" className={linkRow}>
                <Github className="h-6 w-6 shrink-0 text-[#BBCCD7] max-sm:h-5 max-sm:w-5" aria-hidden />
                <div className="min-w-0 text-left">
                  <p className="text-xs uppercase tracking-widest text-[#D7E2EA]/45">GitHub</p>
                  <p className="truncate text-sm font-medium text-[#D7E2EA]/90">github.com/programmerfaz</p>
                </div>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-white/[0.06] pt-5 text-center text-[#D7E2EA]/55 max-sm:px-1 max-sm:pt-4 max-sm:text-xs sm:gap-3 sm:pt-6">
              <MapPin className="h-4 w-4 shrink-0 text-[#BBCCD7]/80 max-sm:h-3.5 max-sm:w-3.5 sm:h-5 sm:w-5" aria-hidden />
              <span className="max-w-[min(100%,42ch)] text-pretty text-sm uppercase tracking-wide sm:text-sm">{PROFILE.location}</span>
            </div>
          </>
        </ElectricContactCard>
      </FadeIn>
    </section>
  );
}
