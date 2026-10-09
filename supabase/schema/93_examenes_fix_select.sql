-- ============================================================================
-- 93. Corrige exams_select / exams_update.
-- La app crea el examen con INSERT ... RETURNING id, y Postgres exige que la
-- fila recién insertada pase también la política de SELECT. La política de
-- 91 usaba can_manage_exam(id), una función que vuelve a buscar la fila en
-- exams: dentro del mismo INSERT esa fila todavía no es visible para la
-- función, devolvía false y el INSERT fallaba con "new row violates
-- row-level security policy" (en la app: «No se pudo crear el examen»).
-- Ahora la política evalúa las columnas de la propia fila; solo la parte de
-- "dicto una de sus secciones" consulta otras tablas.
-- ============================================================================

create or replace function teaches_exam_group(target_exam_id uuid)
returns boolean
language plpgsql stable security definer
set search_path = public
as $$
begin
  return exists (
    select 1
    from exam_class_groups g
    join course_offerings co on co.class_group_id = g.class_group_id
    where g.exam_id = target_exam_id
      and co.teacher_id = current_staff_id(co.school_id)
  );
end;
$$;

drop policy "exams_select" on exams;
create policy "exams_select" on exams for select
  using (
    is_platform_staff()
    or has_school_role(school_id, array['admin','administrativo'])
    or created_by = current_staff_id(school_id)
    or teaches_exam_group(id)
    or has_exam_result(id)
  );

drop policy "exams_update" on exams;
create policy "exams_update" on exams for update
  using (
    has_school_role(school_id, array['admin','administrativo'])
    or created_by = current_staff_id(school_id)
    or teaches_exam_group(id)
  )
  with check (has_school_access(school_id));
