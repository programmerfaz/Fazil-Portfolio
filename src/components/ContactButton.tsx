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
          ? `group inline-flex shrink-0 items-center gap-2 rounded-full border border-neutral-900 bg-neutral-900 px-7 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-[transform,background-color,border-color] duration-200 hover:bg-neutral-800 hover:border-neutral-800 active:scale-[0.98] sm:px-9 sm:py-3 sm:text-xs md:text-sm ${className}`
          : `group inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-7 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_12px_40px_-16px_rgba(124,58,237,0.45)] backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-200 hover:border-white/18 hover:shadow-[0_16px_48px_-12px_rgba(124,58,237,0.55)] active:scale-[0.98] sm:px-9 sm:py-3 sm:text-xs md:text-sm ${className}`
      }
      style={
        isLight
          ? undefined
          : {
              background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.95) 0%, rgba(109, 40, 217, 0.92) 45%, rgba(30, 27, 75, 0.98) 100%)',
            }
      }
    >
      Contact Me
      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-90 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-4 sm:w-4 md:h-[1.125rem] md:w-[1.125rem]" aria-hidden />
    </a>
  );
}
