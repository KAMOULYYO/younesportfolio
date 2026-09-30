import { useLang } from '@/lib/i18n';
import { cn } from './utils';

export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang, t } = useLang();
  return (
    <button
      onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
      aria-label={t('lang.switch')}
      title={t('lang.switch')}
      className={cn(
        'h-9 min-w-9 px-2.5 rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-accent hover:border-accent/40 text-xs font-fira font-bold transition-colors',
        className,
      )}
    >
      {t('lang.label')}
    </button>
  );
}
