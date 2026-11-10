"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { compactNumber, timeAgo } from "@/lib/format";
import type { Comment, Photo } from "@/lib/types";
import { Avatar } from "@/components/avatar";
import { PhotoCard } from "@/components/photo-card";
import { ErrorBox } from "@/components/ui";
import { useToast } from "@/components/toast";

type Payload = {
  photo: Photo;
  comments: Comment[];
  more_from_user: Photo[];
};

export function PhotoDetailView({ id }: { id: string }) {
  const { user } = useAuth();
  const { notify } = useToast();
  const router = useRouter();
  const [data, setData] = useState<Payload | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api<Payload>(`/photos/${id}`);
      setData(res);
      setLiked(res.photo.liked);
      setLikeCount(res.photo.like_count);
      setComments(res.comments);
    } catch (err) {
      setError(errorMessage(err));
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleLike() {
    if (!user) {
      notify("Masuk dulu untuk menyukai karya.");
      return;
    }
    const next = !liked;
    setLiked(next);
    setLikeCount((value) => Math.max(0, value + (next ? 1 : -1)));
    try {
      const res = await api<{ liked: boolean; like_count: number }>(`/photos/${id}/like`, {
        method: next ? "POST" : "DELETE",
      });
      setLiked(res.liked);
      setLikeCount(res.like_count);
    } catch (err) {
      setLiked(!next);
      setLikeCount((value) => Math.max(0, value + (next ? -1 : 1)));
      notify(errorMessage(err), "error");
    }
  }

  async function submitComment(event: React.FormEvent) {
    event.preventDefault();
    if (!user) {
      notify("Masuk dulu untuk berkomentar.");
      return;
    }
    if (!commentText.trim() || busy) return;

    setBusy(true);
    try {
      const res = await api<{ comment: Comment; comment_count: number }>(
        `/photos/${id}/comments`,
        { method: "POST", body: { body: commentText.trim() } },
      );
      setComments((current) => [res.comment, ...current]);
      setCommentText("");
      notify("Komentar terkirim.", "success");
    } catch (err) {
      notify(errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  async function deleteComment(comment: Comment) {
    if (!window.confirm("Hapus komentar ini?")) return;
    try {
      await api(`/comments/${comment.id}`, { method: "DELETE" });
      setComments((current) => current.filter((item) => item.id !== comment.id));
      notify("Komentar dihapus.", "success");
    } catch (err) {
      notify(errorMessage(err), "error");
    }
  }

  async function deletePhoto() {
    if (!window.confirm("Hapus karya ini? Tindakan ini tidak bisa dibatalkan.")) return;
    try {
      await api(`/photos/${id}`, { method: "DELETE" });
      notify("Karya dihapus.", "success");
      router.push(`/u/${data?.photo.user.username ?? ""}`);
    } catch (err) {
      notify(errorMessage(err), "error");
    }
  }

  if (error) {
    return (
      <div className="wrap page-narrow">
        <ErrorBox message={error} />
        <div className="center mt-24">
          <Link className="link" href="/">
            ← Kembali ke beranda
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="wrap">
        <div className="detail-grid">
          <div className="skeleton" style={{ aspectRatio: "4 / 5" }} />
          <div className="stack">
            <div className="skeleton line" style={{ width: "60%", height: 20 }} />
            <div className="skeleton line" style={{ width: "85%" }} />
            <div className="skeleton line" style={{ width: "40%" }} />
          </div>
        </div>
      </div>
    );
  }

  const { photo, more_from_user } = data;
  const isOwner = user?.id === photo.user.id || user?.is_admin;

  return (
    <div className="wrap">
      <div className="row-between mb-16">
        <Link className="text-sm muted" href={`/u/${photo.user.username}`}>
          ← Karya {photo.user.name}
        </Link>
        <span className="text-xs muted" style={{ fontFamily: "var(--font-mono)" }}>
          {timeAgo(photo.created_at)}
        </span>
      </div>

      <div className="detail-grid">
        <div>
          <figure className="detail-media mt-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt={photo.caption ?? `Karya ${photo.user.name}`} />
          </figure>

          {photo.album ? (
            <p className="text-sm muted mt-16">
              Bagian dari album <b>{photo.album.title ?? "Tanpa judul"}</b>
            </p>
          ) : null}

          {photo.caption ? (
            <p className="mt-16" style={{ fontFamily: "var(--font-serif)", fontSize: 20, lineHeight: 1.5 }}>
              {photo.caption}
            </p>
          ) : null}

          {photo.hashtags.length ? (
            <div className="row mt-16">
              {photo.hashtags.map((tag) => (
                <Link className="tag" key={tag} href={`/direktori?q=${encodeURIComponent(tag)}`}>
                  #{tag}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <aside className="detail-aside">
          <div className="panel">
            <div className="row-between">
              <Link className="photo-author" href={`/u/${photo.user.username}`} style={{ gap: 10 }}>
                <Avatar user={photo.user} size="md" />
                <span>
                  <b style={{ display: "block", color: "var(--ink)", fontSize: 14 }}>{photo.user.name}</b>
                  <span className="text-xs muted">@{photo.user.username}</span>
                </span>
              </Link>
              <Link className="btn btn-ghost btn-sm" href={`/u/${photo.user.username}`}>
                Profil
              </Link>
            </div>

            <div className="row mt-16" style={{ gap: 8 }}>
              <button
                type="button"
                className={liked ? "btn btn-sm" : "btn btn-ghost btn-sm"}
                onClick={toggleLike}
              >
                {liked ? "♥ Disukai" : "♡ Sukai"} · {compactNumber(likeCount)}
              </button>
              <Link className="btn btn-ghost btn-sm" href="#komentar">
                💬 {compactNumber(photo.comment_count)} komentar
              </Link>
              {isOwner ? (
                <button type="button" className="btn btn-danger btn-sm" onClick={deletePhoto}>
                  Hapus
                </button>
              ) : null}
            </div>
          </div>

          <div className="panel" id="komentar">
            <h3 className="panel-title" style={{ fontSize: 19 }}>
              Komentar
            </h3>
            <p className="panel-desc">
              {comments.length ? `${comments.length} tanggapan untuk karya ini.` : "Jadi yang pertama berkomentar."}
            </p>

            {comments.length ? (
              <div className="comment-list mb-16">
                {comments.map((comment) => (
                  <div className="comment" key={comment.id}>
                    <Avatar user={comment.user} size="sm" link />
                    <div style={{ flex: 1 }}>
                      <Link href={`/u/${comment.user.username}`} className="link" style={{ borderBottom: 0 }}>
                        <b>{comment.user.name}</b>
                      </Link>
                      <p>{comment.body}</p>
                      <div className="row" style={{ gap: 10 }}>
                        <time>{timeAgo(comment.created_at)}</time>
                        {comment.can_delete ? (
                          <button
                            type="button"
                            onClick={() => deleteComment(comment)}
                            style={{
                              border: 0,
                              background: "transparent",
                              fontSize: 10.5,
                              color: "var(--danger)",
                              fontFamily: "var(--font-mono)",
                              padding: 0,
                            }}
                          >
                            hapus
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {user ? (
              <form className="comment-form" onSubmit={submitComment}>
                <input
                  className="input"
                  aria-label="Tulis komentar"
                  placeholder="Tulis apresiasimu…"
                  maxLength={600}
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                />
                <button className="btn btn-sm" type="submit" disabled={busy || !commentText.trim()}>
                  {busy ? "…" : "Kirim"}
                </button>
              </form>
            ) : (
              <p className="text-sm muted">
                <Link className="link" href="/masuk">
                  Masuk
                </Link>{" "}
                untuk meninggalkan komentar.
              </p>
            )}
          </div>

          {more_from_user.length ? (
            <div className="panel">
              <h3 className="panel-title" style={{ fontSize: 19 }}>
                Karya lain dari {photo.user.name.split(" ")[0]}
              </h3>
              <div className="preview-grid">
                {more_from_user.map((item) => (
                  <Link className="preview-item" href={`/foto/${item.id}`} key={item.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt={item.caption ?? "Karya lain"} loading="lazy" />
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
