import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, Star, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GithubIcon } from '@/components/ui/social-icons';
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
  const glowX = useTransform(sx, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(sy, [-0.5, 0.5], ['0%', '100%']);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={`relative ${className}`}
    >
      {/* Moving glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(195,228,29,0.08) 0%, transparent 60%)`,
        }}
      />
      {children}
    </motion.div>
  );
}

// Featured (large) project card
function FeaturedCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl overflow-hidden border border-white/8 bg-white/2 hover:border-[#C3E41D]/25 transition-all duration-500"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Image */}
        <div className="relative lg:w-1/2 h-56 lg:h-auto overflow-hidden flex-shrink-0">
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.5 }}
            loading="lazy"
            decoding="async"
            width={600}
            height={400}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#080808] lg:block hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/30 to-transparent lg:hidden" />
          <div className="absolute top-4 left-4">
            <span className="flex items-center gap-1.5 text-xs bg-[#C3E41D] text-black font-bold px-2.5 py-1 rounded-full shadow-lg">
              <Star className="w-3 h-3" fill="black" /> Featured
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="lg:w-1/2 p-7 lg:p-10 flex flex-col justify-center">
          <div className="mb-3">
            <Badge variant="secondary" className="text-xs mb-3">{project.category}</Badge>
            <h3 className="text-white font-bold text-2xl md:text-3xl mb-3 group-hover:text-[#C3E41D] transition-colors duration-300">
              {project.title}
            </h3>
            <p className="text-white/50 text-sm leading-relaxed">{project.description}</p>
          </div>

          <div className="flex flex-wrap gap-2 my-5">
            {project.technologies.map(tech => (
              <Badge key={tech} className="text-xs">{tech}</Badge>
            ))}
          </div>

          <div className="flex gap-3">
            {project.githubUrl && project.githubUrl !== '#' && (
              <Button variant="outline" size="sm" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <GithubIcon className="w-3.5 h-3.5 mr-1.5" /> Code
                </a>
              </Button>
            )}
            {project.demoUrl && project.demoUrl !== '#' && (
              <Button size="sm" asChild>
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  Live Demo <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Regular project card with tilt
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <TiltCard className="group h-full">
        <div className="h-full rounded-2xl border border-white/8 bg-white/2 hover:border-[#C3E41D]/25 transition-all duration-500 overflow-hidden flex flex-col">
          {/* Image */}
          <div className="relative h-44 overflow-hidden flex-shrink-0">
            <motion.img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.5 }}
              loading="lazy"
              decoding="async"
              width={600}
              height={176}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/20 to-transparent" />
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="text-xs">{project.category}</Badge>
            </div>
            {/* Hover overlay with links */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              {project.githubUrl && project.githubUrl !== '#' && (
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#C3E41D] hover:text-black hover:border-[#C3E41D] transition-all"
                >
                  <GithubIcon className="w-4 h-4" />
                </motion.a>
              )}
              {project.demoUrl && project.demoUrl !== '#' && (
                <motion.a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#C3E41D] hover:text-black hover:border-[#C3E41D] transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              )}
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#C3E41D] transition-colors duration-300 leading-tight">
              {project.title}
            </h3>
            <p className="text-white/40 text-xs leading-relaxed mb-4 flex-1 line-clamp-3">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.technologies.slice(0, 4).map(tech => (
                <Badge key={tech} className="text-[10px] py-0">{tech}</Badge>
              ))}
              {project.technologies.length > 4 && (
                <Badge variant="secondary" className="text-[10px] py-0">+{project.technologies.length - 4}</Badge>
              )}
            </div>
            {/* Action buttons */}
            <div className="flex gap-2 pt-2 border-t border-white/5">
              {project.githubUrl && project.githubUrl !== '#' && (
                <Button variant="outline" size="sm" asChild className="flex-1 text-xs">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <GithubIcon className="w-3 h-3 mr-1" />
                    Code GitHub
                  </a>
                </Button>
              )}
              {project.demoUrl && project.demoUrl !== '#' && (
                <Button size="sm" asChild className="flex-1 text-xs">
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Voir le projet
                  </a>
                </Button>
              )}
              {(!project.demoUrl || project.demoUrl === '#') && (!project.githubUrl || project.githubUrl === '#') && (
                <span className="text-white/20 text-[10px] font-fira">Bientôt disponible</span>
              )}
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

export default function Projects() {
  const { data } = usePortfolio();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(data.projects.map(p => p.category)))];
  const filtered = filter === 'all' ? data.projects : data.projects.filter(p => p.category === filter);
  const featured = filtered.filter(p => p.featured);
  const regular = filtered.filter(p => !p.featured);

  return (
    <section id="projects" className="py-28 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#C3E41D]/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="text-[#C3E41D] font-fira text-sm tracking-widest">&gt; my.projects</span>
          <h2 className="text-4xl md:text-6xl font-black mt-2 text-white leading-tight">
            Projets<br /><span className="text-[#C3E41D]">réalisés.</span>
          </h2>
          <p className="text-white/40 mt-4 max-w-xl text-sm">
            Applications web et mobiles conçues, développées et déployées — du back-end à l&apos;IA.
          </p>
        </motion.div>

        {/* Filter pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {categories.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setFilter(cat)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                filter === cat
                  ? 'bg-[#C3E41D] text-black shadow-[0_0_15px_rgba(195,228,29,0.4)]'
                  : 'border border-white/10 text-white/40 hover:border-[#C3E41D]/40 hover:text-white/70'
              }`}
            >
              {cat === 'all' ? 'Tous' : cat}
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Featured projects */}
            {featured.length > 0 && (
              <div className="space-y-6">
                {featured.map((p, i) => <FeaturedCard key={p.id} project={p} index={i} />)}
              </div>
            )}

            {/* Regular project grid */}
            {regular.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {regular.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
