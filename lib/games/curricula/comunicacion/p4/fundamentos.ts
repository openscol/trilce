import * as P2 from "../../../generators/lengua/phonics2";
import { choose, mix, type ChoiceItem } from "../../../generators/lengua/bank";
import { f, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// 4.° de Primaria · banco de lectoescritura: palabras agudas, graves y
// esdrújulas según la sílaba tónica, palabras de varias sílabas, prefijos y
// sufijos, y palabras frecuentes de escritura difícil (tildes, b/v, h, c/s/z).


const STRESS = sorter(["Aguda (última sílaba)", "Grave o llana (penúltima)", "Esdrújula (antepenúltima)"], "¿Qué tipo de palabra es, según su sílaba tónica?");
const STRESS_TYPES: ChoiceItem[] = [
  ...["ca-mi-ón", "pa-red", "co-li-brí", "a-mis-tad", "can-ción", "re-loj", "ja-más", "fe-liz", "com-pás", "pin-tor"].map((x) => STRESS(x, 0)),
  ...["ár-bol", "me-sa", "lá-piz", "can-tan", "fá-cil", "ven-ta-na", "a-zú-car", "ca-rác-ter", "pe-lo-ta", "tú-nel"].map((x) => STRESS(x, 1)),
  ...["mú-si-ca", "pá-ja-ro", "te-lé-fo-no", "brú-ju-la", "sá-ba-do", "mé-di-co", "rá-pi-do", "ló-gi-ca", "pe-lí-cu-la", "plá-ta-no"].map((x) => STRESS(x, 2)),
];

const LONG_WORDS =
  "as-tro-nau-ta e-lec-tri-ci-dad fe-rro-ca-rril a-gri-cul-tu-ra ter-mó-me-tro ar-qui-tec-to or-ga-ni-za-ción des-cu-bri-mien-to lo-co-mo-to-ra pe-rio-dis-ta mul-ti-pli-ca-ción na-tu-ra-le-za co-mu-ni-ca-ción tem-pe-ra-tu-ra a-e-ro-puer-to in-ves-ti-ga-ción pa-ra-ca-í-das res-pon-sa-bi-li-dad";
const LONG_READ = "temperatura temporada tempestad terremoto territorio termómetro telescopio televisión tecnología temblorosa tranquilidad transporte";

const LONG_SENTENCES: ChoiceItem[] = [
  f("La enfermera midió mi fiebre con un ___.", "termómetro", "telescopio", "kilómetro"),
  f("El ___ flotaba dentro de la nave, lejos de la Tierra.", "astronauta", "arquitecto", "agricultor"),
  f("Sin ___, no funcionan los focos ni la refrigeradora.", "electricidad", "elasticidad", "tranquilidad"),
  f("La ___ entrevistó al alcalde para el noticiero.", "periodista", "pianista", "electricista"),
  f("En el valle, la ___ da papas, maíz y habas.", "agricultura", "arquitectura", "temperatura"),
  f("El ___ diseñó los planos de la nueva escuela.", "arquitecto", "astronauta", "periodista"),
  f("El avión aterrizó en el ___ a las seis de la tarde.", "aeropuerto", "aeroplano", "ferrocarril"),
  f("Cuidar a mi perro es una gran ___.", "responsabilidad", "multiplicación", "investigación"),
  f("Miramos los anillos de Saturno con un ___.", "telescopio", "termómetro", "microscopio"),
  f("El ___ cruzó los Andes por un puente muy alto.", "ferrocarril", "paracaídas", "aeropuerto"),
  f("Hoy la ___ bajó a cinco grados y nos abrigamos.", "temperatura", "temporada", "agricultura"),
  f("El ___ de la papa ayudó a alimentar al mundo entero.", "descubrimiento", "organización", "comunicación"),
];

const AFFIX_SPLIT: ChoiceItem[] = [
  w("¿Cómo se separa «incompleto» en prefijo y palabra base?", "in + completo", "inco + mpleto", "incom + pleto"),
  w("¿Cómo se separa «bisabuelo» en prefijo y palabra base?", "bis + abuelo", "bi + sabuelo", "bisa + buelo"),
  w("¿Cómo se separa «supermercado» en prefijo y palabra base?", "super + mercado", "su + permercado", "supermer + cado"),
  w("¿Cómo se separa «antiácido» en prefijo y palabra base?", "anti + ácido", "an + tiácido", "antiá + cido"),
  w("¿Cómo se separa «sobrecarga» en prefijo y palabra base?", "sobre + carga", "so + brecarga", "sobrecar + ga"),
  w("¿Cómo se separa «desagradable» en prefijo y palabra base?", "des + agradable", "desa + gradable", "de + sagradable"),
  w("¿Cómo se separa «extraordinario» en prefijo y palabra base?", "extra + ordinario", "ex + traordinario", "extraor + dinario"),
  w("¿Cómo se separa «jardinero» en palabra base y sufijo?", "jardín + ero", "jar + dinero", "jardine + ro"),
  w("¿Cómo se separa «peligroso» en palabra base y sufijo?", "peligr(o) + oso", "pe + ligroso", "peligro + so"),
  w("¿Cómo se separa «lavable» en palabra base y sufijo?", "lav(ar) + able", "la + vable", "lavab + le"),
  w("¿Cómo se separa «tranquilamente» en palabra base y sufijo?", "tranquila + mente", "tranqui + lamente", "tranquilamen + te"),
  w("¿Cómo se separa «movimiento» en palabra base y sufijo?", "mov(er) + imiento", "movi + miento", "mo + vimiento"),
];

const AFFIX_SENTENCES: ChoiceItem[] = [
  f("Me faltan dos figuritas: mi álbum está ___.", "incompleto", "completo", "completar"),
  f("El papá de mi abuelo es mi ___.", "bisabuelo", "abuelito", "nieto mayor"),
  f("El olor de la basura es muy ___.", "desagradable", "agradable", "agradecido"),
  f("El ___ riega las plantas del parque cada mañana.", "jardinero", "jardín", "ajardinado"),
  f("Cruzar la pista sin mirar es ___.", "peligroso", "peligro", "peligrar"),
  f("Esta casaca es ___: se puede meter a la lavadora.", "lavable", "lavandería", "relavar"),
  f("El gato caminó ___ sobre el techo.", "tranquilamente", "tranquilidad", "intranquilo"),
  f("El camión no pudo subir la cuesta por la ___ que llevaba.", "sobrecarga", "descarga", "cargador"),
  f("Vimos un arcoíris doble: fue un momento ___.", "extraordinario", "ordinario", "ordinariamente"),
  f("Desde la ventana vi el ___ de las olas.", "movimiento", "inmóvil", "movedizo"),
  f("Tomó una pastilla ___ para el ardor de estómago.", "antiácida", "ácida", "acidez"),
  f("Compramos el arroz y la leche en el ___.", "supermercado", "mercadería", "mercader"),
];

const SIGHT = "quizás además todavía también tampoco mientras entonces aunque durante después excepto incluso apenas";
const SIGHT_SPELL = "quizás además todavía también tampoco después través había hacia jamás";
const SIGHT_SENTENCES: ChoiceItem[] = [
  f("No sé si iré a la fiesta: ___ me quede en casa.", "quizás", "además", "todavía"),
  f("No me gusta la sopa fría y a mi hermano ___.", "tampoco", "también", "todavía"),
  f("Todos fueron al paseo, ___ Luis, que estaba enfermo.", "excepto", "incluso", "además"),
  f("Llovía tanto que ___ los patos buscaron refugio.", "incluso", "excepto", "apenas"),
  f("Estaba tan cansado que ___ pude abrir los ojos.", "apenas", "además", "incluso"),
  f("Es un buen jugador y, ___, un gran compañero.", "además", "apenas", "excepto"),
  f("Terminé el libro, ___ era muy largo.", "aunque", "porque", "entonces"),
  f("Caminamos ___ el río para llegar más rápido.", "hacia", "desde", "durante"),
  f("Miramos la lluvia a ___ de la ventana.", "través", "pesar", "causa"),
  f("___ el recreo, jugamos a las chapadas.", "Durante", "Mientras", "Aunque"),
  f("Yo pongo la mesa ___ tú sirves el arroz.", "mientras", "durante", "excepto"),
  f("Son las diez y el bus ___ no llega.", "todavía", "tampoco", "quizás"),
];

export const ROWS: Row[] = [
  ["agudas-graves", (r) => choose(r, "", STRESS_TYPES)],
  ["varias-silabas-1", (r) => P2.segmentList(r, LONG_WORDS)],
  ["varias-silabas-2", (r) => P2.listenChoose(r, LONG_READ)],
  ["varias-silabas-3", (r) => choose(r, "Completa la oración.", LONG_SENTENCES)],
  ["varias-silabas-4", (r) => P2.spellHeard(r, "astronauta termómetro naturaleza periodista arquitecto ferrocarril locomotora aeropuerto telescopio territorio", "a e i o u ó l n r s t")],

  ["prefijos-lectura-1", (r) => choose(r, "", AFFIX_SPLIT)],
  ["prefijos-lectura-2", (r) => choose(r, "Completa la oración.", AFFIX_SENTENCES)],

  ["frecuentes-1", (r) => mix(r, [(q) => P2.listenChoose(q, SIGHT), (q) => P2.spellHeard(q, SIGHT_SPELL, "a e i o u á é í s z b v h c")])],
  ["frecuentes-2", (r) => choose(r, "Completa la oración.", SIGHT_SENTENCES)],
];
