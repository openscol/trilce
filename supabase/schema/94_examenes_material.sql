-- ============================================================================
-- 94. Exámenes: respuesta correcta de las preguntas falladas y material del
-- examen (imágenes del cuadernillo y de la ficha de respuestas, por tipo).
--
-- En la base de datos el "tipo" de examen (A, B…) se sigue llamando theme:
-- solo cambió el nombre que ve el usuario.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. exam_results.corrections: una posición por pregunta; '.' si el alumno
--    acertó y la letra correcta si falló. Así la familia ve cuál era la
--    respuesta correcta solo en las preguntas falladas, sin tener acceso a
--    exam_answer_keys. La calcula recalc_exam_result() (regla 2): la app no
--    la escribe.
-- ----------------------------------------------------------------------------
alter table exam_results add column corrections text;

create or replace function recalc_exam_result()
returns trigger
as $$
declare
  v_exam        exams%rowtype;
  v_key         text;
  v_marks       text := '';
  v_corrections text := '';
  v_correct     int := 0;
  i             int;
begin
  select * into v_exam from exams where id = new.exam_id;
  if not found then
    raise exception 'El examen no existe.';
  end if;
  if new.school_id <> v_exam.school_id then
    raise exception 'El resultado no pertenece al colegio del examen.';
  end if;
  if not exists (select 1 from students s where s.id = new.student_id and s.school_id = v_exam.school_id) then
    raise exception 'El alumno no pertenece al colegio del examen.';
  end if;
  if length(new.answers) <> v_exam.question_count then
    raise exception 'El examen tiene % preguntas y se recibieron % respuestas.', v_exam.question_count, length(new.answers);
  end if;

  select k.answers into v_key from exam_answer_keys k
  where k.exam_id = new.exam_id and k.theme = new.theme;

  if v_key is null then
    -- Sin clave para ese tipo todavía: se guarda lo marcado, sin nota.
    new.marks := null;
    new.corrections := null;
    new.correct_count := null;
    new.score := null;
    return new;
  end if;

  for i in 1..v_exam.question_count loop
    if substr(new.answers, i, 1) = substr(v_key, i, 1) then
      v_marks := v_marks || '1';
      v_corrections := v_corrections || '.';
      v_correct := v_correct + 1;
    else
      v_marks := v_marks || '0';
      v_corrections := v_corrections || substr(v_key, i, 1);
    end if;
  end loop;

  new.marks := v_marks;
  new.corrections := v_corrections;
  new.correct_count := v_correct;
  new.score := round((v_exam.max_score * v_correct / v_exam.question_count)::numeric, 2);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Rellena corrections en las fichas ya guardadas (el UPDATE dispara el trigger).
update exam_results set updated_at = now();

-- ----------------------------------------------------------------------------
-- 2. exam_files: imágenes del examen. Por cada tipo, las páginas del
--    cuadernillo (kind = 'exam', varias) y la ficha de respuestas
--    (kind = 'answer_sheet', una sola por examen y tipo, la misma para todos
--    los alumnos de ese tipo). Los archivos viven en el bucket exam-sheets:
--    {school_id}/{exam_id}/material/{archivo}.jpg (o .pdf)
-- ----------------------------------------------------------------------------
create type exam_file_kind as enum ('exam', 'answer_sheet');

create table exam_files (
  id          uuid primary key default gen_random_uuid(),
  school_id   uuid not null references schools(id) on delete cascade,
  exam_id     uuid not null references exams(id) on delete cascade,
  theme       text not null check (theme ~ '^[A-Z]$'),
  kind        exam_file_kind not null,
  path        text not null unique,
  position    int not null default 0,
  created_at  timestamptz not null default now()
);

create index idx_exam_files_exam on exam_files(exam_id, theme, kind, position);
create unique index one_answer_sheet_per_exam_type on exam_files(exam_id, theme) where kind = 'answer_sheet';

create or replace function check_exam_file()
returns trigger
as $$
begin
  if not exists (select 1 from exams e where e.id = new.exam_id and e.school_id = new.school_id) then
    raise exception 'El archivo y el examen deben ser del mismo colegio.';
  end if;
  -- La ruta debe estar dentro de la carpeta del examen: de ella dependen las políticas del bucket.
  if new.path not like new.school_id::text || '/' || new.exam_id::text || '/material/%' then
    raise exception 'La ruta del archivo no corresponde al examen.';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_exam_files_check
  before insert or update on exam_files
  for each row execute function check_exam_file();

-- ¿El usuario (alumno o padre) rindió este examen, ya publicado, con ese tipo?
create or replace function can_view_exam_material(target_exam_id uuid, target_theme text)
returns boolean
language plpgsql stable security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from exam_results r
    join exams e on e.id = r.exam_id
    where r.exam_id = target_exam_id
      and r.theme = target_theme
      and e.published
      and (is_own_student(r.student_id) or is_guardian_of_student(r.student_id))
  );
end;
$$;

alter table exam_files enable row level security;

create policy "exam_files_select" on exam_files for select
  using (can_manage_exam(exam_id) or can_view_exam_material(exam_id, theme));
create policy "exam_files_insert" on exam_files for insert
  with check (can_manage_exam(exam_id) and has_school_access(school_id));
create policy "exam_files_update" on exam_files for update
  using (can_manage_exam(exam_id))
  with check (can_manage_exam(exam_id) and has_school_access(school_id));
create policy "exam_files_delete" on exam_files for delete
  using (can_manage_exam(exam_id));

-- Bucket: el personal ya puede subir y ver todo lo del examen (políticas de
-- 92, por el uuid del examen en la ruta). Se suma la lectura del material para
-- la familia; las políticas permisivas se combinan con OR.
create or replace function can_view_exam_file(target_path text)
returns boolean
language plpgsql stable security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from exam_files f
    where f.path = target_path
      and can_view_exam_material(f.exam_id, f.theme)
  );
end;
$$;

create policy "exam_material_select" on storage.objects for select
  using (bucket_id = 'exam-sheets' and can_view_exam_file(name));

-- El examen y la ficha de respuestas también pueden subirse como PDF (se
-- muestran embebidos). Un PDF pesa más que una foto reducida: límite de 20 MB.
update storage.buckets
set file_size_limit = 20971520,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
where id = 'exam-sheets';
