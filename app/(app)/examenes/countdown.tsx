"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatClock } from "@/lib/exams/online";

// Cuenta regresiva hasta `target` según el reloj del servidor (`serverNow` es
// la hora del servidor cuando se generó la página). Al llegar a cero llama a
// `onDone`, y lo repite cada 2 s mientras siga en pantalla: si el servidor aún
// no da por abierta la hora, se vuelve a preguntar sin que el alumno recargue.
export function Countdown({ target, serverNow, onDone, className }: { target: string; serverNow: string; onDone: () => void; className?: string }) {
  const [offset] = useState(() => Date.parse(serverNow) - Date.now());
  const compute = () => (Date.parse(target) - (Date.now() + offset)) / 1000;
  const [remaining, setRemaining] = useState(compute);
  const lastCall = useRef(0);
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  });

  useEffect(() => {
    const id = window.setInterval(() => {
      const left = compute();
      setRemaining(left);
      if (left <= 0 && Date.now() - lastCall.current >= 2000) {
        lastCall.current = Date.now();
        done.current();
      }
    }, 250);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, offset]);

  return (
    <span className={className} role="timer">
      {remaining > 0 ? formatClock(remaining) : "Abriendo..."}
    </span>
  );
}

// Para páginas del servidor: al cumplirse la hora, vuelve a pedir la página.
export function RefreshCountdown({ target, serverNow, className }: { target: string; serverNow: string; className?: string }) {
  const router = useRouter();
  return <Countdown target={target} serverNow={serverNow} onDone={() => router.refresh()} className={className} />;
}
