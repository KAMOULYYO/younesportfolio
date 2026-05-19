import { lazy, Suspense } from 'react';
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
const Contact      = lazy(() => import('@/components/sections/Contact'));

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
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
        <Contact />
      </Suspense>
      <Footer />
    </div>
  );
}
