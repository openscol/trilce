import { redirect } from "next/navigation";
import { requireAppContext } from "@/lib/auth/context";
import { NoiseMeterLoader } from "./noise-meter-loader";

export default async function SemaforoPage() {
  const ctx = await requireAppContext();
  if (ctx.role !== "admin" && ctx.role !== "administrativo" && ctx.role !== "docente") redirect("/dashboard");
  return <NoiseMeterLoader />;
}
