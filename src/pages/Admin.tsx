import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
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

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_auth') === '1');

  useEffect(() => {
    if (authed) sessionStorage.setItem('admin_auth', '1');
  }, [authed]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setAuthed(false);
  };

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-[#080808] text-white flex">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route index element={<AdminDashboard />} />
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
