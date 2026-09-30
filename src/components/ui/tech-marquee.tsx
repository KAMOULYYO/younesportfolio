import { usePortfolio } from '@/context/PortfolioContext';

// Bandeau qui fait défiler les technologies (CSS pur, se met en pause au survol)
export function TechMarquee() {
  const { data } = usePortfolio();
  const names = [...new Set(data.skills.map(s => s.name))];
  if (names.length < 4) return null;

  const row = names.map(n => (
    <span key={n} className="flex-shrink-0 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-white/55 text-xs font-fira whitespace-nowrap">
      {n}
    </span>
  ));

  return (
    <div className="marquee overflow-hidden py-2" aria-hidden="true">
      <div className="marquee-track">
        {row}
        {/* Copie pour une boucle sans à-coup */}
        {names.map(n => (
          <span key={`${n}-2`} className="flex-shrink-0 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-white/55 text-xs font-fira whitespace-nowrap">
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}
