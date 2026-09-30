import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({ gfm: true, breaks: false });

// Markdown → HTML nettoyé (aucun script, aucun attribut dangereux ne passe)
export function renderMarkdown(md: string): string {
  const html = marked.parse(md ?? '', { async: false }) as string;
  const clean = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['style', 'iframe', 'form', 'input', 'script'],
    FORBID_ATTR: ['style', 'onerror', 'onclick', 'onload'],
  });
  // Liens externes : nouvel onglet sans accès à la page d'origine
  return clean.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
}
