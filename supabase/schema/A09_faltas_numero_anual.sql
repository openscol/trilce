-- ============================================================================
-- A09. Número de ficha/acta correlativo POR AÑO (001-2026, 002-2026... y en
-- enero vuelve a 001-2027). Hasta aplicar esta migración el número es
-- correlativo por colegio y no se reinicia.
-- Misma firma de create_reflection_sheet: solo cambia cómo calcula el número.
-- ============================================================================

alter table conduct_reflection_sheets drop constraint if exists conduct_reflection_sheets_school_id_number_key;
create unique index if not exists uq_conduct_sheets_school_year_number
  on conduct_reflection_sheets (school_id, (extract(year from date)::int), number);

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

  -- Correlativo por colegio y año, sin duplicados aunque dos docentes generen a la vez.
  perform pg_advisory_xact_lock(hashtext('conduct_sheet:' || v_student.school_id::text || ':' || extract(year from v_today)::text));
  select coalesce(max(number), 0) + 1 into v_number
  from conduct_reflection_sheets
  where school_id = v_student.school_id and extract(year from date) = extract(year from v_today);

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
