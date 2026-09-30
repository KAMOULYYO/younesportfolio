import { useEffect, useMemo, useState } from 'react';
import { m } from 'framer-motion';
import { Loader2, AlertCircle, Eye, FileText, Send, Bot, CalendarClock, FolderOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Event {
  type: string;
  path: string | null;
  ref: string | null;
  lang: string | null;
  target: string | null;
  created_at: string;
}

const RANGES = [7, 30, 90] as const;

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function topCounts(values: (string | null)[], limit = 6) {
  const map = new Map<string, number>();
  for (const v of values) if (v) map.set(v, (map.get(v) ?? 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function Tile({ icon: Icon, label, value }: { icon: typeof Eye; label: string; value: number }) {
  return (
    <div className="p-5 rounded-xl border border-white/7 bg-white/[0.03]">
      <div className="flex items-center gap-2 text-white/50 text-xs mb-2">
        <Icon className="w-4 h-4 text-accent" aria-hidden="true" /> {label}
      </div>
      <div className="text-3xl font-bold font-fira text-white">{value}</div>
    </div>
  );
}

function RankList({ title, rows, empty }: { title: string; rows: [string, number][]; empty: string }) {
  const max = rows[0]?.[1] ?? 1;
  return (
    <div className="p-5 rounded-xl border border-white/7 bg-white/[0.03]">
      <h3 className="text-white font-semibold text-sm mb-4">{title}</h3>
      {rows.length === 0 && <p className="text-white/40 text-xs">{empty}</p>}
      <ul className="space-y-2.5">
        {rows.map(([name, n]) => (
          <li key={name}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/70 truncate pr-3">{name}</span>
              <span className="text-white/50 font-fira">{n}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-accent" style={{ width: `${(n / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Visites par jour : une seule série → une seule teinte, pas de légende, info-bulle au survol
function DailyChart({ days }: { days: { key: string; label: string; n: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...days.map(d => d.n));
  const ticks = [max, Math.round(max / 2), 0];

  return (
    <div className="p-5 rounded-xl border border-white/7 bg-white/[0.03]">
      <h3 className="text-white font-semibold text-sm mb-4">Visites par jour</h3>
      <div className="flex gap-2">
        <div className="flex flex-col justify-between h-40 text-[10px] font-fira text-white/35 text-right w-6">
          {ticks.map(t => <span key={t}>{t}</span>)}
        </div>
        <div className="relative flex-1 h-40 border-b border-white/10" onMouseLeave={() => setHover(null)}>
          {/* Grille discrète */}
          <div className="absolute inset-x-0 top-0 border-t border-white/5" />
          <div className="absolute inset-x-0 top-1/2 border-t border-white/5" />
          <div className="absolute inset-0 flex items-end gap-[2px]">
            {days.map((d, i) => (
              <div
                key={d.key}
                className="relative flex-1 h-full flex items-end cursor-default"
                onMouseEnter={() => setHover(i)}
                role="img"
                aria-label={`${d.label} : ${d.n} visite(s)`}
              >
                <div
                  className="w-full rounded-t-[4px] transition-opacity"
                  style={{
                    height: `${(d.n / max) * 100}%`,
                    minHeight: d.n ? 2 : 0,
                    background: 'var(--color-accent)',
                    opacity: hover === null || hover === i ? 1 : 0.45,
                  }}
                />
              </div>
            ))}
          </div>
          {hover !== null && (
            <div
              className="absolute -top-2 -translate-y-full px-2.5 py-1.5 rounded-lg bg-surface border border-white/10 shadow-lg text-xs whitespace-nowrap pointer-events-none"
              style={{ left: `${((hover + 0.5) / days.length) * 100}%`, transform: 'translate(-50%, -100%)' }}
            >
              <span className="text-white/50">{days[hover].label}</span>{' '}
              <span className="text-white font-bold font-fira">{days[hover].n}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between text-[10px] font-fira text-white/35 mt-1.5 pl-8">
        <span>{days[0]?.label}</span>
        <span>{days[days.length - 1]?.label}</span>
      </div>
    </div>
  );
}

// Statistiques anonymes du portfolio (table public.events)
export default function ManageStats() {
  const [range, setRange] = useState<(typeof RANGES)[number]>(30);
  // Résultat lié à la période demandée : tant qu'il ne correspond pas, on affiche le chargement
  const [result, setResult] = useState<{ range: number; now: number; events: Event[] } | null>(null);
  const events = result?.range === range ? result.events : null;
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const now = Date.now();
    const since = new Date(now - range * 86400000).toISOString();
    supabase
      .from('events')
      .select('type, path, ref, lang, target, created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: true })
      .limit(10000)
      .then(({ data, error: err }) => {
        if (cancelled) return;
        if (err) {
          setError(err.code === '42P01' || err.code === 'PGRST205'
            ? "La table « events » n'existe pas encore : exécute supabase/002_messages_stats.sql."
            : err.message);
          setResult({ range, now, events: [] });
          return;
        }
        setError('');
        setResult({ range, now, events: data as Event[] });
      });
    return () => { cancelled = true; };
  }, [range]);

  const stats = useMemo(() => {
    const ev = events ?? [];
    const count = (t: string) => ev.filter(e => e.type === t).length;
    const views = ev.filter(e => e.type === 'page_view');
    const byDay = new Map<string, number>();
    for (const e of views) {
      const k = e.created_at.slice(0, 10);
      byDay.set(k, (byDay.get(k) ?? 0) + 1);
    }
    const days = Array.from({ length: range }, (_, i) => {
      const d = new Date((result?.now ?? 0) - (range - 1 - i) * 86400000);
      const key = dayKey(d);
      return { key, label: d.toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' }), n: byDay.get(key) ?? 0 };
    });
    return {
      views: views.length,
      cv: count('cv_open') + count('cv_download'),
      contact: count('contact_sent'),
      assistant: count('assistant_question'),
      booking: count('booking_click'),
      projects: count('project_view'),
      days,
      refs: topCounts(views.map(e => e.ref)),
      pages: topCounts(views.map(e => e.path)),
      langs: topCounts(views.map(e => (e.lang ?? '').slice(0, 2).toUpperCase() || null)),
      projectsViewed: topCounts(ev.filter(e => e.type === 'project_view').map(e => e.target)),
    };
  }, [events, range, result?.now]);

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Statistiques</h1>
          <p className="text-white/40 text-sm">Anonymes : aucun cookie, aucune IP. Tes propres visites ne sont pas comptées.</p>
        </div>
        {/* Filtre de période — une seule rangée au-dessus des graphiques */}
        <div className="flex rounded-lg border border-white/10 overflow-hidden" role="group" aria-label="Période">
          {RANGES.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={`px-3 py-1.5 text-xs font-fira ${range === r ? 'bg-accent text-black font-bold' : 'text-white/60 hover:bg-white/5'}`}
            >
              {r} j
            </button>
          ))}
        </div>
      </m.div>

      {error && (
        <p role="alert" className="flex items-start gap-2 text-red-300 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 mb-6">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {error}
        </p>
      )}

      {events === null ? (
        <Loader2 className="w-5 h-5 text-accent animate-spin" />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Tile icon={Eye} label="Pages vues" value={stats.views} />
            <Tile icon={FileText} label="CV ouverts / téléchargés" value={stats.cv} />
            <Tile icon={Send} label="Messages envoyés" value={stats.contact} />
            <Tile icon={FolderOpen} label="Études de cas lues" value={stats.projects} />
            <Tile icon={Bot} label="Questions à l'assistant" value={stats.assistant} />
            <Tile icon={CalendarClock} label="Clics « Réserver un appel »" value={stats.booking} />
          </div>

          <DailyChart days={stats.days} />

          <div className="grid md:grid-cols-2 gap-4">
            <RankList title="D'où viennent les visiteurs" rows={stats.refs} empty="Visites directes uniquement (lien tapé ou partagé)." />
            <RankList title="Pages les plus vues" rows={stats.pages} empty="Pas encore de données." />
            <RankList title="Études de cas les plus lues" rows={stats.projectsViewed} empty="Pas encore de données." />
            <RankList title="Langue du navigateur" rows={stats.langs} empty="Pas encore de données." />
          </div>
        </div>
      )}
    </div>
  );
}
