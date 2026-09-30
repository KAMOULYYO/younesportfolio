import { useState } from 'react';
import { m } from 'framer-motion';
import { Save, CheckCircle } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Profile } from '@/types/portfolio';
import { hasCv } from '@/lib/safeUrl';
import FileUpload from './FileUpload';

export default function ManageProfile() {
  const { data, updateProfile } = usePortfolio();
  const [form, setForm] = useState<Profile>({ ...data.profile });
  const [saved, setSaved] = useState(false);

  const set = (key: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  // Envoi de fichier : enregistré tout de suite (pas besoin de cliquer sur Sauvegarder)
  const saveField = (key: 'photo' | 'cvUrl' | 'cvUrl_en', url: string) => {
    setForm(f => {
      const next = { ...f, [key]: url };
      updateProfile(next);
      return next;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Modifier le profil</h1>
        <p className="text-white/40 text-sm">Informations personnelles affichées sur le portfolio</p>
      </m.div>

      <m.form
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
          <label className="text-white/50 text-xs font-fira mb-1.5 block">Phrase d'accroche (affichée sous ton nom)</label>
          <Input value={form.tagline} onChange={set('tagline')} placeholder="Je conçois des applications web complètes…" maxLength={140} />
          <p className="text-white/30 text-xs mt-1">1 phrase : ce que tu fais + tes technos principales. {form.tagline.length}/140</p>
        </div>

        <div>
          <label className="text-white/50 text-xs font-fira mb-1.5 block">Disponibilité (badge en haut de page)</label>
          <Input value={form.availability ?? ''} onChange={set('availability')} placeholder="Disponible pour un stage ou un emploi" maxLength={60} />
          <p className="text-white/30 text-xs mt-1">Laisse vide pour masquer le badge (ex. si tu as déjà un poste).</p>
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

        <div className="space-y-2">
          <label className="text-white/50 text-xs font-fira block">Photo de profil</label>
          <FileUpload kind="image" label="Envoyer une photo" onUploaded={url => saveField('photo', url)} />
          <Input value={form.photo} onChange={set('photo')} placeholder="…ou URL https://..." />
        </div>

        <div className="space-y-2 p-4 rounded-xl border border-accent/20 bg-accent/5">
          <label className="text-white/70 text-sm font-semibold block">CV (PDF)</label>
          <p className="text-white/40 text-xs">Les visiteurs pourront l'ouvrir et le télécharger depuis le portfolio.</p>
          <FileUpload kind="cv" label="Envoyer mon CV (PDF)" onUploaded={url => saveField('cvUrl', url)} />
          <Input value={form.cvUrl === '#' ? '' : form.cvUrl} onChange={set('cvUrl')} placeholder="…ou lien vers le PDF" />
          {hasCv(form.cvUrl) && (
            <div className="flex items-center gap-3">
              <a href={form.cvUrl} target="_blank" rel="noopener noreferrer" className="text-accent text-xs underline">Ouvrir le CV actuel</a>
              <button type="button" onClick={() => saveField('cvUrl', '')} className="text-red-400 text-xs underline">Retirer le CV</button>
            </div>
          )}
          <p className="text-white/40 text-xs">Le fichier envoyé est enregistré automatiquement.</p>
          <div className="pt-3 mt-1 border-t border-white/10 space-y-2">
            <label className="text-white/60 text-xs font-semibold block">CV en anglais (facultatif — proposé aux visiteurs en anglais)</label>
            <FileUpload kind="cv" label="Envoyer mon CV anglais" onUploaded={url => saveField('cvUrl_en', url)} />
            {hasCv(form.cvUrl_en ?? '') && (
              <div className="flex items-center gap-3">
                <a href={form.cvUrl_en} target="_blank" rel="noopener noreferrer" className="text-accent text-xs underline">Ouvrir le CV anglais</a>
                <button type="button" onClick={() => saveField('cvUrl_en', '')} className="text-red-400 text-xs underline">Retirer</button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="text-white/50 text-xs font-fira mb-1.5 block">Lien de prise de rendez-vous (Calendly, Cal.com…)</label>
          <Input value={form.bookingUrl ?? ''} onChange={set('bookingUrl')} placeholder="https://calendly.com/ton-nom/15min" />
          <p className="text-white/30 text-xs mt-1">
            Affiche un bouton « Réserver un appel ». Gratuit : crée un compte sur calendly.com, un événement de 15 min, puis colle son lien ici.
          </p>
        </div>

        <details className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <summary className="cursor-pointer text-white/80 text-sm font-semibold">🇬🇧 Version anglaise du profil (pour les recruteurs anglophones)</summary>
          <div className="space-y-3 mt-4">
            <Input value={form.title_en ?? ''} onChange={set('title_en')} placeholder="Title — e.g. Full Stack Developer" />
            <Textarea value={form.bio_en ?? ''} onChange={set('bio_en')} placeholder="Bio (English)" className="min-h-[90px]" />
            <Input value={form.tagline_en ?? ''} onChange={set('tagline_en')} placeholder="Tagline (English)" maxLength={140} />
            <Input value={form.availability_en ?? ''} onChange={set('availability_en')} placeholder="Availability — e.g. Open to internships and full-time roles" maxLength={60} />
            <p className="text-white/30 text-xs">Un champ vide = la version française est affichée.</p>
          </div>
        </details>

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
            <m.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-accent text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Sauvegardé !
            </m.div>
          )}
        </div>
      </m.form>
    </div>
  );
}
