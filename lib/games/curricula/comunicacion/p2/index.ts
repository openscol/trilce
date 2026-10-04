import type { Curriculum, Skill } from "../../../types";
import * as fundamentos from "./fundamentos";
import * as lectura from "./lectura";
import * as escritura from "./escritura";
import * as vocabulario from "./vocabulario";
import * as gramatica from "./gramatica";

// Comunicación · 2.° de Primaria (IXL 2nd grade ELA, en castellano). Mismas
// secciones y códigos que IXL: fundamentos de lectura (A-T), estrategias de
// lectura (U-GG), estrategias de escritura (HH-NN), vocabulario (OO-WW) y
// gramática y ortografía (XX-LLL; IXL no tiene sección KKK en este grado).
const BLOCKS = [fundamentos, lectura, escritura, vocabulario, gramatica];

const SECTIONS = BLOCKS.flatMap((b) => b.SECTIONS);

const SKILLS: Skill[] = BLOCKS.flatMap((b) =>
  b.ROWS.map(([id, title, generate]) => {
    const section = id.split(".")[0];
    return { id, section, title, icon: SECTIONS.find((s) => s.id === section)!.icon, generate };
  })
);

export const COMUNICACION_P2: Curriculum = { sections: SECTIONS, skills: SKILLS };
