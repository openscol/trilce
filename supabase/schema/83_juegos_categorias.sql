-- ============================================================================
-- 83. JUEGOS: categorías (matemáticas, comunicación, computación...) y grados.
-- ============================================================================
-- Estructura: categoría → grado (p1..p6, s1..s5, fijos en código) → secciones
-- → juegos. Las categorías son editables por cada colegio (CRUD); su `slug`
-- es lo que enlaza con el contenido programado en lib/games/catalog.ts, por
-- eso no cambia al renombrar la categoría. Una categoría sin contenido en
-- código se muestra como "Próximamente".
--
-- El id de cada juego pasa de "A.1" a "matematicas/p1/A.1" (categoría/grado/
-- id local), porque cada grado reutiliza los mismos ids locales (A.1, B.2...).
-- ============================================================================

create table game_categories (
  id          uuid primary key default gen_random_uuid(),
  school_id   uuid not null references schools(id) on delete cascade,
  slug        text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and slug not in ('progreso', 'categorias')),
  name        text not null,
  icon        text not null default '🎮',
  sort_order  int not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (school_id, slug)
);

create index idx_game_categories_school on game_categories(school_id);

create trigger trg_game_categories_updated_at before update on game_categories
  for each row execute function set_updated_at();

alter table game_categories enable row level security;

create policy "game_categories_select" on game_categories for select
  using (is_platform_staff() or has_school_access(school_id));
create policy "game_categories_write" on game_categories for all
  using (is_platform_staff() or has_school_role(school_id, array['admin','administrativo']))
  with check (is_platform_staff() or has_school_role(school_id, array['admin','administrativo']));

-- Categorías iniciales: la única con contenido hoy es Matemáticas.
insert into game_categories (school_id, slug, name, icon, sort_order)
select id, 'matematicas', 'Matemáticas', '🔢', 1 from schools
on conflict (school_id, slug) do nothing;

-- Cada colegio nuevo nace con Matemáticas.
create or replace function seed_school_game_categories()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into game_categories (school_id, slug, name, icon, sort_order)
  values (new.id, 'matematicas', 'Matemáticas', '🔢', 1)
  on conflict (school_id, slug) do nothing;
  return new;
end;
$$;

revoke execute on function seed_school_game_categories() from public, anon, authenticated;

create trigger trg_schools_seed_game_categories
  after insert on schools
  for each row execute function seed_school_game_categories();

-- Resultados ya guardados (todos eran de Matemáticas · 1.° de Primaria).
-- game_attempts no tiene política de UPDATE para usuarios; esto corre como
-- migración (dueño de la tabla), no desde la app.
update game_sessions set skill_id = 'matematicas/p1/' || skill_id where skill_id not like '%/%';
update game_attempts set skill_id = 'matematicas/p1/' || skill_id where skill_id not like '%/%';
