import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { onSnapshot, setDoc } from 'firebase/firestore';
import { portfolioDocRef } from '@/lib/firebase';
import type {
  PortfolioData, Profile, Skill, Project,
  Video, Experience, Education, Testimonial,
} from '@/types/portfolio';
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

function localLoad(): PortfolioData {
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
  const [data, setData] = useState<PortfolioData>(localLoad);
  // true une fois que Firestore a répondu (succès ou erreur)
  const syncedRef = useRef(false);

  // ── Écoute Firestore en temps réel ──────────────────────────────────
  useEffect(() => {
    const unsub = onSnapshot(
      portfolioDocRef,
      (snap) => {
        if (snap.exists()) {
          const remote = snap.data() as PortfolioData;
          setData(remote);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
        } else {
          // Première fois : on pousse les données par défaut sur Firestore
          setDoc(portfolioDocRef, defaultPortfolioData);
        }
        syncedRef.current = true;
      },
      () => {
        // Hors-ligne ou erreur réseau : on garde le localStorage
        syncedRef.current = true;
      },
    );
    return () => unsub();
  }, []);

  // ── Sauvegarde vers Firestore + localStorage à chaque changement ────
  function save(next: PortfolioData) {
    setData(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    // On ne sauvegarde vers Firestore que si la synchro initiale est faite
    // (évite d'écraser les données Firestore avec le localStorage au boot)
    if (syncedRef.current) {
      setDoc(portfolioDocRef, next).catch(() => {/* hors-ligne — pas grave */});
    }
  }

  const updateProfile = (profile: Profile) => save({ ...data, profile });

  const addSkill = (skill: Omit<Skill, 'id'>) =>
    save({ ...data, skills: [...data.skills, { ...skill, id: genId() }] });
  const updateSkill = (id: string, skill: Partial<Skill>) =>
    save({ ...data, skills: data.skills.map(s => s.id === id ? { ...s, ...skill } : s) });
  const deleteSkill = (id: string) =>
    save({ ...data, skills: data.skills.filter(s => s.id !== id) });

  const addProject = (project: Omit<Project, 'id'>) =>
    save({ ...data, projects: [...data.projects, { ...project, id: genId() }] });
  const updateProject = (id: string, project: Partial<Project>) =>
    save({ ...data, projects: data.projects.map(p => p.id === id ? { ...p, ...project } : p) });
  const deleteProject = (id: string) =>
    save({ ...data, projects: data.projects.filter(p => p.id !== id) });

  const addVideo = (video: Omit<Video, 'id'>) =>
    save({ ...data, videos: [...data.videos, { ...video, id: genId() }] });
  const updateVideo = (id: string, video: Partial<Video>) =>
    save({ ...data, videos: data.videos.map(v => v.id === id ? { ...v, ...video } : v) });
  const deleteVideo = (id: string) =>
    save({ ...data, videos: data.videos.filter(v => v.id !== id) });

  const addExperience = (exp: Omit<Experience, 'id'>) =>
    save({ ...data, experiences: [...data.experiences, { ...exp, id: genId() }] });
  const updateExperience = (id: string, exp: Partial<Experience>) =>
    save({ ...data, experiences: data.experiences.map(e => e.id === id ? { ...e, ...exp } : e) });
  const deleteExperience = (id: string) =>
    save({ ...data, experiences: data.experiences.filter(e => e.id !== id) });

  const addEducation = (edu: Omit<Education, 'id'>) =>
    save({ ...data, education: [...data.education, { ...edu, id: genId() }] });
  const updateEducation = (id: string, edu: Partial<Education>) =>
    save({ ...data, education: data.education.map(e => e.id === id ? { ...e, ...edu } : e) });
  const deleteEducation = (id: string) =>
    save({ ...data, education: data.education.filter(e => e.id !== id) });

  const addTestimonial = (t: Omit<Testimonial, 'id'>) =>
    save({ ...data, testimonials: [...data.testimonials, { ...t, id: genId() }] });
  const updateTestimonial = (id: string, t: Partial<Testimonial>) =>
    save({ ...data, testimonials: data.testimonials.map(tm => tm.id === id ? { ...tm, ...t } : tm) });
  const deleteTestimonial = (id: string) =>
    save({ ...data, testimonials: data.testimonials.filter(t => t.id !== id) });

  const resetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDoc(portfolioDocRef, defaultPortfolioData).catch(() => {});
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
