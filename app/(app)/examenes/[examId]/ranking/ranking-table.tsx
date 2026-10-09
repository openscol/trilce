"use client";

import { useState } from "react";
import { formatScore } from "@/lib/exams/shared";
import { cn } from "@/lib/utils";
import { AnswerStrip } from "../answer-strip";
import { DownloadButton } from "./download-button";

export type RankingRow = {
  id: string;
  name: string;
  code: string;
  group: string;
  theme: string;
  answers: string;
  marks: string | null;
  correct_count: number | null;
  score: number | null;
};

type Order = "ranking" | "code";

// Tabla del reporte con sus opciones: orden y qué datos del alumno se muestran.
// Las opciones no salen en el PDF; lo que se ve en pantalla es lo que se descarga.
export function RankingTable({ rows, questionCount, fileName }: { rows: RankingRow[]; questionCount: number; fileName: string }) {
  const [order, setOrder] = useState<Order>("ranking");
  const [showName, setShowName] = useState(true);
  const [showCode, setShowCode] = useState(true);

  const sorted = [...rows].sort((a, b) =>
    order === "code"
      ? a.code.localeCompare(b.code, "es", { numeric: true })
      : (b.score ?? -1) - (a.score ?? -1) || a.name.localeCompare(b.name, "es")
  );
  const showStudent = showName || showCode;

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border p-4 text-sm print:hidden">
        <label className="flex items-center gap-2">
          <span className="text-muted-foreground">Ordenar por</span>
          <select value={order} onChange={(e) => setOrder(e.target.value as Order)} className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground">
            <option value="ranking">Ranking (mayor a menor nota)</option>
            <option value="code">Código (01, 02, 03…)</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={!showName} onChange={(e) => setShowName(!e.target.checked)} className="size-4 accent-primary" />
          Ocultar nombres y apellidos
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={!showCode} onChange={(e) => setShowCode(!e.target.checked)} className="size-4 accent-primary" />
          Ocultar código
        </label>
        <span className="ml-auto">
          <DownloadButton fileName={fileName} disabled={rows.length === 0} />
        </span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground print:border-black print:text-black">
            {showStudent && <th className="p-2 pl-4 font-normal">{showName ? "Alumno" : "Código"}</th>}
            <th className={cn("p-2 font-normal", !showStudent && "pl-4")}>Sección</th>
            <th className="p-2 font-normal">Tipo</th>
            <th className="p-2 font-normal">Respuestas</th>
            <th className="p-2 font-normal">Correctas</th>
            <th className="p-2 pr-4 text-right font-normal">Nota</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-muted-foreground">
                Todavía no hay fichas procesadas.
              </td>
            </tr>
          )}
          {sorted.map((row) => (
            <tr key={row.id} className="break-inside-avoid border-b border-border [print-color-adjust:exact] last:border-b-0 even:bg-muted/50 print:border-neutral-300 print:even:bg-neutral-100">
              {showStudent && (
                <td className="p-2 pl-4">
                  <div className="flex flex-col">
                    {showName && <span>{row.name}</span>}
                    {showCode && <span className={cn("font-mono", showName && "text-xs text-muted-foreground print:text-neutral-600")}>{row.code}</span>}
                  </div>
                </td>
              )}
              <td className={cn("p-2", !showStudent && "pl-4")}>{row.group}</td>
              <td className="p-2 font-mono">{row.theme}</td>
              <td className="p-2">
                <AnswerStrip answers={row.answers} marks={row.marks} />
              </td>
              <td className="p-2 font-mono">
                {row.correct_count ?? "—"} / {questionCount}
              </td>
              <td className="p-2 pr-4 text-right font-mono">{formatScore(row.score)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
