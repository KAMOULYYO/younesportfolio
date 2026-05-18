import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { usePortfolio } from '@/context/PortfolioContext';
import type { Skill } from '@/types/portfolio';

const categoryConfig = {
  frontend: { label: 'Frontend', color: '#C3E41D', bg: 'rgba(195,228,29,0.08)', border: 'rgba(195,228,29,0.2)' },
  backend:  { label: 'Backend',  color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)' },
  database: { label: 'Database', color: '#22d3ee', bg: 'rgba(34,211,238,0.08)',  border: 'rgba(34,211,238,0.2)' },
  tools:    { label: 'Tools',    color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.2)' },
  ai:       { label: 'IA & ML',  color: '#f472b6', bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.2)' },
};

const categories = ['frontend', 'backend', 'database', 'tools', 'ai'] as const;

function SkillPill({ skill, index }: { skill: Skill; index: number }) {
  const cfg = categoryConfig[skill.category];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.06, y: -2 }}
      className="group relative px-4 py-2.5 rounded-xl cursor-default"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      {/* Level bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] rounded-b-xl"
        style={{ background: cfg.color }}
        initial={{ width: 0 }}
        animate={{ width: `${skill.level}%` }}
        transition={{ duration: 1.2, delay: index * 0.04 + 0.3, ease: 'easeOut' }}
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-white text-sm font-medium">{skill.name}</span>
        <span className="text-[10px] font-fira font-bold" style={{ color: cfg.color }}>{skill.level}%</span>
      </div>
    </motion.div>
  );
}

function CategoryBlock({ cat, skills, delay }: { cat: typeof categories[number]; skills: Skill[]; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const cfg = categoryConfig[cat];

  if (!skills.length) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
      className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
    >
      {/* Category header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-2 h-8 rounded-full" style={{ background: cfg.color }} />
        <h3 className="text-white font-bold text-lg">{cfg.label}</h3>
        <span className="ml-auto text-xs font-fira px-2 py-0.5 rounded-full"
          style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
          {skills.length} outils
        </span>
      </div>

      {/* Pills grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {skills.map((s, i) => <SkillPill key={s.id} skill={s} index={i} />)}
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const { data } = usePortfolio();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const grouped = categories.reduce((acc, c) => {
    acc[c] = data.skills.filter(s => s.category === c);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section id="skills" className="py-28 px-6 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-[#C3E41D]/3 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="text-[#C3E41D] font-fira text-sm tracking-widest">&gt; my.skills</span>
          <h2 className="text-4xl md:text-6xl font-black mt-2 text-white leading-tight">
            Stack<br /><span className="text-[#C3E41D]">technique.</span>
          </h2>
          <p className="text-white/40 mt-4 max-w-xl text-sm">
            Technologies maîtrisées — du frontend au déploiement, en passant par l&apos;IA.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {categories.map((cat, i) => (
            <CategoryBlock
              key={cat}
              cat={cat}
              skills={grouped[cat] ?? []}
              delay={i * 0.08}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
