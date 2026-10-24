// Vista «por temas»: competencias del Currículo Nacional (CNEB, MINEDU) y,
// dentro de cada una, temas que atraviesan los grados. Cada sección de un
// currículo dice a qué tema pertenece (`Section.topic`); un tema reúne las
// secciones de todos los grados que lo trabajan.

export type Topic = { id: string; name: string; icon: string };
export type Competency = { id: string; name: string; short: string; icon: string; topics: Topic[] };

const TOPICS: Record<string, Competency[]> = {
  matematicas: [
    {
      id: "cantidad",
      short: "Cantidad",
      name: "Resuelve problemas de cantidad",
      icon: "🔢",
      topics: [
        { id: "numeros", name: "Números y valor posicional", icon: "🔢" },
        { id: "suma-resta", name: "Suma y resta", icon: "➕" },
        { id: "multiplicacion-division", name: "Multiplicación y división", icon: "✖️" },
        { id: "fracciones", name: "Fracciones", icon: "🍕" },
        { id: "decimales", name: "Decimales y porcentajes", icon: "💯" },
        { id: "enteros", name: "Enteros y racionales", icon: "🌡️" },
        { id: "potencias", name: "Potencias y raíces", icon: "🔺" },
        { id: "dinero", name: "Dinero y finanzas", icon: "💰" },
        { id: "tiempo-masa", name: "Tiempo, masa y capacidad", icon: "⏱️" },
      ],
    },
    {
      id: "regularidad",
      short: "Regularidad",
      name: "Resuelve problemas de regularidad, equivalencia y cambio",
      icon: "🔁",
      topics: [
        { id: "patrones", name: "Patrones", icon: "🎨" },
        { id: "igualdades", name: "Igualdades y ecuaciones", icon: "⚖️" },
        { id: "expresiones", name: "Expresiones algebraicas", icon: "🔤" },
        { id: "proporcionalidad", name: "Proporcionalidad", icon: "📐" },
        { id: "funciones", name: "Funciones", icon: "📈" },
      ],
    },
    {
      id: "forma",
      short: "Forma",
      name: "Resuelve problemas de forma, movimiento y localización",
      icon: "🔷",
      topics: [
        { id: "figuras", name: "Figuras planas", icon: "🔷" },
        { id: "cuerpos", name: "Cuerpos geométricos", icon: "🧊" },
        { id: "ubicacion", name: "Ubicación y desplazamiento", icon: "🧭" },
        { id: "longitud-area", name: "Longitud, perímetro y área", icon: "📏" },
        { id: "angulos", name: "Ángulos y rectas", icon: "📐" },
        { id: "transformaciones", name: "Simetría y transformaciones", icon: "🪞" },
        { id: "trigonometria", name: "Trigonometría", icon: "🔺" },
      ],
    },
    {
      id: "datos",
      short: "Datos",
      name: "Resuelve problemas de gestión de datos e incertidumbre",
      icon: "📊",
      topics: [
        { id: "graficos", name: "Tablas y gráficos", icon: "📊" },
        { id: "estadistica", name: "Medidas estadísticas", icon: "🧮" },
        { id: "probabilidad", name: "Probabilidad", icon: "🎲" },
      ],
    },
  ],
  comunicacion: [
    {
      id: "oral",
      short: "Oral",
      name: "Se comunica oralmente en su lengua materna",
      icon: "🗣️",
      topics: [{ id: "escucha", name: "Escucha y comprende", icon: "👂" }],
    },
    {
      id: "lee",
      short: "Lectura",
      name: "Lee diversos tipos de textos escritos en su lengua materna",
      icon: "📖",
      topics: [
        { id: "letras-sonidos", name: "Letras, sílabas y sonidos", icon: "🔤" },
        { id: "comprension", name: "Comprensión de lectura", icon: "📖" },
        { id: "tipos-texto", name: "Tipos de textos", icon: "📰" },
        { id: "vocabulario", name: "Vocabulario", icon: "📚" },
        { id: "literatura", name: "Literatura peruana", icon: "🏔️" },
      ],
    },
    {
      id: "escribe",
      short: "Escritura",
      name: "Escribe diversos tipos de textos en su lengua materna",
      icon: "✍️",
      topics: [
        { id: "ortografia", name: "Ortografía", icon: "✏️" },
        { id: "tildes", name: "Tildes", icon: "🖋️" },
        { id: "puntuacion", name: "Puntuación", icon: "❗" },
        { id: "gramatica", name: "Gramática", icon: "🧩" },
        { id: "redaccion", name: "Planificar y revisar textos", icon: "📝" },
      ],
    },
  ],
};

export function getCompetencies(category: string): Competency[] {
  return TOPICS[category] ?? [];
}

export function hasTopics(category: string) {
  return getCompetencies(category).length > 0;
}

export function getTopic(category: string, topicId: string) {
  for (const competency of getCompetencies(category)) {
    const topic = competency.topics.find((t) => t.id === topicId);
    if (topic) return { competency, topic };
  }
  return undefined;
}
