import { IDEAS as S4 } from "./s4";

// Ideas clave de Comunicación, 5.° de secundaria. Los juegos que repiten las
// mismas formas de 4.° de secundaria (con otros textos) usan la misma idea.
const FROM_S4 = [
  "ideas-principales", "temas", "proposito", "tono", "argumentos", "literarios", "informativos-atenta", "cuentos", "alusiones",
  "figuras", "efecto-figuras", "retorica", "desarrollo", "homofonos", "prestamos", "usos-discutidos", "analogias", "contexto",
  "griegas-latinas", "mal-escritas", "comas", "explicativas", "punto-y-coma", "raya-guion", "pertenencia", "mayusculas", "frases",
  "proposiciones", "le-la-lo", "relativos", "antecedentes", "verbos", "concordancia", "tiempos", "voz", "organizar", "tematica-tesis",
  "claridad", "corregir", "analisis", "falacias", "persuasion", "apa", "plagio",
];

export const IDEAS: Record<string, string> = {
  ...Object.fromEntries(FROM_S4.map((id) => [id, S4[id]])),
  "figuras-2": "Anáfora: repite palabras al inicio de versos u oraciones. Antítesis: opone ideas contrarias. Apóstrofe: se dirige a alguien o algo ausente. Aliteración: repite sonidos. Quiasmo: cruza el orden (comer para vivir, no vivir para comer). Lítote: niega lo contrario (no es tonto = es listo).",
  "poesia": "En la poesía peruana, José Santos Chocano representa el modernismo (versos alejandrinos de catorce sílabas, rima consonante); José María Eguren, el simbolismo; y César Vallejo, con «Trilce» (1922), la vanguardia que rompe la métrica y el lenguaje tradicional.",
  "matalache": "«Matalaché» de Enrique López Albújar, ambientada en Piura poco antes de la independencia, narra el amor entre un esclavo y la hija del dueño de la jabonería; denuncia las jerarquías sociales y raciales.",
  "collacocha": "«Collacocha» de Enrique Solari Swayne es un drama sobre el ingeniero Echecopar, que construye un túnel en los Andes enfrentando a la naturaleza hostil; la montaña funciona casi como antagonista.",
  "peruanidad": "«Peruanidad» de Víctor Andrés Belaunde es un ensayo que pregunta qué une a los peruanos y propone la nación como síntesis de culturas; sus críticos objetan el peso que da a la herencia española y católica.",
  "documentos": "Los reglamentos, políticas y bases son textos normativos: establecen derechos, deberes, criterios y consecuencias. Lee cada artículo con atención a lo que obliga, permite o excluye.",
  "palabras-parecidas": "Las palabras parecidas (parónimos) se distinguen por su significado: adoptar (tomar como propio) / adaptar (ajustar). Elige según la connotación: elogio (elocuente), crítica (descabellado) o neutra (inmigrante).",
  "precision": "Usa cada palabra con su significado exacto: «sendos» significa «uno cada uno»; «derogar» es anular una ley. Un sinónimo solo sirve si encaja en el contexto (un ejemplo evidente).",
  "ciencia": "En los textos de ciencia y tecnología, los términos tienen un significado preciso: endémico (que vive solo en un lugar), servidor (computadora que ofrece datos a otras). Usa el contexto para deducirlo.",
  "prefijos": "Los prefijos y sufijos cultos tienen significado fijo: infra- (debajo), -cida (que mata: herbicida), -cracia (gobierno: teocracia, democracia). Únelos para entender la palabra.",
  "afijos-ortografia": "anti- y pos- se escriben unidos a la palabra (antivirus, posgrado); «no» delante de un sustantivo va separado y sin guion (la no violencia); -ción y -oso según la familia (ambicioso, ambición).",
  "bases": "Las bases cultas forman muchas palabras: crono (tiempo), grama (letra, escrito), métrico (medida), termo (calor), esfera (globo). Conservan su escritura: cronómetro, simétrico, hemisferio.",
  "tildes": "Los monosílabos no llevan tilde (dio, vio, fue, fe), salvo la diacrítica (tú/tu, él/el, sé/se). «Aún» lleva tilde cuando significa «todavía»; «solo» ya no la lleva, ni como adverbio.",
  "compuestas": "Los adverbios en -mente conservan la tilde del adjetivo (fácilmente, rápidamente). Las palabras compuestas en una sola palabra siguen las reglas generales (veintidós, decimoséptimo).",
  "bien-escrita": "Revisa la palabra letra por letra y su tilde: relaciónala con su familia de palabras y con las reglas ortográficas para saber si está bien escrita.",
  "confundidas": "Se confunden: a sí mismo (a uno mismo) / así (de ese modo); sino (excepto, sino que) / si no (condición); porque / por qué / porqué / por que; asimismo / a sí mismo.",
  "fragmentos": "Una oración completa tiene sentido completo; un fragmento está incompleto; las oraciones pegadas unen ideas sin puntuación ni conector. Corrígelas con un punto, punto y coma o el conector adecuado.",
  "comparativos": "Las correlativas van en pareja y deben completarse: ni… ni, tanto… como, no solo… sino también. Los comparativos usan más/menos… que y tan… como.",
  "modificadores": "El modificador debe ir junto a lo que describe (✗ Vendo cocina para señora de cuatro hornillas). Un modificador colgante no tiene a quién referirse. El gerundio no debe usarse como adjetivo (✗ una ley regulando).",
  "evidencias": "Una evidencia sólida es verificable y pertinente (cifras, registros, resultados medidos); una débil es anecdótica o no prueba la afirmación. Distingue hechos de opiniones.",
  "padre-horan": "«El padre Horán» de Narciso Aréstegui, novela romántica ambientada en el Cusco de inicios de la república, denuncia los abusos de un sacerdote de apariencia virtuosa y pasión oculta.",
  "humboldt": "Alexander von Humboldt estudió el Perú a inicios del siglo XIX: descubrió que el mar frente al Callao era más frío de lo esperado (la corriente lleva su nombre) y llamó la atención sobre el guano.",
  "documentos-legales": "Contratos, libro de reclamaciones y garantías son documentos legales: identifica a las partes (arrendador, arrendatario), las condiciones, lo que cubre o excluye la garantía y la norma que los regula.",
  "ortografia-culta": "Los prefijos i- e ir- niegan (ilegal, irreal); las terminaciones -ante y -encia forman adjetivos y sustantivos (importante, paciencia). Las bases cultas conservan su escritura: autógrafo (auto, grafo), burocracia (cracia: poder).",
};
