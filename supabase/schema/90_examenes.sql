-- ============================================================================
-- 90. EXÁMENES CON FICHA ÓPTICA
-- Un examen escrito que se rinde en papel: el alumno rellena una ficha óptica
-- (código de 8 dígitos, tema y una opción A-D por pregunta), el docente
-- fotografía las fichas y el sistema las lee. Cada ficha leída es un
-- exam_results, asociado al alumno, que él y sus apoderados pueden ver.
--
-- Regla 2 de la arquitectura: la nota no se escribe desde la aplicación. La
-- app solo guarda lo que el alumno marcó (answers); el trigger
-- recalc_exam_result() calcula marks, correct_count y score con la clave.
-- ============================================================================

create table exams (
  id              uuid primary key default gen_random_uuid(),
  school_id       uuid not null references schools(id) on delete cascade,
  title           text not null,
  subject         text,
  exam_date       date not null default current_date,
  question_count  int not null check (question_count between 1 and 100),
  max_score       numeric(5,2) not null default 20 check (max_score > 0),
  -- Diseño de la ficha impresa (qué plantilla usa el lector).
  sheet_layout    text not null default 'trilce_10',
  -- Mientras no esté publicado, alumnos y apoderados no ven nada del examen.
  published       boolean not null default false,
  created_by      uuid references staff_members(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_exams_school on exams(school_id, exam_date desc);

create trigger trg_exams_updated_at before update on exams
  for each row execute function set_updated_at();

-- Secciones que rinden el examen (un mismo examen puede tomarse en varias).
create table exam_class_groups (
  exam_id         uuid not null references exams(id) on delete cascade,
  class_group_id  uuid not null references class_groups(id) on delete cascade,
  school_id       uuid not null references schools(id) on delete cascade,
  primary key (exam_id, class_group_id)
);

create index idx_exam_class_groups_group on exam_class_groups(class_group_id);

-- Clave de respuestas por tema: una letra por pregunta ("BBCCBCBBCB").
-- Tabla aparte de exams para que alumnos y apoderados nunca puedan leerla.
create table exam_answer_keys (
  exam_id     uuid not null references exams(id) on delete cascade,
  theme       text not null check (theme ~ '^[A-Z]$'),
  answers     text not null check (answers ~ '^[A-E]+$'),
  school_id   uuid not null references schools(id) on delete cascade,
  updated_at  timestamptz not null default now(),
  primary key (exam_id, theme)
);

create table exam_results (
  id             uuid primary key default gen_random_uuid(),
  school_id      uuid not null references schools(id) on delete cascade,
  exam_id        uuid not null references exams(id) on delete cascade,
  student_id     uuid not null references students(id) on delete cascade,
  theme          text not null check (theme ~ '^[A-Z]$'),
  -- Lo que marcó el alumno, un carácter por pregunta: A-E, '-' en blanco,
  -- '*' más de una marca (anulada).
  answers        text not null check (answers ~ '^[A-E*-]+$'),
  -- Calculados por recalc_exam_result(); la app no los escribe.
  marks          text,           -- '1' acierto / '0' fallo, por pregunta
  correct_count  int,
  score          numeric(5,2),
  -- Código que se leyó en la ficha y foto de la ficha (bucket exam-sheets).
  sheet_code     text,
  image_path     text,
  scanned_by     uuid references staff_members(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (exam_id, student_id)
);

create index idx_exam_results_student on exam_results(student_id);
create index idx_exam_results_exam on exam_results(exam_id);

create trigger trg_exam_results_updated_at before update on exam_results
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Integridad y cálculo de la nota. security definer: su trabajo es verificar
-- y calcular entre tablas, no controlar el acceso (eso lo hace RLS).
-- ----------------------------------------------------------------------------
create or replace function recalc_exam_result()
returns trigger
as $$
declare
  v_exam    exams%rowtype;
  v_key     text;
  v_marks   text := '';
  v_correct int := 0;
  i         int;
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
    -- Sin clave para ese tema todavía: se guarda lo marcado, sin nota.
    new.marks := null;
    new.correct_count := null;
    new.score := null;
    return new;
  end if;

  for i in 1..v_exam.question_count loop
    if substr(new.answers, i, 1) = substr(v_key, i, 1) then
      v_marks := v_marks || '1';
      v_correct := v_correct + 1;
    else
      v_marks := v_marks || '0';
    end if;
  end loop;

  new.marks := v_marks;
  new.correct_count := v_correct;
  new.score := round((v_exam.max_score * v_correct / v_exam.question_count)::numeric, 2);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_exam_results_recalc
  before insert or update on exam_results
  for each row execute function recalc_exam_result();

-- Si cambia la clave, el número de preguntas o la nota máxima, se recalculan
-- los resultados ya guardados (el UPDATE vuelve a disparar el trigger de arriba).
create or replace function recalc_exam_results_of_exam()
returns trigger
as $$
declare
  v_exam_id uuid;
begin
  if tg_table_name = 'exams' then
    v_exam_id := new.id;
  elsif tg_op = 'DELETE' then
    v_exam_id := old.exam_id;
  else
    v_exam_id := new.exam_id;
  end if;

  -- Al borrar un examen, sus claves y resultados se borran en cascada: no hay nada que recalcular.
  if exists (select 1 from exams where id = v_exam_id) then
    update exam_results set updated_at = now() where exam_id = v_exam_id;
  end if;
  return null;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_exam_answer_keys_recalc
  after insert or update or delete on exam_answer_keys
  for each row execute function recalc_exam_results_of_exam();

create trigger trg_exams_recalc
  after update of max_score, question_count on exams
  for each row execute function recalc_exam_results_of_exam();

-- La clave debe tener una letra por pregunta.
create or replace function check_exam_answer_key()
returns trigger
as $$
declare
  v_exam exams%rowtype;
begin
  select * into v_exam from exams where id = new.exam_id;
  if not found then
    raise exception 'El examen no existe.';
  end if;
  if new.school_id <> v_exam.school_id then
    raise exception 'La clave no pertenece al colegio del examen.';
  end if;
  if length(new.answers) <> v_exam.question_count then
    raise exception 'La clave debe tener % letras (una por pregunta) y tiene %.', v_exam.question_count, length(new.answers);
  end if;
  new.updated_at := now();
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_exam_answer_keys_check
  before insert or update on exam_answer_keys
  for each row execute function check_exam_answer_key();

-- La sección debe ser del mismo colegio que el examen.
create or replace function check_exam_class_group()
returns trigger
as $$
begin
  if not exists (select 1 from exams e where e.id = new.exam_id and e.school_id = new.school_id)
     or not exists (select 1 from class_groups g where g.id = new.class_group_id and g.school_id = new.school_id) then
    raise exception 'La sección y el examen deben ser del mismo colegio.';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_exam_class_groups_check
  before insert or update on exam_class_groups
  for each row execute function check_exam_class_group();
