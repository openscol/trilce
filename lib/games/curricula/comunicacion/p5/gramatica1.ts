import * as P2 from "../../../generators/lengua/phonics2";
import { choose, mix, order, pickAll, pickInSentence, type ChoiceItem, type OrderItem } from "../../../generators/lengua/bank";
import type { Section } from "../../../types";
import { f, pt, s, sorter, w } from "../p3/helpers";
import type { Row } from "../p3/row";

// Gramática y ortografía, primera parte (IXL 5th grade ELA, LL-RR), con las
// reglas del castellano en lugar de las del inglés:
//   prefijos con-, over-, pro- → con-/com-, sobre-, pro-
//   sufijos -hood, -ion, -or, -ure → -dad, -ción/-sión, -or, -ura
//   common words (sets 1-4) → tilde en hiatos, mb/mp/nv, ll/y, x/cc/sc
//   cláusulas dependientes e independientes → proposición principal y subordinada
//   plurales en f, fe, o, y → plurales de palabras en -z, -y, -í/-ú y con cambio de tilde
//   posesivo con 's → pertenencia con de, del, de la, de los
//   who/whom/whose/which/that → que, quien, cuyo, el cual, donde
//   verbos modales → poder, deber, tener que, querer, soler
//   progressive → estar + gerundio      perfect → haber + participio

export const SECTIONS: Section[] = [
  { id: "LL", name: "Ortografía", icon: "✍️" },
  { id: "MM", name: "Oraciones, fragmentos y oraciones pegadas", icon: "💬" },
  { id: "NN", name: "Sustantivos", icon: "🏷️" },
  { id: "OO", name: "Pronombres", icon: "👤" },
  { id: "PP", name: "Tipos de verbos", icon: "🏃" },
  { id: "QQ", name: "Concordancia entre sujeto y verbo", icon: "🤝" },
  { id: "RR", name: "Tiempos verbales", icon: "⏳" },
];

// --- LL. Ortografía ----------------------------------------------------------

const WELL = "¿Cuál está bien escrita?";
const spell = (a: string, ...d: string[]): ChoiceItem => ({ a, d });

const PREFIX_SPELL: ChoiceItem[] = [
  spell("convivir", "combivir", "conbivir"), spell("compañero", "conpañero", "companiero"), spell("sobresaliente", "sobre saliente", "sobresalliente"), spell("proponer", "proponér", "propponer"),
  spell("combinar", "convinar", "conbinar"), spell("sobrevolar", "sobrebolar", "sobre volar"), spell("prolongar", "prolonjar", "prolomgar"), spell("compartir", "conpartir", "compartír"),
  spell("sobrehumano", "sobreumano", "sobre humano"), spell("proyecto", "prollecto", "proyeccto"), spell("conmover", "commover", "conmober"), spell("promover", "promober", "pronmover"),
];
const SUFFIX_SPELL: ChoiceItem[] = [
  spell("hermandad", "ermandad", "hermandat"), spell("canción", "cansión", "cancion"), spell("decisión", "decición", "desisión"), spell("pintor", "pintór", "pimtor"),
  spell("hermosura", "ermosura", "hermozura"), spell("amabilidad", "amavilidad", "amabilidat"), spell("emoción", "emosión", "emocion"), spell("televisión", "televición", "telebisión"),
  spell("inventor", "imventor", "inbentor"), spell("dulzura", "dulsura", "dulcura"), spell("vecindad", "vesindad", "becindad"), spell("comprensión", "comprención", "conprensión"),
];
const SET_HIATO: ChoiceItem[] = [
  spell("había", "habia", "abía"), spell("país", "pais", "paíz"), spell("maíz", "maiz", "maís"), spell("oído", "oido", "hoído"),
  spell("río", "rio", "rrío"), spell("todavía", "todavia", "todabía"), spell("baúl", "baul", "vaúl"), spell("reúne", "reune", "rehúne"),
  spell("día", "dia", "dya"), spell("tenía", "tenia", "tenya"), spell("raíz", "raiz", "raís"), spell("grúa", "grua", "gruha"),
];
const SET_MB: ChoiceItem[] = [
  spell("también", "tanbién", "tamvién"), spell("siempre", "sienpre", "ciempre"), spell("invierno", "imvierno", "inbierno"), spell("cambio", "canbio", "camvio"),
  spell("enviar", "embiar", "emviar"), spell("empezar", "enpezar", "empesar"), spell("hombro", "honbro", "ombro"), spell("invitar", "imvitar", "inbitar"),
  spell("campana", "canpana", "kampana"), spell("convertir", "combertir", "comvertir"), spell("tiempo", "tienpo", "tiémpo"), spell("embarcar", "enbarcar", "emvarcar"),
];
const SET_LLY: ChoiceItem[] = [
  spell("lluvia", "yuvia", "llubia"), spell("ayer", "aller", "hayer"), spell("calle", "caye", "kalle"), spell("leyeron", "lelleron", "leieron"),
  spell("desayuno", "desalluno", "dezayuno"), spell("orilla", "oriya", "horilla"), spell("proyecto", "prollecto", "proiecto"), spell("yema", "llema", "hiema"),
  spell("apoyo", "apollo", "hapoyo"), spell("brillante", "briyante", "brillamte"), spell("huyeron", "hulleron", "uyeron"), spell("bolsillo", "bolsiyo", "volsillo"),
];
const SET_X: ChoiceItem[] = [
  spell("examen", "esamen", "exámen"), spell("acción", "ación", "acsión"), spell("piscina", "picina", "pisina"), spell("explicar", "esplicar", "explicár"),
  spell("dirección", "direción", "direxión"), spell("escena", "ecena", "esena"), spell("excelente", "exelente", "eccelente"), spell("lección", "leción", "lexión"),
  spell("éxito", "ésito", "éccito"), spell("ascensor", "acensor", "asensor"), spell("extraño", "estraño", "extranio"), spell("disciplina", "diciplina", "disiplina"),
];

// --- MM. Oraciones -----------------------------------------------------------

const KIND = sorter(["Enunciativa", "Interrogativa", "Imperativa", "Exclamativa"], "¿Qué tipo de oración es?");
const SENTENCE_KIND: ChoiceItem[] = [
  ...["Los glaciares retroceden cada año.", "No conozco esa palabra.", "Me pregunto quién vendrá.", "El concierto empieza a las siete."].map((x) => KIND(x, 0)),
  ...["¿Cuántas lenguas se hablan en el Perú?", "¿Ya entregaste el informe?", "¿Por dónde se va al mercado?", "¿Quién escribió este poema?"].map((x) => KIND(x, 1)),
  ...["Subraya las ideas principales.", "No toquen los cables.", "Por favor, hablen más bajo.", "Revisa tu ortografía."].map((x) => KIND(x, 2)),
  ...["¡Qué alegría verte!", "¡Cuánta gente hay!", "¡Lo logramos!", "¡Qué frío hace!"].map((x) => KIND(x, 3)),
];
const SUBJECT_PREDICATE: ChoiceItem[] = [
  pt("¿Cuál es el sujeto completo?", "Los estudiantes de quinto grado organizaron una feria.", "Los estudiantes de quinto grado", "Los estudiantes", "de quinto grado organizaron una feria"), pt("¿Cuál es el predicado completo?", "Los estudiantes de quinto grado organizaron una feria.", "organizaron una feria", "organizaron", "de quinto grado organizaron"),
  pt("¿Cuál es el sujeto completo?", "En la cima del cerro brillaba una fogata enorme.", "una fogata enorme", "En la cima del cerro", "brillaba"), pt("¿Cuál es el predicado completo?", "El río de mi pueblo crece en febrero.", "crece en febrero", "de mi pueblo crece", "El río"),
  pt("¿Cuál es el sujeto completo?", "La hermana mayor de Rosa estudia medicina.", "La hermana mayor de Rosa", "Rosa", "mayor de Rosa estudia medicina"), pt("¿Cuál es el predicado completo?", "Mi abuelo y su perro caminan cada tarde por el malecón.", "caminan cada tarde por el malecón", "caminan cada tarde", "Mi abuelo y su perro caminan cada tarde"),
  pt("¿Cuál es el sujeto completo?", "Ayer llegó al puerto un barco de bandera japonesa.", "un barco de bandera japonesa", "Ayer llegó al puerto un barco", "al puerto"), pt("¿Cuál es el predicado completo?", "Las aves migratorias descansan en los humedales.", "descansan en los humedales", "en los humedales", "Las aves migratorias descansan"),
];
const SIMPLE_SP: ChoiceItem[] = [
  pt("¿Cuál es el núcleo del sujeto?", "Los estudiantes de quinto grado organizaron una feria.", "estudiantes", "grado", "feria"), pt("¿Cuál es el núcleo del predicado (el verbo)?", "Los estudiantes de quinto grado organizaron una feria.", "organizaron", "feria", "quinto"),
  pt("¿Cuál es el núcleo del sujeto?", "La hermana mayor de Rosa estudia medicina.", "hermana", "Rosa", "mayor"), pt("¿Cuál es el núcleo del predicado (el verbo)?", "El río de mi pueblo crece en febrero.", "crece", "río", "febrero"),
  pt("¿Cuál es el núcleo del sujeto?", "Las aves migratorias descansan en los humedales.", "aves", "humedales", "migratorias"), pt("¿Cuál es el núcleo del predicado (el verbo)?", "Ayer llegó al puerto un barco de bandera japonesa.", "llegó", "barco", "puerto"),
  pt("¿Cuál es el núcleo del sujeto?", "El antiguo reloj de la plaza marca las doce.", "reloj", "plaza", "antiguo"), pt("¿Cuál es el núcleo del predicado (el verbo)?", "El antiguo reloj de la plaza marca las doce.", "marca", "doce", "reloj"),
];

const COMPLETE = "Oración completa";
const FRAGMENT = "Fragmento";
const RUN_ON = "Oraciones pegadas";
const label = (list: string[], a: string, options: string[]): ChoiceItem[] => list.map((t) => ({ t, a, d: options.filter((o) => o !== a), tag: a }));
const COMPLETE_ITEMS = ["El museo exhibe piezas de la cultura Nasca.", "Cuando amaneció, partimos hacia la laguna.", "Nadie respondió la pregunta.", "Los comuneros limpiaron el canal.", "Aunque llovía, el partido continuó.", "La noticia sorprendió al pueblo."];
const FRAGMENT_ITEMS = ["Las piezas de la cultura Nasca.", "Cuando amaneció en la laguna.", "Porque nadie respondió.", "El canal que limpiaron los comuneros.", "Aunque llovía muchísimo.", "Sorprendido por la noticia."];
const RUN_ON_ITEMS = ["El museo abrió entramos gratis.", "Amaneció partimos hacia la laguna.", "Nadie respondió la profesora repitió la pregunta.", "Los comuneros limpiaron el canal el agua volvió.", "Llovía el partido continuó.", "Llegó la noticia el pueblo se sorprendió."];

const CLAUSE = sorter(["Proposición principal (se entiende sola)", "Proposición subordinada (depende de otra)"], "La parte en MAYÚSCULAS, ¿es la proposición principal o la subordinada?");
const CLAUSES: ChoiceItem[] = [
  ...["SALIMOS TEMPRANO porque el camino era largo.", "Cuando sonó la campana, TODOS CORRIERON AL PATIO.", "EL RÍO CRECIÓ aunque no llovió en el valle.", "Si estudias, APROBARÁS EL EXAMEN.", "ME GUSTA EL LIBRO que me prestaste.", "LLEGARÉ A TIEMPO si tomo el primer bus."].map((x) => CLAUSE(x, 0)),
  ...["Salimos temprano PORQUE EL CAMINO ERA LARGO.", "CUANDO SONÓ LA CAMPANA, todos corrieron al patio.", "El río creció AUNQUE NO LLOVIÓ EN EL VALLE.", "SI ESTUDIAS, aprobarás el examen.", "Me gusta el libro QUE ME PRESTASTE.", "Llegaré a tiempo SI TOMO EL PRIMER BUS."].map((x) => CLAUSE(x, 1)),
];
const SIMPLE = sorter(["Simple (un solo verbo conjugado)", "Compuesta (dos o más verbos conjugados)"], "¿La oración es simple o compuesta?");
const SIMPLE_COMPOUND: ChoiceItem[] = [
  ...["Los pescadores de Huanchaco usan caballitos de totora.", "Mi prima y yo pintamos un mural.", "Durante el recreo jugamos vóley.", "El viejo molino de piedra ya no funciona.", "La directora y los profesores organizaron el desfile."].map((x) => SIMPLE(x, 0)),
  ...["Los pescadores salen al mar y regresan al mediodía.", "Pintamos el mural, pero la lluvia lo borró.", "Jugamos vóley mientras los demás almorzaban.", "El molino no funciona porque se rompió la rueda.", "Organizaron el desfile y todos participaron."].map((x) => SIMPLE(x, 1)),
];
const SCC = sorter(["Simple", "Compuesta coordinada (ideas del mismo nivel)", "Compuesta subordinada (una idea depende de otra)"], "¿Cómo es la oración?");
const SIMPLE_COMPOUND_COMPLEX: ChoiceItem[] = [
  ...["El cóndor planea sobre el cañón.", "Mi abuela y mi tía tejen ponchos.", "Ayer visitamos el museo de sitio.", "El tren de las cinco llegó con retraso."].map((x) => SCC(x, 0)),
  ...["El cóndor planea y las vicuñas pastan.", "Quise llamarte, pero no tenía saldo.", "¿Vienes con nosotros o te quedas en casa?", "No llovió ni hizo frío."].map((x) => SCC(x, 1)),
  ...["El cóndor planea cuando sube el aire caliente.", "No te llamé porque no tenía saldo.", "Si vienes con nosotros, conocerás la laguna.", "Aunque hizo frío, salimos a caminar."].map((x) => SCC(x, 2)),
];
const JOIN = "¿Cómo se unen mejor las dos oraciones en una oración compuesta?";
const MAKE_COMPOUND: ChoiceItem[] = [
  pt(JOIN, "Estudié mucho. No aprobé.", "Estudié mucho, pero no aprobé.", "Estudié mucho, o no aprobé.", "Estudié mucho no aprobé."), pt(JOIN, "Se cortó la luz. Prendimos velas.", "Se cortó la luz, así que prendimos velas.", "Se cortó la luz, pero prendimos velas.", "Se cortó la luz prendimos velas."),
  pt(JOIN, "Puedes venir hoy. Puedes venir mañana.", "Puedes venir hoy o mañana.", "Puedes venir hoy ni mañana.", "Puedes venir hoy puedes mañana."), pt(JOIN, "No comió. No durmió.", "No comió ni durmió.", "No comió, pero durmió.", "No comió o no durmió."),
  pt(JOIN, "El río creció. Llovió toda la noche.", "El río creció porque llovió toda la noche.", "El río creció, pero llovió toda la noche.", "El río creció llovió toda la noche."), pt(JOIN, "Mi hermano cocina. Yo lavo los platos.", "Mi hermano cocina y yo lavo los platos.", "Mi hermano cocina, sino yo lavo los platos.", "Mi hermano cocina yo lavo."),
  pt(JOIN, "No es un lobo. Es un zorro.", "No es un lobo, sino un zorro.", "No es un lobo, y un zorro.", "No es un lobo es un zorro."), pt(JOIN, "Llegamos tarde. Perdimos el bus.", "Llegamos tarde porque perdimos el bus.", "Llegamos tarde, o perdimos el bus.", "Llegamos tarde perdimos el bus."),
];
const UNSCRAMBLE: OrderItem[] = [
  { seq: ["Los", "científicos", "estudian", "el", "retroceso", "de", "los", "glaciares"] }, { seq: ["Aunque", "estaba", "cansada,", "terminó", "la", "carrera"] }, { seq: ["Mi", "abuelo", "nos", "contó", "una", "leyenda", "antigua"] },
  { seq: ["¿Quién", "dejó", "abierta", "la", "ventana", "del", "salón?"] }, { seq: ["Nunca", "habíamos", "visto", "un", "arcoíris", "doble"] }, { seq: ["Si", "llueve,", "suspenderemos", "el", "paseo"] },
  { seq: ["El", "equipo", "que", "ganó", "recibió", "una", "copa"] }, { seq: ["Durante", "la", "noche", "cayó", "una", "fuerte", "helada"] },
];

// --- NN. Sustantivos ---------------------------------------------------------

const ABSTRACT_IN = [
  s("La solidaridad de los vecinos devolvió la esperanza al pueblo.", "solidaridad", "vecinos", "esperanza", "pueblo"), s("Su valentía venció al miedo.", "valentía", "miedo"), s("El respeto es la base de la convivencia.", "respeto", "base", "convivencia"),
  s("La justicia protege los derechos de las personas.", "justicia", "derechos", "personas"), s("La nostalgia invadió al viajero.", "nostalgia", "viajero"), s("Con paciencia y esfuerzo terminó el mural.", "paciencia", "esfuerzo", "mural"),
  s("La sabiduría de la abuela guiaba a la familia.", "sabiduría", "abuela", "familia"), s("Sintió una enorme gratitud hacia su maestra.", "gratitud", "maestra"),
];
const PROPER = ["Ayacucho", "Marañón", "Sipán", "Micaela", "Sudamérica", "Pacífico", "Kuélap", "Saturno", "Huancayo", "Grau"];
const COMMON = ["región", "río", "tumba", "heroína", "continente", "océano", "fortaleza", "planeta", "feria", "almirante"];

const PLURAL_FORM: ChoiceItem[] = [
  w("¿Cuál es el plural de «rey»?", "reyes", "reys", "reies"), w("¿Cuál es el plural de «ley»?", "leyes", "leys", "leies"), w("¿Cuál es el plural de «raíz»?", "raíces", "raízes", "raíses"),
  w("¿Cuál es el plural de «tabú»?", "tabúes", "tabuses", "tabuces"), w("¿Cuál es el plural de «buey»?", "bueyes", "bueys", "bueies"), w("¿Cuál es el plural de «voz»?", "voces", "vozes", "voses"),
  w("¿Cuál es el plural de «maní»?", "maníes", "manises", "maníces"), w("¿Cuál es el plural de «virrey»?", "virreyes", "virreys", "virreies"), w("¿Cuál es el plural de «cruz»?", "cruces", "cruzes", "cruses"),
  w("¿Cuál es el plural de «convoy»?", "convoyes", "convoys", "convoies"),
];
const PLURAL_USE: ChoiceItem[] = [
  f("Los ___ incas gobernaban desde el Cusco.", "reyes", "reys", "rey"), f("El Congreso aprobó dos ___ nuevas.", "leyes", "leys", "ley"), f("Las ___ del árbol levantaron la vereda.", "raíces", "raízes", "raíz"),
  f("Dos ___ tiraban del arado.", "bueyes", "bueys", "buey"), f("Se oían ___ en el pasillo.", "voces", "vozes", "voz"), f("En el cementerio hay ___ de madera.", "cruces", "cruzes", "cruz"),
  f("Compré un cuarto de ___ tostados.", "maníes", "manises", "maní"), f("Los ___ de camiones cruzaron la sierra.", "convoyes", "convoys", "convoy"), f("Cada cultura tiene sus ___.", "tabúes", "tabuses", "tabú"),
  f("Varios ___ gobernaron desde Lima.", "virreyes", "virreys", "virrey"),
];
const PLURAL_REVIEW: ChoiceItem[] = [
  w("¿Cuál es el plural de «carácter»?", "caracteres", "carácteres", "carácters"), w("¿Cuál es el plural de «el análisis»?", "los análisis", "los análisises", "los análises"), w("¿Cuál es el plural de «joven»?", "jóvenes", "jovenes", "jóvens"),
  w("¿Cuál es el plural de «colibrí»?", "colibríes", "colibrises", "colibrices"), w("¿Cuál es el plural de «examen»?", "exámenes", "examenes", "exámens"), w("¿Cuál es el plural de «el virus»?", "los virus", "los viruses", "los viru"),
  w("¿Cuál es el plural de «pez»?", "peces", "pezes", "peses"), w("¿Cuál es el plural de «margen»?", "márgenes", "margenes", "márgens"), w("¿Cuál es el plural de «sofá»?", "sofás", "sofaes", "sofases"),
  w("¿Cuál es el plural de «el jueves»?", "los jueves", "los jueveses", "los jueve"),
];
const PLURAL_REVIEW_USE: ChoiceItem[] = [
  f("Los ___ del barrio formaron un equipo.", "jóvenes", "jovenes", "joven"), f("El médico pidió dos ___ de sangre.", "análisis", "análisises", "análise"), f("En abril rendiremos tres ___.", "exámenes", "examenes", "examen"),
  f("Deja ___ amplios en la hoja.", "márgenes", "margenes", "margen"), f("Los ___ del río saltaban contra la corriente.", "peces", "pezes", "pez"), f("Hay ___ que causan gripe.", "virus", "viruses", "viru"),
  f("En la sala hay dos ___ viejos.", "sofás", "sofaes", "sofá"), f("Todos los ___ tengo taller de teatro.", "jueves", "jueveses", "jueve"), f("El texto tiene dos mil ___.", "caracteres", "carácteres", "carácter"),
  f("Vimos ___ entre las flores.", "colibríes", "colibrises", "colibrí"),
];
const OWN = sorter(["Plural (más de uno, sin dueño)", "Pertenece a uno solo", "Pertenece a varios"], "¿Qué indican las palabras destacadas?");
const POSSESSIVE_ID: ChoiceItem[] = [
  ...["LOS ARRIEROS cruzaron el abra.", "LAS ENFERMERAS atendieron toda la noche.", "LOS ALCALDES firmaron un acuerdo.", "LAS ARTESANAS abrieron su feria."].map((x) => OWN(x, 0)),
  ...["La mula DEL ARRIERO se detuvo.", "El turno DE LA ENFERMERA terminó.", "La firma DEL ALCALDE era ilegible.", "El puesto DE LA ARTESANA está en la esquina."].map((x) => OWN(x, 1)),
  ...["Las mulas DE LOS ARRIEROS se detuvieron.", "Los turnos DE LAS ENFERMERAS terminaron.", "Las firmas DE LOS ALCALDES eran ilegibles.", "Los puestos DE LAS ARTESANAS están en la plaza."].map((x) => OWN(x, 2)),
];
const POSSESSIVE_FORM: ChoiceItem[] = [
  f("el discurso ___ alcaldesa", "de la", "del", "de los"), f("las herramientas ___ carpinteros", "de los", "del", "de la"), f("el vuelo ___ águila", "del", "de la", "de las"),
  f("los derechos ___ niñas", "de las", "del", "de los"), f("la tripulación ___ barco", "del", "de la", "de las"), f("el filo ___ hacha", "del", "de la", "de los"),
  f("las costumbres ___ pueblos", "de los", "del", "de la"), f("la sombra ___ árboles", "de los", "del", "de las"), f("el idioma ___ abuelas", "de las", "de la", "del"),
  f("la orilla ___ laguna", "de la", "del", "de las"),
];
const FIX = "¿Cómo se corrige el error?";
const POSSESSIVE_ERRORS: ChoiceItem[] = [
  pt(FIX, "Las ley de el país protegen a los niños.", "Las leyes del país protegen a los niños.", "Las ley del país protegen a los niños.", "Las leyes de el país protegen a los niños."), pt(FIX, "El filo de la hacha es peligroso.", "El filo del hacha es peligroso.", "El filo de el hacha es peligroso.", "El filo de las hacha es peligroso."),
  pt(FIX, "Los derecho de las niñas son iguales.", "Los derechos de las niñas son iguales.", "Los derecho de la niñas son iguales.", "El derechos de las niñas son iguales."), pt(FIX, "Las raízes de el árbol son profundas.", "Las raíces del árbol son profundas.", "Las raízes del árbol son profundas.", "Las raíces de el árbol son profundas."),
  pt(FIX, "La sombra de los árbol refresca.", "La sombra de los árboles refresca.", "La sombra del árboles refresca.", "La sombra de los arbols refresca."), pt(FIX, "Las voz de los niño llenaron el patio.", "Las voces de los niños llenaron el patio.", "Las voces de los niño llenaron el patio.", "Las voz de los niños llenaron el patio."),
  pt(FIX, "El discurso de el alcalde fue breve.", "El discurso del alcalde fue breve.", "El discurso de la alcalde fue breve.", "El discurso del el alcalde fue breve."), pt(FIX, "Las costumbre de los pueblo son valiosas.", "Las costumbres de los pueblos son valiosas.", "Las costumbres de los pueblo son valiosas.", "Las costumbre de los pueblos son valiosas."),
];

// --- OO. Pronombres ----------------------------------------------------------

const PRONOUNS_IN = [
  s("Ellos nos avisaron tarde.", "Ellos", "nos"), s("Usted me conoce bien.", "Usted", "me"), s("Nosotras las vimos en el desfile.", "Nosotras", "las"), s("Yo le escribí ayer.", "Yo", "le"),
  s("Tú lo sabías y te callaste.", "Tú", "lo", "te"), s("Ella se lo contó a ustedes.", "Ella", "se", "lo", "ustedes"), s("Él vino conmigo.", "Él", "conmigo"), s("Ustedes nos esperaron mucho.", "Ustedes", "nos"),
];
const SUBJ_OBJ: ChoiceItem[] = [
  f("___ organizamos la campaña de reciclaje.", "Nosotros", "Nos", "A nosotros"), f("El jurado ___ entregó el diploma a mí.", "me", "yo", "mí"), f("A los ganadores ___ aplaudieron de pie.", "los", "ellos", "les"),
  f("A Marta ___ prestaron un libro.", "le", "la", "ella"), f("___ tienes razón.", "Tú", "Te", "Ti"), f("Este asiento es para ___.", "ti", "tú", "te"),
  f("A las alumnas ___ dieron un premio.", "les", "las", "ellas"), f("El guardia ___ dejó pasar a nosotros.", "nos", "nosotros", "los"), f("___ llegaron antes que el resto.", "Ellas", "Las", "Les"),
  f("A mi hermano ___ vi en la plaza.", "lo", "él", "le"),
];
const REP = "¿Qué pronombre reemplaza a las palabras destacadas?";
const REPLACE: ChoiceItem[] = [
  pt(REP, "LA BIBLIOTECARIA ordenó los estantes.", "Ella", "Él", "Ellas"), pt(REP, "Entregué EL INFORME a tiempo.", "lo", "la", "le"), pt(REP, "TÚ Y YO iremos al museo.", "Nosotros", "Ustedes", "Ellos"),
  pt(REP, "Vi A LAS BAILARINAS en el ensayo.", "las", "los", "les"), pt(REP, "Conté un secreto A MI AMIGO.", "le", "lo", "la"), pt(REP, "CARLA Y SUS PRIMAS viajaron a Tarapoto.", "Ellas", "Ellos", "Nosotras"),
  pt(REP, "Devolví LOS LIBROS a la biblioteca.", "los", "las", "les"), pt(REP, "EL ALCALDE Y EL REGIDOR firmaron.", "Ellos", "Él", "Nosotros"), pt(REP, "Envié flores A MIS TÍAS.", "les", "las", "los"),
  pt(REP, "Rompí LA TAZA sin querer.", "la", "lo", "le"),
];
const I_AND_ME: ChoiceItem[] = [
  f("Mi hermana y ___ preparamos la exposición.", "yo", "mí", "me"), f("El premio fue para Andrea y para ___.", "mí", "yo", "me"), f("Entre tú y ___ no hay secretos.", "yo", "mí", "me"),
  f("La maestra nos felicitó a Raúl y a ___.", "mí", "yo", "me"), f("Mis abuelos y ___ sembramos el huerto.", "yo", "mí", "me"), f("Nadie lo sabe, excepto tú y ___.", "yo", "mí", "me"),
  f("Trajeron helados para mis primos y para ___.", "mí", "yo", "me"), f("Hasta ___ me sorprendí con el resultado.", "yo", "mí", "me"), f("Se acordaron de Julia y de ___.", "mí", "yo", "me"),
  f("¿Vienes ___ al mercado?", "conmigo", "con yo", "con mí"),
];
const COMPOUND_PRONOUNS: ChoiceItem[] = [
  f("Tú y ella ___ muy buenas amigas.", "son", "es", "somos"), f("Él y yo ___ al mismo equipo.", "pertenecemos", "pertenecen", "pertenece"), f("Ustedes y nosotros ___ el patio.", "limpiaremos", "limpiarán", "limpiará"),
  w("¿Qué orden es más cortés?", "Mi hermano y yo fuimos.", "Yo y mi hermano fuimos.", "Yo, mi hermano fuimos."), f("Tú y yo ___ la tarea juntos.", "hicimos", "hicieron", "hiciste"), f("Ella y tú ___ primero.", "llegaron", "llegamos", "llegó"),
  f("La profesora nos eligió a ___.", "ti y a mí", "tú y yo", "ti y yo"), f("El regalo es para ___.", "ella y para ti", "ella y tú", "tú y ella"), f("Ni tú ni él ___ la respuesta.", "sabían", "sabíamos", "sabías"),
  f("Ellos y yo ___ en el coro.", "cantamos", "cantan", "canto"),
];
const POSS_USE: ChoiceItem[] = [
  f("Esa mochila es de Laura: es ___.", "suya", "mía", "tuya"), f("Yo traje mis colores. ¿Trajiste los ___?", "tuyos", "tuyas", "suyo"), f("Este mural lo pintamos nosotros: es ___.", "nuestro", "nuestra", "suyo"),
  f("Las ideas fueron de ustedes: son ___.", "suyas", "suyos", "nuestras"), f("Ese error fue ___: yo no revisé.", "mío", "mía", "tuyo"), f("Esa carpa la armamos nosotras: es ___.", "nuestra", "nuestro", "tuya"),
  f("¿Estas llaves son ___? Las hallé en tu carpeta.", "tuyas", "tuyos", "mías"), f("Los abuelos cuidan su huerto: es ___.", "suyo", "suya", "nuestro"), f("Mis notas mejoraron; ¿y las ___?", "tuyas", "tuyos", "suya"),
  f("Estas zapatillas me las compré yo: son ___.", "mías", "míos", "tuyas"),
];
const REFLEXIVE_CHOICE: ChoiceItem[] = [
  f("Yo ___ preparé el desayuno a mí mismo.", "me", "yo", "mí"), f("El gato ___ limpia con la lengua.", "se", "él", "lo"), f("Nosotros ___ reunimos en la plaza.", "nos", "nosotros", "los"),
  f("Tú ___ quejas demasiado.", "te", "tú", "ti"), f("Las actrices ___ maquillaron antes de salir.", "se", "ellas", "las"), f("Ustedes ___ equivocaron de aula.", "se", "ustedes", "los"),
  f("Yo ___ acuerdo de aquel viaje.", "me", "se", "yo"), f("El niño ___ durmió en el bus.", "se", "él", "le"), f("Tú ___ atreviste a cantar.", "te", "tú", "se"),
  f("Nosotras ___ cansamos de esperar.", "nos", "nosotras", "se"),
];
const REFLEXIVE_USE: ChoiceItem[] = [
  f("Me miré a mí ___ en el espejo, dijo Ana.", "misma", "mismo", "mismas"), f("Los niños se sirvieron a sí ___.", "mismos", "mismo", "mismas"), f("Confía en ti ___, Pedro.", "mismo", "misma", "mismos"),
  f("Ella se repite a sí ___: «Yo puedo».", "misma", "mismo", "mismas"), f("Nos organizamos nosotros ___.", "mismos", "mismo", "misma"), f("El abuelo habla consigo ___.", "mismo", "misma", "mismos"),
  f("Las jugadoras se exigen a sí ___.", "mismas", "mismos", "misma"), f("Tú ___ lo prometiste, Lucía.", "misma", "mismo", "mismas"), f("Yo ___ lo arreglé, dijo Tomás.", "mismo", "misma", "mismos"),
  f("Ustedes ___ pueden comprobarlo.", "mismos", "mismo", "misma"),
];
const REL_IN = [
  s("La canción que escuchamos era un huayno.", "que"), s("El amigo de quien te hablé llega hoy.", "quien"), s("Visitamos el pueblo donde nació mi madre.", "donde"), s("La autora cuyos libros leemos vendrá.", "cuyos"),
  s("Las razones por las cuales faltó son claras.", "cuales"), s("Quienes terminen pueden salir.", "Quienes"), s("Ese es el río cuyo cauce se secó.", "cuyo"), s("El día que llegaste llovía.", "que"),
];
const QUE_QUIEN: ChoiceItem[] = [
  f("El científico ___ descubrió la vacuna recibió un premio.", "que", "quienes", "cuyo"), f("La persona a ___ debes llamar es la directora.", "quien", "quienes", "cuya"), f("Los vecinos con ___ sembramos son muy unidos.", "quienes", "quien", "cuyos"),
  f("La escritora de ___ hablamos nació en Cusco.", "quien", "quienes", "cuya"), f("El libro ___ me prestaste era excelente.", "que", "quien", "cuyo"), f("Fue mi abuela ___ me enseñó a tejer.", "quien", "quienes", "cuya"),
  f("Los alumnos ___ participaron recibieron un diploma.", "que", "quien", "cuyos"), f("Las amigas a ___ invité llegaron puntuales.", "quienes", "quien", "cuyas"), f("El perro ___ rescatamos ya está sano.", "que", "quien", "cuyo"),
  f("___ madruga aprovecha el día.", "Quien", "Quienes", "Cuyo"),
];
const RELATIVE_USE: ChoiceItem[] = [
  f("El poeta ___ versos recitamos es César Vallejo.", "cuyos", "que", "quien"), f("La casa ___ crecí tenía un patio enorme.", "donde", "cuya", "quien"), f("La herramienta con la ___ trabajo es antigua.", "cual", "quien", "cuya"),
  f("El pueblo ___ calles son de piedra recibe muchos turistas.", "cuyas", "que", "donde"), f("Ese es el motivo por el ___ me quedé.", "cual", "cuyo", "donde"), f("La película ___ vimos anoche me encantó.", "que", "quien", "cuya"),
  f("La niña ___ padre es pescador sabe remar.", "cuyo", "que", "quien"), f("Los temas sobre los ___ escribimos eran libres.", "cuales", "cual", "quien"), f("El valle ___ se cultiva la quinua es muy frío.", "donde", "cuyo", "quien"),
  f("La maestra a ___ más recuerdo se llamaba Olga.", "quien", "cuya", "donde"),
];

// --- PP. Tipos de verbos -----------------------------------------------------

const HELPING: ChoiceItem[] = [
  pt("¿Cuál es el verbo auxiliar?", "Los comuneros han limpiado el canal.", "han", "limpiado", "canal"), pt("¿Cuál es el verbo principal?", "Los comuneros han limpiado el canal.", "limpiado", "han", "comuneros"),
  pt("¿Cuál es el verbo auxiliar?", "La ciudad fue fundada en 1535.", "fue", "fundada", "ciudad"), pt("¿Cuál es el verbo principal?", "La ciudad fue fundada en 1535.", "fundada", "fue", "ciudad"),
  pt("¿Cuál es el verbo auxiliar?", "Estábamos esperando el bus.", "Estábamos", "esperando", "bus"), pt("¿Cuál es el verbo principal?", "Voy a presentar mi proyecto.", "presentar", "Voy", "proyecto"),
  pt("¿Cuál es el verbo auxiliar?", "Habrán terminado para el viernes.", "Habrán", "terminado", "viernes"), pt("¿Cuál es el verbo principal?", "Tienes que revisar tu respuesta.", "revisar", "Tienes", "respuesta"),
  pt("¿Cuál es el verbo auxiliar?", "El puente será inaugurado mañana.", "será", "inaugurado", "puente"), pt("¿Cuál es el verbo principal?", "Hemos decidido participar.", "decidido", "Hemos", "participar"),
];
const MODAL = sorter(["Capacidad", "Permiso", "Obligación", "Posibilidad"], "¿Qué indica el verbo destacado?");
const MODAL_SHOWS: ChoiceItem[] = [
  ...["El cóndor PUEDE volar horas sin aletear.", "Mi hermana SABE tocar el arpa.", "Ya PUEDO resolver ecuaciones.", "Ese atleta PUEDE saltar dos metros."].map((x) => MODAL(x, 0)),
  ...["¿PUEDO salir un momento?", "Ya PUEDES abrir tu regalo.", "Hoy PUEDEN usar calculadora.", "¿PODEMOS pasar, profesora?"].map((x) => MODAL(x, 1)),
  ...["DEBES respetar las señales.", "TENEMOS QUE devolver los libros hoy.", "HAY QUE lavarse las manos.", "Los conductores DEBEN ceder el paso."].map((x) => MODAL(x, 2)),
  ...["PUEDE QUE llueva esta tarde.", "DEBE DE estar en la biblioteca.", "PODRÍA nevar en la puna.", "QUIZÁ PUEDA venir mañana."].map((x) => MODAL(x, 3)),
];
const MODAL_USE: ChoiceItem[] = [
  f("Para votar, ___ presentar tu DNI.", "debes", "sueles", "quiero"), f("No encuentro a Luis; ___ estar en el patio.", "debe de", "suele", "quiero"), f("¿___ repetir la pregunta, por favor?", "Podría", "Solía", "Debo"),
  f("En la biblioteca ___ guardar silencio.", "hay que", "solemos", "quiero"), f("Mi abuelo ya no ___ leer sin lentes.", "puede", "debes", "quieren"), f("Si quieres aprobar, ___ estudiar más.", "tienes que", "sueles", "puedo"),
  f("___ que mañana no haya clases.", "Puede", "Suele", "Debo"), f("Los niños pequeños ___ cruzar acompañados.", "deben", "quiero", "sueles"), f("De pequeña, ella ___ trepar a ese árbol todas las tardes.", "solía", "debes", "pueden"),
  f("¿___ prestarme tu regla?", "Puedes", "Sueles", "Debo"),
];

// --- QQ. Concordancia --------------------------------------------------------

const SUBJECT_VERB: ChoiceItem[] = [
  f("La mayoría de los alumnos ___ temprano.", "llegó", "llegamos", "llegas"), f("El grupo de turistas ___ el museo.", "visitó", "visitamos", "visitaste"), f("___ cubren la cordillera.", "Las nubes", "La nube", "Una nube"),
  f("Cada uno de los jugadores ___ una medalla.", "recibió", "recibieron", "recibimos"), f("Nadie ___ la respuesta.", "sabía", "sabían", "sabíamos"), f("Los niños de la escuela vecina ___ en el coro.", "cantan", "canta", "cantas"),
  f("___ florece en primavera.", "El cerezo", "Los cerezos", "Unos cerezos"), f("La gente del pueblo ___ la fiesta.", "organizó", "organizaron", "organizamos"), f("Todos ___ de acuerdo.", "estaban", "estaba", "estabas"),
  f("El equipo ___ su tercer partido.", "ganó", "ganaron", "ganamos"),
];
const COMPOUND_SUBJECT: ChoiceItem[] = [
  f("El cóndor y el puma ___ símbolos andinos.", "son", "es", "somos"), f("Mi madre y yo ___ el almuerzo.", "preparamos", "preparan", "preparó"), f("Tú y tus amigos ___ invitados.", "están", "estás", "estamos"),
  f("La lluvia y el viento ___ el techo.", "dañaron", "dañó", "dañamos"), f("Ni Ana ni Luis ___ la tarea.", "hicieron", "hizo", "hicimos"), f("El lápiz y el cuaderno ___ en la mochila.", "están", "está", "estamos"),
  f("Tanto el río como la laguna ___ contaminados.", "están", "está", "estamos"), f("Leer y escribir ___ mi vocabulario.", "amplían", "amplía", "ampliamos"), f("El perro, el gato y el loro ___ en el patio.", "duermen", "duerme", "dormimos"),
  f("___ viajan mañana a Puno.", "Marta y Elena", "Marta", "Mi prima"),
];

// --- RR. Tiempos verbales ----------------------------------------------------

const TENSE = sorter(["Pasado", "Presente", "Futuro"], "¿En qué tiempo está la oración?");
const TENSES: ChoiceItem[] = [
  ...["Los incas construyeron andenes.", "De niño vivía frente al mar.", "Hubo un temblor anoche.", "Trajeron leña del monte.", "Ya habíamos cenado."].map((x) => TENSE(x, 0)),
  ...["Los ingenieros construyen un puente.", "Vivo frente al mar.", "Hay neblina en la carretera.", "Estamos esperando el bus.", "Mi tía trae leña cada semana."].map((x) => TENSE(x, 1)),
  ...["Construirán una posta médica.", "Viviré frente al mar.", "Habrá feria el domingo.", "Vamos a esperar el bus.", "Traerán leña del monte."].map((x) => TENSE(x, 2)),
];
const PAST_REGULAR: ChoiceItem[] = [
  f("Ayer nosotros ___ (limpiar) la playa.", "limpiamos", "limpiaron", "limpiaremos"), f("El lunes ella ___ (presentar) su proyecto.", "presentó", "presenté", "presenta"), f("Anoche tú ___ (prometer) venir.", "prometiste", "prometió", "prometes"),
  f("Los alumnos ___ (debatir) una hora.", "debatieron", "debatimos", "debaten"), f("Yo ___ (aprender) a nadar el verano pasado.", "aprendí", "aprendió", "aprendo"), f("El río ___ (arrasar) el puente.", "arrasó", "arrasé", "arrasa"),
  f("Ustedes ___ (decidir) quedarse.", "decidieron", "decidimos", "deciden"), f("Yo ___ (pagar) la cuenta.", "pagué", "pagé", "pagó"), f("Yo ___ (empezar) la novela ayer.", "empecé", "empezé", "empezó"),
  f("Yo ___ (buscar) mis llaves por todas partes.", "busqué", "buscé", "buscó"),
];
const PAST_IRREGULAR: ChoiceItem[] = [
  f("Ayer no ___ (caber) todos en el bus.", "cupieron", "cabieron", "cupimos"), f("Ella ___ (traducir) el poema.", "tradujo", "traducio", "traduje"), f("Nosotros ___ (andar) por el malecón.", "anduvimos", "andamos", "anduvieron"),
  f("Yo no ___ (saber) qué decir.", "supe", "sabí", "supo"), f("Ellos ___ (traer) las medicinas.", "trajeron", "trajieron", "traeron"), f("El bebé ___ (dormir) toda la noche.", "durmió", "dormió", "durmí"),
  f("Tú ___ (poner) la mesa.", "pusiste", "poniste", "puso"), f("El público ___ (pedir) otra canción.", "pidió", "pedió", "pidí"), f("Yo ___ (hacer) un resumen.", "hice", "hací", "hizo"),
  f("Ustedes ___ (decir) la verdad.", "dijeron", "dijieron", "dijimos"), f("Los niños ___ (huir) del ruido.", "huyeron", "huieron", "huimos"), f("Nosotros ___ (estar) de acuerdo.", "estuvimos", "estamos", "estuvieron"),
];
const THREE_TENSES: ChoiceItem[] = [
  f("Mañana nosotros ___ (viajar) a Ayacucho.", "viajaremos", "viajamos", "viajábamos"), f("Ahora mismo ella ___ (leer) en su cuarto.", "lee", "leyó", "leerá"), f("El año pasado yo ___ (ganar) el concurso.", "gané", "gano", "ganaré"),
  f("Todos los días él ___ (correr) media hora.", "corre", "corrió", "correrá"), f("La próxima semana tú ___ (tener) examen.", "tendrás", "tuviste", "tienes"), f("Hace un siglo aquí ___ (haber) un bosque.", "había", "hay", "habrá"),
  f("Dentro de diez años ellos ___ (ser) adultos.", "serán", "fueron", "son"), f("Ayer ustedes ___ (venir) muy temprano.", "vinieron", "vienen", "vendrán"), f("En este momento yo ___ (saber) la respuesta.", "sé", "supe", "sabré"),
  f("Pasado mañana nosotras ___ (salir) de paseo.", "saldremos", "salimos", "salíamos"),
];
const SHIFT = "¿Qué oración mantiene bien el tiempo verbal?";
const TENSE_SHIFTS: ChoiceItem[] = [
  w(SHIFT, "Ayer fui al mercado y compré frutas.", "Ayer fui al mercado y compro frutas.", "Ayer voy al mercado y compré frutas."), w(SHIFT, "Cuando llegó el tren, todos subieron.", "Cuando llegó el tren, todos suben.", "Cuando llega el tren, todos subieron."),
  w(SHIFT, "Mañana ensayaremos y luego presentaremos la obra.", "Mañana ensayaremos y luego presentábamos la obra.", "Mañana ensayamos y luego presentaron la obra."), w(SHIFT, "Cada mañana me levanto y preparo el desayuno.", "Cada mañana me levanto y preparé el desayuno.", "Cada mañana me levanté y preparo el desayuno."),
  w(SHIFT, "El zorro vio al cuy y lo persiguió.", "El zorro vio al cuy y lo persigue.", "El zorro ve al cuy y lo persiguió."), w(SHIFT, "Abrió la puerta, entró y saludó.", "Abrió la puerta, entra y saludó.", "Abre la puerta, entró y saluda."),
  w(SHIFT, "Si llueve, nos quedaremos en casa.", "Si llovía, nos quedaremos en casa.", "Si llueve, nos quedábamos en casa."), w(SHIFT, "Estudié toda la tarde y por eso aprobé.", "Estudié toda la tarde y por eso apruebo.", "Estudio toda la tarde y por eso aprobé."),
  pt("¿Cómo se corrige el cambio indebido de tiempo?", "El niño corrió hacia el río y salta al agua.", "El niño corrió hacia el río y saltó al agua.", "El niño corre hacia el río y saltó al agua.", "El niño corrió hacia el río y saltará al agua."),
  pt("¿Cómo se corrige el cambio indebido de tiempo?", "Ayer llovió mucho y las calles se inundan.", "Ayer llovió mucho y las calles se inundaron.", "Ayer llueve mucho y las calles se inundaron.", "Ayer llovió mucho y las calles se inundarán."),
];
const PROGRESSIVE_USE: ChoiceItem[] = [
  f("En este momento los alumnos ___ el himno.", "están ensayando", "estaban ensayando", "ensayaron"), f("Ayer a esta hora nosotros ___ hacia Huaraz.", "estábamos viajando", "estamos viajando", "estaremos viajando"), f("Mañana a las ocho yo ___ el examen.", "estaré rindiendo", "estaba rindiendo", "estoy rindiendo"),
  f("Mira: el cóndor ___ sobre el cañón.", "está planeando", "estaba planeando", "planeó"), f("Cuando sonó el teléfono, ella ___.", "estaba durmiendo", "está durmiendo", "estará durmiendo"), f("No puedo salir: ___ la tarea.", "estoy terminando", "estaba terminando", "terminé"),
  f("El año que viene ya ___ en sexto grado.", "estaré estudiando", "estaba estudiando", "estoy estudiando"), f("Anoche, mientras cenábamos, ___ a cántaros.", "estaba lloviendo", "está lloviendo", "estará lloviendo"), f("Ahora ustedes ___ demasiado ruido.", "están haciendo", "estaban haciendo", "hicieron"),
  f("A esta hora, el sábado, ___ en la laguna.", "estaremos nadando", "estábamos nadando", "estamos nadando"),
];
const PROGRESSIVE_FORM: ChoiceItem[] = [
  w("¿Cuál es el gerundio de «construir»?", "construyendo", "construiendo", "construido"), w("¿Cuál es el gerundio de «morir»?", "muriendo", "moriendo", "muerto"), w("¿Cuál es el gerundio de «traer»?", "trayendo", "traiendo", "traído"),
  w("¿Cuál es el gerundio de «reír»?", "riendo", "reiendo", "reído"), w("¿Cuál es el gerundio de «poder»?", "pudiendo", "podiendo", "podido"), w("¿Cuál es el gerundio de «venir»?", "viniendo", "veniendo", "venido"),
  w("¿Cuál es el gerundio de «huir»?", "huyendo", "huiendo", "huido"), w("¿Cuál es el gerundio de «seguir»?", "siguiendo", "seguiendo", "seguido"), w("¿Cuál es el gerundio de «creer»?", "creyendo", "creiendo", "creído"),
  w("¿Cuál es el gerundio de «vestir»?", "vistiendo", "vestiendo", "vestido"),
];
const PAST_OR_PARTICIPLE: ChoiceItem[] = [
  f("El río ___ el puente anoche.", "cubrió", "cubierto", "cubrido"), f("La nieve ha ___ el camino.", "cubierto", "cubrió", "cubrido"), f("El autor ___ tres novelas.", "escribió", "escrito", "escribido"),
  f("Ya han ___ los resultados.", "impreso", "imprimieron", "imprimiendo"), f("¿Quién ha ___ esta puerta?", "abierto", "abrió", "abrido"), f("Ayer ___ a mi antigua escuela.", "volví", "vuelto", "volvido"),
  f("Nunca he ___ un glaciar.", "visto", "vi", "veído"), f("El problema ya está ___.", "resuelto", "resolvió", "resolvido"), f("Anoche se ___ la luz.", "fue", "ido", "yendo"),
  f("Hemos ___ la verdad.", "dicho", "dijimos", "decido"), f("El jarrón se ha ___.", "roto", "rompió", "rompido"), f("Mi abuelo ___ en 1950.", "nació", "nacido", "naciendo"),
];
const PERFECT_USE: ChoiceItem[] = [
  f("Este mes ___ tres veces al museo.", "hemos ido", "habíamos ido", "habremos ido"), f("Cuando llegué, el bus ya ___.", "había partido", "ha partido", "habrá partido"), f("Para diciembre ___ el curso.", "habremos terminado", "habíamos terminado", "hemos terminado"),
  f("Nunca ___ un eclipse total.", "he visto", "había visto", "habré visto"), f("Antes de 1821, el Perú no ___ su independencia.", "había proclamado", "ha proclamado", "habrá proclamado"), f("Dentro de una hora ya ___ la lluvia.", "habrá pasado", "había pasado", "ha pasado"),
  f("Hoy no ___ nada todavía.", "he comido", "había comido", "habré comido"), f("Cuando abrieron la tienda, ya ___ una cola.", "se había formado", "se ha formado", "se habrá formado"), f("¿Ya ___ la tarea de hoy?", "has hecho", "habías hecho", "habrás hecho"),
  f("El lunes próximo ya ___ los resultados.", "habrán publicado", "habían publicado", "han publicado"),
];
const PERFECT_FORM: ChoiceItem[] = [
  w("¿Cuál es el participio de «resolver»?", "resuelto", "resolvido", "resolviendo"), w("¿Cuál es el participio de «abrir»?", "abierto", "abrido", "abriendo"), w("¿Cuál es el participio de «morir»?", "muerto", "morido", "muriendo"),
  w("¿Cuál es el participio de «poner»?", "puesto", "ponido", "poniendo"), w("¿Cuál es el participio de «hacer»?", "hecho", "hacido", "haciendo"), w("¿Cuál es el participio de «descubrir»?", "descubierto", "descubrido", "descubriendo"),
  w("¿Cuál es el participio de «ver»?", "visto", "veído", "viendo"), w("¿Cómo se forma «yo + haber + volver» en pretérito pluscuamperfecto?", "había vuelto", "he vuelto", "había volvido"), w("¿Cómo se forma «ellas + haber + decir» en pretérito perfecto?", "han dicho", "han decido", "habían dicho"),
  w("¿Cómo se forma «nosotros + haber + abrir» en futuro perfecto?", "habremos abierto", "hemos abierto", "habremos abrido"),
];

export const ROWS: Row[] = [
  ["LL.1", "Aprender a escribir palabras con prefijos: con-, sobre-, pro-", (r) => choose(r, WELL, PREFIX_SPELL)],
  ["LL.2", "Aprender a escribir palabras con sufijos: -dad, -ción, -or, -ura", (r) => choose(r, WELL, SUFFIX_SPELL)],
  ["LL.3", "Escribir palabras con prefijos y sufijos: repaso", (r) => mix(r, [(q) => choose(q, WELL, [...PREFIX_SPELL, ...SUFFIX_SPELL]), (q) => P2.spellHeard(q, "convivir compartir proponer sobrevolar hermosura inventor emoción decisión vecindad", "a e i o u ó b v m n s c z")])],
  ["LL.4", "Aprender a escribir palabras frecuentes: grupo 1 (tilde en hiatos)", (r) => choose(r, WELL, SET_HIATO)],
  ["LL.5", "Aprender a escribir palabras frecuentes: grupo 2 (mb, mp y nv)", (r) => choose(r, WELL, SET_MB)],
  ["LL.6", "Escribir palabras frecuentes: grupos 1 y 2", (r) => P2.spellHeard(r, "había país maíz oído todavía también siempre invierno cambio enviar empezar tiempo", "a e i o u í m n b v p")],
  ["LL.7", "Aprender a escribir palabras frecuentes: grupo 3 (ll e y)", (r) => choose(r, WELL, SET_LLY)],
  ["LL.8", "Aprender a escribir palabras frecuentes: grupo 4 (x, cc y sc)", (r) => choose(r, WELL, SET_X)],
  ["LL.9", "Escribir palabras frecuentes: grupos 3 y 4", (r) => P2.spellHeard(r, "lluvia ayer calle desayuno orilla apoyo examen acción piscina explicar escena éxito", "a e i o u ll y x c s")],
  ["LL.10", "Escribir palabras frecuentes: repaso de los grupos 1 a 4", (r) => mix(r, [(q) => choose(q, WELL, [...SET_HIATO, ...SET_MB, ...SET_LLY, ...SET_X]), (q) => P2.spellHeard(q, "país oído también invierno lluvia desayuno examen piscina tiempo orilla", "a e i o u í ll y x c s m n b v")])],

  ["MM.1", "¿La oración es enunciativa, interrogativa, imperativa o exclamativa?", (r) => choose(r, "", SENTENCE_KIND)],
  ["MM.2", "Identificar el sujeto completo o el predicado completo de una oración", (r) => choose(r, "", SUBJECT_PREDICATE)],
  ["MM.3", "Identificar el núcleo del sujeto o del predicado", (r) => choose(r, "", SIMPLE_SP)],
  ["MM.4", "¿Es una oración completa o un fragmento?", (r) => choose(r, "¿Es una oración completa o un fragmento?", [...label(COMPLETE_ITEMS, COMPLETE, [COMPLETE, FRAGMENT]), ...label(FRAGMENT_ITEMS, FRAGMENT, [COMPLETE, FRAGMENT])])],
  ["MM.5", "¿Es una oración completa o son oraciones pegadas?", (r) => choose(r, "¿Es una oración completa o son oraciones pegadas (sin punto ni conector)?", [...label(COMPLETE_ITEMS, COMPLETE, [COMPLETE, RUN_ON]), ...label(RUN_ON_ITEMS, RUN_ON, [COMPLETE, RUN_ON])])],
  ["MM.6", "¿Es una oración completa, un fragmento u oraciones pegadas?", (r) => choose(r, "¿Qué es?", [...label(COMPLETE_ITEMS, COMPLETE, [COMPLETE, FRAGMENT, RUN_ON]), ...label(FRAGMENT_ITEMS, FRAGMENT, [COMPLETE, FRAGMENT, RUN_ON]), ...label(RUN_ON_ITEMS, RUN_ON, [COMPLETE, FRAGMENT, RUN_ON])])],
  ["MM.7", "Identificar proposiciones principales y subordinadas", (r) => choose(r, "", CLAUSES)],
  ["MM.8", "¿La oración es simple o compuesta?", (r) => choose(r, "", SIMPLE_COMPOUND)],
  ["MM.9", "¿La oración es simple, coordinada o subordinada?", (r) => choose(r, "", SIMPLE_COMPOUND_COMPLEX)],
  ["MM.10", "Crear oraciones compuestas", (r) => choose(r, "", MAKE_COMPOUND)],
  ["MM.11", "Ordenar las palabras para crear una oración", (r) => order(r, "Ordena las palabras para formar una oración.", UNSCRAMBLE)],

  ["NN.1", "Identificar sustantivos, incluidos los abstractos", (r) => pickInSentence(r, "Selecciona los sustantivos (también los que nombran ideas o sentimientos).", ABSTRACT_IN)],
  ["NN.2", "Identificar sustantivos comunes y propios", (r) => mix(r, [(q) => pickAll(q, "Selecciona los sustantivos propios.", PROPER, COMMON, "propios"), (q) => pickAll(q, "Selecciona los sustantivos comunes.", COMMON, PROPER, "comunes")])],
  ["NN.3", "Formar plurales de sustantivos terminados en -z, -y, -í y -ú", (r) => choose(r, "", PLURAL_FORM)],
  ["NN.4", "Formar y usar plurales de sustantivos terminados en -z, -y, -í y -ú", (r) => choose(r, "Completa la oración.", PLURAL_USE)],
  ["NN.5", "Formar plurales: repaso", (r) => choose(r, "", [...PLURAL_REVIEW, ...PLURAL_FORM])],
  ["NN.6", "Formar y usar plurales: repaso", (r) => choose(r, "Completa la oración.", [...PLURAL_REVIEW_USE, ...PLURAL_USE])],
  ["NN.7", "Identificar plurales y frases de pertenencia de uno o de varios dueños", (r) => choose(r, "", POSSESSIVE_ID)],
  ["NN.8", "Formar la frase de pertenencia de uno o de varios dueños", (r) => choose(r, "Completa la frase.", POSSESSIVE_FORM)],
  ["NN.9", "Identificar y corregir errores de plural y de pertenencia", (r) => choose(r, "", POSSESSIVE_ERRORS)],

  ["OO.1", "Identificar pronombres personales", (r) => pickInSentence(r, "Selecciona los pronombres personales.", PRONOUNS_IN)],
  ["OO.2", "Elegir entre pronombres de sujeto y de objeto", (r) => choose(r, "Completa la oración.", SUBJ_OBJ)],
  ["OO.3", "Reemplazar el sustantivo por un pronombre personal", (r) => choose(r, "", REPLACE)],
  ["OO.4", "Sujetos y complementos compuestos con «yo» y «mí»", (r) => choose(r, "Completa la oración.", I_AND_ME)],
  ["OO.5", "Sujetos y complementos compuestos con pronombres personales", (r) => choose(r, "Completa la oración.", COMPOUND_PRONOUNS)],
  ["OO.6", "Usar pronombres posesivos", (r) => choose(r, "Completa la oración.", POSS_USE)],
  ["OO.7", "Elegir entre pronombres personales y reflexivos", (r) => choose(r, "Completa la oración.", REFLEXIVE_CHOICE)],
  ["OO.8", "Usar pronombres reflexivos", (r) => choose(r, "Completa la oración.", REFLEXIVE_USE)],
  ["OO.9", "Identificar pronombres relativos", (r) => pickInSentence(r, "Selecciona el pronombre o adverbio relativo.", REL_IN)],
  ["OO.10", "Usar pronombres relativos: que, quien y quienes", (r) => choose(r, "Completa la oración.", QUE_QUIEN)],
  ["OO.11", "Usar pronombres relativos: que, quien, cuyo, el cual y donde", (r) => choose(r, "Completa la oración.", RELATIVE_USE)],

  ["PP.1", "Identificar verbos principales y verbos auxiliares", (r) => choose(r, "", HELPING)],
  ["PP.2", "¿Qué indica el verbo: capacidad, permiso, obligación o posibilidad?", (r) => choose(r, "", MODAL_SHOWS)],
  ["PP.3", "Usar el verbo correcto: poder, deber, tener que, soler", (r) => choose(r, "Completa la oración.", MODAL_USE)],

  ["QQ.1", "Usar el sujeto o el verbo correcto", (r) => choose(r, "Completa la oración.", SUBJECT_VERB)],
  ["QQ.2", "Usar el sujeto o el verbo correcto, con sujetos compuestos", (r) => choose(r, "Completa la oración.", COMPOUND_SUBJECT)],

  ["RR.1", "¿La oración está en pasado, presente o futuro?", (r) => choose(r, "", TENSES)],
  ["RR.2", "Formar y usar el pasado de verbos regulares", (r) => choose(r, "Completa con el verbo en pasado.", PAST_REGULAR)],
  ["RR.3", "Formar y usar el pasado de verbos irregulares", (r) => choose(r, "Completa con el verbo en pasado.", PAST_IRREGULAR)],
  ["RR.4", "Formar y usar el pasado, el presente y el futuro", (r) => choose(r, "Completa con el verbo en el tiempo que corresponde.", THREE_TENSES)],
  ["RR.5", "Corregir cambios indebidos de tiempo verbal", (r) => choose(r, "", TENSE_SHIFTS)],
  ["RR.6", "Usar los tiempos con estar + gerundio", (r) => choose(r, "Completa la oración.", PROGRESSIVE_USE)],
  ["RR.7", "Formar el gerundio para los tiempos con estar", (r) => choose(r, "", PROGRESSIVE_FORM)],
  ["RR.8", "Elegir entre el pasado y el participio", (r) => choose(r, "Completa la oración.", PAST_OR_PARTICIPLE)],
  ["RR.9", "Usar los tiempos compuestos con haber", (r) => choose(r, "Completa la oración.", PERFECT_USE)],
  ["RR.10", "Formar los tiempos compuestos con haber", (r) => choose(r, "", PERFECT_FORM)],
];
