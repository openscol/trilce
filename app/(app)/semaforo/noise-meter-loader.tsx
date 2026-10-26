"use client";

import dynamic from "next/dynamic";

// Solo en el navegador: usa el micrófono y lee los ajustes de localStorage.
export const NoiseMeterLoader = dynamic(() => import("./noise-meter").then((m) => m.NoiseMeter), {
  ssr: false,
  loading: () => <p className="text-sm text-muted-foreground">Cargando el semáforo…</p>,
});
