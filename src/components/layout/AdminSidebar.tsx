import { NavLink } from 'react-router-dom';
import { m } from 'framer-motion';
import {
  LayoutDashboard, User, Code2, FolderOpen, Video, Briefcase,
  GraduationCap, MessageSquare, LogOut, Eye, Inbox, BarChart3, PenLine,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/messages', label: 'Messages', icon: Inbox, badge: true },
  { to: '/admin/stats', label: 'Statistiques', icon: BarChart3 },
  { to: '/admin/profile', label: 'Profil', icon: User },
  { to: '/admin/skills', label: 'Compétences', icon: Code2 },
  { to: '/admin/projects', label: 'Projets', icon: FolderOpen },
  { to: '/admin/videos', label: 'Vidéos', icon: Video },
  { to: '/admin/experience', label: 'Expériences', icon: Briefcase },
  { to: '/admin/education', label: 'Formation', icon: GraduationCap },
  { to: '/admin/testimonials', label: 'Témoignages', icon: MessageSquare },
  { to: '/admin/blog', label: 'Blog', icon: PenLine },
];

interface Props {
  onLogout: () => void;
  /** Messages non lus (pastille à côté de « Messages ») */
  unread?: number;
}

export default function AdminSidebar({ onLogout, unread = 0 }: Props) {
  return (
    <aside className="w-full md:w-64 md:h-screen bg-bg border-b md:border-b-0 md:border-r border-white/5 flex flex-col md:sticky top-0">
      <div className="px-4 py-4 md:p-6 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="text-accent font-fira font-bold text-xl tracking-widest">
            YK<span className="text-white">.</span> Admin
          </div>
          <ThemeToggle />
        </div>
        <p className="text-white/30 text-xs mt-1 hidden md:block">Panneau de gestion</p>
      </div>

      {/* Mobile : barre horizontale défilante — Desktop : colonne */}
      <nav className="md:flex-1 p-2 md:p-4 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto whitespace-nowrap">
        {navItems.map((item, i) => (
          <m.div
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
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {'badge' in item && item.badge && unread > 0 && (
                <span className="ml-auto min-w-5 h-5 px-1.5 rounded-full bg-accent text-black text-[10px] font-bold flex items-center justify-center">{unread}</span>
              )}
            </NavLink>
          </m.div>
        ))}
      </nav>

      <div className="p-2 md:p-4 border-t border-white/5 flex md:flex-col gap-1 md:gap-2">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <Eye className="w-4 h-4" />
          Voir le portfolio
        </NavLink>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 md:w-full text-left whitespace-nowrap"
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
