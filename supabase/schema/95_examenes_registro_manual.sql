-- ============================================================================
-- 95. Exámenes con registro manual (sin ficha de respuestas).
-- Los alumnos de los primeros grados no pueden llenar la ficha: el docente
-- escribe en la app la letra que marcó cada alumno en su examen y sube una
-- foto (o PDF) del examen ya calificado, que verán el alumno y sus apoderados.
-- La nota la sigue calculando recalc_exam_result() con la clave (regla 2).
-- ============================================================================

create type exam_entry_mode as enum ('sheet', 'manual');

alter table exams add column entry_mode exam_entry_mode not null default 'sheet';

-- ----------------------------------------------------------------------------
-- Examen calificado de cada alumno: una o varias páginas (imágenes) o un PDF.
-- Va por alumno y no por exam_results para poder subirlo antes de registrar
-- las respuestas. Ruta en el bucket exam-sheets:
--   {school_id}/{exam_id}/graded/{student_id}-{archivo}.jpg|.pdf
-- ----------------------------------------------------------------------------
create table exam_result_files (
  id          uuid primary key default gen_random_uuid(),
  school_id   uuid not null references schools(id) on delete cascade,
  exam_id     uuid not null references exams(id) on delete cascade,
  student_id  uuid not null references students(id) on delete cascade,
  path        text not null unique,
  position    int not null default 0,
  created_at  timestamptz not null default now()
);

create index idx_exam_result_files_exam on exam_result_files(exam_id, student_id, position);
create index idx_exam_result_files_student on exam_result_files(student_id);

create or replace function check_exam_result_file()
returns trigger
as $$
begin
  if not exists (select 1 from exams e where e.id = new.exam_id and e.school_id = new.school_id) then
    raise exception 'El archivo y el examen deben ser del mismo colegio.';
  end if;
  if not exists (select 1 from students s where s.id = new.student_id and s.school_id = new.school_id) then
    raise exception 'El alumno no pertenece al colegio del examen.';
  end if;
  -- La ruta debe estar en la carpeta del examen y llevar el id del alumno: de ella dependen las políticas del bucket.
  if new.path not like new.school_id::text || '/' || new.exam_id::text || '/graded/' || new.student_id::text || '-%' then
    raise exception 'La ruta del archivo no corresponde al examen o al alumno.';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_exam_result_files_check
  before insert or update on exam_result_files
  for each row execute function check_exam_result_file();

alter table exam_result_files enable row level security;

create policy "exam_result_files_select" on exam_result_files for select
  using (
    can_manage_exam(exam_id)
    or (
      exam_is_published(exam_id)
      and (is_own_student(student_id) or is_guardian_of_student(student_id))
    )
  );
create policy "exam_result_files_insert" on exam_result_files for insert
  with check (can_manage_exam(exam_id) and has_school_access(school_id));
create policy "exam_result_files_update" on exam_result_files for update
  using (can_manage_exam(exam_id))
  with check (can_manage_exam(exam_id) and has_school_access(school_id));
create policy "exam_result_files_delete" on exam_result_files for delete
  using (can_manage_exam(exam_id));

-- Bucket: el personal ya sube y ve todo lo del examen (políticas de 92). Se
-- suma la lectura del examen calificado para el alumno y sus apoderados.
create or replace function can_view_graded_file(target_path text)
returns boolean
language plpgsql stable security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from exam_result_files f
    join exams e on e.id = f.exam_id
    where f.path = target_path
      and e.published
      and (is_own_student(f.student_id) or is_guardian_of_student(f.student_id))
  );
end;
$$;

create policy "exam_graded_select" on storage.objects for select
  using (bucket_id = 'exam-sheets' and can_view_graded_file(name));
