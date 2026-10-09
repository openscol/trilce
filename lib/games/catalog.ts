import { MATEMATICAS_P1 } from "./curricula/matematicas/p1";
import { MATEMATICAS_P2 } from "./curricula/matematicas/p2";
import { MATEMATICAS_P3 } from "./curricula/matematicas/p3";
import { MATEMATICAS_P4 } from "./curricula/matematicas/p4";
import { MATEMATICAS_I5 } from "./curricula/matematicas/i5";
import { COMUNICACION_I5 } from "./curricula/comunicacion/i5";
import { COMUNICACION_P1 } from "./curricula/comunicacion/p1";
import { COMUNICACION_P2 } from "./curricula/comunicacion/p2";
import { COMUNICACION_P3 } from "./curricula/comunicacion/p3";
import { COMPUTACION_P1 } from "./curricula/computacion/p1";
import { COMPUTACION_P2 } from "./curricula/computacion/p2";
import { COMPUTACION_P3 } from "./curricula/computacion/p3";
import { COMPUTACION_P4 } from "./curricula/computacion/p4";
import { COMPUTACION_P5 } from "./curricula/computacion/p5";
import { COMPUTACION_P6 } from "./curricula/computacion/p6";
import { withExtras } from "./curricula/computacion/extras";
import { COMPUTACION_S1 } from "./curricula/computacion/secundaria/s1";
import { COMPUTACION_S2 } from "./curricula/computacion/secundaria/s2";
import { COMPUTACION_S3 } from "./curricula/computacion/secundaria/s3";
import { COMPUTACION_S4 } from "./curricula/computacion/secundaria/s4";
import { COMPUTACION_S5 } from "./curricula/computacion/secundaria/s5";
import { getGrade, type GradeKey } from "./grades";
import type { Curriculum, Skill } from "./types";

// Registro de contenido: categoría (slug de game_categories) → grado → juegos.
// Una categoría creada desde la app sin contenido aquí se muestra como
// "Próximamente". Agregar un grado = un archivo en curricula/ + una línea aquí.
const CURRICULA: Record<string, Partial<Record<GradeKey, Curriculum>>> = {
  matematicas: { i5: MATEMATICAS_I5, p1: MATEMATICAS_P1, p2: MATEMATICAS_P2, p3: MATEMATICAS_P3, p4: MATEMATICAS_P4 },
  comunicacion: { i5: COMUNICACION_I5, p1: COMUNICACION_P1, p2: COMUNICACION_P2, p3: COMUNICACION_P3 },
  // Computación: cada grado suma los apartados Programación y software,
  // Scratch e IA, y juega partidas de 15 preguntas.
  computacion: {
    p1: withExtras(COMPUTACION_P1, "p1"),
    p2: withExtras(COMPUTACION_P2, "p2"),
    p3: withExtras(COMPUTACION_P3, "p3"),
    p4: withExtras(COMPUTACION_P4, "p4"),
    p5: withExtras(COMPUTACION_P5, "p5"),
    p6: withExtras(COMPUTACION_P6, "p6"),
    // Secundaria: Python, Scratch, programación e IA en cada grado.
    s1: COMPUTACION_S1,
    s2: COMPUTACION_S2,
    s3: COMPUTACION_S3,
    s4: COMPUTACION_S4,
    s5: COMPUTACION_S5,
  },
};

export function getCurriculum(category: string, grade: string): Curriculum | undefined {
  return CURRICULA[category]?.[grade as GradeKey];
}

export function skillCount(category: string, grade: string) {
  return getCurriculum(category, grade)?.skills.length ?? 0;
}

export function hasContent(category: string) {
  return Object.values(CURRICULA[category] ?? {}).some((c) => c && c.skills.length > 0);
}

// Id global de un juego, el que se guarda en game_sessions/game_attempts:
// "matematicas/p2/A.1". El id local (A.1) solo es único dentro de su grado.
export function skillUid(category: string, grade: string, id: string) {
  return `${category}/${grade}/${id}`;
}

export function skillHref(uid: string) {
  const [category, grade, id] = uid.split("/");
  return `/juegos/${category}/${grade}/${encodeURIComponent(id)}`;
}

export type ResolvedSkill = Skill & {
  uid: string;
  category: string;
  grade: GradeKey;
  gradeLabel: string;
  sectionName: string;
  sectionIcon: string;
  sessionLength?: number;
};

export function getSkill(uid: string): ResolvedSkill | undefined {
  const [category, grade, id] = uid.split("/");
  if (!category || !grade || !id) return undefined;
  const curriculum = getCurriculum(category, grade);
  const skill = curriculum?.skills.find((s) => s.id === id);
  if (!curriculum || !skill) return undefined;
  const section = curriculum.sections.find((s) => s.id === skill.section);
  return {
    ...skill,
    uid,
    category,
    grade: grade as GradeKey,
    gradeLabel: getGrade(grade)?.label ?? grade,
    sectionName: section?.name ?? "",
    sectionIcon: section?.icon ?? "",
    sessionLength: curriculum.sessionLength,
  };
}
