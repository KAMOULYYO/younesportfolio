import type { PortfolioData } from '@/types/portfolio';
import type { StringKey } from '@/lib/i18n';

// Chiffres calculés à partir du contenu réel (plus de « 500+ commits » inventés) :
// ils se mettent à jour tout seuls quand tu ajoutes un projet ou une compétence dans l'admin.
export function portfolioStats(data: PortfolioData, t: (k: StringKey) => string) {
  const projects = data.projects.filter(p => !p.hidden).length;
  const technologies = new Set(data.skills.map(s => s.name.trim().toLowerCase())).size;
  const experiences = data.experiences.length;
  const education = data.education.length;
  return [
    { value: String(projects), label: t(projects > 1 ? 'stats.projects' : 'stats.project') },
    { value: String(technologies), label: t('stats.tech') },
    { value: String(experiences), label: t(experiences > 1 ? 'stats.exps' : 'stats.exp') },
    { value: String(education), label: t(education > 1 ? 'stats.edus' : 'stats.edu') },
  ];
}
