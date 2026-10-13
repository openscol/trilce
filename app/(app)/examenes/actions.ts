"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAppContext } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import { DEFAULT_LAYOUT, MAX_MANUAL_QUESTIONS, MAX_QUESTIONS, SHEET_LAYOUTS, layoutForQuestions } from "@/lib/exams/shared";
import { MAX_ONLINE_QUESTIONS, limaInputToIso, type ExamTimeMode } from "@/lib/exams/online";

export type Exam = Database["public"]["Tables"]["exams"]["Row"];
export type ExamResult = Database["public"]["Tables"]["exam_results"]["Row"];

export type ExamEntryMode = Database["public"]["Enums"]["exam_entry_mode"];

export type FormState = { error: string } | undefined;

const STAFF_ROLES = ["admin", "administrativo", "docente"];

function str(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

type ExamInput = {
  title: string;
  subject: string | null;
  exam_date: string;
  question_count: number;
  max_score: number;
  sheet_layout: string;
  entry_mode: ExamEntryMode;
  classGroupIds: string[];
  keys: { theme: string; answers: string }[];
  // Solo exámenes en línea.
  online: { time_mode: ExamTimeMode; time_limit_seconds: number; opens_at: string | null; closes_at: string | null; shuffle_questions: boolean; shuffle_options: boolean } | null;
};

function readExamForm(formData: FormData): ExamInput | { error: string } {
  const title = str(formData, "title");
  if (!title) return { error: "El título es obligatorio." };

  const rawMode = formData.get("entry_mode");
  const entry_mode: ExamEntryMode = rawMode === "manual" || rawMode === "online" ? rawMode : "sheet";
  const question_count = Number(formData.get("question_count"));
  const validCount = Number.isInteger(question_count) && question_count >= 1;
  let sheet_layout: string | null;
  if (entry_mode === "online") {
    if (!validCount || question_count > MAX_ONLINE_QUESTIONS) return { error: `El número de preguntas debe estar entre 1 y ${MAX_ONLINE_QUESTIONS}.` };
    sheet_layout = DEFAULT_LAYOUT;
  } else if (entry_mode === "manual") {
    // Sin ficha no hay límite de la plantilla impresa.
    if (!validCount || question_count > MAX_MANUAL_QUESTIONS) return { error: `El número de preguntas debe estar entre 1 y ${MAX_MANUAL_QUESTIONS}.` };
    sheet_layout = layoutForQuestions(question_count) ?? DEFAULT_LAYOUT;
  } else {
    // La ficha la decide el número de preguntas: hasta 10, la de 10; de 11 a 20, la de 20.
    sheet_layout = validCount ? layoutForQuestions(question_count) : null;
    if (!sheet_layout) {
      return { error: `El número de preguntas debe estar entre 1 y ${MAX_QUESTIONS} (lo que admiten las fichas). Para más preguntas, usa el registro manual.` };
    }
  }
  const sheet = SHEET_LAYOUTS[sheet_layout];
  const max_score = Number(formData.get("max_score"));
  if (!(max_score > 0) || max_score > 999) return { error: "La nota máxima debe ser mayor que 0." };

  const exam_date = str(formData, "exam_date");
  if (!exam_date || !/^\d{4}-\d{2}-\d{2}$/.test(exam_date)) return { error: "La fecha es obligatoria." };

  let online: ExamInput["online"] = null;
  if (entry_mode === "online") {
    const time_mode: ExamTimeMode = formData.get("time_mode") === "per_question" ? "per_question" : "total";
    const time_limit_seconds = Math.round(Number(formData.get("time_minutes")) * 60 + Number(formData.get("time_seconds") ?? 0));
    if (!(time_limit_seconds >= 10) || time_limit_seconds > 86400) {
      return { error: time_mode === "total" ? "Indica cuánto tiempo dura el examen (mínimo 10 segundos)." : "Indica cuánto tiempo hay para cada pregunta (mínimo 10 segundos)." };
    }
    const opens_at = limaInputToIso(str(formData, "opens_at"));
    const closes_at = limaInputToIso(str(formData, "closes_at"));
    if (opens_at && closes_at && closes_at <= opens_at) return { error: "El cierre debe ser posterior a la apertura." };
    if (closes_at && !opens_at) return { error: "Para poner una hora de cierre, indica también la de apertura." };
    online = { time_mode, time_limit_seconds, opens_at, closes_at, shuffle_questions: formData.get("shuffle_questions") === "on", shuffle_options: formData.get("shuffle_options") === "on" };
  }

  const options = sheet.layout.options.join("");
  const keys: ExamInput["keys"] = [];
  // La clave de un examen en línea sale de sus preguntas, no de este formulario.
  for (const theme of entry_mode === "online" ? [] : sheet.layout.themes) {
    const answers = (str(formData, `key_${theme}`) ?? "").toUpperCase().replace(/[\s,.;-]/g, "");
    if (!answers) continue;
    if (answers.length !== question_count) {
      return { error: `La clave del tipo ${theme} debe tener ${question_count} letras y tiene ${answers.length}.` };
    }
    if (![...answers].every((c) => options.includes(c))) {
      return { error: `La clave del tipo ${theme} solo puede tener las letras ${sheet.layout.options.join(", ")}.` };
    }
    keys.push({ theme, answers });
  }

  return {
    title,
    subject: str(formData, "subject"),
    exam_date,
    question_count,
    max_score,
    sheet_layout,
    entry_mode,
    classGroupIds: formData.getAll("class_group_ids").map(String).filter(Boolean),
    keys,
    online,
  };
}

// Deja las secciones y las claves del examen exactamente como vienen del formulario.
async function syncExamParts(supabase: Awaited<ReturnType<typeof createClient>>, examId: string, schoolId: string, input: ExamInput) {
  const { data: current } = await supabase.from("exam_class_groups").select("class_group_id").eq("exam_id", examId);
  const have = new Set((current ?? []).map((r) => r.class_group_id));
  const want = new Set(input.classGroupIds);
  const toAdd = [...want].filter((id) => !have.has(id));
  const toRemove = [...have].filter((id) => !want.has(id));
  if (toAdd.length) {
    const { error } = await supabase.from("exam_class_groups").insert(toAdd.map((class_group_id) => ({ exam_id: examId, class_group_id, school_id: schoolId })));
    if (error) return "No se pudieron guardar las secciones del examen.";
  }
  if (toRemove.length) {
    const { error } = await supabase.from("exam_class_groups").delete().eq("exam_id", examId).in("class_group_id", toRemove);
    if (error) return "No se pudieron quitar las secciones del examen.";
  }

  // En línea, la clave la mantiene save_online_exam_questions junto con las preguntas.
  if (input.entry_mode === "online") return null;

  if (input.keys.length) {
    const { error } = await supabase.from("exam_answer_keys").upsert(input.keys.map((k) => ({ exam_id: examId, school_id: schoolId, theme: k.theme, answers: k.answers })));
    if (error) return "No se pudo guardar la clave de respuestas.";
  }
  const themes = input.keys.map((k) => k.theme);
  const removeKeys = supabase.from("exam_answer_keys").delete().eq("exam_id", examId);
  const { error: keyError } = themes.length ? await removeKeys.not("theme", "in", `(${themes.join(",")})`) : await removeKeys;
  if (keyError) return "No se pudo actualizar la clave de respuestas.";
  return null;
}

export async function createExam(_prevState: FormState, formData: FormData): Promise<FormState> {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !ctx.targetId || !STAFF_ROLES.includes(ctx.role ?? "")) {
    return { error: "No tienes permiso para crear exámenes." };
  }
  const input = readExamForm(formData);
  if ("error" in input) return input;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exams")
    .insert({
      school_id: ctx.schoolId,
      title: input.title,
      subject: input.subject,
      exam_date: input.exam_date,
      question_count: input.question_count,
      max_score: input.max_score,
      sheet_layout: input.sheet_layout,
      entry_mode: input.entry_mode,
      created_by: ctx.targetId,
      ...(input.online ?? {}),
    })
    .select("id")
    .single();
  if (error || !data) return { error: "No se pudo crear el examen." };

  const partsError = await syncExamParts(supabase, data.id, ctx.schoolId, input);
  if (partsError) return { error: partsError };

  revalidatePath("/examenes");
  // En línea, lo siguiente es escribir las preguntas.
  redirect(input.entry_mode === "online" ? `/examenes/${data.id}/preguntas` : `/examenes/${data.id}`);
}

export async function updateExam(examId: string, _prevState: FormState, formData: FormData): Promise<FormState> {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !STAFF_ROLES.includes(ctx.role ?? "")) {
    return { error: "No tienes permiso para editar exámenes." };
  }
  const input = readExamForm(formData);
  if ("error" in input) return input;

  const supabase = await createClient();
  const { data: exam } = await supabase.from("exams").select("question_count, entry_mode").eq("id", examId).maybeSingle();
  if (!exam) return { error: "El examen no existe o no tienes acceso." };
  if ((exam.entry_mode === "online") !== (input.entry_mode === "online")) {
    return { error: "Un examen en línea no se puede convertir en uno de papel (ni al revés). Crea un examen nuevo." };
  }
  // En línea, el número de preguntas lo define el editor de preguntas.
  if (input.entry_mode === "online") input.question_count = exam.question_count;
  if (exam.question_count !== input.question_count) {
    const { count } = await supabase.from("exam_results").select("id", { count: "exact", head: true }).eq("exam_id", examId);
    if (count) return { error: "No se puede cambiar el número de preguntas: ya hay fichas guardadas." };
  }

  // Primero las claves (con el número de preguntas anterior fallarían si este cambia): se actualiza el examen y luego sus partes.
  const { error } = await supabase
    .from("exams")
    .update({
      title: input.title,
      subject: input.subject,
      exam_date: input.exam_date,
      question_count: input.question_count,
      max_score: input.max_score,
      sheet_layout: input.sheet_layout,
      entry_mode: input.entry_mode,
      ...(input.online ?? {}),
    })
    .eq("id", examId)
    .eq("school_id", ctx.schoolId);
  if (error) return { error: "No se pudo guardar el examen." };

  const partsError = await syncExamParts(supabase, examId, ctx.schoolId, input);
  if (partsError) return { error: partsError };

  revalidatePath("/examenes");
  revalidatePath(`/examenes/${examId}`);
  return undefined;
}

export async function deleteExam(examId: string): Promise<{ error: string } | undefined> {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !STAFF_ROLES.includes(ctx.role ?? "")) return { error: "No tienes permiso para eliminar exámenes." };

  const supabase = await createClient();
  // Las fotos no se borran en cascada con la fila: se quitan primero del almacenamiento.
  const { data: results } = await supabase.from("exam_results").select("image_path").eq("exam_id", examId);
  const [{ data: files }, { data: graded }, { data: questions }] = await Promise.all([
    supabase.from("exam_files").select("path").eq("exam_id", examId),
    supabase.from("exam_result_files").select("path").eq("exam_id", examId),
    supabase.from("exam_questions").select("image_path").eq("exam_id", examId),
  ]);
  const paths = [
    ...(questions ?? []).map((q) => q.image_path).filter((p): p is string => !!p),...(results ?? []).map((r) => r.image_path).filter((p): p is string => !!p), ...(files ?? []).map((f) => f.path), ...(graded ?? []).map((f) => f.path)];
  if (paths.length) await supabase.storage.from("exam-sheets").remove(paths);

  const { error } = await supabase.from("exams").delete().eq("id", examId).eq("school_id", ctx.schoolId);
  if (error) return { error: "No se pudo eliminar el examen." };

  revalidatePath("/examenes");
  redirect("/examenes");
}

export async function setExamPublished(examId: string, published: boolean): Promise<{ error: string } | undefined> {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !STAFF_ROLES.includes(ctx.role ?? "")) return { error: "No tienes permiso." };

  const supabase = await createClient();
  const { error } = await supabase.from("exams").update({ published }).eq("id", examId).eq("school_id", ctx.schoolId);
  if (error) return { error: "No se pudo cambiar la publicación." };

  revalidatePath(`/examenes/${examId}`);
  revalidatePath("/examenes");
  return undefined;
}

export type ResultInput = {
  student_id: string;
  theme: string;
  answers: string;
  sheet_code: string | null;
  image_path: string | null;
  // El docente confirmó que esta ficha reemplaza a la que el alumno ya tenía guardada.
  replace?: boolean;
};

// Guarda las fichas leídas. Una ficha por alumno y examen: si ya había una, se reemplaza.
// La nota no viaja desde el navegador: la calcula la base de datos con la clave.
export async function saveExamResults(examId: string, results: ResultInput[]): Promise<{ error: string } | { saved: number }> {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !STAFF_ROLES.includes(ctx.role ?? "")) return { error: "No tienes permiso para registrar fichas." };
  if (!results.length) return { error: "No hay fichas para guardar." };

  const supabase = await createClient();
  const { data: exam } = await supabase.from("exams").select("question_count, school_id").eq("id", examId).maybeSingle();
  if (!exam || exam.school_id !== ctx.schoolId) return { error: "El examen no existe o no tienes acceso." };

  const seen = new Set<string>();
  for (const r of results) {
    if (seen.has(r.student_id)) return { error: "Hay dos fichas asignadas al mismo alumno." };
    seen.add(r.student_id);
    if (r.answers.length !== exam.question_count || !/^[A-E*-]+$/.test(r.answers)) return { error: "Hay una ficha con respuestas incompletas." };
    if (!/^[A-Z]$/.test(r.theme)) return { error: "Hay una ficha sin tipo de examen." };
  }

  // Un código mal marcado puede ser el de otro alumno: solo se aceptan alumnos
  // de las secciones del examen, y nunca se pisa una ficha ya guardada sin confirmación.
  const studentIds = results.map((r) => r.student_id);
  const [{ data: groups }, { data: students }, { data: existing }] = await Promise.all([
    supabase.from("exam_class_groups").select("class_group_id").eq("exam_id", examId),
    supabase.from("students").select("id, class_group_id, paternal_surname, first_names").in("id", studentIds),
    supabase.from("exam_results").select("student_id").eq("exam_id", examId).in("student_id", studentIds),
  ]);
  const nameOf = new Map((students ?? []).map((s) => [s.id, `${s.paternal_surname}, ${s.first_names}`]));
  if (nameOf.size !== studentIds.length) return { error: "Hay una ficha asignada a un alumno que no existe o al que no tienes acceso." };
  const groupIds = new Set((groups ?? []).map((g) => g.class_group_id));
  if (groupIds.size) {
    const outsider = (students ?? []).find((s) => !s.class_group_id || !groupIds.has(s.class_group_id));
    if (outsider) return { error: `${nameOf.get(outsider.id)} no pertenece a las secciones que rinden este examen. Revisa el código de su ficha.` };
  }
  const saved = new Set((existing ?? []).map((r) => r.student_id));
  const overwritten = results.find((r) => saved.has(r.student_id) && !r.replace);
  if (overwritten) return { error: `${nameOf.get(overwritten.student_id)} ya tiene una ficha guardada. Confirma el reemplazo en esa ficha o elige a otro alumno.` };

  const { error } = await supabase.from("exam_results").upsert(
    results.map((r) => ({
      school_id: exam.school_id,
      exam_id: examId,
      student_id: r.student_id,
      theme: r.theme,
      answers: r.answers,
      sheet_code: r.sheet_code,
      image_path: r.image_path,
      scanned_by: ctx.targetId,
    })),
    { onConflict: "exam_id,student_id" }
  );
  if (error) return { error: "No se pudieron guardar las fichas. " + (error.message ?? "") };

  revalidatePath(`/examenes/${examId}`);
  return { saved: results.length };
}

export async function deleteExamResult(examId: string, resultId: string): Promise<{ error: string } | undefined> {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !STAFF_ROLES.includes(ctx.role ?? "")) return { error: "No tienes permiso." };

  const supabase = await createClient();
  const { data: result } = await supabase.from("exam_results").select("image_path").eq("id", resultId).eq("exam_id", examId).maybeSingle();
  if (result?.image_path) await supabase.storage.from("exam-sheets").remove([result.image_path]);
  const { error } = await supabase.from("exam_results").delete().eq("id", resultId).eq("exam_id", examId);
  if (error) return { error: "No se pudo eliminar la ficha." };

  revalidatePath(`/examenes/${examId}`);
  return undefined;
}

export type ExamFileKind = Database["public"]["Enums"]["exam_file_kind"];

// Registra una imagen ya subida al bucket (cuadernillo o ficha de respuestas de un tipo).
// La ficha de respuestas es una sola por examen y tipo: la nueva reemplaza a la anterior.
export async function addExamFile(examId: string, theme: string, kind: ExamFileKind, path: string): Promise<{ error: string } | undefined> {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !STAFF_ROLES.includes(ctx.role ?? "")) return { error: "No tienes permiso." };
  if (!/^[A-Z]$/.test(theme)) return { error: "El tipo de examen no es válido." };
  if (!path.startsWith(`${ctx.schoolId}/${examId}/material/`)) return { error: "La ruta del archivo no es válida." };

  const supabase = await createClient();
  const { data: current } = await supabase.from("exam_files").select("id, path, position").eq("exam_id", examId).eq("theme", theme).eq("kind", kind);
  if (kind === "answer_sheet" && current?.length) {
    await supabase.storage.from("exam-sheets").remove(current.map((f) => f.path));
    const { error } = await supabase.from("exam_files").delete().in("id", current.map((f) => f.id));
    if (error) return { error: "No se pudo reemplazar la ficha de respuestas." };
  }
  const position = kind === "exam" ? Math.max(-1, ...(current ?? []).map((f) => f.position)) + 1 : 0;
  const { error } = await supabase.from("exam_files").insert({ school_id: ctx.schoolId, exam_id: examId, theme, kind, path, position });
  if (error) {
    await supabase.storage.from("exam-sheets").remove([path]);
    return { error: "No se pudo guardar la imagen." };
  }

  revalidatePath(`/examenes/${examId}`);
  return undefined;
}

export async function deleteExamFile(examId: string, fileId: string): Promise<{ error: string } | undefined> {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !STAFF_ROLES.includes(ctx.role ?? "")) return { error: "No tienes permiso." };

  const supabase = await createClient();
  const { data: file } = await supabase.from("exam_files").select("path").eq("id", fileId).eq("exam_id", examId).maybeSingle();
  if (!file) return { error: "La imagen ya no existe." };
  const { error } = await supabase.from("exam_files").delete().eq("id", fileId).eq("exam_id", examId);
  if (error) return { error: "No se pudo eliminar la imagen." };
  await supabase.storage.from("exam-sheets").remove([file.path]);

  revalidatePath(`/examenes/${examId}`);
  return undefined;
}

// Registro manual: guarda lo que marcó un alumno en su examen. La fila de la
// pantalla es el alumno, así que no hay código que emparejar; editar una
// respuesta ya guardada es lo normal y no pide confirmación.
export async function saveManualResult(
  examId: string,
  studentId: string,
  theme: string,
  answers: string
): Promise<{ error: string } | { resultId: string; score: number | null; correct_count: number | null }> {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !STAFF_ROLES.includes(ctx.role ?? "")) return { error: "No tienes permiso para registrar respuestas." };

  const supabase = await createClient();
  const { data: exam } = await supabase.from("exams").select("question_count, school_id").eq("id", examId).maybeSingle();
  if (!exam || exam.school_id !== ctx.schoolId) return { error: "El examen no existe o no tienes acceso." };
  if (answers.length !== exam.question_count || !/^[A-E-]+$/.test(answers)) return { error: "Faltan respuestas." };
  if (!/^[A-Z]$/.test(theme)) return { error: "Falta el tipo de examen." };

  const [{ data: groups }, { data: student }] = await Promise.all([
    supabase.from("exam_class_groups").select("class_group_id").eq("exam_id", examId),
    supabase.from("students").select("class_group_id").eq("id", studentId).maybeSingle(),
  ]);
  if (!student) return { error: "El alumno no existe o no tienes acceso." };
  if (!(groups ?? []).some((g) => g.class_group_id === student.class_group_id)) return { error: "El alumno no pertenece a las secciones de este examen." };

  const { data, error } = await supabase
    .from("exam_results")
    .upsert(
      { school_id: exam.school_id, exam_id: examId, student_id: studentId, theme, answers, sheet_code: null, scanned_by: ctx.targetId },
      { onConflict: "exam_id,student_id" }
    )
    .select("id, score, correct_count")
    .single();
  if (error || !data) return { error: "No se pudo guardar. " + (error?.message ?? "") };

  revalidatePath(`/examenes/${examId}`);
  return { resultId: data.id, score: data.score, correct_count: data.correct_count };
}

// Registra el examen calificado de un alumno, ya subido al bucket (una página o un PDF).
export async function addGradedFile(examId: string, studentId: string, path: string): Promise<{ error: string } | { id: string }> {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !STAFF_ROLES.includes(ctx.role ?? "")) return { error: "No tienes permiso." };
  if (!path.startsWith(`${ctx.schoolId}/${examId}/graded/${studentId}-`)) return { error: "La ruta del archivo no es válida." };

  const supabase = await createClient();
  const { data: current } = await supabase.from("exam_result_files").select("position").eq("exam_id", examId).eq("student_id", studentId);
  const position = Math.max(-1, ...(current ?? []).map((f) => f.position)) + 1;
  const { data, error } = await supabase
    .from("exam_result_files")
    .insert({ school_id: ctx.schoolId, exam_id: examId, student_id: studentId, path, position })
    .select("id")
    .single();
  if (error || !data) {
    await supabase.storage.from("exam-sheets").remove([path]);
    return { error: "No se pudo guardar el archivo." };
  }

  revalidatePath(`/examenes/${examId}`);
  return { id: data.id };
}

export async function deleteGradedFile(examId: string, fileId: string): Promise<{ error: string } | undefined> {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !STAFF_ROLES.includes(ctx.role ?? "")) return { error: "No tienes permiso." };

  const supabase = await createClient();
  const { data: file } = await supabase.from("exam_result_files").select("path").eq("id", fileId).eq("exam_id", examId).maybeSingle();
  if (!file) return { error: "El archivo ya no existe." };
  const { error } = await supabase.from("exam_result_files").delete().eq("id", fileId).eq("exam_id", examId);
  if (error) return { error: "No se pudo eliminar el archivo." };
  await supabase.storage.from("exam-sheets").remove([file.path]);

  revalidatePath(`/examenes/${examId}`);
  return undefined;
}
