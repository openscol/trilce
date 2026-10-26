"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BellRingIcon, MaximizeIcon, MicIcon, MicOffIcon, RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// Semáforo de ruido: escucha el aula con el micrófono y avisa cuando el ruido
// pasa el límite durante unos segundos. Todo ocurre en el navegador: el audio
// no se graba ni se envía a ningún lado.

type Sound = "bell" | "beep" | "chime" | "school" | "file" | "none";

type Settings = {
  thr: number; // límite, 0–100
  hold: number; // segundos sobre el límite antes de avisar
  cool: number; // segundos mínimos entre alertas
  sens: number; // dB que se suman a la lectura
  snd: Sound;
  vol: number; // 0–100
  msg: string;
  flash: boolean;
  mic: string;
};

const DEFAULTS: Settings = { thr: 65, hold: 2, cool: 10, sens: 0, snd: "bell", vol: 60, msg: "¡Bajemos la voz, por favor!", flash: true, mic: "" };

// Ajustes y sonido propio: comodidades de este navegador (localStorage).
const SETTINGS_KEY = "trilce.semaforo";
const FILE_KEY = "trilce.semaforo.sonido";
const MAX_FILE_BYTES = 1_500_000;
// Si el colegio deja un alarm.wav en public/sounds, aparece como opción.
const SCHOOL_SOUND = "/sounds/alarm.wav";

const TICK_MS = 50;
const HISTORY = 1200; // 60 s a una muestra cada 50 ms

type Light = "green" | "yellow" | "red" | null;

const LIGHT_COLOR = { red: "bg-badge-vencido", yellow: "bg-badge-pendiente", green: "bg-badge-pagado" } as const;
const LIGHT_TEXT: Record<Exclude<Light, null>, string> = { green: "Nivel adecuado", yellow: "Cerca del límite", red: "Demasiado ruido" };

function loadSettings(): Settings {
  try {
    return { ...DEFAULTS, ...JSON.parse(window.localStorage.getItem(SETTINGS_KEY) ?? "{}") };
  } catch {
    return DEFAULTS;
  }
}

function loadStoredFile(): { name: string; data: string } | null {
  try {
    const raw = window.localStorage.getItem(FILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function playFrom(player: HTMLAudioElement, volume: number) {
  player.pause();
  player.currentTime = 0;
  player.volume = volume;
  return player.play();
}

function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function NoiseMeter() {
  const [s, setS] = useState<Settings>(loadSettings);
  const [listening, setListening] = useState(false);
  const [micLabel, setMicLabel] = useState("");
  const [mics, setMics] = useState<{ id: string; label: string }[]>([]);
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>({ text: "Conecta tu micrófono, pulsa «Empezar a escuchar» y acepta el permiso del navegador. Después puedes elegir el micrófono en los ajustes.", error: false });
  const [view, setView] = useState({ level: 0, smooth: 0, over: 0, light: null as Light });
  const [stats, setStats] = useState({ alerts: 0, peak: 0, avg: 0 });
  const [overlay, setOverlay] = useState(false);
  const [schoolSound, setSchoolSound] = useState(false);
  const [stored] = useState(loadStoredFile);
  const [fileName, setFileName] = useState<string | null>(stored?.name ?? null);

  const settings = useRef(s);
  const audio = useRef<{ ctx: AudioContext | null; analyser: AnalyserNode | null; src: MediaStreamAudioSourceNode | null; stream: MediaStream | null; buf: Float32Array<ArrayBuffer> | null; timer: number | null; wake: WakeLockSentinel | null }>({ ctx: null, analyser: null, src: null, stream: null, buf: null, timer: null, wake: null });
  const meter = useRef({ smooth: 0, overTime: 0, lastAlert: -1e9, alerts: 0, peak: 0, history: [] as number[] });
  const players = useRef<{ school: HTMLAudioElement | null; file: HTMLAudioElement | null }>({ school: null, file: stored ? new Audio(stored.data) : null });
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const hideOverlay = useRef<number | null>(null);

  // Si el colegio dejó un alarm.wav en public/sounds, se ofrece como sonido.
  useEffect(() => {
    const school = new Audio(SCHOOL_SOUND);
    school.preload = "auto";
    const ready = () => {
      players.current.school = school;
      setSchoolSound(true);
    };
    school.addEventListener("canplaythrough", ready);
    return () => school.removeEventListener("canplaythrough", ready);
  }, []);

  const update = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setS((prev) => {
      const next = { ...prev, [key]: value };
      settings.current = next;
      try {
        window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      } catch {
        // Los ajustes solo duran esta visita.
      }
      return next;
    });
  }, []);

  // --- Sonido de alerta -------------------------------------------------------
  const playSound = useCallback(() => {
    const { snd, vol } = settings.current;
    if (snd === "none" || vol === 0) return;
    const player = snd === "school" ? players.current.school : snd === "file" ? players.current.file : null;
    if (player) {
      playFrom(player, vol / 100).catch(() => setNotice({ text: "El navegador bloqueó el sonido. Pulsa «Probar alerta» una vez para activarlo.", error: true }));
      return;
    }
    const a = audio.current;
    a.ctx ??= new AudioContext();
    const ctx = a.ctx;
    if (ctx.state === "suspended") void ctx.resume();
    const peakGain = (vol / 100) * 0.6;
    const tone = (freq: number, t0: number, dur: number, type: OscillatorType) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      const t = ctx.currentTime + t0;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peakGain, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + dur + 0.05);
    };
    if (snd === "beep") [0, 0.3, 0.6].forEach((t) => tone(880, t, 0.2, "square"));
    else if (snd === "chime") {
      tone(523, 0, 0.6, "sine");
      tone(659, 0.25, 0.6, "sine");
      tone(784, 0.5, 1.0, "sine");
    } else {
      tone(660, 0, 1.6, "sine");
      tone(990, 0, 1.2, "sine");
      tone(660, 0.9, 1.6, "sine");
    }
  }, []);

  const alertNow = useCallback(() => {
    playSound();
    if (!settings.current.flash) return;
    setOverlay(true);
    if (hideOverlay.current) window.clearTimeout(hideOverlay.current);
    hideOverlay.current = window.setTimeout(() => setOverlay(false), 4000);
  }, [playSound]);

  // --- Gráfico del último minuto ---------------------------------------------
  const drawHistory = useCallback(() => {
    const cv = canvas.current;
    if (!cv) return;
    const g = cv.getContext("2d");
    if (!g) return;
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    if (cv.width !== Math.round(w * dpr)) {
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
    }
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    g.strokeStyle = cssVar("--border-subtle");
    g.lineWidth = 1;
    for (const v of [25, 50, 75]) {
      const y = h - (v / 100) * h;
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y);
      g.stroke();
    }
    const hist = meter.current.history;
    const step = w / (HISTORY - 1);
    const x = (i: number) => w - (hist.length - 1 - i) * step;
    const y = (v: number) => h - (v / 100) * h;
    if (hist.length > 1) {
      const green = cssVar("--brand-green-text");
      g.beginPath();
      hist.forEach((v, i) => (i ? g.lineTo(x(i), y(v)) : g.moveTo(x(i), y(v))));
      g.lineTo(w, h);
      g.lineTo(x(0), h);
      g.closePath();
      g.fillStyle = green;
      g.globalAlpha = 0.15;
      g.fill();
      g.globalAlpha = 1;
      g.beginPath();
      hist.forEach((v, i) => (i ? g.lineTo(x(i), y(v)) : g.moveTo(x(i), y(v))));
      g.strokeStyle = green;
      g.lineWidth = 2;
      g.stroke();
    }
    g.setLineDash([6, 5]);
    g.strokeStyle = cssVar("--badge-vencido");
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(0, y(settings.current.thr));
    g.lineTo(w, y(settings.current.thr));
    g.stroke();
    g.setLineDash([]);
  }, []);

  useEffect(() => {
    drawHistory();
    window.addEventListener("resize", drawHistory);
    return () => window.removeEventListener("resize", drawHistory);
  }, [drawHistory, s.thr]);

  // --- Micrófono ---------------------------------------------------------------
  const tick = useCallback(() => {
    const { analyser, buf } = audio.current;
    if (!analyser || !buf) return;
    const cfg = settings.current;
    const m = meter.current;

    analyser.getFloatTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
    // dBFS: -70 (silencio) a 0 (máximo), llevado a 0–100.
    const db = 20 * Math.log10(Math.sqrt(sum / buf.length) + 1e-9) + cfg.sens;
    const raw = Math.max(0, Math.min(100, ((db + 70) / 70) * 100));

    // Sube rápido y baja despacio, para que se pueda leer.
    m.smooth += (raw - m.smooth) * (raw > m.smooth ? 0.35 : 0.08);
    m.peak = Math.max(m.peak, Math.round(m.smooth));
    m.history.push(m.smooth);
    if (m.history.length > HISTORY) m.history.shift();

    const over = m.smooth >= cfg.thr;
    m.overTime = over ? m.overTime + TICK_MS / 1000 : Math.max(0, m.overTime - TICK_MS / 500);
    const now = performance.now();
    if (m.overTime >= cfg.hold && now - m.lastAlert >= cfg.cool * 1000) {
      m.lastAlert = now;
      m.overTime = 0;
      m.alerts++;
      alertNow();
    }

    setView({ level: Math.round(m.smooth), smooth: m.smooth, over: Math.min(100, (m.overTime / cfg.hold) * 100), light: over ? "red" : m.smooth >= cfg.thr * 0.8 ? "yellow" : "green" });
    setStats({ alerts: m.alerts, peak: m.peak, avg: Math.round(m.history.reduce((a, v) => a + v, 0) / m.history.length) });
    drawHistory();
  }, [alertNow, drawHistory]);

  const stop = useCallback(() => {
    const a = audio.current;
    if (a.timer) window.clearInterval(a.timer);
    a.src?.disconnect();
    a.stream?.getTracks().forEach((t) => t.stop());
    void a.wake?.release().catch(() => undefined);
    Object.assign(a, { timer: null, src: null, stream: null, analyser: null, wake: null });
    setListening(false);
    setView({ level: 0, smooth: 0, over: 0, light: null });
  }, []);

  const start = useCallback(
    async (deviceId: string) => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setNotice({ text: "Este navegador no permite usar el micrófono aquí. Usa Google Chrome o Edge.", error: true });
        return;
      }
      const a = audio.current;

      const open = async (id: string): Promise<boolean> => {
        stop();
        try {
          // Sin cancelación de eco ni control de ganancia: se quiere el nivel real del aula.
          a.stream = await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: id ? { exact: id } : undefined, echoCancellation: false, noiseSuppression: false, autoGainControl: false },
          });
        } catch (e) {
          setNotice({ text: `No se pudo abrir el micrófono (${(e as Error).name}). Revisa que esté conectado y que el navegador tenga permiso (icono del candado junto a la dirección).`, error: true });
          return false;
        }
        a.ctx ??= new AudioContext();
        if (a.ctx.state === "suspended") await a.ctx.resume();
        a.src = a.ctx.createMediaStreamSource(a.stream);
        a.analyser = a.ctx.createAnalyser();
        a.analyser.fftSize = 2048;
        a.buf = new Float32Array(a.analyser.fftSize);
        a.src.connect(a.analyser);
        setMicLabel(a.stream.getAudioTracks()[0]?.label ?? "micrófono");
        setNotice(null);
        setListening(true);
        a.timer = window.setInterval(tick, TICK_MS);
        try {
          a.wake = (await navigator.wakeLock?.request("screen")) ?? null;
        } catch {
          // Sin bloqueo de pantalla, la computadora podría suspenderse.
        }
        return true;
      };

      if (!(await open(deviceId))) return;

      // Con el permiso ya dado, los micrófonos tienen nombre.
      const current = a.stream?.getAudioTracks()[0]?.getSettings().deviceId ?? "";
      const devices = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === "audioinput");
      setMics(devices.map((d, i) => ({ id: d.deviceId, label: d.label || `Micrófono ${i + 1}` })));
      // Si aún no se eligió uno, se prefiere un micrófono Blue (Yeti, Snowball...).
      if (!settings.current.mic) {
        const blue = devices.find((d) => /blue|yeti|snowball/i.test(d.label));
        update("mic", blue?.deviceId ?? current);
        if (blue && blue.deviceId !== current) await open(blue.deviceId);
      }
    },
    [stop, tick, update]
  );

  // Al salir de la página se apaga el micrófono.
  useEffect(
    () => () => {
      stop();
      void audio.current.ctx?.close();
      audio.current.ctx = null;
    },
    [stop]
  );

  function pickFile(file: File | undefined) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    players.current.file = new Audio(url);
    setFileName(file.name);
    update("snd", "file");
    if (file.size > MAX_FILE_BYTES) {
      setNotice({ text: "El archivo es grande: se usará en esta visita, pero no se guardará en el navegador. Usa uno de menos de 1,5 MB para que se recuerde.", error: false });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        window.localStorage.setItem(FILE_KEY, JSON.stringify({ name: file.name, data: reader.result }));
      } catch {
        // Sin espacio: el sonido dura solo esta visita.
      }
    };
    reader.readAsDataURL(file);
  }

  function resetStats() {
    Object.assign(meter.current, { alerts: 0, peak: 0, history: [] });
    setStats({ alerts: 0, peak: 0, avg: 0 });
    drawHistory();
  }

  function fullscreen() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void stage.current?.requestFullscreen().catch(() => undefined);
  }

  const color = view.light ? LIGHT_COLOR[view.light] : "bg-muted";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-medium">Semáforo de ruido</h1>
          <p className="text-sm text-muted-foreground">Escucha el aula con el micrófono y avisa cuando el ruido pasa el límite que tú fijas. El audio no se graba ni se envía.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => (listening ? stop() : void start(s.mic))}>
            {listening ? <MicOffIcon /> : <MicIcon />}
            {listening ? "Detener" : "Empezar a escuchar"}
          </Button>
          <Button variant="outline" onClick={alertNow}>
            <BellRingIcon />
            Probar alerta
          </Button>
          <Button variant="outline" onClick={fullscreen}>
            <MaximizeIcon />
            Pantalla completa
          </Button>
        </div>
      </div>

      {notice && <p className={cn("rounded-lg border p-3 text-sm", notice.error ? "border-destructive text-destructive" : "border-border text-muted-foreground")}>{notice.text}</p>}

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        {/* En pantalla completa solo se ve este panel, grande, para el fondo del aula. */}
        <section ref={stage} aria-label="Nivel de ruido" className="flex flex-col gap-6 rounded-2xl border border-border bg-background p-6 [&:fullscreen]:justify-center [&:fullscreen]:p-12">
          <div className="grid items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)]">
            <div className="flex flex-row gap-3 justify-self-center rounded-full bg-foreground p-3 sm:flex-col" aria-hidden="true">
              {(["red", "yellow", "green"] as const).map((l) => (
                <span key={l} className={cn("size-16 rounded-full transition-opacity", LIGHT_COLOR[l], view.light === l ? "opacity-100" : "opacity-25")} />
              ))}
            </div>
            <div className="flex min-w-0 flex-col gap-3">
              <div className="font-mono text-7xl leading-none font-medium tabular-nums sm:text-8xl">
                {listening ? view.level : "--"}
                <span className="ml-2 font-sans text-sm text-muted-foreground uppercase">de 100</span>
              </div>
              <div className="text-lg font-medium">{listening ? (view.light ? LIGHT_TEXT[view.light] : "") : "Micrófono apagado"}</div>
              {listening && <div className="truncate text-xs text-muted-foreground">Escuchando: {micLabel}</div>}
              <div className="relative h-8 overflow-hidden rounded-lg bg-muted">
                <div className={cn("absolute inset-y-0 left-0 transition-[width] duration-75", color)} style={{ width: `${view.smooth}%` }} />
                <div className="absolute -inset-y-1 w-1 -translate-x-1/2 bg-foreground" style={{ left: `${s.thr}%` }} title={`Límite: ${s.thr}`} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
                <span>0 silencio</span>
                <span>50</span>
                <span>100 muy fuerte</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted" title="Tiempo acumulado sobre el límite">
                <div className="h-full bg-badge-vencido" style={{ width: `${view.over}%` }} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground uppercase">
              <span>Último minuto</span>
              <span>La línea roja es tu límite</span>
            </div>
            <canvas ref={canvas} className="block h-36 w-full" />
          </div>

          <div className="flex flex-wrap items-end gap-6 text-sm text-muted-foreground">
            <div>
              <b className="block font-mono text-xl font-medium text-foreground tabular-nums">{stats.alerts}</b>alertas en esta sesión
            </div>
            <div>
              <b className="block font-mono text-xl font-medium text-foreground tabular-nums">{stats.peak}</b>nivel más alto
            </div>
            <div>
              <b className="block font-mono text-xl font-medium text-foreground tabular-nums">{stats.avg}</b>promedio del último minuto
            </div>
            <Button variant="outline" size="sm" onClick={resetStats}>
              <RotateCcwIcon />
              Reiniciar contadores
            </Button>
          </div>

          {overlay && (
            <button type="button" onClick={() => setOverlay(false)} className="fixed inset-0 z-50 grid place-items-center bg-badge-vencido p-6 text-center text-white">
              <span>
                <span className="block animate-pulse text-5xl font-medium text-balance sm:text-7xl motion-reduce:animate-none">{s.msg || "¡Silencio, por favor!"}</span>
                <span className="mt-4 block text-sm opacity-85">Toca para cerrar</span>
              </span>
            </button>
          )}
        </section>

        <aside aria-label="Ajustes" className="flex flex-col gap-4 rounded-2xl border border-border p-4">
          <h2 className="font-medium">Ajustes</h2>
          <Field label="Micrófono">
            <select value={s.mic} onChange={(e) => (update("mic", e.target.value), void start(e.target.value))} disabled={mics.length === 0} className="h-9 w-full rounded-lg border border-border bg-surface-elevated px-2 text-sm focus:border-border-brand focus:outline-none">
              {mics.length === 0 && <option value="">(aparecen al empezar a escuchar)</option>}
              {mics.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </Field>
          <Range label="Límite de ruido" value={s.thr} min={5} max={100} step={1} onChange={(v) => update("thr", v)} hint="Cuando el nivel supera este número, empieza a contar el tiempo." />
          <Range label="Tiempo sobre el límite antes de avisar" value={s.hold} min={0.5} max={10} step={0.5} format={(v) => `${v} s`} onChange={(v) => update("hold", v)} hint="Evita que un aplauso o una silla que cae dispare la alarma." />
          <Range label="Pausa entre alertas" value={s.cool} min={2} max={60} step={1} format={(v) => `${v} s`} onChange={(v) => update("cool", v)} />
          <Range label="Sensibilidad del micrófono" value={s.sens} min={-20} max={20} step={1} format={(v) => (v > 0 ? `+${v}` : String(v))} onChange={(v) => update("sens", v)} hint="Súbela si el medidor casi no se mueve; bájala si siempre está alto." />
          <Field label="Sonido de alerta">
            <select value={s.snd} onChange={(e) => update("snd", e.target.value as Sound)} className="h-9 w-full rounded-lg border border-border bg-surface-elevated px-2 text-sm focus:border-border-brand focus:outline-none">
              <option value="bell">Campana suave</option>
              <option value="beep">Pitido</option>
              <option value="chime">Tres notas</option>
              {schoolSound && <option value="school">Alarma del colegio</option>}
              {fileName && <option value="file">Mi archivo: {fileName}</option>}
              <option value="none">Sin sonido</option>
            </select>
            <input ref={fileInput} type="file" accept="audio/*" hidden onChange={(e) => (pickFile(e.target.files?.[0]), (e.target.value = ""))} />
            <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => fileInput.current?.click()}>
              Usar mi propio archivo de sonido…
            </Button>
          </Field>
          <Range label="Volumen de la alerta" value={s.vol} min={0} max={100} step={5} format={(v) => `${v}%`} onChange={(v) => update("vol", v)} />
          <Field label="Mensaje en pantalla">
            <Input value={s.msg} maxLength={80} onChange={(e) => update("msg", e.target.value)} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={s.flash} onCheckedChange={(v) => update("flash", v)} />
            Mostrar aviso rojo en pantalla
          </label>
          <p className="text-xs text-muted-foreground">Los ajustes se guardan en este navegador.</p>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <span className="font-medium">{label}</span>
      {children}
    </div>
  );
}

function Range({ label, value, min, max, step, format, hint, onChange }: { label: string; value: number; min: number; max: number; step: number; format?: (v: number) => string; hint?: string; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="flex justify-between gap-2 font-medium">
        {label}
        <output className="font-mono text-brand-green-text tabular-nums">{format ? format(value) : value}</output>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-brand-green" />
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}
