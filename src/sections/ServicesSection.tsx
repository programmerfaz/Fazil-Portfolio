import { CertificatePdfStack } from '../components/CertificatePdfStack';
import { FadeIn } from '../components/FadeIn';
import { SkillFlipCardCarousel } from '../components/SkillFlipCardCarousel';
import { EXPERIENCE } from '../data/profile';

export function ServicesSection() {
  return (
    <section
      id="skills"
      className="relative -mt-[4.5rem] overflow-x-clip overflow-y-visible rounded-t-[40px] px-0 pb-0 pt-24 scroll-mt-[max(5rem,12vh)] max-sm:-mt-[4rem] max-sm:rounded-t-[36px] max-sm:pt-20 sm:-mt-24 sm:rounded-t-[50px] sm:pt-28 sm:scroll-mt-[max(6rem,14vh)] md:-mt-[6.5rem] md:rounded-t-[60px] md:pt-32"
      style={{
        backgroundColor: '#0C0C0C',
        backgroundImage: [
          /* Continuation of About’s mint + violet, meeting Skills headline energy */
          'radial-gradient(ellipse 130% 90% at 50% -12%, rgba(109, 40, 217, 0.22) 0%, transparent 52%)',
          'radial-gradient(ellipse 85% 55% at 12% 0%, rgba(72, 229, 194, 0.1) 0%, transparent 48%)',
          'radial-gradient(ellipse 90% 60% at 88% 4%, rgba(49, 46, 129, 0.2) 0%, transparent 50%)',
          'linear-gradient(180deg, rgba(12, 12, 12, 0.35) 0%, transparent 42%, transparent 100%)',
        ].join(', '),
      }}
    >
      <div className="relative z-[2] -mt-1 sm:-mt-2 md:-mt-3">
        <div
          className="relative overflow-hidden rounded-b-[32px] pb-14 pt-8 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] shadow-[0_32px_80px_-28px_rgba(0,0,0,0.65)] max-sm:rounded-b-[28px] max-sm:pb-12 max-sm:pt-6 sm:rounded-b-[40px] sm:pb-16 sm:pl-[max(2rem,env(safe-area-inset-left))] sm:pr-[max(2rem,env(safe-area-inset-right))] sm:pt-10 md:pb-20 md:pl-[max(2.5rem,env(safe-area-inset-left))] md:pr-[max(2.5rem,env(safe-area-inset-right))] md:pt-12"
          style={{
            backgroundImage: [
              'radial-gradient(ellipse 125% 75% at 50% -5%, rgba(109,40,217,0.14) 0%, transparent 52%)',
              'radial-gradient(ellipse 90% 60% at 88% 8%, rgba(49,46,129,0.12) 0%, transparent 48%)',
              'linear-gradient(180deg, transparent 0%, transparent 28%, rgba(0,0,0,0.22) 100%)',
            ].join(', '),
            backgroundColor: '#0C0C0C',
          }}
        >
          <h2
            className="relative z-10 mb-4 px-3 bg-gradient-to-b from-white via-[#f4f4f5] to-zinc-400 bg-clip-text text-center font-black uppercase text-transparent max-sm:break-words sm:mb-6 sm:px-4"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)', wordBreak: 'break-word', hyphens: 'auto' }}
          >
            Skills
          </h2>
          <p
            className="relative z-10 mx-auto mb-12 max-w-2xl px-4 text-center font-medium leading-relaxed text-[#BBCCD7]/80 max-sm:mb-10 sm:mb-16 sm:px-6 md:mb-20"
            style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.2rem)' }}
          >
            Core stack from coursework, personal builds, and my internship shipping ASP.NET and Azure DevOps workflows.
          </p>

          <div className="relative z-10">
            <SkillFlipCardCarousel />
          </div>
        </div>
      </div>

      {/* Skills → Experience: violet / mint wash into paper (no hard cut) */}
      <div
        aria-hidden
        className="pointer-events-none relative z-[1] -mt-12 h-[min(10.5rem,24svh)] max-sm:-mt-10 max-sm:h-[min(9rem,20svh)] sm:-mt-16 sm:h-[min(12rem,26svh)] md:-mt-[4.5rem] md:h-[min(13rem,28svh)]"
        style={{
          backgroundImage: [
            'linear-gradient(180deg, rgba(12, 12, 12, 0) 0%, rgba(18, 14, 22, 0.55) 28%, rgba(52, 44, 62, 0.45) 52%, rgba(140, 128, 118, 0.22) 74%, rgba(232, 228, 220, 0.82) 92%, #f2f1ef 100%)',
            'radial-gradient(ellipse 110% 85% at 50% 0%, rgba(109, 40, 217, 0.26) 0%, transparent 58%)',
            'radial-gradient(ellipse 72% 55% at 12% 18%, rgba(72, 229, 194, 0.11) 0%, transparent 52%)',
            'radial-gradient(ellipse 75% 50% at 88% 22%, rgba(49, 46, 129, 0.16) 0%, transparent 50%)',
          ].join(', '),
        }}
      />

      {/* Paper zone — pulled up over bridge tail so edge reads continuous */}
      <div
        className="relative z-[2] -mt-[4.5rem] overflow-hidden rounded-t-[28px] bg-[#f2f1ef] pb-20 pt-12 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] text-neutral-900 shadow-[0_-28px_60px_-32px_rgba(0,0,0,0.42)] max-sm:-mt-[3.25rem] max-sm:rounded-t-[24px] max-sm:pb-16 max-sm:pt-10 sm:-mt-[5rem] sm:rounded-t-[36px] sm:pb-24 sm:pl-[max(2rem,env(safe-area-inset-left))] sm:pr-[max(2rem,env(safe-area-inset-right))] sm:pt-14 md:-mt-24 md:pb-32 md:pl-[max(2.5rem,env(safe-area-inset-left))] md:pr-[max(2.5rem,env(safe-area-inset-right))] md:pt-16"
        style={{
          backgroundColor: '#f2f1ef',
          backgroundImage: [
            'radial-gradient(ellipse 130% 70% at 50% -8%, rgba(109, 40, 217, 0.07) 0%, transparent 48%)',
            'radial-gradient(ellipse 80% 45% at 10% 0%, rgba(72, 229, 194, 0.06) 0%, transparent 45%)',
          ].join(', '),
        }}
      >
        <div
          id="experience"
          className="relative mx-auto max-w-5xl scroll-mt-[max(6rem,15vh)] pt-2 sm:scroll-mt-[max(7rem,16vh)] sm:pt-4 md:pt-6"
        >
          <h3
            className="mb-12 px-3 bg-gradient-to-b from-neutral-900 to-neutral-500 bg-clip-text text-center font-black uppercase text-transparent max-sm:break-words sm:px-4"
            style={{ fontSize: 'clamp(2rem, 8vw, 72px)', wordBreak: 'break-word' }}
          >
            Experience
          </h3>
          <div className="flex flex-col gap-10">
            {EXPERIENCE.map((job, i) => (
              <FadeIn key={`${job.org}-${job.period}`} delay={i * 0.08} duration={0.65} y={24}>
                <div className="border-l-[3px] border-violet-500 pl-6 sm:pl-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">{job.period}</p>
                  <h4 className="mt-2 font-bold uppercase text-neutral-900" style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}>
                    {job.role}
                  </h4>
                  <p className="mt-1 text-sm font-semibold text-teal-700">{job.org}</p>
                  <ul className="mt-4 space-y-2">
                    {job.bullets.map((b) => (
                      <li key={b} className="flex gap-2 font-medium text-neutral-600" style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)' }}>
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-teal-500" aria-hidden />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <div
          id="certificates"
          className="relative z-[1] mx-auto mt-16 w-full max-w-[min(100%,1320px)] scroll-mt-[max(6rem,15vh)] border-t border-neutral-200/80 px-0 pt-12 sm:mt-20 sm:scroll-mt-32 sm:pt-16 md:mt-24 md:pt-20"
        >
          <h3
            className="mb-12 bg-gradient-to-b from-neutral-900 to-neutral-500 bg-clip-text px-3 pb-1 text-center font-black uppercase leading-none text-transparent max-sm:break-words sm:mb-16 sm:px-4 md:mb-20"
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
