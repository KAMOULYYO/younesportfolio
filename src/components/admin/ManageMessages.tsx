import { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import { Mail, Trash2, Reply, Loader2, AlertCircle, Inbox, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  lang: string | null;
  read: boolean;
  created_at: string;
}

function fetchMessages() {
  return supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(200);
}

function when(iso: string) {
  return new Date(iso).toLocaleString('fr-CA', { dateStyle: 'medium', timeStyle: 'short' });
}

// Messages reçus via le formulaire de contact du portfolio
export default function ManageMessages({ onChange }: { onChange?: () => void }) {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  // Chargement initial : les mises à jour d'état ont lieu dans le callback, après la requête
  useEffect(() => {
    let cancelled = false;
    fetchMessages().then(({ data, error: err }) => {
      if (cancelled) return;
      if (err) {
        setError(err.code === '42P01' || err.code === 'PGRST205'
          ? "La table « messages » n'existe pas encore : exécute supabase/002_messages_stats.sql."
          : err.message);
        setMessages([]);
        return;
      }
      setMessages(data as Message[]);
    });
    return () => { cancelled = true; };
  }, []);

  const markRead = async (m: Message, read = true) => {
    if (m.read === read) return;
    setMessages(list => list?.map(x => (x.id === m.id ? { ...x, read } : x)) ?? null);
    await supabase.from('messages').update({ read }).eq('id', m.id);
    onChange?.();
  };

  const remove = async (m: Message) => {
    if (!window.confirm(`Supprimer le message de ${m.name} ?`)) return;
    setMessages(list => list?.filter(x => x.id !== m.id) ?? null);
    await supabase.from('messages').delete().eq('id', m.id);
    onChange?.();
  };

  const markAll = async () => {
    const ids = messages?.filter(m => !m.read).map(m => m.id) ?? [];
    if (!ids.length) return;
    setMessages(list => list?.map(x => ({ ...x, read: true })) ?? null);
    await supabase.from('messages').update({ read: true }).in('id', ids);
    onChange?.();
  };

  const toggle = (m: Message) => {
    setOpen(o => (o === m.id ? null : m.id));
    markRead(m);
  };

  const unread = messages?.filter(m => !m.read).length ?? 0;

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Messages</h1>
          <p className="text-white/40 text-sm">
            {messages === null ? 'Chargement…' : `${messages.length} message(s) · ${unread} non lu(s)`}
          </p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={markAll}><CheckCheck className="w-4 h-4" /> Tout marquer comme lu</Button>
        )}
      </m.div>

      {error && (
        <p role="alert" className="flex items-start gap-2 text-red-300 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 mb-6">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {error}
        </p>
      )}

      {messages === null && <Loader2 className="w-5 h-5 text-accent animate-spin" />}

      {messages?.length === 0 && !error && (
        <div className="text-center py-16 text-white/40">
          <Inbox className="w-10 h-10 mx-auto mb-3 opacity-50" />
          Aucun message pour l'instant. Ils arriveront ici dès qu'un visiteur utilise le formulaire de contact.
        </div>
      )}

      <div className="space-y-3">
        {messages?.map(m => (
          <div key={m.id} className={`rounded-xl border transition-colors ${m.read ? 'border-white/7 bg-white/[0.02]' : 'border-accent/30 bg-accent/5'}`}>
            <button onClick={() => toggle(m)} className="w-full text-left p-4 flex items-start gap-3">
              <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${m.read ? 'bg-transparent' : 'bg-accent'}`} />
              <span className="flex-1 min-w-0">
                <span className="flex flex-wrap items-baseline gap-x-3">
                  <span className={`text-sm ${m.read ? 'text-white/70' : 'text-white font-bold'}`}>{m.name}</span>
                  <span className="text-white/40 text-xs">{m.email}</span>
                  {m.lang && <span className="text-[10px] font-fira uppercase text-white/30">{m.lang}</span>}
                  <span className="ml-auto text-white/30 text-xs">{when(m.created_at)}</span>
                </span>
                <span className={`block text-white/55 text-sm mt-1 ${open === m.id ? 'whitespace-pre-line' : 'truncate'}`}>{m.message}</span>
              </span>
            </button>
            {open === m.id && (
              <div className="px-4 pb-4 flex flex-wrap gap-2 pl-9">
                <Button size="sm" asChild>
                  <a href={`mailto:${m.email}?subject=${encodeURIComponent(m.lang === 'en' ? 'Re: your message' : 'Re : votre message')}`}>
                    <Reply className="w-4 h-4" /> Répondre
                  </a>
                </Button>
                <Button size="sm" variant="ghost" onClick={() => markRead(m, false)}><Mail className="w-4 h-4" /> Marquer non lu</Button>
                <Button size="sm" variant="ghost" onClick={() => remove(m)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /> Supprimer</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
