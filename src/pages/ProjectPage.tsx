import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { m } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, User, Target, Lightbulb, Layers, Mountain, Trophy, KeyRound, X, Mail,
} from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import PageShell from '@/components/layout/PageShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GithubIcon } from '@/components/ui/social-icons';
import { ProjectCover } from '@/components/ui/project-cover';
import { useLang, type StringKey } from '@/lib/i18n';
import { hasLink } from '@/lib/project';
import { isStorageFile } from '@/lib/safeUrl';
import { track } from '@/lib/analytics';
import type { CaseStudy } from '@/types/portfolio';

const SECTIONS: { key: keyof CaseStudy; label: StringKey; icon: typeof User }[] = [
  { key: 'role', label: 'case.role', icon: User },
  { key: 'context', label: 'case.context', icon: Target },
  { key: 'solution', label: 'case.solution', icon: Lightbulb },
  { key: 'architecture', label: 'case.architecture', icon: Layers },
  { key: 'challenges', label: 'case.challenges', icon: Mountain },
  { key: 'results', label: 'case.results', icon: Trophy },
];

// Texte simple → paragraphes et listes (lignes commençant par « - »)
function RichText({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="space-y-3">
      {blocks.map((b, i) => {
        const lines = b.split('\n').filter(Boolean);
        if (lines.every(l => l.trim().startsWith('- '))) {
          return (
            <ul key={i} className="space-y-1.5">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-2 text-white/65 leading-relaxed">
                  <span className="text-accent mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  <span>{l.trim().slice(2)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return <p key={i} className="text-white/65 leading-relaxed whitespace-pre-line">{b}</p>;
      })}
    </div>
  );
}

export default function ProjectPage() {
  const { id } = useParams();
  const { data } = usePortfolio();
  const { t, pick, lang } = useLang();
  const [zoom, setZoom] = useState<string | null>(null);

  const visible = data.projects.filter(p => !p.hidden);
  const index = visible.findIndex(p => p.id === id);
  const project = visible[index];
  const next = visible.length > 1 ? visible[(index + 1) % visible.length] : null;

  useEffect(() => { if (project) track('project_view', project.id); }, [project]);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setZoom(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoom]);

  if (!project) {
    return (
      <PageShell title={t('case.notFound')}>
        <div className="max-w-3xl mx-auto text-center py-20">
          <p className="text-white/60 mb-6">{t('case.notFound')}</p>
          <Button asChild variant="outline"><Link to="/#projects"><ArrowLeft className="w-4 h-4 mr-2" />{t('case.back')}</Link></Button>
        </div>
      </PageShell>
    );
  }

  const title = pick(project.title, project.title_en);
  // Étude de cas anglaise rubrique par rubrique, avec repli sur le français
  const cs = (k: keyof CaseStudy) => pick(project.caseStudy?.[k], lang === 'en' ? project.caseStudy_en?.[k] : undefined);
  const demoLogin = pick(project.demoLogin, project.demoLogin_en);
  const gallery = project.gallery ?? [];

  return (
    <PageShell title={title}>
      <article className="max-w-4xl mx-auto">
        <Link to="/#projects" className="inline-flex items-center gap-2 text-white/50 hover:text-accent text-sm font-fira mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t('case.back')}
        </Link>

        {/* En-tête */}
        <m.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge variant="secondary" className="mb-4">{project.category}</Badge>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">{title}</h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-3xl">{pick(project.description, project.description_en)}</p>

          <div className="flex flex-wrap gap-3 mt-8">
            {hasLink(project.demoUrl) && (
              <Button asChild size="lg">
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  {t('projects.demo')} <ArrowUpRight className="w-4 h-4 ml-1" />
                </a>
              </Button>
            )}
            {hasLink(project.githubUrl) && (
              <Button asChild size="lg" variant="outline">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <GithubIcon className="w-4 h-4 mr-2" /> {t('projects.codeGithub')}
                </a>
              </Button>
            )}
          </div>

          {demoLogin && (
            <div className="mt-4 inline-flex items-start gap-3 p-3 pr-4 rounded-xl border border-accent/30 bg-accent/5 text-sm">
              <KeyRound className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-accent text-xs font-fira font-bold mb-0.5">{t('case.demoLogin')}</p>
                <p className="text-white/70 font-fira whitespace-pre-line">{demoLogin}</p>
              </div>
            </div>
          )}
        </m.header>

        {/* Visuel principal */}
        <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden border border-white/10 mb-12 h-56 md:h-[420px]">
          <ProjectCover src={project.image} title={title} />
        </m.div>

        {/* Stack */}
        <section className="mb-12">
          <h2 className="text-white/50 text-xs font-fira font-bold tracking-widest uppercase mb-3">{t('case.stack')}</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map(tech => <Badge key={tech}>{tech}</Badge>)}
          </div>
        </section>

        {/* Rubriques de l'étude de cas */}
        <div className="grid gap-5">
          {SECTIONS.filter(s => cs(s.key).trim()).map((s, i) => (
            <m.section
              key={s.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.05 }}
              className="spotlight p-6 md:p-8 rounded-2xl border border-white/7 bg-white/[0.03]"
            >
              <h2 className="flex items-center gap-3 text-white font-bold text-xl mb-4">
                <span className="p-2 rounded-lg bg-accent/10"><s.icon className="w-5 h-5 text-accent" /></span>
                {t(s.label)}
              </h2>
              <RichText text={cs(s.key)} />
            </m.section>
          ))}
        </div>

        {/* Vidéo */}
        {project.videoUrl && (
          <section className="mt-12">
            <h2 className="text-white font-bold text-xl mb-4">{t('case.video')}</h2>
            <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black">
              {isStorageFile(project.videoUrl) ? (
                <video src={project.videoUrl} controls playsInline preload="metadata" className="w-full h-full" />
              ) : (
                <iframe
                  src={project.videoUrl}
                  title={title}
                  className="w-full h-full"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              )}
            </div>
          </section>
        )}

        {/* Galerie */}
        {gallery.length > 0 && (
          <section className="mt-12">
            <h2 className="text-white font-bold text-xl mb-4">{t('case.gallery')}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {gallery.map((src, i) => (
                <button key={src} onClick={() => setZoom(src)} className="rounded-xl overflow-hidden border border-white/10 hover:border-accent/40 transition-colors">
                  <img src={src} alt={`${title} — ${i + 1}`} loading="lazy" className="w-full h-56 object-cover object-top" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Appel à l'action + projet suivant */}
        <section className="mt-16 p-8 rounded-2xl border border-accent/30 bg-accent/5 text-center">
          <p className="text-white text-xl font-bold mb-5">{t('case.cta')}</p>
          <Button asChild size="lg">
            <Link to="/#contact"><Mail className="w-4 h-4 mr-2" /> {t('hero.contact')}</Link>
          </Button>
        </section>

        {next && next.id !== project.id && (
          <Link to={`/projets/${next.id}`} className="group mt-8 flex items-center justify-between p-6 rounded-2xl border border-white/7 hover:border-accent/30 transition-colors">
            <span>
              <span className="block text-white/40 text-xs font-fira mb-1">{t('case.next')}</span>
              <span className="text-white font-bold text-lg group-hover:text-accent transition-colors">{pick(next.title, next.title_en)}</span>
            </span>
            <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </article>

      {zoom && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4" onClick={() => setZoom(null)}>
          <button aria-label={t('ai.close')} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white"><X className="w-5 h-5" /></button>
          <img src={zoom} alt="" className="max-w-full max-h-full rounded-lg" />
        </div>
      )}
    </PageShell>
  );
}
