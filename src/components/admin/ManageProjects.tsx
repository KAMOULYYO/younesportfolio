import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Check, Star, EyeOff, BookOpen, ChevronDown } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toVideoUrl, isStorageFile } from '@/lib/safeUrl';
import { hasCaseStudy } from '@/lib/project';
import type { CaseStudy, Project } from '@/types/portfolio';
import FileUpload from './FileUpload';

const empty: Omit<Project, 'id'> = {
  title: '', description: '', image: '', technologies: [],
  githubUrl: '', demoUrl: '', category: 'Web App', featured: false,
};

const CASE_FIELDS: { key: keyof CaseStudy; label: string; hint: string }[] = [
  { key: 'role', label: 'Mon rôle', hint: 'Seul ou en équipe ? Ce que tu as fait toi-même.' },
  { key: 'context', label: 'Le problème', hint: 'Pour qui, quel besoin, pourquoi ce projet.' },
  { key: 'solution', label: 'La solution', hint: 'Ce que fait l’app, les fonctionnalités clés. Une ligne « - » = une puce.' },
  { key: 'architecture', label: 'Architecture technique', hint: 'Front, back, base de données, hébergement, sécurité.' },
  { key: 'challenges', label: 'Défis & décisions', hint: 'Un problème difficile et comment tu l’as résolu.' },
  { key: 'results', label: 'Résultat', hint: 'Ce qui est livré, en ligne, utilisé. Des faits vérifiables.' },
];

// Petit bloc repliable pour ne pas noyer le formulaire
function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02]">
      <button type="button" onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-white/80">
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-3 pb-3 space-y-3">{children}</div>}
    </div>
  );
}

function ProjectForm({
  initial,
  onSave,
  onCancel,
  title,
}: {
  initial: Omit<Project, 'id'>;
  onSave: (p: Omit<Project, 'id'>) => void;
  onCancel: () => void;
  title: string;
}) {
  const [form, setForm] = useState(initial);
  const [techInput, setTechInput] = useState('');
  const [csLang, setCsLang] = useState<'fr' | 'en'>('fr');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const setCase = (k: keyof CaseStudy) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const key = csLang === 'en' ? 'caseStudy_en' : 'caseStudy';
    setForm(f => ({ ...f, [key]: { ...(f[key] ?? {}), [k]: e.target.value } }));
  };
  const caseValue = (k: keyof CaseStudy) => (csLang === 'en' ? form.caseStudy_en?.[k] : form.caseStudy?.[k]) ?? '';

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.technologies.includes(t)) {
      setForm(f => ({ ...f, technologies: [...f.technologies, t] }));
      setTechInput('');
    }
  };

  const gallery = form.gallery ?? [];
  const videoOk = !form.videoUrl || !!toVideoUrl(form.videoUrl);

  return (
    <div className="p-5 rounded-xl border border-accent/20 bg-accent/3 space-y-4">
      <h3 className="text-white font-semibold">{title}</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input placeholder="Titre" value={form.title} onChange={set('title')} />
        <Input placeholder="Catégorie (Web App, IA...)" value={form.category} onChange={set('category')} />
      </div>
      <Textarea placeholder="Description courte (carte du projet)" value={form.description} onChange={set('description')} rows={3} className="min-h-[80px]" />

      <div className="space-y-2">
        <label className="text-white/50 text-xs font-fira block">Image principale — idéalement une vraie capture de l’app</label>
        <FileUpload kind="image" label="Envoyer une capture" onUploaded={url => setForm(f => ({ ...f, image: url }))} />
        <Input placeholder="…ou URL de l'image" value={form.image} onChange={set('image')} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Input placeholder="GitHub URL (vide = code privé)" value={form.githubUrl} onChange={set('githubUrl')} />
        <Input placeholder="Lien de la démo en ligne" value={form.demoUrl} onChange={set('demoUrl')} />
      </div>
      <Textarea
        placeholder={'Accès démo (facultatif), ex. :\nEmail : demo@exemple.com\nMot de passe : demo1234'}
        value={form.demoLogin ?? ''}
        onChange={set('demoLogin')}
        className="min-h-[60px] font-fira text-xs"
      />
      <p className="text-white/30 text-xs -mt-2">⚠️ Uniquement un compte de démonstration créé exprès, jamais ton vrai mot de passe.</p>

      <div>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Ajouter technologie (Enter)"
            value={techInput}
            onChange={e => setTechInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
          />
          <Button type="button" variant="outline" size="sm" onClick={addTech}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {form.technologies.map(tech => (
            <span
              key={tech}
              className="flex items-center gap-1 text-xs bg-white/5 border border-white/10 text-white/70 px-2 py-0.5 rounded-full cursor-pointer hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
              onClick={() => setForm(f => ({ ...f, technologies: f.technologies.filter(t => t !== tech) }))}
            >
              {tech} <X className="w-2.5 h-2.5" />
            </span>
          ))}
        </div>
      </div>

      <Section title="📖 Étude de cas (page dédiée au projet)" defaultOpen={hasCaseStudy(form as Project)}>
        <div className="flex gap-2">
          {(['fr', 'en'] as const).map(l => (
            <button key={l} type="button" onClick={() => setCsLang(l)}
              className={`px-3 py-1 rounded-full text-xs font-fira font-bold ${csLang === l ? 'bg-accent text-black' : 'border border-white/10 text-white/60'}`}>
              {l === 'fr' ? 'Français' : 'English (facultatif)'}
            </button>
          ))}
        </div>
        {CASE_FIELDS.map(f => (
          <div key={f.key}>
            <label className="text-white/60 text-xs font-semibold block mb-1">{f.label}</label>
            <Textarea value={caseValue(f.key)} onChange={setCase(f.key)} placeholder={f.hint} className="min-h-[70px] text-sm" />
          </div>
        ))}
      </Section>

      <Section title="🇬🇧 Version anglaise de la carte">
        <Input placeholder="Title (English)" value={form.title_en ?? ''} onChange={set('title_en')} />
        <Textarea placeholder="Short description (English)" value={form.description_en ?? ''} onChange={set('description_en')} className="min-h-[70px]" />
        <Textarea placeholder="Demo access (English, optional)" value={form.demoLogin_en ?? ''} onChange={set('demoLogin_en')} className="min-h-[50px] font-fira text-xs" />
      </Section>

      <Section title={`🖼️ Captures d'écran (${gallery.length}/8)`}>
        {gallery.length < 8 && (
          <FileUpload kind="image" label="Ajouter une capture" onUploaded={url => setForm(f => ({ ...f, gallery: [...(f.gallery ?? []), url].slice(0, 8) }))} />
        )}
        <div className="grid grid-cols-3 gap-2">
          {gallery.map(src => (
            <div key={src} className="relative group">
              <img src={src} alt="" className="h-20 w-full object-cover rounded-lg border border-white/10" />
              <button type="button" onClick={() => setForm(f => ({ ...f, gallery: (f.gallery ?? []).filter(x => x !== src) }))}
                className="absolute top-1 right-1 p-1 rounded bg-black/70 text-red-300 opacity-0 group-hover:opacity-100" aria-label="Retirer">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="🎬 Vidéo de démo du projet">
        <FileUpload kind="video" label="Envoyer une vidéo (MP4)" onUploaded={url => setForm(f => ({ ...f, videoUrl: url }))} />
        <Input placeholder="…ou lien YouTube / Vimeo" value={form.videoUrl ?? ''} onChange={set('videoUrl')} />
        {!videoOk && <p className="text-red-400 text-xs">Lien non reconnu : YouTube, Vimeo ou fichier envoyé.</p>}
        {form.videoUrl && isStorageFile(form.videoUrl) && (
          <video src={form.videoUrl} controls preload="metadata" className="h-32 rounded-lg border border-white/10 bg-black" />
        )}
      </Section>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
          className="accent-accent"
        />
        <span className="text-white/60 text-sm">Projet à la une (grande carte)</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={!!form.hidden}
          onChange={e => setForm(f => ({ ...f, hidden: e.target.checked }))}
          className="accent-accent"
        />
        <span className="text-white/60 text-sm">Masquer sur le site (ex. pas encore de code ni de démo)</span>
      </label>
      <div className="flex gap-2">
        <Button onClick={() => onSave(form)} disabled={!form.title || !videoOk}>
          <Check className="w-4 h-4 mr-1" /> Sauvegarder
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          <X className="w-4 h-4 mr-1" /> Annuler
        </Button>
      </div>
    </div>
  );
}

export default function ManageProjects() {
  const { data, addProject, updateProject, deleteProject } = usePortfolio();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Projets</h1>
          <p className="text-white/40 text-sm">
            {data.projects.length} projets · {data.projects.filter(p => !p.hidden).length} visibles sur le site
          </p>
        </div>
        <Button onClick={() => setAdding(true)} disabled={adding}>
          <Plus className="w-4 h-4 mr-2" /> Nouveau projet
        </Button>
      </m.div>

      <AnimatePresence>
        {adding && (
          <m.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6">
            <ProjectForm
              title="Nouveau projet"
              initial={empty}
              onSave={p => { addProject(p); setAdding(false); }}
              onCancel={() => setAdding(false)}
            />
          </m.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {data.projects.map((project, i) => (
          <m.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            {editing === project.id ? (
              <ProjectForm
                title="Modifier le projet"
                initial={project}
                onSave={p => { updateProject(project.id, p); setEditing(null); }}
                onCancel={() => setEditing(null)}
              />
            ) : (
              <div className="flex items-start gap-4 p-4 rounded-xl border border-white/7 bg-white/3 hover:border-white/12 transition-all">
                {project.image && (
                  <img src={project.image} alt="" className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold text-sm truncate">{project.title}</h3>
                    {project.hidden && (
                      <span className="flex items-center gap-1 text-[10px] font-fira px-1.5 py-0.5 rounded border border-white/15 text-white/50 flex-shrink-0">
                        <EyeOff className="w-3 h-3" /> Masqué
                      </span>
                    )}
                    {hasCaseStudy(project) && <BookOpen className="w-3.5 h-3.5 text-violet-300 flex-shrink-0" aria-label="Étude de cas" />}
                    {project.featured && <Star className="w-3.5 h-3.5 text-accent flex-shrink-0" fill="var(--color-accent)" />}
                    <Badge variant="secondary" className="text-xs flex-shrink-0">{project.category}</Badge>
                  </div>
                  <p className="text-white/40 text-xs line-clamp-2 mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 4).map(t => (
                      <Badge key={t} className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(project.id)} className="h-8 w-8 text-white/40 hover:text-white">
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { if (window.confirm('Supprimer ce projet ?')) deleteProject(project.id); }} className="h-8 w-8 text-red-400/60 hover:text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </m.div>
        ))}
      </div>
    </div>
  );
}
