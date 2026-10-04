import type { Curriculum, Skill } from "../../../types";
import * as fundamentos from "./fundamentos";
import * as lectura from "./lectura";
import * as escritura from "./escritura";
import * as vocabulario from "./vocabulario";
import * as gramatica1 from "./gramatica1";
import * as gramatica2 from "./gramatica2";

// Comunicación · 3.° de Primaria (IXL 3rd grade ELA, en castellano). Mismas
// secciones y códigos que IXL: fundamentos de lectura (A-G), estrategias de
// lectura (H-V), estrategias de escritura (W-DD), vocabulario (EE-NN) y
// gramática y ortografía (OO-DDD).
const BLOCKS = [fundamentos, lectura, escritura, vocabulario, gramatica1, gramatica2];

const SECTIONS = BLOCKS.flatMap((b) => b.SECTIONS);

const SKILLS: Skill[] = BLOCKS.flatMap((b) =>
  b.ROWS.map(([id, title, generate]) => {
    const section = id.split(".")[0];
    return { id, section, title, icon: SECTIONS.find((s) => s.id === section)!.icon, generate };
  })
);

export const COMUNICACION_P3: Curriculum = { sections: SECTIONS, skills: SKILLS };
