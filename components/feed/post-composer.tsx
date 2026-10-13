"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlusIcon, XIcon, VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { toJpeg } from "@/lib/exams/upload";
import { MAX_POST_IMAGES, MAX_POST_LENGTH, parseYouTubeId, type AudienceOptions, type FeedViewer } from "@/lib/feed";
import { createPost, type PostInput } from "@/app/(app)/dashboard/feed-actions";

type Picked = { file: File; preview: string };

// El valor del selector de audiencia: "school", "grade|primaria|6" o "section|<id>".
function parseAudience(value: string): Pick<PostInput, "audience" | "level" | "grade" | "classGroupId"> {
  const [kind, a, b] = value.split("|");
  if (kind === "grade") return { audience: "grade", level: a as PostInput["level"], grade: b, classGroupId: null };
  if (kind === "section") return { audience: "section", level: null, grade: null, classGroupId: a };
  return { audience: "school", level: null, grade: null, classGroupId: null };
}

export function PostComposer({ viewer, audiences }: { viewer: FeedViewer; audiences: AudienceOptions }) {
  const firstAudience = audiences.school ? "school" : audiences.sections[0] ? `section|${audiences.sections[0].id}` : "";
  const [body, setBody] = useState("");
  const [images, setImages] = useState<Picked[]>([]);
  const [showYoutube, setShowYoutube] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [audience, setAudience] = useState(firstAudience);
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const youtubeId = youtubeUrl.trim() ? parseYouTubeId(youtubeUrl) : null;
  const empty = !body.trim() && images.length === 0 && !youtubeUrl.trim();

  if (!firstAudience) {
    return <p className="rounded-2xl border border-border p-4 text-sm text-muted-foreground">Para publicar en el muro necesitas tener una sección a cargo. Pide a la administración que te la asigne.</p>;
  }

  function pick(files: FileList | null) {
    if (!files) return;
    const room = MAX_POST_IMAGES - images.length;
    const added = [...files].filter((f) => f.type.startsWith("image/")).slice(0, room);
    if (files.length > room) setError(`Máximo ${MAX_POST_IMAGES} imágenes por publicación.`);
    setImages((list) => [...list, ...added.map((file) => ({ file, preview: URL.createObjectURL(file) }))]);
  }

  function remove(index: number) {
    URL.revokeObjectURL(images[index].preview);
    setImages((list) => list.filter((_, i) => i !== index));
  }

  function publish() {
    setError(null);
    if (youtubeUrl.trim() && !youtubeId) {
      setError("El enlace de YouTube no es válido. Copia el enlace del video tal como aparece en YouTube.");
      return;
    }
    start(async () => {
      const id = crypto.randomUUID();
      const storage = createClient().storage.from("feed");
      const paths: string[] = [];
      for (const { file } of images) {
        // Se reducen a JPEG en el navegador: pesan poco y cargan rápido en el celular.
        const blob = await toJpeg(file);
        const path = `${viewer.schoolId}/${id}/${crypto.randomUUID()}.jpg`;
        const upload = blob ? await storage.upload(path, blob, { contentType: "image/jpeg" }) : null;
        if (!upload || upload.error) {
          if (paths.length) await storage.remove(paths);
          setError(`No se pudo subir ${file.name}.`);
          return;
        }
        paths.push(path);
      }
      const result = await createPost({ id, body, youtubeUrl, imagePaths: paths, commentsEnabled, ...parseAudience(audience) });
      if (result?.error) {
        if (paths.length) await storage.remove(paths);
        setError(result.error);
        return;
      }
      images.forEach((i) => URL.revokeObjectURL(i.preview));
      setBody("");
      setImages([]);
      setYoutubeUrl("");
      setShowYoutube(false);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border p-4">
      <Textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={MAX_POST_LENGTH} rows={3} placeholder="¿Qué quieres publicar? Puedes usar emojis 😊" aria-label="Texto de la publicación" />

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {images.map((image, i) => (
            <div key={image.preview} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.preview} alt={`Imagen ${i + 1}`} className="aspect-square w-full rounded-lg border border-border object-cover" />
              <button type="button" onClick={() => remove(i)} aria-label={`Quitar la imagen ${i + 1}`} className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full border border-border bg-background">
                <XIcon className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showYoutube && (
        <div className="flex flex-col gap-2">
          <Input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="Pega el enlace del video de YouTube" aria-label="Enlace de YouTube" />
          {youtubeId && <iframe src={`https://www.youtube-nocookie.com/embed/${youtubeId}`} title="Vista previa del video" className="aspect-video w-full rounded-lg border border-border" allowFullScreen />}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => (pick(e.target.files), (e.target.value = ""))} />
        <Button type="button" variant="ghost" size="sm" disabled={pending || images.length >= MAX_POST_IMAGES} onClick={() => fileRef.current?.click()}>
          <ImagePlusIcon />
          Imágenes
        </Button>
        <Button type="button" variant="ghost" size="sm" disabled={pending} onClick={() => setShowYoutube((v) => !v)}>
          <VideoIcon />
          YouTube
        </Button>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={commentsEnabled} onChange={(e) => setCommentsEnabled(e.target.checked)} className="size-4 accent-primary" />
          Permitir comentarios
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Para
          <select value={audience} onChange={(e) => setAudience(e.target.value)} className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm text-foreground">
            {audiences.school && <option value="school">Todo el colegio</option>}
            {audiences.grades.length > 0 && (
              <optgroup label="Un grado">
                {audiences.grades.map((g) => (
                  <option key={`${g.level}|${g.grade}`} value={`grade|${g.level}|${g.grade}`}>
                    {g.label}
                  </option>
                ))}
              </optgroup>
            )}
            {audiences.sections.length > 0 && (
              <optgroup label="Una sección">
                {audiences.sections.map((s) => (
                  <option key={s.id} value={`section|${s.id}`}>
                    {s.label}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </label>
        <Button disabled={pending || empty} onClick={publish}>
          {pending ? "Publicando..." : "Publicar"}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
