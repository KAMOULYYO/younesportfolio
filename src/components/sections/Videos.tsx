import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import type { Video } from '@/types/portfolio';

function VideoCard({ video, index, onClick }: { video: Video; index: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group relative rounded-2xl overflow-hidden border border-white/7 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48">
        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" width={600} height={340} />
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-14 h-14 rounded-full bg-[#C3E41D] flex items-center justify-center shadow-[0_0_30px_rgba(195,228,29,0.5)]"
          >
            <Play className="w-6 h-6 text-black ml-1" fill="black" />
          </motion.div>
        </div>
      </div>
      <div className="p-4 bg-white/3 backdrop-blur-sm">
        <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-[#C3E41D] transition-colors">
          {video.title}
        </h3>
        <p className="text-white/40 text-xs line-clamp-2">{video.description}</p>
      </div>
    </motion.div>
  );
}

export default function Videos() {
  const { data } = usePortfolio();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  if (!data.videos.length) return null;

  return (
    <section id="videos" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-[#C3E41D]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[#C3E41D] font-fira text-sm tracking-widest">&gt; demo.videos</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 text-white">
            Vidéos de démo<span className="text-[#C3E41D]">.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.videos.map((video, i) => (
            <VideoCard key={video.id} video={video} index={i} onClick={() => setActiveVideo(video)} />
          ))}
        </div>
      </div>

      {/* Modal */}
      {activeVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden border border-white/10"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video">
              <iframe
                src={activeVideo.url}
                title={activeVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4">
              <h3 className="text-white font-bold text-lg">{activeVideo.title}</h3>
              <p className="text-white/50 text-sm mt-1">{activeVideo.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
