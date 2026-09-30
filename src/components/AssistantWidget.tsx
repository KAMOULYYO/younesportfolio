import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { Bot, Send, X, Loader2, Sparkles } from 'lucide-react';
import { useLang, type StringKey } from '@/lib/i18n';
import { track } from '@/lib/analytics';

type Msg = { role: 'user' | 'assistant'; content: string };
const SUGGESTIONS: StringKey[] = ['ai.s1', 'ai.s2', 'ai.s3'];
const MAX_PER_SESSION = 15;

// Bulle « Posez-moi une question » : n'apparaît que si /api/ask est configuré (clé Anthropic)
export default function AssistantWidget() {
  const { t } = useLang();
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch('/api/ask', { signal: ctrl.signal })
      .then(r => (r.ok ? r.json() : { enabled: false }))
      .then(d => setEnabled(Boolean(d?.enabled)))
      .catch(() => setEnabled(false));
    return () => ctrl.abort();
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!enabled) return null;

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || loading) return;
    if (count >= MAX_PER_SESSION) {
      setMessages(m => [...m, { role: 'user', content: q }, { role: 'assistant', content: t('ai.limit') }]);
      setInput('');
      return;
    }
    const history = messages;
    setMessages(m => [...m, { role: 'user', content: q }]);
    setInput('');
    setLoading(true);
    setCount(c => c + 1);
    track('assistant_question');
    try {
      const r = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, history }),
      });
      const d = await r.json().catch(() => ({}));
      const answer = r.status === 429 ? t('ai.limit') : (d?.answer as string | null) || t('ai.error');
      setMessages(m => [...m, { role: 'assistant', content: answer }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: t('ai.error') }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <m.button
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ delay: 1.5 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-5 right-5 z-50 flex items-center gap-2 pl-3 pr-4 py-3 rounded-full bg-accent text-black font-bold text-sm shadow-[0_10px_40px_rgba(0,0,0,0.35)] hover:brightness-110 transition"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            {t('ai.open')}
          </m.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <m.div
            role="dialog"
            aria-label={t('ai.title')}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 bottom-0 right-0 sm:bottom-5 sm:right-5 w-full sm:w-[380px] h-[min(560px,85vh)] flex flex-col rounded-t-2xl sm:rounded-2xl border border-white/10 bg-surface shadow-2xl overflow-hidden"
          >
            <header className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-accent/5">
              <span className="p-2 rounded-xl bg-accent text-black"><Bot className="w-4 h-4" /></span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm">{t('ai.title')}</p>
                <p className="text-white/45 text-xs truncate">{t('ai.sub')}</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label={t('ai.close')} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </header>

            <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3" aria-live="polite">
              <div className="max-w-[88%] px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-white/5 text-white/80 text-sm leading-relaxed">
                {t('ai.hello')}
              </div>
              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map(k => (
                    <button key={k} onClick={() => ask(t(k))} className="text-xs px-3 py-1.5 rounded-full border border-accent/30 text-accent hover:bg-accent/10 transition-colors">
                      {t(k)}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    m.role === 'user'
                      ? 'ml-auto rounded-tr-sm bg-accent text-black'
                      : 'rounded-tl-sm bg-white/5 text-white/80'
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-white/40 text-xs"><Loader2 className="w-3.5 h-3.5 animate-spin" /> …</div>
              )}
            </div>

            <form
              onSubmit={e => { e.preventDefault(); ask(input); }}
              className="p-3 border-t border-white/10 flex gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                maxLength={500}
                placeholder={t('ai.placeholder')}
                aria-label={t('ai.placeholder')}
                className="flex-1 h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label={t('ai.send')}
                className="h-10 w-10 flex items-center justify-center rounded-lg bg-accent text-black disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="px-4 pb-2 text-[10px] text-white/30">{t('ai.disclaimer')}</p>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
