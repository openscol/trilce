// Exámenes en línea: tipos y utilidades compartidas entre el servidor y el navegador.
import type { Database } from "@/lib/supabase/database.types";

export type ExamTimeMode = Database["public"]["Enums"]["exam_time_mode"];

export const MIN_OPTIONS = 2;
export const MAX_OPTIONS = 8;
export const DEFAULT_OPTIONS = 4;
export const MAX_ONLINE_QUESTIONS = 100;
export const OPTION_LETTERS = "ABCDEFGH";

// Una pregunta tal como la edita el docente. `correct` es el índice de la alternativa correcta.
export type QuestionDraft = {
  title: string;
  image_path: string | null;
  options: string[];
  correct: number | null;
  points: number;
};

export const blankQuestion = (): QuestionDraft => ({ title: "", image_path: null, options: Array.from({ length: DEFAULT_OPTIONS }, () => ""), correct: null, points: 1 });

// Lo que devuelve online_exam_state(): nunca incluye la respuesta correcta.
export type TakingQuestion = {
  number: number;
  order: number;
  title: string;
  image_path: string | null;
  image_url?: string | null;
  points: number;
  answer: string | null;
  options: { key: string; text: string }[];
};

type ExamStateBase = {
  exam_id: string;
  title: string;
  subject: string | null;
  total: number;
  max_score: number;
  time_mode: ExamTimeMode;
  time_limit_seconds: number | null;
  opens_at: string | null;
  closes_at: string | null;
  server_now: string;
};

export type ExamState =
  | (ExamStateBase & { status: "not_started"; open: boolean })
  | (ExamStateBase & { status: "in_progress"; deadline: string; position: number; questions: TakingQuestion[] })
  | (ExamStateBase & { status: "submitted"; score: number | null; correct_count: number | null; published: boolean });

// «10 min», «1 min 30 s», «45 s».
export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return [m ? `${m} min` : "", s ? `${s} s` : ""].filter(Boolean).join(" ") || "0 s";
}

// Reloj en cuenta regresiva: «09:41», o «1:02:03» si pasa de una hora.
export function formatClock(seconds: number) {
  const total = Math.max(0, Math.ceil(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

// El colegio trabaja en hora del Perú (UTC−5, sin horario de verano).
const LIMA_OFFSET = "-05:00";

// Valor de un <input type="datetime-local"> (hora de Lima) → instante ISO.
export function limaInputToIso(value: string | null): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) return null;
  const date = new Date(`${value.slice(0, 16)}:00${LIMA_OFFSET}`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

// Instante ISO → valor para <input type="datetime-local">, en hora de Lima.
export function isoToLimaInput(iso: string | null): string {
  if (!iso) return "";
  return new Date(new Date(iso).getTime() - 5 * 3600 * 1000).toISOString().slice(0, 16);
}

// «9 oct, 10:30» en hora de Lima.
export function formatLima(iso: string | null) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("es-PE", { timeZone: "America/Lima", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));
}

export type OnlineWindow = "draft" | "scheduled" | "open" | "closed";

export function windowStatus(opensAt: string | null, closesAt: string | null, now = Date.now()): OnlineWindow {
  if (!opensAt) return "draft";
  if (closesAt && new Date(closesAt).getTime() <= now) return "closed";
  if (new Date(opensAt).getTime() > now) return "scheduled";
  return "open";
}

export const WINDOW_LABEL: Record<OnlineWindow, string> = { draft: "Sin abrir", scheduled: "Programado", open: "Abierto", closed: "Cerrado" };
