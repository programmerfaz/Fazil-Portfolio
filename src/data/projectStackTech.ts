import type { SkillTechIconKey } from './skillTechIcons';

/** Lucide fallback when there is no `TECH_BRAND` SVG (or after load failure). */
const STACK_LUCIDE: Partial<Record<string, SkillTechIconKey>> = {
  'Logistic regression': 'brain',
  Regression: 'brain',
  LoRa: 'antenna',
  Sensors: 'cpu',
};

export function projectStackLucideKey(tech: string): SkillTechIconKey {
  return STACK_LUCIDE[tech] ?? 'code';
}
