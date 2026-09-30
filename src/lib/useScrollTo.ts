import { useLocation, useNavigate } from 'react-router-dom';

// Défile vers une section de l'accueil, même depuis une autre page (/blog, /projets/…)
export function useScrollTo() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (hash: string) => {
    if (pathname !== '/') {
      navigate('/' + hash);
      return;
    }
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
  };
}
