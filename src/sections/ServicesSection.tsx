import { CertificatePdfStack } from '../components/CertificatePdfStack';
import { FadeIn } from '../components/FadeIn';
import { SkillFlipCardCarousel } from '../components/SkillFlipCardCarousel';
import { EXPERIENCE } from '../data/profile';

export function ServicesSection() {
  return (
    <section
      id="skills"
      className="relative -mt-[4.5rem] overflow-x-clip overflow-y-visible rounded-t-[40px] bg-portfolio-light px-0 pb-0 pt-24 scroll-mt-[max(5rem,12vh)] max-sm:-mt-[4rem] max-sm:rounded-t-[36px] max-sm:pt-20 sm:-mt-24 sm:rounded-t-[50px] sm:pt-28 sm:scroll-mt-[max(6rem,14vh)] md:-mt-[6.5rem] md:rounded-t-[60px] md:pt-32"
    >
      {/* 70% — light skills intro */}
      <div className="relative z-[2] px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-6 pt-4 sm:px-[max(2rem,env(safe-area-inset-left))] sm:pr-[max(2rem,env(safe-area-inset-right))] sm:pb-8 sm:pt-6 md:px-[max(2.5rem,env(safe-area-inset-left))] md:pr-[max(2.5rem,env(safe-area-inset-right))]">
        <h2
          className="hero-heading-light mb-4 px-3 text-center font-black uppercase max-sm:break-words sm:mb-6 sm:px-4"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)', wordBreak: 'break-word', hyphens: 'auto' }}
        >
          Skills
        </h2>
        <p
          className="mx-auto mb-8 max-w-2xl px-4 text-center font-medium leading-relaxed text-portfolio-muted-dark max-sm:mb-6 sm:mb-10 sm:px-6 md:mb-12"
          style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.2rem)' }}
        >
          Core stack from coursework, personal builds, and my internship shipping ASP.NET and Azure DevOps workflows.
        </p>
      </div>

      {/* 30% — dark carousel band */}
      <div
        className="relative z-[1] overflow-hidden bg-portfolio-dark py-10 sm:py-14 md:py-16"
        style={{
          backgroundImage: [
            'radial-gradient(ellipse 130% 90% at 50% -12%, rgba(139, 92, 246, 0.18) 0%, transparent 52%)',
            'radial-gradient(ellipse 85% 55% at 12% 0%, rgba(6, 182, 212, 0.1) 0%, transparent 48%)',
          ].join(', '),
        }}
      >
        <SkillFlipCardCarousel />
      </div>

      {/* 70% — light experience + certifications */}
      <div
        className="relative z-[2] overflow-hidden rounded-t-[28px] border-t border-portfolio-light bg-portfolio-light pb-20 pt-12 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] text-portfolio-ink-dark shadow-[0_-24px_60px_-40px_rgba(15,23,42,0.08)] max-sm:rounded-t-[24px] max-sm:pb-16 max-sm:pt-10 sm:rounded-t-[36px] sm:pb-24 sm:pl-[max(2rem,env(safe-area-inset-left))] sm:pr-[max(2rem,env(safe-area-inset-right))] sm:pt-14 md:pb-32 md:pl-[max(2.5rem,env(safe-area-inset-left))] md:pr-[max(2.5rem,env(safe-area-inset-right))] md:pt-16"
      >
        <div
          id="experience"
          className="relative mx-auto max-w-5xl scroll-mt-[max(6rem,15vh)] pt-2 sm:scroll-mt-[max(7rem,16vh)] sm:pt-4 md:pt-6"
        >
          <h3
            className="hero-heading-light mb-12 px-3 text-center font-black uppercase max-sm:break-words sm:px-4"
            style={{ fontSize: 'clamp(2rem, 8vw, 72px)', wordBreak: 'break-word' }}
          >
            Experience
          </h3>
          <div className="flex flex-col gap-6 sm:gap-8">
            {EXPERIENCE.map((job, i) => (
              <FadeIn key={`${job.org}-${job.period}`} delay={i * 0.08} duration={0.65} y={24}>
                <div className="glass-panel rounded-2xl p-6 sm:p-8">
                  <div className="border-l-2 border-portfolio-cyan pl-5 sm:pl-7">
                    <p className="text-xs font-bold uppercase tracking-widest text-portfolio-muted">{job.period}</p>
                    <h4
                      className="mt-2 font-bold uppercase text-portfolio-ink"
                      style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
                    >
                      {job.role}
                    </h4>
                    <p className="mt-1 text-sm font-semibold text-portfolio-cyan">{job.org}</p>
                    <ul className="mt-4 space-y-2">
                      {job.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex gap-2 font-medium text-portfolio-muted"
                          style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)' }}
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-portfolio-purple shadow-[0_0_10px_rgba(139,92,246,0.55)]" aria-hidden />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <div
          id="certificates"
          className="relative z-[1] mx-auto mt-16 w-full max-w-[min(100%,1320px)] scroll-mt-[max(6rem,15vh)] border-t border-portfolio-light px-0 pt-12 sm:mt-20 sm:scroll-mt-32 sm:pt-16 md:mt-24 md:pt-20"
        >
          <h3
            className="hero-heading-light mb-12 px-3 pb-1 text-center font-black uppercase leading-none max-sm:break-words sm:mb-16 sm:px-4 md:mb-20"
            style={{ fontSize: 'clamp(2rem, 8vw, 72px)', wordBreak: 'break-word' }}
          >
            Certifications
          </h3>
          <FadeIn duration={0.65} y={20}>
            <div className="pt-4 pb-[max(10rem,calc(env(safe-area-inset-bottom)+8.5rem))] sm:pt-6 sm:pb-[max(11rem,calc(env(safe-area-inset-bottom)+9rem))] md:pt-8">
              <CertificatePdfStack />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
