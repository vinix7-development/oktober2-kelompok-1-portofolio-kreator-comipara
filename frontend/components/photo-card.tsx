"use client";

import Link from "next/link";
import { useState } from "react";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { compactNumber, timeAgo } from "@/lib/format";
import type { Photo } from "@/lib/types";
import { Avatar } from "./avatar";
import { useToast } from "./toast";

export function PhotoCard({ photo }: { photo: Photo }) {
  const { user } = useAuth();
  const { notify } = useToast();
  const [liked, setLiked] = useState(photo.liked);
  const [count, setCount] = useState(photo.like_count);
  const [busy, setBusy] = useState(false);

  async function toggleLike() {
    if (!user) {
      notify("Masuk dulu untuk menyukai karya.");
      return;
    }
    if (busy) return;

    setBusy(true);
    const next = !liked;
    setLiked(next);
    setCount((value) => Math.max(0, value + (next ? 1 : -1)));

    try {
      const res = await api<{ liked: boolean; like_count: number }>(`/photos/${photo.id}/like`, {
        method: next ? "POST" : "DELETE",
      });
      setLiked(res.liked);
      setCount(res.like_count);
    } catch (error) {
      setLiked(!next);
      setCount((value) => Math.max(0, value + (next ? -1 : 1)));
      notify(errorMessage(error), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="photo-card">
      <Link className="photo-media" href={`/foto/${photo.id}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.url} alt={photo.caption ?? `Karya ${photo.user.name}`} loading="lazy" />
        {photo.album ? (
          <span className="photo-tag">Album · {photo.album.title ?? "Tanpa judul"}</span>
        ) : photo.hashtags[0] ? (
          <span className="photo-tag">#{photo.hashtags[0]}</span>
        ) : null}
        <span className="photo-overlay">
          <span>Lihat karya ↗</span>
        </span>
      </Link>

      <div className="photo-body">
        <Link className="photo-caption" href={`/foto/${photo.id}`}>
          {photo.caption ?? "Tanpa caption."}
        </Link>

        <div className="photo-foot">
          <Link className="photo-author" href={`/u/${photo.user.username}`}>
            <Avatar user={photo.user} size="sm" />
            <b>{photo.user.name}</b>
          </Link>

          <div className="row" style={{ gap: 6, flexWrap: "nowrap" }}>
            <button
              type="button"
              className={liked ? "like-btn liked" : "like-btn"}
              onClick={toggleLike}
              aria-pressed={liked}
              aria-label={liked ? "Batalkan suka" : "Sukai karya"}
            >
              <span aria-hidden="true">{liked ? "♥" : "♡"}</span>
              {compactNumber(count)}
            </button>
            <Link className="like-btn" href={`/foto/${photo.id}#komentar`} aria-label="Lihat komentar">
              <span aria-hidden="true">💬</span>
              {compactNumber(photo.comment_count)}
            </Link>
          </div>
        </div>

        <span className="text-xs muted" style={{ fontFamily: "var(--font-mono)" }}>
          {timeAgo(photo.created_at)}
        </span>
      </div>
    </article>
  );
}

export function PhotoGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="photo-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div className="photo-card" key={index} style={{ padding: 0 }}>
          <div className="skeleton media" style={{ borderRadius: 0 }} />
          <div className="photo-body">
            <div className="skeleton line" style={{ width: "85%" }} />
            <div className="skeleton line" style={{ width: "55%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
