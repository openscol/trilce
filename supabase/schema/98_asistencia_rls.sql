-- ============================================================================
-- 98. RLS: asistencia
-- admin/administrativo: todo el colegio, cualquier fecha.
-- docente: solo sus secciones (can_take_attendance) y solo edita el mismo día.
-- padre/alumno: solo lectura de las marcas de sus hijos / las propias.
-- ============================================================================

alter table attendance_sessions enable row level security;
alter table attendance_records enable row level security;

create policy "attendance_sessions_select" on attendance_sessions for select
  using (
    can_take_attendance(class_group_id)
    or has_class_group_access(class_group_id)
  );
create policy "attendance_sessions_insert" on attendance_sessions for insert
  with check (can_edit_attendance(class_group_id, date));
create policy "attendance_sessions_update" on attendance_sessions for update
  using (can_edit_attendance(class_group_id, date))
  with check (can_edit_attendance(class_group_id, date));
-- Borrar una lista completa es solo de la administración.
create policy "attendance_sessions_delete" on attendance_sessions for delete
  using (is_platform_staff() or has_school_role(school_id, array['admin','administrativo']));

create policy "attendance_records_select" on attendance_records for select
  using (
    is_guardian_of_student(student_id)
    or is_own_student(student_id)
    or exists (
      select 1 from attendance_sessions s
      where s.id = session_id and can_take_attendance(s.class_group_id)
    )
  );
create policy "attendance_records_write" on attendance_records for all
  using (exists (
    select 1 from attendance_sessions s
    where s.id = session_id and can_edit_attendance(s.class_group_id, s.date)
  ))
  with check (exists (
    select 1 from attendance_sessions s
    where s.id = session_id and can_edit_attendance(s.class_group_id, s.date)
  ));
