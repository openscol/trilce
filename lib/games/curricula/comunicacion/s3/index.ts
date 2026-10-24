import type { Curriculum, Skill } from "../../../types";
import * as lectura from "./lectura";
import * as textos from "./textos";
import * as escritura from "./escritura";
import * as vocabulario from "./vocabulario";
import * as gramatica1 from "./gramatica1";
import * as gramatica2 from "./gramatica2";

// Comunicación · 3.° de Secundaria (IXL 9th grade ELA, en castellano). Mismas
// secciones y códigos que IXL: estrategias de lectura (A-P), estrategias de
// escritura (Q-Y), vocabulario (Z-GG) y gramática y ortografía (HH-YY). Los
// bancos cortos de preguntas se arman con los ayudantes de 3.° (../p3/helpers).
// Las secciones de lectura están repartidas en dos archivos (lectura y textos),
// así que aquí se ordenan por su código: A, B, ..., Z, AA, BB, ...
const BLOCKS = [lectura, textos, escritura, vocabulario, gramatica1, gramatica2];

const byCode = (a: string, b: string) => a.length - b.length || a.localeCompare(b);

const SECTIONS = BLOCKS.flatMap((b) => b.SECTIONS).sort((a, b) => byCode(a.id, b.id));

const SKILLS: Skill[] = BLOCKS.flatMap((b) =>
  b.ROWS.map(([id, title, generate]) => {
    const section = id.split(".")[0];
    return { id, section, title, icon: SECTIONS.find((s) => s.id === section)!.icon, generate };
  })
).sort((a, b) => byCode(a.section, b.section) || Number(a.id.split(".")[1]) - Number(b.id.split(".")[1]));

export const COMUNICACION_S3: Curriculum = { sections: SECTIONS, skills: SKILLS };
