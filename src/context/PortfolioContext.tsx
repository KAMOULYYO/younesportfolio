import React, { createContext, useContext, useState, useEffect } from 'react';
import type { PortfolioData, Profile, Skill, Project, Video, Experience, Education, Testimonial } from '@/types/portfolio';
import { defaultPortfolioData } from '@/data/defaultPortfolioData';

interface PortfolioContextType {
  data: PortfolioData;
  updateProfile: (profile: Profile) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addVideo: (video: Omit<Video, 'id'>) => void;
  updateVideo: (id: string, video: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
  addExperience: (exp: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  addEducation: (edu: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  addTestimonial: (t: Omit<Testimonial, 'id'>) => void;
  updateTestimonial: (id: string, t: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  resetData: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

const STORAGE_KEY = 'portfolio_data';

function loadData(): PortfolioData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as PortfolioData;
  } catch {}
  return defaultPortfolioData;
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioData>(loadData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateProfile = (profile: Profile) =>
    setData(d => ({ ...d, profile }));

  const addSkill = (skill: Omit<Skill, 'id'>) =>
    setData(d => ({ ...d, skills: [...d.skills, { ...skill, id: genId() }] }));

  const updateSkill = (id: string, skill: Partial<Skill>) =>
    setData(d => ({ ...d, skills: d.skills.map(s => s.id === id ? { ...s, ...skill } : s) }));

  const deleteSkill = (id: string) =>
    setData(d => ({ ...d, skills: d.skills.filter(s => s.id !== id) }));

  const addProject = (project: Omit<Project, 'id'>) =>
    setData(d => ({ ...d, projects: [...d.projects, { ...project, id: genId() }] }));

  const updateProject = (id: string, project: Partial<Project>) =>
    setData(d => ({ ...d, projects: d.projects.map(p => p.id === id ? { ...p, ...project } : p) }));

  const deleteProject = (id: string) =>
    setData(d => ({ ...d, projects: d.projects.filter(p => p.id !== id) }));

  const addVideo = (video: Omit<Video, 'id'>) =>
    setData(d => ({ ...d, videos: [...d.videos, { ...video, id: genId() }] }));

  const updateVideo = (id: string, video: Partial<Video>) =>
    setData(d => ({ ...d, videos: d.videos.map(v => v.id === id ? { ...v, ...video } : v) }));

  const deleteVideo = (id: string) =>
    setData(d => ({ ...d, videos: d.videos.filter(v => v.id !== id) }));

  const addExperience = (exp: Omit<Experience, 'id'>) =>
    setData(d => ({ ...d, experiences: [...d.experiences, { ...exp, id: genId() }] }));

  const updateExperience = (id: string, exp: Partial<Experience>) =>
    setData(d => ({ ...d, experiences: d.experiences.map(e => e.id === id ? { ...e, ...exp } : e) }));

  const deleteExperience = (id: string) =>
    setData(d => ({ ...d, experiences: d.experiences.filter(e => e.id !== id) }));

  const addEducation = (edu: Omit<Education, 'id'>) =>
    setData(d => ({ ...d, education: [...d.education, { ...edu, id: genId() }] }));

  const updateEducation = (id: string, edu: Partial<Education>) =>
    setData(d => ({ ...d, education: d.education.map(e => e.id === id ? { ...e, ...edu } : e) }));

  const deleteEducation = (id: string) =>
    setData(d => ({ ...d, education: d.education.filter(e => e.id !== id) }));

  const addTestimonial = (t: Omit<Testimonial, 'id'>) =>
    setData(d => ({ ...d, testimonials: [...d.testimonials, { ...t, id: genId() }] }));

  const updateTestimonial = (id: string, t: Partial<Testimonial>) =>
    setData(d => ({ ...d, testimonials: d.testimonials.map(tm => tm.id === id ? { ...tm, ...t } : tm) }));

  const deleteTestimonial = (id: string) =>
    setData(d => ({ ...d, testimonials: d.testimonials.filter(t => t.id !== id) }));

  const resetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(defaultPortfolioData);
  };

  return (
    <PortfolioContext.Provider value={{
      data, updateProfile,
      addSkill, updateSkill, deleteSkill,
      addProject, updateProject, deleteProject,
      addVideo, updateVideo, deleteVideo,
      addExperience, updateExperience, deleteExperience,
      addEducation, updateEducation, deleteEducation,
      addTestimonial, updateTestimonial, deleteTestimonial,
      resetData,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}
