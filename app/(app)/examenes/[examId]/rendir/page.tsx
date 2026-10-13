import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { requireAppContext } from "@/lib/auth/context";
import { loadExamState } from "../../online-actions";
import { TakeExam } from "./take-exam";

export default async function RendirPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;
  const ctx = await requireAppContext();
  if (ctx.role !== "alumno") redirect(`/examenes/${examId}`);

  const result = await loadExamState(examId);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <Link href="/examenes" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeftIcon className="size-4" />
        Exámenes
      </Link>
      {"error" in result ? <p className="rounded-2xl border border-border p-8 text-center text-sm text-muted-foreground">{result.error}</p> : <TakeExam initial={result.state} />}
    </div>
  );
}
