import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { track } from '@/lib/analytics';

// Une « vue » par page et par session d'onglet
export default function Analytics() {
  const { pathname } = useLocation();
  const seen = useRef(new Set<string>());

  useEffect(() => {
    if (seen.current.has(pathname)) return;
    seen.current.add(pathname);
    try {
      const key = `yk_pv_${pathname}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch { /* ignore */ }
    track('page_view');
  }, [pathname]);

  return null;
}
