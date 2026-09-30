import { cn } from './utils';

// Image du projet, ou visuel de remplacement (nom du projet sur fond animé) tant qu'aucune capture n'est envoyée
export function ProjectCover({ src, title, className }: { src?: string; title: string; className?: string }) {
  if (src) {
    return <img src={src} alt={title} className={cn('w-full h-full object-cover', className)} loading="lazy" decoding="async" />;
  }
  const name = title.split(/\s+[—–-]\s+/)[0];
  return (
    <div
      role="img"
      aria-label={title}
      className={cn('relative w-full h-full flex items-center justify-center overflow-hidden bg-surface', className)}
    >
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute -top-1/3 -left-1/4 w-2/3 h-2/3 rounded-full bg-accent/25 blur-3xl" />
      <div className="absolute -bottom-1/3 -right-1/4 w-2/3 h-2/3 rounded-full bg-violet-500/25 blur-3xl" />
      <span className="relative px-6 text-center font-fira font-black text-3xl sm:text-4xl tracking-tight text-white">
        {name}<span className="text-accent">.</span>
      </span>
    </div>
  );
}
