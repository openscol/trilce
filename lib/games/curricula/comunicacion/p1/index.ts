import type { Curriculum, Skill } from "../../../types";
import * as fundamentos from "./fundamentos";
import * as lectura from "./lectura";
import * as vocabulario from "./vocabulario";
import * as gramatica from "./gramatica";

// Comunicación · 1.° de Primaria (IXL 1st grade ELA, en castellano). Mismos
// bloques y códigos que IXL: fundamentos (A-X), estrategias de lectura
// (Y-KK), vocabulario (LL-SS) y gramática (TT-EEE).
const BLOCKS = [fundamentos, lectura, vocabulario, gramatica];

const SECTIONS = BLOCKS.flatMap((b) => b.SECTIONS);

const SKILLS: Skill[] = BLOCKS.flatMap((b) =>
  b.ROWS.map(([id, title, generate]) => {
    const section = id.split(".")[0];
    return { id, section, title, icon: SECTIONS.find((s) => s.id === section)!.icon, generate };
  })
);

export const COMUNICACION_P1: Curriculum = { sections: SECTIONS, skills: SKILLS };
