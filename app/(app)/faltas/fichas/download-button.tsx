"use client";

import { useState } from "react";
import { DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Ancho de una hoja A4 a 96 ppp: cada documento se captura a ese ancho para que el
// PDF salga igual en el celular que en la computadora.
const A4_PX = 794;

// Descarga los documentos en pantalla (.print-page) como un PDF, uno por página.
// Las librerías se cargan solo al pulsar el botón.
export function DownloadSheetsButton({ fileName }: { fileName: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function download() {
    setBusy(true);
    setError(null);
    try {
      const [{ jsPDF }, { toPng }] = await Promise.all([import("jspdf"), import("html-to-image")]);
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const sheets = [...document.querySelectorAll<HTMLElement>(".print-page")];
      for (const [i, sheet] of sheets.entries()) {
        const previous = sheet.style.cssText;
        sheet.style.width = `${A4_PX}px`;
        sheet.style.maxWidth = "none";
        try {
          const png = await toPng(sheet, { pixelRatio: 2, backgroundColor: "#ffffff", style: { border: "0", borderRadius: "0" } });
          // Ajusta la imagen a la hoja A4 (210 × 297 mm) sin deformarla.
          const ratio = sheet.offsetHeight / sheet.offsetWidth;
          const width = Math.min(210, 297 / ratio);
          if (i > 0) pdf.addPage();
          pdf.addImage(png, "PNG", (210 - width) / 2, 0, width, width * ratio);
        } finally {
          sheet.style.cssText = previous;
        }
      }
      pdf.save(`${fileName}.pdf`);
    } catch {
      setError("No se pudo generar el PDF. Usa «Imprimir» y elige «Guardar como PDF».");
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="flex flex-col items-end gap-1">
      <Button variant="outline" size="sm" disabled={busy} onClick={download}>
        <DownloadIcon />
        {busy ? "Generando PDF..." : "Descargar PDF"}
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </span>
  );
}
