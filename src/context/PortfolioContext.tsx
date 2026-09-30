import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type {
  PortfolioData, Profile, Skill, Project,
  Video, Experience, Education, Testimonial, Post,
} from '@/types/portfolio';
import { defaultPortfolioData } from '@/data/defaultPortfolioData';
import { safeUrl, toVideoUrl } from '@/lib/safeUrl';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface PortfolioContextType {
  data: PortfolioData;
  /** État de la dernière sauvegarde en ligne (affiché dans l'admin) */
  saveStatus: SaveStatus;
  saveError: string | null;
  /** false tant que la base n'a pas répondu : l'admin ne doit pas écrire avant */
  remoteLoaded: boolean;
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
  addPost: (p: Omit<Post, 'id'>) => void;
  updatePost: (id: string, p: Partial<Post>) => void;
  deletePost: (id: string) => void;
  resetData: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);
const STORAGE_KEY = 'portfolio_data';
const SAVE_DEBOUNCE_MS = 600;

// Complète les champs manquants (ancien cache, document partiel) avec les valeurs par défaut
// et neutralise toute URL dangereuse avant qu'elle n'arrive dans un href/src.
function normalize(raw: Partial<PortfolioData> | null | undefined): PortfolioData {
  const d = defaultPortfolioData;
  if (!raw || typeof raw !== 'object') return d;
  const profile = { ...d.profile, ...(raw.profile ?? {}) };
  const projects = Array.isArray(raw.projects) ? raw.projects : d.projects;
  const videos = Array.isArray(raw.videos) ? raw.videos : d.videos;
  const testimonials = Array.isArray(raw.testimonials) ? raw.testimonials : d.testimonials;
  return {
    profile: {
      ...profile,
      photo: safeUrl(profile.photo),
      cvUrl: safeUrl(profile.cvUrl),
      github: safeUrl(profile.github),
      linkedin: safeUrl(profile.linkedin),
      cvUrl_en: safeUrl(profile.cvUrl_en),
      bookingUrl: safeUrl(profile.bookingUrl),
    },
    skills: Array.isArray(raw.skills) ? raw.skills : d.skills,
    projects: projects.map(p => ({
      ...p,
      technologies: Array.isArray(p.technologies) ? p.technologies : [],
      image: safeUrl(p.image),
      githubUrl: safeUrl(p.githubUrl),
      demoUrl: safeUrl(p.demoUrl),
      gallery: Array.isArray(p.gallery) ? p.gallery.map(safeUrl).filter(Boolean) : [],
      videoUrl: toVideoUrl(p.videoUrl),
    })),
    videos: videos.map(v => ({ ...v, url: toVideoUrl(v.url), thumbnail: safeUrl(v.thumbnail) })),
    experiences: Array.isArray(raw.experiences) ? raw.experiences : d.experiences,
    education: Array.isArray(raw.education) ? raw.education : d.education,
    testimonials: testimonials.map(t => ({ ...t, avatar: safeUrl(t.avatar) })),
    posts: (Array.isArray(raw.posts) ? raw.posts : d.posts).map(p => ({
      ...p,
      tags: Array.isArray(p.tags) ? p.tags : [],
      cover: safeUrl(p.cover),
    })),
  };
}

function localLoad(): PortfolioData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return normalize(JSON.parse(saved));
  } catch { /* stockage indisponible */ }
  return defaultPortfolioData;
}

function localStore(data: PortfolioData) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* quota / mode privé */ }
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function errorMessage(e: unknown): string {
  const err = e as { code?: string; message?: string };
  if (err?.code === '42501' || err?.code === 'forbidden') return "Permission refusée : connecte-toi avec le compte admin (email défini dans supabase/setup.sql).";
  if (err?.code === '42P01' || err?.code === 'PGRST205') return "Table introuvable : exécute supabase/setup.sql dans Supabase.";
  if (err?.message?.includes('Failed to fetch')) return 'Hors ligne : impossible de joindre Supabase.';
  return err?.message ?? 'Erreur inconnue';
}

type Supa = typeof import('@/lib/supabase');

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioData>(() => normalize(localLoad()));
  const [remoteLoaded, setRemoteLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  const supaRef = useRef<Supa | null>(null);
  const pendingRef = useRef<PortfolioData | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyRemote = useCallback((raw: unknown) => {
    // Ne pas écraser une modification locale en attente d'envoi
    if (pendingRef.current || !raw) return;
    const remote = normalize(raw as PortfolioData);
    setData(remote);
    localStore(remote);
  }, []);

  // ── Supabase chargé en différé — ne bloque pas le rendu initial ─────
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    import('@/lib/supabase').then(async (mod) => {
      if (cancelled) return;
      supaRef.current = mod;
      const { supabase, isConfigured, PORTFOLIO_ROW_ID } = mod;
      if (!isConfigured) {
        console.warn('[Supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquants : contenu par défaut affiché.');
        setSaveError('Supabase non configuré (fichier .env).');
        setRemoteLoaded(true);
        return;
      }

      const { data: row, error } = await supabase
        .from('portfolio').select('data').eq('id', PORTFOLIO_ROW_ID).maybeSingle();
      if (cancelled) return;
      if (error) {
        console.error('[Supabase] lecture impossible :', error);
        setSaveError(errorMessage(error));
      } else {
        applyRemote(row?.data);
      }
      setRemoteLoaded(true);

      // Temps réel : le site se met à jour dès que l'admin enregistre
      const channel = supabase
        .channel('portfolio-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'portfolio', filter: `id=eq.${PORTFOLIO_ROW_ID}` },
          (payload) => applyRemote((payload.new as { data?: unknown })?.data))
        .subscribe();
      cleanup = () => { supabase.removeChannel(channel); };
    }).catch((err) => {
      console.error('[Supabase] chargement impossible :', err);
      setRemoteLoaded(true);
    });

    return () => { cancelled = true; cleanup?.(); };
  }, [applyRemote]);

  // ── Envoi Supabase (regroupé pour ne pas écrire à chaque frappe) ────
  const flush = useCallback(async () => {
    timerRef.current = null;
    const next = pendingRef.current;
    const mod = supaRef.current;
    if (!next || !mod) return;
    const { supabase, PORTFOLIO_ROW_ID } = mod;
    try {
      // RLS : une mise à jour refusée ne renvoie pas d'erreur, juste 0 ligne → on vérifie
      const { data: rows, error } = await supabase
        .from('portfolio')
        .update({ data: next, updated_at: new Date().toISOString() })
        .eq('id', PORTFOLIO_ROW_ID)
        .select('id');
      if (error) throw error;
      if (!rows?.length) {
        const { error: insErr } = await supabase.from('portfolio').insert({ id: PORTFOLIO_ROW_ID, data: next });
        if (insErr) throw insErr.code === '23505' ? { code: 'forbidden' } : insErr;
      }
      if (pendingRef.current === next) pendingRef.current = null;
      setSaveStatus('saved');
      setSaveError(null);
    } catch (e) {
      console.error('[Supabase] sauvegarde échouée :', e);
      pendingRef.current = null;
      setSaveStatus('error');
      setSaveError(errorMessage(e));
    }
  }, []);

  const schedule = useCallback((next: PortfolioData) => {
    pendingRef.current = next;
    setSaveStatus('saving');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(flush, SAVE_DEBOUNCE_MS);
  }, [flush]);

  // Envoie immédiatement ce qui reste avant de quitter la page
  useEffect(() => {
    const onLeave = () => { if (timerRef.current) { clearTimeout(timerRef.current); flush(); } };
    window.addEventListener('beforeunload', onLeave);
    return () => { window.removeEventListener('beforeunload', onLeave); onLeave(); };
  }, [flush]);

  // Mise à jour fonctionnelle : pas de perte si deux modifications arrivent dans le même rendu
  const mutate = useCallback((fn: (d: PortfolioData) => PortfolioData) => {
    setData(prev => {
      const next = normalize(fn(prev));
      localStore(next);
      schedule(next);
      return next;
    });
  }, [schedule]);

  const updateProfile = (profile: Profile) => mutate(d => ({ ...d, profile }));

  const addSkill = (skill: Omit<Skill, 'id'>) =>
    mutate(d => ({ ...d, skills: [...d.skills, { ...skill, id: genId() }] }));
  const updateSkill = (id: string, skill: Partial<Skill>) =>
    mutate(d => ({ ...d, skills: d.skills.map(s => s.id === id ? { ...s, ...skill } : s) }));
  const deleteSkill = (id: string) =>
    mutate(d => ({ ...d, skills: d.skills.filter(s => s.id !== id) }));

  const addProject = (project: Omit<Project, 'id'>) =>
    mutate(d => ({ ...d, projects: [...d.projects, { ...project, id: genId() }] }));
  const updateProject = (id: string, project: Partial<Project>) =>
    mutate(d => ({ ...d, projects: d.projects.map(p => p.id === id ? { ...p, ...project } : p) }));
  const deleteProject = (id: string) =>
    mutate(d => ({ ...d, projects: d.projects.filter(p => p.id !== id) }));

  const addVideo = (video: Omit<Video, 'id'>) =>
    mutate(d => ({ ...d, videos: [...d.videos, { ...video, id: genId() }] }));
  const updateVideo = (id: string, video: Partial<Video>) =>
    mutate(d => ({ ...d, videos: d.videos.map(v => v.id === id ? { ...v, ...video } : v) }));
  const deleteVideo = (id: string) =>
    mutate(d => ({ ...d, videos: d.videos.filter(v => v.id !== id) }));

  const addExperience = (exp: Omit<Experience, 'id'>) =>
    mutate(d => ({ ...d, experiences: [...d.experiences, { ...exp, id: genId() }] }));
  const updateExperience = (id: string, exp: Partial<Experience>) =>
    mutate(d => ({ ...d, experiences: d.experiences.map(e => e.id === id ? { ...e, ...exp } : e) }));
  const deleteExperience = (id: string) =>
    mutate(d => ({ ...d, experiences: d.experiences.filter(e => e.id !== id) }));

  const addEducation = (edu: Omit<Education, 'id'>) =>
    mutate(d => ({ ...d, education: [...d.education, { ...edu, id: genId() }] }));
  const updateEducation = (id: string, edu: Partial<Education>) =>
    mutate(d => ({ ...d, education: d.education.map(e => e.id === id ? { ...e, ...edu } : e) }));
  const deleteEducation = (id: string) =>
    mutate(d => ({ ...d, education: d.education.filter(e => e.id !== id) }));

  const addTestimonial = (t: Omit<Testimonial, 'id'>) =>
    mutate(d => ({ ...d, testimonials: [...d.testimonials, { ...t, id: genId() }] }));
  const updateTestimonial = (id: string, t: Partial<Testimonial>) =>
    mutate(d => ({ ...d, testimonials: d.testimonials.map(tm => tm.id === id ? { ...tm, ...t } : tm) }));
  const deleteTestimonial = (id: string) =>
    mutate(d => ({ ...d, testimonials: d.testimonials.filter(t => t.id !== id) }));

  const addPost = (p: Omit<Post, 'id'>) =>
    mutate(d => ({ ...d, posts: [{ ...p, id: genId() }, ...d.posts] }));
  const updatePost = (id: string, p: Partial<Post>) =>
    mutate(d => ({ ...d, posts: d.posts.map(x => x.id === id ? { ...x, ...p } : x) }));
  const deletePost = (id: string) =>
    mutate(d => ({ ...d, posts: d.posts.filter(x => x.id !== id) }));

  const resetData = () => mutate(() => defaultPortfolioData);

  return (
    <PortfolioContext.Provider value={{
      data, saveStatus, saveError, remoteLoaded, updateProfile,
      addSkill, updateSkill, deleteSkill,
      addProject, updateProject, deleteProject,
      addVideo, updateVideo, deleteVideo,
      addExperience, updateExperience, deleteExperience,
      addEducation, updateEducation, deleteEducation,
      addTestimonial, updateTestimonial, deleteTestimonial,
      addPost, updatePost, deletePost,
      resetData,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}
