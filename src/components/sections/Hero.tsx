import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronDown, Download, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { GithubIcon, LinkedinIcon } from '@/components/ui/social-icons';

const ROTATING_TITLES = [
  'Full Stack Developer',
  'Web & Mobile Developer',
  'React · FastAPI · MongoDB',
  'AI Integration Expert',
];

function AnimatedWord({ word, delay }: { word: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="inline-block mr-[0.15em]"
    >
      {word}
    </motion.span>
  );
}

function TiltPhoto({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 20 });
  const springY = useSpring(y, { stiffness: 120, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative cursor-pointer select-none"
    >
      <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#C3E41D]/20 via-transparent to-violet-500/15 blur-lg" />
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#C3E41D]/30 via-white/5 to-violet-500/20" />
      <div className="relative rounded-2xl overflow-hidden border border-[#C3E41D]/20"
        style={{ width: 'clamp(260px, 28vw, 420px)', height: 'clamp(320px, 36vw, 520px)' }}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-top"
          fetchPriority="high"
          decoding="async"
          width={420}
          height={520}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Badge disponible */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-4 -left-4 flex items-center gap-2 px-3 py-2 rounded-xl border border-[#C3E41D]/30 bg-black/90 text-xs font-fira text-white/80 shadow-xl"
        style={{ transform: 'translateZ(20px)' }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C3E41D] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C3E41D]" />
        </span>
        Open to Work
      </motion.div>

      {/* Badge stack */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -top-4 -right-4 px-3 py-2 rounded-xl border border-violet-500/30 bg-black/90 text-xs font-fira text-violet-300 shadow-xl"
        style={{ transform: 'translateZ(20px)' }}
      >
        React · FastAPI · AI
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const { data } = usePortfolio();
  const { profile } = data;
  const [titleIndex, setTitleIndex] = useState(0);
  const [showTitle, setShowTitle] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setShowTitle(false);
      setTimeout(() => { setTitleIndex(i => (i + 1) % ROTATING_TITLES.length); setShowTitle(true); }, 400);
    }, 3200);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="hero" className="relative min-h-screen flex flex-col overflow-hidden" style={{ contain: 'layout style' }}>
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Radial gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-[#C3E41D]/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 left-0 w-[280px] h-[280px] bg-violet-600/6 rounded-full blur-[60px]" />
      </div>

      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full pt-20 pb-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-6">

            {/* Left — text */}
            <div className="flex-1 max-w-2xl order-2 lg:order-1 text-center lg:text-left">

              {/* Pill badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C3E41D]/30 bg-[#C3E41D]/5 text-[#C3E41D] text-xs font-fira mb-8"
              >
                <Sparkles className="w-3 h-3" />
                Portfolio 2026 · Open to Work
              </motion.div>

              {/* Big name */}
              <div className="overflow-hidden mb-4">
                <h1
                  className="font-fira font-black leading-[0.9] tracking-tighter text-white select-none"
                  style={{ fontSize: 'clamp(3.2rem, 8vw, 8.5rem)' }}
                >
                  {'YOUNES'.split('').map((c, i) => (
                    <AnimatedWord key={`y${i}`} word={c} delay={0.1 + i * 0.04} />
                  ))}
                </h1>
              </div>
              <div className="overflow-hidden mb-8">
                <h1
                  className="font-fira font-black leading-[0.9] tracking-tighter select-none"
                  style={{ fontSize: 'clamp(3.2rem, 8vw, 8.5rem)', color: '#C3E41D' }}
                >
                  {'KAMOULY'.split('').map((c, i) => (
                    <AnimatedWord key={`k${i}`} word={c} delay={0.4 + i * 0.04} />
                  ))}
                </h1>
              </div>

              {/* Animated subtitle */}
              <div className="h-8 mb-10 flex items-center justify-center lg:justify-start overflow-hidden">
                <AnimatePresence mode="wait">
                  {showTitle && (
                    <motion.p
                      key={ROTATING_TITLES[titleIndex]}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                      className="text-white/50 text-base md:text-lg font-fira tracking-wide"
                    >
                      <span className="text-[#C3E41D] mr-2">&gt;</span>
                      {ROTATING_TITLES[titleIndex]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="flex gap-8 mb-10 justify-center lg:justify-start"
              >
                {[
                  { n: '10+', label: 'Projets' },
                  { n: '3+', label: 'Ans xp' },
                  { n: '20+', label: 'Technologies' },
                ].map(s => (
                  <div key={s.label} className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-[#C3E41D] font-fira">{s.n}</div>
                    <div className="text-white/30 text-xs">{s.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="flex flex-wrap gap-3 justify-center lg:justify-start"
              >
                <Button size="lg" onClick={() => scrollTo('#projects')} className="group shadow-[0_0_30px_rgba(195,228,29,0.25)]">
                  Voir mes projets
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Me contacter
                  </a>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="Profil GitHub de Younes Kamouly">
                    <GithubIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                    GitHub
                  </a>
                </Button>
                <Button size="lg" variant="ghost" asChild>
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Profil LinkedIn de Younes Kamouly">
                    <LinkedinIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                    LinkedIn
                  </a>
                </Button>
                <Button size="lg" variant="ghost" asChild>
                  <a href={profile.cvUrl} download aria-label="Télécharger le CV de Younes Kamouly">
                    <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                    CV
                  </a>
                </Button>
              </motion.div>
            </div>

            {/* Right — photo */}
            <div className="order-1 lg:order-2 flex-shrink-0">
              <TiltPhoto src={profile.photo} alt={profile.name} />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={() => scrollTo('#about')}
        className="relative z-10 mb-8 mx-auto flex flex-col items-center gap-1.5 text-white/20 hover:text-[#C3E41D] transition-colors group"
      >
        <span className="text-[10px] tracking-[0.3em] font-fira uppercase">scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>
    </section>
  );
}
