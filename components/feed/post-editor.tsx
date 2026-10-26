"use client";

import { useRef, useState, useTransition } from "react";
import { ImagePlusIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { toJpeg } from "@/lib/exams/upload";
import { MAX_POST_IMAGES, MAX_POST_LENGTH, type FeedPost, type FeedViewer } from "@/lib/feed";
import { updatePost } from "@/app/(app)/dashboard/feed-actions";

type Picked = { file: File; preview: string };

// Editar una publicación: el texto y sus imágenes (quitar las que tiene y agregar nuevas).
export function PostEditor({ post, viewer, onDone }: { post: FeedPost; viewer: FeedViewer; onDone: (saved: boolean) => void }) {
  const [body, setBody] = useState(post.body);
  const [kept, setKept] = useState(post.images);
  const [added, setAdded] = useState<Picked[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const count = kept.length + added.length;

  function pick(files: FileList | null) {
    if (!files) return;
    const room = MAX_POST_IMAGES - count;
    const images = [...files].filter((f) => f.type.startsWith("image/")).slice(0, room);
    if (files.length > room) setError(`Máximo ${MAX_POST_IMAGES} imágenes por publicación.`);
    setAdded((list) => [...list, ...images.map((file) => ({ file, preview: URL.createObjectURL(file) }))]);
  }

  function removeAdded(index: number) {
    URL.revokeObjectURL(added[index].preview);
    setAdded((list) => list.filter((_, i) => i !== index));
  }

  function close(saved: boolean) {
    added.forEach((i) => URL.revokeObjectURL(i.preview));
    onDone(saved);
  }

  function save() {
    setError(null);
    start(async () => {
      const storage = createClient().storage.from("feed");
      const paths: string[] = [];
      for (const { file } of added) {
        const blob = await toJpeg(file);
        const path = `${viewer.schoolId}/${post.id}/${crypto.randomUUID()}.jpg`;
        const upload = blob ? await storage.upload(path, blob, { contentType: "image/jpeg" }) : null;
        if (!upload || upload.error) {
          if (paths.length) await storage.remove(paths);
          setError(`No se pudo subir ${file.name}.`);
          return;
        }
        paths.push(path);
      }
      const result = await updatePost(post.id, { body, imagePaths: [...kept.map((i) => i.path), ...paths] });
      if (result?.error) {
        if (paths.length) await storage.remove(paths);
        setError(result.error);
        return;
      }
      close(true);
    });
  }

  const thumb = (key: string, src: string, label: string, onRemove: () => void) => (
    <div key={key} className="relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label} className="aspect-square w-full rounded-lg border border-border object-cover" />
      <button type="button" onClick={onRemove} disabled={pending} aria-label={`Quitar la ${label.toLowerCase()}`} className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full border border-border bg-background">
        <XIcon className="size-3" />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      <Textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={MAX_POST_LENGTH} rows={4} aria-label="Texto de la publicación" />

      {count > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {kept.map((image, i) => thumb(image.path, image.url, `Imagen ${i + 1}`, () => setKept((list) => list.filter((k) => k.path !== image.path))))}
          {added.map((image, i) => thumb(image.preview, image.preview, `Imagen ${kept.length + i + 1}`, () => removeAdded(i)))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => (pick(e.target.files), (e.target.value = ""))} />
        <Button type="button" variant="ghost" size="sm" disabled={pending || count >= MAX_POST_IMAGES} onClick={() => fileRef.current?.click()}>
          <ImagePlusIcon />
          {count > 0 ? "Agregar imágenes" : "Imágenes"}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={pending} onClick={() => close(false)}>
            Cancelar
          </Button>
          <Button size="sm" disabled={pending} onClick={save}>
            {pending ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
