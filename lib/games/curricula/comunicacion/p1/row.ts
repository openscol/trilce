import type { Skill } from "../../../types";

// Una fila del banco de juegos de un grado: clave interna y generador. El
// índice del grado arma los juegos que ve el alumno con estas claves.
export type Row = [key: string, generate: Skill["generate"]];
