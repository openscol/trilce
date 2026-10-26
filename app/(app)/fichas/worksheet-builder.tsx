"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MinusIcon, PlusIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getCurriculum, getSkill, skillUid } from "@/lib/games/catalog";
import { GRADES, getGrade } from "@/lib/games/grades";
import { getCompetencies } from "@/lib/games/topics";
import type { Section, Skill } from "@/lib/games/types";
import { CATEGORY_LABEL, DEFAULT_EXERCISES, MAX_EXERCISES, MIN_EXERCISES, printable, type WorksheetItemInput } from "@/lib/games/worksheets";
import { cn } from "@/lib/utils";
import { createWorksheet, updateWorksheet, type WorksheetInput } from "./actions";

// Prototipo: por ahora solo 2.° de primaria. Para abrir otro grado, agrégalo aquí.
const ENABLED_GRADES = ["p2"];

type Category = WorksheetInput["category"];
type Mode = WorksheetInput["mode"];

function clamp(n: number) {
  return Math.min(MAX_EXERCISES, Math.max(MIN_EXERCISES, Math.round(n) || MIN_EXERCISES));
}

// «Ficha 2.° de primaria – Matemáticas» (o «varios grados»).
function suggestedTitle(category: Category, items: WorksheetItemInput[]) {
  const grades = new Set(items.map((it) => it.skill.split("/")[1]));
  const grade = grades.size === 1 ? getGrade([...grades][0])?.label.replace("Primaria", "primaria").replace("Secundaria", "secundaria") : grades.size > 1 ? "varios grados" : null;
  return ["Ficha", grade, "–", CATEGORY_LABEL[category]].filter(Boolean).join(" ");
}

function Choice({ active, disabled, onClick, children }: { active: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-lg border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        active ? "border-brand-green bg-brand-green/10 font-medium" : "border-border hover:border-border-prominent"
      )}
    >
      {children}
    </button>
  );
}

function SkillRow({ uid, skill, count, onToggle, onCount, gradeTag }: { uid: string; skill: Skill; count: number | undefined; onToggle: () => void; onCount: (n: number) => void; gradeTag?: string }) {
  const on = count !== undefined;
  return (
    <li className={cn("flex flex-wrap items-center gap-3 rounded-lg border px-3 py-2", on ? "border-border-brand bg-brand-green/5" : "border-border")}>
      <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-sm">
        <input type="checkbox" checked={on} onChange={onToggle} className="size-4 shrink-0 accent-primary" aria-describedby={`${uid}-tags`} />
        <span className="min-w-0">{skill.title}</span>
        <span id={`${uid}-tags`} className="flex gap-1">
          {gradeTag && <Badge variant="outline">{gradeTag}</Badge>}
          {skill.extended && <Badge variant="outline">Explorador</Badge>}
        </span>
      </label>
      {on && (
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <Input type="number" min={MIN_EXERCISES} max={MAX_EXERCISES} value={count} onChange={(e) => onCount(clamp(Number(e.target.value)))} className="h-8 w-16 text-center" aria-label={`Ejercicios de ${skill.title}`} />
          ejercicios
        </span>
      )}
    </li>
  );
}

export function WorksheetBuilder({ worksheetId, initial }: { worksheetId?: string; initial?: WorksheetInput }) {
  const router = useRouter();
  const [category, setCategory] = useState<Category>(initial?.category ?? "matematicas");
  const [mode, setMode] = useState<Mode>(initial?.mode ?? "grado");
  const [grade, setGrade] = useState(ENABLED_GRADES[0]);
  const [topicId, setTopicId] = useState<string | null>(null);
  const [items, setItems] = useState<WorksheetItemInput[]>(initial?.items ?? []);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [titleEdited, setTitleEdited] = useState(!!initial);
  const [includeExplanation, setIncludeExplanation] = useState(initial?.includeExplanation ?? true);
  const [includeAnswers, setIncludeAnswers] = useState(initial?.includeAnswers ?? false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const competencies = getCompetencies(category);
  const shownTitle = titleEdited ? title : suggestedTitle(category, items);
  const countOf = (uid: string) => items.find((it) => it.skill === uid)?.count;

  function toggle(uid: string) {
    setItems((list) => (list.some((it) => it.skill === uid) ? list.filter((it) => it.skill !== uid) : [...list, { skill: uid, count: DEFAULT_EXERCISES }]));
  }
  function setCount(uid: string, n: number) {
    setItems((list) => list.map((it) => (it.skill === uid ? { ...it, count: clamp(n) } : it)));
  }
  function changeCategory(c: Category) {
    if (c === category) return;
    if (items.length && !window.confirm("Una ficha es de una sola área. Si cambias de área, se quitan los temas elegidos. ¿Continuar?")) return;
    setCategory(c);
    setItems([]);
    setTopicId(null);
  }

  // Modo grado: competencia → sección → juegos del grado elegido.
  const byGrade = useMemo(() => {
    const cur = getCurriculum(category, grade);
    if (!cur) return [];
    return competencies
      .map((comp) => ({
        comp,
        sections: cur.sections
          .filter((sec) => comp.topics.some((t) => t.id === sec.topic))
          .map((sec) => ({ sec, skills: cur.skills.filter((sk) => sk.section === sec.id && printable(sk)) }))
          .filter((x) => x.skills.length > 0),
      }))
      .filter((x) => x.sections.length > 0);
  }, [category, grade, competencies]);

  // Modo tema: los juegos de un tema en los grados habilitados.
  const topicBlocks = useMemo(() => {
    const blocks: { grade: string; section: Section; skills: Skill[] }[] = [];
    for (const g of GRADES.filter((x) => ENABLED_GRADES.includes(x.key))) {
      const cur = getCurriculum(category, g.key);
      if (!cur) continue;
      for (const sec of cur.sections) {
        if (sec.topic !== topicId) continue;
        const skills = cur.skills.filter((sk) => sk.section === sec.id && printable(sk));
        if (skills.length) blocks.push({ grade: g.key, section: sec, skills });
      }
    }
    return blocks;
  }, [category, topicId]);

  // Temas con juegos en los grados habilitados.
  const availableTopics = useMemo(() => {
    const ids = new Set<string>();
    for (const g of ENABLED_GRADES) for (const sec of getCurriculum(category, g)?.sections ?? []) if (sec.topic) ids.add(sec.topic);
    return ids;
  }, [category]);

  function submit() {
    setError(null);
    const input: WorksheetInput = { title: shownTitle, category, mode, items, includeExplanation, includeAnswers };
    start(async () => {
      const res = worksheetId ? await updateWorksheet(worksheetId, input) : await createWorksheet(input);
      if (!res.ok) setError(res.error);
      else router.push(`/fichas/${res.id}`);
    });
  }

  const total = items.reduce((n, it) => n + it.count, 0);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex min-w-0 flex-col gap-6">
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium">1. Área</h2>
          <div className="flex flex-wrap gap-2">
            {(["matematicas", "comunicacion"] as const).map((c) => (
              <Choice key={c} active={category === c} onClick={() => changeCategory(c)}>
                {CATEGORY_LABEL[c]}
              </Choice>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium">2. Buscar por</h2>
          <div className="flex flex-wrap gap-2">
            <Choice active={mode === "grado"} onClick={() => setMode("grado")}>
              Grado
            </Choice>
            <Choice active={mode === "tema"} onClick={() => setMode("tema")}>
              Tema
            </Choice>
          </div>
        </section>

        {mode === "grado" && (
          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-medium">3. Elige el grado y los temas</h2>
            <div className="flex flex-wrap gap-2">
              {GRADES.map((g) => (
                <Choice key={g.key} active={grade === g.key} disabled={!ENABLED_GRADES.includes(g.key)} onClick={() => setGrade(g.key)}>
                  {g.label}
                </Choice>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Prototipo: por ahora solo está disponible 2.° de primaria.</p>
            {byGrade.map(({ comp, sections }) => (
              <div key={comp.id} className="flex flex-col gap-3 rounded-2xl border border-border p-4">
                <div>
                  <p className="font-medium">
                    {comp.icon} {comp.short}
                  </p>
                  <p className="text-xs text-muted-foreground">{comp.name}</p>
                </div>
                {sections.map(({ sec, skills }) => (
                  <div key={sec.id} className="flex flex-col gap-2">
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      {sec.icon} {sec.name}
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {skills.map((sk) => {
                        const uid = skillUid(category, grade, sk.id);
                        return <SkillRow key={uid} uid={uid} skill={sk} count={countOf(uid)} onToggle={() => toggle(uid)} onCount={(n) => setCount(uid, n)} />;
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </section>
        )}

        {mode === "tema" && (
          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-medium">3. Elige el tema y los juegos</h2>
            {competencies.map((comp) => {
              const topics = comp.topics.filter((t) => availableTopics.has(t.id));
              if (!topics.length) return null;
              return (
                <div key={comp.id} className="flex flex-col gap-2">
                  <p className="text-sm">
                    <span className="font-medium">
                      {comp.icon} {comp.short}
                    </span>{" "}
                    <span className="text-xs text-muted-foreground">· {comp.name}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((t) => (
                      <Choice key={t.id} active={topicId === t.id} onClick={() => setTopicId(t.id)}>
                        {t.icon} {t.name}
                      </Choice>
                    ))}
                  </div>
                </div>
              );
            })}
            {topicId === null && <p className="text-sm text-muted-foreground">Elige un tema para ver sus juegos.</p>}
            {topicBlocks.map(({ grade: g, section, skills }) => (
              <div key={`${g}-${section.id}`} className="flex flex-col gap-2 rounded-2xl border border-border p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  {section.icon} {section.name}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {skills.map((sk) => {
                    const uid = skillUid(category, g, sk.id);
                    return <SkillRow key={uid} uid={uid} skill={sk} gradeTag={getGrade(g)?.label} count={countOf(uid)} onToggle={() => toggle(uid)} onCount={(n) => setCount(uid, n)} />;
                  })}
                </ul>
              </div>
            ))}
          </section>
        )}
      </div>

      <aside className="flex flex-col gap-5 rounded-2xl border border-border p-5 lg:sticky lg:top-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="worksheet-title">Nombre</Label>
          <Input
            id="worksheet-title"
            value={shownTitle}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleEdited(true);
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Contiene</p>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Marca los temas que quieres en la ficha.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {items.map((it) => (
                <li key={it.skill} className="flex items-center gap-2 text-sm">
                  <span className="min-w-0 flex-1">{getSkill(it.skill)?.title ?? it.skill}</span>
                  <Button type="button" variant="ghost" size="icon-sm" onClick={() => setCount(it.skill, it.count - 1)} disabled={it.count <= MIN_EXERCISES} aria-label="Un ejercicio menos">
                    <MinusIcon />
                  </Button>
                  <span className="w-5 text-center tabular-nums">{it.count}</span>
                  <Button type="button" variant="ghost" size="icon-sm" onClick={() => setCount(it.skill, it.count + 1)} disabled={it.count >= MAX_EXERCISES} aria-label="Un ejercicio más">
                    <PlusIcon />
                  </Button>
                  <Button type="button" variant="ghost" size="icon-sm" onClick={() => toggle(it.skill)} aria-label="Quitar">
                    <XIcon />
                  </Button>
                </li>
              ))}
            </ul>
          )}
          {items.length > 0 && <p className="text-xs text-muted-foreground">{total} ejercicios en total</p>}
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-4">
          <label className="flex items-start justify-between gap-3 text-sm">
            <span>
              ¿Incluir la explicación de cada tema?
              <span className="block text-xs text-muted-foreground">La idea clave y un ejemplo resuelto antes de los ejercicios.</span>
            </span>
            <Switch checked={includeExplanation} onCheckedChange={setIncludeExplanation} />
          </label>
          <label className="flex items-start justify-between gap-3 text-sm">
            <span>
              ¿Incluir las respuestas al final?
              <span className="block text-xs text-muted-foreground">En una hoja aparte, para el docente.</span>
            </span>
            <Switch checked={includeAnswers} onCheckedChange={setIncludeAnswers} />
          </label>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button onClick={submit} disabled={pending || items.length === 0}>
          {pending ? "Guardando…" : worksheetId ? "Guardar cambios" : "Crear ficha"}
        </Button>
      </aside>
    </div>
  );
}
