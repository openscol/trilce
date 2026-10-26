import { Playwrite_ES } from "next/font/google";

// Hoja de caligrafía: la norma que el alumno no respetó, escrita en letra ligada
// escolar sobre pauta de cuatro líneas. El primer renglón es la muestra; el resto
// queda en blanco para copiarla. Una hoja A4 por falta.

// Letra ligada escolar (la de los cuadernos de caligrafía). Medida en Chrome:
// altura de la x = 0,52 em, ascendentes = 1,02 em, descendentes = 0,52 em.
const cursive = Playwrite_ES({ weight: "400" });

// Medidas en milímetros. X_HEIGHT es el tamaño de una letra de cuaderno normal.
const X_HEIGHT = 3;
const FONT_SIZE = X_HEIGHT / 0.52;
const ROW = 3 * X_HEIGHT; // ascendente + cuerpo + descendente
const GAP = 5;
const WIDTH = 190;
// Cuántos renglones entran debajo del encabezado en una A4 con márgenes de 10 mm.
const ROWS = 17;
// Caracteres por renglón: medido en Chrome, caben ≈ 58 en 190 mm.
const CHARS_PER_ROW = 56;

// Parte la norma en renglones sin cortar palabras.
function splitRows(text: string) {
  const rows: string[] = [];
  let current = "";
  for (const word of text.split(/\s+/)) {
    if (current && `${current} ${word}`.length > CHARS_PER_ROW) {
      rows.push(current);
      current = word;
    } else current = current ? `${current} ${word}` : word;
  }
  if (current) rows.push(current);
  return rows;
}

// Un renglón de pauta: ascendente, cuerpo de la x, línea base (la más marcada) y descendente.
function Pauta({ text }: { text?: string }) {
  const base = 2 * X_HEIGHT;
  return (
    <svg viewBox={`0 0 ${WIDTH} ${ROW}`} width="100%" className="block overflow-visible" style={{ aspectRatio: `${WIDTH} / ${ROW}` }} aria-hidden={!text}>
      <line x1="0" x2={WIDTH} y1="0.1" y2="0.1" stroke="#000" strokeOpacity="0.45" strokeWidth="0.15" />
      <line x1="0" x2={WIDTH} y1={X_HEIGHT} y2={X_HEIGHT} stroke="#000" strokeOpacity="0.45" strokeWidth="0.15" strokeDasharray="1 0.8" />
      <line x1="0" x2={WIDTH} y1={base} y2={base} stroke="#000" strokeWidth="0.3" />
      <line x1="0" x2={WIDTH} y1={ROW - 0.1} y2={ROW - 0.1} stroke="#000" strokeOpacity="0.45" strokeWidth="0.15" />
      {text && (
        <text x="2" y={base} fontSize={FONT_SIZE} fontFamily={cursive.style.fontFamily} fill="#000">
          {text}
        </text>
      )}
    </svg>
  );
}

export function CalligraphySheet({ code, student, date, gradeSection, norm, index, total }: { code: string; student: string; date: string; gradeSection: string; norm: string; index: number; total: number }) {
  const lines = splitRows(norm);
  // La muestra y sus copias van en grupos completos: si la norma ocupa dos
  // renglones, cada copia también ocupa dos.
  const groups = Math.max(2, Math.floor(ROWS / lines.length));

  return (
    <article className="print-page mx-auto flex w-full max-w-[210mm] flex-col gap-3 rounded-xl border border-border bg-white p-8 text-[13px] leading-snug text-black print:max-w-none print:rounded-none print:border-0 print:p-0">
      <header className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4 text-xs">
          <span className="font-semibold uppercase">Hoja de caligrafía</span>
          <span className="font-mono">
            Acta N.° {code} · Falta {index} de {total}
          </span>
        </div>
        <dl className="grid grid-cols-[auto_1fr_auto_auto] gap-x-3 gap-y-1 rounded-2xl border-2 border-black px-4 py-2">
          <dt className="font-semibold">Nombre:</dt>
          <dd>{student}</dd>
          <dt className="font-semibold">Fecha:</dt>
          <dd className="first-letter:uppercase">{date}</dd>
          <dt className="font-semibold">Grado y sección:</dt>
          <dd className="col-span-3">{gradeSection}</dd>
        </dl>
        <p>
          <b>INSTRUCCIONES:</b> Lee la norma de la primera línea y vuelve a escribirla en cada renglón, con buena letra.
        </p>
      </header>

      <div className="flex flex-col" style={{ gap: `${GAP}mm` }}>
        {Array.from({ length: groups }, (_, g) => lines.map((line, i) => <Pauta key={`${g}-${i}`} text={g === 0 ? line : undefined} />))}
      </div>
    </article>
  );
}
