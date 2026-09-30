// Statistiques anonymes : aucun cookie, aucune IP, aucun identifiant de visiteur.
// Seulement : type d'événement, page, site d'origine, langue — pour savoir si les
// recruteurs consultent ton CV et tes projets.

export type EventType =
  | 'page_view' | 'cv_open' | 'cv_download' | 'contact_sent'
  | 'project_view' | 'booking_click' | 'assistant_question' | 'post_view';

const NO_TRACK_KEY = 'yk_no_track';

// L'admin (toi) n'est pas compté, pour ne pas fausser les chiffres
export function setNoTrack(on: boolean) {
  try { if (on) localStorage.setItem(NO_TRACK_KEY, '1'); } catch { /* ignore */ }
}

function disabled() {
  try {
    if (localStorage.getItem(NO_TRACK_KEY) === '1') return true;
  } catch { /* ignore */ }
  const dnt = navigator.doNotTrack === '1' || (window as { doNotTrack?: string }).doNotTrack === '1';
  // En local, rien n'est compté sauf si on l'active pour tester : localStorage.yk_track_dev = '1'
  let devOn = false;
  try { devOn = localStorage.getItem('yk_track_dev') === '1'; } catch { /* ignore */ }
  const local = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  return dnt || (local && !devOn) || location.pathname.startsWith('/admin');
}

function referrerHost(): string | null {
  try {
    if (!document.referrer) return null;
    const host = new URL(document.referrer).hostname;
    return host === location.hostname ? null : host.slice(0, 200);
  } catch {
    return null;
  }
}

export function track(type: EventType, target?: string) {
  if (disabled()) return;
  const row = {
    type,
    path: location.pathname.slice(0, 200),
    ref: referrerHost(),
    lang: (document.documentElement.lang || navigator.language || '').slice(0, 10),
    target: target ? target.slice(0, 120) : null,
  };
  // Chargé à la demande : ne ralentit pas l'affichage
  import('@/lib/supabase')
    .then(({ supabase, isConfigured }) => {
      if (isConfigured) return supabase.from('events').insert(row);
    })
    .catch(() => { /* les stats ne doivent jamais casser le site */ });
}
