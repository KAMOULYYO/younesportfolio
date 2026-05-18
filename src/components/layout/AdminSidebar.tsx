import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, User, Code2, FolderOpen, Video, Briefcase,
  GraduationCap, MessageSquare, LogOut, Eye,
} from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/profile', label: 'Profil', icon: User },
  { to: '/admin/skills', label: 'Compétences', icon: Code2 },
  { to: '/admin/projects', label: 'Projets', icon: FolderOpen },
  { to: '/admin/videos', label: 'Vidéos', icon: Video },
  { to: '/admin/experience', label: 'Expériences', icon: Briefcase },
  { to: '/admin/education', label: 'Formation', icon: GraduationCap },
  { to: '/admin/testimonials', label: 'Témoignages', icon: MessageSquare },
];

interface Props {
  onLogout: () => void;
}

export default function AdminSidebar({ onLogout }: Props) {
  return (
    <aside className="w-64 min-h-screen bg-[#080808] border-r border-white/5 flex flex-col sticky top-0">
      <div className="p-6 border-b border-white/5">
        <div className="text-[#C3E41D] font-fira font-bold text-xl tracking-widest">
          YK<span className="text-white">.</span> Admin
        </div>
        <p className="text-white/30 text-xs mt-1">Panneau de gestion</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item, i) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-[#C3E41D]/10 text-[#C3E41D] border border-[#C3E41D]/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <Eye className="w-4 h-4" />
          Voir le portfolio
        </NavLink>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full text-left"
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
