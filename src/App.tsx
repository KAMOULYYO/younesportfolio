import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PortfolioProvider } from '@/context/PortfolioContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Home from '@/pages/Home';

const Admin = lazy(() => import('@/pages/Admin'));

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <PortfolioProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/*" element={
              <Suspense fallback={null}>
                <Admin />
              </Suspense>
            } />
          </Routes>
        </PortfolioProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
