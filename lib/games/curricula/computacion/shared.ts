import type { ChoiceItem } from "../../generators/lengua/bank";
import type { Curriculum, Section, Skill } from "../../types";

export type Row = [id: string, title: string, generate: Skill["generate"]];

// Ítems "situación → respuesta"; los distractores son las demás respuestas.
export function situations(list: [string, string][], prompt?: string): ChoiceItem[] {
  const answers = [...new Set(list.map(([, a]) => a))];
  return list.map(([t, a]) => ({ t, a, p: prompt, d: answers.filter((x) => x !== a) }));
}

export function buildCurriculum(sections: Section[], rows: Row[]): Curriculum {
  const skills = rows.map(([id, title, generate]) => {
    const section = id.slice(0, id.lastIndexOf("."));
    return { id, section, title, icon: sections.find((s) => s.id === section)!.icon, generate };
  });
  return { sections, skills };
}
