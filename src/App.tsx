import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import { PortfolioProvider } from '@/context/PortfolioContext';
import { LangProvider } from '@/lib/i18n';
import Home from '@/pages/Home';
import Analytics from '@/components/Analytics';

const Admin = lazy(() => import('@/pages/Admin'));
const ProjectPage = lazy(() => import('@/pages/ProjectPage'));
const BlogList = lazy(() => import('@/pages/BlogList'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));

const blank = <div className="min-h-screen bg-bg" />;

export default function App() {
  return (
    <BrowserRouter>
      <LangProvider>
        {/* Animations allégées (domAnimation ≈ 1/3 du poids complet) + respect de « réduire les animations » */}
        <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
        <PortfolioProvider>
          <Analytics />
          <Suspense fallback={blank}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projets/:id" element={<ProjectPage />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </PortfolioProvider>
        </MotionConfig>
        </LazyMotion>
      </LangProvider>
    </BrowserRouter>
  );
}
