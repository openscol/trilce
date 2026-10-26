-- ============================================================================
-- A07. RLS: registro de faltas
-- Normas, tipos y configuración: los ve todo el colegio; los edita la administración.
-- Registros y fichas: admin/administrativo, todo el colegio; docente, sus
-- secciones y solo corrige el mismo día (can_edit_conduct); padre/alumno, solo
-- lectura de lo de sus hijos / lo propio.
-- ============================================================================

alter table conduct_categories enable row level security;
alter table conduct_norms enable row level security;
alter table conduct_settings enable row level security;
alter table conduct_reflection_sheets enable row level security;
alter table conduct_records enable row level security;

create policy "conduct_categories_select" on conduct_categories for select
  using (is_platform_staff() or has_school_access(school_id));
create policy "conduct_categories_write" on conduct_categories for all
  using (is_platform_staff() or has_school_role(school_id, array['admin','administrativo']))
  with check (is_platform_staff() or has_school_role(school_id, array['admin','administrativo']));

create policy "conduct_norms_select" on conduct_norms for select
  using (is_platform_staff() or has_school_access(school_id));
create policy "conduct_norms_write" on conduct_norms for all
  using (is_platform_staff() or has_school_role(school_id, array['admin','administrativo']))
  with check (
    (is_platform_staff() or has_school_role(school_id, array['admin','administrativo']))
    and exists (select 1 from conduct_categories c where c.id = category_id and c.school_id = conduct_norms.school_id)
  );

create policy "conduct_settings_select" on conduct_settings for select
  using (is_platform_staff() or has_school_access(school_id));
create policy "conduct_settings_write" on conduct_settings for all
  using (is_platform_staff() or has_school_role(school_id, array['admin','administrativo']))
  with check (is_platform_staff() or has_school_role(school_id, array['admin','administrativo']));

create policy "conduct_records_select" on conduct_records for select
  using (
    is_platform_staff()
    or has_school_role(school_id, array['admin','administrativo'])
    or (class_group_id is not null and can_take_attendance(class_group_id))
    or is_guardian_of_student(student_id)
    or is_own_student(student_id)
  );
create policy "conduct_records_insert" on conduct_records for insert
  with check (can_edit_conduct(school_id, class_group_id, date));
create policy "conduct_records_update" on conduct_records for update
  using (can_edit_conduct(school_id, class_group_id, date))
  with check (can_edit_conduct(school_id, class_group_id, date));
create policy "conduct_records_delete" on conduct_records for delete
  using (can_edit_conduct(school_id, class_group_id, date));

-- Las fichas se crean con create_reflection_sheet (SECURITY DEFINER), no con INSERT directo.
create policy "conduct_sheets_select" on conduct_reflection_sheets for select
  using (
    is_platform_staff()
    or has_school_role(school_id, array['admin','administrativo'])
    or (class_group_id is not null and can_take_attendance(class_group_id))
    or is_guardian_of_student(student_id)
    or is_own_student(student_id)
  );
create policy "conduct_sheets_update" on conduct_reflection_sheets for update
  using (can_edit_conduct(school_id, class_group_id, date))
  with check (can_edit_conduct(school_id, class_group_id, date));
-- Borrar una ficha devuelve sus faltas al conteo del día (sheet_id → null).
create policy "conduct_sheets_delete" on conduct_reflection_sheets for delete
  using (can_edit_conduct(school_id, class_group_id, date));

-- La función del trigger no se llama desde la API; can_edit_conduct solo la usa la RLS de usuarios con sesión.
revoke execute on function check_conduct_record() from public, anon, authenticated;
revoke execute on function can_edit_conduct(uuid, uuid, date) from public, anon;
grant execute on function can_edit_conduct(uuid, uuid, date) to authenticated;
