import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PortfolioProvider } from '@/context/PortfolioContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Home from '@/pages/Home';
import Admin from '@/pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <PortfolioProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </PortfolioProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
