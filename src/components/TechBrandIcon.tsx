import { useCallback, useState } from 'react';
import { Code2, type LucideIcon } from 'lucide-react';
import { SKILL_TECH_ICON_MAP, type SkillTechIconKey } from '../data/skillTechIcons';
import { TECH_BRAND } from '../data/techSimpleSlugs';

type TechBrandIconProps = {
  name: string;
  lucideKey: SkillTechIconKey;
  size?: number;
  className?: string;
  /** Lucide fallback styling when SVG is missing */
  surface?: 'light' | 'dark';
};

export function TechBrandIcon({
  name,
  lucideKey,
  size = 22,
  className = '',
  surface = 'light',
}: TechBrandIconProps) {
  const spec = TECH_BRAND[name];
  const [imgFailed, setImgFailed] = useState(false);
  const onError = useCallback(() => setImgFailed(true), []);

  const LucideFallback = (SKILL_TECH_ICON_MAP[lucideKey] ?? Code2) as LucideIcon;

  const fallbackWrap =
    surface === 'dark'
      ? 'rounded-lg p-1.5 ring-1 ring-white/15 bg-white/[0.06]'
      : 'rounded-lg p-1.5 ring-1 ring-black/10';

  const fallbackIcon = surface === 'dark' ? 'text-lime-300' : 'text-violet-950';

  if (!spec || imgFailed) {
    return (
      <span className={`inline-flex items-center justify-center ${fallbackWrap} ${className}`}>
        <LucideFallback width={size} height={size} strokeWidth={2.25} className={fallbackIcon} aria-hidden />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center justify-center p-1 ${className}`}>
      <img
        src={spec.iconUrl}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className="object-contain"
        onError={onError}
      />
    </span>
  );
}
