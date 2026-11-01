-- ══════════════════════════════════════════════════════════════════════════════
-- Cartelería Digital v2 — Schema completo
-- Kiosco Enjoy, Río Cuarto, Córdoba
-- ══════════════════════════════════════════════════════════════════════════════

-- Habilitar UUID
create extension if not exists "uuid-ossp";

-- ── Media ─────────────────────────────────────────────────────────────────────
create table if not exists media (
  id          uuid primary key default uuid_generate_v4(),
  type        text not null check (type in ('video', 'image')),
  url         text not null,
  label       text not null default '',
  file_size   bigint default 0,
  created_at  timestamptz not null default now()
);

-- ── Products ──────────────────────────────────────────────────────────────────
create table if not exists products (
  id             uuid primary key default uuid_generate_v4(),
  name           text not null,
  photo_url      text not null,
  price          numeric(10,2) not null,
  original_price numeric(10,2),
  active         boolean not null default true,
  created_at     timestamptz not null default now()
);

-- ── Slides (playlist) ─────────────────────────────────────────────────────────
-- payload almacena datos específicos según el tipo como JSONB
create table if not exists slides (
  id         uuid primary key default uuid_generate_v4(),
  type       text not null check (type in (
               'video', 'image', 'product',
               'smn_alert', 'smn_prevention', 'env_content'
             )),
  duration   integer not null default 10,
  "order"    integer not null default 0,
  active     boolean not null default true,
  payload    jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists slides_order_idx on slides("order") where active = true;

-- ── Environmental content (base propia) ───────────────────────────────────────
create table if not exists env_content (
  id         uuid primary key default uuid_generate_v4(),
  category   text not null check (category in (
               'clima', 'reciclaje', 'agua', 'energia',
               'residuos', 'contaminacion', 'desastres', 'biodiversidad'
             )),
  title      text not null,
  body       text not null,
  image_url  text,
  source     text,
  source_url text,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── Environmental sources (APIs externas) ─────────────────────────────────────
create table if not exists env_sources (
  id        uuid primary key default uuid_generate_v4(),
  name      text not null,
  category  text not null,
  api_url   text not null,
  enabled   boolean not null default true
);

insert into env_sources (name, category, api_url, enabled) values
  ('Open-Meteo Río Cuarto', 'clima', 'https://api.open-meteo.com/v1/forecast', true),
  ('NASA EONET Eventos', 'desastres', 'https://eonet.gsfc.nasa.gov/api/v3/events', true)
on conflict do nothing;

-- ── Settings ──────────────────────────────────────────────────────────────────
create table if not exists settings (
  id                    uuid primary key default uuid_generate_v4(),
  smn_zone_id           text not null default '87532',
  smn_enabled           boolean not null default true,
  env_content_enabled   boolean not null default true,
  env_categories        text[] not null default array[
                          'clima','reciclaje','agua','energia',
                          'residuos','contaminacion','desastres','biodiversidad'
                        ],
  default_slide_duration integer not null default 10
);

-- Registro único de settings
insert into settings (id) values (uuid_generate_v4())
on conflict do nothing;

-- ── RLS: acceso público de lectura, escritura autenticada ─────────────────────
alter table media         enable row level security;
alter table products      enable row level security;
alter table slides        enable row level security;
alter table env_content   enable row level security;
alter table env_sources   enable row level security;
alter table settings      enable row level security;

-- Lectura pública (el display la necesita sin auth)
create policy "public_read_media"       on media       for select using (true);
create policy "public_read_products"    on products    for select using (true);
create policy "public_read_slides"      on slides      for select using (true);
create policy "public_read_env_content" on env_content for select using (true);
create policy "public_read_env_sources" on env_sources for select using (true);
create policy "public_read_settings"    on settings    for select using (true);

-- Escritura solo para usuarios autenticados (admin)
create policy "auth_write_media"       on media       for all using (auth.role() = 'authenticated');
create policy "auth_write_products"    on products    for all using (auth.role() = 'authenticated');
create policy "auth_write_slides"      on slides      for all using (auth.role() = 'authenticated');
create policy "auth_write_env_content" on env_content for all using (auth.role() = 'authenticated');
create policy "auth_write_env_sources" on env_sources for all using (auth.role() = 'authenticated');
create policy "auth_write_settings"    on settings    for all using (auth.role() = 'authenticated');

-- ── Storage buckets ───────────────────────────────────────────────────────────
-- Ejecutar desde el dashboard de Supabase → Storage → New bucket:
--   media-videos  (public: true, max size: 500MB, mime: video/*)
--   media-images  (public: true, max size: 50MB, mime: image/*)
--   products      (public: true, max size: 20MB, mime: image/*)
