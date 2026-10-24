import "server-only";
import { cookies } from "next/headers";
import { MODE_COOKIE, parseMode } from "./modes";

// Modo elegido por el usuario en este navegador (CNEB si no eligió ninguno).
export async function getGameMode() {
  const store = await cookies();
  return parseMode(store.get(MODE_COOKIE)?.value);
}
