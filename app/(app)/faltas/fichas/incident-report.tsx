// Registro interno de faltas leves (acta). Va con la ficha de reflexión: mismo
// número, mismo hecho. Al imprimir (y al descargar) ocupa una sola página A4.
import { Signature } from "./reflection-sheet";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="font-semibold">{label}:</dt>
      <dd className="first-letter:uppercase">{children || <span className="inline-block w-48 border-b border-black/50">&nbsp;</span>}</dd>
    </>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h3 className="border-b border-black pb-0.5 font-bold uppercase">{children}</h3>;
}

export function IncidentReport({
  code,
  schoolName,
  recordedAt,
  place,
  studentFullName,
  gradeSection,
  teacher,
  assistant,
  faltasPerSheet,
  faltas,
}: {
  code: string;
  schoolName: string;
  recordedAt: string;
  place: string | null;
  studentFullName: string;
  gradeSection: string;
  teacher: string | null;
  assistant: string | null;
  faltasPerSheet: number;
  faltas: { norm: string; at: string; note: string | null }[];
}) {
  return (
    <article className="print-page mx-auto flex w-full max-w-[210mm] flex-col gap-4 rounded-xl border border-border bg-white p-8 text-[13px] leading-snug text-black print:max-w-none print:rounded-none print:border-0 print:p-0">
      <header className="flex flex-col gap-1 border-b-2 border-black pb-2 text-center">
        <span className="font-semibold uppercase">{schoolName}</span>
        <h2 className="text-lg font-bold uppercase">Registro interno de faltas leves</h2>
      </header>

      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        <Row label="Número de acta">
          <span className="font-mono">{code}</span>
        </Row>
        <Row label="Institución educativa">{schoolName}</Row>
        <Row label="Fecha y hora del registro">{recordedAt}</Row>
        <Row label="Lugar">{place}</Row>
      </dl>

      <section className="flex flex-col gap-2">
        <Heading>Datos del estudiante</Heading>
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
          <Row label="Nombres y apellidos">{studentFullName}</Row>
          <Row label="Grado y sección">{gradeSection}</Row>
          <Row label="Docente">{teacher}</Row>
          <Row label="Auxiliar">{assistant}</Row>
        </dl>
      </section>

      <section className="flex flex-col gap-2">
        <Heading>Descripción de los hechos</Heading>
        <p className="text-justify">
          Al estudiante <b>{studentFullName}</b> se le comunicó previamente que, al sumar {faltasPerSheet} llamadas de atención por faltar a las normas de convivencia, se le retiraría del aula para pasar a tutoría bajo la supervisión de su auxiliar.
        </p>
        <p>El estudiante incurrió en estas faltas:</p>
        <ol className="flex flex-col gap-0.5 pl-6">
          {faltas.map((f, i) => (
            <li key={i} className="list-decimal">
              {f.norm} <span className="font-mono text-xs">[{f.at}]</span>
              {f.note && <span className="italic"> — {f.note}</span>}
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-2">
        <Heading>Medida correctiva</Heading>
        <p className="font-semibold">Permanencia pedagógica en tutoría bajo supervisión del auxiliar.</p>
        <p className="text-justify">
          El MINEDU, en la R.M. N.° 613-2026-MINEDU, contempla la «separación temporal del aula» o «permanencia pedagógica fuera del aula bajo supervisión» como una medida correctiva para faltas leves, con el fin de no afectar el derecho de aprendizaje de los demás estudiantes.
        </p>
        <p className="text-justify">
          <b>Acción inmediata:</b> separación temporal del aula. El estudiante fue acompañado por el auxiliar a la oficina de coordinación para realizar una ficha de reflexión.
        </p>
        <p className="text-justify">
          <b>Compromiso del estudiante:</b> el estudiante debe llenar un compromiso de conducta.
        </p>
      </section>

      <section className="mt-auto flex flex-col gap-2">
        <Heading>Firmas</Heading>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-2">
          <Signature label="Estudiante" name={studentFullName} />
          <Signature label="Docente de aula" name={teacher} />
          <Signature label="Auxiliar" name={assistant} />
          <Signature label="Padre, madre o apoderado" />
        </div>
      </section>
    </article>
  );
}
