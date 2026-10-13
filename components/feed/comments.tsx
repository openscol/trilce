"use client";

import { useEffect, useState, useTransition } from "react";
import { SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MAX_COMMENT_LENGTH, ROLE_LABEL, type FeedComment, type FeedViewer } from "@/lib/feed";
import { addComment, deleteComment, fetchComments, likeComment } from "@/app/(app)/dashboard/feed-actions";
import { InitialsAvatar } from "./avatar";

const STAFF_ROLES = ["admin", "administrativo", "docente"];

// Comentarios de una publicación. Las respuestas van a un solo nivel y solo
// las escribe el personal: alumnos y apoderados comentan la publicación, pero
// no conversan entre ellos.
export function Comments({ postId, viewer, enabled, canModerate, onCount }: { postId: string; viewer: FeedViewer; enabled: boolean; canModerate: boolean; onCount: (count: number) => void }) {
  const [comments, setComments] = useState<FeedComment[] | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchComments(postId).then((list) => {
      if (active) setComments(list);
    });
    return () => {
      active = false;
    };
  }, [postId]);

  function replace(list: FeedComment[]) {
    setComments(list);
    onCount(list.length);
  }

  async function send(body: string, parentId: string | null) {
    const result = await addComment(postId, body, parentId);
    if ("error" in result) return result.error;
    replace(result.comments);
    setReplyTo(null);
    return null;
  }

  function like(comment: FeedComment) {
    const liked = !comment.liked;
    const apply = (value: boolean) => setComments((list) => list?.map((c) => (c.id === comment.id ? { ...c, liked: value, likes: Math.max(0, c.likes + (value ? 1 : -1)) } : c)) ?? null);
    apply(liked);
    setError(null);
    likeComment(comment.id, liked).then((result) => {
      if (result?.error) {
        apply(!liked);
        setError(result.error);
      }
    });
  }

  function remove(comment: FeedComment) {
    if (!window.confirm("¿Eliminar este comentario?")) return;
    setError(null);
    deleteComment(comment.id).then((result) => {
      if (result?.error) setError(result.error);
      // Al borrar un comentario se van también sus respuestas.
      else if (comments) replace(comments.filter((c) => c.id !== comment.id && c.parent_id !== comment.id));
    });
  }

  if (comments === null) return <p className="text-sm text-muted-foreground">Cargando comentarios...</p>;

  const roots = comments.filter((c) => !c.parent_id);
  const item = (comment: FeedComment, reply: boolean) => (
    <div key={comment.id} className={cn("flex gap-2", reply && "ml-10")}>
      <InitialsAvatar name={comment.author_name} small />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="w-fit max-w-full rounded-2xl border border-border bg-muted px-3 py-2">
          <p className="text-sm font-medium">
            {comment.author_name}
            {STAFF_ROLES.includes(comment.author_role) && <span className="ml-2 text-xs font-normal text-muted-foreground">{ROLE_LABEL[comment.author_role]}</span>}
          </p>
          <p className="text-sm whitespace-pre-wrap break-words">{comment.body}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 px-3 text-xs text-muted-foreground">
          <span>{comment.ago}</span>
          <button type="button" onClick={() => like(comment)} aria-pressed={comment.liked} className={cn("font-medium hover:text-foreground", comment.liked && "text-primary")}>
            Me gusta{comment.likes > 0 ? ` · ${comment.likes}` : ""}
          </button>
          {viewer.isStaff && enabled && (
            <button type="button" onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)} className="font-medium hover:text-foreground">
              Responder
            </button>
          )}
          {(comment.user_id === viewer.userId || canModerate) && (
            <button type="button" onClick={() => remove(comment)} className="font-medium hover:text-destructive">
              Eliminar
            </button>
          )}
        </div>
        {replyTo === comment.id && <CommentInput placeholder={`Responder a ${comment.author_name}`} onSend={(body) => send(body, comment.id)} autoFocus />}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-3">
      {roots.length === 0 && <p className="text-sm text-muted-foreground">{enabled ? "Sé la primera persona en comentar." : "Esta publicación no tiene comentarios."}</p>}
      {roots.map((root) => (
        <div key={root.id} className="flex flex-col gap-2">
          {item(root, false)}
          {comments.filter((c) => c.parent_id === root.id).map((reply) => item(reply, true))}
        </div>
      ))}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {enabled ? <CommentInput placeholder="Escribe un comentario..." onSend={(body) => send(body, null)} /> : <p className="text-xs text-muted-foreground">Los comentarios de esta publicación están desactivados.</p>}
    </div>
  );
}

function CommentInput({ placeholder, onSend, autoFocus }: { placeholder: string; onSend: (body: string) => Promise<string | null>; autoFocus?: boolean }) {
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit() {
    if (!body.trim()) return;
    start(async () => {
      const problem = await onSend(body);
      setError(problem);
      if (!problem) setBody("");
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <Input value={body} onChange={(e) => setBody(e.target.value)} maxLength={MAX_COMMENT_LENGTH} placeholder={placeholder} aria-label={placeholder} autoFocus={autoFocus} disabled={pending} />
        <Button type="submit" size="icon-sm" disabled={pending || !body.trim()} aria-label="Enviar comentario">
          <SendIcon />
        </Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
