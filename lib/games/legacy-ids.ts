// Ids antiguos de juegos → id actual. Antes de reorganizarlos según el CNEB,
// los juegos de Matemáticas y Comunicación tenían códigos como «A.1»; las
// partidas guardadas con esos códigos (game_sessions / game_attempts) se
// conectan aquí con el juego que hoy contiene ese mismo generador. No se
// cambian los datos guardados: el historial se traduce al leerlo.
//
// Solo están los ids que tienen partidas guardadas (consulta del 2026-10-24):
// los juegos nuevos ya se guardan con su id actual. Cada uno se emparejó por
// el generador que usaba (el mismo texto en el archivo antiguo y en el nuevo).
export const LEGACY_SKILL_IDS: Record<string, string> = {
  "matematicas/i5/A.2": "matematicas/i5/numero-escuchado",
  "matematicas/i5/L.10": "matematicas/i5/recta-10",
  "matematicas/i5/XX.1": "matematicas/i5/reloj",
  "matematicas/i5/ZZ.3": "matematicas/i5/ganar-dinero",
  "matematicas/i5/ZZ.4": "matematicas/i5/deseos-necesidades",
  "matematicas/p1/A.1": "matematicas/p1/contar-20",
  "matematicas/p1/A.3": "matematicas/p1/saltos",
  "matematicas/p1/A.8": "matematicas/p1/recta",
  "matematicas/p1/A.9": "matematicas/p1/tablero-100",
  "matematicas/p1/A.13": "matematicas/p1/par-impar",
  "matematicas/p1/J.1": "matematicas/p1/decenas-20",
  "matematicas/p1/J.6": "matematicas/p1/decenas-100",
  "matematicas/p1/O.2": "matematicas/p1/mas-probable",
  "matematicas/p2/D.1": "matematicas/p2/dibujo-operacion",
  "matematicas/p3/A.1": "matematicas/p3/contar-100",
  "matematicas/p3/A.2": "matematicas/p3/contar-100",
  "matematicas/p3/A.4": "matematicas/p3/contar-1000",
  "matematicas/p3/C.1": "matematicas/p3/patrones-repeticion",
  "matematicas/p3/C.2": "matematicas/p3/patrones-repeticion",
  "matematicas/p3/E.1": "matematicas/p3/calculo-20",
  "matematicas/p3/Y.2": "matematicas/p3/mas-probable",
  "matematicas/p4/A.8": "matematicas/p4/leer-millon",
  "matematicas/p6/A.2": "matematicas/p6/sumar-restar",
  "matematicas/p6/B.5": "matematicas/p6/estimar-productos",
  "matematicas/s1/A.1": "matematicas/s1/comprender-enteros",
  "matematicas/s1/A.2": "matematicas/s1/comprender-enteros",
  "comunicacion/i5/A.1": "comunicacion/i5/letras-a-h",
  "comunicacion/p1/N.3": "comunicacion/p1/trabadas",
  "comunicacion/p1/N.4": "comunicacion/p1/trabadas",
  "comunicacion/p3/F.1": "comunicacion/p3/frecuentes",
};

export function resolveSkillUid(uid: string) {
  return LEGACY_SKILL_IDS[uid] ?? uid;
}
