import Link from "next/link";
import { redirect } from "next/navigation";
import { SettingsIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAppContext } from "@/lib/auth/context";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LEVEL_LABELS } from "@/lib/enum-labels";
import { longDate, todayInLima } from "@/lib/attendance";
import { studentName } from "@/lib/exams/shared";
import { loadMySections } from "@/lib/my-sections";
import { loadStudentHistory } from "@/lib/conduct-server";
import { ConductHistory } from "./conduct-history";

export default async function FaltasPage() {
  const ctx = await requireAppContext();
  const supabase = await createClient();
  const today = todayInLima();

  // Padre y alumno: el historial de sus hijos / el propio (RLS filtra a quién ve).
  if (ctx.role === "padre" || ctx.role === "alumno") {
    const { data: students } = await supabase.from("students").select("id, paternal_surname, maternal_surname, first_names").eq("school_id", ctx.schoolId!).order("paternal_surname");
    const list = students ?? [];
    const { entries, sheets } = await loadStudentHistory(supabase, list.map((s) => s.id));
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-lg font-medium">Faltas y permisos</h1>
          <p className="text-sm text-muted-foreground">Lo que el colegio registra en clase: faltas a las normas, permisos y fichas de reflexión.</p>
        </div>
        {list.length === 0 && <p className="text-sm text-muted-foreground">No hay alumnos vinculados a tu cuenta.</p>}
        {list.map((s) => (
          <section key={s.id} className="flex flex-col gap-3">
            {list.length > 1 && <h2 className="font-medium">{studentName(s)}</h2>}
            <ConductHistory entries={entries.filter((e) => e.student_id === s.id)} sheets={sheets.filter((x) => x.student_id === s.id)} canPrint={false} />
          </section>
        ))}
      </div>
    );
  }

  const isAdmin = ctx.role === "admin" || ctx.role === "administrativo";
  if (!isAdmin && ctx.role !== "docente") redirect("/dashboard");

  const groups = await loadMySections(supabase, ctx, Number(today.slice(0, 4)));
  if (!isAdmin && groups.length === 1) redirect(`/faltas/${groups[0].id}`);

  const groupIds = groups.map((g) => g.id);
  const { data: records } = groupIds.length
    ? await supabase.from("conduct_records").select("class_group_id, conduct_norms(conduct_categories(kind))").eq("date", today).in("class_group_id", groupIds)
    : { data: [] };
  const counts = new Map<string, { falta: number; registro: number; permiso: number }>();
  for (const r of records ?? []) {
    const kind = r.conduct_norms?.conduct_categories?.kind;
    if (!r.class_group_id || !kind) continue;
    const c = counts.get(r.class_group_id) ?? { falta: 0, registro: 0, permiso: 0 };
    c[kind]++;
    counts.set(r.class_group_id, c);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-medium">Registro de faltas</h1>
          <p className="text-sm text-muted-foreground first-letter:uppercase">{longDate(today)} · hoy</p>
        </div>
        {isAdmin && (
          <Link href="/faltas/normas" className={buttonVariants({ variant: "outline" })}>
            <SettingsIcon />
            Normas y configuración
          </Link>
        )}
      </div>

      <div className="rounded-2xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sección</TableHead>
              <TableHead>Hoy</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                  {isAdmin ? "No hay secciones creadas para este año. Créalas en Configuración → Secciones." : "No tienes secciones asignadas este año."}
                </TableCell>
              </TableRow>
            )}
            {groups.map((g) => {
              const c = counts.get(g.id);
              return (
                <TableRow key={g.id}>
                  <TableCell>
                    <Link href={`/faltas/${g.id}`} className="font-medium hover:underline">
                      {LEVEL_LABELS[g.level]} {g.grade}
                      {g.section}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c ? `${c.falta} faltas · ${c.registro} registros · ${c.permiso} permisos` : "Sin registros"}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/faltas/${g.id}`} className="text-sm text-brand-green-text hover:underline">
                      Registrar
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
