import { AnimatePresence, m } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { cn } from './utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { isDark, toggle } = useTheme();
  const { t } = useLang();

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? t('theme.light') : t('theme.dark')}
      title={isDark ? t('theme.light') : t('theme.dark')}
      className={cn(
        'relative w-9 h-9 rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-accent hover:border-accent/40 flex items-center justify-center overflow-hidden transition-colors',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={isDark ? 'sun' : 'moon'}
          initial={{ y: 14, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -14, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </m.span>
      </AnimatePresence>
    </button>
  );
}
