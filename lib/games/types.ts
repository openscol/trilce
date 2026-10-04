export type Visual =
  | { kind: "text"; text: string }
  // `numbered`: muestra 1, 2, 3... debajo de cada objeto (aprender a contar).
  | { kind: "objects"; emoji: string; count: number; numbered?: boolean }
  | { kind: "groups"; emoji: string; a: number; b: number }
  | { kind: "takeaway"; emoji: string; total: number; removed: number }
  | { kind: "numberLine"; min: number; max: number; step: number; labelEvery: number; marked?: number }
  // Recta de 0 a `wholes` (1 por defecto) dividida en `parts` partes por unidad.
  // `marked` y `points[].at` se miden en partes desde 0.
  // `labels`: textos de los dos extremos (para rectas de decimales, p. ej. ["3", "4"]).
  // `title`: texto pequeño sobre la recta (la fracción que representa).
  | { kind: "fractionLine"; parts: number; marked?: number; wholes?: number; points?: { at: number; label: string }[]; labels?: [string, string]; title?: string }
  | { kind: "fractionLines"; lines: { parts: number; marked?: number; title?: string }[] }
  // `max`: muestra la tabla solo hasta ese número (20, 30, 50...).
  | { kind: "hundredsChart"; blank: number[]; highlight: number; max?: number }
  | { kind: "placeValue"; tens: number; ones: number; hundreds?: number; thousands?: number }
  | { kind: "fraction"; shape: "circle" | "bar" | "area"; parts: number; shaded: number }
  // `showAll`: muestra la fracción de cada barra (si no, la segunda va como ?/partes).
  | { kind: "fractionPair"; items: { parts: number; shaded: number }[]; showAll?: boolean }
  | { kind: "fractionGroup"; emoji: string; total: number; highlighted: number }
  | { kind: "measureObjects"; itemEmoji: string; unitEmoji: string; count: number }
  | { kind: "ruler"; length: number }
  | { kind: "thermometer"; value: number; min: number; max: number }
  | { kind: "lengthBars"; a: number; b: number }
  | { kind: "gridObjects"; size: number; cells: { r: number; c: number; emoji: string }[] }
  | { kind: "stack"; items: string[] }
  | { kind: "coordPlane"; max: number; points: { x: number; y: number; emoji: string }[] }
  | { kind: "shapes"; names: string[] }
  | { kind: "solids"; names: string[] }
  | { kind: "pattern"; items: string[] }
  | { kind: "bag"; items: { emoji: string; count: number }[] }
  | { kind: "array"; emoji: string; rows: number; cols: number }
  | { kind: "equalGroups"; emoji: string; groups: number; each: number }
  | { kind: "net"; name: string }
  // --- Inicial ---
  // Marcos de cinco o de diez; cada número de `counts` es un marco con esas fichas.
  | { kind: "frame"; size: 5 | 10; counts: number[] }
  // Tren de cubos: cada grupo va de un color; los últimos `crossed` están tachados.
  | { kind: "cubes"; groups: number[]; crossed?: number; vertical?: boolean }
  // Objetos sueltos en un lienzo de 100 × 100 (dispersos, en ronda...).
  | { kind: "scatter"; items: { emoji: string; x: number; y: number }[] }
  // Filas alineadas para comparar cantidades o leer un pictograma.
  | { kind: "rows"; rows: { emoji: string; count: number; label?: string }[] }
  // Una caja con cosas adentro y afuera.
  | { kind: "box"; inside: string[]; outside: string[] }
  | { kind: "venn"; left: string[]; both: string[]; right: string[]; leftLabel: string; rightLabel: string }
  | { kind: "clock"; hour: number; minute: number }
  // Monedas del Perú; valores en céntimos (10, 20, 50, 100, 200, 500).
  | { kind: "coins"; coins: number[] }
  // Barra o círculo partido en trozos; `cuts` son los cortes (0-100 en la barra, grados en el círculo).
  | { kind: "splitShape"; shape: "bar" | "circle"; cuts: number[] }
  // Cuadrícula de 10 × 10 con `hundredths` casillas sombreadas (centésimos).
  | { kind: "decimalGrid"; hundredths: number }
  // Dos rectas: paralelas, perpendiculares o secantes; `rotation` en grados.
  | { kind: "lines"; relation: "paralelas" | "perpendiculares" | "secantes"; rotation: number }
  // Un ángulo de `degrees` grados, girado `rotation` grados.
  | { kind: "angle"; degrees: number; rotation: number }
  // Polígono en un lienzo de 100 × 100; `sideLabels[i]` rotula el lado que va
  // del vértice i al i+1; `rightAngles` marca vértices con ángulo recto.
  | { kind: "polygon"; points: [number, number][]; sideLabels?: string[]; rightAngles?: number[] }
  // Un dibujo grande (emoji) con texto opcional debajo.
  | { kind: "picture"; emoji: string; caption?: string }
  // Lectura: cuento o texto informativo, con título y dibujo opcionales.
  | { kind: "passage"; title?: string; emoji?: string; text: string }
  // Cuadrícula del robot (programación con flechas). Filas y columnas desde 0.
  | {
      kind: "codeGrid";
      size: number;
      robot: { r: number; c: number };
      goal?: { r: number; c: number };
      walls: { r: number; c: number }[];
      path?: { r: number; c: number }[];
      marks?: { r: number; c: number; label: string }[];
    }
  // Teclado con una o más teclas resaltadas.
  | { kind: "keyboard"; highlight: string[] }
  // Hoja de cálculo: columnas A, B, C... y filas 1, 2, 3... (`highlight` = "B2").
  | { kind: "sheet"; cells: string[][]; highlight?: string }
  // Código o pseudocódigo en letra monoespaciada.
  | { kind: "code"; text: string; title?: string }
  // Bloques de Scratch reales (sintaxis de scratchblocks en inglés; se
  // dibujan traducidos al castellano). `title`: texto opcional encima.
  | { kind: "scratch"; code: string; title?: string };

type Base = {
  prompt: string;
  visual?: Visual;
  explanation: string;
  // Sub-tema fino para el análisis de deficiencias (ej. "con-reagrupacion").
  tag?: string;
  // Texto que el botón 🔊 lee en voz alta (palabra, sonidos o cuento).
  speak?: string;
  // Las opciones (o fichas) son bloques de Scratch: se dibujan como bloques.
  blocks?: boolean;
  // Las opciones (o fichas) son código (Python...): letra monoespaciada.
  mono?: boolean;
};

export type Question =
  | (Base & { kind: "choice"; options: string[]; answer: string })
  | (Base & { kind: "number"; answer: number })
  | (Base & { kind: "multi"; options: string[]; answers: string[] })
  | (Base & { kind: "sequence"; tiles: string[]; reuse: boolean; length: number; answer: string[] })
  | (Base & { kind: "shade"; shape: "bar" | "area"; parts: number; answer: number })
  // Escribir con el teclado (distingue mayúsculas).
  | (Base & { kind: "text"; answer: string });

export type Skill = {
  id: string;
  section: string;
  title: string;
  icon: string;
  generate: (r: import("./rng").Rng) => Question;
};

export type Section = { id: string; name: string; icon: string };

// Juegos de una categoría (matemáticas, comunicación...) para un grado.
// `sessionLength`: si se define, cada partida termina tras esa cantidad de
// preguntas y muestra un resumen; si no, se juega sin fin.
export type Curriculum = { sections: Section[]; skills: Skill[]; sessionLength?: number };
