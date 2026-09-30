import { useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';
const KEY = 'theme';

function read(): Theme {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch { /* stockage indisponible */ }
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function apply(theme: Theme) {
  document.documentElement.classList.toggle('light', theme === 'light');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f7f8f3' : '#080808');
}

// Appelé avant le premier rendu (main.tsx) : pas de flash de mauvais thème
export function initTheme() {
  apply(read());
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(read);

  useEffect(() => { apply(theme); }, [theme]);

  const toggle = () => {
    const root = document.documentElement;
    root.classList.add('theme-transition');
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, next); } catch { /* ignore */ }
      return next;
    });
    window.setTimeout(() => root.classList.remove('theme-transition'), 450);
  };

  return { theme, isDark: theme === 'dark', toggle };
}
