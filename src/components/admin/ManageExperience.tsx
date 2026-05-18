import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { Experience } from '@/types/portfolio';

const empty: Omit<Experience, 'id'> = { title: '', company: '', period: '', description: '', technologies: [], type: 'work' };

function ExpForm({ initial, onSave, onCancel, title: formTitle }: {
  initial: Omit<Experience, 'id'>;
  onSave: (e: Omit<Experience, 'id'>) => void;
  onCancel: () => void;
  title: string;
}) {
  const [form, setForm] = useState(initial);
  const [techInput, setTechInput] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const addTech = () => {
    const t = techInput.trim();
    if (t) { setForm(f => ({ ...f, technologies: [...f.technologies, t] })); setTechInput(''); }
  };

  return (
    <div className="p-5 rounded-xl border border-[#C3E41D]/20 bg-[#C3E41D]/3 space-y-3">
      <h3 className="text-white font-semibold">{formTitle}</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input placeholder="Titre du poste" value={form.title} onChange={set('title')} />
        <Input placeholder="Entreprise / Institution" value={form.company} onChange={set('company')} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input placeholder="Période (ex: 2022-2023)" value={form.period} onChange={set('period')} />
        <select value={form.type} onChange={set('type')} className="h-10 rounded-lg border border-white/10 bg-white/5 text-white text-sm px-3 focus:outline-none focus:ring-1 focus:ring-[#C3E41D]">
          <option value="work" className="bg-[#111]">Professionnel</option>
          <option value="academic" className="bg-[#111]">Académique</option>
        </select>
      </div>
      <Textarea placeholder="Description" value={form.description} onChange={set('description')} className="min-h-[80px]" />
      <div>
        <div className="flex gap-2 mb-2">
          <Input placeholder="Technologie (Enter)" value={techInput} onChange={e => setTechInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }} />
          <Button type="button" variant="outline" size="sm" onClick={addTech}><Plus className="w-4 h-4" /></Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {form.technologies.map(t => (
            <span key={t} onClick={() => setForm(f => ({ ...f, technologies: f.technologies.filter(x => x !== t) }))}
              className="flex items-center gap-1 text-xs bg-white/5 border border-white/10 text-white/70 px-2 py-0.5 rounded-full cursor-pointer hover:bg-red-500/10 hover:text-red-400">
              {t} <X className="w-2.5 h-2.5" />
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onSave(form)} disabled={!form.title}><Check className="w-4 h-4 mr-1" /> Sauvegarder</Button>
        <Button variant="ghost" onClick={onCancel}><X className="w-4 h-4 mr-1" /> Annuler</Button>
      </div>
    </div>
  );
}

export default function ManageExperience() {
  const { data, addExperience, updateExperience, deleteExperience } = usePortfolio();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div className="p-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Expériences</h1>
          <p className="text-white/40 text-sm">{data.experiences.length} expériences</p>
        </div>
        <Button onClick={() => setAdding(true)} disabled={adding}><Plus className="w-4 h-4 mr-2" /> Ajouter</Button>
      </motion.div>

      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6">
            <ExpForm title="Nouvelle expérience" initial={empty} onSave={e => { addExperience(e); setAdding(false); }} onCancel={() => setAdding(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {data.experiences.map((exp, i) => (
          <motion.div key={exp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
            {editing === exp.id ? (
              <ExpForm title="Modifier" initial={exp} onSave={e => { updateExperience(exp.id, e); setEditing(null); }} onCancel={() => setEditing(null)} />
            ) : (
              <div className="flex items-start gap-4 p-4 rounded-xl border border-white/7 bg-white/3 hover:border-white/12 transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-white text-sm font-semibold">{exp.title}</h3>
                    <Badge variant={exp.type === 'work' ? 'default' : 'secondary'} className="text-xs">
                      {exp.type === 'work' ? 'Pro' : 'Académique'}
                    </Badge>
                  </div>
                  <p className="text-[#C3E41D] text-xs">{exp.company}</p>
                  <p className="text-white/30 text-xs font-fira mt-0.5">{exp.period}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(exp.id)} className="h-8 w-8 text-white/40 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { if (window.confirm('Supprimer ?')) deleteExperience(exp.id); }} className="h-8 w-8 text-red-400/60 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
