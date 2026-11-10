"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/toast";
import type { Photo, User } from "@/lib/types";
import { Avatar } from "@/components/avatar";
import { PhotoCard } from "@/components/photo-card";
import { EmptyState, ErrorBox } from "@/components/ui";

type Payload = {
  user: User;
  photos: Photo[];
  meta: { current_page: number; last_page: number; total: number };
};

export function ProfileView({ username }: { username: string }) {
  const { user: me } = useAuth();
  const { notify } = useToast();
  const [data, setData] = useState<Payload | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api<Payload>(`/users/${username}`);
      setData(res);
      setPhotos(res.photos);
      setMeta(res.meta);
      setFollowing(res.user.is_following);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleFollow() {
    if (!me) {
      notify("Masuk dulu untuk mengikuti kreator.");
      return;
    }
    setBusy(true);
    try {
      const res = await api<{ following: boolean }>(`/users/${username}/follow`, {
        method: following ? "DELETE" : "POST",
      });
      setFollowing(res.following);
      notify(res.following ? "Mengikuti kreator." : "Berhenti mengikuti.", "success");
    } catch (err) {
      notify(errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  async function loadMore() {
    if (loading || meta.current_page >= meta.last_page) return;
    setLoading(true);
    try {
      const res = await api<{ data: Photo[]; meta: Payload["meta"] }>(
        `/users/${username}/photos?page=${meta.current_page + 1}`,
      );
      setPhotos((current) => [...current, ...res.data]);
      setMeta(res.meta);
    } catch (err) {
      notify(errorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <div className="wrap page-narrow">
        <ErrorBox message={error} />
        <div className="center mt-24">
          <Link className="link" href="/direktori">
            ← Kembali ke direktori
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="wrap">
        <div className="skeleton line" style={{ width: 220, height: 22 }} />
        <div className="skeleton mt-16" style={{ height: 200 }} />
      </div>
    );
  }

  const user = data.user;
  const profile = user.creator_profile;
  const isSelf = me?.id === user.id;

  return (
    <div className="wrap">
      <div className="mt-8">
        <Link className="text-sm muted" href="/direktori">
          ← Direktori kreator
        </Link>
      </div>

      <header className="profile-head mt-16">
        <Avatar user={user} size="xl" />

        <div>
          <div className="row" style={{ gap: 10 }}>
            <h1 className="profile-name">{user.name}</h1>
            {user.is_admin ? <span className="tag">Admin</span> : null}
          </div>
          <div className="profile-handle">@{user.username}</div>

          {profile?.categories?.length ? (
            <div className="creator-meta mt-8">
              {profile.categories.map((category) => (
                <Link className="tag accent" href={`/direktori?category=${encodeURIComponent(category)}`} key={category}>
                  {category}
                </Link>
              ))}
              {profile.city ? <span className="tag">⌖ {profile.city}</span> : null}
              <span className={profile.commission_open ? "tag moss" : "tag"}>
                {profile.commission_open ? "Komisi buka" : "Komisi tutup"}
              </span>
            </div>
          ) : null}

          {user.bio ? <p className="profile-bio">{user.bio}</p> : null}

          {user.attendance ? (
            <Link className="badge-attend" href={`/event/${user.attendance.event_slug}`}>
              <span className="pulse" />
              {user.attendance.label}
            </Link>
          ) : null}

          {profile?.links && Object.values(profile.links).some(Boolean) ? (
            <div className="profile-links">
              {profile.links.instagram ? (
                <a
                  className="tag"
                  href={`https://instagram.com/${profile.links.instagram.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Instagram · {profile.links.instagram.replace(/^@/, "")}
                </a>
              ) : null}
              {profile.links.x ? (
                <a
                  className="tag"
                  href={`https://x.com/${profile.links.x.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  X · {profile.links.x.replace(/^@/, "")}
                </a>
              ) : null}
              {profile.links.tiktok ? (
                <a
                  className="tag"
                  href={`https://tiktok.com/@${profile.links.tiktok.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  TikTok · {profile.links.tiktok.replace(/^@/, "")}
                </a>
              ) : null}
              {profile.links.website ? (
                <a className="tag" href={profile.links.website} target="_blank" rel="noreferrer noopener">
                  Website ↗
                </a>
              ) : null}
            </div>
          ) : null}

          <div className="profile-stats">
            <div>
              <b>{user.stats.photos}</b>
              <small>Karya</small>
            </div>
            <div>
              <b>{user.stats.followers}</b>
              <small>Pengikut</small>
            </div>
            <div>
              <b>{user.stats.following}</b>
              <small>Mengikuti</small>
            </div>
          </div>
        </div>

        <div className="profile-actions row">
          {isSelf ? (
            <>
              <Link className="btn" href="/unggah">
                + Unggah karya
              </Link>
              <Link className="btn btn-ghost" href="/pengaturan">
                Pengaturan
              </Link>
            </>
          ) : (
            <>
              <button
                type="button"
                className={following ? "btn btn-ghost" : "btn"}
                onClick={toggleFollow}
                disabled={busy}
              >
                {following ? "✓ Mengikuti" : "+ Ikuti"}
              </button>
              <Link className="btn btn-ghost" href={`/direktori?q=${user.username}`}>
                Kreator serupa
              </Link>
            </>
          )}
        </div>
      </header>

      {profile?.description && profile.description !== user.bio ? (
        <p className="mt-24 text-sm" style={{ color: "var(--ink-soft)", maxWidth: "70ch" }}>
          {profile.description}
        </p>
      ) : null}

      <div className="gallery-head">
        <h2 className="section-title" style={{ fontSize: 26 }}>
          Karya {user.name.split(" ")[0]}
        </h2>
        <span className="text-sm muted">{meta.total} karya</span>
      </div>

      {photos.length === 0 ? (
        <EmptyState
          title="Belum ada karya"
          description={
            isSelf
              ? "Unggah karya pertamamu supaya pengunjung bisa melihat portofoliomu."
              : "Kreator ini belum mengunggah karya."
          }
          action={isSelf ? { href: "/unggah", label: "Unggah sekarang" } : undefined}
        />
      ) : (
        <>
          <div className="photo-grid">
            {photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>

          {meta.current_page < meta.last_page ? (
            <div className="center mt-24">
              <button type="button" className="btn btn-ghost" onClick={loadMore} disabled={loading}>
                {loading ? "Memuat…" : "Muat karya lainnya"}
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
