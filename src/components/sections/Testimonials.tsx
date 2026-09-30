import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { useLang } from '@/lib/i18n';

export default function Testimonials() {
  const { data } = usePortfolio();
  const { t, pick } = useLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  if (!data.testimonials.length) return null;

  return (
    <section id="testimonials" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-accent/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto" ref={ref}>
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-accent font-fira text-sm tracking-widest">&gt; testimonials</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 text-white">
            {t('testi.title')}<span className="text-accent">.</span>
          </h2>
        </m.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.testimonials.map((tm, i) => (
            <m.div
              key={tm.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12 }}
              whileHover={{ scale: 1.02, borderColor: 'rgba(195,228,29,0.2)' }}
              className="p-6 rounded-2xl border border-white/7 bg-white/[0.03] transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex">
                  {Array.from({ length: tm.rating }).map((_, ri) => (
                    <Star key={ri} className="w-4 h-4 text-accent" fill="var(--color-accent)" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-accent/30" />
              </div>

              <p className="text-white/60 text-sm leading-relaxed flex-1 mb-6 italic">
                &ldquo;{pick(tm.content, tm.content_en)}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <img
                  src={tm.avatar}
                  alt={tm.name}
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                  loading="lazy"
                  decoding="async"
                  width={40}
                  height={40}
                />
                <div>
                  <p className="text-white font-semibold text-sm">{tm.name}</p>
                  <p className="text-white/40 text-xs">{tm.role} · {tm.company}</p>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
