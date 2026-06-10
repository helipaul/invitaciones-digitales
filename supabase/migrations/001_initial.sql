-- ============================================================
-- 001_initial.sql  —  Invitaciones Digitales
-- Ejecutar en: Supabase SQL Editor
-- ============================================================

create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  event_date  timestamptz not null,
  host_token  text unique not null,
  created_at  timestamptz default now()
);

create table if not exists rsvps (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid not null references events(id) on delete cascade,
  guest_name  text not null,
  attending   boolean not null,
  passes      int not null check (passes between 1 and 10),
  message     text,
  client_id   text not null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- RLS: bloquear acceso con anon key — solo service key puede leer/escribir
alter table events enable row level security;
alter table rsvps  enable row level security;

-- Índice para búsquedas frecuentes
create index if not exists rsvps_event_id_idx on rsvps(event_id);

-- Evento demo (cambia host_token antes de producción real)
insert into events (slug, title, event_date, host_token)
values (
  'valentina-xv',
  'XV Años de Valentina Ramírez López',
  '2026-08-15 19:00:00+00',
  'valentina2026_host_demo_token_changeme'
)
on conflict (slug) do nothing;
