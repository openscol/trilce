import type { GradeKey } from "../grades";
import { IDEAS as MATEMATICAS_I5 } from "./matematicas/i5";
import { IDEAS as MATEMATICAS_P1 } from "./matematicas/p1";
import { IDEAS as MATEMATICAS_P2 } from "./matematicas/p2";
import { IDEAS as MATEMATICAS_P3 } from "./matematicas/p3";
import { IDEAS as MATEMATICAS_P4 } from "./matematicas/p4";
import { IDEAS as MATEMATICAS_P5 } from "./matematicas/p5";
import { IDEAS as MATEMATICAS_P6 } from "./matematicas/p6";
import { IDEAS as MATEMATICAS_S1 } from "./matematicas/s1";
import { IDEAS as MATEMATICAS_S2 } from "./matematicas/s2";
import { IDEAS as MATEMATICAS_S3 } from "./matematicas/s3";
import { IDEAS as MATEMATICAS_S4 } from "./matematicas/s4";
import { IDEAS as MATEMATICAS_S5 } from "./matematicas/s5";
import { IDEAS as COMUNICACION_I5 } from "./comunicacion/i5";
import { IDEAS as COMUNICACION_P1 } from "./comunicacion/p1";
import { IDEAS as COMUNICACION_P2 } from "./comunicacion/p2";
import { IDEAS as COMUNICACION_P3 } from "./comunicacion/p3";
import { IDEAS as COMUNICACION_P4 } from "./comunicacion/p4";
import { IDEAS as COMUNICACION_P5 } from "./comunicacion/p5";
import { IDEAS as COMUNICACION_P6 } from "./comunicacion/p6";
import { IDEAS as COMUNICACION_S1 } from "./comunicacion/s1";
import { IDEAS as COMUNICACION_S2 } from "./comunicacion/s2";
import { IDEAS as COMUNICACION_S3 } from "./comunicacion/s3";
import { IDEAS as COMUNICACION_S4 } from "./comunicacion/s4";
import { IDEAS as COMUNICACION_S5 } from "./comunicacion/s5";

// Idea clave de «Aprender con un ejemplo» y de las fichas: lo que hay que saber
// para resolver cada juego, por área → grado → id del juego. Debe servir para
// TODAS las formas de pregunta que mezcla el juego, porque el ejemplo puede
// salir de cualquiera de ellas.
export const IDEAS: Record<string, Partial<Record<GradeKey, Record<string, string>>>> = {
  matematicas: { i5: MATEMATICAS_I5, p1: MATEMATICAS_P1, p2: MATEMATICAS_P2, p3: MATEMATICAS_P3, p4: MATEMATICAS_P4, p5: MATEMATICAS_P5, p6: MATEMATICAS_P6, s1: MATEMATICAS_S1, s2: MATEMATICAS_S2, s3: MATEMATICAS_S3, s4: MATEMATICAS_S4, s5: MATEMATICAS_S5 },
  comunicacion: { i5: COMUNICACION_I5, p1: COMUNICACION_P1, p2: COMUNICACION_P2, p3: COMUNICACION_P3, p4: COMUNICACION_P4, p5: COMUNICACION_P5, p6: COMUNICACION_P6, s1: COMUNICACION_S1, s2: COMUNICACION_S2, s3: COMUNICACION_S3, s4: COMUNICACION_S4, s5: COMUNICACION_S5 },
};
