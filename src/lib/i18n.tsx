import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'fr' | 'en';
const KEY = 'lang';

// Textes fixes de l'interface. Le contenu (bio, projets…) vient de la base,
// avec ses propres champs `_en` (voir pick()).
const STRINGS = {
  fr: {
    'nav.home': 'Accueil', 'nav.about': 'À propos', 'nav.skills': 'Compétences', 'nav.projects': 'Projets',
    'nav.videos': 'Vidéos', 'nav.blog': 'Blog', 'nav.contact': 'Contact', 'nav.admin': 'Admin',
    'nav.openMenu': 'Ouvrir le menu', 'nav.closeMenu': 'Fermer le menu', 'nav.top': 'Retour en haut',
    'lang.switch': 'English version', 'lang.label': 'EN',
    'theme.light': 'Passer en mode clair', 'theme.dark': 'Passer en mode sombre',

    'hero.projects': 'Voir mes projets', 'hero.contact': 'Me contacter', 'hero.book': 'Réserver un appel',
    'hero.cv': 'CV', 'hero.scroll': 'défiler',

    'stats.projects': 'Projets publiés', 'stats.project': 'Projet publié', 'stats.tech': 'Technologies',
    'stats.exps': 'Expériences', 'stats.exp': 'Expérience', 'stats.edus': 'Formations', 'stats.edu': 'Formation',

    'about.title1': 'Qui', 'about.title2': 'suis-je ?',
    'about.extra': "Formé à l'Institut Teccart en programmation web et mobile, je crée des solutions intelligentes. Mon approche combine rigueur technique et vision produit.",
    'about.cv': 'Mon CV', 'about.view': 'Voir', 'about.download': 'Télécharger', 'about.available': 'Disponible',
    'trait.clean': 'Clean Code', 'trait.clean.d': 'Architecture propre, maintenable et évolutive',
    'trait.perf': 'Performance', 'trait.perf.d': 'Apps optimisées pour une expérience fluide et rapide',
    'trait.full': 'Full Stack', 'trait.full.d': 'Front-end, back-end et déploiement cloud',

    'skills.title1': 'Stack', 'skills.title2': 'technique.',
    'skills.sub': "Technologies maîtrisées — du frontend au déploiement, en passant par l'IA.",
    'skills.daily': 'Quotidien', 'skills.projects': 'Utilisé en projet', 'skills.basics': 'Notions',
    'skills.lvl.daily': 'Quotidien', 'skills.lvl.projects': 'Projets', 'skills.lvl.basics': 'Notions',
    'skills.tools': 'outils',

    'projects.title1': 'Projets', 'projects.title2': 'réalisés.',
    'projects.sub': "Applications web et mobiles conçues, développées et déployées — du back-end à l'IA.",
    'projects.all': 'Tous', 'projects.featured': 'À la une', 'projects.code': 'Code', 'projects.codeGithub': 'Code GitHub',
    'projects.demo': "Tester l'app", 'projects.see': 'Voir le projet', 'projects.private': 'Code privé — démo sur demande',
    'projects.case': "Lire l'étude de cas", 'projects.caseShort': 'Étude de cas',

    'case.back': 'Tous les projets', 'case.role': 'Mon rôle', 'case.context': 'Le problème', 'case.solution': 'La solution',
    'case.architecture': 'Architecture technique', 'case.challenges': 'Défis & décisions', 'case.results': 'Résultat',
    'case.stack': 'Technologies', 'case.gallery': "Captures d'écran", 'case.video': 'Démo vidéo',
    'case.demoLogin': 'Accès démo', 'case.notFound': 'Projet introuvable.', 'case.next': 'Projet suivant',
    'case.cta': 'Ce projet vous intéresse ? Parlons-en.',

    'github.title': 'Repos GitHub', 'github.all': 'Voir tous mes dépôts', 'github.public': 'Dépôt public',

    'videos.title': 'Vidéos de démo', 'videos.close': 'Fermer la vidéo', 'videos.unavailable': 'Vidéo indisponible',

    'exp.title': 'Parcours', 'exp.work': 'Expériences pro', 'exp.academic': 'Projets académiques',
    'edu.title': 'Formation',
    'testi.title': "Ce qu'ils disent",

    'blog.title': 'Blog', 'blog.sub': "Ce que j'apprends en construisant mes projets.", 'blog.read': "Lire l'article",
    'blog.back': 'Tous les articles', 'blog.empty': 'Aucun article pour le moment.', 'blog.minutes': 'min de lecture',
    'blog.latest': 'Derniers articles', 'blog.all': 'Voir le blog',

    'contact.title': 'Travaillons ensemble', 'contact.sub': "Un poste, un stage ou un projet ? Écrivez-moi : je réponds sous 24 h.",
    'contact.find': 'Retrouvez-moi', 'contact.location': 'Localisation', 'contact.name': 'Nom', 'contact.namePh': 'Votre nom',
    'contact.email': 'Email', 'contact.message': 'Message', 'contact.messagePh': 'Décrivez le poste, le stage ou votre projet…',
    'contact.send': 'Envoyer le message', 'contact.sending': 'Envoi…', 'contact.sent': 'Message envoyé !',
    'contact.sentSub': 'Merci ! Je vous réponds très vite à l’adresse indiquée.', 'contact.another': 'Envoyer un autre message',
    'contact.error': "L'envoi a échoué. Réessayez ou écrivez-moi directement :", 'contact.book': 'Réserver un appel de 15 min',
    'contact.bookSub': 'Choisissez un créneau directement dans mon agenda.',

    'footer.made': 'Conçu et développé par', 'footer.rights': 'Tous droits réservés.',

    'ai.open': 'Posez-moi une question', 'ai.title': 'Assistant de Younes', 'ai.sub': 'Répond à partir de mon CV et de mes projets',
    'ai.placeholder': 'Ex. : Quelle est son expérience avec React ?', 'ai.send': 'Envoyer', 'ai.close': 'Fermer',
    'ai.hello': "Bonjour ! Je suis l'assistant de Younes. Posez-moi une question sur son parcours, ses compétences ou ses projets.",
    'ai.error': "Désolé, je n'ai pas pu répondre. Réessayez, ou contactez Younes directement.",
    'ai.limit': 'Limite de questions atteinte pour le moment. Contactez Younes directement !',
    'ai.s1': 'Quelles sont ses compétences principales ?', 'ai.s2': 'Parle-moi de TapTapCard', 'ai.s3': 'Est-il disponible ?',
    'ai.disclaimer': "Réponses générées par IA — elles peuvent contenir des erreurs.",
  },
  en: {
    'nav.home': 'Home', 'nav.about': 'About', 'nav.skills': 'Skills', 'nav.projects': 'Projects',
    'nav.videos': 'Videos', 'nav.blog': 'Blog', 'nav.contact': 'Contact', 'nav.admin': 'Admin',
    'nav.openMenu': 'Open menu', 'nav.closeMenu': 'Close menu', 'nav.top': 'Back to top',
    'lang.switch': 'Version française', 'lang.label': 'FR',
    'theme.light': 'Switch to light mode', 'theme.dark': 'Switch to dark mode',

    'hero.projects': 'See my projects', 'hero.contact': 'Contact me', 'hero.book': 'Book a call',
    'hero.cv': 'Resume', 'hero.scroll': 'scroll',

    'stats.projects': 'Published projects', 'stats.project': 'Published project', 'stats.tech': 'Technologies',
    'stats.exps': 'Experiences', 'stats.exp': 'Experience', 'stats.edus': 'Education', 'stats.edu': 'Education',

    'about.title1': 'About', 'about.title2': 'me.',
    'about.extra': 'Trained at Institut Teccart in web and mobile programming, I build smart solutions. My approach combines technical rigor with a product mindset.',
    'about.cv': 'My resume', 'about.view': 'View', 'about.download': 'Download', 'about.available': 'Available',
    'trait.clean': 'Clean Code', 'trait.clean.d': 'Clean, maintainable and scalable architecture',
    'trait.perf': 'Performance', 'trait.perf.d': 'Apps optimized for a fast, smooth experience',
    'trait.full': 'Full Stack', 'trait.full.d': 'Front-end, back-end and cloud deployment',

    'skills.title1': 'Tech', 'skills.title2': 'stack.',
    'skills.sub': 'Technologies I work with — from frontend to deployment, including AI.',
    'skills.daily': 'Daily use', 'skills.projects': 'Used in projects', 'skills.basics': 'Basics',
    'skills.lvl.daily': 'Daily', 'skills.lvl.projects': 'Projects', 'skills.lvl.basics': 'Basics',
    'skills.tools': 'tools',

    'projects.title1': 'Selected', 'projects.title2': 'projects.',
    'projects.sub': 'Web and mobile apps I designed, built and shipped — from back-end to AI.',
    'projects.all': 'All', 'projects.featured': 'Featured', 'projects.code': 'Code', 'projects.codeGithub': 'GitHub code',
    'projects.demo': 'Try the app', 'projects.see': 'View project', 'projects.private': 'Private code — demo on request',
    'projects.case': 'Read the case study', 'projects.caseShort': 'Case study',

    'case.back': 'All projects', 'case.role': 'My role', 'case.context': 'The problem', 'case.solution': 'The solution',
    'case.architecture': 'Technical architecture', 'case.challenges': 'Challenges & decisions', 'case.results': 'Outcome',
    'case.stack': 'Tech stack', 'case.gallery': 'Screenshots', 'case.video': 'Video demo',
    'case.demoLogin': 'Demo access', 'case.notFound': 'Project not found.', 'case.next': 'Next project',
    'case.cta': 'Interested in this project? Let’s talk.',

    'github.title': 'GitHub repos', 'github.all': 'See all my repositories', 'github.public': 'Public repository',

    'videos.title': 'Demo videos', 'videos.close': 'Close video', 'videos.unavailable': 'Video unavailable',

    'exp.title': 'Experience', 'exp.work': 'Work experience', 'exp.academic': 'Academic projects',
    'edu.title': 'Education',
    'testi.title': 'What people say',

    'blog.title': 'Blog', 'blog.sub': 'What I learn while building my projects.', 'blog.read': 'Read article',
    'blog.back': 'All articles', 'blog.empty': 'No articles yet.', 'blog.minutes': 'min read',
    'blog.latest': 'Latest articles', 'blog.all': 'Visit the blog',

    'contact.title': "Let's work together", 'contact.sub': 'A job, an internship or a project? Write to me — I reply within 24 hours.',
    'contact.find': 'Find me', 'contact.location': 'Location', 'contact.name': 'Name', 'contact.namePh': 'Your name',
    'contact.email': 'Email', 'contact.message': 'Message', 'contact.messagePh': 'Tell me about the role, internship or project…',
    'contact.send': 'Send message', 'contact.sending': 'Sending…', 'contact.sent': 'Message sent!',
    'contact.sentSub': "Thanks! I'll get back to you shortly at the address you gave.", 'contact.another': 'Send another message',
    'contact.error': 'Sending failed. Try again or email me directly:', 'contact.book': 'Book a 15-min call',
    'contact.bookSub': 'Pick a time slot directly in my calendar.',

    'footer.made': 'Designed and built by', 'footer.rights': 'All rights reserved.',

    'ai.open': 'Ask me a question', 'ai.title': "Younes's assistant", 'ai.sub': 'Answers from my resume and projects',
    'ai.placeholder': 'E.g. What is his experience with React?', 'ai.send': 'Send', 'ai.close': 'Close',
    'ai.hello': "Hi! I'm Younes's assistant. Ask me anything about his background, skills or projects.",
    'ai.error': "Sorry, I couldn't answer. Try again, or contact Younes directly.",
    'ai.limit': 'Question limit reached for now. Please contact Younes directly!',
    'ai.s1': 'What are his main skills?', 'ai.s2': 'Tell me about TapTapCard', 'ai.s3': 'Is he available?',
    'ai.disclaimer': 'AI-generated answers — they may contain mistakes.',
  },
} as const;

export type StringKey = keyof typeof STRINGS.fr;

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: StringKey) => string;
  /** Contenu bilingue : version anglaise si on est en anglais et qu'elle existe */
  pick: (fr: string | undefined, en?: string | undefined) => string;
}

const LangContext = createContext<LangContextType | null>(null);

function initialLang(): Lang {
  try {
    const url = new URLSearchParams(window.location.search).get('lang');
    if (url === 'en' || url === 'fr') return url;
    const saved = localStorage.getItem(KEY);
    if (saved === 'en' || saved === 'fr') return saved;
  } catch { /* stockage indisponible */ }
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : (navigator.language ? 'en' : 'fr');
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(KEY, l); } catch { /* ignore */ }
  }, []);

  const value = useMemo<LangContextType>(() => ({
    lang,
    setLang,
    t: key => STRINGS[lang][key] ?? STRINGS.fr[key],
    pick: (fr, en) => (lang === 'en' && en?.trim() ? en : (fr ?? '')),
  }), [lang, setLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
