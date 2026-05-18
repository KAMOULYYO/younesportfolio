import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import GitHubSection from '@/components/sections/GitHubSection';
import Videos from '@/components/sections/Videos';
import Experience from '@/components/sections/Experience';
import Education from '@/components/sections/Education';
import Testimonials from '@/components/sections/Testimonials';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <GitHubSection />
      <Videos />
      <Experience />
      <Education />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
