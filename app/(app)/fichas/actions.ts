"use server";

import { revalidatePath } from "next/cache";
import { requireAppContext } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { getSkill } from "@/lib/games/catalog";
import { MAX_EXERCISES, MIN_EXERCISES, parseItems, pickSeeds, type WorksheetItem, type WorksheetItemInput } from "@/lib/games/worksheets";

const STAFF_ROLES = ["admin", "administrativo", "docente"];

export type WorksheetInput = {
  title: string;
  category: "matematicas" | "comunicacion";
  mode: "grado" | "tema";
  items: WorksheetItemInput[];
  includeExplanation: boolean;
  includeAnswers: boolean;
};

type Result = { ok: true; id: string } | { ok: false; error: string };

function validate(input: WorksheetInput): string | null {
  if (!input.title.trim()) return "Ponle un nombre a la ficha.";
  if (input.title.trim().length > 200) return "El nombre es demasiado largo.";
  if (!["matematicas", "comunicacion"].includes(input.category)) return "Elige un área.";
  if (input.items.length === 0) return "Elige al menos un tema.";
  for (const it of input.items) {
    const skill = getSkill(it.skill);
    if (!skill || skill.category !== input.category) return "Hay un tema que no pertenece al área elegida.";
    if (!Number.isInteger(it.count) || it.count < MIN_EXERCISES || it.count > MAX_EXERCISES)
      return `La cantidad de ejercicios debe estar entre ${MIN_EXERCISES} y ${MAX_EXERCISES}.`;
  }
  return null;
}

// Arma los ítems con sus semillas. Al editar se conservan los ejercicios de los
// temas que siguen en la ficha (y se agregan o quitan los que cambian de cantidad).
function buildItems(items: WorksheetItemInput[], previous: WorksheetItem[] = []): WorksheetItem[] {
  return items.map(({ skill, count }) => {
    const old = previous.find((p) => p.skill === skill);
    return { skill, count, seeds: pickSeeds(skill, count, old?.seeds ?? []) };
  });
}

export async function createWorksheet(input: WorksheetInput): Promise<Result> {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !ctx.targetId || !STAFF_ROLES.includes(ctx.role ?? "")) return { ok: false, error: "No tienes permiso para crear fichas." };
  const error = validate(input);
  if (error) return { ok: false, error };

  const supabase = await createClient();
  const { data, error: dbError } = await supabase
    .from("worksheets")
    .insert({
      school_id: ctx.schoolId,
      title: input.title.trim(),
      category: input.category,
      mode: input.mode,
      items: buildItems(input.items),
      include_explanation: input.includeExplanation,
      include_answers: input.includeAnswers,
      created_by: ctx.targetId,
    })
    .select("id")
    .single();
  if (dbError || !data) return { ok: false, error: "No se pudo crear la ficha." };

  revalidatePath("/fichas");
  return { ok: true, id: data.id };
}

export async function updateWorksheet(id: string, input: WorksheetInput): Promise<Result> {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !STAFF_ROLES.includes(ctx.role ?? "")) return { ok: false, error: "No tienes permiso para editar fichas." };
  const error = validate(input);
  if (error) return { ok: false, error };

  const supabase = await createClient();
  const { data: current } = await supabase.from("worksheets").select("items").eq("id", id).eq("school_id", ctx.schoolId).maybeSingle();
  if (!current) return { ok: false, error: "No se encontró la ficha." };

  const { error: dbError } = await supabase
    .from("worksheets")
    .update({
      title: input.title.trim(),
      category: input.category,
      mode: input.mode,
      items: buildItems(input.items, parseItems(current.items)),
      include_explanation: input.includeExplanation,
      include_answers: input.includeAnswers,
    })
    .eq("id", id)
    .eq("school_id", ctx.schoolId);
  if (dbError) return { ok: false, error: "No se pudo guardar la ficha." };

  revalidatePath("/fichas");
  revalidatePath(`/fichas/${id}`);
  return { ok: true, id };
}

export async function deleteWorksheet(id: string): Promise<{ error: string } | undefined> {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !STAFF_ROLES.includes(ctx.role ?? "")) return { error: "No tienes permiso para eliminar fichas." };

  const supabase = await createClient();
  const { error } = await supabase.from("worksheets").delete().eq("id", id).eq("school_id", ctx.schoolId);
  if (error) return { error: "No se pudo eliminar la ficha." };

  revalidatePath("/fichas");
  return undefined;
}
