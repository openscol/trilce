"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WINDOW_LABEL, windowStatus } from "@/lib/exams/online";
import { ExamSheet, type ExamFormData } from "./exam-sheet";

export function ExamList({ exams, classGroups }: { exams: ExamFormData[]; classGroups: { id: string; label: string }[] }) {
  const [sheetItem, setSheetItem] = useState<ExamFormData | "new" | null>(null);
  const router = useRouter();
  const labelOf = new Map(classGroups.map((g) => [g.id, g.label]));

  return (
    <>
      <div className="rounded-2xl border border-border">
        <div className="flex items-center justify-end border-b border-border p-3">
          <Button size="sm" onClick={() => setSheetItem("new")}>
            <PlusIcon />
            Nuevo examen
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Examen</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Secciones</TableHead>
              <TableHead>Resultados</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  Todavía no hay exámenes.
                </TableCell>
              </TableRow>
            )}
            {exams.map((item) => (
              <TableRow key={item.exam.id} className="cursor-pointer" onClick={() => router.push(`/examenes/${item.exam.id}`)}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.exam.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.exam.subject ? `${item.exam.subject} · ` : ""}
                      {item.exam.question_count} preguntas
                      {item.exam.entry_mode === "online" ? " · en línea" : ""}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{item.exam.exam_date}</TableCell>
                <TableCell className="text-sm">{item.classGroupIds.map((id) => labelOf.get(id) ?? "—").join(", ") || "—"}</TableCell>
                <TableCell className="font-mono text-sm">{item.resultCount}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {Object.keys(item.keys).length === 0 && <Badge variant="outline">{item.exam.entry_mode === "online" ? "Sin preguntas" : "Sin clave"}</Badge>}
                    {item.exam.entry_mode === "online" && <Badge variant={windowStatus(item.exam.opens_at, item.exam.closes_at) === "open" ? "default" : "secondary"}>{WINDOW_LABEL[windowStatus(item.exam.opens_at, item.exam.closes_at)]}</Badge>}
                    <Badge variant={item.exam.published ? "default" : "secondary"}>{item.exam.published ? "Publicado" : item.exam.entry_mode === "online" ? "Sin liberar" : "Borrador"}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSheetItem(item);
                    }}
                  >
                    <PencilIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ExamSheet item={sheetItem === "new" ? null : sheetItem} classGroups={classGroups} open={sheetItem !== null} onOpenChange={(open) => !open && setSheetItem(null)} />
    </>
  );
}
