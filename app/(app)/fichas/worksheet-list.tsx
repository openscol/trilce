"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileDownIcon, PencilIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CATEGORY_LABEL, itemsSummary, type WorksheetItem } from "@/lib/games/worksheets";
import { DeleteWorksheetButton } from "./delete-worksheet-button";

type Row = { id: string; title: string; category: string; items: WorksheetItem[]; createdAt: string; author: string | null };

const dateFmt = new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "short", year: "numeric" });

export function WorksheetList({ worksheets }: { worksheets: Row[] }) {
  const router = useRouter();
  return (
    <div className="rounded-2xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Contiene</TableHead>
            <TableHead className="hidden md:table-cell">Creada</TableHead>
            <TableHead className="w-32 text-right">Opciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {worksheets.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                Todavía no hay fichas. Crea la primera con «Nueva ficha».
              </TableCell>
            </TableRow>
          )}
          {worksheets.map((w) => {
            const summary = itemsSummary(w.items);
            const total = w.items.reduce((n, it) => n + it.count, 0);
            return (
              <TableRow key={w.id} className="cursor-pointer align-top" onClick={() => router.push(`/fichas/${w.id}`)}>
                <TableCell className="whitespace-normal">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{w.title}</span>
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline">{CATEGORY_LABEL[w.category] ?? w.category}</Badge>
                      {total} ejercicios
                    </span>
                  </div>
                </TableCell>
                <TableCell className="whitespace-normal">
                  <ul className="flex flex-col gap-0.5 text-sm">
                    {summary.map((s, i) => (
                      <li key={i}>
                        {s.title} <span className="text-muted-foreground">({s.count} {s.count === 1 ? "ejercicio" : "ejercicios"})</span>
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                  {dateFmt.format(new Date(w.createdAt))}
                  {w.author && <div className="text-xs">{w.author}</div>}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon-sm" title="Ver y descargar el PDF" nativeButton={false} render={<Link href={`/fichas/${w.id}`} />}>
                      <FileDownIcon />
                    </Button>
                    <Button variant="ghost" size="icon-sm" title="Editar" nativeButton={false} render={<Link href={`/fichas/${w.id}/editar`} />}>
                      <PencilIcon />
                    </Button>
                    <DeleteWorksheetButton id={w.id} />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
