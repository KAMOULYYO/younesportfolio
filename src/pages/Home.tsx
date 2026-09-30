import { lazy, Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';

const GitHubSection = lazy(() => import('@/components/sections/GitHubSection'));
const Videos       = lazy(() => import('@/components/sections/Videos'));
const Experience   = lazy(() => import('@/components/sections/Experience'));
const Education    = lazy(() => import('@/components/sections/Education'));
const Testimonials = lazy(() => import('@/components/sections/Testimonials'));
const BlogTeaser   = lazy(() => import('@/components/sections/BlogTeaser'));
const Contact      = lazy(() => import('@/components/sections/Contact'));
const Assistant    = lazy(() => import('@/components/AssistantWidget'));

// Arrivée via un lien « /#contact » depuis une autre page : on attend que la section
// (chargée en différé) existe, puis on défile jusqu'à elle.
function useHashScroll() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    let tries = 0;
    const id = window.setInterval(() => {
      const el = document.querySelector(hash);
      if (el || ++tries > 30) {
        window.clearInterval(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [hash]);
}

export default function Home() {
  useHashScroll();

  return (
    <div className="min-h-screen bg-bg text-white">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Suspense fallback={null}>
        <GitHubSection />
        <Videos />
        <Experience />
        <Education />
        <Testimonials />
        <BlogTeaser />
        <Contact />
        <Assistant />
      </Suspense>
      <Footer />
    </div>
  );
}
