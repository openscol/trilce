import type { Curriculum, Question, Skill } from "../../../types";
import * as fundamentos from "./fundamentos";
import * as lectura from "./lectura";
import * as vocabulario from "./vocabulario";
import * as gramatica from "./gramatica";

// Comunicación · Inicial 5 años (IXL Kindergarten ELA, en castellano). Mismos
// bloques y juegos que IXL: fundamentos (A-Y), estrategias de lectura (Z-LL),
// vocabulario (MM-SS) y gramática (TT-WW). Los juegos que IXL marca como
// «New!» (sin número) van numerados en el lugar donde aparecen.
const BLOCKS = [fundamentos, lectura, vocabulario, gramatica];

const SECTIONS = BLOCKS.flatMap((b) => b.SECTIONS);

// A esta edad todavía no se lee con soltura: el botón 🔊 lee el enunciado y,
// fuera de los juegos donde justamente hay que leer solo, también el texto.
// Las rimas (H) sí se leen en voz alta: se trabajan de oído.
const READ_ALONE = new Set([...fundamentos.SECTIONS.map((s) => s.id).filter((id) => id !== "H"), "JJ", "LL"]);
const clean = (s: string) =>
  s
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D▢—]/gu, " ")
    .replace(/_+/g, "…")
    .replace(/\s+/g, " ")
    .trim();

function aloud(q: Question, section: string): Question {
  if (q.speak) return q.visual?.kind === "passage" ? { ...q, speak: `${q.speak} ${q.prompt}` } : q;
  const text = !READ_ALONE.has(section) && q.visual?.kind === "text" ? `${q.visual.text.replace(/[.\s]+$/, "")}. ` : "";
  return { ...q, speak: clean(`${text}${q.prompt}`) };
}

const SKILLS: Skill[] = BLOCKS.flatMap((b) =>
  b.ROWS.map(([id, title, generate]) => {
    const section = id.split(".")[0];
    return { id, section, title, icon: SECTIONS.find((s) => s.id === section)!.icon, generate: (r) => aloud(generate(r), section) };
  })
);

export const COMUNICACION_I5: Curriculum = { sections: SECTIONS, skills: SKILLS };
