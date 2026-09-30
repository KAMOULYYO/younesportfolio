// Convention bilingue : chaque champ texte a une version anglaise facultative `xxx_en`.
// Si elle est vide, le site affiche la version française (voir pick() dans lib/i18n).

export interface Profile {
  name: string;
  title: string;
  title_en?: string;
  bio: string;
  bio_en?: string;
  photo: string;
  cvUrl: string;
  /** CV anglais facultatif (sinon le CV français est proposé) */
  cvUrl_en?: string;
  email: string;
  github: string;
  linkedin: string;
  location: string;
  tagline: string;
  tagline_en?: string;
  /** Ex. « Disponible pour un stage ou un emploi » — vide = badge masqué */
  availability: string;
  availability_en?: string;
  /** Lien de prise de rendez-vous (Calendly, Cal.com…) — vide = bouton masqué */
  bookingUrl?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'ai';
  level: number;
  icon?: string;
}

/** Étude de cas : ce que les recruteurs lisent vraiment */
export interface CaseStudy {
  role: string;
  context: string;
  solution: string;
  architecture: string;
  challenges: string;
  results: string;
}

export interface Project {
  id: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  demoUrl: string;
  /** Accès de démonstration affichés à côté du bouton « Tester l'app » */
  demoLogin?: string;
  demoLogin_en?: string;
  /** Captures d'écran réelles (galerie de l'étude de cas) */
  gallery?: string[];
  /** Vidéo de démo (fichier envoyé ou lien YouTube/Vimeo) */
  videoUrl?: string;
  category: string;
  featured: boolean;
  /** Masqué sur le site public (gardé dans l'admin) */
  hidden?: boolean;
  caseStudy?: Partial<CaseStudy>;
  caseStudy_en?: Partial<CaseStudy>;
}

export interface Video {
  id: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  url: string;
  thumbnail: string;
}

export interface Experience {
  id: string;
  title: string;
  title_en?: string;
  company: string;
  period: string;
  period_en?: string;
  description: string;
  description_en?: string;
  technologies: string[];
  type: 'work' | 'academic';
}

export interface Education {
  id: string;
  degree: string;
  degree_en?: string;
  institution: string;
  period: string;
  period_en?: string;
  description: string;
  description_en?: string;
  location: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  content_en?: string;
  rating: number;
}

/** Article de blog (contenu en Markdown) */
export interface Post {
  id: string;
  slug: string;
  title: string;
  title_en?: string;
  excerpt: string;
  excerpt_en?: string;
  content: string;
  content_en?: string;
  cover?: string;
  tags: string[];
  date: string;
  published: boolean;
}

export interface PortfolioData {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  videos: Video[];
  experiences: Experience[];
  education: Education[];
  testimonials: Testimonial[];
  posts: Post[];
}
