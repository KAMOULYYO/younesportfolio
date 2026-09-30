import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { initTheme } from './lib/theme';

initTheme();

// Redirection SPA pour GitHub Pages (voir public/404.html) — déplacée ici pour
// ne plus avoir de <script> inline dans index.html (compatible CSP stricte).
(function (l) {
  if (l.search[1] === '/') {
    const d = l.search.slice(1).split('&').map(s => s.replace(/~and~/g, '&')).join('?');
    window.history.replaceState(null, '', l.pathname.slice(0, -1) + d + l.hash);
  }
})(window.location);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
