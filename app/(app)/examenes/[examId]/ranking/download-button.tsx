"use client";

import { DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Abre el diálogo de impresión del navegador, donde se elige «Guardar como PDF».
// El título de la página pasa a ser el nombre del archivo.
export function DownloadButton({ fileName, disabled }: { fileName: string; disabled?: boolean }) {
  return (
    <Button
      size="sm"
      disabled={disabled}
      onClick={() => {
        const previous = document.title;
        document.title = fileName;
        window.print();
        document.title = previous;
      }}
    >
      <DownloadIcon />
      Descargar PDF
    </Button>
  );
}
