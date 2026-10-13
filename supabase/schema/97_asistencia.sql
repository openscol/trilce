-- ============================================================================
-- 97. ASISTENCIA: pasar lista por sección y por día.
-- Una «sesión» es la lista de una sección en una fecha; cada alumno tiene una
-- marca en esa sesión. Los totales (faltas del mes, % de asistencia) NUNCA se
-- guardan: se calculan desde attendance_records (regla 2 de CLAUDE.md).
-- La asistencia por hora de clase (secundaria) se podrá agregar después con
-- una columna opcional hacia schedule_slots, sin tocar lo que ya existe.
-- ============================================================================

-- Valores estables (regla 6): los mismos cinco estados que maneja el SIAGIE.
create type attendance_status as enum (
  'presente', 'tardanza', 'tardanza_justificada', 'falta', 'falta_justificada'
);

create table attendance_sessions (
  id              uuid primary key default gen_random_uuid(),
  school_id       uuid not null references schools(id) on delete cascade,
  class_group_id  uuid not null references class_groups(id) on delete cascade,
  date            date not null,
  taken_by        uuid references staff_members(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (class_group_id, date)
);

create index idx_attendance_sessions_school on attendance_sessions(school_id);
create index idx_attendance_sessions_group_date on attendance_sessions(class_group_id, date);

create trigger trg_attendance_sessions_updated_at before update on attendance_sessions
  for each row execute function set_updated_at();

create table attendance_records (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references attendance_sessions(id) on delete cascade,
  student_id  uuid not null references students(id) on delete cascade,
  status      attendance_status not null default 'presente',
  note        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (session_id, student_id)
);

create index idx_attendance_records_session on attendance_records(session_id);
create index idx_attendance_records_student on attendance_records(student_id);

create trigger trg_attendance_records_updated_at before update on attendance_records
  for each row execute function set_updated_at();

-- El colegio de la sesión siempre es el de su sección (no se confía en lo que
-- mande la app) y la sección no cambia después de creada.
create or replace function set_attendance_session_school()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and (new.class_group_id <> old.class_group_id or new.date <> old.date) then
    raise exception 'No se puede cambiar la sección ni la fecha de una lista ya tomada';
  end if;
  select school_id into new.school_id from class_groups where id = new.class_group_id;
  if new.school_id is null then
    raise exception 'Sección no encontrada';
  end if;
  return new;
end;
$$;

create trigger trg_attendance_session_school
  before insert or update on attendance_sessions
  for each row execute function set_attendance_session_school();

-- El alumno marcado debe ser del mismo colegio que la lista.
create or replace function check_attendance_record()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from attendance_sessions s
    join students st on st.school_id = s.school_id
    where s.id = new.session_id and st.id = new.student_id
  ) then
    raise exception 'El alumno no pertenece al colegio de esta lista';
  end if;
  return new;
end;
$$;

create trigger trg_check_attendance_record
  before insert or update on attendance_records
  for each row execute function check_attendance_record();

-- Hoy, en hora del Perú (el servidor trabaja en UTC).
create or replace function school_today()
returns date
language plpgsql stable
set search_path = public
as $$
begin
  return (now() at time zone 'America/Lima')::date;
end;
$$;

-- ¿El usuario actual puede pasar lista en esta sección?
-- admin/administrativo: cualquier sección del colegio. docente: las que tiene
-- asignadas (staff_assigned_sections) o donde dicta algún curso (course_offerings).
create or replace function can_take_attendance(target_class_group_id uuid)
returns boolean
language plpgsql stable security definer
set search_path = public
as $$
declare
  v_group class_groups%rowtype;
  v_staff_id uuid;
begin
  select * into v_group from class_groups where id = target_class_group_id;
  if not found then
    return false;
  end if;

  if is_platform_staff() or has_school_role(v_group.school_id, array['admin','administrativo']) then
    return true;
  end if;

  if not has_school_role(v_group.school_id, array['docente']) then
    return false;
  end if;

  v_staff_id := current_staff_id(v_group.school_id);
  return exists (
      select 1 from course_offerings co
      where co.class_group_id = v_group.id and co.teacher_id = v_staff_id
    )
    or exists (
      select 1 from staff_assigned_sections sas
      where sas.staff_id = v_staff_id
        and sas.level = v_group.level
        and sas.grade = v_group.grade
        and (sas.section is null or sas.section = v_group.section)
    );
end;
$$;

-- Puede editar una lista: admin/administrativo en cualquier fecha; el docente
-- solo el mismo día (después, las correcciones pasan por la administración).
create or replace function can_edit_attendance(target_class_group_id uuid, target_date date)
returns boolean
language plpgsql stable security definer
set search_path = public
as $$
declare
  v_school_id uuid;
begin
  select school_id into v_school_id from class_groups where id = target_class_group_id;
  if not found then
    return false;
  end if;
  if is_platform_staff() or has_school_role(v_school_id, array['admin','administrativo']) then
    return true;
  end if;
  return target_date = school_today() and can_take_attendance(target_class_group_id);
end;
$$;

-- Alumnos de una sección, para armar la lista. Va como función porque el
-- docente asignado por staff_assigned_sections ve a sus alumnos por el texto
-- nivel/grado/sección, no por class_group_id: aquí la regla es una sola.
create or replace function attendance_roster(p_class_group_id uuid)
returns table (
  id uuid,
  code text,
  paternal_surname text,
  maternal_surname text,
  first_names text,
  document_number text,
  status student_status
)
language plpgsql stable security definer
set search_path = public
as $$
begin
  if not can_take_attendance(p_class_group_id) then
    raise exception 'No autorizado para ver la lista de esta sección';
  end if;

  return query
    select s.id, s.code, s.paternal_surname, s.maternal_surname, s.first_names, s.document_number, s.status
    from students s
    where s.class_group_id = p_class_group_id
    order by s.paternal_surname, s.maternal_surname nulls first, s.first_names;
end;
$$;

revoke execute on function attendance_roster(uuid) from public, anon;
grant execute on function attendance_roster(uuid) to authenticated;

-- Vincula a su sección real a los alumnos que solo tienen nivel/grado/sección
-- como texto, cuando coincide exactamente con una sección del año indicado
-- (sin distinguir mayúsculas ni espacios). No toca a los que ya tienen sección.
create or replace function link_students_to_class_groups(p_school_id uuid, p_academic_year int)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  if not (is_platform_staff() or has_school_role(p_school_id, array['admin','administrativo'])) then
    raise exception 'No autorizado para vincular alumnos en este colegio';
  end if;

  update students s
  set class_group_id = cg.id
  from class_groups cg
  where s.school_id = p_school_id
    and s.class_group_id is null
    and s.status = 'activo'
    and cg.school_id = p_school_id
    and cg.academic_year = p_academic_year
    and cg.level = s.level
    and lower(btrim(cg.grade)) = lower(btrim(s.grade))
    and lower(btrim(cg.section)) = lower(btrim(s.section));

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke execute on function link_students_to_class_groups(uuid, int) from public, anon;
grant execute on function link_students_to_class_groups(uuid, int) to authenticated;
