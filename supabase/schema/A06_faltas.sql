-- ============================================================================
-- A06. REGISTRO DE FALTAS: normas del aula, faltas, permisos y fichas de reflexión.
--
-- Cada norma pertenece a un tipo (conduct_categories) y el tipo dice qué es:
--   falta    → cuenta para la ficha de reflexión (normas de convivencia).
--   registro → solo queda anotado (normas de uso de las computadoras).
--   permiso  → baño, tomar agua...: uno de cada uno por alumno y por día.
-- Tipos y normas los edita el colegio (regla 6: tabla, no enum); lo que cada
-- tipo significa sí es un enum, porque de eso depende la lógica.
--
-- El conteo de faltas es por día: al llegar a N faltas sin ficha en el día
-- (conduct_settings, 3 por defecto) la pantalla sugiere generar la ficha. Las
-- faltas que entran en una ficha quedan enlazadas (sheet_id) y el conteo del
-- día vuelve a cero. Nada de eso se guarda como contador (regla 2).
-- ============================================================================

-- El auxiliar de educación es personal del colegio como el docente: firma las fichas.
alter type staff_type add value if not exists 'auxiliar';

create type conduct_kind as enum ('falta', 'registro', 'permiso');

create table conduct_categories (
  id          uuid primary key default gen_random_uuid(),
  school_id   uuid not null references schools(id) on delete cascade,
  name        text not null,
  kind        conduct_kind not null,
  position    int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (school_id, name)
);

create index idx_conduct_categories_school on conduct_categories(school_id, position);

create trigger trg_conduct_categories_updated_at before update on conduct_categories
  for each row execute function set_updated_at();

create table conduct_norms (
  id           uuid primary key default gen_random_uuid(),
  school_id    uuid not null references schools(id) on delete cascade,
  category_id  uuid not null references conduct_categories(id) on delete restrict,
  description  text not null,
  -- Una norma con registros no se borra (son historial de los alumnos): se desactiva.
  active       boolean not null default true,
  position     int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_conduct_norms_category on conduct_norms(category_id, position);

create trigger trg_conduct_norms_updated_at before update on conduct_norms
  for each row execute function set_updated_at();

-- Sin fila = valores por defecto.
create table conduct_settings (
  school_id         uuid primary key references schools(id) on delete cascade,
  faltas_per_sheet  int not null default 3 check (faltas_per_sheet between 1 and 20),
  updated_at        timestamptz not null default now()
);

create trigger trg_conduct_settings_updated_at before update on conduct_settings
  for each row execute function set_updated_at();

-- Ficha de reflexión: el documento que se imprime. Las normas incumplidas salen
-- de las faltas enlazadas; el resto lo escribe el alumno a mano.
create table conduct_reflection_sheets (
  id              uuid primary key default gen_random_uuid(),
  school_id       uuid not null references schools(id) on delete cascade,
  number          int not null,
  student_id      uuid not null references students(id) on delete cascade,
  class_group_id  uuid references class_groups(id) on delete set null,
  date            date not null,
  teacher_id      uuid references staff_members(id) on delete set null,
  assistant_id    uuid references staff_members(id) on delete set null,
  created_by      uuid references auth.users(id) on delete set null default auth.uid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (school_id, number)
);

create index idx_conduct_sheets_student on conduct_reflection_sheets(student_id, date desc);

create trigger trg_conduct_sheets_updated_at before update on conduct_reflection_sheets
  for each row execute function set_updated_at();

create table conduct_records (
  id              uuid primary key default gen_random_uuid(),
  school_id       uuid not null references schools(id) on delete cascade,
  student_id      uuid not null references students(id) on delete cascade,
  norm_id         uuid not null references conduct_norms(id) on delete restrict,
  -- La sección del alumno al momento de la falta (decide qué docente la ve).
  class_group_id  uuid references class_groups(id) on delete set null,
  date            date not null default school_today(),
  recorded_by     uuid references staff_members(id) on delete set null,
  note            text,
  sheet_id        uuid references conduct_reflection_sheets(id) on delete set null,
  created_at      timestamptz not null default now()
);

create index idx_conduct_records_student_date on conduct_records(student_id, date desc);
create index idx_conduct_records_group_date on conduct_records(class_group_id, date);
create index idx_conduct_records_sheet on conduct_records(sheet_id);

-- Colegio y sección los pone la base (no se confía en la app); la norma debe
-- ser del mismo colegio y estar activa; un permiso de cada tipo por día.
create or replace function check_conduct_record()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_kind conduct_kind;
  v_norm text;
begin
  if tg_op = 'UPDATE' and (new.student_id <> old.student_id or new.date <> old.date) then
    raise exception 'No se puede cambiar el alumno ni la fecha de un registro';
  end if;

  -- Al registrar, la sección es la actual del alumno; después ya no cambia.
  if tg_op = 'INSERT' then
    select s.school_id, s.class_group_id into new.school_id, new.class_group_id
    from students s where s.id = new.student_id;
    if new.school_id is null then
      raise exception 'Alumno no encontrado';
    end if;
    new.recorded_by := current_staff_id(new.school_id);
  else
    new.school_id := old.school_id;
    new.class_group_id := old.class_group_id;
    new.recorded_by := old.recorded_by;
  end if;

  select c.kind, n.description into v_kind, v_norm
  from conduct_norms n join conduct_categories c on c.id = n.category_id
  where n.id = new.norm_id and n.school_id = new.school_id
    and (n.active or (tg_op = 'UPDATE' and new.norm_id = old.norm_id));
  if v_kind is null then
    raise exception 'La norma no existe o está desactivada';
  end if;

  if v_kind <> 'falta' then
    new.sheet_id := null;
  end if;

  if v_kind = 'permiso' and exists (
    select 1 from conduct_records r
    where r.student_id = new.student_id and r.norm_id = new.norm_id and r.date = new.date and r.id <> new.id
  ) then
    raise exception 'Este alumno ya usó hoy su permiso «%».', v_norm;
  end if;

  return new;
end;
$$;

create trigger trg_check_conduct_record
  before insert or update on conduct_records
  for each row execute function check_conduct_record();

-- ¿El usuario actual puede registrar o corregir faltas de esta sección en esta
-- fecha? Misma regla que la asistencia: la administración siempre; el docente,
-- en sus secciones y solo el mismo día.
create or replace function can_edit_conduct(target_school_id uuid, target_class_group_id uuid, target_date date)
returns boolean
language plpgsql stable security definer
set search_path = public
as $$
begin
  if is_platform_staff() or has_school_role(target_school_id, array['admin','administrativo']) then
    return true;
  end if;
  return target_class_group_id is not null and can_edit_attendance(target_class_group_id, target_date);
end;
$$;

-- Genera la ficha de reflexión del alumno con sus faltas de hoy que aún no
-- están en una ficha. Devuelve el id de la ficha.
create or replace function create_reflection_sheet(p_student_id uuid, p_teacher_id uuid default null, p_assistant_id uuid default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student  students%rowtype;
  v_today    date := school_today();
  v_sheet_id uuid;
  v_number   int;
begin
  select * into v_student from students where id = p_student_id;
  if not found or not can_edit_conduct(v_student.school_id, v_student.class_group_id, v_today) then
    raise exception 'No autorizado para generar la ficha de este alumno';
  end if;

  if not exists (
    select 1 from conduct_records r join conduct_norms n on n.id = r.norm_id join conduct_categories c on c.id = n.category_id
    where r.student_id = p_student_id and r.date = v_today and r.sheet_id is null and c.kind = 'falta'
  ) then
    raise exception 'El alumno no tiene faltas pendientes hoy';
  end if;

  if exists (select 1 from staff_members where id in (p_teacher_id, p_assistant_id) and school_id <> v_student.school_id) then
    raise exception 'El docente o el auxiliar no son de este colegio';
  end if;

  -- Correlativo por colegio, sin saltos ni duplicados aunque dos docentes generen a la vez.
  perform pg_advisory_xact_lock(hashtext('conduct_sheet:' || v_student.school_id::text));
  select coalesce(max(number), 0) + 1 into v_number from conduct_reflection_sheets where school_id = v_student.school_id;

  insert into conduct_reflection_sheets (school_id, number, student_id, class_group_id, date, teacher_id, assistant_id)
  values (v_student.school_id, v_number, p_student_id, v_student.class_group_id, v_today, p_teacher_id, p_assistant_id)
  returning id into v_sheet_id;

  update conduct_records r set sheet_id = v_sheet_id
  from conduct_norms n join conduct_categories c on c.id = n.category_id
  where n.id = r.norm_id and c.kind = 'falta'
    and r.student_id = p_student_id and r.date = v_today and r.sheet_id is null;

  return v_sheet_id;
end;
$$;

revoke execute on function create_reflection_sheet(uuid, uuid, uuid) from public, anon;
grant execute on function create_reflection_sheet(uuid, uuid, uuid) to authenticated;

-- Normas iniciales de cada colegio.
create or replace function seed_conduct_norms(p_school_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_convivencia uuid;
  v_computo     uuid;
  v_permiso     uuid;
begin
  if exists (select 1 from conduct_categories where school_id = p_school_id) then
    return;
  end if;

  insert into conduct_categories (school_id, name, kind, position) values (p_school_id, 'Normas de convivencia', 'falta', 1) returning id into v_convivencia;
  insert into conduct_categories (school_id, name, kind, position) values (p_school_id, 'Normas de uso de las computadoras', 'registro', 2) returning id into v_computo;
  insert into conduct_categories (school_id, name, kind, position) values (p_school_id, 'Permisos', 'permiso', 3) returning id into v_permiso;

  insert into conduct_norms (school_id, category_id, description, position)
  select p_school_id, v_convivencia, d, o from unnest(array[
    'Respeto mutuo entre todos',
    'Levantar la mano para hablar o preguntar algo',
    'Cuando el profesor habla, los alumnos prestan atención',
    'Mantener el orden durante la clase',
    'No molestar al compañero durante la clase',
    'No dormirse en clases',
    'No caminar en clase sin haber pedido permiso',
    'No conversar entre estudiantes durante la clase'
  ]) with ordinality as t(d, o);

  insert into conduct_norms (school_id, category_id, description, position)
  select p_school_id, v_computo, d, o from unnest(array[
    'No tomar bebidas ni comer alimentos durante la clase',
    'Usar con cuidado las computadoras y sus periféricos',
    'Tener cuidado con los cables de las computadoras',
    'No bajar juegos ni programas de internet',
    'No usar otros programas o webs ajenos al tema que se está desarrollando',
    'Colocar las sillas en su sitio al culminar la clase'
  ]) with ordinality as t(d, o);

  insert into conduct_norms (school_id, category_id, description, position)
  select p_school_id, v_permiso, d, o from unnest(array[
    'Permiso para ir al baño',
    'Permiso para tomar agua'
  ]) with ordinality as t(d, o);
end;
$$;

revoke execute on function seed_conduct_norms(uuid) from public, anon, authenticated;

select seed_conduct_norms(id) from schools;

create or replace function seed_school_conduct_norms()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform seed_conduct_norms(new.id);
  return new;
end;
$$;

revoke execute on function seed_school_conduct_norms() from public, anon, authenticated;

create trigger trg_schools_seed_conduct_norms
  after insert on schools
  for each row execute function seed_school_conduct_norms();
