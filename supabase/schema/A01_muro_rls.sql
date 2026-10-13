-- ============================================================================
-- A01. RLS del muro. Las políticas se apoyan en las funciones security definer
-- de A00 (can_see_feed_audience, can_publish_feed, feed_post_visible,
-- can_moderate_feed_post) para no encadenar una política con otra.
-- ============================================================================

alter table feed_posts enable row level security;
alter table feed_post_images enable row level security;
alter table feed_post_reactions enable row level security;
alter table feed_comments enable row level security;
alter table feed_comment_likes enable row level security;
alter table feed_blocked_words enable row level security;

-- feed_posts -----------------------------------------------------------------
-- Las políticas leen las columnas de la propia fila (no feed_post_visible):
-- dentro de un INSERT ... RETURNING la fila nueva aún no es visible para una
-- función que la vuelva a buscar (mismo caso que exams en la migración 93).
create policy "feed_posts_select" on feed_posts for select
  using (can_see_feed_audience(school_id, audience, level, grade, class_group_id));
create policy "feed_posts_insert" on feed_posts for insert
  with check (can_publish_feed(school_id, audience, level, grade, class_group_id));
create policy "feed_posts_update" on feed_posts for update
  using (author_user_id = auth.uid() or has_school_role(school_id, array['admin', 'administrativo']))
  with check (has_school_access(school_id));
create policy "feed_posts_delete" on feed_posts for delete
  using (author_user_id = auth.uid() or has_school_role(school_id, array['admin', 'administrativo']));

-- feed_post_images -----------------------------------------------------------
create policy "feed_post_images_select" on feed_post_images for select
  using (feed_post_visible(post_id));
create policy "feed_post_images_insert" on feed_post_images for insert
  with check (can_moderate_feed_post(post_id));
create policy "feed_post_images_delete" on feed_post_images for delete
  using (can_moderate_feed_post(post_id));

-- feed_post_reactions --------------------------------------------------------
create policy "feed_post_reactions_select" on feed_post_reactions for select
  using (feed_post_visible(post_id));
create policy "feed_post_reactions_insert" on feed_post_reactions for insert
  with check (user_id = auth.uid() and feed_post_visible(post_id));
create policy "feed_post_reactions_update" on feed_post_reactions for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and feed_post_visible(post_id));
create policy "feed_post_reactions_delete" on feed_post_reactions for delete
  using (user_id = auth.uid());

-- feed_comments --------------------------------------------------------------
-- Borra un comentario quien lo escribió, el autor de la publicación o la
-- administración. No hay UPDATE: un comentario no se edita (el filtro de
-- groserías solo corre al insertar).
create policy "feed_comments_select" on feed_comments for select
  using (feed_post_visible(post_id));
create policy "feed_comments_insert" on feed_comments for insert
  with check (feed_post_visible(post_id));
create policy "feed_comments_delete" on feed_comments for delete
  using (user_id = auth.uid() or can_moderate_feed_post(post_id));

-- feed_comment_likes ---------------------------------------------------------
create or replace function feed_comment_visible(p_comment_id uuid)
returns boolean
language plpgsql stable security definer
set search_path = public
as $$
begin
  return exists (select 1 from feed_comments c where c.id = p_comment_id and feed_post_visible(c.post_id));
end;
$$;

create policy "feed_comment_likes_select" on feed_comment_likes for select
  using (feed_comment_visible(comment_id));
create policy "feed_comment_likes_insert" on feed_comment_likes for insert
  with check (user_id = auth.uid() and feed_comment_visible(comment_id));
create policy "feed_comment_likes_delete" on feed_comment_likes for delete
  using (user_id = auth.uid());

-- feed_blocked_words ---------------------------------------------------------
-- La lista no se muestra a alumnos ni apoderados. La administración gestiona
-- las palabras de su colegio; la lista general es de la plataforma.
create policy "feed_blocked_words_select" on feed_blocked_words for select
  using (is_platform_staff() or (school_id is not null and has_school_role(school_id, array['admin', 'administrativo'])));
create policy "feed_blocked_words_insert" on feed_blocked_words for insert
  with check (is_platform_staff() or (school_id is not null and has_school_role(school_id, array['admin', 'administrativo'])));
create policy "feed_blocked_words_delete" on feed_blocked_words for delete
  using (is_platform_staff() or (school_id is not null and has_school_role(school_id, array['admin', 'administrativo'])));

-- ----------------------------------------------------------------------------
-- Bucket privado de imágenes: {school_id}/{post_id}/{archivo}.jpg
-- Las imágenes se reducen a JPEG en el navegador antes de subir.
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('feed', 'feed', false, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create or replace function feed_school_of_path(path text)
returns uuid
language plpgsql immutable
set search_path = public
as $$
begin
  return (split_part(path, '/', 1))::uuid;
exception when others then
  return null;
end;
$$;

-- ¿La imagen es de una publicación que el usuario puede ver?
create or replace function can_view_feed_image(target_path text)
returns boolean
language plpgsql stable security definer
set search_path = public
as $$
begin
  return exists (select 1 from feed_post_images i where i.path = target_path and feed_post_visible(i.post_id));
end;
$$;

-- Sube quien puede publicar en ese colegio (la imagen se sube antes de crear
-- la publicación); la ve quien ve la publicación.
create policy "feed_images_select" on storage.objects for select
  using (bucket_id = 'feed' and (can_view_feed_image(name) or has_school_role(feed_school_of_path(name), array['admin', 'administrativo', 'docente'])));
create policy "feed_images_insert" on storage.objects for insert
  with check (bucket_id = 'feed' and has_school_role(feed_school_of_path(name), array['admin', 'administrativo', 'docente']));
create policy "feed_images_delete" on storage.objects for delete
  using (bucket_id = 'feed' and has_school_role(feed_school_of_path(name), array['admin', 'administrativo', 'docente']));
