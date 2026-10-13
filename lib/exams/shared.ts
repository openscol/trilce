import { TRILCE_20_LAYOUT, TRILCE_LAYOUT, questionCapacity, type SheetLayout } from "./omr";

// Plantillas de ficha que el lector conoce. La clave se guarda en exams.sheet_layout.
export const SHEET_LAYOUTS: Record<string, { name: string; layout: SheetLayout }> = {
  trilce_10: { name: "Ficha Trilce: código de 8 dígitos, tipo A/B, 10 preguntas", layout: TRILCE_LAYOUT },
  trilce_20: { name: "Ficha Trilce: código de 8 dígitos, tipo A/B, 20 preguntas", layout: TRILCE_20_LAYOUT },
};
export const DEFAULT_LAYOUT = "trilce_10";
export const MAX_QUESTIONS = Math.max(...Object.values(SHEET_LAYOUTS).map((s) => questionCapacity(s.layout)));
// Sin ficha (registro manual) no hay plantilla que limite las preguntas.
export const MAX_MANUAL_QUESTIONS = 50;

// La ficha que corresponde a un examen: la más pequeña en la que caben sus
// preguntas (hasta 10, la ficha de 10; de 11 a 20, la de 20).
export function layoutForQuestions(count: number): string | null {
  const fits = Object.entries(SHEET_LAYOUTS)
    .filter(([, s]) => questionCapacity(s.layout) >= count)
    .sort((a, b) => questionCapacity(a[1].layout) - questionCapacity(b[1].layout));
  return fits[0]?.[0] ?? null;
}

export const BLANK = "-";
export const MULTIPLE = "*";

export type StudentBrief = {
  id: string;
  code: string;
  document_number: string | null;
  name: string;
  group: string;
  class_group_id: string | null;
};

export function studentName(s: { paternal_surname: string; maternal_surname: string | null; first_names: string }) {
  return `${s.paternal_surname} ${s.maternal_surname ?? ""}, ${s.first_names}`.replace(/\s+,/, ",").replace(/\s+/g, " ").trim();
}

const digits = (value: string | null) => (value ?? "").replace(/\D/g, "");
const unpad = (value: string) => value.replace(/^0+/, "");

// Busca al alumno por el código marcado en la ficha: contra su código del
// colegio o su número de documento, ignorando ceros a la izquierda.
export function matchStudent(sheetCode: string, students: StudentBrief[]): StudentBrief | null {
  if (!sheetCode || sheetCode.includes("?")) return null;
  const target = unpad(digits(sheetCode));
  if (!target) return null;
  const hits = students.filter((s) => unpad(digits(s.code)) === target || unpad(digits(s.document_number)) === target);
  return hits.length === 1 ? hits[0] : null;
}

export type CodeMatch = {
  // Alumno al que se asigna la ficha sin preguntar: el código es suyo y rinde el examen.
  student: StudentBrief | null;
  // El código existe, pero es de un alumno que no rinde este examen: no se asigna.
  outsider: StudentBrief | null;
  // Alumnos del examen cuyo código o documento difiere en un solo dígito del marcado.
  suggestions: StudentBrief[];
};

// Decide a quién pertenece una ficha. Un código mal marcado puede coincidir
// con el de un alumno de otro grado (02050002 en vez de 03050002): por eso solo
// se asigna sola si el código es de un alumno de las secciones del examen. Si
// no, la ficha queda sin alumno y se proponen los alumnos del examen con un
// código o documento parecido.
export function resolveSheetCode(sheetCode: string, examStudents: StudentBrief[], allStudents: StudentBrief[], width: number): CodeMatch {
  const student = matchStudent(sheetCode, examStudents);
  if (student) return { student, outsider: null, suggestions: [] };

  const read = sheetCode.padStart(width, "0");
  const unknown = [...read].filter((c) => c === "?").length;
  const suggestions =
    !sheetCode || unknown > 2
      ? []
      : examStudents.filter((s) =>
          // El alumno puede haber marcado su código o su documento: se compara con los dos.
          [s.code, s.document_number].some((value) => {
            if (!digits(value)) return false;
            const code = digits(value).padStart(width, "0");
            if (code.length !== read.length) return false;
            let diff = 0;
            for (let i = 0; i < code.length; i++) if (read[i] !== "?" && read[i] !== code[i]) diff++;
            return diff <= (unknown ? 0 : 1);
          })
        );
  return { student: null, outsider: matchStudent(sheetCode, allStudents), suggestions };
}

// ¿El código leído en la ficha es el del alumno elegido?
export function codeBelongsTo(sheetCode: string, student: StudentBrief) {
  return matchStudent(sheetCode, [student]) !== null;
}

// Aciertos y nota de una ficha, igual que lo calcula la base de datos.
export function grade(answers: string, key: string | undefined, maxScore: number) {
  if (!key) return null;
  let correct = 0;
  let marks = "";
  for (let i = 0; i < key.length; i++) {
    const ok = answers[i] === key[i];
    marks += ok ? "1" : "0";
    if (ok) correct++;
  }
  return { correct, marks, score: Math.round((maxScore * correct * 100) / key.length) / 100 };
}

export function formatScore(score: number | null) {
  return score === null ? "—" : Number.isInteger(score) ? String(score) : score.toFixed(2).replace(/0$/, "");
}
