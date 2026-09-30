import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Mise en page des pages internes (étude de cas, blog) : même en-tête et pied que l'accueil
export default function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  useEffect(() => {
    const prev = document.title;
    document.title = `${title} — Younes Kamouly`;
    window.scrollTo(0, 0);
    return () => { document.title = prev; };
  }, [title]);

  return (
    <div className="min-h-screen bg-bg text-white">
      <Navbar />
      <main className="pt-28 pb-20 px-6">{children}</main>
      <Footer />
    </div>
  );
}
