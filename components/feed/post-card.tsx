"use client";

import { useState, useTransition } from "react";
import { ChevronLeftIcon, ChevronRightIcon, MessageCircleIcon, MoreHorizontalIcon, PinIcon, ThumbsUpIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { REACTIONS, ROLE_LABEL, totalReactions, type FeedPost, type FeedReaction, type FeedViewer } from "@/lib/feed";
import { deletePost, reactToPost, updatePost } from "@/app/(app)/dashboard/feed-actions";
import { InitialsAvatar } from "./avatar";
import { Comments } from "./comments";
import { LinkifiedText } from "./linkified-text";
import { PostEditor } from "./post-editor";

// Pinta el fondo del contenedor con el color promedio de los bordes izquierdo y
// derecho de la imagen, que es donde queda el espacio en una foto vertical.
// Si el navegador no deja leer la imagen, se queda el fondo neutro.
function paintBackdrop(img: HTMLImageElement) {
  try {
    const size = 16;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx || !img.naturalWidth || !img.parentElement) return;
    ctx.drawImage(img, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);
    let r = 0, g = 0, b = 0, n = 0;
    for (let y = 0; y < size; y++) {
      for (const x of [0, 1, size - 2, size - 1]) {
        const i = (y * size + x) * 4;
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        n++;
      }
    }
    img.parentElement.style.backgroundColor = `rgb(${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)})`;
  } catch {
    // Imagen sin permiso de lectura entre orígenes: no se puede calcular el color.
  }
}

export function PostCard({ post, viewer }: { post: FeedPost; viewer: FeedViewer }) {
  const [reactions, setReactions] = useState(post.reactions);
  const [mine, setMine] = useState(post.my_reaction);
  const [picking, setPicking] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comment_count);
  const [editing, setEditing] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  const isAuthor = post.author_user_id === viewer.userId;
  const canManage = isAuthor || viewer.isAdmin;
  // Con más de 3 líneas (o mucho texto) se corta y aparece «Ver más».
  const long = post.body.length > 220 || post.body.split("\n").length > 3;
  const current = REACTIONS.find((r) => r.key === mine);
  const total = totalReactions(reactions);
  const top = REACTIONS.filter((r) => (reactions[r.key] ?? 0) > 0)
    .sort((a, b) => (reactions[b.key] ?? 0) - (reactions[a.key] ?? 0))
    .slice(0, 3);

  // Reaccionar es inmediato en pantalla; si el servidor falla, se deshace.
  function react(next: FeedReaction | null) {
    setPicking(false);
    const before = { reactions, mine };
    const updated = { ...reactions };
    if (mine) updated[mine] = Math.max(0, (updated[mine] ?? 1) - 1);
    if (next) updated[next] = (updated[next] ?? 0) + 1;
    setReactions(updated);
    setMine(next);
    setError(null);
    reactToPost(post.id, next).then((result) => {
      if (result?.error) {
        setReactions(before.reactions);
        setMine(before.mine);
        setError(result.error);
      }
    });
  }

  const run = (action: () => Promise<{ error: string } | undefined>, after?: () => void) =>
    start(async () => {
      const result = await action();
      setError(result?.error ?? null);
      if (!result?.error) {
        after?.();
        router.refresh();
      }
    });

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border p-4">
      <header className="flex items-start gap-3">
        <InitialsAvatar name={post.author_name} />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-medium">{post.author_name}</span>
          <span className="text-xs text-muted-foreground">
            {ROLE_LABEL[post.author_role]} · {post.ago} · {post.audience_label}
          </span>
        </div>
        {post.pinned && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground" title="Publicación fijada">
            <PinIcon className="size-3" />
            Fijada
          </span>
        )}
        {canManage && (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Opciones de la publicación" disabled={pending} />}>
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditing(true)}>Editar</DropdownMenuItem>
              {viewer.isAdmin && <DropdownMenuItem onClick={() => run(() => updatePost(post.id, { pinned: !post.pinned }))}>{post.pinned ? "Dejar de fijar" : "Fijar arriba"}</DropdownMenuItem>}
              <DropdownMenuItem onClick={() => run(() => updatePost(post.id, { commentsEnabled: !post.comments_enabled }))}>{post.comments_enabled ? "Desactivar comentarios" : "Activar comentarios"}</DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  if (window.confirm("¿Eliminar esta publicación? Se borran también sus comentarios y reacciones.")) run(() => deletePost(post.id));
                }}
              >
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </header>

      {editing ? (
        <PostEditor
          post={post}
          viewer={viewer}
          onDone={(saved) => {
            setEditing(false);
            if (saved) router.refresh();
          }}
        />
      ) : (
        post.body && (
          <div>
            <p className={cn("text-sm whitespace-pre-wrap break-words", long && !expanded && "line-clamp-3")}>
              <LinkifiedText text={post.body} />
            </p>
            {long && (
              <button type="button" onClick={() => setExpanded((v) => !v)} className="text-sm font-medium text-muted-foreground hover:text-foreground">
                {expanded ? "Ver menos" : "Ver más"}
              </button>
            )}
          </div>
        )
      )}

      {post.images.length === 1 && (
        // Una sola imagen se muestra entera (sin recortar caras en las fotos verticales);
        // el espacio que sobra a los lados se rellena con el color de la propia imagen.
        <button type="button" onClick={() => setLightbox(0)} aria-label="Ampliar la imagen" className="flex justify-center overflow-hidden rounded-lg border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.images[0].url} alt="" crossOrigin="anonymous" ref={(img) => void (img?.complete && paintBackdrop(img))} onLoad={(e) => paintBackdrop(e.currentTarget)} className="max-h-[32rem] w-auto max-w-full object-contain" />
        </button>
      )}

      {post.images.length > 1 && (
        <div className={cn("grid gap-1 overflow-hidden rounded-lg", post.images.length > 1 && "grid-cols-2")}>
          {post.images.slice(0, 4).map((image, i) => (
            <button key={image.path} type="button" onClick={() => setLightbox(i)} className="relative" aria-label={`Ver la imagen ${i + 1} de ${post.images.length}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="" loading="lazy" className="aspect-square w-full border border-border object-cover" />
              {i === 3 && post.images.length > 4 && <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-2xl font-medium text-white">+{post.images.length - 4}</span>}
            </button>
          ))}
        </div>
      )}

      {post.youtube_id && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${post.youtube_id}`}
          title="Video de YouTube"
          loading="lazy"
          className="aspect-video w-full rounded-lg border border-border"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <footer className="relative flex items-center justify-between gap-2 border-t border-border pt-2">
        <div className="flex items-center gap-1">
          {picking && (
            <div className="absolute bottom-full left-0 z-10 mb-1 flex gap-1 rounded-full border border-border bg-background p-1" role="menu" aria-label="Elige una reacción">
              {REACTIONS.map((r) => (
                <button key={r.key} type="button" role="menuitem" title={r.label} aria-label={r.label} onClick={() => react(mine === r.key ? null : r.key)} className={cn("flex size-9 items-center justify-center rounded-full text-xl transition-transform hover:scale-125", mine === r.key && "bg-accent")}>
                  {r.emoji}
                </button>
              ))}
            </div>
          )}
          {/* Un toque abre las seis reacciones; si ya reaccionó, el botón muestra cuál y vuelve a abrirlas para cambiarla o quitarla. */}
          <Button variant="ghost" size="sm" aria-expanded={picking} onClick={() => setPicking((v) => !v)} className={cn(current && "text-primary")}>
            {current ? <span className="text-base leading-none">{current.emoji}</span> : <ThumbsUpIcon />}
            {current ? current.label : "Reaccionar"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowComments((v) => !v)} aria-expanded={showComments}>
            <MessageCircleIcon />
            {commentCount > 0 ? `${commentCount} ${commentCount === 1 ? "comentario" : "comentarios"}` : "Comentar"}
          </Button>
        </div>
        {/* Abajo a la derecha: las reacciones que recibió la publicación. */}
        {total > 0 && (
          <span className="flex items-center gap-1 text-sm text-muted-foreground" title={top.map((r) => `${r.label}: ${reactions[r.key]}`).join(" · ")}>
            <span className="flex">
              {top.map((r) => (
                <span key={r.key} className="-ml-1 text-base leading-none first:ml-0">
                  {r.emoji}
                </span>
              ))}
            </span>
            {total}
          </span>
        )}
      </footer>

      {showComments && <Comments postId={post.id} viewer={viewer} enabled={post.comments_enabled} canModerate={canManage} onCount={setCommentCount} />}

      {lightbox !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" role="dialog" aria-label="Imagen ampliada" onClick={() => setLightbox(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.images[lightbox].url} alt="" className="max-h-full max-w-full rounded-lg object-contain" />
          <button type="button" aria-label="Cerrar" className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white" onClick={() => setLightbox(null)}>
            <XIcon />
          </button>
          {post.images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Imagen anterior"
                className="absolute left-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white"
                onClick={(e) => (e.stopPropagation(), setLightbox((lightbox + post.images.length - 1) % post.images.length))}
              >
                <ChevronLeftIcon />
              </button>
              <button type="button" aria-label="Imagen siguiente" className="absolute right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white" onClick={(e) => (e.stopPropagation(), setLightbox((lightbox + 1) % post.images.length))}>
                <ChevronRightIcon />
              </button>
            </>
          )}
        </div>
      )}
    </article>
  );
}
