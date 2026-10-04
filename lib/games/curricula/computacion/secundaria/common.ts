import type { ChoiceItem } from "../../../generators/lengua/bank";
import type { Curriculum, Section } from "../../../types";
import { buildCurriculum, type Row } from "../shared";

// Secundaria: partidas de 15 preguntas, igual que en primaria.
export function secundaria(sections: Section[], rows: Row[]): Curriculum {
  return { ...buildCurriculum(sections, rows), sessionLength: 15 };
}

// Programas con error → nombre del error de Python. Los distractores son los
// demás errores del banco.
export function pyErrorItems(list: [code: string, error: string][]): ChoiceItem[] {
  const errors = [...new Set(list.map(([, e]) => e))];
  return list.map(([py, a]) => ({ py, a, d: errors.filter((e) => e !== a), p: "¿Qué error muestra Python al ejecutar este programa?", mono: true }));
}
