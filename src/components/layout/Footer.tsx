import { Mail, Heart } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/social-icons';
import { usePortfolio } from '@/context/PortfolioContext';
import { useLang } from '@/lib/i18n';

export default function Footer() {
  const { data } = usePortfolio();
  const { profile } = data;
  const { t, pick } = useLang();

  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="text-accent font-fira font-bold text-2xl tracking-widest mb-1">
              YK<span className="text-white">.</span>
            </div>
            <p className="text-white/60 text-sm max-w-md">{pick(profile.tagline, profile.tagline_en)}</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Profil GitHub de Younes Kamouly"
              className="p-2 rounded-lg border border-white/10 text-white/50 hover:text-accent hover:border-accent/50 transition-all duration-300"
            >
              <GithubIcon className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Profil LinkedIn de Younes Kamouly"
              className="p-2 rounded-lg border border-white/10 text-white/50 hover:text-accent hover:border-accent/50 transition-all duration-300"
            >
              <LinkedinIcon className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              aria-label={`Envoyer un email à ${profile.email}`}
              className="p-2 rounded-lg border border-white/10 text-white/50 hover:text-accent hover:border-accent/50 transition-all duration-300"
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-white/55 text-sm flex items-center justify-center gap-1">
            {t('footer.made')} {profile.name} <Heart className="w-3 h-3 text-accent" aria-hidden="true" /> © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
