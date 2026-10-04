"use client";

import { useSyncExternalStore } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Modo práctica (sin puntaje): el docente/admin abre cualquier juego sin elegir
// alumno; no se muestra puntaje ni se guarda nada. Está activo por defecto; si
// se apaga, eso se recuerda en este navegador.
const KEY = "juegos:sin-puntaje";
const listeners = new Set<() => void>();

function read() {
  try {
    return localStorage.getItem(KEY) !== "0";
  } catch {
    return true;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function setFreeMode(on: boolean) {
  try {
    if (on) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, "0");
  } catch {
    // Sin almacenamiento disponible: el modo simplemente no se recuerda.
  }
  listeners.forEach((l) => l());
}

export function useFreeMode() {
  return useSyncExternalStore(subscribe, read, () => true);
}

export function FreeModeSwitch() {
  const on = useFreeMode();
  return (
    <div className="flex items-center gap-2">
      <Switch id="free-mode" checked={on} onCheckedChange={setFreeMode} />
      <Label htmlFor="free-mode" className="text-sm font-normal">
        Modo práctica (sin puntaje)
      </Label>
    </div>
  );
}
