-- ============================================================================
-- 99. EXÁMENES EN LÍNEA (tercer tipo de examen, junto a la ficha de
-- respuestas y al registro manual).
-- El docente escribe las preguntas en la app; el alumno entra con su cuenta,
-- presiona «Empezar examen» y responde contra el reloj.
--
-- Decisiones:
--  * El reloj es del servidor: al empezar se guarda la hora límite del
--    intento. Recargar la página o cambiar la hora del equipo no da tiempo.
--  * Cada respuesta se guarda al marcarla (exam_attempts.answers). Al vencer
--    el tiempo, el intento se cierra con lo que haya guardado.
--  * El alumno nunca lee tablas: todo pasa por funciones security definer
--    que le entregan las preguntas SIN la respuesta correcta. La clave sigue
--    en exam_answer_keys (tipo 'A'), que la familia no puede leer.
--  * Al cerrar el intento se escribe un exam_results normal: la nota la
--    calcula recalc_exam_result() (regla 2), ahora con puntaje por pregunta.
--  * Las respuestas se guardan siempre en el orden original de las preguntas
--    y con la letra original de la alternativa; el orden mezclado es solo
--    cómo se le muestra a cada alumno.
--  * Antes de publicar, el alumno y sus apoderados solo ven la nota (vía
--    my_online_exams). Al publicar («liberar») ven preguntas y respuestas con
--    las políticas de siempre (exam_results + exam_questions).
--
-- 'online' se agrega al enum en esta misma migración: por eso el valor solo
-- aparece dentro de funciones (se evalúan al ejecutarse), nunca en un CHECK,
-- un DEFAULT o un índice.
-- ============================================================================

alter type exam_entry_mode add value if not exists 'online';

create type exam_time_mode as enum ('total', 'per_question');

alter table exams
  add column time_mode          exam_time_mode not null default 'total',
  -- Segundos para todo el examen ('total') o para cada pregunta ('per_question').
  add column time_limit_seconds int check (time_limit_seconds between 10 and 86400),
  -- El examen se puede rendir desde opens_at hasta closes_at (sin closes_at,
  -- hasta que se cierre). «Abrir ahora» y «Cerrar ahora» escriben estas mismas
  -- columnas: hay una sola regla para saber si está abierto.
  add column opens_at           timestamptz,
  add column closes_at          timestamptz,
  add column shuffle_questions  boolean not null default true,
  add column shuffle_options    boolean not null default false;

-- Hasta 8 alternativas por pregunta (A–H); antes el máximo era E.
alter table exam_answer_keys drop constraint if exists exam_answer_keys_answers_check;
alter table exam_answer_keys add constraint exam_answer_keys_answers_check check (answers ~ '^[A-H]+$');
alter table exam_results drop constraint if exists exam_results_answers_check;
alter table exam_results add constraint exam_results_answers_check check (answers ~ '^[A-H*-]+$');

-- ----------------------------------------------------------------------------
-- Preguntas. La alternativa correcta NO está aquí: va en exam_answer_keys.
-- ----------------------------------------------------------------------------
create table exam_questions (
  id          uuid primary key default gen_random_uuid(),
  school_id   uuid not null references schools(id) on delete cascade,
  exam_id     uuid not null references exams(id) on delete cascade,
  number      int not null check (number >= 1),
  title       text not null,
  -- Imagen opcional, en el bucket exam-sheets: {school_id}/{exam_id}/questions/{archivo}.jpg
  image_path  text,
  options     text[] not null check (cardinality(options) between 2 and 8),
  points      numeric(6,2) not null default 1 check (points > 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (exam_id, number)
);

create trigger trg_exam_questions_updated_at before update on exam_questions
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Intentos: uno por alumno y examen.
-- ----------------------------------------------------------------------------
create table exam_attempts (
  id            uuid primary key default gen_random_uuid(),
  school_id     uuid not null references schools(id) on delete cascade,
  exam_id       uuid not null references exams(id) on delete cascade,
  student_id    uuid not null references students(id) on delete cascade,
  started_at    timestamptz not null default now(),
  -- 'total': fin del examen. 'per_question': fin de la pregunta actual.
  deadline      timestamptz not null,
  -- 'per_question': en qué pregunta va, según el orden que le tocó.
  position      int not null default 1,
  -- Lo marcado hasta ahora, un carácter por pregunta en el orden original.
  answers       text not null,
  submitted_at  timestamptz,
  unique (exam_id, student_id)
);

create index idx_exam_attempts_student on exam_attempts(student_id);

-- ----------------------------------------------------------------------------
-- Nota con puntaje por pregunta: si el examen tiene preguntas registradas,
-- nota = nota máxima × puntos ganados ÷ puntos totales. Los exámenes en papel
-- (sin exam_questions) se califican como antes: todas valen lo mismo.
-- ----------------------------------------------------------------------------
create or replace function recalc_exam_result()
returns trigger
as $$
declare
  v_exam        exams%rowtype;
  v_key         text;
  v_marks       text := '';
  v_corrections text := '';
  v_correct     int := 0;
  v_points      numeric[];
  v_earned      numeric := 0;
  v_total       numeric := 0;
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

  select array_agg(q.points order by q.number) into v_points
  from exam_questions q where q.exam_id = new.exam_id;
  if v_points is null or cardinality(v_points) <> v_exam.question_count then
    v_points := array_fill(1::numeric, array[v_exam.question_count]);
  end if;

  for i in 1..v_exam.question_count loop
    v_total := v_total + v_points[i];
    if substr(new.answers, i, 1) = substr(v_key, i, 1) then
      v_marks := v_marks || '1';
      v_corrections := v_corrections || '.';
      v_correct := v_correct + 1;
      v_earned := v_earned + v_points[i];
    else
      v_marks := v_marks || '0';
      v_corrections := v_corrections || substr(v_key, i, 1);
    end if;
  end loop;

  new.marks := v_marks;
  new.corrections := v_corrections;
  new.correct_count := v_correct;
  new.score := round((v_exam.max_score * v_earned / v_total)::numeric, 2);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- ----------------------------------------------------------------------------
-- Guardar las preguntas de un examen en línea, todo en una transacción:
-- preguntas, clave y número de preguntas del examen.
-- p_questions: [{ "title", "image_path", "options": [..], "correct": 0, "points": 1 }, ...]
-- ("correct" es el índice de la alternativa correcta, desde 0).
-- Si ya hay alumnos que empezaron, se puede corregir el texto, el puntaje, la
-- imagen o la alternativa correcta (las notas se recalculan), pero no cambiar
-- cuántas preguntas o alternativas hay: sus respuestas guardadas dejarían de
-- corresponder.
-- ----------------------------------------------------------------------------
create or replace function save_online_exam_questions(p_exam_id uuid, p_questions jsonb)
returns void
language plpgsql security definer
set search_path = public
as $$
declare
  v_exam    exams%rowtype;
  v_count   int := coalesce(jsonb_array_length(p_questions), 0);
  v_locked  boolean;
  v_key     text := '';
  v_q       jsonb;
  v_options text[];
  v_correct int;
  v_points  numeric;
  i         int;
begin
  select * into v_exam from exams where id = p_exam_id;
  if not found or not can_manage_exam(p_exam_id) then
    raise exception 'No tienes permiso para editar este examen.';
  end if;
  if v_exam.entry_mode::text <> 'online' then
    raise exception 'Este examen no es en línea.';
  end if;
  if v_count < 1 or v_count > 100 then
    raise exception 'El examen debe tener entre 1 y 100 preguntas.';
  end if;

  v_locked := exists (select 1 from exam_attempts a where a.exam_id = p_exam_id);
  if v_locked and v_count <> v_exam.question_count then
    raise exception 'Ya hay alumnos que empezaron el examen: no se puede cambiar el número de preguntas.';
  end if;

  for i in 1..v_count loop
    v_q := p_questions -> (i - 1);
    select array_agg(btrim(o) order by ord) into v_options
    from jsonb_array_elements_text(coalesce(v_q -> 'options', '[]'::jsonb)) with ordinality as t(o, ord);
    v_correct := (v_q ->> 'correct')::int;
    v_points := coalesce((v_q ->> 'points')::numeric, 1);

    if coalesce(btrim(v_q ->> 'title'), '') = '' then
      raise exception 'La pregunta % no tiene enunciado.', i;
    end if;
    if v_options is null or cardinality(v_options) < 2 or cardinality(v_options) > 8 then
      raise exception 'La pregunta % debe tener entre 2 y 8 alternativas.', i;
    end if;
    if exists (select 1 from unnest(v_options) o where o = '') then
      raise exception 'La pregunta % tiene una alternativa vacía.', i;
    end if;
    if v_correct is null or v_correct < 0 or v_correct >= cardinality(v_options) then
      raise exception 'Marca la alternativa correcta de la pregunta %.', i;
    end if;
    if v_points <= 0 or v_points > 1000 then
      raise exception 'El puntaje de la pregunta % debe ser mayor que 0.', i;
    end if;
    if v_locked and exists (
      select 1 from exam_questions q
      where q.exam_id = p_exam_id and q.number = i and cardinality(q.options) <> cardinality(v_options)
    ) then
      raise exception 'Ya hay alumnos que empezaron el examen: no se puede cambiar el número de alternativas de la pregunta %.', i;
    end if;

    v_key := v_key || chr(65 + v_correct);
  end loop;

  -- La clave se quita primero: su trigger exige una letra por pregunta y el
  -- número de preguntas puede estar cambiando.
  delete from exam_answer_keys where exam_id = p_exam_id;
  delete from exam_questions where exam_id = p_exam_id and number > v_count;
  update exams set question_count = v_count where id = p_exam_id;

  for i in 1..v_count loop
    v_q := p_questions -> (i - 1);
    select array_agg(btrim(o) order by ord) into v_options
    from jsonb_array_elements_text(v_q -> 'options') with ordinality as t(o, ord);
    insert into exam_questions (school_id, exam_id, number, title, image_path, options, points)
    values (v_exam.school_id, p_exam_id, i, btrim(v_q ->> 'title'), nullif(v_q ->> 'image_path', ''), v_options, coalesce((v_q ->> 'points')::numeric, 1))
    on conflict (exam_id, number) do update
      set title = excluded.title, image_path = excluded.image_path, options = excluded.options, points = excluded.points;
  end loop;

  -- Al insertar la clave se recalculan las notas ya guardadas (trigger de 90),
  -- ya con los puntajes nuevos.
  insert into exam_answer_keys (exam_id, theme, answers, school_id) values (p_exam_id, 'A', v_key, v_exam.school_id);
end;
$$;

-- ----------------------------------------------------------------------------
-- Piezas internas (no se llaman desde la app).
-- ----------------------------------------------------------------------------

-- El alumno que es el usuario actual en ese colegio.
create or replace function my_student_id(p_school_id uuid)
returns uuid
language plpgsql stable security definer
set search_path = public
as $$
begin
  return (
    select m.student_id from memberships m
    where m.user_id = auth.uid() and m.school_id = p_school_id
      and m.role = 'alumno' and m.student_id is not null and m.active = true
    limit 1
  );
end;
$$;

create or replace function online_exam_is_open(p_exam exams)
returns boolean
language plpgsql stable
set search_path = public
as $$
begin
  return p_exam.opens_at is not null
    and p_exam.opens_at <= now()
    and (p_exam.closes_at is null or p_exam.closes_at > now());
end;
$$;

-- Números de pregunta en el orden que le tocó a ese intento. Con mezcla, el
-- orden sale del id del intento: es distinto para cada alumno y siempre el
-- mismo para él, sin guardar nada más.
create or replace function exam_attempt_order(p_attempt exam_attempts)
returns int[]
language plpgsql stable security definer
set search_path = public
as $$
declare
  v_shuffle boolean;
begin
  select e.shuffle_questions into v_shuffle from exams e where e.id = p_attempt.exam_id;
  return (
    select array_agg(q.number order by case when v_shuffle then md5(p_attempt.id::text || q.id::text) else lpad(q.number::text, 6, '0') end)
    from exam_questions q where q.exam_id = p_attempt.exam_id
  );
end;
$$;

-- Cierra el intento: escribe el exam_results (la nota la pone su trigger).
create or replace function close_exam_attempt(p_attempt_id uuid, p_at timestamptz)
returns void
language plpgsql security definer
set search_path = public
as $$
declare
  v_attempt exam_attempts%rowtype;
begin
  select * into v_attempt from exam_attempts where id = p_attempt_id for update;
  if not found or v_attempt.submitted_at is not null then
    return;
  end if;
  insert into exam_results (school_id, exam_id, student_id, theme, answers)
  values (v_attempt.school_id, v_attempt.exam_id, v_attempt.student_id, 'A', v_attempt.answers)
  on conflict (exam_id, student_id) do update set theme = 'A', answers = excluded.answers;
  update exam_attempts set submitted_at = p_at where id = p_attempt_id;
end;
$$;

-- Pone el intento al día con el reloj: en 'per_question' salta las preguntas
-- cuyo tiempo ya venció (quedan como estén) y, si se acabó el tiempo o el
-- examen se cerró, cierra el intento.
create or replace function sync_exam_attempt(p_attempt_id uuid)
returns exam_attempts
language plpgsql security definer
set search_path = public
as $$
declare
  v_attempt exam_attempts%rowtype;
  v_exam    exams%rowtype;
begin
  select * into v_attempt from exam_attempts where id = p_attempt_id for update;
  if not found or v_attempt.submitted_at is not null then
    return v_attempt;
  end if;
  select * into v_exam from exams where id = v_attempt.exam_id;

  -- El examen se cerró (por horario o con «Cerrar ahora»): termina para todos.
  if v_exam.closes_at is not null and now() >= v_exam.closes_at then
    perform close_exam_attempt(p_attempt_id, greatest(v_exam.closes_at, v_attempt.started_at));
    select * into v_attempt from exam_attempts where id = p_attempt_id;
    return v_attempt;
  end if;

  if v_exam.time_mode = 'per_question' then
    while now() >= v_attempt.deadline and v_attempt.position <= v_exam.question_count loop
      if v_exam.closes_at is not null and v_attempt.deadline >= v_exam.closes_at then
        v_attempt.position := v_exam.question_count + 1;
      else
        v_attempt.position := v_attempt.position + 1;
        v_attempt.deadline := least(v_attempt.deadline + make_interval(secs => v_exam.time_limit_seconds), coalesce(v_exam.closes_at, 'infinity'));
      end if;
    end loop;
    update exam_attempts set position = v_attempt.position, deadline = v_attempt.deadline where id = p_attempt_id;
    if v_attempt.position > v_exam.question_count then
      perform close_exam_attempt(p_attempt_id, least(now(), v_attempt.deadline));
    end if;
  elsif now() >= v_attempt.deadline then
    perform close_exam_attempt(p_attempt_id, v_attempt.deadline);
  elsif v_exam.closes_at is not null and v_exam.closes_at < v_attempt.deadline then
    -- El docente adelantó el cierre: el intento termina con el examen.
    update exam_attempts set deadline = v_exam.closes_at where id = p_attempt_id;
    if now() >= v_exam.closes_at then
      perform close_exam_attempt(p_attempt_id, v_exam.closes_at);
    end if;
  end if;

  select * into v_attempt from exam_attempts where id = p_attempt_id;
  return v_attempt;
end;
$$;

-- ----------------------------------------------------------------------------
-- Funciones que usa la app.
-- ----------------------------------------------------------------------------

-- Cierra los intentos vencidos de un examen (alumnos que cerraron el
-- navegador o se quedaron sin tiempo). No decide nada: solo aplica el reloj,
-- por eso no pide permisos.
create or replace function close_due_exam_attempts(p_exam_id uuid)
returns void
language plpgsql security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  for v_id in select a.id from exam_attempts a where a.exam_id = p_exam_id and a.submitted_at is null loop
    perform sync_exam_attempt(v_id);
  end loop;
end;
$$;

-- Estado del examen para el alumno que lo rinde: lo que se le puede mostrar
-- ahora mismo, sin la respuesta correcta.
--   not_started → datos del examen y si está abierto.
--   in_progress → preguntas en su orden (en 'per_question', solo la actual),
--                 lo que ya marcó y la hora límite.
--   submitted   → la nota. Las preguntas y respuestas llegan cuando el
--                 colegio publica el examen, por la vista de resultados.
create or replace function online_exam_state(p_exam_id uuid)
returns jsonb
language plpgsql security definer
set search_path = public
as $$
declare
  v_exam      exams%rowtype;
  v_student   uuid;
  v_attempt   exam_attempts%rowtype;
  v_result    exam_results%rowtype;
  v_order     int[];
  v_questions jsonb;
  v_base      jsonb;
begin
  select * into v_exam from exams where id = p_exam_id;
  if not found or v_exam.entry_mode::text <> 'online' then
    raise exception 'El examen no existe.';
  end if;
  v_student := my_student_id(v_exam.school_id);
  if v_student is null or not exists (
    select 1 from students s join exam_class_groups g on g.class_group_id = s.class_group_id
    where s.id = v_student and g.exam_id = p_exam_id
  ) then
    raise exception 'Este examen no es para tu sección.';
  end if;

  v_base := jsonb_build_object(
    'exam_id', v_exam.id, 'title', v_exam.title, 'subject', v_exam.subject,
    'total', v_exam.question_count, 'max_score', v_exam.max_score,
    'time_mode', v_exam.time_mode, 'time_limit_seconds', v_exam.time_limit_seconds,
    'opens_at', v_exam.opens_at, 'closes_at', v_exam.closes_at,
    'server_now', now());

  select * into v_attempt from exam_attempts where exam_id = p_exam_id and student_id = v_student;
  if not found then
    return v_base || jsonb_build_object('status', 'not_started', 'open', online_exam_is_open(v_exam));
  end if;

  v_attempt := sync_exam_attempt(v_attempt.id);
  if v_attempt.submitted_at is not null then
    select * into v_result from exam_results where exam_id = p_exam_id and student_id = v_student;
    return v_base || jsonb_build_object('status', 'submitted', 'score', v_result.score, 'correct_count', v_result.correct_count, 'published', v_exam.published);
  end if;

  v_order := exam_attempt_order(v_attempt);
  select jsonb_agg(
    jsonb_build_object(
      'number', q.number,
      'order', o.ord,
      'title', q.title,
      'image_path', q.image_path,
      'points', q.points,
      'answer', nullif(substr(v_attempt.answers, q.number, 1), '-'),
      'options', (
        select jsonb_agg(jsonb_build_object('key', chr(64 + t.idx::int), 'text', t.txt)
          order by case when v_exam.shuffle_options then md5(v_attempt.id::text || q.id::text || t.idx::text) else lpad(t.idx::text, 3, '0') end)
        from unnest(q.options) with ordinality as t(txt, idx)
      )
    ) order by o.ord)
  into v_questions
  from unnest(v_order) with ordinality as o(number, ord)
  join exam_questions q on q.exam_id = p_exam_id and q.number = o.number
  where v_exam.time_mode = 'total' or o.ord = v_attempt.position;

  return v_base || jsonb_build_object('status', 'in_progress', 'deadline', v_attempt.deadline, 'position', v_attempt.position, 'questions', coalesce(v_questions, '[]'::jsonb));
end;
$$;

create or replace function start_online_exam(p_exam_id uuid)
returns jsonb
language plpgsql security definer
set search_path = public
as $$
declare
  v_exam    exams%rowtype;
  v_student uuid;
begin
  select * into v_exam from exams where id = p_exam_id;
  if not found or v_exam.entry_mode::text <> 'online' then
    raise exception 'El examen no existe.';
  end if;
  v_student := my_student_id(v_exam.school_id);
  if v_student is null or not exists (
    select 1 from students s join exam_class_groups g on g.class_group_id = s.class_group_id
    where s.id = v_student and g.exam_id = p_exam_id
  ) then
    raise exception 'Este examen no es para tu sección.';
  end if;

  if not exists (select 1 from exam_attempts where exam_id = p_exam_id and student_id = v_student) then
    if not online_exam_is_open(v_exam) then
      raise exception 'El examen no está abierto en este momento.';
    end if;
    if v_exam.time_limit_seconds is null
       or not exists (select 1 from exam_answer_keys k where k.exam_id = p_exam_id and k.theme = 'A')
       or (select count(*) from exam_questions q where q.exam_id = p_exam_id) <> v_exam.question_count then
      raise exception 'El examen todavía no está listo. Avisa a tu profesor.';
    end if;
    insert into exam_attempts (school_id, exam_id, student_id, deadline, answers)
    values (
      v_exam.school_id, p_exam_id, v_student,
      least(now() + make_interval(secs => v_exam.time_limit_seconds), coalesce(v_exam.closes_at, 'infinity')),
      repeat('-', v_exam.question_count)
    )
    on conflict (exam_id, student_id) do nothing;
  end if;

  return online_exam_state(p_exam_id);
end;
$$;

-- Guarda la alternativa marcada en una pregunta (p_option null = dejarla en
-- blanco). En 'per_question' solo se puede responder la pregunta actual, y
-- p_advance pasa a la siguiente: no se puede volver atrás.
create or replace function answer_online_exam(p_exam_id uuid, p_number int, p_option text, p_advance boolean default false)
returns jsonb
language plpgsql security definer
set search_path = public
as $$
declare
  v_exam    exams%rowtype;
  v_student uuid;
  v_attempt exam_attempts%rowtype;
  v_order   int[];
  v_options int;
begin
  select * into v_exam from exams where id = p_exam_id;
  if not found then
    raise exception 'El examen no existe.';
  end if;
  v_student := my_student_id(v_exam.school_id);
  select * into v_attempt from exam_attempts where exam_id = p_exam_id and student_id = v_student;
  if not found then
    raise exception 'Todavía no empezaste este examen.';
  end if;

  v_attempt := sync_exam_attempt(v_attempt.id);
  if v_attempt.submitted_at is not null then
    -- Se acabó el tiempo mientras respondía: esta respuesta ya no cuenta.
    return online_exam_state(p_exam_id);
  end if;

  if v_exam.time_mode = 'per_question' then
    v_order := exam_attempt_order(v_attempt);
    if v_order[v_attempt.position] is distinct from p_number then
      -- Llegó tarde: esa pregunta ya pasó. Se devuelve la actual.
      return online_exam_state(p_exam_id);
    end if;
  end if;

  select cardinality(q.options) into v_options from exam_questions q where q.exam_id = p_exam_id and q.number = p_number;
  if v_options is null then
    raise exception 'La pregunta no existe.';
  end if;
  if p_option is not null and (p_option !~ '^[A-H]$' or ascii(p_option) - 64 > v_options) then
    raise exception 'La alternativa no existe.';
  end if;

  update exam_attempts
  set answers = overlay(answers placing coalesce(p_option, '-') from p_number for 1)
  where id = v_attempt.id;

  if v_exam.time_mode = 'per_question' and p_advance then
    if v_attempt.position >= v_exam.question_count or (v_exam.closes_at is not null and now() >= v_exam.closes_at) then
      update exam_attempts set position = v_exam.question_count + 1 where id = v_attempt.id;
      perform close_exam_attempt(v_attempt.id, now());
    else
      update exam_attempts
      set position = position + 1,
          deadline = least(now() + make_interval(secs => v_exam.time_limit_seconds), coalesce(v_exam.closes_at, 'infinity'))
      where id = v_attempt.id;
    end if;
  end if;

  return online_exam_state(p_exam_id);
end;
$$;

-- El alumno entrega el examen antes de que se acabe el tiempo.
create or replace function finish_online_exam(p_exam_id uuid)
returns jsonb
language plpgsql security definer
set search_path = public
as $$
declare
  v_exam    exams%rowtype;
  v_student uuid;
  v_attempt exam_attempts%rowtype;
begin
  select * into v_exam from exams where id = p_exam_id;
  if not found then
    raise exception 'El examen no existe.';
  end if;
  v_student := my_student_id(v_exam.school_id);
  select * into v_attempt from exam_attempts where exam_id = p_exam_id and student_id = v_student;
  if not found then
    raise exception 'Todavía no empezaste este examen.';
  end if;
  v_attempt := sync_exam_attempt(v_attempt.id);
  if v_attempt.submitted_at is null then
    perform close_exam_attempt(v_attempt.id, now());
  end if;
  return online_exam_state(p_exam_id);
end;
$$;

-- Exámenes en línea del alumno (o de los hijos del apoderado): los que puede
-- rendir, los que están programados y los que ya rindió, con su nota. Es lo
-- único que la familia ve de un examen antes de que el colegio lo publique.
create or replace function my_online_exams()
returns table (
  exam_id uuid,
  title text,
  subject text,
  exam_date date,
  question_count int,
  max_score numeric,
  time_mode exam_time_mode,
  time_limit_seconds int,
  opens_at timestamptz,
  closes_at timestamptz,
  published boolean,
  student_id uuid,
  student_name text,
  is_own boolean,
  status text,          -- scheduled | open | in_progress | submitted | missed
  result_id uuid,
  score numeric,
  correct_count int
)
language plpgsql security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  -- Antes de listar, se aplica el reloj a los intentos abiertos de estos alumnos.
  for v_id in
    select a.id from exam_attempts a
    where a.submitted_at is null and (is_own_student(a.student_id) or is_guardian_of_student(a.student_id))
  loop
    perform sync_exam_attempt(v_id);
  end loop;

  return query
    select e.id, e.title, e.subject, e.exam_date, e.question_count, e.max_score,
           e.time_mode, e.time_limit_seconds, e.opens_at, e.closes_at, e.published,
           s.id, btrim(s.paternal_surname || ' ' || coalesce(s.maternal_surname, '') || ', ' || s.first_names),
           is_own_student(s.id),
           case
             when a.submitted_at is not null then 'submitted'
             when a.id is not null then 'in_progress'
             when online_exam_is_open(e) then 'open'
             when e.opens_at > now() then 'scheduled'
             else 'missed'
           end,
           r.id, r.score, r.correct_count
    from students s
    join exam_class_groups g on g.class_group_id = s.class_group_id
    join exams e on e.id = g.exam_id
    left join exam_attempts a on a.exam_id = e.id and a.student_id = s.id
    left join exam_results r on r.exam_id = e.id and r.student_id = s.id and a.submitted_at is not null
    where e.entry_mode::text = 'online'
      and (is_own_student(s.id) or is_guardian_of_student(s.id))
      -- Un examen sin fecha de apertura es un borrador: la familia no lo ve.
      and (a.id is not null or e.opens_at is not null)
    order by e.exam_date desc, e.created_at desc;
end;
$$;

-- Solo las funciones de la app quedan a disposición de los usuarios.
revoke execute on function close_exam_attempt(uuid, timestamptz) from public, anon, authenticated;
revoke execute on function sync_exam_attempt(uuid) from public, anon, authenticated;
revoke execute on function exam_attempt_order(exam_attempts) from public, anon, authenticated;
revoke execute on function my_student_id(uuid) from public, anon;
revoke execute on function save_online_exam_questions(uuid, jsonb) from public, anon;
revoke execute on function close_due_exam_attempts(uuid) from public, anon;
revoke execute on function online_exam_state(uuid) from public, anon;
revoke execute on function start_online_exam(uuid) from public, anon;
revoke execute on function answer_online_exam(uuid, int, text, boolean) from public, anon;
revoke execute on function finish_online_exam(uuid) from public, anon;
revoke execute on function my_online_exams() from public, anon;
grant execute on function my_student_id(uuid), save_online_exam_questions(uuid, jsonb), close_due_exam_attempts(uuid),
  online_exam_state(uuid), start_online_exam(uuid), answer_online_exam(uuid, int, text, boolean),
  finish_online_exam(uuid), my_online_exams() to authenticated;

-- ----------------------------------------------------------------------------
-- RLS
-- ----------------------------------------------------------------------------
alter table exam_questions enable row level security;
alter table exam_attempts enable row level security;

-- El personal lee y escribe las preguntas (la escritura normal va por
-- save_online_exam_questions). La familia las lee solo cuando el examen está
-- publicado y el alumno lo rindió: has_exam_result() ya exige las dos cosas.
create policy "exam_questions_select" on exam_questions for select
  using (can_manage_exam(exam_id) or has_exam_result(exam_id));
create policy "exam_questions_insert" on exam_questions for insert
  with check (can_manage_exam(exam_id) and has_school_access(school_id));
create policy "exam_questions_update" on exam_questions for update
  using (can_manage_exam(exam_id))
  with check (can_manage_exam(exam_id) and has_school_access(school_id));
create policy "exam_questions_delete" on exam_questions for delete
  using (can_manage_exam(exam_id));

-- Los intentos solo los ve el personal; el alumno usa las funciones de arriba.
-- Borrar un intento es «reabrir» el examen para ese alumno.
create policy "exam_attempts_select" on exam_attempts for select
  using (can_manage_exam(exam_id));
create policy "exam_attempts_delete" on exam_attempts for delete
  using (can_manage_exam(exam_id));

-- Imágenes de las preguntas: el personal ya las sube y las ve (políticas de
-- 92, por el uuid del examen en la ruta). El alumno las ve desde que empieza
-- su intento; sus apoderados, cuando el examen se publica.
create or replace function can_view_question_image(target_path text)
returns boolean
language plpgsql stable security definer
set search_path = public
as $$
begin
  return exists (
    select 1
    from exam_questions q
    join exams e on e.id = q.exam_id
    join exam_attempts a on a.exam_id = q.exam_id
    where q.image_path = target_path
      and (is_own_student(a.student_id) or (e.published and is_guardian_of_student(a.student_id)))
  );
end;
$$;

create policy "exam_question_images_select" on storage.objects for select
  using (bucket_id = 'exam-sheets' and can_view_question_image(name));
