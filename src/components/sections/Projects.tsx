import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { m, useInView, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, Star, ArrowUpRight, BookOpen } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GithubIcon } from '@/components/ui/social-icons';
import { ProjectCover } from '@/components/ui/project-cover';
import { useLang } from '@/lib/i18n';
import { hasCaseStudy, hasLink } from '@/lib/project';
import type { Project } from '@/types/portfolio';

// 3D tilt card
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 25 });
  const sy = useSpring(y, { stiffness: 150, damping: 25 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-5, 5]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <m.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={`relative ${className}`}
    >
      {children}
    </m.div>
  );
}

function ProjectLinks({ project, stretch = false }: { project: Project; stretch?: boolean }) {
  const { t } = useLang();
  const cls = stretch ? 'flex-1 text-xs' : '';
  return (
    <>
      {hasCaseStudy(project) && (
        <Button variant="secondary" size="sm" asChild className={cls}>
          <Link to={`/projets/${project.id}`}>
            <BookOpen className="w-3.5 h-3.5 mr-1.5" /> {t('projects.caseShort')}
          </Link>
        </Button>
      )}
      {hasLink(project.githubUrl) && (
        <Button variant="outline" size="sm" asChild className={cls}>
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            <GithubIcon className="w-3.5 h-3.5 mr-1.5" /> {t('projects.code')}
          </a>
        </Button>
      )}
      {hasLink(project.demoUrl) && (
        <Button size="sm" asChild className={cls}>
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
            {t('projects.demo')} <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </a>
        </Button>
      )}
    </>
  );
}

// Featured (large) project card
function FeaturedCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { t, pick } = useLang();

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="spotlight group relative rounded-2xl overflow-hidden border border-white/8 bg-white/2 hover:border-accent/25 transition-all duration-500"
    >
      <div className="flex flex-col lg:flex-row">
        <div className="relative lg:w-1/2 h-56 lg:h-auto overflow-hidden flex-shrink-0">
          <div className="w-full h-full min-h-56 transition-transform duration-500 group-hover:scale-[1.04]">
            <ProjectCover src={project.image} title={pick(project.title, project.title_en)} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-bg lg:block hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-black/30 to-transparent lg:hidden" />
          <div className="absolute top-4 left-4">
            <span className="flex items-center gap-1.5 text-xs bg-accent text-black font-bold px-2.5 py-1 rounded-full shadow-lg">
              <Star className="w-3 h-3" fill="currentColor" /> {t('projects.featured')}
            </span>
          </div>
        </div>

        <div className="lg:w-1/2 p-7 lg:p-10 flex flex-col justify-center">
          <div className="mb-3">
            <Badge variant="secondary" className="text-xs mb-3">{project.category}</Badge>
            <h3 className="text-white font-bold text-2xl md:text-3xl mb-3 group-hover:text-accent transition-colors duration-300">
              {pick(project.title, project.title_en)}
            </h3>
            <p className="text-white/50 text-sm leading-relaxed">{pick(project.description, project.description_en)}</p>
          </div>

          <div className="flex flex-wrap gap-2 my-5">
            {project.technologies.map(tech => (
              <Badge key={tech} className="text-xs">{tech}</Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <ProjectLinks project={project} />
          </div>
        </div>
      </div>
    </m.div>
  );
}

// Regular project card with tilt
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { t, pick } = useLang();
  const nothing = !hasCaseStudy(project) && !hasLink(project.githubUrl) && !hasLink(project.demoUrl);

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <TiltCard className="group h-full">
        <div className="spotlight h-full rounded-2xl border border-white/8 bg-white/2 hover:border-accent/25 transition-all duration-500 overflow-hidden flex flex-col">
          <div className="relative h-44 overflow-hidden flex-shrink-0">
            <div className="w-full h-full transition-transform duration-500 group-hover:scale-[1.06]">
              <ProjectCover src={project.image} title={pick(project.title, project.title_en)} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-black/20 to-transparent" />
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="text-xs">{project.category}</Badge>
            </div>
            {hasLink(project.demoUrl) && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('projects.demo')}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-accent hover:text-black transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-white font-bold text-lg mb-2 group-hover:text-accent transition-colors duration-300 leading-tight">
              {pick(project.title, project.title_en)}
            </h3>
            <p className="text-white/40 text-xs leading-relaxed mb-4 flex-1 line-clamp-3">
              {pick(project.description, project.description_en)}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.technologies.slice(0, 4).map(tech => (
                <Badge key={tech} className="text-[10px] py-0">{tech}</Badge>
              ))}
              {project.technologies.length > 4 && (
                <Badge variant="secondary" className="text-[10px] py-0">+{project.technologies.length - 4}</Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
              {nothing
                ? <span className="text-white/30 text-[10px] font-fira">{t('projects.private')}</span>
                : <ProjectLinks project={project} stretch />}
            </div>
          </div>
        </div>
      </TiltCard>
    </m.div>
  );
}

export default function Projects() {
  const { data } = usePortfolio();
  const { t } = useLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [filter, setFilter] = useState<string>('all');

  // Les projets « masqués » dans l'admin ne sont pas affichés au public
  const visible = data.projects.filter(p => !p.hidden);
  const categories = ['all', ...Array.from(new Set(visible.map(p => p.category)))];
  const filtered = filter === 'all' ? visible : visible.filter(p => p.category === filter);
  const featured = filtered.filter(p => p.featured);
  const regular = filtered.filter(p => !p.featured);

  return (
    <section id="projects" className="py-28 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto" ref={ref}>
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="text-accent font-fira text-sm tracking-widest">&gt; my.projects</span>
          <h2 className="text-4xl md:text-6xl font-black mt-2 text-white leading-tight">
            {t('projects.title1')}<br /><span className="text-accent">{t('projects.title2')}</span>
          </h2>
          <p className="text-white/40 mt-4 max-w-xl text-sm">{t('projects.sub')}</p>
        </m.div>

        {categories.length > 2 && (
          <m.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-12"
          >
            {categories.map(cat => (
              <m.button
                key={cat}
                onClick={() => setFilter(cat)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                  filter === cat
                    ? 'bg-accent text-black shadow-[0_0_15px_rgba(195,228,29,0.4)]'
                    : 'border border-white/10 text-white/40 hover:border-accent/40 hover:text-white/70'
                }`}
              >
                {cat === 'all' ? t('projects.all') : cat}
              </m.button>
            ))}
          </m.div>
        )}

        <AnimatePresence mode="wait">
          <m.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {featured.length > 0 && (
              <div className="space-y-6">
                {featured.map((p, i) => <FeaturedCard key={p.id} project={p} index={i} />)}
              </div>
            )}
            {regular.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {regular.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
              </div>
            )}
          </m.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
