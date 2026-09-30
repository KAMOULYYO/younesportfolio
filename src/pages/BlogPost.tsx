import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Mail } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import PageShell from '@/components/layout/PageShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLang } from '@/lib/i18n';
import { renderMarkdown } from '@/lib/markdown';
import { readingMinutes, formatDate } from '@/lib/text';
import { track } from '@/lib/analytics';

export default function BlogPost() {
  const { slug } = useParams();
  const { data } = usePortfolio();
  const { t, pick, lang } = useLang();
  const post = data.posts.find(p => p.slug === slug && p.published);

  const body = post ? pick(post.content, post.content_en) : '';
  const html = useMemo(() => renderMarkdown(body), [body]);

  useEffect(() => { if (post) track('post_view', post.slug); }, [post]);

  if (!post) {
    return (
      <PageShell title={t('blog.title')}>
        <div className="max-w-3xl mx-auto text-center py-20">
          <p className="text-white/60 mb-6">{t('blog.empty')}</p>
          <Button asChild variant="outline"><Link to="/blog"><ArrowLeft className="w-4 h-4 mr-2" />{t('blog.back')}</Link></Button>
        </div>
      </PageShell>
    );
  }

  const title = pick(post.title, post.title_en);

  return (
    <PageShell title={title}>
      <article className="max-w-3xl mx-auto">
        <Link to="/blog" className="inline-flex items-center gap-2 text-white/50 hover:text-accent text-sm font-fira mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t('blog.back')}
        </Link>

        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/40 font-fira mb-4">
            <span>{formatDate(post.date, lang)}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readingMinutes(body)} {t('blog.minutes')}</span>
            {post.tags.map(tag => <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>)}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">{title}</h1>
          <p className="text-white/55 text-lg mt-4 leading-relaxed">{pick(post.excerpt, post.excerpt_en)}</p>
        </header>

        {post.cover && (
          <img src={post.cover} alt="" className="w-full max-h-[420px] object-cover rounded-2xl border border-white/10 mb-10" />
        )}

        {/* Contenu Markdown déjà nettoyé par DOMPurify (lib/markdown) */}
        <div className="prose-yk" dangerouslySetInnerHTML={{ __html: html }} />

        <div className="mt-16 p-8 rounded-2xl border border-accent/30 bg-accent/5 text-center">
          <p className="text-white text-xl font-bold mb-5">{t('case.cta')}</p>
          <Button asChild size="lg">
            <Link to="/#contact"><Mail className="w-4 h-4 mr-2" /> {t('hero.contact')}</Link>
          </Button>
        </div>
      </article>
    </PageShell>
  );
}
