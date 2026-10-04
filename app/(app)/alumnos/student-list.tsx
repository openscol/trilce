"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, KeyRoundIcon, PlusIcon, SearchIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Database } from "@/lib/supabase/database.types";
import { LEVEL_LABELS, STUDENT_STATUS_LABELS } from "./labels";
import { StudentSheet, type CreatedInfo } from "./student-sheet";

type Student = Database["public"]["Tables"]["students"]["Row"];
type EnrollmentLevel = Database["public"]["Enums"]["enrollment_level"];

const LEVELS: EnrollmentLevel[] = ["inicial", "primaria", "secundaria"];
const ALL = "all";

function gradeSectionLabel(student: Student) {
  const grade = student.grade ? `${student.grade}°` : "Sin grado";
  return student.section ? `${grade} ${student.section}` : grade;
}

const PAGE_SIZES = [25, 50, 100];

// Minúsculas y sin tildes: "PEÑA" y "pena", "Aylén" y "aylen" coinciden.
function normalize(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function matchesSearch(student: Student, query: string) {
  const haystack = normalize(
    [student.first_names, student.paternal_surname, student.maternal_surname ?? "", student.document_number ?? "", student.code].join(" ")
  );
  // Cada palabra buscada debe aparecer: "quispe diego" encuentra a QUISPE NUÑEZ, DIEGO.
  return normalize(query).split(/\s+/).filter(Boolean).every((word) => haystack.includes(word));
}

// Orden natural: 2° antes que 10°, y luego por sección.
function compareGradeSection(a: string, b: string) {
  return a.localeCompare(b, "es", { numeric: true });
}

const STATUS_BADGE_VARIANT: Record<string, "default" | "outline" | "secondary"> = {
  activo: "default",
  retirado: "secondary",
  egresado: "outline",
  inactivo: "outline",
};

export function StudentList({
  students,
  canWrite,
  canForceDelete,
}: {
  students: Student[];
  canWrite: boolean;
  canForceDelete: boolean;
}) {
  const [sheetStudent, setSheetStudent] = useState<Student | "new" | null>(
    null
  );
  // Por defecto se ocultan los inactivos (p. ej. alumnos demo); el switch
  // cambia la vista para mostrar solo los inactivos.
  const [showInactive, setShowInactive] = useState(false);
  const [createdInfo, setCreatedInfo] = useState<CreatedInfo | null>(null);
  const inactiveCount = students.filter((s) => s.status === "inactivo").length;
  const [level, setLevel] = useState<EnrollmentLevel | typeof ALL>(ALL);
  const [gradeSection, setGradeSection] = useState<string>(ALL);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [page, setPage] = useState(0);

  const statusStudents = students.filter(
    (s) => (s.status === "inactivo") === showInactive
  );
  const levelStudents =
    level === ALL
      ? statusStudents
      : statusStudents.filter((s) => s.level === level);
  const gradeSectionOptions = [
    ...new Set(levelStudents.map(gradeSectionLabel)),
  ].sort(compareGradeSection);
  const filteredStudents = (
    gradeSection === ALL
      ? levelStudents
      : levelStudents.filter((s) => gradeSectionLabel(s) === gradeSection)
  ).filter((s) => search.trim() === "" || matchesSearch(s, search));
  const pageCount = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const visibleStudents = filteredStudents.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  function selectLevel(next: EnrollmentLevel | typeof ALL) {
    setLevel(next);
    setGradeSection(ALL);
    setPage(0);
  }

  return (
    <>
      <div className="rounded-2xl border border-border">
        <div className="flex items-center justify-between border-b border-border p-3">
          <div className="flex items-center gap-2">
            <Switch
              id="show-inactive"
              checked={showInactive}
              onCheckedChange={(checked) => {
                setShowInactive(checked);
                setGradeSection(ALL);
                setPage(0);
              }}
            />
            <Label htmlFor="show-inactive" className="text-sm font-normal">
              Ver inactivos ({inactiveCount})
            </Label>
          </div>
          {canWrite && (
            <div className="flex items-center gap-2">
              <Link
                href="/alumnos/credenciales"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <KeyRoundIcon />
                Credenciales
              </Link>
              <Button size="sm" onClick={() => setSheetStudent("new")}>
                <PlusIcon />
                Nuevo alumno
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
          <div className="flex items-center gap-1 rounded-lg border border-border p-1">
            {([ALL, ...LEVELS] as const).map((value) => {
              const count =
                value === ALL
                  ? statusStudents.length
                  : statusStudents.filter((s) => s.level === value).length;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => selectLevel(value)}
                  className={cn(
                    "rounded-md px-3 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                    level === value && "bg-muted text-foreground"
                  )}
                >
                  {value === ALL ? "Todos" : LEVEL_LABELS[value]}{" "}
                  <span className="font-mono text-xs text-muted-foreground">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="relative w-full sm:w-64">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Buscar por nombres, apellidos o DNI"
              className="pl-8"
              aria-label="Buscar alumno"
            />
          </div>
          {level !== ALL && (
            <Select
              value={gradeSection}
              onValueChange={(value) => {
                setGradeSection(value ?? ALL);
                setPage(0);
              }}
            >
              <SelectTrigger className="w-48" size="sm">
                <SelectValue>
                  {(value: string) =>
                    value === ALL ? "Todos los grados" : value
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todos los grados</SelectItem>
                {gradeSectionOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Alumno</TableHead>
              <TableHead>Nivel</TableHead>
              <TableHead>Grado</TableHead>
              <TableHead>Sección</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleStudents.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  {statusStudents.length > 0
                    ? "No hay alumnos con este filtro."
                    : showInactive
                      ? "No hay alumnos inactivos."
                      : "Todavía no hay alumnos registrados."}
                </TableCell>
              </TableRow>
            )}
            {visibleStudents.map((student) => (
              <TableRow
                key={student.id}
                className="cursor-pointer"
                onClick={() => setSheetStudent(student)}
              >
                <TableCell className="font-mono text-xs">
                  {student.code}
                </TableCell>
                <TableCell>
                  {student.paternal_surname} {student.maternal_surname ?? ""}
                  , {student.first_names}
                </TableCell>
                <TableCell>
                  {student.level ? LEVEL_LABELS[student.level] : "—"}
                </TableCell>
                <TableCell>{student.grade ?? "—"}</TableCell>
                <TableCell>{student.section ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_BADGE_VARIANT[student.status]}>
                    {STUDENT_STATUS_LABELS[student.status]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Mostrar</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                setPageSize(Number(value) || PAGE_SIZES[0]);
                setPage(0);
              }}
            >
              <SelectTrigger size="sm" className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>por página</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="tabular-nums">
              {filteredStudents.length === 0
                ? "0 resultados"
                : `${currentPage * pageSize + 1}–${currentPage * pageSize + visibleStudents.length} de ${filteredStudents.length}`}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 0}
              aria-label="Página anterior"
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage >= pageCount - 1}
              aria-label="Página siguiente"
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </div>

      <StudentSheet
        student={sheetStudent === "new" ? null : sheetStudent}
        open={sheetStudent !== null}
        onOpenChange={(open) => !open && setSheetStudent(null)}
        onCreated={(created, info) => {
          setCreatedInfo(info);
          setSheetStudent(created);
        }}
        createdInfo={createdInfo}
        readOnly={!canWrite}
        canForceDelete={canForceDelete}
      />
    </>
  );
}
