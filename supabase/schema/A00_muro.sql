-- ============================================================================
-- A00. MURO DEL COLEGIO (publicaciones al estilo de una red social).
--
-- Numeración: después del 99 los archivos siguen con A00, A01… ("A" se ordena
-- después de los dígitos, así que el orden alfabético sigue siendo el orden en
-- que se aplican; "100_" quedaría antes de "10_platform").
--
-- Reglas de esta primera versión:
--  * Publican admin y administrativos (a todo el colegio, a un grado o a una
--    sección) y docentes (solo a los grados o secciones que tienen a cargo).
--  * Todos los miembros del colegio ven el muro; alumnos y apoderados solo
--    las publicaciones dirigidas a todo el colegio, a su grado o a su sección.
--  * Todos pueden reaccionar y comentar. Solo el personal puede RESPONDER un
--    comentario: alumnos y apoderados no conversan entre ellos.
--  * Los comentarios pasan por un filtro de groserías en la base de datos
--    (feed_blocked_words): la app no puede saltárselo.
--  * Nada calculable se guarda (regla 2): los totales de reacciones, «me
--    gusta» y comentarios se cuentan al leer.
--  * El nombre y el rol del autor se copian al publicar o comentar: es lo que
--    se mostró en ese momento, y evita abrir a todo el colegio la lectura de
--    students / guardians / staff_members.
-- ============================================================================

create type feed_audience as enum ('school', 'grade', 'section');
create type feed_reaction as enum ('like', 'love', 'haha', 'wow', 'sad', 'angry');

create table feed_posts (
  id                uuid primary key default gen_random_uuid(),
  school_id         uuid not null references schools(id) on delete cascade,
  author_user_id    uuid references auth.users(id) on delete set null,
  author_name       text not null,
  author_role       membership_role not null,
  body              text not null default '' check (char_length(body) <= 5000),
  -- Video de YouTube embebido: solo el id del video (11 caracteres).
  youtube_id        text check (youtube_id ~ '^[A-Za-z0-9_-]{11}$'),
  -- A quién va dirigida: todo el colegio, un grado (nivel + grado) o una sección.
  audience          feed_audience not null default 'school',
  level             enrollment_level,
  grade             text,
  class_group_id    uuid references class_groups(id) on delete cascade,
  comments_enabled  boolean not null default true,
  -- Fijada: aparece primero en el muro.
  pinned_at         timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint chk_feed_post_audience check (
    (audience = 'school' and level is null and grade is null and class_group_id is null)
    or (audience = 'grade' and level is not null and grade is not null and class_group_id is null)
    or (audience = 'section' and class_group_id is not null and level is null and grade is null)
  )
);

create index idx_feed_posts_school on feed_posts(school_id, created_at desc);

create trigger trg_feed_posts_updated_at before update on feed_posts
  for each row execute function set_updated_at();

-- Imágenes de la publicación (una o varias), en el bucket privado "feed":
--   {school_id}/{post_id}/{archivo}.jpg
create table feed_post_images (
  id          uuid primary key default gen_random_uuid(),
  school_id   uuid not null references schools(id) on delete cascade,
  post_id     uuid not null references feed_posts(id) on delete cascade,
  path        text not null unique,
  position    int not null default 0,
  created_at  timestamptz not null default now()
);

create index idx_feed_post_images_post on feed_post_images(post_id, position);

-- Una reacción por persona y publicación (se puede cambiar o quitar).
create table feed_post_reactions (
  post_id     uuid not null references feed_posts(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  school_id   uuid not null references schools(id) on delete cascade,
  reaction    feed_reaction not null,
  created_at  timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- Comentarios. parent_id = respuesta a un comentario; siempre a un solo nivel
-- (responder a una respuesta la cuelga del mismo comentario principal).
create table feed_comments (
  id           uuid primary key default gen_random_uuid(),
  school_id    uuid not null references schools(id) on delete cascade,
  post_id      uuid not null references feed_posts(id) on delete cascade,
  parent_id    uuid references feed_comments(id) on delete cascade,
  user_id      uuid references auth.users(id) on delete set null,
  author_name  text not null,
  author_role  membership_role not null,
  body         text not null check (char_length(btrim(body)) between 1 and 1000),
  created_at   timestamptz not null default now()
);

create index idx_feed_comments_post on feed_comments(post_id, created_at);

create table feed_comment_likes (
  comment_id  uuid not null references feed_comments(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  school_id   uuid not null references schools(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (comment_id, user_id)
);

-- Palabras que no se permiten en los comentarios. Tabla y no enum (regla 6):
-- cada colegio puede agregar las suyas; school_id null = lista general.
-- match_inside: también se busca dentro de otras palabras («requetecojudo»);
-- solo para raíces inconfundibles, que no aparecen en palabras normales.
create table feed_blocked_words (
  id            uuid primary key default gen_random_uuid(),
  school_id     uuid references schools(id) on delete cascade,
  word          text not null check (btrim(word) <> ''),
  match_inside  boolean not null default false,
  created_at    timestamptz not null default now()
);

create unique index feed_blocked_words_unique on feed_blocked_words (coalesce(school_id, '00000000-0000-0000-0000-000000000000'::uuid), lower(word));

-- ----------------------------------------------------------------------------
-- Filtro de groserías
-- ----------------------------------------------------------------------------

-- Deja el texto comparable: minúsculas, sin tildes, con los números y signos
-- que se usan para disfrazar letras convertidos («m13rd@» → «mierda») y sin
-- letras repetidas («mieeerda» → «mierda»).
create or replace function feed_normalize(p_text text)
returns text
language plpgsql immutable
set search_path = public
as $$
begin
  return regexp_replace(
    translate(lower(coalesce(p_text, '')), 'áàäâéèëêíìïîóòöôúùüû0134578@$', 'aaaaeeeeiiiioooouuuuoieastbas'),
    '(.)\1+', '\1', 'g');
end;
$$;

create or replace function feed_has_blocked_word(p_school_id uuid, p_text text)
returns boolean
language plpgsql stable security definer
set search_path = public
as $$
declare
  -- Las letras sueltas seguidas se juntan antes de comparar: «m i e r d a» → «mierda».
  v_tokens text[] := regexp_split_to_array(
    regexp_replace(feed_normalize(p_text), '\m([a-zñ])[^a-zñ]+(?=[a-zñ]\M)', '\1', 'g'),
    '[^a-zñ]+');
begin
  return exists (
    select 1
    from feed_blocked_words w
    where (w.school_id is null or w.school_id = p_school_id)
      and (
        feed_normalize(w.word) = any (v_tokens)
        or (w.match_inside and exists (select 1 from unnest(v_tokens) t where position(feed_normalize(w.word) in t) > 0))
      )
  );
end;
$$;

-- ----------------------------------------------------------------------------
-- Identidad y permisos
-- ----------------------------------------------------------------------------

-- Con qué nombre y rol aparece el usuario actual en ese colegio. Si tiene más
-- de una membresía (p. ej. docente y padre), manda la del personal.
create or replace function feed_identity(p_school_id uuid)
returns table (role membership_role, name text)
language plpgsql stable security definer
set search_path = public
as $$
begin
  return query
    select m.role,
           coalesce(
             st.full_name,
             btrim(g.first_names || ' ' || coalesce(g.paternal_surname, '') || ' ' || coalesce(g.maternal_surname, '')),
             btrim(s.first_names || ' ' || s.paternal_surname || ' ' || coalesce(s.maternal_surname, ''))
           )
    from memberships m
    left join staff_members st on st.id = m.staff_id
    left join guardians g on g.id = m.guardian_id
    left join students s on s.id = m.student_id
    where m.user_id = auth.uid() and m.school_id = p_school_id and m.active = true
    order by case m.role when 'admin' then 1 when 'administrativo' then 2 when 'docente' then 3 when 'padre' then 4 else 5 end
    limit 1;
end;
$$;

-- ¿El usuario actual puede publicar para esa audiencia?
create or replace function can_publish_feed(p_school_id uuid, p_audience feed_audience, p_level enrollment_level, p_grade text, p_class_group_id uuid)
returns boolean
language plpgsql stable security definer
set search_path = public
as $$
begin
  if is_platform_staff() or has_school_role(p_school_id, array['admin', 'administrativo']) then
    return true;
  end if;
  if not has_school_role(p_school_id, array['docente']) then
    return false;
  end if;
  -- Docente: solo a sus secciones, o a un grado donde tiene alguna sección.
  if p_audience = 'section' then
    return exists (select 1 from class_groups cg where cg.id = p_class_group_id and cg.school_id = p_school_id)
      and can_take_attendance(p_class_group_id);
  elsif p_audience = 'grade' then
    return exists (
      select 1 from class_groups cg
      where cg.school_id = p_school_id and cg.level = p_level
        and lower(btrim(cg.grade)) = lower(btrim(p_grade))
        and can_take_attendance(cg.id)
    );
  end if;
  return false;
end;
$$;

-- ¿El usuario actual está en la audiencia? El personal ve todo el muro de su
-- colegio; alumnos y apoderados, lo dirigido a todo el colegio, a su grado o
-- a su sección (el apoderado, por cualquiera de sus hijos).
create or replace function can_see_feed_audience(p_school_id uuid, p_audience feed_audience, p_level enrollment_level, p_grade text, p_class_group_id uuid)
returns boolean
language plpgsql stable security definer
set search_path = public
as $$
begin
  if is_platform_staff() or has_school_role(p_school_id, array['admin', 'administrativo', 'docente']) then
    return true;
  end if;
  if not has_school_access(p_school_id) then
    return false;
  end if;
  if p_audience = 'school' then
    return true;
  end if;
  return exists (
    select 1
    from students s
    left join class_groups cg on cg.id = s.class_group_id
    where s.school_id = p_school_id
      and (is_own_student(s.id) or is_guardian_of_student(s.id))
      and (
        (p_audience = 'section' and s.class_group_id = p_class_group_id)
        or (p_audience = 'grade'
            and coalesce(cg.level, s.level) = p_level
            and lower(btrim(coalesce(cg.grade, s.grade))) = lower(btrim(p_grade)))
      )
  );
end;
$$;

create or replace function feed_post_visible(p_post_id uuid)
returns boolean
language plpgsql stable security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from feed_posts p
    where p.id = p_post_id and can_see_feed_audience(p.school_id, p.audience, p.level, p.grade, p.class_group_id)
  );
end;
$$;

-- Moderar una publicación (borrarla, borrar sus comentarios): su autor y la administración.
create or replace function can_moderate_feed_post(p_post_id uuid)
returns boolean
language plpgsql stable security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from feed_posts p
    where p.id = p_post_id
      and (is_platform_staff() or p.author_user_id = auth.uid() or has_school_role(p.school_id, array['admin', 'administrativo']))
  );
end;
$$;

-- «Todo el colegio», «Primaria 6» o «Primaria 6A».
create or replace function feed_audience_label(p_audience feed_audience, p_level enrollment_level, p_grade text, p_class_group_id uuid)
returns text
language plpgsql stable security definer
set search_path = public
as $$
begin
  if p_audience = 'school' then
    return 'Todo el colegio';
  elsif p_audience = 'grade' then
    return initcap(p_level::text) || ' ' || p_grade;
  end if;
  return coalesce((select initcap(cg.level::text) || ' ' || cg.grade || cg.section from class_groups cg where cg.id = p_class_group_id), 'Una sección');
end;
$$;

-- ----------------------------------------------------------------------------
-- Integridad
-- ----------------------------------------------------------------------------

-- El autor lo pone la base de datos, no la app. Después de publicar no cambian
-- el autor, el colegio ni la audiencia; fijar es solo para la administración.
create or replace function set_feed_post_author()
returns trigger
language plpgsql security definer
set search_path = public
as $$
declare
  v_identity record;
begin
  if tg_op = 'UPDATE' then
    if new.school_id <> old.school_id or new.author_user_id is distinct from old.author_user_id
       or new.author_name <> old.author_name or new.author_role <> old.author_role
       or new.audience <> old.audience or new.level is distinct from old.level
       or new.grade is distinct from old.grade or new.class_group_id is distinct from old.class_group_id
       or new.created_at <> old.created_at then
      -- El borrado en cascada de un usuario pone author_user_id en null: eso sí se permite.
      if not (new.author_user_id is null and auth.uid() is null) then
        raise exception 'No se puede cambiar el autor ni la audiencia de una publicación.';
      end if;
    end if;
    if new.pinned_at is distinct from old.pinned_at
       and not (is_platform_staff() or has_school_role(new.school_id, array['admin', 'administrativo'])) then
      raise exception 'Solo la administración puede fijar publicaciones.';
    end if;
    return new;
  end if;

  select * into v_identity from feed_identity(new.school_id);
  if v_identity.role is null then
    raise exception 'No perteneces a este colegio.';
  end if;
  new.author_user_id := auth.uid();
  new.author_name := v_identity.name;
  new.author_role := v_identity.role;
  if new.audience = 'section' and not exists (select 1 from class_groups cg where cg.id = new.class_group_id and cg.school_id = new.school_id) then
    raise exception 'La sección no es de este colegio.';
  end if;
  if new.pinned_at is not null and not (is_platform_staff() or has_school_role(new.school_id, array['admin', 'administrativo'])) then
    new.pinned_at := null;
  end if;
  return new;
end;
$$;

create trigger trg_feed_posts_author
  before insert or update on feed_posts
  for each row execute function set_feed_post_author();

-- Imágenes y reacciones heredan el colegio de su publicación.
create or replace function set_feed_post_child()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  select p.school_id into new.school_id from feed_posts p where p.id = new.post_id;
  if new.school_id is null then
    raise exception 'La publicación no existe.';
  end if;
  -- En dos pasos: new.path solo existe en feed_post_images.
  if tg_table_name = 'feed_post_images' then
    if new.path not like new.school_id::text || '/' || new.post_id::text || '/%' then
      raise exception 'La ruta de la imagen no corresponde a la publicación.';
    end if;
  end if;
  return new;
end;
$$;

create trigger trg_feed_post_images_child before insert or update on feed_post_images
  for each row execute function set_feed_post_child();
create trigger trg_feed_post_reactions_child before insert or update on feed_post_reactions
  for each row execute function set_feed_post_child();

-- Comentarios: autor puesto por la base, reglas de respuesta y filtro de groserías.
create or replace function check_feed_comment()
returns trigger
language plpgsql security definer
set search_path = public
as $$
declare
  v_post     feed_posts%rowtype;
  v_parent   feed_comments%rowtype;
  v_identity record;
begin
  select * into v_post from feed_posts where id = new.post_id;
  if not found then
    raise exception 'La publicación no existe.';
  end if;
  if not v_post.comments_enabled then
    raise exception 'Los comentarios de esta publicación están desactivados.';
  end if;

  select * into v_identity from feed_identity(v_post.school_id);
  if v_identity.role is null then
    raise exception 'No perteneces a este colegio.';
  end if;
  new.school_id := v_post.school_id;
  new.user_id := auth.uid();
  new.author_name := v_identity.name;
  new.author_role := v_identity.role;
  new.body := btrim(new.body);

  if new.parent_id is not null then
    select * into v_parent from feed_comments where id = new.parent_id;
    if not found or v_parent.post_id <> new.post_id then
      raise exception 'El comentario al que respondes ya no existe.';
    end if;
    -- En esta versión alumnos y apoderados no conversan entre ellos.
    if v_identity.role not in ('admin', 'administrativo', 'docente') then
      raise exception 'Solo el personal del colegio puede responder comentarios.';
    end if;
    -- Un solo nivel: la respuesta a una respuesta cuelga del comentario principal.
    new.parent_id := coalesce(v_parent.parent_id, v_parent.id);
  end if;

  if feed_has_blocked_word(v_post.school_id, new.body) then
    raise exception 'Tu comentario tiene palabras que no están permitidas. Escríbelo con respeto.';
  end if;
  return new;
end;
$$;

create trigger trg_feed_comments_check before insert on feed_comments
  for each row execute function check_feed_comment();

create or replace function set_feed_comment_like()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  select c.school_id into new.school_id from feed_comments c where c.id = new.comment_id;
  if new.school_id is null then
    raise exception 'El comentario no existe.';
  end if;
  return new;
end;
$$;

create trigger trg_feed_comment_likes_child before insert on feed_comment_likes
  for each row execute function set_feed_comment_like();

-- ----------------------------------------------------------------------------
-- Lectura del muro. security invoker: las filas pasan por RLS, así que cada
-- quien recibe solo las publicaciones de su audiencia. Los totales se cuentan
-- aquí (regla 2).
-- ----------------------------------------------------------------------------
create or replace function feed_page(p_school_id uuid, p_offset int default 0, p_limit int default 10)
returns jsonb
language plpgsql stable security invoker
set search_path = public
as $$
begin
  return coalesce((
    select jsonb_agg(to_jsonb(x) order by x.pinned desc, x.created_at desc)
    from (
      select p.id, p.author_user_id, p.author_name, p.author_role, p.body, p.youtube_id,
             p.audience, feed_audience_label(p.audience, p.level, p.grade, p.class_group_id) as audience_label,
             p.comments_enabled, (p.pinned_at is not null) as pinned, p.created_at,
             coalesce((select jsonb_agg(i.path order by i.position, i.created_at) from feed_post_images i where i.post_id = p.id), '[]'::jsonb) as images,
             coalesce((select jsonb_object_agg(r.reaction, r.n) from (select reaction, count(*) as n from feed_post_reactions where post_id = p.id group by reaction) r), '{}'::jsonb) as reactions,
             (select r.reaction from feed_post_reactions r where r.post_id = p.id and r.user_id = auth.uid()) as my_reaction,
             (select count(*) from feed_comments c where c.post_id = p.id) as comment_count
      from feed_posts p
      where p.school_id = p_school_id
      order by (p.pinned_at is not null) desc, p.created_at desc
      offset greatest(p_offset, 0) limit least(greatest(p_limit, 1), 50)
    ) x
  ), '[]'::jsonb);
end;
$$;

create or replace function feed_post_comments(p_post_id uuid)
returns jsonb
language plpgsql stable security invoker
set search_path = public
as $$
begin
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', c.id, 'parent_id', c.parent_id, 'user_id', c.user_id,
      'author_name', c.author_name, 'author_role', c.author_role,
      'body', c.body, 'created_at', c.created_at,
      'likes', (select count(*) from feed_comment_likes l where l.comment_id = c.id),
      'liked', exists (select 1 from feed_comment_likes l where l.comment_id = c.id and l.user_id = auth.uid())
    ) order by c.created_at)
    from feed_comments c
    where c.post_id = p_post_id
  ), '[]'::jsonb);
end;
$$;

revoke execute on function feed_page(uuid, int, int), feed_post_comments(uuid), feed_identity(uuid) from public, anon;
grant execute on function feed_page(uuid, int, int), feed_post_comments(uuid), feed_identity(uuid) to authenticated;

-- ----------------------------------------------------------------------------
-- Lista general de palabras no permitidas (castellano del Perú e inglés).
-- ----------------------------------------------------------------------------
insert into feed_blocked_words (word, match_inside) values
  ('mierd', true), ('conchatumadre', true), ('conchasumadre', true), ('chuchatumadre', true),
  ('hijodeputa', true), ('hijadeputa', true), ('putamadre', true), ('pendej', true), ('cojud', true),
  ('huevon', true), ('maricon', true), ('caraj', true), ('imbecil', true), ('estupid', true),
  ('idiota', true), ('malparid', true), ('motherfucker', true), ('asshole', true),
  ('puta', false), ('puto', false), ('putas', false), ('putos', false), ('putita', false),
  ('mrd', false), ('ctm', false), ('csm', false), ('ctmr', false), ('hdp', false),
  ('webon', false), ('weon', false), ('guevon', false), ('huevona', false), ('webona', false),
  ('cabron', false), ('cabrona', false), ('marica', false), ('maricones', false), ('cachudo', false),
  ('pinga', false), ('verga', false), ('culo', false), ('culero', false), ('chucha', false),
  ('tarado', false), ('tarada', false), ('mongol', false), ('mongolo', false),
  ('pajero', false), ('pajera', false), ('joder', false), ('jodete', false), ('jodido', false), ('jodida', false),
  ('cagada', false), ('cagon', false), ('cagona', false), ('cagar', false), ('cagaste', false),
  ('fuck', false), ('fucking', false), ('shit', false), ('bitch', false), ('nigga', false), ('nigger', false);
