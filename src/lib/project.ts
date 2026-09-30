import type { Project } from '@/types/portfolio';

// Un projet a une étude de cas dès qu'au moins une rubrique est remplie
export function hasCaseStudy(p: Project) {
  return Object.values(p.caseStudy ?? {}).some(v => typeof v === 'string' && v.trim());
}

export const hasLink = (u?: string) => !!u && u !== '#';
