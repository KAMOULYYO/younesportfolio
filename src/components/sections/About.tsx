import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Code2, Zap, Globe, Download } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';

const stats = [
  { value: '10+', label: 'Projets' },
  { value: '3+',  label: 'Années' },
  { value: '20+', label: 'Technologies' },
  { value: '500+', label: 'Commits' },
];

const traits = [
  { icon: Code2, label: 'Clean Code',   desc: 'Architecture propre, maintenable et scalable' },
  { icon: Zap,   label: 'Performance',  desc: 'Apps optimisées pour une UX fluide et rapide' },
  { icon: Globe, label: 'Full Stack',   desc: 'Front-end, back-end et déploiement cloud' },
];

export default function About() {
  const { data } = usePortfolio();
  const { profile } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-28 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C3E41D]/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="text-[#C3E41D] font-fira text-sm tracking-widest">&gt; about.me</span>
          <h2 className="text-4xl md:text-6xl font-black mt-2 text-white leading-tight">
            Qui<br /><span className="text-[#C3E41D]">suis-je ?</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 text-white/40 text-sm mb-6 font-fira">
              <MapPin className="w-4 h-4 text-[#C3E41D]" />
              {profile.location}
            </div>

            <p className="text-white/70 text-lg leading-relaxed mb-5">{profile.bio}</p>
            <p className="text-white/45 text-sm leading-relaxed mb-8">
              Étudiant à l&apos;Institut Teccart en programmation web et mobile, j&apos;ai développé
              une passion pour la création de solutions intelligentes. Mon approche combine
              rigueur technique et vision produit pour livrer des applications qui impressionnent.
            </p>

            <Button size="lg" variant="outline" asChild className="mb-10">
              <a href={profile.cvUrl} download>
                <Download className="w-4 h-4 mr-2" /> Télécharger mon CV
              </a>
            </Button>

            <div className="space-y-3">
              {traits.map((t, i) => (
                <motion.div
                  key={t.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-[#C3E41D]/20 hover:bg-[#C3E41D]/3 transition-all duration-300 group"
                >
                  <div className="p-2 rounded-lg bg-[#C3E41D]/10 group-hover:bg-[#C3E41D]/20 transition-colors">
                    <t.icon className="w-5 h-5 text-[#C3E41D]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.label}</p>
                    <p className="text-white/40 text-xs mt-0.5">{t.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — stats + photo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.4 + i * 0.08, type: 'spring' }}
                  whileHover={{ scale: 1.03 }}
                  className="p-6 rounded-2xl border border-white/7 bg-white/[0.03] flex flex-col items-center justify-center text-center group cursor-default hover:border-[#C3E41D]/20 transition-all duration-300"
                >
                  <span className="text-3xl font-black text-[#C3E41D] font-fira group-hover:drop-shadow-[0_0_12px_rgba(195,228,29,0.6)] transition-all">
                    {s.value}
                  </span>
                  <span className="text-white/35 text-xs mt-1.5 font-medium">{s.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Photo card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.7 }}
              className="relative rounded-2xl overflow-hidden border border-white/7 h-64 group"
            >
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                width={600}
                height={256}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white font-bold text-xl tracking-tight">{profile.name}</p>
                    <p className="text-[#C3E41D] text-sm font-fira mt-0.5">{profile.title}</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs bg-black/60 border border-[#C3E41D]/30 text-[#C3E41D] px-2.5 py-1 rounded-full backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C3E41D] animate-pulse" />
                    Disponible
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
