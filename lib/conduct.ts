// Registro de faltas: tipos y utilidades compartidas entre el servidor y el navegador.
import type { Database } from "@/lib/supabase/database.types";

export type ConductKind = Database["public"]["Enums"]["conduct_kind"];

export const CONDUCT_KINDS: ConductKind[] = ["falta", "registro", "permiso"];

export const CONDUCT_KIND_LABELS: Record<ConductKind, string> = {
  falta: "Falta (cuenta para la ficha)",
  registro: "Solo registro",
  permiso: "Permiso (uno al día)",
};

export const DEFAULT_FALTAS_PER_SHEET = 3;

export type ConductNorm = { id: string; description: string; active: boolean; position: number };

export type ConductCategory = { id: string; name: string; kind: ConductKind; position: number; norms: ConductNorm[] };

// Un registro ya cargado, con lo necesario para mostrarlo.
export type ConductEntry = {
  id: string;
  student_id: string;
  date: string;
  created_at: string;
  note: string | null;
  sheet_id: string | null;
  norm: string;
  category: string;
  kind: ConductKind;
  recorded_by: string | null;
};

// «14:05», en hora del Perú.
export const timeOfDay = (iso: string) => new Intl.DateTimeFormat("es-PE", { timeZone: "America/Lima", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));

// «sáb. 25 oct. 2026»
export const shortDate = (iso: string) => new Intl.DateTimeFormat("es-PE", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(new Date(`${iso}T00:00:00Z`));

// Número del acta y de la ficha: «001-2026».
export const sheetCode = (number: number, date: string) => `${String(number).padStart(3, "0")}-${date.slice(0, 4)}`;

// «25/10/2026 10:15 a. m.», en hora del Perú.
export const dateTime = (iso: string) =>
  new Intl.DateTimeFormat("es-PE", { timeZone: "America/Lima", day: "2-digit", month: "2-digit", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(iso));
