import { FileText, Linkedin } from 'lucide-react';
import { PROFILE } from '../data/profile';

const shineClass =
  'pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full';

type ProfileLinkButtonsProps = {
  /** `light` for editorial/paper backgrounds; `dark` for the main portfolio sections. */
  variant?: 'light' | 'dark';
  className?: string;
  align?: 'start' | 'center' | 'end';
};

export function ProfileLinkButtons({
  variant = 'dark',
  className = '',
  align = 'center',
}: ProfileLinkButtonsProps) {
  const isLight = variant === 'light';
  const alignClass =
    align === 'start' ? 'justify-start' : align === 'end' ? 'justify-end' : 'justify-center';

  const base =
    'group relative inline-flex items-center gap-2 overflow-hidden rounded-lg border-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-[background-color,box-shadow,border-color,transform] duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.98] sm:px-5 sm:py-3 sm:text-xs';

  const cvClass = isLight
    ? `${base} border-neutral-900 bg-neutral-900 text-white hover:border-neutral-700 hover:bg-neutral-800 hover:shadow-[0_10px_28px_-12px_rgba(23,23,23,0.55)]`
    : `${base} border-[#D7E2EA]/20 bg-[#141416] text-white hover:border-[#D7E2EA]/35 hover:bg-[#1A1A1E] hover:shadow-[0_10px_28px_-12px_rgba(0,0,0,0.55)]`;

  const linkedinClass = isLight
    ? `${base} border-[#0A66C2] bg-[#0A66C2] text-white shadow-[0_8px_24px_-10px_rgba(10,102,194,0.65)] hover:border-[#004182] hover:bg-[#004182] hover:shadow-[0_12px_32px_-8px_rgba(10,102,194,0.75)]`
    : `${base} border-[#0A66C2] bg-[#0A66C2] text-white shadow-[0_8px_24px_-10px_rgba(10,102,194,0.45)] hover:border-[#004182] hover:bg-[#004182] hover:shadow-[0_12px_32px_-8px_rgba(10,102,194,0.65)]`;

  const iconClass =
    'relative h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:scale-110 sm:h-[1.125rem] sm:w-[1.125rem]';

  return (
    <div className={`flex flex-wrap items-center gap-2 sm:gap-3 ${alignClass} ${className}`}>
      <a href={PROFILE.cvUrl} target="_blank" rel="noopener noreferrer" className={cvClass}>
        <span className={shineClass} aria-hidden />
        <FileText className={iconClass} strokeWidth={2} aria-hidden />
        View CV
      </a>
      <a href={PROFILE.linkedinUrl} target="_blank" rel="noopener noreferrer" className={linkedinClass}>
        <span className={shineClass} aria-hidden />
        <Linkedin className={iconClass} strokeWidth={0} fill="currentColor" aria-hidden />
        LinkedIn
      </a>
    </div>
  );
}
