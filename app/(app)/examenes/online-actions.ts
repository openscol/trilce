"use server";

import { revalidatePath } from "next/cache";
import { requireAppContext } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/database.types";
import { MAX_OPTIONS, MIN_OPTIONS, type ExamState, type QuestionDraft } from "@/lib/exams/online";

const STAFF_ROLES = ["admin", "administrativo", "docente"];

type Result = { error: string } | undefined;

// Los mensajes de las funciones de la base de datos ya están escritos para el usuario.
const dbMessage = (error: { message: string } | null, fallback: string) => (error?.message && !/violates|permission|JSON|syntax/i.test(error.message) ? error.message : fallback);

// ---------------------------------------------------------------------------
// Personal

// Guarda todas las preguntas del examen (y con ellas la clave y el número de preguntas).
export async function saveOnlineQuestions(examId: string, questions: QuestionDraft[]): Promise<Result> {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !STAFF_ROLES.includes(ctx.role ?? "")) return { error: "No tienes permiso para editar exámenes." };

  for (const [i, q] of questions.entries()) {
    if (!q.title.trim()) return { error: `La pregunta ${i + 1} no tiene enunciado.` };
    if (q.options.length < MIN_OPTIONS || q.options.length > MAX_OPTIONS) return { error: `La pregunta ${i + 1} debe tener entre ${MIN_OPTIONS} y ${MAX_OPTIONS} alternativas.` };
    if (q.options.some((o) => !o.trim())) return { error: `La pregunta ${i + 1} tiene una alternativa vacía.` };
    if (q.correct === null) return { error: `Marca la alternativa correcta de la pregunta ${i + 1}.` };
    if (!(q.points > 0)) return { error: `El puntaje de la pregunta ${i + 1} debe ser mayor que 0.` };
    // La imagen solo puede estar en la carpeta de este examen.
    if (q.image_path && !q.image_path.startsWith(`${ctx.schoolId}/${examId}/questions/`)) return { error: `La imagen de la pregunta ${i + 1} no es válida.` };
  }

  const supabase = await createClient();
  const { data: before } = await supabase.from("exam_questions").select("image_path").eq("exam_id", examId);
  const { error } = await supabase.rpc("save_online_exam_questions", { p_exam_id: examId, p_questions: questions as unknown as Json });
  if (error) return { error: dbMessage(error, "No se pudieron guardar las preguntas.") };

  // Imágenes que ya no usa ninguna pregunta.
  const kept = new Set(questions.map((q) => q.image_path));
  const orphans = (before ?? []).map((q) => q.image_path).filter((p): p is string => !!p && !kept.has(p));
  if (orphans.length) await supabase.storage.from("exam-sheets").remove(orphans);

  revalidatePath(`/examenes/${examId}`);
  revalidatePath(`/examenes/${examId}/preguntas`);
  revalidatePath("/examenes");
  return undefined;
}

// «Abrir ahora» / «Cerrar ahora». Escriben las mismas columnas que el horario programado.
export async function setExamOpen(examId: string, open: boolean): Promise<Result> {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !STAFF_ROLES.includes(ctx.role ?? "")) return { error: "No tienes permiso." };

  const supabase = await createClient();
  const now = new Date().toISOString();
  if (open) {
    const { data: exam } = await supabase.from("exams").select("question_count, time_limit_seconds, closes_at, exam_questions(id)").eq("id", examId).maybeSingle();
    if (!exam) return { error: "El examen no existe o no tienes acceso." };
    if (!exam.time_limit_seconds) return { error: "Define primero el tiempo del examen (botón Editar)." };
    if (exam.exam_questions.length === 0 || exam.exam_questions.length !== exam.question_count) return { error: "Escribe y guarda las preguntas antes de abrir el examen." };
    // Se conserva un cierre programado que todavía no llegó; uno ya pasado se quita.
    const closes_at = exam.closes_at && exam.closes_at > now ? exam.closes_at : null;
    const { error } = await supabase.from("exams").update({ opens_at: now, closes_at }).eq("id", examId).eq("school_id", ctx.schoolId);
    if (error) return { error: "No se pudo abrir el examen." };
  } else {
    const { error } = await supabase.from("exams").update({ closes_at: now }).eq("id", examId).eq("school_id", ctx.schoolId);
    if (error) return { error: "No se pudo cerrar el examen." };
    // Los intentos en curso terminan con el examen.
    await supabase.rpc("close_due_exam_attempts", { p_exam_id: examId });
  }

  revalidatePath(`/examenes/${examId}`);
  revalidatePath("/examenes");
  return undefined;
}

// Reabrir el examen para un alumno: se borra su intento y su resultado, y puede rendirlo de nuevo desde cero.
export async function reopenAttempt(examId: string, studentId: string): Promise<Result> {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !STAFF_ROLES.includes(ctx.role ?? "")) return { error: "No tienes permiso." };

  const supabase = await createClient();
  const { error: resultError } = await supabase.from("exam_results").delete().eq("exam_id", examId).eq("student_id", studentId);
  if (resultError) return { error: "No se pudo reabrir el examen." };
  const { error } = await supabase.from("exam_attempts").delete().eq("exam_id", examId).eq("student_id", studentId);
  if (error) return { error: "No se pudo reabrir el examen." };

  revalidatePath(`/examenes/${examId}`);
  return undefined;
}

// ---------------------------------------------------------------------------
// Alumno. Todo pasa por funciones de la base de datos: ellas verifican que el
// examen sea de su sección, llevan el reloj y nunca devuelven la clave.

type Supabase = Awaited<ReturnType<typeof createClient>>;

// Las imágenes viven en un bucket privado: se entregan con enlaces temporales.
async function withImages(supabase: Supabase, state: ExamState): Promise<ExamState> {
  if (state.status !== "in_progress") return state;
  const paths = state.questions.map((q) => q.image_path).filter((p): p is string => !!p);
  if (!paths.length) return state;
  const { data } = await supabase.storage.from("exam-sheets").createSignedUrls(paths, 6 * 3600);
  const urlOf = new Map((data ?? []).map((s) => [s.path, s.signedUrl]));
  return { ...state, questions: state.questions.map((q) => ({ ...q, image_url: q.image_path ? (urlOf.get(q.image_path) ?? null) : null })) };
}

type StateResult = { state: ExamState } | { error: string };

async function run(call: (supabase: Supabase) => PromiseLike<{ data: Json | null; error: { message: string } | null }>, fallback: string): Promise<StateResult> {
  const ctx = await requireAppContext();
  if (ctx.role !== "alumno") return { error: "Solo los alumnos pueden rendir el examen." };
  const supabase = await createClient();
  const { data, error } = await call(supabase);
  if (error || !data) return { error: dbMessage(error, fallback) };
  return { state: await withImages(supabase, data as unknown as ExamState) };
}

export async function loadExamState(examId: string): Promise<StateResult> {
  return run((s) => s.rpc("online_exam_state", { p_exam_id: examId }), "No se pudo cargar el examen.");
}

export async function startExam(examId: string): Promise<StateResult> {
  const result = await run((s) => s.rpc("start_online_exam", { p_exam_id: examId }), "No se pudo empezar el examen.");
  revalidatePath("/examenes");
  return result;
}

export async function answerQuestion(examId: string, number: number, option: string | null, advance = false): Promise<StateResult> {
  return run((s) => s.rpc("answer_online_exam", { p_exam_id: examId, p_number: number, p_option: option, p_advance: advance }), "No se pudo guardar la respuesta.");
}

export async function finishExam(examId: string): Promise<StateResult> {
  const result = await run((s) => s.rpc("finish_online_exam", { p_exam_id: examId }), "No se pudo entregar el examen.");
  revalidatePath("/examenes");
  return result;
}
