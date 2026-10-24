// Modos de los juegos. El `id` es interno y no cambia nunca (se guarda en la
// cookie y marca el contenido); `label` y `description` son lo que se ve y se
// pueden renombrar aquí sin tocar nada más.
export type GameMode = "cneb" | "extendido" | "dificil";

export const MODES: { id: GameMode; label: string; description: string; available: boolean }[] = [
  { id: "cneb", label: "CNEB", description: "Solo lo que pide el Currículo Nacional para cada grado.", available: true },
  { id: "extendido", label: "Explorador", description: "El currículo y además temas de grados siguientes.", available: true },
  { id: "dificil", label: "Difícil", description: "Próximamente.", available: false },
];

export const DEFAULT_MODE: GameMode = "cneb";
export const MODE_COOKIE = "juegos_modo";

export function parseMode(value: string | undefined): GameMode {
  return MODES.find((m) => m.id === value && m.available)?.id ?? DEFAULT_MODE;
}

export function modeLabel(id: GameMode) {
  return MODES.find((m) => m.id === id)!.label;
}
