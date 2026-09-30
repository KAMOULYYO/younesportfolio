import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY, BUCKET } from './supabase';

// Utilisé uniquement par l'admin. Envoi via XHR pour avoir la barre de progression.

export type UploadKind = 'cv' | 'video' | 'image';

// Plan gratuit Supabase : 50 Mo max par fichier
export const UPLOAD_LIMITS: Record<UploadKind, { maxMb: number; accept: string; types: RegExp }> = {
  cv:    { maxMb: 10, accept: 'application/pdf', types: /^application\/pdf$/ },
  video: { maxMb: 50, accept: 'video/mp4,video/webm,video/quicktime', types: /^video\/(mp4|webm|quicktime)$/ },
  image: { maxMb: 5,  accept: 'image/jpeg,image/png,image/webp', types: /^image\/(jpeg|png|webp)$/ },
};

const FOLDERS: Record<UploadKind, string> = { cv: 'cv', video: 'videos', image: 'images' };

export class UploadError extends Error {
  code: string;
  constructor(code: string, message: string) { super(message); this.code = code; }
}

export function validateFile(file: File, kind: UploadKind): string | null {
  const { maxMb, types } = UPLOAD_LIMITS[kind];
  if (!types.test(file.type)) {
    return kind === 'cv' ? 'Le CV doit être un fichier PDF.'
      : kind === 'video' ? 'Format vidéo accepté : MP4, WebM ou MOV.'
      : 'Format image accepté : JPG, PNG ou WebP.';
  }
  if (file.size > maxMb * 1024 * 1024) {
    return kind === 'video'
      ? `Vidéo trop lourde (max ${maxMb} Mo sur le plan gratuit). Compresse-la (ex. HandBrake) ou mets-la sur YouTube.`
      : `Fichier trop lourd (max ${maxMb} Mo).`;
  }
  return null;
}

function slug(name: string) {
  const dot = name.lastIndexOf('.');
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'fichier';
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, '') : '';
  return ext ? `${base}.${ext}` : base;
}

export function publicUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path.split('/').map(encodeURIComponent).join('/')}`;
}

export function uploadFile(
  file: File,
  kind: UploadKind,
  onProgress: (pct: number) => void,
): { cancel: () => void; done: Promise<string> } {
  const name = kind === 'cv' ? 'CV-Younes-Kamouly.pdf' : slug(file.name);
  const path = `${FOLDERS[kind]}/${Date.now()}-${name}`;
  const xhr = new XMLHttpRequest();

  const done = (async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new UploadError('unauthenticated', 'Session expirée : reconnecte-toi.');

    return new Promise<string>((resolve, reject) => {
      xhr.open('POST', `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.setRequestHeader('apikey', SUPABASE_ANON_KEY);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.setRequestHeader('Cache-Control', 'max-age=31536000');
      xhr.setRequestHeader('x-upsert', 'false');
      xhr.timeout = 10 * 60 * 1000;

      xhr.upload.onprogress = e => { if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100)); };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) return resolve(publicUrl(path));
        let msg = '';
        try { msg = JSON.parse(xhr.responseText)?.message ?? ''; } catch { /* réponse non JSON */ }
        const code = xhr.status === 403 || /row-level security|unauthorized/i.test(msg) ? 'unauthorized'
          : xhr.status === 413 || /too large|exceeded the maximum/i.test(msg) ? 'too-large'
          : xhr.status === 404 || /bucket not found/i.test(msg) ? 'bucket-missing'
          : 'unknown';
        reject(new UploadError(code, msg || `Erreur ${xhr.status}`));
      };
      xhr.onerror = () => reject(new UploadError('network', 'Connexion réseau impossible.'));
      xhr.ontimeout = () => reject(new UploadError('network', "Délai dépassé pendant l'envoi."));
      xhr.onabort = () => reject(new UploadError('canceled', 'Envoi annulé.'));
      xhr.send(file);
    });
  })();

  return { cancel: () => xhr.abort(), done };
}
