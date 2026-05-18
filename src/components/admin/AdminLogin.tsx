import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ADMIN_EMAIL = 'admin@younes.dev';
const ADMIN_PASSWORD = 'admin123';

interface Props {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', '1');
      onLogin();
    } else {
      setError('Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C3E41D]/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#C3E41D]/10 border border-[#C3E41D]/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-[#C3E41D]" />
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
                placeholder="admin@younes.dev"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <Button type="submit" size="lg" className="w-full mt-2">
            Se connecter
          </Button>
        </form>

        <p className="text-center text-white/20 text-xs mt-6 font-fira">
          admin@younes.dev / admin123
        </p>
      </motion.div>
    </div>
  );
}
