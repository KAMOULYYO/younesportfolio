import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, GitFork, ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/ui/social-icons';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';

const githubRepos = [
  { name: 'localboost-ai', desc: 'Plateforme IA pour booster les PME locales', stars: 12, forks: 3, lang: 'Python' },
  { name: 'travelmate', desc: "App d'agence de voyages intelligente avec IA", stars: 8, forks: 2, lang: 'TypeScript' },
  { name: 'libranet', desc: 'Bibliothèque numérique avec recommandations IA', stars: 6, forks: 1, lang: 'Python' },
  { name: 'pausemanager', desc: 'Gestion des pauses employés en temps réel', stars: 5, forks: 1, lang: 'TypeScript' },
  { name: 'workforce-manager', desc: 'Système RH avec rôles admin/manager/employé', stars: 4, forks: 2, lang: 'TypeScript' },
  { name: 'portfolio', desc: 'Portfolio personnel React + TypeScript + Framer Motion', stars: 9, forks: 0, lang: 'TypeScript' },
];

const langColors: Record<string, string> = {
  Python: '#3776ab',
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  CSS: '#563d7c',
};

export default function GitHubSection() {
  const { data } = usePortfolio();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="github" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[#C3E41D] font-fira text-sm tracking-widest">&gt; github.repos</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 text-white">
            Repos GitHub<span className="text-[#C3E41D]">.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {githubRepos.map((repo, i) => (
            <motion.a
              key={repo.name}
              href={`${data.profile.github}/${repo.name}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.02, borderColor: 'rgba(195,228,29,0.2)' }}
              className="p-5 rounded-xl border border-white/7 bg-white/3 backdrop-blur-sm hover:bg-white/5 transition-all duration-300 group block"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GithubIcon className="w-4 h-4 text-white/40" />
                  <span className="text-[#C3E41D] text-sm font-medium font-fira group-hover:underline">
                    {repo.name}
                  </span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
              </div>
              <p className="text-white/50 text-xs leading-relaxed mb-4">{repo.desc}</p>
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
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <Button variant="outline" asChild size="lg">
            <a href={data.profile.github} target="_blank" rel="noopener noreferrer">
              <GithubIcon className="w-5 h-5 mr-2" />
              Voir tous mes repositories
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
