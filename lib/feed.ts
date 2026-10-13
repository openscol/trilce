// Muro del colegio: tipos y utilidades compartidas entre el servidor y el navegador.
import type { Database } from "@/lib/supabase/database.types";

export type FeedReaction = Database["public"]["Enums"]["feed_reaction"];
export type FeedAudience = Database["public"]["Enums"]["feed_audience"];
type Role = Database["public"]["Enums"]["membership_role"];

export const REACTIONS: { key: FeedReaction; emoji: string; label: string }[] = [
  { key: "like", emoji: "👍", label: "Me gusta" },
  { key: "love", emoji: "❤️", label: "Me encanta" },
  { key: "haha", emoji: "😆", label: "Me divierte" },
  { key: "wow", emoji: "😮", label: "Me asombra" },
  { key: "sad", emoji: "😢", label: "Me entristece" },
  { key: "angry", emoji: "😡", label: "Me enoja" },
];

export const ROLE_LABEL: Record<Role, string> = { admin: "Administración", administrativo: "Administración", docente: "Docente", padre: "Apoderado", alumno: "Alumno" };

export const MAX_POST_IMAGES = 10;
export const MAX_POST_LENGTH = 5000;
export const MAX_COMMENT_LENGTH = 1000;
export const FEED_PAGE_SIZE = 10;

export type FeedPost = {
  id: string;
  author_user_id: string | null;
  author_name: string;
  author_role: Role;
  body: string;
  youtube_id: string | null;
  audience: FeedAudience;
  audience_label: string;
  comments_enabled: boolean;
  pinned: boolean;
  created_at: string;
  // «10 h», calculado en el servidor al cargar.
  ago: string;
  images: { path: string; url: string }[];
  reactions: Partial<Record<FeedReaction, number>>;
  my_reaction: FeedReaction | null;
  comment_count: number;
};

export type FeedComment = {
  id: string;
  parent_id: string | null;
  user_id: string | null;
  author_name: string;
  author_role: Role;
  body: string;
  created_at: string;
  ago: string;
  likes: number;
  liked: boolean;
};

// Quién está mirando el muro y qué puede hacer.
export type FeedViewer = {
  userId: string;
  schoolId: string;
  isStaff: boolean; // puede responder comentarios
  isAdmin: boolean; // modera todo y puede fijar
  canPublish: boolean;
};

// A quién puede dirigir una publicación quien publica.
export type AudienceOptions = {
  school: boolean;
  grades: { level: Database["public"]["Enums"]["enrollment_level"]; grade: string; label: string }[];
  sections: { id: string; label: string }[];
};

// «ahora», «5 min», «10 h», «3 d»; después de una semana, la fecha.
export function timeAgo(iso: string, now: number) {
  const then = new Date(iso).getTime();
  const seconds = Math.max(0, Math.floor((now - then) / 1000));
  if (seconds < 60) return "ahora";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h`;
  if (seconds < 7 * 86400) return `${Math.floor(seconds / 86400)} d`;
  const sameYear = new Date(now).getFullYear() === new Date(then).getFullYear();
  return new Intl.DateTimeFormat("es-PE", { timeZone: "America/Lima", day: "numeric", month: "short", ...(sameYear ? {} : { year: "numeric" }) }).format(new Date(then));
}

// Acepta los enlaces habituales de YouTube (watch, youtu.be, shorts, embed, live) o el id solo.
export function parseYouTubeId(input: string): string | null {
  const text = input.trim();
  if (!text) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(text)) return text;
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.|music\.)/, "");
  let id: string | null = null;
  if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0];
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") id = url.searchParams.get("v");
    else id = url.pathname.match(/^\/(?:shorts|embed|live|v)\/([^/?]+)/)?.[1] ?? null;
  }
  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}

export const totalReactions = (reactions: FeedPost["reactions"]) => Object.values(reactions).reduce((sum, n) => sum + (n ?? 0), 0);
