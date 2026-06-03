import { ArrowUpRight } from 'lucide-react';
import { PROFILE } from '../data/profile';

type ContactButtonProps = {
  className?: string;
  /** `light` = minimal black CTA for light backgrounds (e.g. editorial hero). */
  variant?: 'dark' | 'light';
};

export function ContactButton({ className = '', variant = 'dark' }: ContactButtonProps) {
  const isLight = variant === 'light';
  const whatsappHref = `https://wa.me/${PROFILE.phoneWhatsappDigits}?text=${encodeURIComponent(PROFILE.whatsappPrefillMessage)}`;

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message Fazil on WhatsApp"
      className={
        isLight
          ? `group inline-flex shrink-0 items-center gap-2 rounded-full border border-portfolio-cyan/40 bg-white/90 px-7 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-portfolio-ink-dark shadow-glass-light backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-200 hover:border-portfolio-purple/40 hover:shadow-glow-cyan active:scale-[0.98] sm:px-9 sm:py-3 sm:text-xs md:text-sm ${className}`
          : `group inline-flex shrink-0 items-center gap-2 rounded-full border border-portfolio-cyan/25 bg-portfolio-surface/40 px-7 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-portfolio-ink shadow-glow-purple backdrop-blur-md transition-[transform,box-shadow,border-color] duration-200 hover:border-portfolio-purple/40 hover:shadow-glow-cyan active:scale-[0.98] sm:px-9 sm:py-3 sm:text-xs md:text-sm ${className}`
      }
      style={
        isLight
          ? {
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(224,242,254,0.85) 40%, rgba(237,233,254,0.75) 100%)',
            }
          : {
              background:
                'linear-gradient(135deg, rgba(6,182,212,0.22) 0%, rgba(139,92,246,0.28) 48%, rgba(3,7,18,0.96) 100%)',
            }
      }
    >
      Contact Me
      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-90 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-4 sm:w-4 md:h-[1.125rem] md:w-[1.125rem]" aria-hidden />
    </a>
  );
}
