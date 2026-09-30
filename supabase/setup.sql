-- ═══════════════════════════════════════════════════════════════════
--  Portfolio Younes Kamouly — installation Supabase (à exécuter 1 fois)
--  Supabase → SQL Editor → New query → coller tout ce fichier → Run
--
--  ⚠️ Remplace ADMIN_EMAIL (1 endroit, dans is_admin) par l'email
--     du compte admin créé dans Authentication → Users.
-- ═══════════════════════════════════════════════════════════════════

-- 1. Qui est admin ? ------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'ADMIN_EMAIL'
$$;

-- 2. Contenu du portfolio (une seule ligne, id = 'main') ------------
create table if not exists public.portfolio (
  id          text primary key,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

alter table public.portfolio enable row level security;

drop policy if exists "Lecture publique" on public.portfolio;
create policy "Lecture publique" on public.portfolio
  for select using (true);

drop policy if exists "Admin ajoute" on public.portfolio;
create policy "Admin ajoute" on public.portfolio
  for insert to authenticated with check (public.is_admin());

drop policy if exists "Admin modifie" on public.portfolio;
create policy "Admin modifie" on public.portfolio
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Mise à jour en temps réel sur le site quand l'admin enregistre
do $$
begin
  alter publication supabase_realtime add table public.portfolio;
exception when duplicate_object then null;
end $$;

-- 3. Fichiers (CV, vidéos, images) ----------------------------------
--    Plan gratuit : 50 Mo max par fichier.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio', 'portfolio', true, 52428800,
  array['application/pdf','video/mp4','video/webm','video/quicktime','image/jpeg','image/png','image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admin envoie fichiers" on storage.objects;
create policy "Admin envoie fichiers" on storage.objects
  for insert to authenticated with check (bucket_id = 'portfolio' and public.is_admin());

drop policy if exists "Admin remplace fichiers" on storage.objects;
create policy "Admin remplace fichiers" on storage.objects
  for update to authenticated using (bucket_id = 'portfolio' and public.is_admin());

drop policy if exists "Admin supprime fichiers" on storage.objects;
create policy "Admin supprime fichiers" on storage.objects
  for delete to authenticated using (bucket_id = 'portfolio' and public.is_admin());

-- 4. Ton contenu actuel (copié depuis Firebase) ---------------------
insert into public.portfolio (id, data)
values ('main', $seed${"experiences":[{"type":"work","technologies":["React","FastAPI","MongoDB","OpenAI API","Python","Vercel"],"period":"2023 – Présent","description":"Conception et développement d'une plateforme SaaS IA complète pour PME. Architecture React + FastAPI + MongoDB, intégration OpenAI, déploiement cloud.","id":"1","title":"Développeur Full Stack","company":"LocalBoost AI"},{"title":"Développeur Web Freelance","id":"2","description":"Développement d'applications web pour clients variés. Sites vitrines, e-commerce, dashboards analytics et APIs REST.","technologies":["React","Node.js","MongoDB","Laravel","MySQL"],"company":"Indépendant","period":"2022 – 2023","type":"work"},{"period":"2022","technologies":["React","Laravel","MySQL","TypeScript"],"type":"academic","id":"3","title":"Projet de fin d'études — Workforce Manager","company":"Institut Teccart","description":"Développement d'un système complet de gestion des employés avec authentification JWT, rôles multiples et tableaux de bord temps réel."},{"type":"academic","period":"2021","description":"Création d'une bibliothèque numérique intelligente avec algorithme de recommandations basé sur les comportements de lecture.","id":"4","company":"Institut Teccart","title":"Projet académique — LibraNet","technologies":["React","FastAPI","MongoDB","Python"]}],"projects":[{"demoUrl":"https://localboost.ai","githubUrl":"https://github.com/KAMOULYYO/localboost-ai","featured":true,"technologies":["React","FastAPI","MongoDB","OpenAI API","TailwindCSS","Python"],"category":"IA / SaaS","image":"https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=400&fit=crop&fm=webp&q=75","id":"1","description":"Plateforme IA complète pour booster les petites entreprises locales. Génération automatique de contenu marketing, analyse des performances, chatbot intelligent et recommandations personnalisées pour attirer plus de clients.","title":"LocalBoost AI"},{"id":"2","featured":true,"demoUrl":"#","category":"Web App","githubUrl":"","title":"TravelMate","technologies":["React","Node.js","MongoDB","OpenAI API","Express","TailwindCSS"],"description":"Application web d'agence de voyages intelligente avec IA. Recommandations de destinations personnalisées, planification d'itinéraires automatique, chatbot de voyage et gestion de réservations en temps réel.","image":"https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop&fm=webp&q=75"},{"id":"3","demoUrl":"#","title":"LibraNet","technologies":["React","FastAPI","MongoDB","Python","TypeScript"],"image":"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&fm=webp&q=75","category":"Web App","featured":true,"githubUrl":"https://github.com/KAMOULYYO/LibraNet","description":"Bibliothèque intelligente avec système de recommandations IA. Gestion des livres, emprunts, réservations, et moteur de recommandations basé sur les préférences de lecture et l'historique utilisateur."},{"description":"Application de gestion des pauses employés en temps réel. Suivi des pauses, alertes automatiques, tableaux de bord analytiques et rapports de productivité pour les managers RH.","featured":false,"category":"Management","id":"4","technologies":["React","FastAPI","MongoDB","WebSocket","TailwindCSS"],"image":"https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=400&fit=crop&fm=webp&q=75","githubUrl":"","title":"PauseManager","demoUrl":"#"},{"technologies":["React","Laravel","MySQL","TypeScript","TailwindCSS"],"id":"5","demoUrl":"#","title":"Workforce Manager","featured":false,"category":"Management","githubUrl":"","image":"https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop&fm=webp&q=75","description":"Système complet de gestion des employés avec rôles hiérarchiques admin/manager/employé. Gestion des horaires, congés, évaluations de performance et communication interne."}],"education":[{"location":"Montréal, QC","degree":"DEC / AEC en Informatique","id":"1","period":"2020 – 2022","institution":"Institut Teccart","description":"Formation intensive en programmation web et mobile. Spécialisation en développement full stack, bases de données, et intégration d'APIs. Projets pratiques en entreprise."},{"id":"2","degree":"Programmation Web & Mobile","description":"Modules avancés : React, Vue.js, PHP/Laravel, Python/FastAPI, MongoDB, MySQL. Formation aux méthodologies Agile et aux bonnes pratiques de développement.","location":"Montréal, QC","institution":"Institut Teccart","period":"2020 – 2022"}],"profile":{"github":"https://github.com/KAMOULYYO","photo":"/images/profile-hero.webp","bio":"Développeur Full Stack passionné avec une expertise en React, FastAPI et MongoDB. Je conçois des applications web et mobiles modernes, intelligentes et performantes. Toujours à la pointe des nouvelles technologies, j'intègre l'IA pour créer des expériences utilisateur exceptionnelles.","name":"Younes Kamouly","title":"Full Stack Developer","tagline":"Building intelligent experiences in code.","email":"contact.localboostai@gmail.com","linkedin":"https://www.linkedin.com/in/younes-kamouly/","cvUrl":"#","location":"Canada"},"skills":[{"category":"frontend","id":"1","name":"React","level":95},{"category":"frontend","id":"2","name":"TypeScript","level":90},{"id":"3","category":"frontend","level":80,"name":"Vue.js"},{"name":"TailwindCSS","level":95,"category":"frontend","id":"4"},{"level":85,"id":"5","name":"Next.js","category":"frontend"},{"id":"6","name":"FastAPI","level":92,"category":"backend"},{"category":"backend","level":85,"id":"7","name":"Node.js"},{"category":"backend","name":"Laravel","level":78,"id":"8"},{"id":"9","category":"backend","level":82,"name":"Express.js"},{"name":"Python","level":90,"id":"10","category":"backend"},{"name":"MongoDB","id":"11","category":"database","level":88},{"id":"12","level":85,"category":"database","name":"MySQL"},{"id":"13","level":80,"category":"database","name":"Supabase"},{"category":"database","name":"PostgreSQL","id":"14","level":78},{"id":"15","name":"GitHub","category":"tools","level":95},{"id":"16","level":75,"name":"Docker","category":"tools"},{"name":"Vercel","category":"tools","id":"17","level":90},{"id":"18","category":"tools","level":92,"name":"Postman"},{"category":"ai","level":88,"id":"19","name":"OpenAI API"},{"category":"ai","name":"Chatbot Dev","id":"20","level":85},{"name":"LangChain","level":70,"category":"ai","id":"21"},{"name":"Recommandations IA","id":"22","category":"ai","level":80}],"testimonials":[{"name":"Sophie Martin","company":"StartupTech Montréal","rating":5,"avatar":"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face&fm=webp&q=80","role":"CEO","id":"1","content":"Younes a développé notre plateforme complète en un temps record. Code propre, architecture solide, et une vraie vision produit. Fortement recommandé !"},{"role":"Professeur","avatar":"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&fm=webp&q=80","content":"Un étudiant exceptionnel avec une capacité d'apprentissage remarquable. Younes maîtrise les dernières technologies et les applique avec rigueur et créativité.","rating":5,"name":"Marc Dupont","company":"Institut Teccart","id":"2"},{"content":"Excellent développeur full stack. Très professionnel, livraisons dans les délais, et une excellente communication. L'intégration IA dans nos projets a été impeccable.","id":"3","name":"Aisha Benali","rating":5,"role":"Product Manager","avatar":"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face&fm=webp&q=80","company":"AgenceTech QC"}],"videos":[{"description":"Démonstration complète de la plateforme LocalBoost AI avec toutes ses fonctionnalités IA","thumbnail":"https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=340&fit=crop&fm=webp&q=75","url":"https://www.youtube.com/embed/dQw4w9WgXcQ","title":"Demo LocalBoost AI","id":"1"},{"url":"https://www.youtube.com/embed/dQw4w9WgXcQ","description":"Présentation de l'application de voyage avec recommandations IA","title":"TravelMate en action","id":"2","thumbnail":"https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=340&fit=crop&fm=webp&q=75"},{"thumbnail":"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=340&fit=crop&fm=webp&q=75","url":"https://www.youtube.com/embed/dQw4w9WgXcQ","id":"3","title":"LibraNet - Bibliothèque IA","description":"Tour complet de LibraNet avec système de recommandations intelligentes"}]}$seed$::jsonb)
on conflict (id) do nothing;

-- Vérification : doit afficher 1 ligne
select id, updated_at, jsonb_array_length(data->'projects') as projets from public.portfolio;