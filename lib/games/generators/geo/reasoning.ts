import type { Rng } from "../../rng";
import type { Question } from "../../types";
import { choiceQ, fixedQ, table } from "../kit";

// Geometría: lógica (condicionales, recíprocos, tablas de verdad), pasos de
// construcciones con regla y compás, y razones de demostraciones. Las
// construcciones y demostraciones de IXL piden arrastrar o dibujar; aquí se
// practican eligiendo el paso siguiente o la razón que justifica cada paso.

// ---------------------------------------------------------------------------
// Lógica

// [p (hipótesis), p como conclusión, no p, no p (conclusión), q, q como conclusión,
//  no q, no q (conclusión), ¿p → q es verdadera?, ¿q → p es verdadera?, contraejemplo de p → q]
type Cond = [string, string, string, string, string, string, string, string, boolean, boolean, string];
const CONDS: Cond[] = [
  ["un número es múltiplo de 4", "es múltiplo de 4", "un número no es múltiplo de 4", "no es múltiplo de 4", "un número es par", "es par", "un número no es par", "no es par", true, false, ""],
  ["un número es primo", "es primo", "un número no es primo", "no es primo", "un número es impar", "es impar", "un número no es impar", "no es impar", false, false, "El 2: es primo y no es impar."],
  ["una figura es un cuadrado", "es un cuadrado", "una figura no es un cuadrado", "no es un cuadrado", "una figura es un rectángulo", "es un rectángulo", "una figura no es un rectángulo", "no es un rectángulo", true, false, ""],
  ["dos ángulos son opuestos por el vértice", "son opuestos por el vértice", "dos ángulos no son opuestos por el vértice", "no son opuestos por el vértice", "dos ángulos son congruentes", "son congruentes", "dos ángulos no son congruentes", "no son congruentes", true, false, ""],
  ["un ángulo mide 90°", "mide 90°", "un ángulo no mide 90°", "no mide 90°", "un ángulo es recto", "es recto", "un ángulo no es recto", "no es recto", true, true, ""],
  ["x² = 25", "x² = 25", "x² ≠ 25", "x² ≠ 25", "x = 5", "x = 5", "x ≠ 5", "x ≠ 5", false, true, "x = −5: cumple x² = 25, pero x ≠ 5."],
  ["un triángulo es equilátero", "es equilátero", "un triángulo no es equilátero", "no es equilátero", "un triángulo es isósceles", "es isósceles", "un triángulo no es isósceles", "no es isósceles", true, false, ""],
  ["un animal es un ave", "es un ave", "un animal no es un ave", "no es un ave", "un animal puede volar", "puede volar", "un animal no puede volar", "no puede volar", false, false, "El pingüino: es un ave y no puede volar."],
  ["un polígono tiene tres lados", "tiene tres lados", "un polígono no tiene tres lados", "no tiene tres lados", "un polígono es un triángulo", "es un triángulo", "un polígono no es un triángulo", "no es un triángulo", true, true, ""],
  ["un número es divisible entre 6", "es divisible entre 6", "un número no es divisible entre 6", "no es divisible entre 6", "un número es divisible entre 3", "es divisible entre 3", "un número no es divisible entre 3", "no es divisible entre 3", true, false, ""],
  ["un cuadrilátero es un rombo", "es un rombo", "un cuadrilátero no es un rombo", "no es un rombo", "un cuadrilátero tiene sus cuatro lados iguales", "tiene sus cuatro lados iguales", "un cuadrilátero no tiene sus cuatro lados iguales", "no tiene sus cuatro lados iguales", true, true, ""],
  ["dos rectas no se cortan", "no se cortan", "dos rectas se cortan", "se cortan", "dos rectas son paralelas", "son paralelas", "dos rectas no son paralelas", "no son paralelas", false, true, "Dos rectas alabeadas: no se cortan y no son paralelas (están en planos distintos)."],
];
const ifThen = (h: string, c: string) => `Si ${h}, entonces ${c}.`;
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

// A.1: hipótesis y conclusión.
export function hypothesisConclusion(r: Rng): Question {
  const c = r.pick(CONDS);
  const hyp = r.chance(0.5);
  return choiceQ(r, `En el condicional «${ifThen(c[0], c[5])}», ¿cuál es la ${hyp ? "hipótesis" : "conclusión"}?`, hyp ? cap(c[0]) : cap(c[5]), hyp ? [cap(c[5]), cap(c[2]), cap(c[7])] : [cap(c[0]), cap(c[7]), cap(c[2])], "La hipótesis es lo que va después de «si»; la conclusión, lo que va después de «entonces».", undefined, hyp ? "hipotesis" : "conclusion");
}

// A.2: contraejemplos (con opciones del mismo tema que no lo son).
const COUNTER: [string, string, string[]][] = [
  ["Si un número es primo, entonces es impar.", "El 2: es primo y no es impar.", ["El 3: es primo y es impar.", "El 9: no es primo y es impar.", "El 4: no es primo y no es impar."]],
  ["Si un animal es un ave, entonces puede volar.", "El pingüino: es un ave y no puede volar.", ["La paloma: es un ave y puede volar.", "El murciélago: no es un ave y puede volar.", "El perro: no es un ave y no puede volar."]],
  ["Si x² = 25, entonces x = 5.", "x = −5: cumple x² = 25, pero x ≠ 5.", ["x = 5: cumple x² = 25 y x = 5.", "x = 25: no cumple x² = 25.", "x = −25: no cumple x² = 25."]],
  ["Si dos rectas no se cortan, entonces son paralelas.", "Dos rectas alabeadas: no se cortan y no son paralelas.", ["Dos rectas paralelas: no se cortan y son paralelas.", "Dos rectas secantes: se cortan y no son paralelas.", "Dos rectas perpendiculares: se cortan en ángulo recto."]],
  ["Si un cuadrilátero tiene cuatro lados iguales, entonces es un cuadrado.", "Un rombo con ángulos de 60° y 120°.", ["Un cuadrado de 3 cm de lado.", "Un rectángulo de 2 cm × 5 cm.", "Un trapecio isósceles."]],
  ["Si un número es par, entonces es múltiplo de 4.", "El 6: es par y no es múltiplo de 4.", ["El 8: es par y es múltiplo de 4.", "El 7: no es par y no es múltiplo de 4.", "El 12: es par y es múltiplo de 4."]],
  ["Si dos ángulos son suplementarios, entonces forman un par lineal.", "Dos ángulos de 100° y 80° en lugares distintos de la figura.", ["Dos ángulos adyacentes de 100° y 80° sobre una recta.", "Dos ángulos de 30° y 60°.", "Dos ángulos opuestos por el vértice de 70°."]],
];
export function counterexample(r: Rng): Question {
  const [st, good, wrong] = r.pick(COUNTER);
  return choiceQ(r, `¿Cuál es un contraejemplo de «${st}»?`, good, wrong, "Un contraejemplo cumple la hipótesis pero no la conclusión.", undefined, "contraejemplo");
}

// A.3: condicionales (¿verdadero o falso?).
export function conditionalTruth(r: Rng): Question {
  const c = r.pick(CONDS);
  return fixedQ(`¿El condicional «${ifThen(c[0], c[5])}» es verdadero o falso?`, ["Verdadero", "Falso"], c[8] ? "Verdadero" : "Falso", c[8] ? "Siempre que se cumple la hipótesis, se cumple la conclusión." : `Es falso: hay un contraejemplo. ${c[10]}`, undefined, c[8] ? "verdadero" : "falso");
}

// A.4: negaciones.
export function negation(r: Rng): Question {
  const c = r.pick(CONDS);
  const useP = r.chance(0.5);
  const st = cap(useP ? c[0] : c[4]);
  const good = cap(useP ? c[2] : c[6]);
  return choiceQ(r, `¿Cuál es la negación de «${st}»?`, good, [st, cap(useP ? c[6] : c[2]), cap(useP ? c[4] : c[0])], "La negación afirma lo contrario: se agrega o quita «no».", undefined, "negacion");
}

const KINDS = ["recíproco", "inverso", "contrarrecíproco"];
// A.5: recíproco, inverso y contrarrecíproco.
export function converseInverse(r: Rng): Question {
  const c = r.pick(CONDS);
  const k = r.int(0, 2);
  const forms = [ifThen(c[4], c[1]), ifThen(c[2], c[7]), ifThen(c[6], c[3])];
  if (r.chance(0.5)) return fixedQ(`Para «${ifThen(c[0], c[5])}», ¿cuál es el ${KINDS[k]}?`, r.shuffle([...forms, ifThen(c[0], c[7])]), forms[k], ["Recíproco: se intercambian hipótesis y conclusión.", "Inverso: se niegan las dos.", "Contrarrecíproco: se intercambian y se niegan las dos (siempre tiene el mismo valor de verdad que el original)."][k], undefined, KINDS[k]);
  const truth = [c[9], c[9], c[8]][k];
  return fixedQ(`El ${KINDS[k]} de «${ifThen(c[0], c[5])}» es «${forms[k]}». ¿Es verdadero o falso?`, ["Verdadero", "Falso"], truth ? "Verdadero" : "Falso", k === 2 ? "El contrarrecíproco tiene el mismo valor de verdad que el condicional original." : "El recíproco y el inverso tienen el mismo valor de verdad entre sí (no necesariamente el del original).", undefined, KINDS[k]);
}

// A.6: bicondicionales.
export function biconditional(r: Rng): Question {
  const c = r.pick(CONDS);
  const ok = c[8] && c[9];
  return fixedQ(`¿Es verdadero el bicondicional «${cap(c[0])} si y solo si ${c[5]}»?`, ["Verdadero", "Falso"], ok ? "Verdadero" : "Falso", ok ? "El condicional y su recíproco son verdaderos." : `Para ser verdadero, el condicional y su recíproco deben ser verdaderos; ${c[8] ? "el recíproco" : "el condicional"} es falso.`, undefined, ok ? "verdadero" : "falso");
}

type Op = "∧" | "∨" | "→" | "↔";
const evalOp = (op: Op, p: boolean, q: boolean) => (op === "∧" ? p && q : op === "∨" ? p || q : op === "→" ? !p || q : p === q);
const VF = (b: boolean) => (b ? "V" : "F");
const OP_NAME: Record<Op, string> = { "∧": "p ∧ q (p y q)", "∨": "p ∨ q (p o q)", "→": "p → q (si p, entonces q)", "↔": "p ↔ q (p si y solo si q)" };
// A.7 / A.8: tablas de verdad y valores de verdad.
export function truthTable(r: Rng, table7: boolean): Question {
  const op = r.pick(["∧", "∨", "→", "↔"] as Op[]);
  const neg = r.chance(0.3);
  const rows: [boolean, boolean][] = [[true, true], [true, false], [false, true], [false, false]];
  const f = (p: boolean, q: boolean) => evalOp(op, p, neg ? !q : q);
  const label = neg ? `p ${op} ~q (~q es «no q»)` : OP_NAME[op];
  const why = { "∧": "«y» solo es verdadero si las dos partes son verdaderas.", "∨": "«o» es falso solo si las dos partes son falsas.", "→": "El condicional solo es falso si la hipótesis es verdadera y la conclusión falsa.", "↔": "El bicondicional es verdadero si las dos partes tienen el mismo valor." }[op];
  const i = r.int(0, 3);
  if (table7) {
    const visual = table(["p", "q", ...(neg ? ["~q"] : []), label.split(" (")[0]], rows.map(([p, q], j) => [VF(p), VF(q), ...(neg ? [VF(!q)] : []), j === i ? "?" : VF(f(p, q))]));
    return fixedQ("Completa la tabla de verdad. ¿Qué va en lugar de «?»?", ["V", "F"], VF(f(...rows[i])), why, visual, op);
  }
  const [p, q] = rows[i];
  return fixedQ(`Si p es ${p ? "verdadera" : "falsa"} y q es ${q ? "verdadera" : "falsa"}, ¿cuál es el valor de verdad de ${label}?`, ["Verdadero", "Falso"], f(p, q) ? "Verdadero" : "Falso", why, undefined, op);
}

// ---------------------------------------------------------------------------
// Construcciones con regla y compás

const CONSTRUCTIONS: Record<string, [string, string[]]> = {
  segment: ["un segmento congruente a AB", ["Trazar una semirrecta con origen en un punto C.", "Abrir el compás con la medida de AB.", "Con centro en C, marcar un arco que corte la semirrecta en D.", "CD es congruente a AB."]],
  bisector: ["la mediatriz (y el punto medio) del segmento AB", ["Abrir el compás más de la mitad de AB.", "Con centro en A, trazar arcos arriba y abajo del segmento.", "Con la misma abertura y centro en B, trazar arcos que corten a los anteriores.", "Unir los dos puntos de corte: esa recta es la mediatriz y corta a AB en su punto medio."]],
  angleBisector: ["la bisectriz del ángulo A", ["Con centro en A, trazar un arco que corte los dos lados del ángulo.", "Con centro en cada punto de corte, trazar arcos de igual abertura que se crucen dentro del ángulo.", "Unir A con el punto donde se cruzan los arcos: es la bisectriz."]],
  angle: ["un ángulo congruente al ángulo A", ["Trazar una semirrecta con origen en B.", "Con centro en A, trazar un arco que corte los lados del ángulo; con la misma abertura y centro en B, trazar un arco que corte la semirrecta.", "Medir con el compás la distancia entre los cortes del ángulo A.", "Con esa abertura, desde el corte de la semirrecta, marcar un arco que corte el arco anterior.", "Unir B con ese punto: el ángulo es congruente al ángulo A."]],
  perpendicular: ["una recta perpendicular a la recta ℓ que pasa por el punto P", ["Con centro en P, trazar un arco que corte a ℓ en dos puntos.", "Con centro en cada punto de corte, trazar arcos de igual abertura que se crucen.", "Unir P con el punto donde se cruzan los arcos: es perpendicular a ℓ."]],
  parallel: ["una recta paralela a la recta ℓ que pasa por el punto P", ["Trazar una recta que pase por P y corte a ℓ.", "Copiar en P el ángulo que forma esa recta con ℓ (ángulos correspondientes).", "La recta que forma ese ángulo copiado es paralela a ℓ."]],
  equilateral: ["un triángulo equilátero de lado AB", ["Abrir el compás con la medida de AB.", "Con centro en A, trazar un arco.", "Con la misma abertura y centro en B, trazar otro arco que corte al primero en C.", "Unir A, B y C."]],
  hexagon: ["un hexágono regular", ["Trazar una circunferencia.", "Sin cambiar la abertura (igual al radio), marcar arcos consecutivos sobre la circunferencia.", "Se obtienen seis puntos.", "Unir los seis puntos en orden."]],
  square: ["un cuadrado de lado AB", ["Trazar la perpendicular a AB que pasa por A.", "Con abertura AB y centro en A, marcar D sobre la perpendicular.", "Con abertura AB, trazar arcos desde B y desde D que se corten en C.", "Unir A, B, C y D."]],
  circumcenter: ["el circuncentro de un triángulo", ["Construir la mediatriz de un lado.", "Construir la mediatriz de otro lado.", "El punto donde se cortan las mediatrices es el circuncentro (equidista de los tres vértices)."]],
  incenter: ["el incentro de un triángulo", ["Construir la bisectriz de un ángulo.", "Construir la bisectriz de otro ángulo.", "El punto donde se cortan las bisectrices es el incentro (equidista de los tres lados)."]],
  centroid: ["el baricentro de un triángulo", ["Construir el punto medio de un lado.", "Unir ese punto medio con el vértice opuesto (mediana).", "Repetir con otro lado: donde se cortan las medianas está el baricentro."]],
  orthocenter: ["el ortocentro de un triángulo", ["Construir la perpendicular a un lado que pasa por el vértice opuesto (altura).", "Construir la altura desde otro vértice.", "El punto donde se cortan las alturas es el ortocentro."]],
  tangent: ["una recta tangente a la circunferencia de centro O que pasa por el punto P de la circunferencia", ["Trazar el radio OP y prolongarlo.", "Construir la perpendicular a OP que pasa por P.", "Esa perpendicular es tangente a la circunferencia en P."]],
  inscribedTriangle: ["un triángulo equilátero inscrito en una circunferencia", ["Con abertura igual al radio, marcar seis puntos consecutivos sobre la circunferencia.", "Elegir uno de cada dos puntos (tres en total).", "Unir esos tres puntos."]],
  inscribedSquare: ["un cuadrado inscrito en una circunferencia", ["Trazar un diámetro.", "Construir la mediatriz de ese diámetro (otro diámetro perpendicular).", "Unir los cuatro extremos de los diámetros."]],
  inscribedHexagon: ["un hexágono regular inscrito en una circunferencia", ["Abrir el compás con la medida del radio.", "Marcar arcos consecutivos sobre la circunferencia hasta obtener seis puntos.", "Unir los seis puntos en orden."]],
  inscribedCircle: ["la circunferencia inscrita en un triángulo", ["Construir las bisectrices de dos ángulos; se cortan en el incentro I.", "Trazar la perpendicular desde I a un lado.", "Con centro en I y radio hasta ese pie de perpendicular, trazar la circunferencia."]],
  circumscribedCircle: ["la circunferencia circunscrita a un triángulo", ["Construir las mediatrices de dos lados; se cortan en el circuncentro O.", "Con centro en O y radio hasta un vértice, trazar la circunferencia (pasa por los tres vértices)."]],
};
// Construcciones: ¿cuál es el paso siguiente? / ¿qué se construye?
export function construction(r: Rng, keys: string[]): Question {
  const key = r.pick(keys);
  const [name, steps] = CONSTRUCTIONS[key];
  if (r.chance(0.35)) {
    const others = Object.keys(CONSTRUCTIONS).filter((k) => k !== key).map((k) => cap(CONSTRUCTIONS[k][0]));
    return choiceQ(r, `¿Qué se construye con estos pasos?\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`, cap(name), r.shuffle(others.filter((o) => o !== cap(name))).slice(0, 3), `Los pasos construyen ${name}.`, undefined, key);
  }
  const i = r.int(1, steps.length - 1);
  const shown = steps.slice(0, i).map((s, j) => `${j + 1}. ${s}`).join("\n");
  const wrong = [...steps.filter((_, j) => j !== i), ...Object.values(CONSTRUCTIONS).filter((c) => c[0] !== name).flatMap((c) => c[1])];
  // Distractores de largo parecido al paso correcto (para que no se adivine por el largo).
  const near = r.shuffle([...new Set(wrong)].filter((w) => w !== steps[i])).sort((p, q) => Math.abs(p.length - steps[i].length) - Math.abs(q.length - steps[i].length)).slice(0, 6);
  return choiceQ(r, `Para construir ${name}, ya se hizo lo siguiente:\n${shown}\n¿Cuál es el paso siguiente?`, steps[i], r.shuffle(near).slice(0, 3), `El paso ${i + 1} es: ${steps[i]}`, undefined, key);
}

// ---------------------------------------------------------------------------
// Demostraciones: ¿qué razón justifica el paso?

type ProofStep = [statement: string, reason: string];
const PROOFS: Record<string, { reasons: string[]; steps: ProofStep[] }> = {
  angles: {
    reasons: ["Postulado del par lineal", "Teorema de los ángulos opuestos por el vértice", "Definición de ángulos complementarios", "Postulado de la suma de ángulos", "Definición de bisectriz", "Propiedad transitiva", "Propiedad de sustitución", "Teorema de los complementos de ángulos congruentes"],
    steps: [
      ["∠1 y ∠2 forman un par lineal, así que m∠1 + m∠2 = 180°.", "Postulado del par lineal"],
      ["∠1 y ∠3 son opuestos por el vértice, así que ∠1 ≅ ∠3.", "Teorema de los ángulos opuestos por el vértice"],
      ["m∠ABD + m∠DBC = m∠ABC.", "Postulado de la suma de ángulos"],
      ["BD es bisectriz de ∠ABC, así que ∠ABD ≅ ∠DBC.", "Definición de bisectriz"],
      ["∠A y ∠B son complementarios, así que m∠A + m∠B = 90°.", "Definición de ángulos complementarios"],
      ["∠1 ≅ ∠2 y ∠2 ≅ ∠3, así que ∠1 ≅ ∠3.", "Propiedad transitiva"],
      ["m∠1 = 40° y m∠1 + m∠2 = 90°, así que 40° + m∠2 = 90°.", "Propiedad de sustitución"],
      ["∠1 y ∠2 son complementos de ∠3, así que ∠1 ≅ ∠2.", "Teorema de los complementos de ángulos congruentes"],
    ],
  },
  parallel: {
    reasons: ["Postulado de los ángulos correspondientes", "Teorema de los ángulos alternos internos", "Teorema de los ángulos alternos externos", "Teorema de los ángulos conjugados internos", "Recíproco del postulado de los ángulos correspondientes", "Recíproco del teorema de los ángulos alternos internos", "Teorema de los ángulos opuestos por el vértice", "Propiedad transitiva del paralelismo"],
    steps: [
      ["ℓ ∥ m, así que los ángulos correspondientes ∠1 y ∠5 son congruentes.", "Postulado de los ángulos correspondientes"],
      ["ℓ ∥ m, así que los ángulos alternos internos ∠3 y ∠6 son congruentes.", "Teorema de los ángulos alternos internos"],
      ["ℓ ∥ m, así que los ángulos alternos externos ∠1 y ∠8 son congruentes.", "Teorema de los ángulos alternos externos"],
      ["ℓ ∥ m, así que m∠3 + m∠5 = 180°.", "Teorema de los ángulos conjugados internos"],
      ["∠1 ≅ ∠5 (correspondientes), así que ℓ ∥ m.", "Recíproco del postulado de los ángulos correspondientes"],
      ["∠3 ≅ ∠6 (alternos internos), así que ℓ ∥ m.", "Recíproco del teorema de los ángulos alternos internos"],
      ["ℓ ∥ m y m ∥ n, así que ℓ ∥ n.", "Propiedad transitiva del paralelismo"],
      ["∠2 y ∠3 son opuestos por el vértice, así que ∠2 ≅ ∠3.", "Teorema de los ángulos opuestos por el vértice"],
    ],
  },
  congruent: {
    reasons: ["Criterio LLL", "Criterio LAL", "Criterio ALA", "Criterio AAL", "Propiedad reflexiva", "Partes correspondientes de triángulos congruentes son congruentes (PCTCC)", "Definición de punto medio", "Teorema de los ángulos alternos internos"],
    steps: [
      ["AB ≅ DE, BC ≅ EF y AC ≅ DF, así que △ABC ≅ △DEF.", "Criterio LLL"],
      ["AB ≅ DE, ∠B ≅ ∠E y BC ≅ EF, así que △ABC ≅ △DEF.", "Criterio LAL"],
      ["∠A ≅ ∠D, AB ≅ DE y ∠B ≅ ∠E, así que △ABC ≅ △DEF.", "Criterio ALA"],
      ["∠A ≅ ∠D, ∠B ≅ ∠E y BC ≅ EF, así que △ABC ≅ △DEF.", "Criterio AAL"],
      ["BD ≅ BD (lado común de los dos triángulos).", "Propiedad reflexiva"],
      ["△ABC ≅ △DEF, así que AC ≅ DF.", "Partes correspondientes de triángulos congruentes son congruentes (PCTCC)"],
      ["M es punto medio de AB, así que AM ≅ MB.", "Definición de punto medio"],
      ["AB ∥ CD, así que ∠ABD ≅ ∠CDB.", "Teorema de los ángulos alternos internos"],
    ],
  },
  isosceles: {
    reasons: ["Teorema del triángulo isósceles (ángulos de la base)", "Recíproco del teorema del triángulo isósceles", "Definición de triángulo isósceles", "Corolario: un triángulo equilátero es equiángulo", "Teorema de la suma de los ángulos de un triángulo", "Criterio LAL", "Definición de bisectriz", "Propiedad reflexiva"],
    steps: [
      ["AB ≅ AC, así que ∠B ≅ ∠C.", "Teorema del triángulo isósceles (ángulos de la base)"],
      ["∠B ≅ ∠C, así que AB ≅ AC.", "Recíproco del teorema del triángulo isósceles"],
      ["△ABC tiene AB ≅ AC, así que es isósceles.", "Definición de triángulo isósceles"],
      ["△ABC es equilátero, así que ∠A ≅ ∠B ≅ ∠C.", "Corolario: un triángulo equilátero es equiángulo"],
      ["m∠A + m∠B + m∠C = 180°.", "Teorema de la suma de los ángulos de un triángulo"],
      ["AD es bisectriz de ∠A, así que ∠BAD ≅ ∠CAD.", "Definición de bisectriz"],
      ["AD ≅ AD.", "Propiedad reflexiva"],
    ],
  },
  similar: {
    reasons: ["Criterio AA de semejanza", "Criterio LLL de semejanza", "Criterio LAL de semejanza", "Teorema de proporcionalidad en el triángulo", "Definición de triángulos semejantes (lados proporcionales)", "Teorema de los ángulos opuestos por el vértice", "Propiedad reflexiva", "Postulado de los ángulos correspondientes"],
    steps: [
      ["∠A ≅ ∠D y ∠B ≅ ∠E, así que △ABC ∼ △DEF.", "Criterio AA de semejanza"],
      ["AB/DE = BC/EF = AC/DF, así que △ABC ∼ △DEF.", "Criterio LLL de semejanza"],
      ["AB/DE = AC/DF y ∠A ≅ ∠D, así que △ABC ∼ △DEF.", "Criterio LAL de semejanza"],
      ["DE ∥ BC, así que AD/DB = AE/EC.", "Teorema de proporcionalidad en el triángulo"],
      ["△ABC ∼ △DEF, así que AB/DE = BC/EF.", "Definición de triángulos semejantes (lados proporcionales)"],
      ["∠ACB y ∠DCE son opuestos por el vértice, así que son congruentes.", "Teorema de los ángulos opuestos por el vértice"],
      ["∠A ≅ ∠A (ángulo común).", "Propiedad reflexiva"],
      ["DE ∥ BC, así que ∠ADE ≅ ∠ABC.", "Postulado de los ángulos correspondientes"],
    ],
  },
  rightSimilar: {
    reasons: ["La altura sobre la hipotenusa forma triángulos semejantes al original", "Criterio AA de semejanza", "Media geométrica: la altura es media proporcional de los segmentos de la hipotenusa", "Media geométrica: cada cateto es media proporcional de la hipotenusa y su proyección", "Teorema de Pitágoras", "Propiedad reflexiva"],
    steps: [
      ["CD es la altura sobre la hipotenusa AB de △ABC, así que △ACD ∼ △ABC ∼ △CBD.", "La altura sobre la hipotenusa forma triángulos semejantes al original"],
      ["∠ACB y ∠ADC son rectos y ∠A ≅ ∠A, así que △ACB ∼ △ADC.", "Criterio AA de semejanza"],
      ["CD² = AD · DB.", "Media geométrica: la altura es media proporcional de los segmentos de la hipotenusa"],
      ["AC² = AD · AB.", "Media geométrica: cada cateto es media proporcional de la hipotenusa y su proyección"],
      ["AC² + BC² = AB².", "Teorema de Pitágoras"],
    ],
  },
  triangles: {
    reasons: ["Teorema del segmento medio de un triángulo", "Teorema de la mediatriz", "Teorema de la bisectriz", "Teorema de la desigualdad triangular", "El lado mayor está opuesto al ángulo mayor", "Teorema del baricentro", "Teorema del ángulo exterior", "Teorema de la suma de los ángulos de un triángulo"],
    steps: [
      ["D y E son puntos medios de AB y AC, así que DE ∥ BC y DE = BC/2.", "Teorema del segmento medio de un triángulo"],
      ["P está en la mediatriz de AB, así que PA = PB.", "Teorema de la mediatriz"],
      ["P está en la bisectriz de ∠A, así que P equidista de los lados del ángulo.", "Teorema de la bisectriz"],
      ["AB + BC > AC.", "Teorema de la desigualdad triangular"],
      ["m∠C > m∠A, así que AB > BC.", "El lado mayor está opuesto al ángulo mayor"],
      ["G es el baricentro, así que AG = (2/3) · AM.", "Teorema del baricentro"],
      ["m∠ACD = m∠A + m∠B (∠ACD es exterior).", "Teorema del ángulo exterior"],
      ["m∠A + m∠B + m∠C = 180°.", "Teorema de la suma de los ángulos de un triángulo"],
    ],
  },
  quadrilaterals: {
    reasons: ["Los lados opuestos de un paralelogramo son congruentes", "Los ángulos opuestos de un paralelogramo son congruentes", "Las diagonales de un paralelogramo se bisecan", "Los ángulos consecutivos de un paralelogramo son suplementarios", "Las diagonales de un rombo son perpendiculares", "Las diagonales de un rectángulo son congruentes", "Si las diagonales se bisecan, el cuadrilátero es un paralelogramo", "Si un par de lados opuestos es paralelo y congruente, es un paralelogramo"],
    steps: [
      ["ABCD es un paralelogramo, así que AB ≅ CD.", "Los lados opuestos de un paralelogramo son congruentes"],
      ["ABCD es un paralelogramo, así que ∠A ≅ ∠C.", "Los ángulos opuestos de un paralelogramo son congruentes"],
      ["ABCD es un paralelogramo, así que AE ≅ EC (E es el corte de las diagonales).", "Las diagonales de un paralelogramo se bisecan"],
      ["ABCD es un paralelogramo, así que m∠A + m∠B = 180°.", "Los ángulos consecutivos de un paralelogramo son suplementarios"],
      ["ABCD es un rombo, así que AC ⊥ BD.", "Las diagonales de un rombo son perpendiculares"],
      ["ABCD es un rectángulo, así que AC ≅ BD.", "Las diagonales de un rectángulo son congruentes"],
      ["AC y BD se bisecan, así que ABCD es un paralelogramo.", "Si las diagonales se bisecan, el cuadrilátero es un paralelogramo"],
      ["AB ∥ CD y AB ≅ CD, así que ABCD es un paralelogramo.", "Si un par de lados opuestos es paralelo y congruente, es un paralelogramo"],
    ],
  },
  pythagoras: {
    reasons: ["Área del cuadrado grande = área del cuadrado pequeño + área de los 4 triángulos", "Área de un triángulo = base × altura ÷ 2", "Desarrollo del binomio al cuadrado", "Se resta 2ab en los dos lados", "La altura sobre la hipotenusa forma triángulos semejantes al original"],
    steps: [
      ["(a + b)² = c² + 4 · (ab/2).", "Área del cuadrado grande = área del cuadrado pequeño + área de los 4 triángulos"],
      ["Cada triángulo rectángulo de catetos a y b tiene área ab/2.", "Área de un triángulo = base × altura ÷ 2"],
      ["a² + 2ab + b² = c² + 2ab.", "Desarrollo del binomio al cuadrado"],
      ["a² + b² = c².", "Se resta 2ab en los dos lados"],
    ],
  },
};
export function proofReason(r: Rng, domains: string[]): Question {
  const d = PROOFS[r.pick(domains)];
  const [st, reason] = r.pick(d.steps);
  return choiceQ(r, `En una demostración aparece este paso:\n«${st}»\n¿Qué razón lo justifica?`, reason, r.shuffle(d.reasons.filter((x) => x !== reason)).slice(0, 3), `${reason}.`, undefined, "razon");
}
