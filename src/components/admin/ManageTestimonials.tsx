import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Check, Star } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Testimonial } from '@/types/portfolio';

const empty: Omit<Testimonial, 'id'> = { name: '', role: '', company: '', avatar: '', content: '', rating: 5 };

function TestForm({ initial, onSave, onCancel, title }: {
  initial: Omit<Testimonial, 'id'>;
  onSave: (t: Omit<Testimonial, 'id'>) => void;
  onCancel: () => void;
  title: string;
}) {
  const [form, setForm] = useState(initial);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="p-5 rounded-xl border border-[#C3E41D]/20 bg-[#C3E41D]/3 space-y-3">
      <h3 className="text-white font-semibold">{title}</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input placeholder="Nom" value={form.name} onChange={set('name')} />
        <Input placeholder="Rôle / Titre" value={form.role} onChange={set('role')} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input placeholder="Entreprise" value={form.company} onChange={set('company')} />
        <Input placeholder="Avatar URL" value={form.avatar} onChange={set('avatar')} />
      </div>
      <Textarea placeholder="Témoignage..." value={form.content} onChange={set('content')} className="min-h-[80px]" />
      <div className="flex items-center gap-2">
        <span className="text-white/50 text-sm">Note :</span>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))}>
            <Star className="w-5 h-5" fill={n <= form.rating ? '#C3E41D' : 'transparent'} stroke={n <= form.rating ? '#C3E41D' : 'rgba(255,255,255,0.3)'} />
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onSave(form)} disabled={!form.name}><Check className="w-4 h-4 mr-1" /> Sauvegarder</Button>
        <Button variant="ghost" onClick={onCancel}><X className="w-4 h-4 mr-1" /> Annuler</Button>
      </div>
    </div>
  );
}

export default function ManageTestimonials() {
  const { data, addTestimonial, updateTestimonial, deleteTestimonial } = usePortfolio();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div className="p-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Témoignages</h1>
          <p className="text-white/40 text-sm">{data.testimonials.length} témoignages</p>
        </div>
        <Button onClick={() => setAdding(true)} disabled={adding}><Plus className="w-4 h-4 mr-2" /> Ajouter</Button>
      </motion.div>

      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6">
            <TestForm title="Nouveau témoignage" initial={empty} onSave={t => { addTestimonial(t); setAdding(false); }} onCancel={() => setAdding(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {data.testimonials.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
            {editing === t.id ? (
              <TestForm title="Modifier" initial={t} onSave={u => { updateTestimonial(t.id, u); setEditing(null); }} onCancel={() => setEditing(null)} />
            ) : (
              <div className="flex items-start gap-4 p-4 rounded-xl border border-white/7 bg-white/3 hover:border-white/12 transition-all">
                {t.avatar && <img src={t.avatar} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-white text-sm font-semibold">{t.name}</h3>
                    <div className="flex">
                      {Array.from({ length: t.rating }).map((_, ri) => (
                        <Star key={ri} className="w-3 h-3" fill="#C3E41D" stroke="#C3E41D" />
                      ))}
                    </div>
                  </div>
                  <p className="text-white/40 text-xs">{t.role} · {t.company}</p>
                  <p className="text-white/50 text-xs mt-1 line-clamp-2">{t.content}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(t.id)} className="h-8 w-8 text-white/40 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { if (window.confirm('Supprimer ?')) deleteTestimonial(t.id); }} className="h-8 w-8 text-red-400/60 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
