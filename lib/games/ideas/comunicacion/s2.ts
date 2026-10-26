import { IDEAS as S1 } from "./s1";

// Ideas clave de Comunicación, 2.° de secundaria. Los juegos que repiten las
// mismas formas de 1.° de secundaria (con otros textos) usan la misma idea.
const SHARED = [
  "ideas-principales", "temas", "proposito", "tono", "literatura", "argumento", "comparar-textos", "visuales", "estructuras",
  "sentidos-alusion", "figuras", "rima", "personificacion", "informativos", "sinonimos-antonimos", "matices", "analogias",
  "contexto", "academico", "diccionario", "prefijos", "sufijos", "griegas-latinas", "confundidas", "comas", "explicativos",
  "punto-y-coma", "raya-suspensivos", "guion", "mayusculas", "citas-dialogos", "oracion", "fragmentos", "frase-proposicion",
  "subordinadas", "objetos", "antecedentes", "personales", "reflexivos", "relativos", "plurales", "adjetivos-adverbios",
  "comparar", "preposiciones", "modificadores", "transitivos", "concordancia", "tiempos", "organizar", "estilo", "claridad",
  "corregir", "tesis", "contraargumentos", "apelaciones", "falacias", "fuentes", "apa",
];

export const IDEAS: Record<string, string> = {
  ...Object.fromEntries(SHARED.map((id) => [id, S1[id]])),
  "homofonos": "Los homófonos suenan igual y se escriben distinto: revelar (descubrir) / rebelar (sublevarse); bienes (riquezas) / vienes (de venir); siento (de sentir) / ciento (cien). Algunas palabras tienen varias acepciones según el contexto.",
  "rios-profundos": "«Los ríos profundos» de José María Arguedas narra la vida de Ernesto, un adolescente entre el mundo andino y el colegio de Abancay; los ríos simbolizan la fuerza y la continuidad del mundo andino frente al orden injusto.",
  "mundo-ancho": "«El mundo es ancho y ajeno» de Ciro Alegría cuenta la lucha de la comunidad de Rumi, guiada por Rosendo Maqui, contra el despojo del hacendado Álvaro Amenábar; denuncia la injusticia contra los pueblos indígenas.",
  "afroperuanos": "La esclavitud se abolió en el Perú en 1854 (San Martín solo había liberado a los hijos nacidos desde 1821). La cultura afroperuana, nacida en la adversidad, tiene figuras como Nicomedes y Victoria Santa Cruz.",
  "ruiz-gallo": "Pedro Ruiz Gallo fue un inventor peruano autodidacta (el reloj monumental, estudios de aviación) que murió en un accidente durante la guerra del Pacífico; es considerado un precursor.",
  "raimondi": "Antonio Raimondi, naturalista italiano, recorrió el Perú durante décadas estudiando su geografía, flora y minerales; adoptó el Perú como su patria y dejó un conocimiento científico duradero.",
  "prefijos-ortografia": "Los prefijos ante- (antes), inter- (entre), super- (encima) y trans- (a través) se escriben unidos a la base; los sufijos -al, -ción y -sión forman adjetivos y sustantivos (cultural, transmisión).",
  "raices-ortografia": "Las raíces latinas conservan su escritura: aud (oír: auditorio), yect (lanzar: proyecto, inyección), dic (decir: contradicción), duc (guiar: conducir, producción).",
  "b-v": "Se escriben con b las terminaciones -aba del pretérito (estaba) y los verbos en -bir (escribir, describir), salvo hervir, servir y vivir. Después de n, l, d y b se escribe v (invierno, adverbio).",
  "g-tildes": "Se escriben con g las terminaciones -gen (origen), -gía (energía) y el prefijo geo- (geografía). Para las tildes, aplica las reglas de agudas, graves y esdrújulas (lápiz, canción, música).",
  "verboides": "Los verboides son el infinitivo (función de sustantivo o complemento), el gerundio (expresa modo, tiempo o causa) y el participio (funciona como adjetivo y concuerda con el sustantivo al que modifica).",
  "modos": "Indicativo: hechos reales (llega). Subjuntivo: deseos, dudas o hechos posibles (cuando llegues). Imperativo: órdenes (avísame). Tras «cuando» con sentido futuro va subjuntivo.",
  "voz-pasiva": "En voz activa el sujeto realiza la acción (Los artistas pintarán el mural). En voz pasiva el sujeto la recibe (El mural será pintado por los artistas). Para pasar a activa, el agente se vuelve sujeto.",
};
