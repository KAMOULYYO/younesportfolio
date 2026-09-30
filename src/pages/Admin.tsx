import { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle, CloudUpload } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { usePortfolio } from '@/context/PortfolioContext';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminDashboard from '@/components/admin/AdminDashboard';
import ManageProfile from '@/components/admin/ManageProfile';
import ManageSkills from '@/components/admin/ManageSkills';
import ManageProjects from '@/components/admin/ManageProjects';
import ManageVideos from '@/components/admin/ManageVideos';
import ManageExperience from '@/components/admin/ManageExperience';
import ManageEducation from '@/components/admin/ManageEducation';
import ManageTestimonials from '@/components/admin/ManageTestimonials';
import ManageMessages from '@/components/admin/ManageMessages';
import ManageStats from '@/components/admin/ManageStats';
import ManageBlog from '@/components/admin/ManageBlog';
import { setNoTrack } from '@/lib/analytics';

function SaveIndicator() {
  const { saveStatus, saveError } = usePortfolio();

  if (saveError || saveStatus === 'error') {
    return (
      <div role="alert" className="flex items-start gap-2 text-red-300 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>Non enregistré en ligne — {saveError}</span>
      </div>
    );
  }
  if (saveStatus === 'saving') {
    return (
      <div className="flex items-center gap-2 text-white/50 text-sm">
        <CloudUpload className="w-4 h-4 animate-pulse" /> Enregistrement…
      </div>
    );
  }
  if (saveStatus === 'saved') {
    return (
      <div className="flex items-center gap-2 text-accent text-sm">
        <CheckCircle className="w-4 h-4" /> Enregistré en ligne
      </div>
    );
  }
  return null;
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const { remoteLoaded } = usePortfolio();
  const [unread, setUnread] = useState(0);

  // Pastille « messages non lus » dans le menu
  const refreshUnread = useCallback(() => {
    supabase.from('messages').select('id', { count: 'exact', head: true }).eq('read', false)
      .then(({ count }) => setUnread(count ?? 0));
  }, []);

  useEffect(() => {
    if (!user) return;
    setNoTrack(true); // tes propres visites ne faussent pas les statistiques
    refreshUnread();
  }, [user, refreshUnread]);

  useEffect(() => {
    // Robots : ne pas indexer l'admin
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);

    supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user ?? null); setChecking(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setChecking(false);
    });
    return () => { sub.subscription.unsubscribe(); meta.remove(); };
  }, []);

  const handleLogout = () => { supabase.auth.signOut(); };

  if (checking || (user && !remoteLoaded)) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-accent animate-spin" aria-label="Chargement" />
      </div>
    );
  }

  if (!user) return <AdminLogin />;

  return (
    <div className="min-h-screen bg-bg text-white flex flex-col md:flex-row">
      <AdminSidebar onLogout={handleLogout} unread={unread} />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="sticky top-0 z-20 flex justify-end px-4 md:px-8 py-3 min-h-[44px] bg-bg/80 backdrop-blur border-b border-white/5">
          <SaveIndicator />
        </div>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="messages" element={<ManageMessages onChange={refreshUnread} />} />
          <Route path="stats" element={<ManageStats />} />
          <Route path="blog" element={<ManageBlog />} />
          <Route path="profile" element={<ManageProfile />} />
          <Route path="skills" element={<ManageSkills />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="videos" element={<ManageVideos />} />
          <Route path="experience" element={<ManageExperience />} />
          <Route path="education" element={<ManageEducation />} />
          <Route path="testimonials" element={<ManageTestimonials />} />
        </Routes>
      </main>
    </div>
  );
}
