"use server";

import { revalidatePath } from "next/cache";
import { requireAppContext } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type GameCategory = Database["public"]["Tables"]["game_categories"]["Row"];

export type FormState = { error: string } | undefined;

const CAN_WRITE_ROLES = ["admin", "administrativo"];
// Rutas fijas dentro de /juegos que una categoría no puede ocupar.
const RESERVED = ["progreso", "categorias"];

function str(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

// "Comunicación" → "comunicacion". El slug enlaza la categoría con los juegos
// programados (lib/games/catalog.ts), por eso no cambia al renombrarla.
function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function revalidate() {
  revalidatePath("/juegos", "layout");
}

export async function createCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !CAN_WRITE_ROLES.includes(ctx.role ?? "")) {
    return { error: "No tienes permiso para crear categorías." };
  }
  const name = str(formData, "name");
  if (!name) return { error: "El nombre es obligatorio." };
  const slug = slugify(str(formData, "slug") ?? name);
  if (!slug) return { error: "El identificador solo puede tener letras y números." };
  if (RESERVED.includes(slug)) return { error: `"${slug}" está reservado; usa otro nombre.` };

  const supabase = await createClient();
  const { error } = await supabase.from("game_categories").insert({
    school_id: ctx.schoolId,
    slug,
    name,
    icon: str(formData, "icon") ?? "🎮",
    sort_order: Number(formData.get("sort_order")) || 0,
  });
  if (error) {
    return { error: error.code === "23505" ? "Ya existe una categoría con ese identificador." : "No se pudo crear la categoría." };
  }
  revalidate();
  return undefined;
}

export async function updateCategory(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !CAN_WRITE_ROLES.includes(ctx.role ?? "")) {
    return { error: "No tienes permiso para editar categorías." };
  }
  const name = str(formData, "name");
  if (!name) return { error: "El nombre es obligatorio." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("game_categories")
    .update({
      name,
      icon: str(formData, "icon") ?? "🎮",
      sort_order: Number(formData.get("sort_order")) || 0,
      active: formData.get("active") === "on",
    })
    .eq("id", id)
    .eq("school_id", ctx.schoolId);
  if (error) return { error: "No se pudo guardar la categoría." };
  revalidate();
  return undefined;
}

// Borrar la categoría no borra resultados: game_attempts guarda el id del
// juego como texto. Si se vuelve a crear con el mismo identificador, el
// progreso de los alumnos reaparece.
export async function deleteCategory(id: string): Promise<{ error: string } | undefined> {
  const ctx = await requireAppContext();
  if (!ctx.schoolId || !CAN_WRITE_ROLES.includes(ctx.role ?? "")) {
    return { error: "No tienes permiso para eliminar categorías." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("game_categories").delete().eq("id", id).eq("school_id", ctx.schoolId);
  if (error) return { error: "No se pudo eliminar la categoría." };
  revalidate();
  return undefined;
}

export type { GameCategory };
