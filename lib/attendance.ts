import type { Database } from "@/lib/supabase/database.types";

export type AttendanceStatus = Database["public"]["Enums"]["attendance_status"];

export const ATTENDANCE_STATUSES: AttendanceStatus[] = ["presente", "tardanza", "tardanza_justificada", "falta", "falta_justificada"];

export const ATTENDANCE_LABELS: Record<AttendanceStatus, string> = {
  presente: "Presente",
  tardanza: "Tardanza",
  tardanza_justificada: "Tardanza justificada",
  falta: "Falta",
  falta_justificada: "Falta justificada",
};

// Letras del registro mensual de asistencia del SIAGIE. Están en un solo lugar
// para ajustarlas si la plantilla oficial del colegio usa otras.
export const SIAGIE_CODES: Record<AttendanceStatus, string> = {
  presente: "A",
  tardanza: "T",
  tardanza_justificada: "U",
  falta: "F",
  falta_justificada: "J",
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_RE = /^\d{4}-\d{2}$/;

// Hoy en hora del Perú, como YYYY-MM-DD (igual que school_today() en la base).
export function todayInLima() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Lima" }).format(new Date());
}

export function parseDateParam(value: string | string[] | undefined) {
  const v = Array.isArray(value) ? value[0] : value;
  return v && DATE_RE.test(v) && !Number.isNaN(Date.parse(v)) ? v : todayInLima();
}

export function parseMonthParam(value: string | string[] | undefined) {
  const v = Array.isArray(value) ? value[0] : value;
  return v && MONTH_RE.test(v) && Number(v.slice(5)) >= 1 && Number(v.slice(5)) <= 12 ? v : todayInLima().slice(0, 7);
}

// Días de un mes "YYYY-MM": fecha ISO, número de día y si cae sábado o domingo.
export function monthDays(month: string) {
  const [year, m] = month.split("-").map(Number);
  const count = new Date(Date.UTC(year, m, 0)).getUTCDate();
  return Array.from({ length: count }, (_, i) => {
    const day = i + 1;
    const weekday = new Date(Date.UTC(year, m - 1, day)).getUTCDay();
    return { iso: `${month}-${String(day).padStart(2, "0")}`, day, weekend: weekday === 0 || weekday === 6 };
  });
}

const MONTH_NAMES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export function monthLabel(month: string) {
  const [year, m] = month.split("-").map(Number);
  return `${MONTH_NAMES[m - 1]} de ${year}`;
}

export function longDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
}

export type RosterStudent = Database["public"]["Functions"]["attendance_roster"]["Returns"][number];

export function studentName(s: { paternal_surname: string; maternal_surname: string | null; first_names: string }) {
  return `${s.paternal_surname} ${s.maternal_surname ?? ""}`.trim() + `, ${s.first_names}`;
}

export type Tally = Record<AttendanceStatus, number>;
export function tally(statuses: AttendanceStatus[]): Tally {
  const out: Tally = { presente: 0, tardanza: 0, tardanza_justificada: 0, falta: 0, falta_justificada: 0 };
  for (const s of statuses) out[s]++;
  return out;
}
