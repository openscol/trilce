import { cn } from "@/lib/utils";
import type { Visual } from "@/lib/games/types";
import { ScratchBlocks } from "./scratch-blocks";

export function fractionLayout(parts: number, shape: "bar" | "area" | "circle") {
  if (shape === "area") {
    if (parts === 4) return { rows: 2, cols: 2 };
    if (parts === 6) return { rows: 2, cols: 3 };
    if (parts === 8) return { rows: 2, cols: 4 };
    // Marcos de diez (inicial): 2 filas de 5.
    if (parts === 10) return { rows: 2, cols: 5 };
    if (parts === 20) return { rows: 4, cols: 5 };
  }
  return { rows: 1, cols: parts };
}

export function FractionCells({
  parts,
  shape,
  shaded,
  onToggle,
}: {
  parts: number;
  shape: "bar" | "area";
  shaded: (i: number) => boolean;
  onToggle?: (i: number) => void;
}) {
  const { rows, cols } = fractionLayout(parts, shape);
  return (
    <div
      className="grid overflow-hidden rounded-lg border-2 border-foreground"
      style={{ gridTemplateColumns: `repeat(${cols}, ${cols > 8 ? "2.25rem" : "3.5rem"})`, gridTemplateRows: `repeat(${rows}, 3.5rem)` }}
    >
      {Array.from({ length: parts }, (_, i) => (
        <button
          key={i}
          type="button"
          disabled={!onToggle}
          onClick={() => onToggle?.(i)}
          className={cn(
            "border border-foreground/40",
            shaded(i) ? "bg-brand-green/60" : "bg-background",
            onToggle && "cursor-pointer hover:bg-brand-green/30"
          )}
          aria-label={`Parte ${i + 1}`}
        />
      ))}
    </div>
  );
}

function Pie({ parts, shaded }: { parts: number; shaded: number }) {
  const r = 45;
  const slices = Array.from({ length: parts }, (_, i) => {
    const a0 = (i / parts) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((i + 1) / parts) * 2 * Math.PI - Math.PI / 2;
    const p = (a: number) => `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
    return <path key={i} d={`M50,50 L${p(a0)} A${r},${r} 0 0 1 ${p(a1)} Z`} className={cn("stroke-foreground", i < shaded ? "fill-brand-green/60" : "fill-background")} strokeWidth={1.5} />;
  });
  return (
    <svg viewBox="0 0 100 100" className="size-40">
      {parts === 1 ? <circle cx="50" cy="50" r={r} className="fill-brand-green/60 stroke-foreground" /> : slices}
    </svg>
  );
}

function regularPolygon(sides: number, cx = 50, cy = 52, r = 40) {
  return Array.from({ length: sides }, (_, i) => {
    const a = (i / sides) * 2 * Math.PI - Math.PI / 2;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
}

function Shape2d({ name }: { name: string }) {
  const cls = "fill-brand-green/30 stroke-foreground";
  return (
    <svg viewBox="0 0 100 100" className="size-28">
      {name === "círculo" && <circle cx="50" cy="50" r="38" className={cls} strokeWidth={2} />}
      {name === "triángulo" && <polygon points="50,12 90,85 10,85" className={cls} strokeWidth={2} />}
      {name === "cuadrado" && <rect x="17" y="17" width="66" height="66" className={cls} strokeWidth={2} />}
      {name === "rectángulo" && <rect x="8" y="27" width="84" height="46" className={cls} strokeWidth={2} />}
      {name === "pentágono" && <polygon points={regularPolygon(5)} className={cls} strokeWidth={2} />}
      {name === "hexágono" && <polygon points={regularPolygon(6, 50, 50, 40)} className={cls} strokeWidth={2} />}
    </svg>
  );
}

function Solid({ name }: { name: string }) {
  const f = "fill-brand-green/30 stroke-foreground";
  const p = { className: f, strokeWidth: 2, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 100 100" className="size-32">
      {name === "cubo" && (
        <>
          <polygon points="20,35 65,35 65,80 20,80" {...p} />
          <polygon points="20,35 35,20 80,20 65,35" {...p} />
          <polygon points="65,35 80,20 80,65 65,80" {...p} />
        </>
      )}
      {name === "prisma rectangular" && (
        <>
          <polygon points="8,42 66,42 66,80 8,80" {...p} />
          <polygon points="8,42 26,26 84,26 66,42" {...p} />
          <polygon points="66,42 84,26 84,64 66,80" {...p} />
        </>
      )}
      {name === "cilindro" && (
        <>
          <path d="M22,25 V75 A28,9 0 0 0 78,75 V25" {...p} />
          <ellipse cx="50" cy="25" rx="28" ry="9" {...p} />
        </>
      )}
      {name === "cono" && <path d="M50,10 L22,74 A28,9 0 0 0 78,74 Z" {...p} />}
      {name === "esfera" && (
        <>
          <circle cx="50" cy="50" r="34" {...p} />
          <ellipse cx="50" cy="50" rx="34" ry="10" fill="none" className="stroke-foreground" strokeDasharray="3 3" />
        </>
      )}
      {name === "pirámide cuadrada" && (
        <>
          <polygon points="50,12 20,76 66,76" {...p} />
          <polygon points="50,12 66,76 84,58" {...p} />
        </>
      )}
      {name === "pirámide triangular" && (
        <>
          <polygon points="50,12 18,78 82,78" {...p} />
          <polyline points="50,12 60,58 18,78" fill="none" className="stroke-foreground" strokeWidth={2} />
          <polyline points="60,58 82,78" fill="none" className="stroke-foreground" strokeWidth={2} />
        </>
      )}
      {name === "prisma triangular" && (
        <>
          <polygon points="12,72 48,72 30,38" {...p} />
          <polygon points="30,38 66,38 84,72 48,72" {...p} />
        </>
      )}
    </svg>
  );
}

function Labeled({ names, render }: { names: string[]; render: (n: string) => React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-center gap-6">
      {names.map((n, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          {render(n)}
          {names.length > 1 && <span className="text-lg font-medium">{String.fromCharCode(65 + i)}</span>}
        </div>
      ))}
    </div>
  );
}

function NumberLine({ v }: { v: Extract<Visual, { kind: "numberLine" }> }) {
  const W = 560;
  const pad = 20;
  const x = (n: number) => pad + ((n - v.min) / (v.max - v.min)) * (W - pad * 2);
  const ticks: number[] = [];
  for (let n = v.min; n <= v.max; n += v.step) ticks.push(n);
  return (
    <svg viewBox={`0 0 ${W} 80`} className="w-full max-w-xl">
      <line x1={pad} x2={W - pad} y1={45} y2={45} className="stroke-foreground" strokeWidth={2} />
      {ticks.map((n) => {
        const labeled = (n - v.min) % v.labelEvery === 0;
        return (
          <g key={n}>
            <line x1={x(n)} x2={x(n)} y1={labeled ? 36 : 40} y2={labeled ? 54 : 50} className="stroke-foreground" strokeWidth={2} />
            {labeled && v.marked !== n && (
              <text x={x(n)} y={72} textAnchor="middle" className="fill-foreground text-[14px]">
                {n < 0 ? `−${-n}` : n}
              </text>
            )}
          </g>
        );
      })}
      {v.ray && v.marked !== undefined && (
        <>
          <line x1={x(v.marked)} x2={v.ray.dir === "right" ? W - pad + 12 : pad - 12} y1={45} y2={45} className="stroke-brand-green-text" strokeWidth={6} strokeLinecap="round" />
          <path d={v.ray.dir === "right" ? `M${W - 2} 45 l-12 -8 v16 z` : `M2 45 l12 -8 v16 z`} className="fill-brand-green-text" />
        </>
      )}
      {v.marked !== undefined && <circle cx={x(v.marked)} cy={45} r={8} className={cn("stroke-foreground", v.ray && !v.ray.closed ? "fill-background" : "fill-brand-green")} strokeWidth={2} />}
      {v.segments?.map((seg, i) => {
        const a = seg.from === undefined ? pad - 12 : x(seg.from);
        const b = seg.to === undefined ? W - pad + 12 : x(seg.to);
        return (
          <g key={`seg${i}`}>
            <line x1={a} x2={b} y1={45} y2={45} className="stroke-brand-green-text" strokeWidth={6} strokeLinecap="round" />
            {seg.from === undefined && <path d="M2 45 l12 -8 v16 z" className="fill-brand-green-text" />}
            {seg.to === undefined && <path d={`M${W - 2} 45 l-12 -8 v16 z`} className="fill-brand-green-text" />}
            {seg.from !== undefined && <circle cx={a} cy={45} r={8} className={cn("stroke-foreground", seg.closedFrom ? "fill-brand-green" : "fill-background")} strokeWidth={2} />}
            {seg.to !== undefined && <circle cx={b} cy={45} r={8} className={cn("stroke-foreground", seg.closedTo ? "fill-brand-green" : "fill-background")} strokeWidth={2} />}
          </g>
        );
      })}
      {v.dots?.map((d, i) => <circle key={`dot${i}`} cx={x(d)} cy={45} r={8} className="fill-brand-green stroke-foreground" strokeWidth={2} />)}
    </svg>
  );
}

function FractionLine({ v }: { v: Extract<Visual, { kind: "fractionLine" }> }) {
  const W = 560;
  const pad = 30;
  const wholes = v.wholes ?? 1;
  const total = v.parts * wholes;
  const x = (k: number) => pad + (k / total) * (W - pad * 2);
  return (
    <svg viewBox={`0 0 ${W} 90`} className="w-full max-w-xl">
      <line x1={pad} x2={W - pad} y1={50} y2={50} className="stroke-foreground" strokeWidth={2} />
      {Array.from({ length: total + 1 }, (_, k) => (
        <line key={k} x1={x(k)} x2={x(k)} y1={40} y2={60} className="stroke-foreground" strokeWidth={2} />
      ))}
      {v.title && <text x={pad} y={18} className="fill-foreground text-[16px] font-medium">{v.title}</text>}
      <text x={x(0)} y={80} textAnchor="middle" className="fill-foreground text-[15px]">{v.labels?.[0] ?? 0}</text>
      <text x={x(total)} y={80} textAnchor="middle" className="fill-foreground text-[15px]">{v.labels?.[1] ?? wholes}</text>
      {v.marked !== undefined && <circle cx={x(v.marked)} cy={50} r={8} className="fill-brand-green stroke-foreground" strokeWidth={2} />}
      {v.points?.map((p) => (
        <g key={p.label}>
          <circle cx={x(p.at)} cy={50} r={7} className="fill-brand-green stroke-foreground" strokeWidth={2} />
          <text x={x(p.at)} y={28} textAnchor="middle" className="fill-foreground text-[16px] font-medium">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

// Barras del mismo ancho total, para comparar fracciones equivalentes.
function EqualWidthBar({ parts, shaded }: { parts: number; shaded: number }) {
  return (
    <div className="grid h-12 w-72 max-w-full overflow-hidden rounded-lg border-2 border-foreground" style={{ gridTemplateColumns: `repeat(${parts}, minmax(0, 1fr))` }}>
      {Array.from({ length: parts }, (_, i) => (
        <div key={i} className={cn("border-r border-foreground/40 last:border-r-0", i < shaded ? "bg-brand-green/60" : "bg-background")} />
      ))}
    </div>
  );
}

// Centésimos: cuadrícula de 10 × 10, sombreada por columnas.
function DecimalGrid({ hundredths, extra = 0, crossed = 0 }: { hundredths: number; extra?: number; crossed?: number }) {
  return (
    <svg viewBox="0 0 202 202" className="size-52">
      {Array.from({ length: 100 }, (_, i) => {
        const col = Math.floor(i / 10);
        const row = i % 10;
        const fill = i < hundredths - crossed ? "fill-brand-green/60" : i < hundredths ? "fill-red-400/50" : i < hundredths + extra ? "fill-sky-400/60" : "fill-background";
        return (
          <g key={i}>
            <rect x={1 + col * 20} y={1 + row * 20} width={20} height={20} className={cn("stroke-foreground/50", fill)} strokeWidth={1} />
            {i >= hundredths - crossed && i < hundredths && <path d={`M${4 + col * 20} ${4 + row * 20} l14 14 m0 -14 l-14 14`} className="stroke-foreground" strokeWidth={1.5} />}
          </g>
        );
      })}
      <rect x={1} y={1} width={200} height={200} className="fill-none stroke-foreground" strokeWidth={2} />
    </svg>
  );
}

function LinesPair({ v }: { v: Extract<Visual, { kind: "lines" }> }) {
  const second = v.relation === "paralelas" ? { rot: 0, dy: 26 } : v.relation === "perpendiculares" ? { rot: 90, dy: 0 } : { rot: 50, dy: 0 };
  return (
    <svg viewBox="0 0 160 160" className="size-44">
      <g transform={`rotate(${v.rotation} 80 80)`}>
        <line x1={14} x2={146} y1={v.relation === "paralelas" ? 54 : 80} y2={v.relation === "paralelas" ? 54 : 80} className="stroke-foreground" strokeWidth={3} strokeLinecap="round" />
        <g transform={`rotate(${second.rot} 80 80)`}>
          <line x1={14} x2={146} y1={80 + second.dy} y2={80 + second.dy} className="stroke-brand-green" strokeWidth={3} strokeLinecap="round" />
        </g>
        {v.relation === "perpendiculares" && <path d="M80 68 H92 V80" className="fill-none stroke-foreground" strokeWidth={1.5} />}
      </g>
    </svg>
  );
}

function AngleFigure({ v }: { v: Extract<Visual, { kind: "angle" }> }) {
  const rad = (v.degrees * Math.PI) / 180;
  const len = 62;
  const ex = 80 + len * Math.cos(-rad);
  const ey = 90 + len * Math.sin(-rad);
  const ar = 20;
  const ax = 80 + ar * Math.cos(-rad);
  const ay = 90 + ar * Math.sin(-rad);
  return (
    <svg viewBox="0 0 160 160" className="size-44">
      {v.protractor && (
        <g>
          <path d="M8 90 A72 72 0 0 1 152 90 Z" className="fill-sky-400/15 stroke-foreground/60" strokeWidth={1} />
          {Array.from({ length: 19 }, (_, i) => {
            const a = (-i * 10 * Math.PI) / 180;
            const big = i % 3 === 0;
            const r0 = big ? 62 : 66;
            return (
              <g key={i}>
                <line x1={80 + r0 * Math.cos(a)} y1={90 + r0 * Math.sin(a)} x2={80 + 72 * Math.cos(a)} y2={90 + 72 * Math.sin(a)} className="stroke-foreground/70" strokeWidth={1} />
                {big && (
                  <text x={80 + 53 * Math.cos(a)} y={90 + 53 * Math.sin(a) + 3} textAnchor="middle" className="fill-foreground text-[8px]">
                    {i * 10}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      )}
      <g transform={`rotate(${v.rotation} 80 90)`}>
        <line x1={80} y1={90} x2={80 + len} y2={90} className="stroke-foreground" strokeWidth={3} strokeLinecap="round" />
        <line x1={80} y1={90} x2={ex} y2={ey} className="stroke-foreground" strokeWidth={3} strokeLinecap="round" />
        {v.degrees === 90 ? (
          <path d="M94 90 V76 H80" className="fill-none stroke-brand-green" strokeWidth={2.5} />
        ) : (
          <path d={`M${80 + ar} 90 A${ar} ${ar} 0 ${v.degrees > 180 ? 1 : 0} 0 ${ax} ${ay}`} className="fill-none stroke-brand-green" strokeWidth={2.5} />
        )}
        <circle cx={80} cy={90} r={3.5} className="fill-foreground" />
      </g>
    </svg>
  );
}

function PolygonFigure({ v }: { v: Extract<Visual, { kind: "polygon" }> }) {
  const n = v.points.length;
  // Sentido en que se recorren los vértices (en pantalla): decide hacia dónde queda «afuera».
  const clockwise = v.points.reduce((sum, p, i) => sum + p[0] * v.points[(i + 1) % n][1] - v.points[(i + 1) % n][0] * p[1], 0) > 0;
  return (
    <svg viewBox="-28 -22 156 144" className="h-52 w-60">
      {v.grid &&
        Array.from({ length: 11 }, (_, i) => (
          <g key={`g${i}`}>
            <line x1={i * 10} x2={i * 10} y1={0} y2={100} className="stroke-foreground/20" strokeWidth={0.6} />
            <line x1={0} x2={100} y1={i * 10} y2={i * 10} className="stroke-foreground/20" strokeWidth={0.6} />
          </g>
        ))}
      {v.open ? (
        <polyline points={v.points.map((p) => p.join(",")).join(" ")} className="fill-none stroke-foreground" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      ) : (
        <polygon points={v.points.map((p) => p.join(",")).join(" ")} className="fill-brand-green/25 stroke-foreground" strokeWidth={2} strokeLinejoin="round" />
      )}
      {v.dashed?.map(([a, b], i) => (
        <line key={`d${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className="stroke-brand-green-text" strokeWidth={2} strokeDasharray="5 4" />
      ))}
      {v.rightAngles?.map((i) => {
        const p = v.points[i];
        const a = v.points[(i + n - 1) % n];
        const b = v.points[(i + 1) % n];
        const unit = (q: [number, number]) => {
          const d = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
          return [((q[0] - p[0]) / d) * 8, ((q[1] - p[1]) / d) * 8];
        };
        const [ux, uy] = unit(a);
        const [wx, wy] = unit(b);
        return <path key={i} d={`M${p[0] + ux} ${p[1] + uy} L${p[0] + ux + wx} ${p[1] + uy + wy} L${p[0] + wx} ${p[1] + wy}`} className="fill-none stroke-foreground" strokeWidth={1.5} />;
      })}
      {v.sideLabels?.map((label, i) => {
        if (!label) return null;
        const p = v.points[i];
        const q = v.points[(i + 1) % n];
        const mx = (p[0] + q[0]) / 2;
        const my = (p[1] + q[1]) / 2;
        // El rótulo va hacia afuera, perpendicular al lado (sirve también en figuras con entrantes).
        const len = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
        let nx = (q[1] - p[1]) / len;
        let ny = -(q[0] - p[0]) / len;
        if (!clockwise) [nx, ny] = [-nx, -ny];
        return (
          <text key={i} x={mx + nx * 19} y={my + ny * 13 + 4} textAnchor="middle" className="fill-foreground text-[11px] font-medium">
            {label}
          </text>
        );
      })}
    </svg>
  );
}

// --- Inicial -----------------------------------------------------------------

function Frame({ size, count }: { size: 5 | 10; count: number }) {
  return (
    <div className="grid grid-cols-5 overflow-hidden rounded-lg border-2 border-foreground">
      {Array.from({ length: size }, (_, i) => (
        <div key={i} className="flex size-11 items-center justify-center border border-foreground/40 bg-background">
          {i < count && <span className="size-7 rounded-full bg-brand-green ring-2 ring-foreground" />}
        </div>
      ))}
    </div>
  );
}

const CUBE_COLORS = ["bg-brand-green/70", "bg-sky-400/80", "bg-amber-400/80"];

function Cubes({ v }: { v: Extract<Visual, { kind: "cubes" }> }) {
  const total = v.groups.reduce((a, b) => a + b, 0);
  const cubes = v.groups.flatMap((n, g) => Array.from({ length: n }, () => g));
  return (
    <div className={cn("flex", v.vertical ? "flex-col-reverse" : "flex-wrap justify-center")}>
      {cubes.map((g, i) => (
        <div key={i} className={cn("relative flex size-9 items-center justify-center border-2 border-foreground", CUBE_COLORS[g % CUBE_COLORS.length])}>
          {v.crossed !== undefined && i >= total - v.crossed && <span className="text-2xl font-bold leading-none text-foreground">✕</span>}
        </div>
      ))}
    </div>
  );
}

function Scatter({ v }: { v: Extract<Visual, { kind: "scatter" }> }) {
  return (
    <div className="relative size-64 rounded-2xl border border-border">
      {v.items.map((it, i) => (
        <span key={i} className="absolute -translate-x-1/2 -translate-y-1/2 text-3xl leading-none" style={{ left: `${10 + it.x * 0.8}%`, top: `${10 + it.y * 0.8}%` }}>
          {it.emoji}
        </span>
      ))}
    </div>
  );
}

function Clock({ hour, minute }: { hour: number; minute: number }) {
  const hand = (deg: number, len: number, width: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return <line x1={60} y1={60} x2={60 + len * Math.cos(rad)} y2={60 + len * Math.sin(rad)} className="stroke-foreground" strokeWidth={width} strokeLinecap="round" />;
  };
  return (
    <svg viewBox="0 0 120 120" className="size-48">
      <circle cx={60} cy={60} r={56} className="fill-background stroke-foreground" strokeWidth={3} />
      {Array.from({ length: 12 }, (_, i) => {
        const rad = (((i + 1) * 30 - 90) * Math.PI) / 180;
        return (
          <text key={i} x={60 + 45 * Math.cos(rad)} y={60 + 45 * Math.sin(rad) + 4} textAnchor="middle" className="fill-foreground text-[11px] font-medium">
            {i + 1}
          </text>
        );
      })}
      {hand((hour % 12) * 30 + minute * 0.5, 26, 4)}
      {hand(minute * 6, 38, 2.5)}
      <circle cx={60} cy={60} r={3} className="fill-foreground" />
    </svg>
  );
}

const COIN_LABEL: Record<number, [string, string]> = { 10: ["10", "céntimos"], 20: ["20", "céntimos"], 50: ["50", "céntimos"], 100: ["1", "sol"], 200: ["2", "soles"], 500: ["5", "soles"] };

function Coins({ coins }: { coins: number[] }) {
  return (
    <div className="flex max-w-md flex-wrap justify-center gap-2">
      {coins.map((c, i) =>
        c >= 1000 ? (
          <div key={i} className="flex h-14 w-28 items-center justify-center rounded-md border-2 border-foreground bg-emerald-300/50 text-xl font-bold tabular-nums">
            S/ {c / 100}
          </div>
        ) : (
        <div
          key={i}
          className={cn(
            "flex flex-col items-center justify-center rounded-full border-2 border-foreground leading-none",
            c >= 100 ? "size-16 bg-amber-300/70" : "size-14 bg-zinc-300/70 dark:bg-zinc-500/60"
          )}
        >
          <span className="text-xl font-bold tabular-nums">{COIN_LABEL[c][0]}</span>
          <span className="text-[9px]">{COIN_LABEL[c][1]}</span>
        </div>
        )
      )}
    </div>
  );
}

function Venn({ v }: { v: Extract<Visual, { kind: "venn" }> }) {
  const zone = (items: string[], cls: string) => <div className={cn("flex flex-wrap content-center items-center justify-center gap-1 text-2xl", cls)}>{items.map((e, i) => <span key={i}>{e}</span>)}</div>;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex w-80 max-w-full justify-between text-sm font-medium">
        <span>{v.leftLabel}</span>
        <span>{v.rightLabel}</span>
      </div>
      <div className="relative h-44 w-80 max-w-full">
        <div className="absolute left-0 top-0 h-44 w-52 rounded-full border-2 border-foreground bg-sky-400/15" />
        <div className="absolute right-0 top-0 h-44 w-52 rounded-full border-2 border-foreground bg-amber-400/15" />
        {zone(v.left, "absolute left-2 top-6 h-32 w-24")}
        {zone(v.both, "absolute left-1/2 top-6 h-32 w-20 -translate-x-1/2")}
        {zone(v.right, "absolute right-2 top-6 h-32 w-24")}
      </div>
    </div>
  );
}

function SplitShape({ v }: { v: Extract<Visual, { kind: "splitShape" }> }) {
  if (v.shape === "bar") {
    return (
      <svg viewBox="0 0 204 64" className="h-20 w-64">
        <rect x={2} y={2} width={200} height={60} className="fill-brand-green/25 stroke-foreground" strokeWidth={3} />
        {v.cuts.map((c, i) => <line key={i} x1={2 + c * 2} x2={2 + c * 2} y1={2} y2={62} className="stroke-foreground" strokeWidth={3} />)}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 104 104" className="size-40">
      <circle cx={52} cy={52} r={50} className="fill-brand-green/25 stroke-foreground" strokeWidth={3} />
      {v.cuts.map((deg, i) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        return <line key={i} x1={52} y1={52} x2={52 + 50 * Math.cos(rad)} y2={52 + 50 * Math.sin(rad)} className="stroke-foreground" strokeWidth={3} />;
      })}
    </svg>
  );
}

// Desarrollos planos de cuerpos geométricos.
function Net({ name }: { name: string }) {
  const p = { className: "fill-brand-green/30 stroke-foreground", strokeWidth: 2, strokeLinejoin: "round" as const };
  const sq = (x: number, y: number, w = 24, h = 24) => <rect key={`${x}-${y}-${w}`} x={x} y={y} width={w} height={h} {...p} />;
  return (
    <svg viewBox="0 0 140 110" className="h-40 w-52">
      {name === "cubo" && [sq(46, 6), sq(22, 30), sq(46, 30), sq(70, 30), sq(94, 30), sq(46, 54)]}
      {name === "prisma rectangular" && [sq(40, 4, 30, 16), sq(10, 20, 30, 40), sq(40, 20, 30, 40), sq(70, 20, 30, 40), sq(100, 20, 30, 40), sq(40, 60, 30, 16)]}
      {name === "pirámide cuadrada" && (
        <>
          {sq(52, 37, 36, 36)}
          <polygon points="52,37 88,37 70,5" {...p} />
          <polygon points="52,73 88,73 70,105" {...p} />
          <polygon points="52,37 52,73 20,55" {...p} />
          <polygon points="88,37 88,73 120,55" {...p} />
        </>
      )}
      {name === "prisma triangular" && (
        <>
          {sq(20, 30, 32, 40)}
          {sq(52, 30, 32, 40)}
          {sq(84, 30, 32, 40)}
          <polygon points="52,30 84,30 68,4" {...p} />
          <polygon points="52,70 84,70 68,96" {...p} />
        </>
      )}
      {name === "cilindro" && (
        <>
          {sq(30, 30, 80, 40)}
          <circle cx={70} cy={15} r={14} {...p} />
          <circle cx={70} cy={85} r={14} {...p} />
        </>
      )}
      {name === "cono" && (
        <>
          <path d="M70,8 L28,72 A50,50 0 0 0 112,72 Z" {...p} />
          <circle cx={70} cy={92} r={14} {...p} />
        </>
      )}
    </svg>
  );
}

function Ruler({ length, unit, sub = 1 }: { length: number; unit?: string; sub?: number }) {
  const cm = 40;
  const W = cm * 11 + 20;
  return (
    <svg viewBox={`0 0 ${W} 110`} className="w-full max-w-xl">
      <rect x={10} y={40} width={length * cm} height={22} rx={4} className="fill-brand-green/40 stroke-foreground" strokeWidth={2} />
      <rect x={10} y={66} width={cm * 10 + 4} height={38} className="fill-background stroke-foreground" strokeWidth={2} />
      {Array.from({ length: 11 }, (_, i) => (
        <g key={i}>
          <line x1={10 + i * cm} x2={10 + i * cm} y1={66} y2={82} className="stroke-foreground" strokeWidth={2} />
          <text x={10 + i * cm} y={98} textAnchor="middle" className="fill-foreground text-[13px]">{i}</text>
          {i < 10 && Array.from({ length: sub - 1 }, (_, k) => (
            <line key={k} x1={10 + (i + (k + 1) / sub) * cm} x2={10 + (i + (k + 1) / sub) * cm} y1={66} y2={sub % 2 === 0 && k + 1 === sub / 2 ? 78 : 74} className="stroke-foreground" strokeWidth={1.5} />
          ))}
        </g>
      ))}
      {unit && <text x={W - 12} y={30} textAnchor="end" className="fill-muted-foreground text-[13px]">{unit}</text>}
    </svg>
  );
}

function Thermometer({ v }: { v: Extract<Visual, { kind: "thermometer" }> }) {
  const top = 15;
  const bottom = 165;
  const y = (t: number) => bottom - ((t - v.min) / (v.max - v.min)) * (bottom - top);
  return (
    <svg viewBox="0 0 120 200" className="h-56">
      <rect x={45} y={top - 5} width={20} height={bottom - top + 15} rx={10} className="fill-background stroke-foreground" strokeWidth={2} />
      <circle cx={55} cy={bottom + 12} r={14} className="fill-destructive stroke-foreground" strokeWidth={2} />
      <rect x={50} y={y(v.value)} width={10} height={bottom + 12 - y(v.value)} className="fill-destructive" />
      {Array.from({ length: (v.max - v.min) / 5 + 1 }, (_, i) => {
        const t = v.min + i * 5;
        const major = t % 10 === 0;
        return (
          <g key={t}>
            <line x1={68} x2={major ? 82 : 76} y1={y(t)} y2={y(t)} className="stroke-foreground" strokeWidth={2} />
            {major && <text x={86} y={y(t) + 4} className="fill-foreground text-[11px]">{t}</text>}
          </g>
        );
      })}
    </svg>
  );
}

function CoordPlane({ v }: { v: Extract<Visual, { kind: "coordPlane" }> }) {
  const min = v.min ?? 0;
  const span = v.max - min;
  const s = min < 0 ? Math.max(22, Math.floor(440 / span)) : 44;
  const o = 30;
  const size = o * 2 + s * span;
  const px = (x: number) => o + (x - min) * s;
  const py = (y: number) => size - o - (y - min) * s;
  const label = (n: number) => (n < 0 ? `−${-n}` : n);
  // Id del recorte estable (sin hooks): un hash del contenido del plano.
  const clipId = `cp${[...JSON.stringify(v)].reduce((h, ch) => (Math.imul(h, 31) + ch.charCodeAt(0)) | 0, 7) >>> 0}`;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={min < 0 ? "size-80" : "size-72"}>
      {Array.from({ length: span + 1 }, (_, k) => {
        const i = min + k;
        return (
          <g key={i}>
            <line x1={px(i)} x2={px(i)} y1={py(min)} y2={py(v.max)} className="stroke-foreground/25" />
            <line x1={px(min)} x2={px(v.max)} y1={py(i)} y2={py(i)} className="stroke-foreground/25" />
            {(min === 0 || i !== 0) && (
              <>
                <text x={px(i)} y={py(0) + 18} textAnchor="middle" className={cn("fill-foreground", min < 0 ? "text-[11px]" : "text-[13px]")}>{label(i)}</text>
                <text x={px(0) - 12} y={py(i) + 4} textAnchor="middle" className={cn("fill-foreground", min < 0 ? "text-[11px]" : "text-[13px]")}>{label(i)}</text>
              </>
            )}
          </g>
        );
      })}
      <defs>
        <clipPath id={clipId}>
          <rect x={px(min)} y={py(v.max)} width={s * span} height={s * span} />
        </clipPath>
        <marker id={`${clipId}a0`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" className="fill-brand-green-text" />
        </marker>
        <marker id={`${clipId}a1`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" className="fill-sky-500" />
        </marker>
      </defs>
      {v.regions?.map((region, i) => (
        <polygon key={`r${i}`} clipPath={`url(#${clipId})`} points={region.points.map((p) => `${px(p.x)},${py(p.y)}`).join(" ")} className="fill-sky-400/25" />
      ))}
      <line x1={px(min)} x2={px(v.max)} y1={py(0)} y2={py(0)} className="stroke-foreground" strokeWidth={2} />
      <line x1={px(0)} x2={px(0)} y1={py(min)} y2={py(v.max)} className="stroke-foreground" strokeWidth={2} />
      {v.curves?.map((c, i) => (
        <g key={`c${i}`}>
          <polyline clipPath={`url(#${clipId})`} points={c.points.map((p) => `${px(p.x)},${py(p.y)}`).join(" ")} className={cn("fill-none", (c.color ?? (i === 0 ? "green" : "sky")) === "green" ? "stroke-brand-green-text" : "stroke-sky-500")} strokeWidth={3} strokeDasharray={c.dashed ? "8 5" : undefined} strokeLinejoin="round" strokeLinecap="round" />
          {c.label && (() => {
            const inside = c.points.filter((p) => p.x >= min && p.x <= v.max && p.y >= min && p.y <= v.max);
            const end = inside[inside.length - 1] ?? c.points[c.points.length - 1];
            return <text x={px(end.x) - 6} y={py(end.y) - 8} textAnchor="end" className={cn("text-[14px] font-medium", i === 0 ? "fill-brand-green-text" : "fill-sky-600")}>{c.label}</text>;
          })()}
        </g>
      ))}
      {v.shapes?.map((shape, i) => (
        <g key={`s${i}`}>
          <polygon
            points={shape.points.map((p) => `${px(p.x)},${py(p.y)}`).join(" ")}
            className={cn("stroke-foreground", shape.dashed ? "fill-sky-400/15" : "fill-brand-green/25")}
            strokeWidth={2}
            strokeDasharray={shape.dashed ? "6 4" : undefined}
          />
          {shape.label && (
            <text x={px(shape.points[0].x) - 8} y={py(shape.points[0].y) - 8} textAnchor="end" className="fill-foreground text-[15px] font-medium">
              {shape.label}
            </text>
          )}
        </g>
      ))}
      {v.lines?.map((l, i) => (
        <g key={`l${i}`}>
          <line
            clipPath={`url(#${clipId})`}
            x1={px(l.from.x)}
            y1={py(l.from.y)}
            x2={px(l.to.x)}
            y2={py(l.to.y)}
            className={(l.color ?? (i === 0 ? "green" : "sky")) === "green" ? "stroke-brand-green-text" : "stroke-sky-500"}
            strokeWidth={3}
            strokeDasharray={l.dashed ? "8 5" : undefined}
            strokeLinecap="round"
            markerEnd={l.arrow ? `url(#${clipId}a${(l.color ?? (i === 0 ? "green" : "sky")) === "green" ? 0 : 1})` : undefined}
          />
          {l.label && (
            <text x={px(l.to.x)} y={py(l.to.y) + (l.to.y > l.from.y ? 18 : -8)} textAnchor="middle" className={cn("text-[14px] font-medium", i === 0 ? "fill-brand-green-text" : "fill-sky-600")}>
              {l.label}
            </text>
          )}
        </g>
      ))}
      {v.connect && v.points.length > 1 && (
        <polyline points={[...v.points, ...(v.connect === "closed" ? [v.points[0]] : [])].map((p) => `${px(p.x)},${py(p.y)}`).join(" ")} className="fill-none stroke-brand-green-text" strokeWidth={3} strokeLinejoin="round" />
      )}
      {v.points.map((p, i) =>
        p.emoji === "•" ? (
          <circle key={i} cx={px(p.x)} cy={py(p.y)} r={7} className="fill-brand-green stroke-foreground" strokeWidth={2} />
        ) : /^[A-Z]$/.test(p.emoji) ? (
          <g key={i}>
            <circle cx={px(p.x)} cy={py(p.y)} r={6} className="fill-brand-green stroke-foreground" strokeWidth={2} />
            <text x={px(p.x) + 10} y={py(p.y) - 8} className="fill-foreground text-[17px] font-medium">{p.emoji}</text>
          </g>
        ) : (
          <text key={i} x={px(p.x)} y={py(p.y) + 8} textAnchor="middle" className="text-[24px]">{p.emoji}</text>
        )
      )}
      {v.openPoints?.map((p, i) => (
        <circle key={`o${i}`} cx={px(p.x)} cy={py(p.y)} r={6} className="fill-background stroke-foreground" strokeWidth={2} />
      ))}
    </svg>
  );
}

function ScatterPlot({ v }: { v: Extract<Visual, { kind: "scatterPlot" }> }) {
  const W = 420, H = 320, left = 52, bottom = 46, top = 16, right = 16;
  const px = (x: number) => left + (x / v.xMax) * (W - left - right);
  const py = (y: number) => H - bottom - (y / v.yMax) * (H - bottom - top);
  const ticks = (max: number, step: number) => Array.from({ length: Math.floor(max / step) + 1 }, (_, i) => i * step);
  return (
    <div className="flex flex-col items-center gap-1">
      {v.title && <p className="text-base font-medium">{v.title}</p>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md">
        {ticks(v.xMax, v.xStep).map((t) => (
          <g key={`x${t}`}>
            <line x1={px(t)} x2={px(t)} y1={py(0)} y2={py(v.yMax)} className="stroke-foreground/15" />
            <text x={px(t)} y={py(0) + 18} textAnchor="middle" className="fill-foreground text-[12px]">{t}</text>
          </g>
        ))}
        {ticks(v.yMax, v.yStep).map((t) => (
          <g key={`y${t}`}>
            <line x1={px(0)} x2={px(v.xMax)} y1={py(t)} y2={py(t)} className="stroke-foreground/15" />
            <text x={px(0) - 8} y={py(t) + 4} textAnchor="end" className="fill-foreground text-[12px]">{t}</text>
          </g>
        ))}
        <line x1={px(0)} x2={px(v.xMax)} y1={py(0)} y2={py(0)} className="stroke-foreground" strokeWidth={2} />
        <line x1={px(0)} x2={px(0)} y1={py(0)} y2={py(v.yMax)} className="stroke-foreground" strokeWidth={2} />
        <text x={(px(0) + px(v.xMax)) / 2} y={H - 6} textAnchor="middle" className="fill-foreground text-[13px]">{v.xLabel}</text>
        <text x={14} y={(py(0) + py(v.yMax)) / 2} textAnchor="middle" transform={`rotate(-90 14 ${(py(0) + py(v.yMax)) / 2})`} className="fill-foreground text-[13px]">{v.yLabel}</text>
        {v.line && <line x1={px(v.line.from.x)} y1={py(v.line.from.y)} x2={px(v.line.to.x)} y2={py(v.line.to.y)} className="stroke-sky-500" strokeWidth={3} strokeLinecap="round" />}
        {v.points.map((p, i) => (
          <circle key={i} cx={px(p.x)} cy={py(p.y)} r={5} className="fill-brand-green stroke-foreground" strokeWidth={1.5} />
        ))}
      </svg>
    </div>
  );
}

function CodeGrid({ v }: { v: Extract<Visual, { kind: "codeGrid" }> }) {
  const at = (list: { r: number; c: number }[] | undefined, r: number, c: number) => list?.some((p) => p.r === r && p.c === c);
  return (
    <div className="grid gap-1 rounded-xl border border-border p-2" style={{ gridTemplateColumns: `repeat(${v.size}, minmax(0, 1fr))` }}>
      {Array.from({ length: v.size * v.size }, (_, i) => {
        const r = Math.floor(i / v.size);
        const c = i % v.size;
        const mark = v.marks?.find((m) => m.r === r && m.c === c);
        const content =
          v.robot.r === r && v.robot.c === c
            ? "🤖"
            : v.goal && v.goal.r === r && v.goal.c === c
              ? "⭐"
              : at(v.walls, r, c)
                ? "🧱"
                : mark
                  ? mark.label
                  : at(v.path, r, c)
                    ? "•"
                    : "";
        return (
          <div
            key={i}
            className={cn(
              "flex size-11 items-center justify-center rounded-md border border-border text-2xl sm:size-12",
              at(v.path, r, c) && "bg-brand-green/20",
              mark && "font-medium"
            )}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}

const KEY_ROWS = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Borrar"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["Bloq Mayús", "a", "s", "d", "f", "g", "h", "j", "k", "l", "ñ", "Enter"],
  ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", "."],
  ["Espacio"],
];

function Keyboard({ highlight }: { highlight: string[] }) {
  return (
    <div className="flex w-full max-w-xl flex-col gap-1 rounded-xl border border-border p-2">
      {KEY_ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1">
          {row.map((key) => (
            <span
              key={key}
              className={cn(
                "flex h-8 min-w-6 items-center justify-center rounded-md border border-border px-1 text-xs sm:h-9 sm:min-w-8 sm:text-sm",
                key === "Espacio" && "w-48 sm:w-64",
                highlight.includes(key) && "border-brand-green bg-brand-green/40 font-medium"
              )}
            >
              {key.length === 1 ? key.toUpperCase() : key}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function Sheet({ v }: { v: Extract<Visual, { kind: "sheet" }> }) {
  const cols = Math.max(...v.cells.map((row) => row.length));
  const letter = (c: number) => String.fromCharCode(65 + c);
  return (
    <div className="max-w-full overflow-x-auto">
      <table className="border-collapse text-sm tabular-nums sm:text-base">
        <thead>
          <tr>
            <th className="border border-border bg-muted px-2 py-1" />
            {Array.from({ length: cols }, (_, c) => (
              <th key={c} className="border border-border bg-muted px-3 py-1 font-medium">{letter(c)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {v.cells.map((row, r) => (
            <tr key={r}>
              <th className="border border-border bg-muted px-2 py-1 font-medium">{r + 1}</th>
              {Array.from({ length: cols }, (_, c) => (
                <td
                  key={c}
                  className={cn(
                    "min-w-14 border border-border px-3 py-1 text-center",
                    v.highlight === `${letter(c)}${r + 1}` && "bg-brand-green/30 font-medium ring-2 ring-brand-green ring-inset"
                  )}
                >
                  {row[c] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- 4.° de primaria en adelante ----------------------------------------------

function DataTable({ v }: { v: Extract<Visual, { kind: "table" }> }) {
  return (
    <div className="flex max-w-full flex-col items-center gap-2 overflow-x-auto">
      {v.title && <p className="text-base font-medium">{v.title}</p>}
      <table className="border-collapse text-base tabular-nums">
        {v.headers && (
          <thead>
            <tr>
              {v.headers.map((h, i) => (
                <th key={i} className="border border-border-prominent bg-muted px-3 py-1.5 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {v.rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c} className={cn("border border-border-prominent px-3 py-1.5 text-center", cell === "?" && "bg-brand-green/25 font-medium")}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BarChart({ v }: { v: Extract<Visual, { kind: "barChart" }> }) {
  const W = 360;
  const H = 230;
  const left = 36;
  const bottom = 190;
  const top = 14;
  const y = (n: number) => bottom - (n / v.max) * (bottom - top);
  const slot = (W - left - 8) / v.bars.length;
  const cx = (i: number) => left + slot * (i + 0.5);
  const ticks: number[] = [];
  for (let n = 0; n <= v.max; n += v.step) ticks.push(n);
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-1">
      {v.title && <p className="text-base font-medium">{v.title}</p>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {ticks.map((n) => (
          <g key={n}>
            <line x1={left} x2={W - 4} y1={y(n)} y2={y(n)} className={n === 0 ? "stroke-foreground" : "stroke-foreground/20"} strokeWidth={n === 0 ? 2 : 1} />
            <text x={left - 6} y={y(n) + 4} textAnchor="end" className="fill-foreground text-[11px]">{n}</text>
          </g>
        ))}
        <line x1={left} x2={left} y1={top} y2={bottom} className="stroke-foreground" strokeWidth={2} />
        {v.line ? (
          <>
            <polyline points={v.bars.map((b, i) => `${cx(i)},${y(b.value)}`).join(" ")} className="fill-none stroke-brand-green-text" strokeWidth={2.5} />
            {v.legend && <polyline points={v.bars.map((b, i) => `${cx(i)},${y(b.value2 ?? 0)}`).join(" ")} className="fill-none stroke-sky-500" strokeWidth={2.5} strokeDasharray="6 4" />}
            {v.bars.map((b, i) => (
              <g key={i}>
                <circle cx={cx(i)} cy={y(b.value)} r={4.5} className="fill-brand-green stroke-foreground" strokeWidth={1.5} />
                {v.legend && <rect x={cx(i) - 4} y={y(b.value2 ?? 0) - 4} width={8} height={8} className="fill-sky-400 stroke-foreground" strokeWidth={1.5} />}
              </g>
            ))}
          </>
        ) : v.legend ? (
          v.bars.map((b, i) => (
            <g key={i}>
              <rect x={cx(i) - slot * 0.36} y={y(b.value)} width={slot * 0.36} height={bottom - y(b.value)} className="fill-brand-green/60 stroke-foreground" strokeWidth={1.5} />
              <rect x={cx(i)} y={y(b.value2 ?? 0)} width={slot * 0.36} height={bottom - y(b.value2 ?? 0)} className="fill-sky-400/70 stroke-foreground" strokeWidth={1.5} />
            </g>
          ))
        ) : (
          v.bars.map((b, i) => <rect key={i} x={cx(i) - slot * 0.3} y={y(b.value)} width={slot * 0.6} height={bottom - y(b.value)} className="fill-brand-green/60 stroke-foreground" strokeWidth={1.5} />)
        )}
        {v.bars.map((b, i) => (
          <text key={i} x={cx(i)} y={bottom + 16} textAnchor="middle" className="fill-foreground text-[11px]">{b.label}</text>
        ))}
      </svg>
      {v.legend && (
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm border border-foreground bg-brand-green/60" />{v.legend[0]}</span>
          <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm border border-foreground bg-sky-400/70" />{v.legend[1]}</span>
        </div>
      )}
    </div>
  );
}

// --- 6.° de primaria en adelante ----------------------------------------------

const PIE_FILLS = ["fill-brand-green/70", "fill-sky-400/70", "fill-amber-300/80", "fill-red-400/60", "fill-violet-400/60", "fill-zinc-400/50"];
const PIE_DOTS = ["bg-brand-green/70", "bg-sky-400/70", "bg-amber-300/80", "bg-red-400/60", "bg-violet-400/60", "bg-zinc-400/50"];

function CircleFigure({ v }: { v: Extract<Visual, { kind: "circle" }> }) {
  const part = v.part ?? "full";
  const [cx, cy, r] = part === "quarter" ? [30, 130, 100] : part === "semi" ? [80, 110, 70] : [80, 80, 66];
  const shape =
    part === "quarter" ? `M${cx} ${cy} L${cx + r} ${cy} A${r} ${r} 0 0 0 ${cx} ${cy - r} Z` : part === "semi" ? `M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy} Z` : "";
  const sector = (i: number, n: number) => {
    const p = (k: number) => `${cx + r * Math.cos((k / n) * 2 * Math.PI - Math.PI / 2)} ${cy + r * Math.sin((k / n) * 2 * Math.PI - Math.PI / 2)}`;
    return `M${cx} ${cy} L${p(i)} A${r} ${r} 0 0 1 ${p(i + 1)} Z`;
  };
  return (
    <svg viewBox="0 0 160 160" className="size-44">
      {part === "full" ? <circle cx={cx} cy={cy} r={r} className="fill-brand-green/20 stroke-foreground" strokeWidth={2} /> : <path d={shape} className="fill-brand-green/20 stroke-foreground" strokeWidth={2} />}
      {v.sectors && Array.from({ length: v.sectors }, (_, i) => <path key={i} d={sector(i, v.sectors!)} className={cn("stroke-foreground", i === 0 ? "fill-brand-green/60" : "fill-transparent")} strokeWidth={1.5} />)}
      {!v.sectors && <circle cx={cx} cy={cy} r={2.5} className="fill-foreground" />}
      {v.radius && (
        <>
          <line x1={cx} y1={cy} x2={cx + r} y2={cy} className="stroke-foreground" strokeWidth={2} />
          <text x={cx + r / 2} y={cy - 6} textAnchor="middle" className="fill-foreground text-[13px] font-medium">{v.radius}</text>
        </>
      )}
      {v.diameter && (
        <>
          <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} className="stroke-foreground" strokeWidth={2} />
          <text x={cx} y={part === "semi" ? cy + 16 : cy - 6} textAnchor="middle" className="fill-foreground text-[13px] font-medium">{v.diameter}</text>
        </>
      )}
    </svg>
  );
}

function Transversal({ v }: { v: Extract<Visual, { kind: "transversal" }> }) {
  // Paralelas en y = 60 e y = 130; la transversal sube hacia la derecha.
  const cross = (y: number) => 150 - (y - 20) * 0.55;
  const spots = [60, 130].flatMap((y, row) => {
    const x = cross(y);
    return [
      { n: row * 4 + 1, x: x - 20, y: y - 9 },
      { n: row * 4 + 2, x: x + 28, y: y - 9 },
      { n: row * 4 + 3, x: x - 28, y: y + 19 },
      { n: row * 4 + 4, x: x + 20, y: y + 19 },
    ];
  });
  return (
    <svg viewBox="0 0 220 190" className="h-48 w-56">
      <line x1={14} x2={206} y1={60} y2={60} className="stroke-foreground" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={14} x2={206} y1={130} y2={130} className="stroke-foreground" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={cross(176)} y1={176} x2={cross(14)} y2={14} className="stroke-brand-green" strokeWidth={2.5} strokeLinecap="round" />
      {spots.map((s) => (
        <text key={s.n} x={s.x} y={s.y} textAnchor="middle" className={cn("text-[13px] font-medium", v.given?.angle === s.n ? "fill-brand-green" : "fill-foreground")}>
          {v.given?.angle === s.n ? v.given.text : s.n}
        </text>
      ))}
    </svg>
  );
}

function PieChart({ v }: { v: Extract<Visual, { kind: "pie" }> }) {
  const total = v.slices.reduce((s, x) => s + x.value, 0) || 1;
  const point = (fraction: number, r: number) => {
    const a = fraction * 2 * Math.PI - Math.PI / 2;
    return [100 + r * Math.cos(a), 100 + r * Math.sin(a)];
  };
  const starts = v.slices.map((_, i) => v.slices.slice(0, i).reduce((s, x) => s + x.value, 0) / total);
  return (
    <div className="flex flex-col items-center gap-2">
      {v.title && <p className="text-base font-medium">{v.title}</p>}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <svg viewBox="0 0 200 200" className="size-48">
          {v.slices.map((slice, i) => {
            const start = starts[i];
            const end = start + slice.value / total;
            const [x0, y0] = point(start, 90);
            const [x1, y1] = point(end, 90);
            const [tx, ty] = point((start + end) / 2, 58);
            return (
              <g key={i}>
                <path d={`M100 100 L${x0} ${y0} A90 90 0 ${end - start > 0.5 ? 1 : 0} 1 ${x1} ${y1} Z`} className={cn("stroke-foreground", PIE_FILLS[i % PIE_FILLS.length])} strokeWidth={1.5} />
                <text x={tx} y={ty + 4} textAnchor="middle" className="fill-foreground text-[12px] font-medium">{slice.value}%</text>
              </g>
            );
          })}
        </svg>
        <ul className="flex flex-col gap-1 text-sm">
          {v.slices.map((slice, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className={cn("size-3 rounded-sm border border-foreground", PIE_DOTS[i % PIE_DOTS.length])} />
              {slice.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function BoxPlot({ v }: { v: Extract<Visual, { kind: "boxPlot" }> }) {
  const W = 420;
  const pad = 24;
  const x = (n: number) => pad + ((n - v.axisMin) / (v.axisMax - v.axisMin)) * (W - pad * 2);
  const ticks: number[] = [];
  for (let n = v.axisMin; n <= v.axisMax; n += v.step) ticks.push(n);
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-1">
      {v.title && <p className="text-base font-medium">{v.title}</p>}
      <svg viewBox={`0 0 ${W} 120`} className="w-full">
        <line x1={x(v.min)} x2={x(v.q1)} y1={40} y2={40} className="stroke-foreground" strokeWidth={2} />
        <line x1={x(v.q3)} x2={x(v.max)} y1={40} y2={40} className="stroke-foreground" strokeWidth={2} />
        <line x1={x(v.min)} x2={x(v.min)} y1={28} y2={52} className="stroke-foreground" strokeWidth={2} />
        <line x1={x(v.max)} x2={x(v.max)} y1={28} y2={52} className="stroke-foreground" strokeWidth={2} />
        <rect x={x(v.q1)} y={20} width={x(v.q3) - x(v.q1)} height={40} className="fill-brand-green/40 stroke-foreground" strokeWidth={2} />
        <line x1={x(v.median)} x2={x(v.median)} y1={20} y2={60} className="stroke-foreground" strokeWidth={3} />
        <line x1={pad - 8} x2={W - pad + 8} y1={88} y2={88} className="stroke-foreground" strokeWidth={2} />
        {ticks.map((n) => (
          <g key={n}>
            <line x1={x(n)} x2={x(n)} y1={83} y2={93} className="stroke-foreground" strokeWidth={2} />
            <text x={x(n)} y={110} textAnchor="middle" className="fill-foreground text-[12px]">{n}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function LinePlot({ v }: { v: Extract<Visual, { kind: "linePlot" }> }) {
  const n = v.labels.length;
  const W = 400;
  const pad = 30;
  const tall = Math.max(1, ...v.counts);
  const base = 24 + tall * 20;
  const x = (i: number) => (n === 1 ? W / 2 : pad + (i / (n - 1)) * (W - pad * 2));
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-1">
      {v.title && <p className="text-base font-medium">{v.title}</p>}
      <svg viewBox={`0 0 ${W} ${base + 30}`} className="w-full">
        <line x1={pad - 16} x2={W - pad + 16} y1={base} y2={base} className="stroke-foreground" strokeWidth={2} />
        {v.labels.map((label, i) => (
          <g key={i}>
            <line x1={x(i)} x2={x(i)} y1={base - 5} y2={base + 5} className="stroke-foreground" strokeWidth={2} />
            <text x={x(i)} y={base + 22} textAnchor="middle" className="fill-foreground text-[13px]">{label}</text>
            {Array.from({ length: v.counts[i] }, (_, k) => (
              <text key={k} x={x(i)} y={base - 8 - k * 20} textAnchor="middle" className="fill-brand-green-text text-[18px] font-bold">✕</text>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

function AreaModel({ v }: { v: Extract<Visual, { kind: "areaModel" }> }) {
  return (
    <div className="grid max-w-full items-center gap-1 text-base tabular-nums" style={{ gridTemplateColumns: `auto repeat(${v.top.length}, minmax(4.5rem, auto))` }}>
      <span />
      {v.top.map((t, i) => (
        <span key={i} className="text-center font-medium">{t}</span>
      ))}
      {v.side.map((sLabel, r) => (
        <div key={r} className="contents">
          <span className="pr-2 text-right font-medium">{sLabel}</span>
          {v.top.map((_, c) => (
            <span key={c} className={cn("flex h-14 items-center justify-center border-2 border-foreground px-2", v.cells[r]?.[c] === "?" ? "bg-brand-green/50 font-medium" : "bg-brand-green/15")}>
              {v.cells[r]?.[c] ?? ""}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function Strip({ v }: { v: Extract<Visual, { kind: "strip" }> }) {
  return (
    <div className="flex w-full max-w-md flex-col gap-2 text-base tabular-nums">
      {v.total && (
        <div className="flex flex-col items-center">
          <span className="font-medium">{v.total}</span>
          <div className="h-2 w-full rounded-t-md border-x-2 border-t-2 border-foreground" />
        </div>
      )}
      {v.bars.map((bar, i) => (
        <div key={i} className="flex items-center gap-2">
          {bar.label && <span className="w-16 shrink-0 text-sm">{bar.label}</span>}
          <div className="flex h-11 flex-1">
            {bar.parts.map((part, k) => (
              <div
                key={k}
                className={cn("flex items-center justify-center border-2 border-foreground px-1", k > 0 && "border-l-0", part.text === "?" ? "bg-brand-green/50 font-medium" : part.text === "" ? "border-transparent" : "bg-brand-green/15")}
                style={{ flexGrow: part.w, flexBasis: 0 }}
              >
                {part.text}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function GeoFigure({ figure, rotation = 0, labels = ["A", "B", "C"] }: Omit<Extract<Visual, { kind: "geoFigure" }>, "kind">) {
  const dot = (cx: number, cy: number, label: string) => (
    <g>
      <circle cx={cx} cy={cy} r={4} className="fill-foreground" />
      <text x={cx} y={cy - 10} textAnchor="middle" transform={`rotate(${-rotation} ${cx} ${cy - 14})`} className="fill-foreground text-[13px] font-medium">{label}</text>
    </g>
  );
  const arrow = (x: number, y: number, dir: 1 | -1) => <path d={`M${x} ${y} l${-9 * dir} -6 v12 z`} className="fill-foreground" />;
  return (
    <svg viewBox="0 -45 200 200" className="size-52">
      <g transform={`rotate(${rotation} 100 60)`}>
      {figure === "punto" && dot(100, 60, labels[0])}
      {figure !== "punto" && figure !== "angulo" && (
        <>
          <line x1={figure === "recta" ? 14 : 50} x2={figure === "segmento" ? 150 : 186} y1={60} y2={60} className="stroke-foreground" strokeWidth={3} />
          {figure === "recta" && arrow(8, 60, -1)}
          {figure !== "segmento" && arrow(192, 60, 1)}
          {dot(50, 60, labels[0])}
          {dot(150, 60, labels[1])}
        </>
      )}
      {figure === "angulo" && (
        <>
          <line x1={40} y1={90} x2={180} y2={90} className="stroke-foreground" strokeWidth={3} />
          <line x1={40} y1={90} x2={140} y2={20} className="stroke-foreground" strokeWidth={3} />
          {arrow(186, 90, 1)}
          <path d="M70 90 A30 30 0 0 0 64.6 72.8" className="fill-none stroke-brand-green" strokeWidth={2.5} />
          {dot(40, 90, labels[1])}
          {dot(150, 90, labels[2])}
          {dot(108, 42, labels[0])}
        </>
      )}
      </g>
    </svg>
  );
}

// --- 5.° de primaria en adelante ----------------------------------------------

// Cubos unitarios en perspectiva isométrica; se dibujan de atrás hacia adelante.
function Cubes3d({ heights }: { heights: number[][] }) {
  const rows = heights.length;
  const cols = Math.max(...heights.map((row) => row.length));
  const top = Math.max(1, ...heights.flat());
  const u = 22;
  const hx = u * 0.87;
  const hy = u * 0.5;
  const ox = rows * hx + 4;
  const oy = top * u + 4;
  const at = (r: number, c: number, z: number): [number, number] => [ox + (c - r) * hx, oy + (c + r) * hy - z * u];
  const cubes: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      for (let z = 0; z < (heights[r][c] ?? 0); z++) {
        const [x, y] = at(r, c, z + 1);
        const pts = (list: [number, number][]) => list.map((p) => p.join(",")).join(" ");
        // Cada cara lleva debajo un fondo opaco: así no se transparentan los cubos de atrás.
        const face = (list: [number, number][], tint: string) => (
          <>
            <polygon points={pts(list)} className="fill-background" />
            <polygon points={pts(list)} className={tint} />
          </>
        );
        cubes.push(
          <g key={`${r}-${c}-${z}`} className="stroke-foreground" strokeWidth={1.2} strokeLinejoin="round">
            {face([[x, y], [x + hx, y + hy], [x, y + 2 * hy], [x - hx, y + hy]], "fill-brand-green/30")}
            {face([[x - hx, y + hy], [x, y + 2 * hy], [x, y + 2 * hy + u], [x - hx, y + hy + u]], "fill-brand-green/80")}
            {face([[x + hx, y + hy], [x, y + 2 * hy], [x, y + 2 * hy + u], [x + hx, y + hy + u]], "fill-brand-green/55")}
          </g>
        );
      }
  const W = (rows + cols) * hx + 8;
  const H = top * u + (rows + cols) * hy + 8;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="max-h-60 w-full max-w-xs" style={{ aspectRatio: `${W} / ${H}` }}>
      {cubes}
    </svg>
  );
}

function FracGrid({ v }: { v: Extract<Visual, { kind: "fracGrid" }> }) {
  const cell = Math.min(44, Math.floor(220 / Math.max(v.rows, v.cols)));
  return (
    <svg viewBox={`-1 -1 ${v.cols * cell + 2} ${v.rows * cell + 2}`} style={{ width: v.cols * cell + 2, height: v.rows * cell + 2 }} className="max-w-full">
      {Array.from({ length: v.rows * v.cols }, (_, i) => {
        const r = Math.floor(i / v.cols);
        const c = i % v.cols;
        const inA = c < v.a;
        const inB = r < v.b;
        return <rect key={i} x={c * cell} y={r * cell} width={cell} height={cell} className={cn("stroke-foreground/50", inA && inB ? "fill-brand-green" : inA ? "fill-sky-400/40" : inB ? "fill-amber-300/50" : "fill-background")} strokeWidth={1} />;
      })}
      <rect x={0} y={0} width={v.cols * cell} height={v.rows * cell} className="fill-none stroke-foreground" strokeWidth={2} />
    </svg>
  );
}

export function VisualView({ visual }: { visual: Visual }) {
  switch (visual.kind) {
    case "text":
      return (
        <p
          className={cn(
            "whitespace-pre-wrap text-center text-base font-medium tabular-nums"
          )}
        >
          {visual.text}
        </p>
      );
    case "objects":
      return (
        <div className="flex max-w-md flex-wrap justify-center gap-2 text-4xl">
          {Array.from({ length: visual.count }, (_, i) => (
            <span key={i} className="flex flex-col items-center">
              {visual.emoji}
              {visual.numbered && <span className="text-base font-medium tabular-nums">{i + 1}</span>}
            </span>
          ))}
        </div>
      );
    case "groups":
      return (
        <div className="flex flex-wrap items-center justify-center gap-4 text-4xl">
          {[visual.a, visual.b].map((n, gi) => (
            <div key={gi} className="flex items-center gap-4">
              {gi === 1 && <span className="text-3xl font-medium">+</span>}
              <span className="flex max-w-44 flex-wrap justify-center gap-1 rounded-2xl border border-border p-3">
                {Array.from({ length: n }, (_, i) => <span key={i}>{visual.emoji}</span>)}
              </span>
            </div>
          ))}
        </div>
      );
    case "takeaway":
      return (
        <div className="flex max-w-md flex-wrap justify-center gap-2 text-4xl">
          {Array.from({ length: visual.total }, (_, i) => (
            <span key={i} className={cn("relative", i >= visual.total - visual.removed && "opacity-30")}>
              {visual.emoji}
              {i >= visual.total - visual.removed && <span className="absolute inset-0 text-center text-destructive">✕</span>}
            </span>
          ))}
        </div>
      );
    case "numberLine":
      return <NumberLine v={visual} />;
    case "fractionLine":
      return <FractionLine v={visual} />;
    case "fractionLines":
      return (
        <div className="flex w-full flex-col items-center gap-1">
          {visual.lines.map((line, i) => (
            <FractionLine key={i} v={{ kind: "fractionLine", parts: line.parts, marked: line.marked, title: line.title }} />
          ))}
        </div>
      );
    case "fractionPair":
      return (
        <div className="flex flex-col items-center gap-3">
          {visual.items.map((it, i) => (
            <div key={i} className="flex items-center gap-3">
              <EqualWidthBar parts={it.parts} shaded={it.shaded} />
              {!visual.hideLabels && <span className="w-12 text-xl font-medium tabular-nums">{i === 0 || visual.showAll ? `${it.shaded}/${it.parts}` : `?/${it.parts}`}</span>}
            </div>
          ))}
        </div>
      );
    case "array":
      return (
        <div className="grid gap-1 text-3xl" style={{ gridTemplateColumns: `repeat(${visual.cols}, minmax(0, 1fr))` }}>
          {Array.from({ length: visual.rows * visual.cols }, (_, i) => (
            <span key={i} className="flex size-11 items-center justify-center">{visual.emoji}</span>
          ))}
        </div>
      );
    case "equalGroups":
      return (
        <div className="flex max-w-xl flex-wrap justify-center gap-3 text-3xl">
          {Array.from({ length: visual.groups }, (_, g) => (
            <span key={g} className="flex max-w-36 flex-wrap justify-center gap-1 rounded-2xl border border-border p-3">
              {Array.from({ length: visual.each }, (_, i) => <span key={i}>{visual.emoji}</span>)}
            </span>
          ))}
        </div>
      );
    case "decimalGrid":
      return <DecimalGrid hundredths={visual.hundredths} extra={visual.extra} crossed={visual.crossed} />;
    case "table":
      return <DataTable v={visual} />;
    case "barChart":
      return <BarChart v={visual} />;
    case "linePlot":
      return <LinePlot v={visual} />;
    case "areaModel":
      return <AreaModel v={visual} />;
    case "strip":
      return <Strip v={visual} />;
    case "pie":
      return <PieChart v={visual} />;
    case "circle":
      return <CircleFigure v={visual} />;
    case "transversal":
      return <Transversal v={visual} />;
    case "boxPlot":
      return <BoxPlot v={visual} />;
    case "cubes3d":
      return <Cubes3d heights={visual.heights} />;
    case "fracGrid":
      return <FracGrid v={visual} />;
    case "geoFigure":
      return <GeoFigure figure={visual.figure} rotation={visual.rotation} labels={visual.labels} />;
    case "lines":
      return <LinesPair v={visual} />;
    case "angle":
      return <AngleFigure v={visual} />;
    case "polygon":
      return <PolygonFigure v={visual} />;
    case "frame":
      return (
        <div className="flex flex-wrap justify-center gap-3">
          {visual.counts.map((c, i) => <Frame key={i} size={visual.size} count={c} />)}
        </div>
      );
    case "cubes":
      return <Cubes v={visual} />;
    case "scatter":
      return <Scatter v={visual} />;
    case "rows":
      return (
        <div className="flex flex-col gap-2">
          {visual.rows.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              {row.label !== undefined && <span className="w-16 text-right text-sm font-medium">{row.label}</span>}
              <div className="flex max-w-[25rem] flex-wrap text-3xl">
                {Array.from({ length: row.count }, (_, k) => <span key={k} className="w-10 text-center">{row.emoji}</span>)}
              </div>
            </div>
          ))}
        </div>
      );
    case "box":
      return (
        <div className="flex items-center gap-4 text-4xl">
          <div className="flex min-h-24 min-w-28 flex-wrap items-center justify-center gap-2 rounded-xl border-4 border-foreground p-3">
            {visual.inside.map((e, i) => <span key={i}>{e}</span>)}
          </div>
          {visual.outside.map((e, i) => <span key={i}>{e}</span>)}
        </div>
      );
    case "venn":
      return <Venn v={visual} />;
    case "clock":
      return <Clock hour={visual.hour} minute={visual.minute} />;
    case "coins":
      return <Coins coins={visual.coins} />;
    case "splitShape":
      return <SplitShape v={visual} />;
    case "net":
      return <Net name={visual.name} />;
    case "codeGrid":
      return <CodeGrid v={visual} />;
    case "keyboard":
      return <Keyboard highlight={visual.highlight} />;
    case "sheet":
      return <Sheet v={visual} />;
    case "scratch":
      return (
        <div className="flex flex-col items-center gap-3">
          {visual.title && <p className="whitespace-pre-line text-center text-base">{visual.title}</p>}
          <ScratchBlocks code={visual.code} scale={0.95} />
        </div>
      );
    case "code":
      return (
        <div className="flex w-full max-w-xl flex-col items-center gap-2">
          {visual.title && <p className="whitespace-pre-line text-center text-base">{visual.title}</p>}
          <pre className="w-full overflow-x-auto rounded-xl border border-border bg-muted/50 p-4 text-left font-mono text-sm leading-relaxed">
            {visual.text}
          </pre>
        </div>
      );
    case "picture":
      return (
        <div className="flex flex-col items-center gap-2">
          <span className="whitespace-pre-line text-center text-7xl leading-none">{visual.emoji}</span>
          {visual.caption && <span className="whitespace-pre-line text-center text-base font-medium">{visual.caption}</span>}
        </div>
      );
    case "passage":
      return (
        <div className="flex w-full max-w-xl flex-col gap-2 rounded-2xl border border-border p-4 text-left">
          {(visual.emoji || visual.title) && (
            <p className="flex items-center gap-2 text-base font-medium">
              {visual.emoji && <span className="text-3xl">{visual.emoji}</span>}
              {visual.title}
            </p>
          )}
          {visual.text.split("\n").map((para, i) => (
            <p key={i} className="text-base leading-relaxed">{para}</p>
          ))}
        </div>
      );
    case "hundredsChart": {
      const blank = new Set(visual.blank);
      return (
        <div className="grid grid-cols-10 gap-px overflow-hidden rounded-lg border border-border bg-border text-xs tabular-nums sm:text-sm">
          {Array.from({ length: visual.max ?? 100 }, (_, i) => i + 1).map((n) => (
            <div
              key={n}
              className={cn(
                "flex size-7 items-center justify-center bg-background sm:size-9",
                n === visual.highlight && "bg-brand-green/40 font-bold",
                blank.has(n) && n !== visual.highlight && "bg-muted"
              )}
            >
              {blank.has(n) ? (n === visual.highlight ? "?" : "") : n}
            </div>
          ))}
        </div>
      );
    }
    case "placeValue":
      return (
        <div className="flex flex-wrap items-end justify-center gap-6">
          {!!visual.thousands && (
            <div className="flex items-end gap-2">
              {Array.from({ length: visual.thousands }, (_, i) => (
                <div key={i} className="grid size-16 grid-cols-5 grid-rows-5 overflow-hidden rounded-sm border-2 border-foreground bg-brand-green/70">
                  {Array.from({ length: 25 }, (_, j) => <div key={j} className="border border-foreground/30" />)}
                </div>
              ))}
            </div>
          )}
          {!!visual.hundreds && (
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: visual.hundreds }, (_, i) => (
                <div key={i} className="grid size-14 grid-cols-10 grid-rows-10 overflow-hidden rounded-sm border-2 border-foreground bg-brand-green/40">
                  {Array.from({ length: 100 }, (_, j) => <div key={j} className="border-[0.5px] border-foreground/20" />)}
                </div>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2">
            {Array.from({ length: visual.tens }, (_, i) => (
              <div key={i} className="grid h-24 w-4 grid-rows-10 overflow-hidden rounded-sm border-2 border-foreground bg-brand-green/40">
                {Array.from({ length: 10 }, (_, j) => <div key={j} className="border-b border-foreground/40 last:border-b-0" />)}
              </div>
            ))}
          </div>
          <div className="grid max-w-24 grid-cols-3 gap-1">
            {Array.from({ length: visual.ones }, (_, i) => (
              <div key={i} className="size-6 rounded-sm border-2 border-foreground bg-brand-green/40" />
            ))}
          </div>
        </div>
      );
    case "fraction":
      if (visual.shape === "circle") return <Pie parts={visual.parts} shaded={visual.shaded} />;
      return <FractionCells parts={visual.parts} shape={visual.shape} shaded={(i) => i < visual.shaded} />;
    case "fractionGroup":
      return (
        <div className="flex max-w-md flex-wrap justify-center gap-2 text-4xl">
          {Array.from({ length: visual.total }, (_, i) => (
            <span key={i} className={cn("rounded-lg p-1", i < visual.highlighted ? "bg-brand-green/40 ring-2 ring-foreground" : "opacity-60")}>
              {visual.emoji}
            </span>
          ))}
        </div>
      );
    case "measureObjects":
      return (
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center rounded-lg border-2 border-foreground px-1 text-4xl" style={{ width: `${visual.count * 2.5}rem` }}>
            {visual.itemEmoji}
          </div>
          <div className="flex text-3xl">
            {Array.from({ length: visual.count }, (_, i) => (
              <span key={i} className="w-10 text-center">{visual.unitEmoji}</span>
            ))}
          </div>
        </div>
      );
    case "ruler":
      return <Ruler length={visual.length} unit={visual.unit} sub={visual.sub} />;
    case "thermometer":
      return <Thermometer v={visual} />;
    case "lengthBars":
      return (
        <div className="flex w-full max-w-md flex-col gap-3">
          {[["A", visual.a], ["B", visual.b]].map(([label, n]) => (
            <div key={label} className="flex items-center gap-3">
              <span className="w-4 font-medium">{label}</span>
              <div className="h-6 rounded bg-brand-green/50 ring-2 ring-foreground" style={{ width: `${Number(n) * 9}%` }} />
            </div>
          ))}
        </div>
      );
    case "gridObjects":
      return (
        <div className="grid text-2xl" style={{ gridTemplateColumns: `repeat(${visual.size + 1}, 3rem)` }}>
          <div />
          {Array.from({ length: visual.size }, (_, c) => (
            <div key={c} className="flex h-8 items-center justify-center text-sm text-muted-foreground">col {c + 1}</div>
          ))}
          {Array.from({ length: visual.size }, (_, r) => (
            <div key={r} className="contents">
              <div className="flex items-center justify-end pr-2 text-sm text-muted-foreground">fila {r + 1}</div>
              {Array.from({ length: visual.size }, (_, c) => (
                <div key={c} className="flex size-12 items-center justify-center border border-border">
                  {visual.cells.find((cell) => cell.r === r + 1 && cell.c === c + 1)?.emoji}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    case "stack":
      return (
        <div className="flex flex-col overflow-hidden rounded-lg border-2 border-foreground">
          {visual.items.map((e, i) => (
            <div key={i} className="flex size-14 items-center justify-center border-b border-border text-3xl last:border-b-0">{e}</div>
          ))}
        </div>
      );
    case "coordPlane":
      return <CoordPlane v={visual} />;
    case "scatterPlot":
      return <ScatterPlot v={visual} />;
    case "shapes":
      return <Labeled names={visual.names} render={(n) => <Shape2d name={n} />} />;
    case "solids":
      return <Labeled names={visual.names} render={(n) => <Solid name={n} />} />;
    case "pattern":
      return (
        <div className="flex flex-wrap items-center justify-center gap-2 text-4xl">
          {visual.items.map((e, i) => (
            <span key={i} className={cn("flex size-12 items-center justify-center", e === "?" && "rounded-lg border-2 border-dashed border-foreground text-2xl")}>{e}</span>
          ))}
        </div>
      );
    case "bag":
      return (
        <div className="flex max-w-md flex-wrap justify-center gap-2 rounded-2xl border-2 border-foreground p-4 text-3xl">
          {visual.items.flatMap((it) => Array.from({ length: it.count }, (_, i) => <span key={`${it.emoji}${i}`}>{it.emoji}</span>))}
        </div>
      );
  }
}
