-- ============================================================================
-- 84. JUEGOS: categoría Comunicación (ya tiene contenido: 1.° de Primaria).
-- ============================================================================
-- Se agrega a todos los colegios y al sembrado de colegios nuevos. Si algún
-- colegio ya creó una categoría "comunicacion" desde la app, se respeta.

insert into game_categories (school_id, slug, name, icon, sort_order)
select id, 'comunicacion', 'Comunicación', '📚', 2 from schools
on conflict (school_id, slug) do nothing;

create or replace function seed_school_game_categories()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into game_categories (school_id, slug, name, icon, sort_order)
  values
    (new.id, 'matematicas', 'Matemáticas', '🔢', 1),
    (new.id, 'comunicacion', 'Comunicación', '📚', 2)
  on conflict (school_id, slug) do nothing;
  return new;
end;
$$;

revoke execute on function seed_school_game_categories() from public, anon, authenticated;
