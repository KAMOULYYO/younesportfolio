// Filtre les URL venant de la base / de l'admin avant de les mettre dans href/src.
// Bloque javascript:, data:, vbscript:… (XSS) et garde http(s), mailto, tel, chemins relatifs et ancres.
export function safeUrl(url: unknown): string {
  if (typeof url !== 'string') return '';
  const u = url.trim();
  if (!u) return '';
  if (u.startsWith('/') || u.startsWith('#') || u.startsWith('./')) return u;
  try {
    const parsed = new URL(u);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol) ? u : '';
  } catch {
    return '';
  }
}

// Fichier hébergé sur Supabase Storage (vidéo MP4 envoyée depuis l'admin…)
export function isStorageFile(url: unknown): boolean {
  const u = safeUrl(url);
  if (!u.startsWith('https://')) return false;
  try {
    const p = new URL(u);
    return p.hostname.endsWith('.supabase.co') && p.pathname.startsWith('/storage/v1/object/public/');
  } catch {
    return false;
  }
}

// Lien qui force le téléchargement (Supabase : ?download=nom.pdf) ; sinon le lien tel quel
export function downloadUrl(url: string, filename: string): string {
  return isStorageFile(url) ? `${url}?download=${encodeURIComponent(filename)}` : url;
}

// URL de vidéo acceptée : fichier Storage tel quel, sinon lien YouTube/Vimeo converti
export function toVideoUrl(url: unknown): string {
  return isStorageFile(url) ? safeUrl(url) : toEmbedUrl(url);
}

// Un CV n'est affiché que s'il pointe vers un vrai fichier (sinon « Télécharger » récupérait la page HTML)
export function hasCv(url: string): boolean {
  return !!url && url !== '#';
}

// Convertit un lien YouTube / Vimeo (watch, youtu.be, shorts…) en URL d'intégration.
// Toute autre source est refusée pour l'iframe.
export function toEmbedUrl(url: unknown): string {
  const u = safeUrl(url);
  if (!u.startsWith('https://') && !u.startsWith('http://')) return '';
  try {
    const p = new URL(u);
    const host = p.hostname.replace(/^www\.|^m\./, '');
    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      const id = p.pathname.startsWith('/embed/') ? p.pathname.split('/')[2]
        : p.pathname.startsWith('/shorts/') ? p.pathname.split('/')[2]
        : p.searchParams.get('v');
      return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : '';
    }
    if (host === 'youtu.be') {
      const id = p.pathname.slice(1);
      return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : '';
    }
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const id = p.pathname.split('/').filter(Boolean).pop();
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : '';
    }
  } catch { /* URL invalide */ }
  return '';
}
