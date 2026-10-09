-- ============================================================================
-- 91. RLS: exámenes.
--   admin / administrativo  → todo el colegio.
--   docente                 → los exámenes que creó y los de las secciones
--                             que dicta (course_offerings.teacher_id; nunca
--                             has_school_role(...,'docente')).
--   alumno / padre          → solo su resultado (o el de sus hijos) y los
--                             datos del examen, y solo si está publicado.
--                             Nunca la clave de respuestas.
-- Las políticas se apoyan en funciones security definer para no encadenar
-- una política con otra (exams ↔ exam_results se referirían en círculo).
-- ============================================================================

create or replace function can_manage_exam(target_exam_id uuid)
returns boolean
language plpgsql stable security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from exams e
    where e.id = target_exam_id
      and (
        is_platform_staff()
        or has_school_role(e.school_id, array['admin','administrativo'])
        or e.created_by = current_staff_id(e.school_id)
        or exists (
          select 1
          from exam_class_groups g
          join course_offerings co on co.class_group_id = g.class_group_id
          where g.exam_id = e.id
            and co.teacher_id = current_staff_id(co.school_id)
        )
      )
  );
end;
$$;

create or replace function exam_is_published(target_exam_id uuid)
returns boolean
language plpgsql stable security definer
set search_path = public
as $$
begin
  return exists (select 1 from exams e where e.id = target_exam_id and e.published);
end;
$$;

-- ¿El usuario (alumno o padre) tiene un resultado publicado en este examen?
create or replace function has_exam_result(target_exam_id uuid)
returns boolean
language plpgsql stable security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from exam_results r
    join exams e on e.id = r.exam_id
    where r.exam_id = target_exam_id
      and e.published
      and (is_own_student(r.student_id) or is_guardian_of_student(r.student_id))
  );
end;
$$;

alter table exams enable row level security;
alter table exam_class_groups enable row level security;
alter table exam_answer_keys enable row level security;
alter table exam_results enable row level security;

-- exams ----------------------------------------------------------------------
create policy "exams_select" on exams for select
  using (can_manage_exam(id) or has_exam_result(id));
create policy "exams_insert" on exams for insert
  with check (
    has_school_role(school_id, array['admin','administrativo'])
    or (created_by is not null and created_by = current_staff_id(school_id))
  );
create policy "exams_update" on exams for update
  using (can_manage_exam(id))
  with check (has_school_access(school_id));
create policy "exams_delete" on exams for delete
  using (
    has_school_role(school_id, array['admin','administrativo'])
    or created_by = current_staff_id(school_id)
  );

-- exam_class_groups ----------------------------------------------------------
create policy "exam_class_groups_select" on exam_class_groups for select
  using (can_manage_exam(exam_id));
create policy "exam_class_groups_insert" on exam_class_groups for insert
  with check (can_manage_exam(exam_id) and has_school_access(school_id));
create policy "exam_class_groups_delete" on exam_class_groups for delete
  using (can_manage_exam(exam_id));

-- exam_answer_keys (solo personal) -------------------------------------------
create policy "exam_answer_keys_select" on exam_answer_keys for select
  using (can_manage_exam(exam_id));
create policy "exam_answer_keys_insert" on exam_answer_keys for insert
  with check (can_manage_exam(exam_id) and has_school_access(school_id));
create policy "exam_answer_keys_update" on exam_answer_keys for update
  using (can_manage_exam(exam_id))
  with check (can_manage_exam(exam_id) and has_school_access(school_id));
create policy "exam_answer_keys_delete" on exam_answer_keys for delete
  using (can_manage_exam(exam_id));

-- exam_results ---------------------------------------------------------------
create policy "exam_results_select" on exam_results for select
  using (
    can_manage_exam(exam_id)
    or (
      exam_is_published(exam_id)
      and (is_own_student(student_id) or is_guardian_of_student(student_id))
    )
  );
create policy "exam_results_insert" on exam_results for insert
  with check (can_manage_exam(exam_id) and has_school_access(school_id));
create policy "exam_results_update" on exam_results for update
  using (can_manage_exam(exam_id))
  with check (can_manage_exam(exam_id) and has_school_access(school_id));
create policy "exam_results_delete" on exam_results for delete
  using (can_manage_exam(exam_id));

-- El docente que toma el examen necesita ver a los alumnos de las secciones
-- del examen para asociar cada ficha, aunque no les dicte un curso. Se amplía
-- students_select con una política adicional (las políticas permisivas se
-- suman con OR), sin tocar la existente.
create or replace function is_student_in_my_exam(target_student_id uuid)
returns boolean
language plpgsql stable security definer
set search_path = public
as $$
begin
  return exists (
    select 1
    from students s
    join exam_class_groups g on g.class_group_id = s.class_group_id
    join exams e on e.id = g.exam_id
    where s.id = target_student_id
      and e.created_by = current_staff_id(e.school_id)
  );
end;
$$;

create policy "students_select_exam_owner" on students for select
  using (is_student_in_my_exam(id));
