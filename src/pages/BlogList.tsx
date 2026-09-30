import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import PageShell from '@/components/layout/PageShell';
import { Badge } from '@/components/ui/badge';
import { useLang } from '@/lib/i18n';
import { readingMinutes, formatDate } from '@/lib/text';


export default function BlogList() {
  const { data } = usePortfolio();
  const { t, pick, lang } = useLang();
  const posts = data.posts
    .filter(p => p.published)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <PageShell title={t('blog.title')}>
      <div className="max-w-4xl mx-auto">
        <span className="text-accent font-fira text-sm tracking-widest">&gt; blog.posts</span>
        <h1 className="text-4xl md:text-6xl font-black mt-2 text-white leading-tight">
          {t('blog.title')}<span className="text-accent">.</span>
        </h1>
        <p className="text-white/50 mt-4 mb-12">{t('blog.sub')}</p>

        {posts.length === 0 && <p className="text-white/40">{t('blog.empty')}</p>}

        <div className="space-y-5">
          {posts.map((p, i) => (
            <m.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link
                to={`/blog/${p.slug}`}
                className="group flex flex-col sm:flex-row gap-5 p-5 rounded-2xl border border-white/7 bg-white/[0.03] hover:border-accent/30 transition-all"
              >
                {p.cover && (
                  <img src={p.cover} alt="" loading="lazy" className="w-full sm:w-48 h-40 sm:h-32 rounded-xl object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-white/40 font-fira mb-2">
                    <span>{formatDate(p.date, lang)}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readingMinutes(pick(p.content, p.content_en))} {t('blog.minutes')}</span>
                  </div>
                  <h2 className="text-white font-bold text-xl mb-2 group-hover:text-accent transition-colors">{pick(p.title, p.title_en)}</h2>
                  <p className="text-white/55 text-sm leading-relaxed line-clamp-2">{pick(p.excerpt, p.excerpt_en)}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {p.tags.map(tag => <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>)}
                    <span className="ml-auto flex items-center gap-1 text-accent text-sm font-semibold">
                      {t('blog.read')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </m.div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
