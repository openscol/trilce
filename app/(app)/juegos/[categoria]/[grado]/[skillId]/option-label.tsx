import { ScratchBlocks } from "@/components/games/scratch-blocks";

// Texto de una opción, o el bloque de Scratch dibujado si la pregunta es de bloques.
export function OptionLabel({ text, blocks, mono }: { text: string; blocks?: boolean; mono?: boolean }) {
  if (blocks) return <ScratchBlocks code={text} scale={0.9} />;
  return mono ? <span className="whitespace-pre text-left font-mono text-sm">{text}</span> : <>{text}</>;
}
