"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Dibuja bloques de Scratch 3 con scratchblocks (MIT, la librería que usa la
// wiki de Scratch). El código se escribe en su sintaxis en inglés y se
// traduce al castellano oficial de Scratch, así coincide con el editor.
// Se carga solo en el navegador (necesita `window`).

type ScratchblocksApi = {
  parse: (code: string, options: { languages: string[] }) => { translate: (lang: unknown) => void };
  render: (doc: unknown, options: { style: string; scale: number }) => SVGElement;
  loadLanguages: (langs: Record<string, unknown>) => void;
  allLanguages: Record<string, unknown>;
  appendStyles: () => void;
};

let loader: Promise<ScratchblocksApi> | null = null;

function loadScratchblocks() {
  if (!loader) {
    loader = Promise.all([import("scratchblocks"), import("scratchblocks/locales/es.json")]).then(([mod, es]) => {
      const api = (mod as unknown as { default: ScratchblocksApi }).default;
      api.loadLanguages({ es: (es as { default: unknown }).default });
      api.appendStyles();
      return api;
    });
  }
  return loader;
}

export function ScratchBlocks({ code, scale = 0.85, className }: { code: string; scale?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadScratchblocks()
      .then((sb) => {
        if (cancelled || !ref.current) return;
        const doc = sb.parse(code, { languages: ["en"] });
        doc.translate(sb.allLanguages.es);
        const svg = sb.render(doc, { style: "scratch3", scale });
        // Tamaño real fijado en línea: dentro de un <Button> de shadcn la regla
        // `[&_svg]:size-4` lo encogería a 16 px.
        for (const el of [svg, ...Array.from(svg.querySelectorAll("svg"))]) {
          const w = el.getAttribute("width");
          const h = el.getAttribute("height");
          if (w && h) {
            el.style.width = `${parseFloat(w)}px`;
            el.style.height = `${parseFloat(h)}px`;
          }
        }
        ref.current.replaceChildren(svg);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [code, scale]);

  // Fondo claro siempre: los colores de Scratch están pensados para él.
  return (
    <div className={cn("inline-flex max-w-full overflow-x-auto rounded-lg bg-white p-1.5", className)}>
      {failed ? <pre className="text-left font-mono text-sm text-black">{code}</pre> : <div ref={ref} className="min-h-6 min-w-10" />}
    </div>
  );
}
