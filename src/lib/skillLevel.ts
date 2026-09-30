import type { StringKey } from '@/lib/i18n';

// Un pourcentage (« React 95 % ») n'est pas crédible pour un recruteur :
// on affiche un niveau d'usage réel, déduit du niveau (1–100) saisi dans l'admin.
export function skillLevelLabel(level: number): { label: string; key: StringKey; dots: number } {
  if (level >= 85) return { label: 'Quotidien', key: 'skills.lvl.daily', dots: 3 };
  if (level >= 70) return { label: 'Projets', key: 'skills.lvl.projects', dots: 2 };
  return { label: 'Notions', key: 'skills.lvl.basics', dots: 1 };
}
