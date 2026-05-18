import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Badge } from '@/components/ui/badge';

export default function Experience() {
  const { data } = usePortfolio();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const workExp = data.experiences.filter(e => e.type === 'work');
  const academicExp = data.experiences.filter(e => e.type === 'academic');

  return (
    <section id="experience" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 bg-[#C3E41D]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[#C3E41D] font-fira text-sm tracking-widest">&gt; my.experience</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 text-white">
            Parcours<span className="text-[#C3E41D]">.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Work experience */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 mb-8"
            >
              <Briefcase className="w-5 h-5 text-[#C3E41D]" />
              <h3 className="text-white font-bold text-xl">Expériences pro</h3>
            </motion.div>
            <div className="relative">
              <div className="absolute left-2.5 top-0 bottom-0 w-px bg-white/10" />
              <div className="space-y-8">
                {workExp.map((exp, i) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="pl-10 relative"
                  >
                    <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full border-2 border-[#C3E41D] bg-black" />
                    <div className="p-5 rounded-xl border border-white/7 bg-white/3 hover:border-[#C3E41D]/20 transition-all duration-300">
                      <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                        <h4 className="text-white font-semibold">{exp.title}</h4>
                        <span className="flex items-center gap-1 text-xs text-white/30 font-fira">
                          <Calendar className="w-3 h-3" /> {exp.period}
                        </span>
                      </div>
                      <p className="text-[#C3E41D] text-sm font-medium mb-3">{exp.company}</p>
                      <p className="text-white/50 text-sm leading-relaxed mb-4">{exp.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies.map(tech => (
                          <Badge key={tech} className="text-xs">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Academic */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 mb-8"
            >
              <GraduationCap className="w-5 h-5 text-violet-400" />
              <h3 className="text-white font-bold text-xl">Projets académiques</h3>
            </motion.div>
            <div className="relative">
              <div className="absolute left-2.5 top-0 bottom-0 w-px bg-white/10" />
              <div className="space-y-8">
                {academicExp.map((exp, i) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="pl-10 relative"
                  >
                    <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full border-2 border-violet-400 bg-black" />
                    <div className="p-5 rounded-xl border border-white/7 bg-white/3 hover:border-violet-400/20 transition-all duration-300">
                      <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                        <h4 className="text-white font-semibold">{exp.title}</h4>
                        <span className="flex items-center gap-1 text-xs text-white/30 font-fira">
                          <Calendar className="w-3 h-3" /> {exp.period}
                        </span>
                      </div>
                      <p className="text-violet-400 text-sm font-medium mb-3">{exp.company}</p>
                      <p className="text-white/50 text-sm leading-relaxed mb-4">{exp.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies.map(tech => (
                          <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
