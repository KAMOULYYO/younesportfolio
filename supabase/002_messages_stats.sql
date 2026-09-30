-- ═══════════════════════════════════════════════════════════════════
--  Migration 002 — messages de contact + statistiques de visites
--  Supabase → SQL Editor → New query → coller → Run (une seule fois)
--  Réutilise public.is_admin() créée par setup.sql.
-- ═══════════════════════════════════════════════════════════════════

-- 1. Messages du formulaire de contact -------------------------------
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 100),
  email       text not null check (char_length(email) between 3 and 200 and email like '%_@_%._%'),
  message     text not null check (char_length(message) between 5 and 5000),
  lang        text check (lang in ('fr', 'en')),
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.messages enable row level security;

-- Tout le monde peut ENVOYER un message (jamais le lire, ni le modifier)
drop policy if exists "Envoi public" on public.messages;
create policy "Envoi public" on public.messages
  for insert to anon, authenticated with check (read = false);

drop policy if exists "Admin lit" on public.messages;
create policy "Admin lit" on public.messages
  for select to authenticated using (public.is_admin());

drop policy if exists "Admin marque lu" on public.messages;
create policy "Admin marque lu" on public.messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admin supprime" on public.messages;
create policy "Admin supprime" on public.messages
  for delete to authenticated using (public.is_admin());

-- Anti-spam : 20 messages max par tranche de 10 minutes (tous visiteurs confondus)
create or replace function public.messages_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from public.messages where created_at > now() - interval '10 minutes') >= 20 then
    raise exception 'Trop de messages, réessayez plus tard.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists messages_rate_limit on public.messages;
create trigger messages_rate_limit before insert on public.messages
  for each row execute function public.messages_rate_limit();

-- 2. Statistiques de visites (anonymes : aucune IP, aucun cookie) ------
create table if not exists public.events (
  id          bigint generated always as identity primary key,
  type        text not null check (type in ('page_view', 'cv_open', 'cv_download', 'contact_sent', 'project_view', 'booking_click', 'assistant_question', 'post_view')),
  path        text check (char_length(path) <= 200),
  ref         text check (char_length(ref) <= 200),
  lang        text check (char_length(lang) <= 10),
  target      text check (char_length(target) <= 120),
  created_at  timestamptz not null default now()
);

create index if not exists events_created_at_idx on public.events (created_at desc);

alter table public.events enable row level security;

drop policy if exists "Envoi public stats" on public.events;
create policy "Envoi public stats" on public.events
  for insert to anon, authenticated with check (true);

drop policy if exists "Admin lit stats" on public.events;
create policy "Admin lit stats" on public.events
  for select to authenticated using (public.is_admin());

-- Anti-abus : 300 événements max par minute
create or replace function public.events_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from public.events where created_at > now() - interval '1 minute') >= 300 then
    return null; -- ignoré silencieusement
  end if;
  return new;
end;
$$;

drop trigger if exists events_rate_limit on public.events;
create trigger events_rate_limit before insert on public.events
  for each row execute function public.events_rate_limit();

select 'ok' as migration_002;
