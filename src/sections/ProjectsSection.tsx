import { FadeIn } from '../components/FadeIn';
import { ProjectsCarousel3D } from '../components/ProjectsCarousel3D';

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 overflow-x-clip rounded-t-[40px] bg-[#0C0C0C] sm:-mt-12 sm:rounded-t-[50px] md:-mt-14 md:rounded-t-[60px]"
    >
      <div className="px-5 pt-20 pb-[max(8rem,calc(env(safe-area-inset-bottom)+6rem))] max-sm:pb-[max(15rem,calc(env(safe-area-inset-bottom)+9.5rem))] sm:px-8 sm:pb-[max(9rem,calc(env(safe-area-inset-bottom)+6.5rem))] md:px-10 md:pb-[max(10rem,calc(env(safe-area-inset-bottom)+7rem))]">
        <FadeIn
          as="h2"
          className="hero-heading mb-10 text-center font-black uppercase leading-none tracking-tight sm:mb-14 md:mb-16"
          y={40}
          duration={0.7}
        >
          <span style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>Projects</span>
        </FadeIn>

        <p className="mx-auto mb-10 max-w-2xl px-1 text-center text-xs font-medium uppercase leading-relaxed tracking-[0.18em] text-[#D7E2EA]/55 sm:mb-14 sm:px-0 sm:text-[13px] sm:tracking-[0.22em] md:mb-16">
          <span className="block sm:inline">Tap a card to pause the ring.</span>{' '}
          <span className="mt-1 block sm:mt-0 sm:inline">On desktop, hover pauses — move away and it spins again.</span>
        </p>

        <ProjectsCarousel3D />
      </div>
    </section>
  );
}
