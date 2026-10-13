import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAppContext } from "@/lib/auth/context";
import { blankQuestion, type QuestionDraft } from "@/lib/exams/online";
import { QuestionEditor } from "./question-editor";

const STAFF_ROLES = ["admin", "administrativo", "docente"];

export default async function PreguntasPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;
  const ctx = await requireAppContext();
  if (!STAFF_ROLES.includes(ctx.role ?? "")) redirect("/examenes");
  const supabase = await createClient();

  const { data: exam } = await supabase.from("exams").select("*").eq("id", examId).maybeSingle();
  if (!exam || exam.entry_mode !== "online") notFound();

  const [{ data: questions }, { data: key }, { count: attempts }] = await Promise.all([
    supabase.from("exam_questions").select("number, title, image_path, options, points").eq("exam_id", examId).order("number"),
    supabase.from("exam_answer_keys").select("answers").eq("exam_id", examId).eq("theme", "A").maybeSingle(),
    supabase.from("exam_attempts").select("id", { count: "exact", head: true }).eq("exam_id", examId),
  ]);

  const paths = (questions ?? []).map((q) => q.image_path).filter((p): p is string => !!p);
  const { data: signed } = paths.length ? await supabase.storage.from("exam-sheets").createSignedUrls(paths, 3600) : { data: [] };
  const imageUrls: Record<string, string> = {};
  for (const s of signed ?? []) if (s.path && s.signedUrl) imageUrls[s.path] = s.signedUrl;

  // Sin preguntas todavía: tantas en blanco como indica el examen.
  const initial: QuestionDraft[] = questions?.length
    ? questions.map((q, i) => ({ title: q.title, image_path: q.image_path, options: q.options, correct: key?.answers[i] ? key.answers.charCodeAt(i) - 65 : null, points: q.points }))
    : Array.from({ length: exam.question_count }, blankQuestion);

  return (
    <div className="flex flex-col gap-4">
      <Link href={`/examenes/${examId}`} className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeftIcon className="size-4" />
        {exam.title}
      </Link>
      <div>
        <h1 className="text-lg font-medium">Preguntas del examen</h1>
        <p className="text-sm text-muted-foreground">
          Escribe cada pregunta, sus alternativas y marca la correcta. La nota es sobre {exam.max_score}: cada pregunta pesa según su puntaje.
        </p>
      </div>
      <QuestionEditor examId={examId} schoolId={exam.school_id} maxScore={exam.max_score} initial={initial} imageUrls={imageUrls} locked={(attempts ?? 0) > 0} />
    </div>
  );
}
