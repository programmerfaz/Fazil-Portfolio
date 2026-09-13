import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Mail } from 'lucide-react';
import { ContactButton } from '../components/ContactButton';
import { HeroQuickLinks } from '../components/HeroQuickLinks';
import { HeroVideoBackdrop } from '../components/HeroVideoBackdrop';
import { PROJECTS } from '../data/projects';
import { PROFILE } from '../data/profile';

gsap.registerPlugin(ScrollTrigger);

function HeroEmailLink({ className = '' }: { className?: string }) {
  return (
    <a
      href={`mailto:${PROFILE.email}`}
      className={`group flex max-w-full items-center gap-2 text-sm font-medium tracking-[0.01em] text-[color-mix(in_srgb,var(--surface-accent)_92%,transparent)] transition-colors duration-200 hover:text-[#48E5C2] sm:text-base ${className}`}
    >
      <Mail
        className="h-4 w-4 shrink-0 text-[#48E5C2] transition-transform duration-200 group-hover:scale-110 sm:h-[1.125rem] sm:w-[1.125rem]"
        strokeWidth={2}
        aria-hidden
      />
      <span className="break-all sm:break-normal">{PROFILE.email}</span>
    </a>
  );
}

function HeroStats({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-x-10 gap-y-2 text-sm ${className}`}>
      <p data-hero-stat>
        <span className="block text-xl font-light tabular-nums text-[var(--surface-accent-strong)] sm:text-2xl lg:text-[1.65rem]">
          {PROFILE.cgpa.split(' / ')[0]}
        </span>
        <span className="mt-0.5 block text-[10px] font-medium tracking-[0.04em] text-[var(--surface-accent-muted)] sm:text-xs">
          CGPA
        </span>
      </p>
      <p data-hero-stat>
        <span className="block text-xl font-light tabular-nums text-[var(--surface-accent-strong)] sm:text-2xl lg:text-[1.65rem]">
          {PROJECTS.length}+
        </span>
        <span className="mt-0.5 block text-[10px] font-medium tracking-[0.04em] text-[var(--surface-accent-muted)] sm:text-xs">
          Projects
        </span>
      </p>
    </div>
  );
}

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLParagraphElement>(null);
  const greetingRef = useRef<HTMLHeadingElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const video = videoRef.current;
    const greeting = greetingRef.current;
    const details = detailsRef.current;
    const scrollHint = scrollHintRef.current;
    if (!section || !sticky || !video || !greeting || !details || reduceMotion) return;

    const tagline = details.querySelector('[data-hero-step="tagline"]');
    const subtitle = details.querySelector('[data-hero-step="subtitle"]');
    const links = details.querySelector('[data-hero-step="links"]');
    const linkItems = links?.querySelectorAll('a') ?? [];
    const email = details.querySelector('[data-hero-step="email"]');
    const stats = details.querySelector('[data-hero-step="stats"]');
    const statItems = stats?.querySelectorAll('[data-hero-stat]') ?? [];
    const about = details.querySelector('[data-hero-step="about"]');
    const aboutLine = details.querySelector('[data-hero-step="about-line"]');
    const contact = details.querySelector('[data-hero-step="contact"]');

    let ctx: gsap.Context | undefined;
    const VIDEO_FPS = 30;

    const setup = () => {
      video.pause();
      video.currentTime = 0;

      const duration = video.duration || 5;
      let lastFrame = -1;

      ctx = gsap.context(() => {
        gsap.set(greeting, {
          opacity: 0,
          scale: 2.4,
          y: 56,
          transformOrigin: 'left center',
          force3D: true,
        });
        gsap.set([tagline, subtitle, links, email, stats, about, aboutLine, contact], {
          opacity: 0,
          force3D: true,
        });
        gsap.set(tagline, { x: -48, filter: 'blur(10px)' });
        gsap.set(subtitle, { y: 32, clipPath: 'inset(100% 0 0 0)' });
        gsap.set(links, { y: 28, scale: 0.96 });
        gsap.set(linkItems, { opacity: 0, y: 18, scale: 0.92 });
        gsap.set(email, { x: -24, opacity: 0 });
        gsap.set(statItems, { opacity: 0, y: 24, scale: 0.85 });
        gsap.set(about, { x: -20, opacity: 0 });
        gsap.set(aboutLine, { y: 20, opacity: 0, filter: 'blur(6px)' });
        gsap.set(contact, { scale: 0.88, y: 20, opacity: 0 });
        gsap.set(videoWrapRef.current, { scale: 1.04, yPercent: 0, force3D: true });
        if (scrollHint) gsap.set(scrollHint, { opacity: 1, y: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=240%',
            scrub: 4.5,
            pin: sticky,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: () => {
              const p = tl.progress();
              const frame = Math.min(
                duration - 1 / VIDEO_FPS,
                Math.round(p * duration * VIDEO_FPS) / VIDEO_FPS,
              );
              if (frame !== lastFrame) {
                video.currentTime = frame;
                lastFrame = frame;
              }
            },
          },
        });

        tl.to(videoWrapRef.current, { scale: 1.1, yPercent: 4, duration: 1, ease: 'power1.inOut' }, 0);

        // Beat 1 — greeting scales down
        tl.to(
          greeting,
          { opacity: 1, scale: 1, y: 0, duration: 0.14, ease: 'power3.out' },
          0.02,
        );

        // Beat 2 — headline tagline slides in with de-blur
        tl.to(
          tagline,
          { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.12, ease: 'power2.out' },
          0.16,
        );

        // Beat 3 — subtitle clip reveal
        tl.to(
          subtitle,
          { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 0.11, ease: 'power2.inOut' },
          0.28,
        );

        // Beat 4 — quick links container + staggered buttons
        tl.to(links, { opacity: 1, y: 0, scale: 1, duration: 0.1, ease: 'power2.out' }, 0.4)
          .to(
            linkItems,
            { opacity: 1, y: 0, scale: 1, duration: 0.08, stagger: 0.04, ease: 'back.out(1.4)' },
            0.42,
          );

        // Beat 5 — email slides in
        tl.to(email, { opacity: 1, x: 0, duration: 0.09, ease: 'power2.out' }, 0.52);

        // Beat 6 — stats pop in one by one
        tl.to(stats, { opacity: 1, duration: 0.04 }, 0.62).to(
          statItems,
          { opacity: 1, y: 0, scale: 1, duration: 0.1, stagger: 0.06, ease: 'back.out(1.6)' },
          0.63,
        );

        // Beat 7 — about link then bio line
        tl.to(about, { opacity: 1, x: 0, duration: 0.09, ease: 'power2.out' }, 0.74).to(
          aboutLine,
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.1, ease: 'power2.out' },
          0.8,
        );

        // Beat 8 — contact CTA
        tl.to(
          contact,
          { opacity: 1, scale: 1, y: 0, duration: 0.11, ease: 'back.out(1.35)' },
          0.88,
        );

        if (scrollHint) {
          tl.to(scrollHint, { opacity: 0, y: 12, duration: 0.08, ease: 'power1.in' }, 0.1);
        }
      }, section);
    };

    if (video.readyState >= 1) setup();
    else video.addEventListener('loadedmetadata', setup, { once: true });

    return () => {
      video.removeEventListener('loadedmetadata', setup);
      ctx?.revert();
    };
  }, [reduceMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !reduceMotion) return;
    video.pause();
    video.currentTime = 0;
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative font-hero text-[var(--surface-accent)]"
      style={{ height: reduceMotion ? undefined : '360vh' }}
    >
      <div
        ref={stickyRef}
        className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]"
      >
        <HeroVideoBackdrop videoRef={videoRef} wrapRef={videoWrapRef} />

        <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-1 flex-col justify-center px-5 py-[max(1.25rem,calc(env(safe-area-inset-top)+0.75rem))] pb-[max(5.5rem,calc(env(safe-area-inset-bottom)+4.5rem))] sm:px-8 lg:px-14">
          {!reduceMotion && (
            <p
              ref={scrollHintRef}
              className="pointer-events-none absolute bottom-[max(5rem,calc(env(safe-area-inset-bottom)+3.5rem))] left-5 flex items-center gap-2 text-[11px] font-medium tracking-[0.02em] text-[color-mix(in_srgb,var(--surface-accent)_55%,transparent)] sm:left-8 lg:left-14"
              aria-hidden
            >
              <span className="inline-block animate-bounce">↓</span>
              Scroll
            </p>
          )}

          <div className="relative max-w-2xl">
            <h1
              ref={greetingRef}
              className={`font-bold leading-[1.02] tracking-[-0.03em] text-[var(--surface-accent-strong)] [text-shadow:0_2px_28px_rgba(0,0,0,0.55)] ${
                reduceMotion ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ fontSize: 'clamp(2.25rem, 7.5vw, 4.75rem)' }}
            >
              Hi, This is{' '}
              <span className="whitespace-nowrap text-[#48E5C2]">
                {'<'}
                {PROFILE.name}
                {'/>'}
              </span>
            </h1>

            <div ref={detailsRef} className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
              <p
                data-hero-step="tagline"
                className="max-w-xl text-pretty text-lg font-light leading-snug text-[color-mix(in_srgb,var(--surface-accent)_92%,transparent)] sm:text-xl lg:text-2xl [text-shadow:0_1px_20px_rgba(0,0,0,0.5)]"
              >
                I ship <span className="font-medium text-[#48E5C2]">AI systems</span> as products,{' '}
                <span className="font-medium text-[var(--surface-accent-strong)]">not demos.</span>
              </p>

              <p
                data-hero-step="subtitle"
                className="max-w-lg text-sm font-medium leading-snug text-[color-mix(in_srgb,var(--surface-accent)_72%,transparent)] sm:text-base"
              >
                {PROFILE.headerSubtitle}
              </p>

              <div data-hero-step="links" className="w-full max-w-[22rem]">
                <HeroQuickLinks className="w-full" />
              </div>

              <div data-hero-step="email">
                <HeroEmailLink className="w-full max-w-[22rem] justify-start" />
              </div>

              <div data-hero-step="stats">
                <HeroStats />
              </div>

              <div data-hero-step="about" className="max-w-md">
                <a href="#about" className="group inline-flex items-center gap-2.5">
                  <span
                    className="h-px w-8 bg-[color-mix(in_srgb,var(--surface-accent)_50%,transparent)] transition-all duration-300 group-hover:w-11 group-hover:bg-[#48E5C2]"
                    aria-hidden
                  />
                  <span className="font-hero text-[11px] font-medium tracking-[0.02em] text-[var(--surface-accent-strong)] transition-colors duration-300 group-hover:text-[#48E5C2]">
                    About me
                  </span>
                  <ChevronDown
                    className="h-3.5 w-3.5 text-[var(--surface-accent-muted)] transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-[#48E5C2]"
                    strokeWidth={2}
                    aria-hidden
                  />
                </a>
              </div>

              <p
                data-hero-step="about-line"
                className="max-w-md text-pretty text-sm font-light leading-relaxed text-[color-mix(in_srgb,var(--surface-accent)_88%,transparent)] sm:text-base [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]"
              >
                {PROFILE.tagline}
              </p>

              <div data-hero-step="contact">
                <ContactButton variant="dark" href="#contact" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
