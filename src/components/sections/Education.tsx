import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';

export default function Education() {
  const { data } = usePortfolio();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="education" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-violet-500/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[#C3E41D] font-fira text-sm tracking-widest">&gt; my.education</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 text-white">
            Formation<span className="text-[#C3E41D]">.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {data.education.map((edu, i) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.01, borderColor: 'rgba(195,228,29,0.2)' }}
              className="p-8 rounded-2xl border border-white/7 bg-white/[0.03] transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-[#C3E41D]/10 flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-[#C3E41D]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">{edu.degree}</h3>
                  <p className="text-[#C3E41D] text-sm font-medium mt-1">{edu.institution}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-4 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {edu.period}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {edu.location}
                </span>
              </div>

              <p className="text-white/50 text-sm leading-relaxed">{edu.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
