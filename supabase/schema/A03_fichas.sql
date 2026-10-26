-- ============================================================================
-- A03. FICHAS DE TRABAJO: hojas imprimibles armadas con los juegos.
--
-- El docente elige juegos de un área (Matemáticas o Comunicación), por grado
-- o por tema, y cuántos ejercicios quiere de cada uno. La ficha no guarda los
-- ejercicios ya escritos: guarda, por cada juego, las semillas con que se
-- generan (lib/games/rng.ts). Con las mismas semillas, el generador da siempre
-- las mismas preguntas, así que la ficha y su PDF son idénticos cada vez que
-- se abren, y la ficha ocupa muy poco.
--
--   items = [{ "skill": "matematicas/p2/igualar", "count": 4, "seeds": [...] }, ...]
--
-- `include_explanation`: antes de los ejercicios de cada juego va su idea
-- clave y un ejemplo resuelto. `include_answers`: al final, la clave de
-- respuestas (para el docente).
-- ============================================================================

create table worksheets (
  id                   uuid primary key default gen_random_uuid(),
  school_id            uuid not null references schools(id) on delete cascade,
  title                text not null check (char_length(title) between 1 and 200),
  category             text not null check (category in ('matematicas', 'comunicacion')),
  -- Cómo se armó: eligiendo un grado o eligiendo temas (solo informativo).
  mode                 text not null default 'grado' check (mode in ('grado', 'tema')),
  items                jsonb not null default '[]' check (jsonb_typeof(items) = 'array'),
  include_explanation  boolean not null default true,
  include_answers      boolean not null default false,
  created_by           uuid not null references staff_members(id) on delete cascade,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index idx_worksheets_school on worksheets(school_id, created_at desc);
create index idx_worksheets_created_by on worksheets(created_by);

create trigger trg_worksheets_updated_at before update on worksheets
  for each row execute function set_updated_at();
