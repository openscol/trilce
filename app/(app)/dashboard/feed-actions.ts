"use server";

import { revalidatePath } from "next/cache";
import { requireAppContext } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { feedViewer, loadComments, loadFeedPage } from "@/lib/feed-server";
import { MAX_COMMENT_LENGTH, MAX_POST_IMAGES, MAX_POST_LENGTH, parseYouTubeId, type FeedAudience, type FeedComment, type FeedPost, type FeedReaction } from "@/lib/feed";
import type { Database } from "@/lib/supabase/database.types";

type Result = { error: string } | undefined;

// Los mensajes que lanza la base de datos (filtro de groserías, comentarios
// desactivados...) ya están escritos para el usuario; los técnicos no se muestran.
const dbMessage = (error: { message: string } | null, fallback: string) => (error?.message && !/violates|permission|row-level|syntax|JSON/i.test(error.message) ? error.message : fallback);

async function session() {
  const ctx = await requireAppContext();
  const viewer = feedViewer(ctx);
  return { viewer, supabase: await createClient() };
}

export type PostInput = {
  // El id lo genera el navegador: las imágenes se suben antes, a la carpeta de la publicación.
  id: string;
  body: string;
  youtubeUrl: string;
  imagePaths: string[];
  audience: FeedAudience;
  level: Database["public"]["Enums"]["enrollment_level"] | null;
  grade: string | null;
  classGroupId: string | null;
  commentsEnabled: boolean;
};

export async function createPost(input: PostInput): Promise<Result> {
  const { viewer, supabase } = await session();
  if (!viewer?.canPublish) return { error: "No tienes permiso para publicar." };
  if (!/^[0-9a-f-]{36}$/i.test(input.id)) return { error: "No se pudo publicar." };

  const body = input.body.trim();
  if (body.length > MAX_POST_LENGTH) return { error: `El texto no puede pasar de ${MAX_POST_LENGTH} caracteres.` };
  const youtube_id = input.youtubeUrl.trim() ? parseYouTubeId(input.youtubeUrl) : null;
  if (input.youtubeUrl.trim() && !youtube_id) return { error: "El enlace de YouTube no es válido. Copia el enlace del video tal como aparece en YouTube." };
  if (input.imagePaths.length > MAX_POST_IMAGES) return { error: `Máximo ${MAX_POST_IMAGES} imágenes por publicación.` };
  const folder = `${viewer.schoolId}/${input.id}/`;
  if (input.imagePaths.some((p) => !p.startsWith(folder))) return { error: "Una de las imágenes no es válida." };
  if (!body && !youtube_id && input.imagePaths.length === 0) return { error: "Escribe algo o agrega una imagen o un video." };

  const { error } = await supabase.from("feed_posts").insert({
    id: input.id,
    school_id: viewer.schoolId,
    body,
    youtube_id,
    audience: input.audience,
    level: input.audience === "grade" ? input.level : null,
    grade: input.audience === "grade" ? input.grade : null,
    class_group_id: input.audience === "section" ? input.classGroupId : null,
    comments_enabled: input.commentsEnabled,
  });
  if (error) return { error: dbMessage(error, "No puedes publicar para esa audiencia.") };

  if (input.imagePaths.length) {
    const { error: imageError } = await supabase.from("feed_post_images").insert(input.imagePaths.map((path, position) => ({ post_id: input.id, path, position })));
    if (imageError) {
      // Sin sus imágenes la publicación quedaría incompleta: se deshace.
      await supabase.from("feed_posts").delete().eq("id", input.id);
      return { error: "No se pudieron guardar las imágenes." };
    }
  }

  revalidatePath("/dashboard");
  return undefined;
}

export async function updatePost(postId: string, patch: { body?: string; pinned?: boolean; commentsEnabled?: boolean }): Promise<Result> {
  const { viewer, supabase } = await session();
  if (!viewer) return { error: "No tienes permiso." };

  const update: Database["public"]["Tables"]["feed_posts"]["Update"] = {};
  if (patch.body !== undefined) {
    const body = patch.body.trim();
    if (body.length > MAX_POST_LENGTH) return { error: `El texto no puede pasar de ${MAX_POST_LENGTH} caracteres.` };
    update.body = body;
  }
  if (patch.pinned !== undefined) update.pinned_at = patch.pinned ? new Date().toISOString() : null;
  if (patch.commentsEnabled !== undefined) update.comments_enabled = patch.commentsEnabled;

  // RLS deja editar al autor y a la administración; fijar, solo a la administración (trigger).
  const { data, error } = await supabase.from("feed_posts").update(update).eq("id", postId).select("id");
  if (error || !data?.length) return { error: dbMessage(error, "No se pudo guardar el cambio.") };

  revalidatePath("/dashboard");
  return undefined;
}

export async function deletePost(postId: string): Promise<Result> {
  const { viewer, supabase } = await session();
  if (!viewer) return { error: "No tienes permiso." };

  // Las imágenes no se borran en cascada con la fila: se quitan del almacenamiento.
  const { data: images } = await supabase.from("feed_post_images").select("path").eq("post_id", postId);
  const { data, error } = await supabase.from("feed_posts").delete().eq("id", postId).select("id");
  if (error || !data?.length) return { error: "No se pudo eliminar la publicación." };
  if (images?.length) await supabase.storage.from("feed").remove(images.map((i) => i.path));

  revalidatePath("/dashboard");
  return undefined;
}

// reaction null = quitar mi reacción.
export async function reactToPost(postId: string, reaction: FeedReaction | null): Promise<Result> {
  const { viewer, supabase } = await session();
  if (!viewer) return { error: "No tienes permiso." };
  const { error } = reaction
    ? await supabase.from("feed_post_reactions").upsert({ post_id: postId, user_id: viewer.userId, reaction })
    : await supabase.from("feed_post_reactions").delete().eq("post_id", postId).eq("user_id", viewer.userId);
  return error ? { error: "No se pudo guardar tu reacción." } : undefined;
}

export async function loadMorePosts(offset: number): Promise<FeedPost[]> {
  const { viewer, supabase } = await session();
  if (!viewer) return [];
  return loadFeedPage(supabase, viewer.schoolId, offset);
}

export async function fetchComments(postId: string): Promise<FeedComment[]> {
  const { viewer, supabase } = await session();
  if (!viewer) return [];
  return loadComments(supabase, postId);
}

// Devuelve la lista actualizada de comentarios de la publicación.
export async function addComment(postId: string, body: string, parentId: string | null): Promise<{ comments: FeedComment[] } | { error: string }> {
  const { viewer, supabase } = await session();
  if (!viewer) return { error: "No tienes permiso." };
  const text = body.trim();
  if (!text) return { error: "Escribe un comentario." };
  if (text.length > MAX_COMMENT_LENGTH) return { error: `El comentario no puede pasar de ${MAX_COMMENT_LENGTH} caracteres.` };
  if (parentId && !viewer.isStaff) return { error: "Solo el personal del colegio puede responder comentarios." };

  // El autor y el filtro de palabras los pone la base de datos (check_feed_comment).
  const { error } = await supabase.from("feed_comments").insert({ post_id: postId, parent_id: parentId, body: text });
  if (error) return { error: dbMessage(error, "No se pudo publicar el comentario.") };
  return { comments: await loadComments(supabase, postId) };
}

export async function deleteComment(commentId: string): Promise<Result> {
  const { viewer, supabase } = await session();
  if (!viewer) return { error: "No tienes permiso." };
  const { data, error } = await supabase.from("feed_comments").delete().eq("id", commentId).select("id");
  return error || !data?.length ? { error: "No se pudo eliminar el comentario." } : undefined;
}

export async function likeComment(commentId: string, liked: boolean): Promise<Result> {
  const { viewer, supabase } = await session();
  if (!viewer) return { error: "No tienes permiso." };
  const { error } = liked
    ? await supabase.from("feed_comment_likes").upsert({ comment_id: commentId, user_id: viewer.userId }, { ignoreDuplicates: true })
    : await supabase.from("feed_comment_likes").delete().eq("comment_id", commentId).eq("user_id", viewer.userId);
  return error ? { error: "No se pudo guardar tu «me gusta»." } : undefined;
}
