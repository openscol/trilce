import type { Rng } from "../rng";
import type { Question } from "../types";
import { NAMES, choiceQ, numQ, table } from "./kit";

// Tiempo (4.° en adelante): conversiones, tiempo transcurrido, horarios y
// husos horarios. Las horas del día se guardan en minutos desde medianoche.

// 14:05 → "2:05 p. m."
export function clock(min: number) {
  const m = ((min % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m % 60).padStart(2, "0")} ${h < 12 ? "a. m." : "p. m."}`;
}
// 135 → "2 h 15 min"
export const span = (min: number) => (min < 60 ? `${min} min` : min % 60 === 0 ? `${min / 60} h` : `${Math.floor(min / 60)} h ${min % 60} min`);

const UNITS: [big: string, bigPlural: string, small: string, factor: number][] = [
  ["minuto", "minutos", "segundos", 60],
  ["hora", "horas", "minutos", 60],
  ["día", "días", "horas", 24],
  ["semana", "semanas", "días", 7],
  ["año", "años", "meses", 12],
];
const amount = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

// Convertir unidades de tiempo.
export function convertTime(r: Rng): Question {
  const [big, bigs, small, factor] = r.pick(UNITS);
  const n = r.int(2, factor === 60 ? 9 : 12);
  return r.chance(0.6)
    ? numQ(n * factor, "Convierte.", `${amount(n, big, bigs)} = ? ${small}`, `1 ${big} = ${factor} ${small}; ${n} × ${factor} = ${n * factor}.`, `${bigs}-a-${small}`)
    : numQ(n, "Convierte.", `${n * factor} ${small} = ? ${bigs}`, `${factor} ${small} = 1 ${big}; ${n * factor} ÷ ${factor} = ${n}.`, `${small}-a-${bigs}`);
}

const MIXED: [big: string, small: string, factor: number, bigName: string][] = [
  ["h", "min", 60, "hora"],
  ["min", "s", 60, "minuto"],
  ["semanas", "días", 7, "semana"],
  ["años", "meses", 12, "año"],
  ["días", "h", 24, "día"],
];

// Convertir unidades de tiempo mixtas.
export function convertMixedTime(r: Rng): Question {
  const [big, small, factor, name] = r.pick(MIXED);
  const a = r.int(2, 6);
  const b = r.int(1, factor - 1);
  const total = a * factor + b;
  return r.chance(0.5)
    ? numQ(total, "Convierte.", `${a} ${big} ${b} ${small} = ? ${small}`, `1 ${name} = ${factor} ${small}; ${a} × ${factor} = ${a * factor}; ${a * factor} + ${b} = ${total}.`, `a-${small}`)
    : numQ(b, "Convierte. ¿Qué número falta?", `${total} ${small} = ${a} ${big} ? ${small}`, `${a} ${big} son ${a * factor} ${small}; ${total} − ${a * factor} = ${b}.`, `desde-${small}`);
}

const spanOptions = (r: Rng, answer: number, extra: number[] = []) => [...new Set([...extra, answer + 60, answer - 60, answer + 10, answer - 10, answer + 30, answer + 100 - 60])].filter((x) => x > 0 && x !== answer).map(span);

// Sumar y restar unidades de tiempo mixtas.
export function addSubMixedTime(r: Rng): Question {
  const a = r.int(1, 5) * 60 + r.int(1, 11) * 5;
  const b = r.int(1, 3) * 60 + r.int(1, 11) * 5;
  const add = r.chance(0.5) || a <= b;
  const answer = add ? a + b : a - b;
  // Error típico: no convertir 60 min en 1 h.
  const naive = add ? answer + 40 : answer - 40;
  return choiceQ(r, "Resuelve.", span(answer), spanOptions(r, answer, [naive]), `${span(a)} ${add ? "+" : "−"} ${span(b)} = ${span(answer)} (60 min = 1 h).`, `${span(a)} ${add ? "+" : "−"} ${span(b)} = ?`, add ? "suma" : "resta");
}

// Hora de inicio y duración, en múltiplos de 5 minutos.
function interval(r: Rng) {
  const start = r.int(6, 15) * 60 + r.int(0, 11) * 5;
  const length = r.int(0, 4) * 60 + r.int(1, 11) * 5;
  return { start, length, end: start + length };
}

const ACTIVITIES = ["la clase de natación", "el partido de fútbol", "la película", "el ensayo de danza", "el viaje en bus", "el taller de arte", "la visita al museo"];

// Tiempo transcurrido (`words`: con problema).
export function elapsedTime(r: Rng, words: boolean): Question {
  const { start, length, end } = interval(r);
  const activity = r.pick(ACTIVITIES);
  const why = `De ${clock(start)} a ${clock(end)} pasan ${span(length)}.`;
  const prompt = words ? `${activity[0].toUpperCase()}${activity.slice(1)} empezó a las ${clock(start)} y terminó a las ${clock(end)} ¿Cuánto duró?` : `¿Cuánto tiempo pasa de ${clock(start)} a ${clock(end)}?`;
  return choiceQ(r, prompt, span(length), spanOptions(r, length, [length + 40, Math.abs(length - 40) || 20]), why);
}

// Hallar la hora de inicio o de fin (varios pasos).
export function startEndTime(r: Rng): Question {
  const { start, length, end } = interval(r);
  const name = r.pick(NAMES);
  const brk = r.int(1, 5) * 5;
  const form = r.int(0, 2);
  const times = (answer: number) => [answer + 60, answer - 60, answer + 10, answer - 10, answer + 30, answer - 30].map(clock);
  if (form === 0) return choiceQ(r, `${name} empieza su tarea a las ${clock(start)} Trabaja ${span(length)} y luego descansa ${brk} min. ¿A qué hora termina su descanso?`, clock(end + brk), times(end + brk), `${clock(start)} + ${span(length)} = ${clock(end)}; + ${brk} min = ${clock(end + brk)}`, undefined, "fin");
  if (form === 1) return choiceQ(r, `Un viaje dura ${span(length)} y hay que llegar a las ${clock(end)} Además, se necesitan ${brk} min para llegar al paradero. ¿A qué hora hay que salir de casa?`, clock(start - brk), times(start - brk), `${clock(end)} − ${span(length)} = ${clock(start)}; − ${brk} min = ${clock(start - brk)}`, undefined, "inicio");
  return choiceQ(r, `Una función de teatro empieza a las ${clock(start)} Tiene dos partes de ${span(length)} cada una y un intermedio de ${brk} min. ¿A qué hora termina?`, clock(start + 2 * length + brk), times(start + 2 * length + brk), `${span(length)} + ${brk} min + ${span(length)} = ${span(2 * length + brk)}; termina a las ${clock(start + 2 * length + brk)}`, undefined, "dos-partes");
}

// Tiempo transcurrido en un horario.
export function readSchedule(r: Rng): Question {
  const names = r.shuffle(["Matemática", "Comunicación", "Recreo", "Arte", "Ciencia", "Educación Física", "Inglés"]).slice(0, 4);
  let t = r.int(7, 9) * 60 + r.int(0, 3) * 15;
  const rows = names.map((n) => {
    const length = r.int(2, 7) * 15;
    const row = { n, start: t, end: t + length };
    t += length;
    return row;
  });
  const visual = table(["Actividad", "Inicio", "Fin"], rows.map((x) => [x.n, clock(x.start), clock(x.end)]), "Horario del día");
  const i = r.int(0, 3);
  const form = r.int(0, 2);
  if (form === 0) return choiceQ(r, `¿Cuánto dura «${rows[i].n}»?`, span(rows[i].end - rows[i].start), spanOptions(r, rows[i].end - rows[i].start, [15, 30, 45, 75, 90]), `De ${clock(rows[i].start)} a ${clock(rows[i].end)} pasan ${span(rows[i].end - rows[i].start)}.`, visual, "duracion");
  if (form === 1) return { kind: "choice", prompt: `¿Qué actividad empieza a las ${clock(rows[i].start)}?`, visual, options: names, answer: rows[i].n, explanation: `A las ${clock(rows[i].start)} empieza «${rows[i].n}».`, tag: "leer" };
  const total = rows[3].end - rows[0].start;
  return choiceQ(r, "¿Cuánto tiempo pasa desde que empieza la primera actividad hasta que termina la última?", span(total), spanOptions(r, total, [total + 15, total - 15]), `De ${clock(rows[0].start)} a ${clock(rows[3].end)} pasan ${span(total)}.`, visual, "total");
}

// Horarios de transporte.
export function transportSchedule(r: Rng): Question {
  const stops = r.shuffle(["Lima", "Ica", "Huaral", "Chincha", "Cañete", "Barranca", "Huacho"]).slice(0, 4);
  let t = r.int(6, 10) * 60 + r.int(0, 11) * 5;
  const times = stops.map(() => {
    const now = t;
    t += r.int(4, 20) * 5;
    return now;
  });
  const visual = table(["Parada", "Hora"], stops.map((s, i) => [s, clock(times[i])]), "Recorrido del bus");
  const i = r.int(0, 2);
  const j = r.int(i + 1, 3);
  const form = r.int(0, 2);
  if (form === 0) return choiceQ(r, `¿Cuánto dura el viaje de ${stops[i]} a ${stops[j]}?`, span(times[j] - times[i]), spanOptions(r, times[j] - times[i], [20, 45, 75]), `De ${clock(times[i])} a ${clock(times[j])} pasan ${span(times[j] - times[i])}.`, visual, "duracion");
  if (form === 1) {
    const late = r.int(1, 6) * 5;
    return choiceQ(r, `Hoy el bus va con ${late} min de retraso. ¿A qué hora llega a ${stops[j]}?`, clock(times[j] + late), [times[j] - late, times[j], times[j] + late + 10, times[j] + 60 + late, times[j] + late - 5].map(clock), `${clock(times[j])} + ${late} min = ${clock(times[j] + late)}`, visual, "retraso");
  }
  const arrive = times[i] - r.int(1, 5) * 5;
  return numQ(times[i] - arrive, `Llegas a ${stops[i]} a las ${clock(arrive)} ¿Cuántos minutos esperas hasta que pase el bus?`, visual, `De ${clock(arrive)} a ${clock(times[i])} pasan ${times[i] - arrive} minutos.`, "espera");
}

const ZONES: [city: string, offset: number][] = [["Bogotá", 0], ["Ciudad de México", -1], ["Santiago de Chile", 1], ["Buenos Aires", 2], ["São Paulo", 2], ["Madrid", 7], ["Londres", 6], ["Tokio", 14], ["Nueva York", 1], ["Los Ángeles", -2]];

// Husos horarios (la diferencia con Lima se da en el enunciado).
export function timeZones(r: Rng): Question {
  const [city, offset] = r.pick(ZONES.filter(([, o]) => o !== 0));
  const lima = r.int(6, 20) * 60 + r.pick([0, 15, 30, 45]);
  const rel = `${city} está ${Math.abs(offset)} ${Math.abs(offset) === 1 ? "hora" : "horas"} ${offset > 0 ? "adelantada" : "atrasada"} respecto de Lima.`;
  const fromLima = r.chance(0.5);
  const answer = fromLima ? lima + offset * 60 : lima;
  const shown = fromLima ? lima : lima + offset * 60;
  // Error típico: aplicar la diferencia en el sentido contrario.
  const opposite = fromLima ? shown - offset * 60 : shown + offset * 60;
  const wrong = [opposite, shown, answer + 60, answer - 60, answer + 120].map(clock);
  return choiceQ(r, `${rel} Si en ${fromLima ? "Lima" : city} son las ${clock(shown)}, ¿qué hora es en ${fromLima ? city : "Lima"}?`, clock(answer), wrong, `${clock(shown)} ${fromLima === offset > 0 ? "+" : "−"} ${Math.abs(offset)} h = ${clock(answer)}`, undefined, offset > 0 ? "adelantada" : "atrasada");
}

// Fracciones de unidades de tiempo.
export function timeFractions(r: Rng): Question {
  const [whole, unit, total, dens] = r.pick<[string, string, number, number[]]>([["hora", "minutos", 60, [2, 3, 4, 5, 6, 10]], ["minuto", "segundos", 60, [2, 3, 4, 6]], ["día", "horas", 24, [2, 3, 4, 6, 8]], ["año", "meses", 12, [2, 3, 4, 6]]]);
  const d = r.pick(dens);
  const n = r.int(1, d - 1);
  const frac = n === 1 && d === 2 ? "1/2" : `${n}/${d}`;
  return numQ((total / d) * n, `¿${unit === "horas" ? "Cuántas" : "Cuántos"} ${unit} son ${frac} de ${whole}?`, `1 ${whole} = ${total} ${unit}`, `${total} ÷ ${d} = ${total / d}; ${total / d} × ${n} = ${(total / d) * n} ${unit}.`, whole);
}
