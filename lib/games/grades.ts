// Grados en los que se organizan los juegos de cada categoría. Fijos: siguen
// la estructura del sistema educativo (no se editan desde la app).
export type GradeKey = "i5" | "p1" | "p2" | "p3" | "p4" | "p5" | "p6" | "s1" | "s2" | "s3" | "s4" | "s5" | "a1" | "a2" | "ge" | "pc";

export type Grade = {
  key: GradeKey;
  level: "inicial" | "primaria" | "secundaria" | "algebra" | "geometria" | "precalculo";
  // Texto corto de la tarjeta del grado: "5 años", "3.°".
  short: string;
  number: number;
  label: string;
};

const ORDINAL = ["", "1.°", "2.°", "3.°", "4.°", "5.°", "6.°"];

export const LEVELS = [
  { key: "inicial", name: "Inicial" },
  { key: "primaria", name: "Primaria" },
  { key: "secundaria", name: "Secundaria" },
  // Cursos que no son un grado escolar (como Álgebra 1 de IXL): el bloque solo
  // aparece en las categorías que tienen juegos para él.
  { key: "algebra", name: "Álgebra", extra: true },
  { key: "geometria", name: "Geometría", extra: true },
  { key: "precalculo", name: "Precálculo", extra: true },
] as const;

export const GRADES: Grade[] = [
  { key: "i5", level: "inicial", number: 5, short: "5 años", label: "Inicial 5 años" },
  ...[1, 2, 3, 4, 5, 6].map((n) => ({
    key: `p${n}` as GradeKey,
    level: "primaria" as const,
    number: n,
    short: ORDINAL[n],
    label: `${ORDINAL[n]} de Primaria`,
  })),
  ...[1, 2, 3, 4, 5].map((n) => ({
    key: `s${n}` as GradeKey,
    level: "secundaria" as const,
    number: n,
    short: ORDINAL[n],
    label: `${ORDINAL[n]} de Secundaria`,
  })),
  { key: "a1", level: "algebra", number: 1, short: "Álgebra 1", label: "Álgebra 1" },
  { key: "a2", level: "algebra", number: 2, short: "Álgebra 2", label: "Álgebra 2" },
  { key: "ge", level: "geometria", number: 1, short: "Geometría", label: "Geometría" },
  { key: "pc", level: "precalculo", number: 1, short: "Precálculo", label: "Precálculo" },
];

export function getGrade(key: string) {
  return GRADES.find((g) => g.key === key);
}

// Grado de un alumno (students.level + students.grade) → clave de juegos.
export function gradeKeyFor(level: string | null, grade: string | null): GradeKey | undefined {
  if (!grade || (level !== "inicial" && level !== "primaria" && level !== "secundaria")) return undefined;
  // En inicial el grado puede venir como "5" o "5 años".
  const n = grade.trim().match(/\d+/)?.[0];
  return GRADES.find((g) => g.level === level && String(g.number) === n)?.key;
}
