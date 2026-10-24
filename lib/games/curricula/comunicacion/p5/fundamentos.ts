import * as P2 from "../../../generators/lengua/phonics2";
import { choose, mix, type ChoiceItem } from "../../../generators/lengua/bank";
import { f, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// 5.° de Primaria · banco de lectoescritura: agudas, graves, esdrújulas y
// sobresdrújulas con su regla de tilde, palabras de varias sílabas, prefijos y
// sufijos, y palabras frecuentes de escritura difícil (tildes, h, b/v, x, cc).


const STRESS = sorter(["Aguda", "Grave o llana", "Esdrújula", "Sobresdrújula"], "¿Qué tipo de palabra es, según su sílaba tónica?");
const STRESS_TYPES: ChoiceItem[] = [
  ...["ca-pi-tán", "ven-ce-dor", "a-le-lí", "ciu-dad", "in-glés", "des-pués", "na-riz", "a-quí"].map((x) => STRESS(x, 0)),
  ...["hués-ped", "cés-ped", "di-fí-cil", "ca-mi-se-ta", "ál-bum", "már-mol", "cua-der-no", "in-mó-vil"].map((x) => STRESS(x, 1)),
  ...["mur-cié-la-go", "ki-ló-me-tro", "pú-bli-co", "hé-ro-e", "o-cé-a-no", "es-drú-ju-la", "má-qui-na", "sí-la-ba"].map((x) => STRESS(x, 2)),
  ...["cuén-ta-me-lo", "dí-ga-se-lo", "rá-pi-da-men-te", "fá-cil-men-te", "de-vuél-ve-me-la", "ex-plí-ca-se-lo", "trá-e-me-lo", "úl-ti-ma-men-te"].map((x) => STRESS(x, 3)),
];
const TILDE: ChoiceItem[] = [
  w("¿Por qué «camión» lleva tilde?", "Es aguda y termina en n.", "Es grave y termina en vocal.", "Es esdrújula."), w("¿Por qué «árbol» lleva tilde?", "Es grave y no termina en n, s ni vocal.", "Es aguda y termina en l.", "Es esdrújula."),
  w("¿Por qué «pájaro» lleva tilde?", "Es esdrújula.", "Es aguda y termina en vocal.", "Es grave."), w("¿Por qué «pared» no lleva tilde?", "Es aguda, pero no termina en n, s ni vocal.", "Es grave y termina en d.", "Es esdrújula."),
  w("¿Por qué «mesa» no lleva tilde?", "Es grave y termina en vocal.", "Es aguda y termina en vocal.", "Es esdrújula y termina en a."), w("¿Por qué «compás» lleva tilde?", "Es aguda y termina en s.", "Es grave y termina en s.", "Es esdrújula."),
  w("¿Por qué «fácil» lleva tilde?", "Es grave y termina en l.", "Es aguda y termina en l.", "Es esdrújula."), w("¿Por qué «dígamelo» lleva tilde?", "Es sobresdrújula.", "Es aguda y termina en vocal.", "Es grave."),
];

const LONG_WORDS =
  "bi-blio-te-ca-ria i-ma-gi-na-ción ar-que-o-lo-gí-a con-ta-mi-na-ción fo-to-sín-te-sis hi-dro-e-léc-tri-ca re-fri-ge-ra-do-ra in-de-pen-den-cia la-bo-ra-to-rio ve-te-ri-na-rio ma-te-má-ti-ca en-ci-clo-pe-dia pa-le-on-to-lo-gí-a a-gra-de-ci-mien-to me-te-o-ro-lo-gí-a ex-tra-or-di-na-rio cons-truc-ción";
const LONG_READ = "contaminación conservación comunicación constitución construcción contradicción consideración concentración colaboración competición";

const LONG_SENTENCES: ChoiceItem[] = [
  f("La ___ estudia los restos de culturas antiguas, como Chavín.", "arqueología", "meteorología", "astrología"), f("El humo de las fábricas aumenta la ___ del aire.", "contaminación", "conservación", "concentración"),
  f("Gracias a la ___, las plantas fabrican su alimento con la luz.", "fotosíntesis", "fotografía", "hipótesis"), f("La central ___ produce energía con la fuerza del río.", "hidroeléctrica", "hidroavión", "electrizante"),
  f("En el ___ mezclamos vinagre y bicarbonato.", "laboratorio", "observatorio", "dormitorio"), f("El ___ vacunó a los perros del barrio.", "veterinario", "bibliotecario", "secretario"),
  f("Busqué «volcán» en la ___ de la biblioteca.", "enciclopedia", "ortopedia", "comedia"), f("La ___ anuncia lluvias para el fin de semana.", "meteorología", "paleontología", "mitología"),
  f("El Perú proclamó su ___ en 1821.", "independencia", "dependencia", "inteligencia"), f("Para escribir cuentos hace falta mucha ___.", "imaginación", "imitación", "iluminación"),
  f("La ___ estudia los fósiles de los dinosaurios.", "paleontología", "arqueología", "meteorología"), f("Le escribí una carta de ___ por su ayuda.", "agradecimiento", "aburrimiento", "atrevimiento"),
];

const AFFIX_SPLIT: ChoiceItem[] = [
  w("¿Cómo se separa «submarino» en prefijo y palabra base?", "sub + marino", "su + bmarino", "subma + rino"), w("¿Cómo se separa «malgastar» en prefijo y palabra base?", "mal + gastar", "ma + lgastar", "malgas + tar"),
  w("¿Cómo se separa «sobrevolar» en prefijo y palabra base?", "sobre + volar", "so + brevolar", "sobrevo + lar"), w("¿Cómo se separa «inmaduro» en prefijo y palabra base?", "in + maduro", "inma + duro", "i + nmaduro"),
  w("¿Cómo se separa «convivir» en prefijo y palabra base?", "con + vivir", "conv + ivir", "convi + vir"), w("¿Cómo se separa «anormal» en prefijo y palabra base?", "a + normal", "an + ormal", "anor + mal"),
  w("¿Cómo se separa «hermosura» en palabra base y sufijo?", "hermos(o) + ura", "her + mosura", "hermosu + ra"), w("¿Cómo se separa «educación» en palabra base y sufijo?", "educa(r) + ción", "edu + cación", "educaci + ón"),
  w("¿Cómo se separa «vendedor» en palabra base y sufijo?", "vend(er) + edor", "ven + dedor", "vende + dor"), w("¿Cómo se separa «claridad» en palabra base y sufijo?", "clar(o) + idad", "cla + ridad", "clarid + ad"),
  w("¿Cómo se separa «comprensible» en palabra base y sufijo?", "comprens + ible", "com + prensible", "comprensi + ble"), w("¿Cómo se separa «prolongar» en prefijo y palabra base?", "pro + longar", "prol + ongar", "prolon + gar"),
];
const AFFIX_SENTENCES: ChoiceItem[] = [
  f("El ___ navegó bajo el hielo del polo.", "submarino", "marinero", "ultramarino"), f("No debes ___ el agua: ciérrale el caño.", "malgastar", "gastar", "desgastar"),
  f("El cóndor suele ___ el cañón por las mañanas.", "sobrevolar", "volar bajo", "revolotear"), f("Ese mango está verde: todavía está ___.", "inmaduro", "maduro", "madurez"),
  f("En el aula aprendemos a ___ con respeto.", "convivir", "sobrevivir", "revivir"), f("Nevó en la costa: fue algo ___.", "anormal", "normal", "normalmente"),
  f("Todos admiraron la ___ del valle.", "hermosura", "hermoso", "hermosamente"), f("La ___ es un derecho de todos los niños.", "educación", "educado", "educar"),
  f("El ___ de frutas pregona desde temprano.", "vendedor", "venta", "vendible"), f("Su letra es clara y ___.", "comprensible", "comprensión", "comprender"),
  f("Me gusta la ___ con que explica la maestra.", "claridad", "claro", "aclarar"), f("El árbitro decidió ___ el partido cinco minutos.", "prolongar", "alargado", "longitud"),
];

const SIGHT = "excepto excelente exactamente extraño explicación además aún había hacia allí aquí quizá";
const SIGHT_SPELL = "excepto excelente extraño además había hacia allí aquí lección dirección";
const SIGHT_SENTENCES: ChoiceItem[] = [
  f("___ no ha llegado el bus de las ocho.", "Aún", "Aun", "Haún"), f("Ayer ___ mucha gente en la feria.", "había", "habían", "avía"),
  f("El río corre ___ el mar.", "hacia", "hacía", "asia"), f("Deja tu mochila ___, junto a la mía.", "aquí", "haquí", "a quí"),
  f("Me dio una ___ muy clara del problema.", "explicación", "esplicación", "explicasión"), f("Todos aprobaron, ___ dos alumnos.", "excepto", "ecepto", "exepto"),
  f("Tu trabajo quedó ___.", "excelente", "exelente", "eccelente"), f("Oí un ruido ___ en el techo.", "extraño", "estraño", "extranio"),
  f("Es amable y, ___, muy puntual.", "además", "ademas", "a demás"), f("Son ___ las tres de la tarde.", "exactamente", "esactamente", "exactamete"),
  f("___ vayamos al río el domingo.", "Quizá", "Quisá", "Quizaz"), f("Antes ___ frío todas las mañanas.", "hacía", "hacia", "asía"),
];

export const ROWS: Row[] = [
  ["agudas-esdrujulas", (r) => mix(r, [(q) => choose(q, "", STRESS_TYPES), (q) => choose(q, "", STRESS_TYPES), (q) => choose(q, "", TILDE)])],
  ["varias-silabas-1", (r) => P2.segmentList(r, LONG_WORDS)],
  ["varias-silabas-2", (r) => P2.listenChoose(r, LONG_READ)],
  ["varias-silabas-3", (r) => choose(r, "Completa la oración.", LONG_SENTENCES)],
  ["varias-silabas-4", (r) => P2.spellHeard(r, "laboratorio veterinario enciclopedia imaginación independencia matemática fotosíntesis arqueología construcción bibliotecaria", "a e i o u ó í l n r s t c")],

  ["prefijos-lectura-1", (r) => choose(r, "", AFFIX_SPLIT)],
  ["prefijos-lectura-2", (r) => choose(r, "Completa la oración.", AFFIX_SENTENCES)],

  ["frecuentes-1", (r) => mix(r, [(q) => P2.listenChoose(q, SIGHT), (q) => P2.spellHeard(q, SIGHT_SPELL, "a e i o u á í x c s z h b v ll")])],
  ["frecuentes-2", (r) => choose(r, "Completa la oración.", SIGHT_SENTENCES)],
];
