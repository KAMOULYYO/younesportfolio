import { useRef } from 'react';
import { m, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronDown, Download, Mail, ArrowRight, MapPin, CalendarClock } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { GithubIcon, LinkedinIcon } from '@/components/ui/social-icons';
import { hasCv } from '@/lib/safeUrl';
import { portfolioStats } from '@/lib/stats';
import { useLang } from '@/lib/i18n';
import { track } from '@/lib/analytics';
import { TechMarquee } from '@/components/ui/tech-marquee';


function AnimatedWord({ word, delay }: { word: string; delay: number }) {
  return (
    <m.span
      // Glisse depuis le bas (masqué par overflow-hidden) : pas d'opacité 0 → affichage immédiat pour Google
      initial={{ y: '18%' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="inline-block mr-[0.15em]"
    >
      {word}
    </m.span>
  );
}

function TiltPhoto({ alt, available }: { alt: string; available: boolean }) {
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
    <m.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      initial={{ scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative cursor-pointer select-none"
    >
      <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-accent/20 via-transparent to-violet-500/15 blur-lg" />
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-accent/30 via-white/5 to-violet-500/20" />
      <div className="relative rounded-2xl overflow-hidden border border-accent/20"
        style={{ width: 'clamp(260px, 28vw, 420px)', height: 'clamp(320px, 36vw, 520px)' }}>
        <img
          src="/images/profile-hero.webp"
          alt={alt}
          className="w-full h-full object-cover object-top"
          fetchPriority="high"
          decoding="async"
          width={520}
          height={640}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Badge disponible (masqué si « Disponibilité » est vide dans l'admin) */}
      {available && <m.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-4 -left-4 flex items-center gap-2 px-3 py-2 rounded-xl border border-accent/30 bg-black/90 text-xs font-fira text-white/80 shadow-xl"
        style={{ transform: 'translateZ(20px)' }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
        </span>
        Open to Work
      </m.div>}

      {/* Badge stack */}
      <m.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -top-4 -right-4 px-3 py-2 rounded-xl border border-violet-500/30 bg-black/90 text-xs font-fira text-violet-300 shadow-xl"
        style={{ transform: 'translateZ(20px)' }}
      >
        React · FastAPI · AI
      </m.div>
    </m.div>
  );
}

export default function Hero() {
  const { data } = usePortfolio();
  const { profile } = data;
  const { t, pick, lang } = useLang();
  const stats = portfolioStats(data, t).slice(0, 3);
  const availability = pick(profile.availability, profile.availability_en);
  const tagline = pick(profile.tagline, profile.tagline_en);
  const cvUrl = lang === 'en' && hasCv(profile.cvUrl_en ?? '') ? profile.cvUrl_en! : profile.cvUrl;

  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="hero" className="hero-glow-host relative min-h-screen flex flex-col overflow-hidden" style={{ contain: 'layout style' }}>
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      {/* Halo qui suit la souris */}
      <div className="absolute inset-0 hero-glow pointer-events-none" />

      {/* Radial gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-accent/5 rounded-full blur-[80px]" />
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
        <div className="max-w-7xl mx-auto px-6 w-full pt-28 lg:pt-20 pb-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-6">

            {/* Left — text */}
            <div className="flex-1 max-w-2xl order-2 lg:order-1 text-center lg:text-left">

              {/* Disponibilité — la 1re info qu'un recruteur cherche */}
              {availability && (
                <m.div
                  initial={{ y: -8 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-fira mb-8"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                  </span>
                  {availability}
                </m.div>
              )}

              {/* Big name — un seul h1 (SEO / lecteurs d'écran) */}
              <h1
                aria-label="Younes Kamouly"
                className="font-fira font-black leading-[0.9] tracking-tighter select-none mb-8"
                style={{ fontSize: 'clamp(3.2rem, 8vw, 8.5rem)' }}
              >
                <span aria-hidden="true" className="block overflow-hidden mb-4 text-white">
                  {'YOUNES'.split('').map((c, i) => (
                    <AnimatedWord key={`y${i}`} word={c} delay={0.1 + i * 0.04} />
                  ))}
                </span>
                <span aria-hidden="true" className="block overflow-hidden text-accent name-glow">
                  {'KAMOULY'.split('').map((c, i) => (
                    <AnimatedWord key={`k${i}`} word={c} delay={0.4 + i * 0.04} />
                  ))}
                </span>
              </h1>

              {/* Phrase d'accroche : qui, où, quoi — lisible en 5 secondes */}
              <m.div
                initial={{ y: 12 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-10 space-y-3"
              >
                <p className="text-white/60 text-base md:text-lg font-fira tracking-wide flex flex-wrap items-center justify-center lg:justify-start gap-x-2">
                  <span className="text-accent">&gt;</span>
                  <span className="text-white">{pick(profile.title, profile.title_en)}</span>
                  {profile.location && (
                    <span className="inline-flex items-center gap-1 text-white/50">
                      · <MapPin className="w-3.5 h-3.5" aria-hidden="true" /> {profile.location}
                    </span>
                  )}
                </p>
                {tagline && (
                  <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
                    {tagline}
                  </p>
                )}
              </m.div>

              {/* Stats row */}
              <m.div
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex gap-8 mb-10 justify-center lg:justify-start"
              >
                {stats.map(s => (
                  <div key={s.label} className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-accent font-fira">{s.value}</div>
                    <div className="text-white/30 text-xs">{s.label}</div>
                  </div>
                ))}
              </m.div>

              {/* CTA Buttons */}
              <m.div
                initial={{ y: 16 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="flex flex-wrap gap-3 justify-center lg:justify-start"
              >
                <Button size="lg" onClick={() => scrollTo('#projects')} className="group shadow-[0_0_30px_rgba(195,228,29,0.25)]">
                  {t('hero.projects')}
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => scrollTo('#contact')}>
                  <Mail className="w-4 h-4 mr-2" />
                  {t('hero.contact')}
                </Button>
                {profile.bookingUrl && (
                  <Button size="lg" variant="outline" asChild>
                    <a href={profile.bookingUrl} target="_blank" rel="noopener noreferrer" onClick={() => track('booking_click', 'hero')}>
                      <CalendarClock className="w-4 h-4 mr-2" aria-hidden="true" />
                      {t('hero.book')}
                    </a>
                  </Button>
                )}
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
                {hasCv(cvUrl) && (
                  <Button size="lg" variant="ghost" asChild>
                    <a href={cvUrl} target="_blank" rel="noopener noreferrer" aria-label={`${t('hero.cv')} — Younes Kamouly (PDF)`} onClick={() => track('cv_open', 'hero')}>
                      <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                      {t('hero.cv')}
                    </a>
                  </Button>
                )}
              </m.div>
            </div>

            {/* Right — photo */}
            <div className="order-1 lg:order-2 flex-shrink-0">
              <TiltPhoto alt={profile.name} available={Boolean(availability)} />
            </div>
          </div>
        </div>
      </div>

      {/* Technologies qui défilent */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 mb-6">
        <TechMarquee />
      </div>

      {/* Scroll indicator */}
      <m.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={() => scrollTo('#about')}
        className="relative z-10 mb-8 mx-auto flex flex-col items-center gap-1.5 text-white/20 hover:text-accent transition-colors group"
      >
        <span className="text-[10px] tracking-[0.3em] font-fira uppercase">{t('hero.scroll')}</span>
        <m.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown className="w-4 h-4" />
        </m.div>
      </m.button>
    </section>
  );
}
