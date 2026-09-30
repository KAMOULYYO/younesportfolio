import { useEffect, useRef, useState } from 'react';
import { m, useInView } from 'framer-motion';
import { Star, GitFork, ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/ui/social-icons';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { useLang } from '@/lib/i18n';

interface Repo {
  name: string;
  desc: string;
  stars: number;
  forks: number;
  lang: string;
  url: string;
}

const langColors: Record<string, string> = {
  Python: '#3776ab',
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  HTML: '#e34c26',
  CSS: '#563d7c',
};

const CACHE_KEY = 'gh_repos_v1';
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 h — l'API GitHub limite à 60 requêtes/heure par IP

function usernameFrom(url: string) {
  const m = url.match(/github\.com\/([^/?#]+)/i);
  return m?.[1] ?? '';
}

// Vrais dépôts publics, chargés depuis l'API GitHub (plus de chiffres inventés)
function readCache(user: string): Repo[] | null {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? 'null');
    if (cached?.user === user && Date.now() - cached.at < CACHE_TTL) return cached.repos;
  } catch { /* cache illisible */ }
  return null;
}

function useRepos(user: string, enabled: boolean) {
  const [repos, setRepos] = useState<Repo[] | null>(() => readCache(user));

  useEffect(() => {
    if (!user || !enabled || readCache(user)) return;

    const ctrl = new AbortController();
    fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=pushed`, { signal: ctrl.signal })
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((list: Array<Record<string, unknown>>) => {
        const out: Repo[] = list
          .filter(r => !r.fork && !r.archived && r.name !== user && r.name !== 'test')
          .sort((a, b) => (b.stargazers_count as number) - (a.stargazers_count as number))
          .slice(0, 6)
          .map(r => ({
            name: r.name as string,
            desc: (r.description as string) || '',
            stars: r.stargazers_count as number,
            forks: r.forks_count as number,
            lang: (r.language as string) || '—',
            url: r.html_url as string,
          }));
        setRepos(out);
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ user, at: Date.now(), repos: out })); } catch { /* ignore */ }
      })
      .catch(() => { if (!ctrl.signal.aborted) setRepos([]); });
    return () => ctrl.abort();
  }, [user, enabled]);

  return repos;
}

export default function GitHubSection() {
  const { data } = usePortfolio();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const near = useInView(ref, { once: true, margin: '400px' });
  const githubRepos = useRepos(usernameFrom(data.profile.github), near);
  const { t } = useLang();

  return (
    <section id="github" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto" ref={ref}>
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-accent font-fira text-sm tracking-widest">&gt; github.repos</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 text-white">
            {t('github.title')}<span className="text-accent">.</span>
          </h2>
        </m.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {githubRepos === null && Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-[132px] rounded-xl border border-white/7 bg-white/[0.03] animate-pulse" />
          ))}
          {githubRepos?.map((repo, i) => (
            <m.a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.02, borderColor: 'rgba(195,228,29,0.2)' }}
              className="spotlight p-5 rounded-xl border border-white/7 bg-white/[0.03] hover:bg-white/5 transition-all duration-300 group block"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GithubIcon className="w-4 h-4 text-white/40" />
                  <span className="text-accent text-sm font-medium font-fira group-hover:underline">
                    {repo.name}
                  </span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
              </div>
              <p className="text-white/50 text-xs leading-relaxed mb-4">{repo.desc || t('github.public')}</p>
              <div className="flex items-center gap-4 text-xs text-white/30">
                <span className="flex items-center gap-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: langColors[repo.lang] ?? '#888' }}
                  />
                  {repo.lang}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" /> {repo.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-3 h-3" /> {repo.forks}
                </span>
              </div>
            </m.a>
          ))}
        </div>

        <m.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <Button variant="outline" asChild size="lg">
            <a href={data.profile.github} target="_blank" rel="noopener noreferrer">
              <GithubIcon className="w-5 h-5 mr-2" />
              {t('github.all')}
            </a>
          </Button>
        </m.div>
      </div>
    </section>
  );
}
