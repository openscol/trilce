import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAppContext } from "@/lib/auth/context";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LEVEL_LABELS } from "@/lib/enum-labels";
import { studentName } from "@/lib/exams/shared";
import { DEFAULT_FALTAS_PER_SHEET, dateTime, sheetCode, shortDate } from "@/lib/conduct";
import { PrintButton } from "@/app/(app)/cuestionarios/tarjetas/print-button";
import { ReflectionSheet } from "./reflection-sheet";
import { IncidentReport } from "./incident-report";
import { CalligraphySheet } from "./calligraphy-sheet";
import { DownloadSheetsButton } from "./download-button";

const PRINT_CSS = `
@page { size: A4 portrait; margin: 10mm; }
@media print {
  .print-page { break-inside: avoid; }
  .print-page + .print-page { break-before: page; }
}
`;

const DOCS = [
  { key: "todo", label: "Todo" },
  { key: "acta", label: "Acta" },
  { key: "ficha", label: "Ficha" },
  { key: "caligrafia", label: "Caligrafía" },
] as const;
type Doc = (typeof DOCS)[number]["key"];

// Documentos de una falta para imprimir o descargar (?ids=a,b,c&doc=todo|acta|ficha|caligrafia):
// el registro interno de faltas leves (acta), la ficha de reflexión y una hoja de
// caligrafía por cada falta, cada uno en una hoja A4. El sistema llena lo que
// conoce; lo que responde el alumno queda en blanco.
export default async function FichasReflexionPage(props: PageProps<"/faltas/fichas">) {
  const ctx = await requireAppContext();
  if (ctx.role !== "admin" && ctx.role !== "administrativo" && ctx.role !== "docente") notFound();
  const params = await props.searchParams;
  const raw = params.ids;
  const ids = (Array.isArray(raw) ? raw.join(",") : (raw ?? "")).split(",").filter((id) => /^[0-9a-f-]{36}$/i.test(id));
  if (ids.length === 0) notFound();
  const doc: Doc = DOCS.some((d) => d.key === params.doc) ? (params.doc as Doc) : "todo";

  const supabase = await createClient();
  const [{ data: sheets }, { data: records }, { data: norms }, { data: settings }] = await Promise.all([
    supabase
      .from("conduct_reflection_sheets")
      .select(
        "id, number, date, created_at, place, class_group_id, students(paternal_surname, maternal_surname, first_names, level, grade, section), class_groups(level, grade, section), teacher:staff_members!conduct_reflection_sheets_teacher_id_fkey(full_name), assistant:staff_members!conduct_reflection_sheets_assistant_id_fkey(full_name)"
      )
      .in("id", ids)
      .order("date")
      .order("number"),
    supabase.from("conduct_records").select("sheet_id, norm_id, note, created_at, conduct_norms(description)").in("sheet_id", ids).order("created_at"),
    supabase.from("conduct_norms").select("id, description, active, position, conduct_categories!inner(kind, position)").eq("school_id", ctx.schoolId!).eq("conduct_categories.kind", "falta"),
    supabase.from("conduct_settings").select("faltas_per_sheet").eq("school_id", ctx.schoolId!).maybeSingle(),
  ]);
  if (!sheets?.length) notFound();

  const convivencia = (norms ?? []).sort((a, b) => a.conduct_categories.position - b.conduct_categories.position || a.position - b.position);
  const first = sheets[0];
  const firstCode = sheetCode(first.number, first.date);
  const fileName =
    sheets.length > 1
      ? `faltas-${shortDate(first.date).replace(/[^\p{L}\p{N}]+/gu, "-")}`
      : `${{ todo: "faltas", acta: "acta-de-faltas", ficha: "ficha-de-reflexion", caligrafia: "caligrafia" }[doc]}-${firstCode}${first.students ? `-${first.students.paternal_surname}` : ""}`;

  return (
    <div className="flex flex-col gap-4 print:gap-0 print:bg-white print:text-black">
      <style>{PRINT_CSS}</style>
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-2">
          <Link href="/faltas" className={buttonVariants({ variant: "outline", size: "icon" })} aria-label="Volver a Registro de faltas">
            <ChevronLeftIcon />
          </Link>
          <h1 className="text-lg font-medium">{sheets.length > 1 ? `${sheets.length} actas y fichas` : `Acta y ficha N.° ${firstCode}`}</h1>
        </div>
        <div className="flex flex-wrap items-start gap-2">
          <nav className="flex rounded-lg border border-border p-0.5" aria-label="Documentos">
            {DOCS.map((d) => (
              <Link key={d.key} href={`/faltas/fichas?ids=${ids.join(",")}&doc=${d.key}`} aria-current={doc === d.key ? "page" : undefined} className={cn("rounded-md px-3 py-1 text-sm", doc === d.key ? "bg-surface-elevated font-medium" : "text-muted-foreground hover:text-foreground")}>
                {d.label}
              </Link>
            ))}
          </nav>
          <DownloadSheetsButton fileName={fileName} />
          <PrintButton />
        </div>
      </div>

      {sheets.map((sheet) => {
        const group = sheet.class_groups ?? sheet.students;
        const gradeSection = group?.level ? `${LEVEL_LABELS[group.level]} · ${group.grade ?? ""}° ${group.section ?? ""}`.trim() : "";
        const mine = (records ?? []).filter((r) => r.sheet_id === sheet.id);
        const broken = new Set(mine.map((r) => r.norm_id));
        const code = sheetCode(sheet.number, sheet.date);
        const teacher = sheet.teacher?.full_name ?? null;
        const assistant = sheet.assistant?.full_name ?? null;
        const st = sheet.students;
        const show = (d: Doc) => doc === "todo" || doc === d;
        return [
          show("acta") && (
            <IncidentReport
              key={`${sheet.id}-acta`}
              code={code}
              schoolName={ctx.schoolName ?? ""}
              recordedAt={dateTime(sheet.created_at)}
              place={sheet.place}
              studentFullName={st ? `${st.first_names} ${st.paternal_surname} ${st.maternal_surname ?? ""}`.trim() : ""}
              gradeSection={gradeSection}
              teacher={teacher}
              assistant={assistant}
              faltasPerSheet={settings?.faltas_per_sheet ?? DEFAULT_FALTAS_PER_SHEET}
              faltas={mine.map((r) => ({ norm: r.conduct_norms?.description ?? "", at: dateTime(r.created_at), note: r.note }))}
            />
          ),
          show("ficha") && (
            <ReflectionSheet
              key={`${sheet.id}-ficha`}
              schoolName={ctx.schoolName ?? ""}
              code={code}
              date={shortDate(sheet.date)}
              student={st ? studentName(st) : ""}
              gradeSection={gradeSection}
              norms={convivencia.filter((n) => n.active || broken.has(n.id)).map((n) => ({ description: n.description, broken: broken.has(n.id) }))}
              notes={mine.map((r) => r.note).filter((n): n is string => Boolean(n))}
              teacher={teacher}
              assistant={assistant}
            />
          ),
          ...(show("caligrafia")
            ? mine.map((r, i) => (
                <CalligraphySheet
                  key={`${sheet.id}-caligrafia-${i}`}
                  code={code}
                  student={st ? studentName(st) : ""}
                  date={shortDate(sheet.date)}
                  gradeSection={gradeSection}
                  norm={r.conduct_norms?.description ?? ""}
                  index={i + 1}
                  total={mine.length}
                />
              ))
            : []),
        ];
      })}
    </div>
  );
}
