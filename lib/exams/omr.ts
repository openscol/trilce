// Lector de fichas ópticas (OMR). Trabaja sobre una imagen en escala de
// grises, así el mismo código corre en el navegador (canvas) y en pruebas.
//
// La ficha tiene cuatro cuadrados negros en las esquinas y barras negras en
// los bordes: a la izquierda, una por cada fila del código (dígitos 0-9) y una
// para la fila del tipo de examen (A/B); a la derecha, una por cada fila de
// preguntas. El lector:
//   1. encuentra los cuatro cuadrados y calcula la perspectiva de la foto;
//   2. ubica cada fila con su barra (por eso tolera hojas curvadas);
//   3. mide cuánto lápiz hay en cada círculo y decide cuál está relleno.

export type Gray = { data: Uint8Array | Uint8ClampedArray; width: number; height: number };
export type Point = { x: number; y: number };

export type SheetLayout = {
  // Posición horizontal (0 = cuadrados de la izquierda, 1 = de la derecha) de cada columna de círculos.
  codeColumns: number[];
  // Posición vertical (0 = cuadrados de arriba, 1 = de abajo) de cada fila, según su barra.
  codeRows: number[];
  themeRow: number;
  answerRows: number[];
  // Posición horizontal del centro de las barras de cada borde y del extremo derecho de las de la derecha.
  leftBarU: number;
  rightBarU: number;
  rightBarEndU: number;
  themeColumns: number[];
  themes: string[];
  // Bloques de preguntas, de izquierda a derecha: las columnas de círculos de cada uno.
  // Todos comparten las filas de answerRows; la numeración baja por un bloque y sigue en el siguiente.
  answerBlocks: number[][];
  options: string[];
  // Radio del círculo, como fracción del ancho entre cuadrados.
  radius: number;
};

// Ficha "Consorcio Educa-T / Trilce" de 10 preguntas: código de 8 dígitos, tipo A/B, opciones A-D.
export const TRILCE_LAYOUT: SheetLayout = {
  codeColumns: [0.0624, 0.1045, 0.1447, 0.1844, 0.2243, 0.2645, 0.3031, 0.343],
  codeRows: [0.2904, 0.3132, 0.3357, 0.3585, 0.3817, 0.4044, 0.4268, 0.4495, 0.472, 0.4946],
  themeRow: 0.5495,
  leftBarU: -0.0005,
  rightBarU: 1.0063,
  rightBarEndU: 1.0215,
  answerRows: [0.2984, 0.3277, 0.3575, 0.3873, 0.4172, 0.4991, 0.5291, 0.5592, 0.5892, 0.6192],
  themeColumns: [0.2427, 0.311],
  themes: ["A", "B"],
  answerBlocks: [[0.591, 0.675, 0.759, 0.843]],
  options: ["A", "B", "C", "D"],
  radius: 0.0125,
};

// La misma ficha con 20 preguntas en dos bloques (01-10 y 11-20) que comparten
// las barras de la derecha. Medida sobre el PDF de la ficha.
export const TRILCE_20_LAYOUT: SheetLayout = {
  codeColumns: [0.0643, 0.104, 0.143, 0.1823, 0.2217, 0.2611, 0.3004, 0.3398],
  codeRows: [0.2919, 0.3143, 0.3368, 0.3592, 0.3821, 0.4045, 0.4269, 0.4493, 0.4717, 0.4942],
  themeRow: 0.5484,
  leftBarU: 0.0027,
  rightBarU: 1.0059,
  rightBarEndU: 1.0197,
  answerRows: [0.2937, 0.3238, 0.3538, 0.3839, 0.4139, 0.4924, 0.5224, 0.5525, 0.5821, 0.6121],
  themeColumns: [0.2416, 0.3088],
  themes: ["A", "B"],
  answerBlocks: [
    [0.5198, 0.5679, 0.616, 0.6644],
    [0.8004, 0.8488, 0.8973, 0.9457],
  ],
  options: ["A", "B", "C", "D"],
  radius: 0.013,
};

// Preguntas que caben en la ficha.
export function questionCapacity(layout: SheetLayout) {
  return layout.answerRows.length * layout.answerBlocks.length;
}

export type Mark = { value: string; fill: number; center: Point; filled: boolean };

export type SheetReading = {
  code: string; // un carácter por columna; "?" si no se pudo leer
  theme: string | null;
  answers: string[]; // "A".."D", "" (en blanco) o "*" (más de una marca)
  warnings: string[];
  corners: Point[]; // TL, TR, BR, BL en la imagen
  marks: Mark[]; // todos los círculos medidos, para dibujarlos encima de la foto
};

type Blob = { x0: number; y0: number; x1: number; y1: number; area: number; cx: number; cy: number };

// Umbral local: un píxel es "tinta" si es bastante más oscuro que su entorno.
export function binarize(img: Gray, black = 0): Uint8Array {
  const { data, width: w, height: h } = img;
  const integral = new Float64Array((w + 1) * (h + 1));
  for (let y = 0; y < h; y++) {
    let row = 0;
    for (let x = 0; x < w; x++) {
      row += data[y * w + x];
      integral[(y + 1) * (w + 1) + x + 1] = integral[y * (w + 1) + x + 1] + row;
    }
  }
  const half = Math.max(8, Math.round(w / 24));
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    const ya = Math.max(0, y - half), yb = Math.min(h, y + half + 1);
    for (let x = 0; x < w; x++) {
      const xa = Math.max(0, x - half), xb = Math.min(w, x + half + 1);
      const sum = integral[yb * (w + 1) + xb] - integral[ya * (w + 1) + xb] - integral[yb * (w + 1) + xa] + integral[ya * (w + 1) + xa];
      const mean = sum / ((xb - xa) * (yb - ya));
      const v = data[y * w + x];
      out[y * w + x] = v < black + (mean - black) * 0.4 ? 1 : 0;
    }
  }
  return out;
}

export function findBlobs(bin: Uint8Array, w: number, h: number, minArea: number): Blob[] {
  const seen = new Uint8Array(w * h);
  const stack = new Int32Array(w * h);
  const blobs: Blob[] = [];
  for (let start = 0; start < w * h; start++) {
    if (!bin[start] || seen[start]) continue;
    let top = 0;
    stack[top++] = start;
    seen[start] = 1;
    let area = 0, sx = 0, sy = 0, x0 = w, y0 = h, x1 = 0, y1 = 0;
    while (top > 0) {
      const p = stack[--top];
      const x = p % w, y = (p - x) / w;
      area++; sx += x; sy += y;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      if (x > 0 && bin[p - 1] && !seen[p - 1]) { seen[p - 1] = 1; stack[top++] = p - 1; }
      if (x < w - 1 && bin[p + 1] && !seen[p + 1]) { seen[p + 1] = 1; stack[top++] = p + 1; }
      if (y > 0 && bin[p - w] && !seen[p - w]) { seen[p - w] = 1; stack[top++] = p - w; }
      if (y < h - 1 && bin[p + w] && !seen[p + w]) { seen[p + w] = 1; stack[top++] = p + w; }
    }
    if (area >= minArea) blobs.push({ x0, y0, x1, y1, area, cx: sx / area, cy: sy / area });
  }
  return blobs;
}

// Homografía que lleva el cuadrado unidad (0,0)-(1,0)-(1,1)-(0,1) a cuatro puntos.
export function unitToQuad(q: Point[]): (u: number, v: number) => Point {
  const [p0, p1, p2, p3] = q;
  const dx1 = p1.x - p2.x, dx2 = p3.x - p2.x, dx3 = p0.x - p1.x + p2.x - p3.x;
  const dy1 = p1.y - p2.y, dy2 = p3.y - p2.y, dy3 = p0.y - p1.y + p2.y - p3.y;
  const det = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / det;
  const hh = (dx1 * dy3 - dx3 * dy1) / det;
  const a = p1.x - p0.x + g * p1.x, b = p3.x - p0.x + hh * p3.x, c = p0.x;
  const d = p1.y - p0.y + g * p1.y, e = p3.y - p0.y + hh * p3.y, f = p0.y;
  return (u, v) => {
    const k = g * u + hh * v + 1;
    return { x: (a * u + b * v + c) / k, y: (d * u + e * v + f) / k };
  };
}

// Inversa numérica: de un punto de la imagen a (u, v) de la ficha.
export function quadToUnit(map: (u: number, v: number) => Point, p: Point): { u: number; v: number } {
  let u = 0.5, v = 0.5;
  for (let i = 0; i < 12; i++) {
    const c = map(u, v), du = map(u + 1e-4, v), dv = map(u, v + 1e-4);
    const a = (du.x - c.x) / 1e-4, b = (dv.x - c.x) / 1e-4, d = (du.y - c.y) / 1e-4, e = (dv.y - c.y) / 1e-4;
    const det = a * e - b * d;
    const ex = p.x - c.x, ey = p.y - c.y;
    u += (ex * e - b * ey) / det;
    v += (a * ey - ex * d) / det;
  }
  return { u, v };
}

// Perspectiva que mejor explica varios puntos conocidos (mínimos cuadrados).
export function fitHomography(pairs: { u: number; v: number; x: number; y: number }[]): ((u: number, v: number) => Point) | null {
  if (pairs.length < 4) return null;
  const scale = Math.max(...pairs.map((p) => Math.max(Math.abs(p.x), Math.abs(p.y))), 1);
  const ata = Array.from({ length: 8 }, () => new Float64Array(9));
  const add = (row: number[], target: number) => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) ata[i][j] += row[i] * row[j];
      ata[i][8] += row[i] * target;
    }
  };
  for (const p of pairs) {
    const x = p.x / scale, y = p.y / scale;
    add([p.u, p.v, 1, 0, 0, 0, -p.u * x, -p.v * x], x);
    add([0, 0, 0, p.u, p.v, 1, -p.u * y, -p.v * y], y);
  }
  for (let col = 0; col < 8; col++) {
    let pivot = col;
    for (let r = col + 1; r < 8; r++) if (Math.abs(ata[r][col]) > Math.abs(ata[pivot][col])) pivot = r;
    if (Math.abs(ata[pivot][col]) < 1e-12) return null;
    [ata[col], ata[pivot]] = [ata[pivot], ata[col]];
    for (let r = 0; r < 8; r++) {
      if (r === col) continue;
      const k = ata[r][col] / ata[col][col];
      for (let c = col; c < 9; c++) ata[r][c] -= k * ata[col][c];
    }
  }
  const [a, b, c, d, e, f, g, hh] = ata.map((row, i) => row[8] / row[i]);
  return (u, v) => {
    const k = g * u + hh * v + 1;
    return { x: (scale * (a * u + b * v + c)) / k, y: (scale * (d * u + e * v + f)) / k };
  };
}

// Nivel de negro de la foto (el 1 % más oscuro): con él, una foto oscura o
// lavada se lee igual que una buena.
function blackLevel(img: Gray): number {
  const hist = new Uint32Array(256);
  for (let i = 0; i < img.data.length; i += 7) hist[img.data[i]]++;
  const total = Math.ceil(img.data.length / 7);
  let acc = 0;
  for (let v = 0; v < 256; v++) {
    acc += hist[v];
    if (acc >= total * 0.01) return v;
  }
  return 0;
}

export function readSheet(img: Gray, layout: SheetLayout = TRILCE_LAYOUT): SheetReading {
  const { width: w, height: h } = img;
  const black = blackLevel(img);
  const warnings: string[] = [];
  const bin = binarize(img, black);
  const unit = Math.min(w, h);
  const blobs = findBlobs(bin, w, h, Math.round((unit * 0.008) ** 2));
  const solidity = (b: Blob) => b.area / ((b.x1 - b.x0 + 1) * (b.y1 - b.y0 + 1));
  // Con la hoja girada, la caja de un cuadrado negro se llena menos: se acepta desde 0,55.
  const solid = blobs.filter((b) => solidity(b) > 0.55);

  // Cuadrados de esquina: sólidos, casi cuadrados, los más cercanos a cada esquina de la imagen.
  const squares = solid.filter((b) => {
    const bw = b.x1 - b.x0 + 1, bh = b.y1 - b.y0 + 1;
    return bw / bh > 0.7 && bw / bh < 1.4 && bw > unit * 0.015 && bw < unit * 0.07;
  });
  const nearest = (x: number, y: number) => [...squares].sort((p, q) => Math.hypot(p.cx - x, p.cy - y) - Math.hypot(q.cx - x, q.cy - y))[0];
  const found = [nearest(0, 0), nearest(w, 0), nearest(w, h), nearest(0, h)];
  const points = found.map((b) => (b ? { x: b.cx, y: b.cy } : null));

  // Barras sueltas de los bordes: sólidas y más anchas que altas.
  const barBlobs = solid.filter((b) => {
    const bw = b.x1 - b.x0 + 1, bh = b.y1 - b.y0 + 1;
    return !found.includes(b) && bw / bh > 1.5 && bw / bh < 4.5 && bw > unit * 0.012 && bw < unit * 0.06;
  });
  const isInk = (p: Point) => {
    const x = Math.round(p.x), y = Math.round(p.y);
    return x >= 0 && y >= 0 && x < w && y < h && bin[y * w + x] === 1;
  };
  const leftExpected = [...layout.codeRows, layout.themeRow];
  const totalRows = leftExpected.length + layout.answerRows.length;

  type Anchor = { u: number; v: number; x: number; y: number };
  type Rows = { left: number[]; right: number[]; matched: number; anchors: Anchor[] };

  // Ubica las filas con una perspectiva dada. Una barra vale si está cerca de donde se espera.
  const locateRows = (map: (u: number, v: number) => Point): Rows => {
    const anchors: Anchor[] = [];
    let matched = 0;
    const bars = barBlobs.map((b) => ({ ...quadToUnit(map, { x: b.cx, y: b.cy }), x: b.cx, y: b.cy }));
    const side = (expected: number[], barU: number, lo: number, hi: number) => {
      const near = bars.filter((b) => b.u > lo && b.u < hi);
      return expected.map((e) => {
        const hit = near.filter((b) => Math.abs(b.v - e) < 0.011).sort((p, q) => Math.abs(p.v - e) - Math.abs(q.v - e))[0];
        if (!hit) return null;
        anchors.push({ u: barU, v: e, x: hit.x, y: hit.y });
        return hit.v;
      });
    };
    const left = side(leftExpected, layout.leftBarU, -0.08, 0.05);
    let right = side(layout.answerRows, layout.rightBarU, 0.95, 1.08);

    // En fichas impresas en negro, las barras de la derecha tocan el marco y no
    // quedan como piezas sueltas: se buscan recorriendo una franja vertical por
    // fuera del marco, donde solo sobresalen las barras.
    if (right.filter((v) => v !== null).length < layout.answerRows.length) {
      const lo = Math.min(...layout.answerRows) - 0.03, hi = Math.max(...layout.answerRows) + 0.03;
      let best: { rows: (number | null)[]; count: number; u: number } | null = null;
      for (let u = layout.rightBarU - 0.012; u <= layout.rightBarU + 0.03; u += 0.003) {
        const centers: number[] = [];
        let start: number | null = null;
        for (let v = lo; v <= hi + 0.001; v += 0.001) {
          const ink = v <= hi && isInk(map(u, v)) && isInk(map(u + 0.004, v));
          if (ink && start === null) start = v;
          if (!ink && start !== null) {
            const length = v - start;
            if (length > 0.004 && length < 0.02) centers.push(start + length / 2);
            start = null;
          }
        }
        const rows = layout.answerRows.map((e) => centers.filter((c) => Math.abs(c - e) < 0.011).sort((p, q) => Math.abs(p - e) - Math.abs(q - e))[0] ?? null);
        const count = rows.filter((v) => v !== null).length;
        if (!best || count > best.count) best = { rows, count, u };
      }
      if (best && best.count > right.filter((v) => v !== null).length) {
        right = best.rows;
        // Ancla: el extremo derecho de cada barra (su extremo izquierdo se confunde con el marco).
        for (let i = 0; i < right.length; i++) {
          const v = right[i];
          if (v === null) continue;
          let u = best.u;
          while (u < best.u + 0.05 && isInk(map(u + 0.001, v))) u += 0.001;
          const end = map(u, v);
          anchors.push({ u: layout.rightBarEndU, v: layout.answerRows[i], x: end.x, y: end.y });
        }
      }
    }
    for (const v of [...left, ...right]) if (v !== null) matched++;
    return {
      left: left.map((v, i) => v ?? leftExpected[i]),
      right: right.map((v, i) => v ?? layout.answerRows[i]),
      matched,
      anchors,
    };
  };

  // Hipótesis de esquinas: los cuatro cuadrados encontrados, o tres de ellos con
  // la cuarta deducida (un cuadrado puede salir pegado a otra mancha o tapado).
  type Hypothesis = { corners: Point[]; inferred: number | null; rows: Rows };
  const plausible = (c: Point[]) => {
    const side = (i: number, j: number) => Math.hypot(c[i].x - c[j].x, c[i].y - c[j].y);
    const similar = (p: number, q: number) => Math.min(p, q) / Math.max(p, q) > 0.7;
    return similar(side(0, 1), side(3, 2)) && similar(side(0, 3), side(1, 2)) && side(0, 1) > unit * 0.4 && side(0, 3) > unit * 0.4;
  };
  const hypotheses: Hypothesis[] = [];
  const consider = (corners: (Point | null)[], inferred: number | null) => {
    if (corners.some((c) => !c)) return;
    const c = corners as Point[];
    if (new Set(c.map((p) => `${Math.round(p.x)},${Math.round(p.y)}`)).size < 4 || !plausible(c)) return;
    hypotheses.push({ corners: c, inferred, rows: locateRows(unitToQuad(c)) });
  };
  consider(points, null);
  for (let k = 0; k < 4; k++) {
    const n1 = points[(k + 1) % 4], n2 = points[(k + 3) % 4], opposite = points[(k + 2) % 4];
    if (!n1 || !n2 || !opposite) continue;
    consider(points.map((p, i) => (i === k ? { x: n1.x + n2.x - opposite.x, y: n1.y + n2.y - opposite.y } : p)), k);
  }
  // Gana la que explica más barras; a igualdad, la que no deduce ninguna esquina.
  hypotheses.sort((p, q) => q.rows.matched - p.rows.matched || (p.inferred === null ? -1 : 1));
  const chosen = hypotheses[0];
  if (!chosen) throw new Error("No se encontraron los cuadrados negros de las esquinas. La imagen debe mostrar la hoja completa, de frente y bien iluminada.");
  // Con pocas barras en su sitio la perspectiva no es fiable y las filas podrían leerse corridas: mejor rechazar la imagen.
  if (chosen.rows.matched < totalRows - 2) {
    throw new Error("No se reconocen bien las barras negras de los bordes. Vuelve a tomar la imagen: hoja completa, plana, de frente y enfocada.");
  }

  let corners = chosen.corners;
  let map = unitToQuad(corners);
  let rows = chosen.rows;
  if (chosen.inferred !== null) {
    // La esquina deducida es aproximada: se ajusta la perspectiva con todas las anclas (cuadrados reales y barras).
    const unitCorners = [{ u: 0, v: 0 }, { u: 1, v: 0 }, { u: 1, v: 1 }, { u: 0, v: 1 }];
    const anchors = [...rows.anchors, ...corners.flatMap((c, i) => (i === chosen.inferred ? [] : [{ ...unitCorners[i], x: c.x, y: c.y }]))];
    const fitted = fitHomography(anchors);
    if (fitted) {
      const refined = locateRows(fitted);
      if (refined.matched >= rows.matched) {
        map = fitted;
        rows = refined;
        corners = unitCorners.map((c) => fitted(c.u, c.v));
      }
    }
  }
  const missing = totalRows - rows.matched;
  if (missing > 0) warnings.push(`No se vieron ${missing} de las barras negras del borde: revisa la lectura.`);
  const codeRows = rows.left.slice(0, layout.codeRows.length);
  const themeRow = rows.left[layout.codeRows.length];
  const answerRows = rows.right;

  // Tinta en un círculo: cuánto más oscuro es que el papel de alrededor.
  const radius = layout.radius * Math.hypot(corners[1].x - corners[0].x, corners[1].y - corners[0].y);
  const paperAt = (c: Point) => {
    const values: number[] = [];
    const r = Math.round(radius * 3);
    for (let dy = -r; dy <= r; dy += 2) for (let dx = -r; dx <= r; dx += 2) {
      const x = Math.round(c.x + dx), y = Math.round(c.y + dy);
      if (x >= 0 && y >= 0 && x < w && y < h) values.push(img.data[y * w + x]);
    }
    values.sort((a, b) => a - b);
    return values[Math.floor(values.length * 0.85)] ?? 255;
  };
  const inkOnce = (c: Point, paper: number) => {
    const r = radius * 0.72;
    let sum = 0, n = 0;
    for (let dy = -Math.ceil(r); dy <= r; dy++) for (let dx = -Math.ceil(r); dx <= r; dx++) {
      if (dx * dx + dy * dy > r * r) continue;
      const x = Math.round(c.x + dx), y = Math.round(c.y + dy);
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      sum += Math.max(0, paper - Math.max(black, img.data[y * w + x]));
      n++;
    }
    return n ? sum / n / Math.max(paper - black, 1) : 0;
  };
  // La hoja nunca queda perfectamente plana: se prueba también un poco alrededor del centro esperado.
  const inkAt = (c: Point) => {
    const paper = paperAt(c);
    const d = radius * 0.4;
    return Math.max(...[[0, 0], [0, -d], [0, d], [-d, 0], [d, 0]].map(([dx, dy]) => inkOnce({ x: c.x + dx, y: c.y + dy }, paper)));
  };

  const marks: Mark[] = [];
  // Mide un grupo de círculos del que se espera una sola marca.
  const measure = (points: { value: string; u: number; v: number }[]) => {
    const group = points.map((p) => {
      const center = map(p.u, p.v);
      return { value: p.value, center, fill: inkAt(center), filled: false };
    });
    const sorted = [...group].sort((a, b) => b.fill - a.fill);
    // Un círculo vacío tiene poco: el aro y su letra. Relleno: bastante más que eso.
    const floor = Math.max(0.4, sorted[sorted.length - 1].fill + 0.2);
    for (const m of group) m.filled = m.fill >= floor && m.fill >= sorted[0].fill * 0.6;
    marks.push(...group);
    return group.filter((m) => m.filled).map((m) => m.value);
  };

  // Código: en cada columna se rellena un dígito (filas 0-9).
  let code = "";
  for (const u of layout.codeColumns) {
    const hits = measure(codeRows.map((v, d) => ({ value: String(d), u, v })));
    code += hits.length === 1 ? hits[0] : "?";
  }
  if (code.includes("?")) warnings.push("El código no se leyó completo: revisa las columnas marcadas con «?».");

  const themeHits = measure(layout.themeColumns.map((u, i) => ({ value: layout.themes[i], u, v: themeRow })));
  const theme = themeHits.length === 1 ? themeHits[0] : null;
  if (!theme) warnings.push("No se pudo leer el tipo de examen marcado.");

  const answers = layout.answerBlocks.flatMap((columns, block) =>
    answerRows.map((v, i) => {
      const hits = measure(columns.map((u, k) => ({ value: layout.options[k], u, v })));
      if (hits.length > 1) warnings.push(`Pregunta ${block * answerRows.length + i + 1}: hay más de una marca.`);
      return hits.length === 1 ? hits[0] : hits.length === 0 ? "" : "*";
    })
  );

  return { code, theme, answers, warnings, corners, marks };
}
