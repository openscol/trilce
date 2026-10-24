export type Visual =
  | { kind: "text"; text: string }
  // `numbered`: muestra 1, 2, 3... debajo de cada objeto (aprender a contar).
  | { kind: "objects"; emoji: string; count: number; numbered?: boolean }
  | { kind: "groups"; emoji: string; a: number; b: number }
  | { kind: "takeaway"; emoji: string; total: number; removed: number }
  // `ray`: dibuja desde `marked` una semirrecta (solución de una inecuación);
  // `closed` = punto relleno (≤, ≥). Los números negativos se rotulan con «−».
  // `segments`: intervalos sombreados (sin `from` = desde −∞, sin `to` = hasta +∞), con
  // extremos abiertos o cerrados; `dots`: varios puntos marcados (soluciones sueltas).
  | {
      kind: "numberLine";
      min: number;
      max: number;
      step: number;
      labelEvery: number;
      marked?: number;
      ray?: { closed: boolean; dir: "left" | "right" };
      segments?: { from?: number; to?: number; closedFrom?: boolean; closedTo?: boolean }[];
      dots?: number[];
    }
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
  // `hideLabels`: solo las barras, sin la fracción al lado (números mixtos, sumas).
  | { kind: "fractionPair"; items: { parts: number; shaded: number }[]; showAll?: boolean; hideLabels?: boolean }
  | { kind: "fractionGroup"; emoji: string; total: number; highlighted: number }
  | { kind: "measureObjects"; itemEmoji: string; unitEmoji: string; count: number }
  // `unit`: rótulo de la regla ("pulgadas"); `sub`: divisiones por unidad (4 = cuartos).
  | { kind: "ruler"; length: number; unit?: string; sub?: number }
  | { kind: "thermometer"; value: number; min: number; max: number }
  | { kind: "lengthBars"; a: number; b: number }
  | { kind: "gridObjects"; size: number; cells: { r: number; c: number; emoji: string }[] }
  | { kind: "stack"; items: string[] }
  // `connect`: une los puntos en orden con segmentos («closed» cierra la figura).
  // `min` negativo: plano con los cuatro cuadrantes (por defecto empieza en 0).
  // `lines`: rectas o segmentos de un punto a otro (las rectas se dan con sus extremos en el borde
  // del plano); `shapes`: polígonos cerrados, p. ej. una figura y su imagen (la imagen, punteada).
  | {
      kind: "coordPlane";
      max: number;
      min?: number;
      points: { x: number; y: number; emoji: string }[];
      connect?: "open" | "closed";
      // `arrow`: dibuja una punta de flecha en `to` (vectores).
      // `color`: fija el color (si no, la primera es verde y las demás celestes).
      lines?: { from: { x: number; y: number }; to: { x: number; y: number }; dashed?: boolean; label?: string; arrow?: boolean; color?: "green" | "sky" }[];
      shapes?: { points: { x: number; y: number }[]; dashed?: boolean; label?: string }[];
      // Álgebra: curvas (parábolas, exponenciales…) como polilíneas recortadas al plano,
      // regiones sombreadas (inecuaciones) y puntos abiertos (extremos excluidos).
      curves?: { points: { x: number; y: number }[]; dashed?: boolean; label?: string; color?: "green" | "sky" }[];
      regions?: { points: { x: number; y: number }[] }[];
      openPoints?: { x: number; y: number }[];
    }
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
  // Desde 1000 se dibujan como billetes (S/ 10, S/ 20, S/ 50, S/ 100).
  | { kind: "coins"; coins: number[] }
  // Barra o círculo partido en trozos; `cuts` son los cortes (0-100 en la barra, grados en el círculo).
  | { kind: "splitShape"; shape: "bar" | "circle"; cuts: number[] }
  // Cuadrícula de 10 × 10 con `hundredths` casillas sombreadas (centésimos).
  // `extra`: casillas sumadas, en otro color; `crossed`: las últimas sombreadas van tachadas (resta).
  | { kind: "decimalGrid"; hundredths: number; extra?: number; crossed?: number }
  // Dos rectas: paralelas, perpendiculares o secantes; `rotation` en grados.
  | { kind: "lines"; relation: "paralelas" | "perpendiculares" | "secantes"; rotation: number }
  // Un ángulo de `degrees` grados, girado `rotation` grados.
  // `protractor`: dibuja un transportador sobre el ángulo (usar con rotation 0 y hasta 180°).
  | { kind: "angle"; degrees: number; rotation: number; protractor?: boolean }
  // Polígono en un lienzo de 100 × 100; `sideLabels[i]` rotula el lado que va
  // del vértice i al i+1; `rightAngles` marca vértices con ángulo recto.
  // `dashed`: segmentos punteados (ejes de simetría, cortes de una figura compuesta).
  | { kind: "polygon"; points: [number, number][]; sideLabels?: string[]; rightAngles?: number[]; dashed?: [[number, number], [number, number]][]; open?: boolean; grid?: boolean }
  // (`open`: línea quebrada sin cerrar ni rellenar; `grid`: cuadrícula de fondo, una casilla cada 10 unidades.)
  // --- 4.° de primaria en adelante ---
  // Tabla de datos con encabezados (horarios, listas de precios, entrada/salida...).
  | { kind: "table"; headers?: string[]; rows: string[][]; title?: string }
  // Gráfico de barras (o de líneas con `line`); el eje va de 0 a `max` de `step` en `step`.
  // `value2` + `legend`: segunda serie (gráficos dobles de barras o de líneas).
  | { kind: "barChart"; title?: string; bars: { label: string; value: number; value2?: number }[]; max: number; step: number; line?: boolean; legend?: [string, string] }
  // Diagrama de puntos: una X por cada dato sobre su valor.
  | { kind: "linePlot"; title?: string; labels: string[]; counts: number[] }
  // Modelo de área: `top` y `side` rotulan columnas y filas; `cells[fila][columna]`.
  | { kind: "areaModel"; top: string[]; side: string[]; cells: string[][] }
  // Diagrama de tiras: cada barra tiene partes con texto y ancho relativo `w`;
  // `total` es el rótulo de la llave sobre la primera barra.
  | { kind: "strip"; total?: string; bars: { label?: string; parts: { text: string; w: number }[] }[] }
  // --- 6.° de primaria en adelante ---
  // Gráfico circular: cada sector con su rótulo y su porcentaje (los valores suman 100).
  | { kind: "pie"; title?: string; slices: { label: string; value: number }[] }
  // Diagrama de caja y bigotes sobre una recta de `axisMin` a `axisMax`.
  | { kind: "boxPlot"; title?: string; min: number; q1: number; median: number; q3: number; max: number; axisMin: number; axisMax: number; step: number }
  // --- 5.° de primaria en adelante ---
  // Cubos unitarios apilados, en perspectiva: `heights[fila][columna]` (la fila 0 es la del fondo).
  | { kind: "cubes3d"; heights: number[][] }
  // Rectángulo de `rows` × `cols` casillas: se pintan `cols` primeras columnas hasta `a`
  // y las primeras `b` filas; el cruce (producto de fracciones o decimales) va más oscuro.
  | { kind: "fracGrid"; rows: number; cols: number; a: number; b: number }
  // Punto, recta, segmento, semirrecta o ángulo, con sus letras.
  // `rotation` gira el dibujo (grados); `labels` cambia las letras (por defecto A, B, C).
  | { kind: "geoFigure"; figure: "punto" | "recta" | "segmento" | "semirrecta" | "angulo"; rotation?: number; labels?: string[] }
  // --- 1.° de secundaria en adelante ---
  // Círculo (o medio círculo / un cuarto) con su radio o su diámetro rotulados.
  // `sectors`: lo divide en esa cantidad de sectores iguales y pinta uno.
  | { kind: "circle"; part?: "full" | "semi" | "quarter"; radius?: string; diameter?: string; sectors?: number }
  // Dos rectas paralelas cortadas por una transversal, con los ocho ángulos
  // numerados (1-4 arriba, 5-8 abajo). `given`: ángulo cuya medida se muestra.
  | { kind: "transversal"; given?: { angle: number; text: string } }
  // --- 2.° de secundaria en adelante ---
  // Diagrama de dispersión: ejes de 0 a `xMax`/`yMax` con marcas cada `xStep`/`yStep`;
  // `line`: recta de ajuste (de un extremo al otro).
  | {
      kind: "scatterPlot";
      title?: string;
      xLabel: string;
      yLabel: string;
      xMax: number;
      yMax: number;
      xStep: number;
      yStep: number;
      points: { x: number; y: number }[];
      line?: { from: { x: number; y: number }; to: { x: number; y: number } };
    }
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
  extended?: boolean;
  generate: (r: import("./rng").Rng) => Question;
};

// `topic`: tema de la vista «por temas» (lib/games/topics.ts). Solo lo tienen
// los grados ya organizados según el CNEB.
// `extended`: la sección solo aparece en el modo extendido (lib/games/modes.ts);
// en el modo CNEB se oculta. Lo mismo `Skill.extended` para un juego suelto.
export type Section = { id: string; name: string; icon: string; topic?: string; extended?: boolean };

// Juegos de una categoría (matemáticas, comunicación...) para un grado.
// `sessionLength`: si se define, cada partida termina tras esa cantidad de
// preguntas y muestra un resumen; si no, se juega sin fin.
export type Curriculum = { sections: Section[]; skills: Skill[]; sessionLength?: number };
