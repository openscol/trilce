import "server-only";
import type { createClient } from "@/lib/supabase/server";
import type { AppContext } from "@/lib/auth/context";
import { LEVEL_LABELS } from "@/lib/enum-labels";
import { FEED_PAGE_SIZE, timeAgo, type AudienceOptions, type FeedComment, type FeedPost, type FeedViewer } from "@/lib/feed";

type Supabase = Awaited<ReturnType<typeof createClient>>;
type RawPost = Omit<FeedPost, "images" | "ago"> & { images: string[] };

const STAFF = ["admin", "administrativo", "docente"];

export function feedViewer(ctx: AppContext): FeedViewer | null {
  if (!ctx.schoolId) return null;
  const isAdmin = ctx.role === "admin" || ctx.role === "administrativo";
  const isStaff = STAFF.includes(ctx.role ?? "");
  return { userId: ctx.userId, schoolId: ctx.schoolId, isStaff, isAdmin, canPublish: isStaff };
}

// Una página del muro. RLS ya dejó solo lo que este usuario puede ver; aquí se
// agregan los enlaces temporales de las imágenes (bucket privado).
export async function loadFeedPage(supabase: Supabase, schoolId: string, offset = 0): Promise<FeedPost[]> {
  const { data } = await supabase.rpc("feed_page", { p_school_id: schoolId, p_offset: offset, p_limit: FEED_PAGE_SIZE });
  const posts = (data ?? []) as unknown as RawPost[];
  const paths = posts.flatMap((p) => p.images);
  const { data: signed } = paths.length ? await supabase.storage.from("feed").createSignedUrls(paths, 6 * 3600) : { data: [] };
  const urlOf = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));
  const now = Date.now();
  return posts.map((p) => ({
    ...p,
    ago: timeAgo(p.created_at, now),
    images: p.images.flatMap((path) => (urlOf.get(path) ? [{ path, url: urlOf.get(path)! }] : [])),
  }));
}

export async function loadComments(supabase: Supabase, postId: string): Promise<FeedComment[]> {
  const { data } = await supabase.rpc("feed_post_comments", { p_post_id: postId });
  const now = Date.now();
  return ((data ?? []) as unknown as Omit<FeedComment, "ago">[]).map((c) => ({ ...c, ago: timeAgo(c.created_at, now) }));
}

// A quién puede publicar este usuario. Es un filtro de pantalla: el permiso
// real lo decide can_publish_feed() en la base de datos, con la misma regla.
export async function loadAudienceOptions(supabase: Supabase, ctx: AppContext): Promise<AudienceOptions> {
  const isAdmin = ctx.role === "admin" || ctx.role === "administrativo";
  const { data: all } = await supabase
    .from("class_groups")
    .select("id, academic_year, level, grade, section")
    .eq("school_id", ctx.schoolId ?? "")
    .order("academic_year", { ascending: false })
    .order("level")
    .order("grade")
    .order("section");
  // Solo las secciones del año más reciente.
  const year = all?.[0]?.academic_year;
  let groups = (all ?? []).filter((g) => g.academic_year === year);

  if (!isAdmin) {
    const [{ data: offerings }, { data: assigned }] = await Promise.all([
      supabase.from("course_offerings").select("class_group_id").eq("teacher_id", ctx.targetId ?? ""),
      supabase.from("staff_assigned_sections").select("level, grade, section").eq("staff_id", ctx.targetId ?? ""),
    ]);
    const taught = new Set((offerings ?? []).map((o) => o.class_group_id));
    groups = groups.filter((g) => taught.has(g.id) || (assigned ?? []).some((a) => a.level === g.level && a.grade === g.grade && (a.section === null || a.section === g.section)));
  }

  const grades = new Map<string, AudienceOptions["grades"][number]>();
  for (const g of groups) grades.set(`${g.level}|${g.grade}`, { level: g.level, grade: g.grade, label: `${LEVEL_LABELS[g.level]} ${g.grade}` });
  return {
    school: isAdmin,
    grades: [...grades.values()],
    sections: groups.map((g) => ({ id: g.id, label: `${LEVEL_LABELS[g.level]} ${g.grade}${g.section}` })),
  };
}
