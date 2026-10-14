"use client";

import { ChevronDownIcon, PrinterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type PrintFormat = "lista" | "tarjetas";

// Imprimir pregunta el formato: la página tiene los dos y el estilo de
// impresión muestra solo el elegido (ver page.tsx).
export function PrintMenu({ disabled }: { disabled?: boolean }) {
  const print = (format: PrintFormat) => {
    const root = document.documentElement;
    root.dataset.print = format;
    const clear = () => {
      delete root.dataset.print;
      window.removeEventListener("afterprint", clear);
    };
    window.addEventListener("afterprint", clear);
    window.print();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button size="sm" disabled={disabled} />}>
        <PrinterIcon />
        Imprimir
        <ChevronDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem onClick={() => print("lista")} className="flex-col items-start gap-0">
          <span>Lista</span>
          <span className="text-xs text-muted-foreground">Tabla con todos los alumnos de la sección</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => print("tarjetas")} className="flex-col items-start gap-0">
          <span>Tarjetas para el cuaderno</span>
          <span className="text-xs text-muted-foreground">Una por alumno, tres columnas, 6 cm de alto</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
