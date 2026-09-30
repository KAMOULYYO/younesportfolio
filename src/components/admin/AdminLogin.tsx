import { useState } from 'react';
import { m } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { supabase, isConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Connexion via Supabase Auth : le mot de passe n'est jamais dans le code du site.
export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!isConfigured) throw { code: 'not_configured' };
      const { error: authErr } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (authErr) throw authErr;
    } catch (err) {
      const e = err as { code?: string; status?: number; message?: string };
      setError(
        e.code === 'not_configured'
          ? 'Supabase non configuré (fichier .env).'
          : e.status === 429 || e.code === 'over_request_rate_limit'
            ? 'Trop de tentatives. Réessaie dans quelques minutes.'
            : e.code === 'email_not_confirmed'
              ? "Email non confirmé : dans Supabase, coche « Auto Confirm User » à la création du compte."
              : e.message?.includes('Failed to fetch')
                ? 'Connexion réseau impossible.'
                : 'Email ou mot de passe incorrect.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <m.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Admin Panel</h1>
          <p className="text-white/40 text-sm">Younes Kamouly Portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/50 text-xs font-fira mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                type="email"
                placeholder="email@exemple.com"
                required
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                className="pl-9"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="text-white/50 text-xs font-fira mb-1.5 block">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                className="pl-9 pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                aria-label={showPw ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <m.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </m.div>
          )}

          <Button type="submit" size="lg" className="w-full mt-2" disabled={loading || !email || !password}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Se connecter
          </Button>
        </form>
      </m.div>
    </div>
  );
}
