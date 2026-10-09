import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAppContext } from "@/lib/auth/context";
import { classGroupLabel } from "@/lib/class-group";
import { DEFAULT_LAYOUT, SHEET_LAYOUTS, studentName } from "@/lib/exams/shared";
import { ManualEntry, type EntryStudent, type GradedFile } from "./manual-entry";

export default async function RegistrarRespuestasPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;
  const ctx = await requireAppContext();
  if (!["admin", "administrativo", "docente"].includes(ctx.role ?? "")) redirect("/examenes");
  const supabase = await createClient();

  const { data: exam } = await supabase.from("exams").select("*").eq("id", examId).maybeSingle();
  if (!exam) notFound();

  const [{ data: keys }, { data: groups }, { data: classGroups }, { data: results }, { data: files }] = await Promise.all([
    supabase.from("exam_answer_keys").select("theme, answers").eq("exam_id", examId).order("theme"),
    supabase.from("exam_class_groups").select("class_group_id").eq("exam_id", examId),
    supabase.from("class_groups").select("id, academic_year, level, grade, section"),
    supabase.from("exam_results").select("id, student_id, theme, answers").eq("exam_id", examId),
    supabase.from("exam_result_files").select("id, student_id, path, position").eq("exam_id", examId).order("position"),
  ]);
  const groupIds = (groups ?? []).map((g) => g.class_group_id);
  const labelOf = new Map((classGroups ?? []).map((g) => [g.id, classGroupLabel(g)]));

  const { data: roster } = groupIds.length
    ? await supabase.from("students").select("id, code, paternal_surname, maternal_surname, first_names, class_group_id").in("class_group_id", groupIds).eq("status", "activo")
    : { data: [] };

  const paths = (files ?? []).map((f) => f.path);
  const { data: signed } = paths.length ? await supabase.storage.from("exam-sheets").createSignedUrls(paths, 3600) : { data: [] };
  const urlOf = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));

  const resultOf = new Map((results ?? []).map((r) => [r.student_id, r]));
  const students: EntryStudent[] = (roster ?? [])
    .map((s) => {
      const r = resultOf.get(s.id);
      return {
        id: s.id,
        name: studentName(s),
        code: s.code,
        group: s.class_group_id ? (labelOf.get(s.class_group_id) ?? "") : "",
        saved: r ? { resultId: r.id, theme: r.theme, answers: r.answers } : null,
      };
    })
    .sort((a, b) => a.group.localeCompare(b.group, "es") || a.name.localeCompare(b.name, "es"));

  const filesOf: Record<string, GradedFile[]> = {};
  for (const f of files ?? []) (filesOf[f.student_id] ??= []).push({ id: f.id, url: urlOf.get(f.path) ?? null, pdf: f.path.toLowerCase().endsWith(".pdf") });

  // Tipos: los que tienen clave; si todavía no hay clave, los de la ficha.
  const keyMap = Object.fromEntries((keys ?? []).map((k) => [k.theme, k.answers]));
  const layout = (SHEET_LAYOUTS[exam.sheet_layout] ?? SHEET_LAYOUTS[DEFAULT_LAYOUT]).layout;
  const themes = Object.keys(keyMap).length ? Object.keys(keyMap) : layout.themes;

  return (
    <div className="flex flex-col gap-4">
      <Link href={`/examenes/${examId}`} className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeftIcon className="size-4" />
        {exam.title}
      </Link>
      <div>
        <h1 className="text-lg font-medium">Registrar respuestas</h1>
        <p className="text-sm text-muted-foreground">
          Escribe la letra que marcó cada alumno: el cursor avanza solo y al terminar la fila pasa al siguiente alumno. Espacio deja la pregunta en blanco. Cada fila se guarda sola al completarse.
        </p>
      </div>
      {groupIds.length === 0 ? (
        <p className="rounded-2xl border border-border p-8 text-center text-sm text-muted-foreground">Este examen no tiene secciones. Edita el examen y elige las secciones que lo rinden.</p>
      ) : (
        <ManualEntry
          exam={{ id: exam.id, school_id: exam.school_id, question_count: exam.question_count, max_score: exam.max_score }}
          keys={keyMap}
          themes={themes}
          options={layout.options}
          students={students}
          files={filesOf}
        />
      )}
    </div>
  );
}
