import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Video } from '@/types/portfolio';

const empty: Omit<Video, 'id'> = { title: '', description: '', url: '', thumbnail: '' };

function VideoForm({ initial, onSave, onCancel, title }: {
  initial: Omit<Video, 'id'>;
  onSave: (v: Omit<Video, 'id'>) => void;
  onCancel: () => void;
  title: string;
}) {
  const [form, setForm] = useState(initial);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="p-5 rounded-xl border border-[#C3E41D]/20 bg-[#C3E41D]/3 space-y-3">
      <h3 className="text-white font-semibold">{title}</h3>
      <Input placeholder="Titre" value={form.title} onChange={set('title')} />
      <Textarea placeholder="Description" value={form.description} onChange={set('description')} className="min-h-[60px]" />
      <Input placeholder="URL vidéo (YouTube embed, Vimeo...)" value={form.url} onChange={set('url')} />
      <Input placeholder="Thumbnail URL" value={form.thumbnail} onChange={set('thumbnail')} />
      {form.thumbnail && (
        <img src={form.thumbnail} alt="" className="h-32 rounded-lg object-cover border border-white/10" />
      )}
      <div className="flex gap-2">
        <Button onClick={() => onSave(form)} disabled={!form.title}>
          <Check className="w-4 h-4 mr-1" /> Sauvegarder
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          <X className="w-4 h-4 mr-1" /> Annuler
        </Button>
      </div>
    </div>
  );
}

export default function ManageVideos() {
  const { data, addVideo, updateVideo, deleteVideo } = usePortfolio();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div className="p-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Vidéos</h1>
          <p className="text-white/40 text-sm">{data.videos.length} vidéos</p>
        </div>
        <Button onClick={() => setAdding(true)} disabled={adding}>
          <Plus className="w-4 h-4 mr-2" /> Nouvelle vidéo
        </Button>
      </motion.div>

      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6">
            <VideoForm title="Nouvelle vidéo" initial={empty} onSave={v => { addVideo(v); setAdding(false); }} onCancel={() => setAdding(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {data.videos.map((video, i) => (
          <motion.div key={video.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
            {editing === video.id ? (
              <VideoForm title="Modifier" initial={video} onSave={v => { updateVideo(video.id, v); setEditing(null); }} onCancel={() => setEditing(null)} />
            ) : (
              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/7 bg-white/3 hover:border-white/12 transition-all">
                {video.thumbnail && <img src={video.thumbnail} alt="" className="w-20 h-12 rounded-lg object-cover flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-sm font-semibold truncate">{video.title}</h3>
                  <p className="text-white/40 text-xs line-clamp-1 mt-0.5">{video.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(video.id)} className="h-8 w-8 text-white/40 hover:text-white">
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { if (window.confirm('Supprimer cette vidéo ?')) deleteVideo(video.id); }} className="h-8 w-8 text-red-400/60 hover:text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
