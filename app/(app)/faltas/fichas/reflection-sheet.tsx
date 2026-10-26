// Ficha de Reflexión de Conducta (faltas leves). En pantalla se ve como una hoja;
// al imprimir (y al descargar) ocupa una sola página A4.

function Box({ checked }: { checked?: boolean }) {
  return <span className="inline-flex size-4 shrink-0 items-center justify-center border border-black text-xs leading-none">{checked ? "✓" : ""}</span>;
}

// Renglones en blanco para escribir a mano.
function Lines({ count = 2 }: { count?: number }) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="h-7 border-b border-black/50" />
      ))}
    </div>
  );
}

function Section({ n, title, who, children }: { n: number; title: string; who?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-1.5">
      <h3 className="font-semibold">
        {n}. {title}
        {who && <span className="font-normal italic"> ({who})</span>}
      </h3>
      <div className="flex flex-col gap-2 pl-4">{children}</div>
    </section>
  );
}

export function Signature({ label, name }: { label: string; name?: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="h-9 border-b border-black" />
      <span className="text-xs">
        {label}
        {name && `: ${name}`}
      </span>
    </div>
  );
}

export function ReflectionSheet({
  schoolName,
  code,
  date,
  student,
  gradeSection,
  norms,
  notes,
  teacher,
  assistant,
}: {
  schoolName: string;
  code: string;
  date: string;
  student: string;
  gradeSection: string;
  norms: { description: string; broken: boolean }[];
  notes: string[];
  teacher: string | null;
  assistant: string | null;
}) {
  return (
    <article className="print-page mx-auto flex w-full max-w-[210mm] flex-col gap-3 rounded-xl border border-border bg-white p-8 text-[13px] leading-snug text-black print:max-w-none print:rounded-none print:border-0 print:p-0">
      <header className="flex flex-col gap-2 border-b-2 border-black pb-2">
        <div className="flex items-start justify-between gap-4">
          <span className="font-semibold uppercase">{schoolName}</span>
          <span className="font-mono text-xs">N.° {code}</span>
        </div>
        <h2 className="text-center text-lg font-bold uppercase">Ficha de Reflexión de Conducta</h2>
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 sm:grid-cols-[auto_1fr_auto_1fr]">
          <dt className="font-semibold">Estudiante:</dt>
          <dd>{student}</dd>
          <dt className="font-semibold">Fecha:</dt>
          <dd className="first-letter:uppercase">{date}</dd>
          <dt className="font-semibold">Grado y sección:</dt>
          <dd>{gradeSection}</dd>
        </dl>
      </header>

      <Section n={1} title="Reconocimiento de la conducta">
        <div className="flex flex-col gap-1">
          <span>Normas de convivencia del aula que no respeté:</span>
          <ul className="grid gap-x-4 gap-y-0.5 sm:grid-cols-2 print:grid-cols-2">
            {norms.map((n) => (
              <li key={n.description} className="flex items-start gap-2">
                <Box checked={n.broken} />
                <span className={n.broken ? "font-semibold" : undefined}>{n.description}</span>
              </li>
            ))}
          </ul>
          {notes.length > 0 && <p className="text-xs italic">Observaciones del docente: {notes.join(" · ")}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <span>Describe brevemente lo que hice:</span>
          <Lines count={2} />
        </div>
      </Section>

      <Section n={2} title="Conciencia de las consecuencias" who="completar por el estudiante">
        <div className="flex flex-col gap-1">
          <span>¿A quién afectó mi comportamiento? (Marca las opciones)</span>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {["Profesor", "Compañeros", "El ambiente del aula", "Yo mismo"].map((o) => (
              <span key={o} className="flex items-center gap-2">
                <Box />
                {o}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span>¿Cómo afectó específicamente?</span>
          <Lines count={2} />
        </div>
      </Section>

      <Section n={3} title="Compromiso de mejora" who="completar por el estudiante">
        <div className="flex flex-col gap-1">
          <span>La próxima vez que quiera hablar, haré:</span>
          <Lines count={1} />
        </div>
        <div className="flex flex-col gap-1">
          <span>Si siento ganas de molestar a un compañero o hacer ruido, haré:</span>
          <Lines count={1} />
        </div>
      </Section>

      <Section n={4} title="Compromiso de reparación" who="completar por el estudiante">
        <div className="flex flex-col gap-1">
          <span>Para compensar el tiempo de clase que interrumpí, me comprometo a:</span>
          <Lines count={2} />
        </div>
      </Section>

      <Section n={5} title="Firmas">
        <div className="grid grid-cols-3 gap-x-6 gap-y-3">
          <Signature label="Firma del estudiante" name={student} />
          <Signature label="Firma del docente" name={teacher} />
          <Signature label="Firma del auxiliar" name={assistant} />
          <div className="col-span-2">
            <Signature label="Firma del padre, madre o apoderado" />
          </div>
          <Signature label="Fecha" />
        </div>
      </Section>
    </article>
  );
}
