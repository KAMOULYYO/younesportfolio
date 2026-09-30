import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Menu, X, Mail, ExternalLink, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GithubIcon } from '@/components/ui/social-icons';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LangToggle } from '@/components/ui/lang-toggle';
import { usePortfolio } from '@/context/PortfolioContext';
import { useLang, type StringKey } from '@/lib/i18n';
import { useScrollTo } from '@/lib/useScrollTo';
import { useSpotlight } from '@/lib/useSpotlight';

type NavItem =
  | { key: StringKey; href: string; type: 'scroll' }
  | { key: StringKey | 'github'; href: string; type: 'external'; icon?: FC<{ className?: string }> }
  | { key: StringKey; href: string; type: 'route' };

const navItems: NavItem[] = [
  { key: 'nav.home', href: '#hero', type: 'scroll' },
  { key: 'nav.about', href: '#about', type: 'scroll' },
  { key: 'nav.skills', href: '#skills', type: 'scroll' },
  { key: 'nav.projects', href: '#projects', type: 'scroll' },
  { key: 'nav.videos', href: '#videos', type: 'scroll' },
  { key: 'nav.blog', href: '/blog', type: 'route' },
  { key: 'github', href: 'https://github.com/KAMOULYYO', type: 'external', icon: GithubIcon },
  { key: 'nav.contact', href: '#contact', type: 'scroll' },
  { key: 'nav.admin', href: '/admin', type: 'route' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const scrollTo = useScrollTo();
  useSpotlight();
  const { data } = usePortfolio();
  const { t } = useLang();
  // Pas de lien vers une section vide (aucune vidéo / aucun article publié)
  const hasPosts = data.posts.some(p => p.published);
  const items = navItems.filter(i =>
    (i.href !== '#videos' || data.videos.length > 0) && (i.href !== '/blog' || hasPosts));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleNav = (item: NavItem) => {
    setMenuOpen(false);
    if (item.type === 'scroll') scrollTo(item.href);
    else if (item.type === 'external') window.open(item.href, '_blank', 'noopener,noreferrer');
    else navigate(item.href);
  };

  const label = (item: NavItem) => (item.key === 'github' ? 'GitHub' : t(item.key));

  return (
    <>
    <div className="scroll-progress" aria-hidden="true" />
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'backdrop-blur-xl bg-bg/85 border-b border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.12)]' : ''
      }`}
    >
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-6 py-5">
        {/* Hamburger */}
        <div ref={menuRef} className="relative">
          <m.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-white/60 hover:text-white transition-colors"
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </m.button>

          <AnimatePresence>
            {menuOpen && (
              <m.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 mt-3 w-56 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl p-2 shadow-2xl shadow-black/50"
              >
                {items.map((item, i) => (
                  <m.button
                    key={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => handleNav(item)}
                    className={`flex items-center justify-between w-full text-left text-sm font-bold tracking-wider py-2.5 px-3.5 rounded-xl transition-all duration-200 group ${
                      item.href === '/admin'
                        ? 'text-accent/60 hover:text-accent hover:bg-accent/8'
                        : 'text-white/60 hover:text-accent hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {item.type === 'external' && 'icon' in item && item.icon && (
                        <item.icon className="w-3.5 h-3.5" />
                      )}
                      {item.href === '/admin' && <ShieldCheck className="w-3.5 h-3.5" />}
                      {label(item)}
                    </span>
                    {item.type === 'external' && (
                      <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-accent/50 transition-colors" />
                    )}
                  </m.button>
                ))}

                <div className="mt-2 pt-2 border-t border-white/5 px-3.5">
                  <p className="text-white/20 text-[10px] font-fira">Portfolio 2026 · YK</p>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logo */}
        <m.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          aria-label={`YK. — ${t('nav.top')}`}
          className="text-accent text-2xl font-bold font-fira tracking-widest cursor-pointer"
          onClick={() => scrollTo('#hero')}
        >
          YK<span className="text-white">.</span>
        </m.button>

        <div className="flex items-center gap-2">
          <LangToggle />
          <ThemeToggle />
          <button
            onClick={() => scrollTo('#contact')}
            className="flex items-center gap-2 h-9 px-3 rounded-full border border-accent/30 text-accent text-xs font-fira font-bold hover:bg-accent hover:text-black transition-colors"
          >
            <Mail className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{t('nav.contact')}</span>
            <span className="sr-only sm:hidden">{t('nav.contact')}</span>
          </button>
        </div>
      </nav>
    </header>
    </>
  );
}
