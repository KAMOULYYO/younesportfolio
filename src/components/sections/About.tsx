import { m, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Code2, Zap, Globe, Download, FileText, Eye } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { hasCv, downloadUrl } from '@/lib/safeUrl';
import { portfolioStats } from '@/lib/stats';
import { useLang, type StringKey } from '@/lib/i18n';
import { track } from '@/lib/analytics';

const traits: { icon: typeof Code2; label: StringKey; desc: StringKey }[] = [
  { icon: Code2, label: 'trait.clean', desc: 'trait.clean.d' },
  { icon: Zap,   label: 'trait.perf',  desc: 'trait.perf.d' },
  { icon: Globe, label: 'trait.full',  desc: 'trait.full.d' },
];

export default function About() {
  const { data } = usePortfolio();
  const { profile } = data;
  const { t, pick, lang } = useLang();
  const stats = portfolioStats(data, t);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const title = pick(profile.title, profile.title_en);
  const cvUrl = lang === 'en' && hasCv(profile.cvUrl_en ?? '') ? profile.cvUrl_en! : profile.cvUrl;
  const cvName = lang === 'en' ? 'Resume-Younes-Kamouly.pdf' : 'CV-Younes-Kamouly.pdf';

  return (
    <section id="about" className="py-28 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto" ref={ref}>
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="text-accent font-fira text-sm tracking-widest">&gt; about.me</span>
          <h2 className="text-4xl md:text-6xl font-black mt-2 text-white leading-tight">
            {t('about.title1')}<br /><span className="text-accent">{t('about.title2')}</span>
          </h2>
        </m.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <m.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 text-white/40 text-sm mb-6 font-fira">
              <MapPin className="w-4 h-4 text-accent" />
              {profile.location}
            </div>

            <p className="text-white/70 text-lg leading-relaxed mb-5">{pick(profile.bio, profile.bio_en)}</p>
            <p className="text-white/45 text-sm leading-relaxed mb-8">{t('about.extra')}</p>

            {hasCv(cvUrl) && (
              <div className="group relative flex flex-wrap items-center gap-4 p-4 mb-10 rounded-2xl border border-accent/30 bg-accent/5 hover:border-accent/60 transition-all duration-300 overflow-hidden">
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-accent/10 to-transparent pointer-events-none" />
                <span className="relative flex-shrink-0 w-12 h-14 rounded-lg bg-accent text-black flex flex-col items-center justify-center shadow-lg">
                  <FileText className="w-5 h-5" aria-hidden="true" />
                  <span className="text-[9px] font-fira font-bold mt-0.5">PDF</span>
                </span>
                <span className="relative flex-1 min-w-[140px]">
                  <span className="block text-white font-bold">{t('about.cv')}</span>
                  <span className="block text-white/45 text-xs mt-0.5">{profile.name} · {title}</span>
                </span>
                <span className="relative flex gap-2">
                  <a
                    href={cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('cv_open', 'about')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-accent/40 text-accent text-sm font-semibold hover:bg-accent/10 transition-colors"
                  >
                    <Eye className="w-4 h-4" aria-hidden="true" /> {t('about.view')}
                  </a>
                  <a
                    href={downloadUrl(cvUrl, cvName)}
                    download={cvName}
                    onClick={() => track('cv_download', 'about')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-accent text-black text-sm font-semibold hover:brightness-110 transition"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" /> {t('about.download')}
                  </a>
                </span>
              </div>
            )}

            <div className="space-y-3 mt-2">
              {traits.map((tr, i) => (
                <m.div
                  key={tr.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="spotlight flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-accent/20 hover:bg-accent/3 transition-all duration-300 group"
                >
                  <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <tr.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t(tr.label)}</p>
                    <p className="text-white/40 text-xs mt-0.5">{t(tr.desc)}</p>
                  </div>
                </m.div>
              ))}
            </div>
          </m.div>

          {/* Right — stats + photo */}
          <m.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s, i) => (
                <m.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.4 + i * 0.08, type: 'spring' }}
                  whileHover={{ scale: 1.03 }}
                  className="spotlight p-6 rounded-2xl border border-white/7 bg-white/[0.03] flex flex-col items-center justify-center text-center group cursor-default hover:border-accent/20 transition-all duration-300"
                >
                  <span className="text-3xl font-black text-accent font-fira group-hover:drop-shadow-[0_0_12px_rgba(195,228,29,0.6)] transition-all">
                    {s.value}
                  </span>
                  <span className="text-white/35 text-xs mt-1.5 font-medium">{s.label}</span>
                </m.div>
              ))}
            </div>

            <m.div
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
                    <p className="text-accent text-sm font-fira mt-0.5">{title}</p>
                  </div>
                  {profile.availability && (
                    <span className="flex items-center gap-1.5 text-xs bg-black/60 border border-accent/30 text-accent px-2.5 py-1 rounded-full backdrop-blur-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      {t('about.available')}
                    </span>
                  )}
                </div>
              </div>
            </m.div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
