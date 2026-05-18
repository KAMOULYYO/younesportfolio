import { motion } from 'framer-motion';
import { usePortfolio } from '@/context/PortfolioContext';
import { FolderOpen, Code2, Video, Briefcase, GraduationCap, MessageSquare, RotateCcw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';

export default function AdminDashboard() {
  const { data, resetData } = usePortfolio();

  const stats = [
    { label: 'Projets', value: data.projects.length, icon: FolderOpen, to: '/admin/projects', color: '#C3E41D' },
    { label: 'Compétences', value: data.skills.length, icon: Code2, to: '/admin/skills', color: '#7c3aed' },
    { label: 'Vidéos', value: data.videos.length, icon: Video, to: '/admin/videos', color: '#06b6d4' },
    { label: 'Expériences', value: data.experiences.length, icon: Briefcase, to: '/admin/experience', color: '#f59e0b' },
    { label: 'Formations', value: data.education.length, icon: GraduationCap, to: '/admin/education', color: '#ec4899' },
    { label: 'Témoignages', value: data.testimonials.length, icon: MessageSquare, to: '/admin/testimonials', color: '#10b981' },
  ];

  const handleReset = () => {
    if (window.confirm('Réinitialiser toutes les données ? Cette action est irréversible.')) {
      resetData();
    }
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Bonjour, <span className="text-[#C3E41D]">{data.profile.name}</span> 👋
        </h1>
        <p className="text-white/40">Gérez le contenu de votre portfolio depuis ce tableau de bord.</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07 }}
          >
            <NavLink
              to={stat.to}
              className="block p-5 rounded-xl border border-white/7 bg-white/3 hover:border-white/15 hover:bg-white/5 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                <span className="text-2xl font-bold font-fira text-white">{stat.value}</span>
              </div>
              <p className="text-white/40 text-sm group-hover:text-white/60 transition-colors">{stat.label}</p>
            </NavLink>
          </motion.div>
        ))}
      </div>

      {/* Profile preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl border border-white/7 bg-white/3 mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <img src={data.profile.photo} alt="" className="w-14 h-14 rounded-xl object-cover border border-white/10" />
          <div>
            <h3 className="text-white font-bold">{data.profile.name}</h3>
            <p className="text-[#C3E41D] text-sm">{data.profile.title}</p>
            <p className="text-white/30 text-xs">{data.profile.email}</p>
          </div>
        </div>
        <p className="text-white/50 text-sm line-clamp-2">{data.profile.bio}</p>
      </motion.div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <a href="/" target="_blank">
            <Eye className="w-4 h-4 mr-2" />
            Voir le portfolio public
          </a>
        </Button>
        <Button variant="destructive" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Réinitialiser les données
        </Button>
      </div>
    </div>
  );
}
