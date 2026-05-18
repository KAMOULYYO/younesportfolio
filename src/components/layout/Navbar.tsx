import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ExternalLink, ShieldCheck } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { GithubIcon } from '@/components/ui/social-icons';

type NavItem =
  | { label: string; href: string; type: 'scroll' }
  | { label: string; href: string; type: 'external'; icon?: FC<{ className?: string }> }
  | { label: string; href: string; type: 'route' };

const navItems: NavItem[] = [
  { label: 'Accueil', href: '#hero', type: 'scroll' },
  { label: 'À propos', href: '#about', type: 'scroll' },
  { label: 'Compétences', href: '#skills', type: 'scroll' },
  { label: 'Projets', href: '#projects', type: 'scroll' },
  { label: 'Vidéos', href: '#videos', type: 'scroll' },
  { label: 'GitHub', href: 'https://github.com/KAMOULYYO', type: 'external', icon: GithubIcon },
  { label: 'Contact', href: '#contact', type: 'scroll' },
  { label: 'Admin', href: '/admin', type: 'route' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleNav = (item: NavItem) => {
    setMenuOpen(false);
    if (item.type === 'scroll') {
      document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
    } else if (item.type === 'external') {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    } else if (item.type === 'route') {
      navigate(item.href);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'backdrop-blur-xl bg-black/60 border-b border-white/5' : ''
      }`}
    >
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-6 py-5">
        {/* Hamburger */}
        <div ref={menuRef} className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-white/60 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen
              ? <X className="w-7 h-7" />
              : <Menu className="w-7 h-7" />
            }
          </motion.button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 mt-3 w-56 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl p-2 shadow-2xl shadow-black/50"
              >
                {navItems.map((item, i) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => handleNav(item)}
                    className={`flex items-center justify-between w-full text-left text-sm font-bold tracking-wider py-2.5 px-3.5 rounded-xl transition-all duration-200 group ${
                      item.label === 'Admin'
                        ? 'text-[#C3E41D]/60 hover:text-[#C3E41D] hover:bg-[#C3E41D]/8'
                        : 'text-white/60 hover:text-[#C3E41D] hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {item.type === 'external' && 'icon' in item && item.icon && (
                        <item.icon className="w-3.5 h-3.5" />
                      )}
                      {item.label === 'Admin' && <ShieldCheck className="w-3.5 h-3.5" />}
                      {item.label}
                    </span>
                    {item.type === 'external' && (
                      <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-[#C3E41D]/50 transition-colors" />
                    )}
                  </motion.button>
                ))}

                {/* Separator + version */}
                <div className="mt-2 pt-2 border-t border-white/5 px-3.5">
                  <p className="text-white/20 text-[10px] font-fira">Portfolio 2026 · YK</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#C3E41D] text-2xl font-bold font-fira tracking-widest cursor-pointer"
          onClick={() => document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' })}
        >
          YK<span className="text-white">.</span>
        </motion.div>

        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2 text-white/60 hover:text-white transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
      </nav>
    </header>
  );
}
