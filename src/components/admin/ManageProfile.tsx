import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Profile } from '@/types/portfolio';

export default function ManageProfile() {
  const { data, updateProfile } = usePortfolio();
  const [form, setForm] = useState<Profile>({ ...data.profile });
  const [saved, setSaved] = useState(false);

  const set = (key: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Modifier le profil</h1>
        <p className="text-white/40 text-sm">Informations personnelles affichées sur le portfolio</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSave}
        className="space-y-5"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-white/50 text-xs font-fira mb-1.5 block">Nom complet</label>
            <Input value={form.name} onChange={set('name')} placeholder="Younes Kamouly" />
          </div>
          <div>
            <label className="text-white/50 text-xs font-fira mb-1.5 block">Titre</label>
            <Input value={form.title} onChange={set('title')} placeholder="Full Stack Developer" />
          </div>
        </div>

        <div>
          <label className="text-white/50 text-xs font-fira mb-1.5 block">Bio</label>
          <Textarea value={form.bio} onChange={set('bio')} rows={4} placeholder="Courte présentation..." className="min-h-[100px]" />
        </div>

        <div>
          <label className="text-white/50 text-xs font-fira mb-1.5 block">Tagline (phrase d'accroche)</label>
          <Input value={form.tagline} onChange={set('tagline')} placeholder="Building intelligent experiences..." />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-white/50 text-xs font-fira mb-1.5 block">Email</label>
            <Input type="email" value={form.email} onChange={set('email')} />
          </div>
          <div>
            <label className="text-white/50 text-xs font-fira mb-1.5 block">Localisation</label>
            <Input value={form.location} onChange={set('location')} placeholder="Montréal, QC" />
          </div>
        </div>

        <div>
          <label className="text-white/50 text-xs font-fira mb-1.5 block">Photo de profil (URL)</label>
          <Input value={form.photo} onChange={set('photo')} placeholder="https://..." />
        </div>

        <div>
          <label className="text-white/50 text-xs font-fira mb-1.5 block">URL du CV</label>
          <Input value={form.cvUrl} onChange={set('cvUrl')} placeholder="https://..." />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-white/50 text-xs font-fira mb-1.5 block">GitHub URL</label>
            <Input value={form.github} onChange={set('github')} placeholder="https://github.com/..." />
          </div>
          <div>
            <label className="text-white/50 text-xs font-fira mb-1.5 block">LinkedIn URL</label>
            <Input value={form.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/in/..." />
          </div>
        </div>

        {form.photo && (
          <div className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/3">
            <img src={form.photo} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
            <span className="text-white/40 text-xs">Aperçu photo</span>
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          <Button type="submit" size="lg">
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
          {saved && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-[#C3E41D] text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Sauvegardé !
            </motion.div>
          )}
        </div>
      </motion.form>
    </div>
  );
}
