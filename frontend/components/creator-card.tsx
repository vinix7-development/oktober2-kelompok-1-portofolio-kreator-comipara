"use client";

import Link from "next/link";
import { useState } from "react";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { DirectoryCreator } from "@/lib/types";
import { Avatar } from "./avatar";
import { useToast } from "./toast";

export function CreatorCard({ creator }: { creator: DirectoryCreator }) {
  const { user } = useAuth();
  const { notify } = useToast();
  const [following, setFollowing] = useState(creator.is_following);
  const [busy, setBusy] = useState(false);

  const profile = creator.creator_profile;
  const isSelf = user?.id === creator.id;

  async function toggleFollow() {
    if (!user) {
      notify("Masuk dulu untuk mengikuti kreator.");
      return;
    }
    if (busy) return;

    setBusy(true);
    try {
      const res = await api<{ following: boolean }>(`/users/${creator.username}/follow`, {
        method: following ? "DELETE" : "POST",
      });
      setFollowing(res.following);
      notify(res.following ? `Mengikuti ${creator.name}.` : `Berhenti mengikuti ${creator.name}.`, "success");
    } catch (error) {
      notify(errorMessage(error), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="creator-card">
      <div className="creator-strip">
        {creator.latest_photos.length > 0 ? (
          creator.latest_photos.slice(0, 3).map((photo) => (
            <Link key={photo.id} href={`/foto/${photo.id}`} aria-label={`Karya ${creator.name}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt={photo.caption ?? `Karya ${creator.name}`} loading="lazy" />
            </Link>
          ))
        ) : (
          <div className="empty-strip">Belum ada karya</div>
        )}
      </div>

      <div className="creator-main">
        <div className="creator-id">
          <Avatar user={creator} size="md" link />
          <div style={{ minWidth: 0 }}>
            <h3>
              <Link href={`/u/${creator.username}`}>{creator.name}</Link>
            </h3>
            <small>
              @{creator.username}
              {profile?.city ? ` · ${profile.city}` : ""}
            </small>
          </div>
        </div>

        <div className="creator-meta">
          {(profile?.categories ?? []).map((category) => (
            <span className="tag" key={category}>
              {category}
            </span>
          ))}
          {profile ? (
            <span className={profile.commission_open ? "tag moss" : "tag"}>
              {profile.commission_open ? "Komisi buka" : "Komisi tutup"}
            </span>
          ) : null}
        </div>

        {creator.bio ? <p className="creator-bio">{creator.bio}</p> : null}

        <div className="creator-foot">
          {creator.attendance ? (
            <span className="booth" title={creator.attendance.label}>
              <span>⌖</span> Booth <b>{creator.attendance.booth_number}</b>
            </span>
          ) : (
            <span className="text-xs muted">Belum terdaftar di event</span>
          )}

          {!isSelf ? (
            <button
              type="button"
              className={following ? "btn btn-ghost btn-sm" : "btn btn-sm"}
              onClick={toggleFollow}
              disabled={busy}
            >
              {following ? "✓ Mengikuti" : "+ Ikuti"}
            </button>
          ) : (
            <Link className="btn btn-ghost btn-sm" href="/pengaturan">
              Atur profil
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
