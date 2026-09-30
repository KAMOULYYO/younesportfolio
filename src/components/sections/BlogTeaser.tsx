import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { useLang } from '@/lib/i18n';
import { readingMinutes, formatDate } from '@/lib/text';

// Les 2 derniers articles publiés (section masquée s'il n'y en a aucun)
export default function BlogTeaser() {
  const { data } = usePortfolio();
  const { t, pick, lang } = useLang();
  const posts = data.posts
    .filter(p => p.published)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 2);

  if (!posts.length) return null;

  return (
    <section id="blog" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-accent font-fira text-sm tracking-widest">&gt; blog.latest</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 text-white">
              {t('blog.latest')}<span className="text-accent">.</span>
            </h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/blog">{t('blog.all')} <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {posts.map(p => (
            <Link
              key={p.id}
              to={`/blog/${p.slug}`}
              className="spotlight group p-6 rounded-2xl border border-white/7 bg-white/[0.03] hover:border-accent/30 transition-all"
            >
              <div className="flex items-center gap-3 text-xs text-white/40 font-fira mb-3">
                <span>{formatDate(p.date, lang)}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readingMinutes(pick(p.content, p.content_en))} {t('blog.minutes')}</span>
              </div>
              <h3 className="text-white font-bold text-xl mb-2 group-hover:text-accent transition-colors">{pick(p.title, p.title_en)}</h3>
              <p className="text-white/50 text-sm leading-relaxed line-clamp-3">{pick(p.excerpt, p.excerpt_en)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
