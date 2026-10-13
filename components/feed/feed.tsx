"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FEED_PAGE_SIZE, type AudienceOptions, type FeedPost, type FeedViewer } from "@/lib/feed";
import { loadMorePosts } from "@/app/(app)/dashboard/feed-actions";
import { PostComposer } from "./post-composer";
import { PostCard } from "./post-card";

// El muro: caja para publicar (si puede) y las publicaciones, de la más nueva
// a la más antigua, con las fijadas primero.
export function Feed({ initial, viewer, audiences }: { initial: FeedPost[]; viewer: FeedViewer; audiences: AudienceOptions | null }) {
  const [posts, setPosts] = useState(initial);
  const [hasMore, setHasMore] = useState(initial.length === FEED_PAGE_SIZE);
  const [pending, start] = useTransition();

  function more() {
    start(async () => {
      const next = await loadMorePosts(posts.length);
      const known = new Set(posts.map((p) => p.id));
      setPosts((list) => [...list, ...next.filter((p) => !known.has(p.id))]);
      setHasMore(next.length === FEED_PAGE_SIZE);
    });
  }

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-4" aria-label="Muro del colegio">
      <h2 className="text-base font-medium">Muro del colegio</h2>
      {viewer.canPublish && audiences && <PostComposer viewer={viewer} audiences={audiences} />}
      {posts.length === 0 && <p className="rounded-2xl border border-border p-8 text-center text-sm text-muted-foreground">Todavía no hay publicaciones.</p>}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} viewer={viewer} />
      ))}
      {hasMore && (
        <Button variant="outline" className="w-fit self-center" disabled={pending} onClick={more}>
          {pending ? "Cargando..." : "Ver más publicaciones"}
        </Button>
      )}
    </section>
  );
}
