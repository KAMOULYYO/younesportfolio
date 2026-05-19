import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';

export default function Testimonials() {
  const { data } = usePortfolio();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  if (!data.testimonials.length) return null;

  return (
    <section id="testimonials" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C3E41D]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[#C3E41D] font-fira text-sm tracking-widest">&gt; testimonials</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 text-white">
            Ce qu&apos;ils disent<span className="text-[#C3E41D]">.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12 }}
              whileHover={{ scale: 1.02, borderColor: 'rgba(195,228,29,0.2)' }}
              className="p-6 rounded-2xl border border-white/7 bg-white/[0.03] transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex">
                  {Array.from({ length: t.rating }).map((_, ri) => (
                    <Star key={ri} className="w-4 h-4 text-[#C3E41D]" fill="#C3E41D" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-[#C3E41D]/30" />
              </div>

              <p className="text-white/60 text-sm leading-relaxed flex-1 mb-6 italic">
                &ldquo;{t.content}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                  loading="lazy"
                  decoding="async"
                  width={40}
                  height={40}
                />
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.role} · {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
