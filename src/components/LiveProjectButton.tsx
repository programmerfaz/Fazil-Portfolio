type LiveProjectButtonProps = {
  href: string;
  label: string;
  className?: string;
};

export function LiveProjectButton({ href, label, className = '' }: LiveProjectButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center rounded-full border-2 border-portfolio-cyan/60 bg-portfolio-surface/40 px-8 py-3 text-sm font-medium uppercase tracking-widest text-portfolio-cyan shadow-glow-cyan backdrop-blur-sm transition-colors hover:border-portfolio-purple/50 hover:bg-portfolio-purple/10 hover:text-portfolio-ink sm:px-10 sm:py-3.5 sm:text-base ${className}`}
    >
      {label}
    </a>
  );
}
