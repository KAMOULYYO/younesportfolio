export interface Profile {
  name: string;
  title: string;
  bio: string;
  photo: string;
  cvUrl: string;
  email: string;
  github: string;
  linkedin: string;
  location: string;
  tagline: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'ai';
  level: number;
  icon?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  demoUrl: string;
  category: string;
  featured: boolean;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  type: 'work' | 'academic';
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
  location: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface PortfolioData {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  videos: Video[];
  experiences: Experience[];
  education: Education[];
  testimonials: Testimonial[];
}
