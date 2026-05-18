import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Education } from '@/types/portfolio';

const empty: Omit<Education, 'id'> = { degree: '', institution: '', period: '', description: '', location: '' };

function EduForm({ initial, onSave, onCancel, title }: {
  initial: Omit<Education, 'id'>;
  onSave: (e: Omit<Education, 'id'>) => void;
  onCancel: () => void;
  title: string;
}) {
  const [form, setForm] = useState(initial);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="p-5 rounded-xl border border-[#C3E41D]/20 bg-[#C3E41D]/3 space-y-3">
      <h3 className="text-white font-semibold">{title}</h3>
      <Input placeholder="Diplôme / Formation" value={form.degree} onChange={set('degree')} />
      <div className="grid sm:grid-cols-2 gap-3">
        <Input placeholder="Institution" value={form.institution} onChange={set('institution')} />
        <Input placeholder="Période" value={form.period} onChange={set('period')} />
      </div>
      <Input placeholder="Localisation" value={form.location} onChange={set('location')} />
      <Textarea placeholder="Description" value={form.description} onChange={set('description')} className="min-h-[80px]" />
      <div className="flex gap-2">
        <Button onClick={() => onSave(form)} disabled={!form.degree}><Check className="w-4 h-4 mr-1" /> Sauvegarder</Button>
        <Button variant="ghost" onClick={onCancel}><X className="w-4 h-4 mr-1" /> Annuler</Button>
      </div>
    </div>
  );
}

export default function ManageEducation() {
  const { data, addEducation, updateEducation, deleteEducation } = usePortfolio();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div className="p-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Formation</h1>
          <p className="text-white/40 text-sm">{data.education.length} formations</p>
        </div>
        <Button onClick={() => setAdding(true)} disabled={adding}><Plus className="w-4 h-4 mr-2" /> Ajouter</Button>
      </motion.div>

      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6">
            <EduForm title="Nouvelle formation" initial={empty} onSave={e => { addEducation(e); setAdding(false); }} onCancel={() => setAdding(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {data.education.map((edu, i) => (
          <motion.div key={edu.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
            {editing === edu.id ? (
              <EduForm title="Modifier" initial={edu} onSave={e => { updateEducation(edu.id, e); setEditing(null); }} onCancel={() => setEditing(null)} />
            ) : (
              <div className="flex items-start gap-4 p-4 rounded-xl border border-white/7 bg-white/3 hover:border-white/12 transition-all">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-sm font-semibold">{edu.degree}</h3>
                  <p className="text-[#C3E41D] text-xs mt-0.5">{edu.institution}</p>
                  <p className="text-white/30 text-xs font-fira">{edu.period} · {edu.location}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(edu.id)} className="h-8 w-8 text-white/40 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { if (window.confirm('Supprimer ?')) deleteEducation(edu.id); }} className="h-8 w-8 text-red-400/60 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
