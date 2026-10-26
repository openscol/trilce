// Convierte los enlaces del texto (http://, https:// o www.) en vínculos que se abren en otra pestaña.
const URL_PATTERN = /(?:https?:\/\/|www\.)[^\s<]+/gi;
// La puntuación pegada al final («visita www.x.pe.») no es parte del enlace.
const TRAILING = /[.,;:!?¡¿)\]}"'»”’]+$/;

export function LinkifiedText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(URL_PATTERN)) {
    const url = match[0].replace(TRAILING, "");
    const start = match.index;
    if (start > last) parts.push(text.slice(last, start));
    parts.push(
      <a key={start} href={/^https?:\/\//i.test(url) ? url : `https://${url}`} target="_blank" rel="noopener noreferrer nofollow" className="text-brand-green-text underline-offset-2 hover:underline break-all">
        {url}
      </a>,
    );
    last = start + url.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
