import { useMemo, useState } from 'react';
import { m } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Check, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { renderMarkdown } from '@/lib/markdown';
import { slugify } from '@/lib/text';
import type { Post } from '@/types/portfolio';
import FileUpload from './FileUpload';

const today = () => new Date().toISOString().slice(0, 10);
const empty = (): Omit<Post, 'id'> => ({
  slug: '', title: '', excerpt: '', content: '', tags: [], date: today(), published: false,
});

function PostForm({ initial, onSave, onCancel, taken }: {
  initial: Omit<Post, 'id'>;
  onSave: (p: Omit<Post, 'id'>) => void;
  onCancel: () => void;
  taken: string[];
}) {
  const [form, setForm] = useState(initial);
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [preview, setPreview] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const en = lang === 'en';

  const content = (en ? form.content_en : form.content) ?? '';
  const html = useMemo(() => (preview ? renderMarkdown(content) : ''), [preview, content]);
  const slug = form.slug || slugify(form.title);
  const slugTaken = taken.includes(slug);

  type Key = keyof Omit<Post, 'id'>;
  const field = (fr: Key, enKey: Key) => (en ? enKey : fr);
  const set = (k: Key) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const addTag = () => {
    const tg = tagInput.trim();
    if (tg && !form.tags.includes(tg)) setForm(f => ({ ...f, tags: [...f.tags, tg] }));
    setTagInput('');
  };

  return (
    <div className="p-5 rounded-xl border border-accent/20 bg-accent/3 space-y-4">
      <div className="flex flex-wrap gap-2">
        {(['fr', 'en'] as const).map(l => (
          <button key={l} type="button" onClick={() => setLang(l)}
            className={`px-3 py-1 rounded-full text-xs font-fira font-bold ${lang === l ? 'bg-accent text-black' : 'border border-white/10 text-white/60'}`}>
            {l === 'fr' ? 'Français' : 'English (facultatif)'}
          </button>
        ))}
      </div>

      <Input placeholder={en ? 'Title (English)' : "Titre de l'article"} value={(form[field('title', 'title_en')] as string) ?? ''} onChange={set(field('title', 'title_en'))} />
      <Textarea placeholder={en ? 'Short summary (English)' : 'Résumé en 1–2 phrases (affiché dans la liste)'} value={(form[field('excerpt', 'excerpt_en')] as string) ?? ''} onChange={set(field('excerpt', 'excerpt_en'))} className="min-h-[60px]" />

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-white/50 text-xs font-fira">Contenu (Markdown : ## Titre, **gras**, - liste, [lien](https://…), ```code```)</label>
          <button type="button" onClick={() => setPreview(p => !p)} className="flex items-center gap-1 text-xs text-accent">
            {preview ? <><Edit2 className="w-3 h-3" /> Modifier</> : <><Eye className="w-3 h-3" /> Aperçu</>}
          </button>
        </div>
        {preview
          ? <div className="prose-yk min-h-[240px] p-4 rounded-lg border border-white/10 bg-white/[0.02]" dangerouslySetInnerHTML={{ __html: html }} />
          : <Textarea value={content} onChange={set(field('content', 'content_en'))} className="min-h-[320px] font-fira text-xs" />}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-white/50 text-xs font-fira mb-1.5 block">Adresse : /blog/{slug}</label>
          <Input placeholder="adresse-de-l-article (auto)" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))} />
          {slugTaken && <p className="text-red-400 text-xs mt-1">Cette adresse est déjà utilisée par un autre article.</p>}
        </div>
        <div>
          <label className="text-white/50 text-xs font-fira mb-1.5 block">Date</label>
          <Input type="date" value={form.date} onChange={set('date')} />
        </div>
      </div>

      <div>
        <div className="flex gap-2 mb-2">
          <Input placeholder="Ajouter un mot-clé (Entrée)" value={tagInput} onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} />
          <Button type="button" variant="outline" size="sm" onClick={addTag}><Plus className="w-4 h-4" /></Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {form.tags.map(tg => (
            <button key={tg} type="button" onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== tg) }))}
              className="flex items-center gap-1 text-xs bg-white/5 border border-white/10 text-white/70 px-2 py-0.5 rounded-full hover:text-red-400">
              {tg} <X className="w-2.5 h-2.5" />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-white/50 text-xs font-fira block">Image de couverture (facultatif)</label>
        <FileUpload kind="image" label="Envoyer une image" onUploaded={url => setForm(f => ({ ...f, cover: url }))} />
        {form.cover && <img src={form.cover} alt="" className="h-28 rounded-lg object-cover border border-white/10" />}
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="accent-accent" />
        <span className="text-white/70 text-sm">Publié (visible sur le site)</span>
      </label>

      <div className="flex gap-2">
        <Button onClick={() => onSave({ ...form, slug })} disabled={!form.title.trim() || !form.content.trim() || slugTaken}>
          <Check className="w-4 h-4 mr-1" /> Sauvegarder
        </Button>
        <Button variant="ghost" onClick={onCancel}><X className="w-4 h-4 mr-1" /> Annuler</Button>
      </div>
    </div>
  );
}

export default function ManageBlog() {
  const { data, addPost, updatePost, deletePost } = usePortfolio();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const posts = [...data.posts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Blog</h1>
          <p className="text-white/40 text-sm">{posts.length} article(s) · {posts.filter(p => p.published).length} publié(s)</p>
        </div>
        <Button onClick={() => setAdding(true)} disabled={adding}><Plus className="w-4 h-4 mr-2" /> Nouvel article</Button>
      </m.div>

      {adding && (
        <div className="mb-6">
          <PostForm
            initial={empty()}
            taken={data.posts.map(p => p.slug)}
            onSave={p => { addPost(p); setAdding(false); }}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      <div className="space-y-3">
        {posts.map(p => (
          editing === p.id ? (
            <PostForm
              key={p.id}
              initial={p}
              taken={data.posts.filter(x => x.id !== p.id).map(x => x.slug)}
              onSave={np => { updatePost(p.id, np); setEditing(null); }}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/7 bg-white/3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white text-sm font-semibold truncate">{p.title}</h3>
                  {p.published
                    ? <span className="text-[10px] font-fira px-1.5 py-0.5 rounded bg-accent/15 text-accent">Publié</span>
                    : <span className="flex items-center gap-1 text-[10px] font-fira px-1.5 py-0.5 rounded border border-white/15 text-white/50"><EyeOff className="w-3 h-3" /> Brouillon</span>}
                  {p.title_en && <span className="text-[10px] font-fira text-white/40">FR + EN</span>}
                </div>
                <p className="text-white/40 text-xs mt-0.5">{p.date} · /blog/{p.slug}</p>
              </div>
              {p.published && (
                <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-white/40 hover:text-white">
                  <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" aria-label="Voir l'article"><ExternalLink className="w-3.5 h-3.5" /></a>
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => setEditing(p.id)} className="h-8 w-8 text-white/40 hover:text-white" aria-label="Modifier">
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => { if (window.confirm('Supprimer cet article ?')) deletePost(p.id); }}
                className="h-8 w-8 text-red-400/60 hover:text-red-400 hover:bg-red-500/10" aria-label="Supprimer">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
