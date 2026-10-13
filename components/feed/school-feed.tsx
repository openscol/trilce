import { createClient } from "@/lib/supabase/server";
import type { AppContext } from "@/lib/auth/context";
import { feedViewer, loadAudienceOptions, loadFeedPage } from "@/lib/feed-server";
import { Feed } from "./feed";

// El muro del colegio, para cualquier rol. Se muestra en el dashboard.
export async function SchoolFeed({ ctx }: { ctx: AppContext }) {
  const viewer = feedViewer(ctx);
  if (!viewer) return null;
  const supabase = await createClient();
  const [posts, audiences] = await Promise.all([loadFeedPage(supabase, viewer.schoolId), viewer.canPublish ? loadAudienceOptions(supabase, ctx) : null]);
  // La clave cambia cuando cambia lo publicado (nueva, editada, fijada, borrada):
  // así el muro vuelve a partir de los datos del servidor.
  const key = posts.map((p) => `${p.id}:${p.pinned}:${p.comments_enabled}:${p.body.length}`).join("|");
  return <Feed key={key} initial={posts} viewer={viewer} audiences={audiences} />;
}
