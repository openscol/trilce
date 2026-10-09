-- ============================================================================
-- 92. Fotos de las fichas ópticas: bucket privado "exam-sheets".
-- Ruta de cada foto: {school_id}/{exam_id}/{student_id}.jpg
-- El personal que gestiona el examen sube y ve las fotos; el alumno y sus
-- apoderados solo ven la foto de su propio resultado, si está publicado.
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('exam-sheets', 'exam-sheets', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- uuid del examen a partir de la ruta; null si la ruta no tiene esa forma.
create or replace function exam_id_of_sheet_path(path text)
returns uuid
language plpgsql immutable
set search_path = public
as $$
begin
  return (split_part(path, '/', 2))::uuid;
exception when others then
  return null;
end;
$$;

create or replace function can_view_exam_sheet(path text)
returns boolean
language plpgsql stable security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from exam_results r
    join exams e on e.id = r.exam_id
    where r.image_path = path
      and e.published
      and (is_own_student(r.student_id) or is_guardian_of_student(r.student_id))
  );
end;
$$;

create policy "exam_sheets_select" on storage.objects for select
  using (
    bucket_id = 'exam-sheets'
    and (can_manage_exam(exam_id_of_sheet_path(name)) or can_view_exam_sheet(name))
  );
create policy "exam_sheets_insert" on storage.objects for insert
  with check (bucket_id = 'exam-sheets' and can_manage_exam(exam_id_of_sheet_path(name)));
create policy "exam_sheets_update" on storage.objects for update
  using (bucket_id = 'exam-sheets' and can_manage_exam(exam_id_of_sheet_path(name)))
  with check (bucket_id = 'exam-sheets' and can_manage_exam(exam_id_of_sheet_path(name)));
create policy "exam_sheets_delete" on storage.objects for delete
  using (bucket_id = 'exam-sheets' and can_manage_exam(exam_id_of_sheet_path(name)));
