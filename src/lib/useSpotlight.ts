import { useEffect } from 'react';

// Un seul écouteur pour tout le site : met à jour la position de la souris
// (--mx / --my) sur la carte « .spotlight » survolée, et (--hx / --hy) sur l'en-tête.
export function useSpotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return; // pas sur mobile
    let frame = 0;
    let last: PointerEvent | null = null;

    const apply = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const target = e.target as Element | null;
      const card = target?.closest?.('.spotlight') as HTMLElement | null;
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      }
      const hero = target?.closest?.('.hero-glow-host') as HTMLElement | null;
      if (hero) {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty('--hx', `${e.clientX - r.left}px`);
        hero.style.setProperty('--hy', `${e.clientY - r.top}px`);
      }
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(frame); };
  }, []);
}
