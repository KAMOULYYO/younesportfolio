import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, CheckCircle } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Skill } from '@/types/portfolio';

const categories = ['frontend', 'backend', 'database', 'tools', 'ai'] as const;

const empty: Omit<Skill, 'id'> = { name: '', category: 'frontend', level: 80 };

export default function ManageSkills() {
  const { data, addSkill, updateSkill, deleteSkill } = usePortfolio();
  const [form, setForm] = useState<Omit<Skill, 'id'>>(empty);
  const [saved, setSaved] = useState(false);

  const notify = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    addSkill(form);
    setForm(empty);
    notify();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer cette compétence ?')) deleteSkill(id);
  };

  const grouped = categories.reduce((acc, c) => {
    acc[c] = data.skills.filter(s => s.category === c);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="p-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Compétences</h1>
        <p className="text-white/40 text-sm">{data.skills.length} compétences au total</p>
      </motion.div>

      {/* Add form */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={handleAdd}
        className="p-5 rounded-xl border border-[#C3E41D]/20 bg-[#C3E41D]/3 mb-8 space-y-4"
      >
        <h3 className="text-white font-semibold">Ajouter une compétence</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <Input
            placeholder="Nom (ex: React)"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />
          <select
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value as Skill['category'] }))}
            className="h-10 rounded-lg border border-white/10 bg-white/5 text-white text-sm px-3 focus:outline-none focus:ring-1 focus:ring-[#C3E41D]"
          >
            {categories.map(c => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1} max={100}
              value={form.level}
              onChange={e => setForm(f => ({ ...f, level: Number(e.target.value) }))}
              className="w-24"
            />
            <span className="text-white/40 text-xs">%</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit">
            <Plus className="w-4 h-4 mr-1" /> Ajouter
          </Button>
          {saved && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 text-[#C3E41D] text-sm">
              <CheckCircle className="w-4 h-4" /> Ajouté !
            </motion.span>
          )}
        </div>
      </motion.form>

      {/* List */}
      <div className="space-y-8">
        {categories.map(cat => {
          const skills = grouped[cat];
          if (!skills?.length) return null;
          return (
            <div key={cat}>
              <h3 className="text-white/50 text-xs font-fira font-bold tracking-widest uppercase mb-3">{cat}</h3>
              <div className="space-y-2">
                <AnimatePresence>
                  {skills.map(skill => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center gap-3 p-3 rounded-lg border border-white/7 bg-white/3"
                    >
                      <Input
                        value={skill.name}
                        onChange={e => updateSkill(skill.id, { name: e.target.value })}
                        className="flex-1 h-8 text-sm"
                      />
                      <Input
                        type="number" min={1} max={100}
                        value={skill.level}
                        onChange={e => updateSkill(skill.id, { level: Number(e.target.value) })}
                        className="w-20 h-8 text-sm"
                      />
                      <span className="text-white/30 text-xs w-6">{skill.level}%</span>
                      <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#C3E41D] rounded-full" style={{ width: `${skill.level}%` }} />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(skill.id)}
                        className="h-8 w-8 text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {data.skills.length > 0 && (
        <div className="mt-6">
          <Button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
            <Save className="w-4 h-4 mr-2" /> Tout est auto-sauvegardé
          </Button>
        </div>
      )}
    </div>
  );
}
