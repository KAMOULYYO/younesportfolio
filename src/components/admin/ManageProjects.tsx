import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Check, Star } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/types/portfolio';

const empty: Omit<Project, 'id'> = {
  title: '', description: '', image: '', technologies: [],
  githubUrl: '', demoUrl: '', category: 'Web App', featured: false,
};

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

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.technologies.includes(t)) {
      setForm(f => ({ ...f, technologies: [...f.technologies, t] }));
      setTechInput('');
    }
  };

  return (
    <div className="p-5 rounded-xl border border-[#C3E41D]/20 bg-[#C3E41D]/3 space-y-4">
      <h3 className="text-white font-semibold">{title}</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input placeholder="Titre" value={form.title} onChange={set('title')} />
        <Input placeholder="Catégorie (Web App, IA...)" value={form.category} onChange={set('category')} />
      </div>
      <Textarea placeholder="Description" value={form.description} onChange={set('description')} rows={3} className="min-h-[80px]" />
      <Input placeholder="Image URL" value={form.image} onChange={set('image')} />
      <div className="grid sm:grid-cols-2 gap-3">
        <Input placeholder="GitHub URL" value={form.githubUrl} onChange={set('githubUrl')} />
        <Input placeholder="Demo URL" value={form.demoUrl} onChange={set('demoUrl')} />
      </div>
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
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
          className="accent-[#C3E41D]"
        />
        <span className="text-white/60 text-sm">Projet featured</span>
      </label>
      <div className="flex gap-2">
        <Button onClick={() => onSave(form)} disabled={!form.title}>
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
    <div className="p-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Projets</h1>
          <p className="text-white/40 text-sm">{data.projects.length} projets</p>
        </div>
        <Button onClick={() => setAdding(true)} disabled={adding}>
          <Plus className="w-4 h-4 mr-2" /> Nouveau projet
        </Button>
      </motion.div>

      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6">
            <ProjectForm
              title="Nouveau projet"
              initial={empty}
              onSave={p => { addProject(p); setAdding(false); }}
              onCancel={() => setAdding(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {data.projects.map((project, i) => (
          <motion.div
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
                    {project.featured && <Star className="w-3.5 h-3.5 text-[#C3E41D] flex-shrink-0" fill="#C3E41D" />}
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
          </motion.div>
        ))}
      </div>
    </div>
  );
}
