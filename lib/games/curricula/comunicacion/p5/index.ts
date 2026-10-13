import type { Curriculum, Skill } from "../../../types";
import * as fundamentos from "./fundamentos";
import * as lectura from "./lectura";
import * as textos from "./textos";
import * as escritura from "./escritura";
import * as vocabulario from "./vocabulario";
import * as gramatica1 from "./gramatica1";
import * as gramatica2 from "./gramatica2";

// Comunicación · 5.° de Primaria (IXL 5th grade ELA, en castellano). Mismas
// secciones y códigos que IXL: fundamentos de lectura (A-C), estrategias de
// lectura (D-O), lecturas (P-S), estrategias de escritura (T-AA), vocabulario
// (BB-KK) y gramática y ortografía (LL-ZZ). Los bancos cortos de preguntas se
// arman con los ayudantes de 3.° (../p3/helpers).
const BLOCKS = [fundamentos, lectura, textos, escritura, vocabulario, gramatica1, gramatica2];

const SECTIONS = BLOCKS.flatMap((b) => b.SECTIONS);

const SKILLS: Skill[] = BLOCKS.flatMap((b) =>
  b.ROWS.map(([id, title, generate]) => {
    const section = id.split(".")[0];
    return { id, section, title, icon: SECTIONS.find((s) => s.id === section)!.icon, generate };
  })
);

export const COMUNICACION_P5: Curriculum = { sections: SECTIONS, skills: SKILLS };
