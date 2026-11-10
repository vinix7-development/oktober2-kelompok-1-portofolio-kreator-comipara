"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { compactNumber, formatRange } from "@/lib/format";
import type { DirectoryList, EventItem, Photo, PhotoList } from "@/lib/types";
import { CreatorCard } from "@/components/creator-card";
import { PhotoCard, PhotoGridSkeleton } from "@/components/photo-card";
import { EmptyState, ErrorBox } from "@/components/ui";

type Stats = { creators: number; photos: number; appreciations: number; events: number };

export function HomeView() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [creators, setCreators] = useState<DirectoryList["data"]>([]);
  const [event, setEvent] = useState<EventItem | null>(null);
  const [mode, setMode] = useState<"latest" | "following">("latest");
  const [tag, setTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const loadFeed = useCallback(
    async (nextMode: "latest" | "following", nextTag: string | null, page = 1) => {
      const params = new URLSearchParams();
      if (nextMode === "following") params.set("scope", "following");
      if (nextTag) params.set("tag", nextTag);
      params.set("page", String(page));

      const res = await api<PhotoList>(`/feed?${params.toString()}`);
      return res;
    },
    [],
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    (async () => {
      try {
        const res = await loadFeed(mode, tag, 1);
        if (!active) return;
        setPhotos(res.data);
        setMeta(res.meta);
      } catch (err) {
        if (active) {
          setError(errorMessage(err));
          setPhotos([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [mode, tag, loadFeed]);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [statsRes, directoryRes, eventsRes] = await Promise.all([
          api<Stats>("/stats"),
          api<DirectoryList>("/direktori?sort=followers"),
          api<{ data: EventItem[] }>("/events"),
        ]);
        if (!active) return;
        setStats(statsRes);
        setCreators(directoryRes.data.slice(0, 3));
        setEvent(eventsRes.data.find((item) => !item.is_past) ?? eventsRes.data[0] ?? null);
      } catch {
        // bagian pelengkap; feed tetap tampil walau ini gagal
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  async function loadMore() {
    if (loadingMore || meta.current_page >= meta.last_page) return;
    setLoadingMore(true);
    try {
      const res = await loadFeed(mode, tag, meta.current_page + 1);
      setPhotos((current) => [...current, ...res.data]);
      setMeta(res.meta);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoadingMore(false);
    }
  }

  const heroPhoto = photos[0];
  const tags = Array.from(new Set(photos.flatMap((photo) => photo.hashtags))).slice(0, 5);

  return (
    <div className="wrap">
      <section className="hero" id="home">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="dot" /> Ruang kreatif lokal
          </div>
          <h1>
            Karya lokal,
            <br />
            cerita <span className="serif-italic">personal.</span>
          </h1>
          <p>
            Temukan kreator lokal, jelajahi karya mereka, dan temui langsung di booth Comipara.
            Satu tempat untuk ilustrasi, cosplay, fotografi, dan kerajinan tangan.
          </p>
          <div className="hero-cta-row">
            <Link className="btn" href="/direktori">
              Jelajahi kreator <span aria-hidden="true">↘</span>
            </Link>
            <Link className="btn btn-ghost" href="/event">
              Lihat event Comipara
            </Link>
          </div>
          <div className="row mt-24" style={{ gap: 12 }}>
            <span className="text-sm muted">Sudah punya akun?</span>
            <Link className="link text-sm" href="/masuk">
              Masuk
            </Link>
            <span className="muted">·</span>
            <Link className="link text-sm" href="/daftar">
              Daftar sebagai kreator
            </Link>
          </div>
        </div>

        <div className="hero-art">
          <div className="hero-frame">
            {heroPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={heroPhoto.url} alt={heroPhoto.caption ?? "Karya kreator lokal"} />
            ) : (
              <div className="skeleton media" style={{ borderRadius: 12 }} />
            )}
            <span className="hero-stamp">
              KARYA
              <br />
              LOKAL
              <br />
              <b>✳</b>
            </span>
          </div>
          <div className="hero-note">
            <span aria-hidden="true">✳</span>
            <div>
              <b>Temukan cerita baru</b>
              <small>Dibuat dengan sepenuh hati</small>
            </div>
          </div>
          <div className="hero-caption">FIG. 01 — KARYA DARI KOMUNITAS</div>
        </div>
      </section>

      <section className="stats" aria-label="Statistik komunitas">
        <div className="stat">
          <b>
            {stats ? stats.creators : "—"}
            <span>+</span>
          </b>
          <small>Kreator lokal</small>
        </div>
        <div className="stat">
          <b>
            {stats ? stats.photos : "—"}
            <span>+</span>
          </b>
          <small>Karya dibagikan</small>
        </div>
        <div className="stat">
          <b>{stats ? compactNumber(stats.appreciations) : "—"}</b>
          <small>Apresiasi diberikan</small>
        </div>
        <div className="stats-message">
          Satu ruang untuk karya
          <br />
          yang punya <em>cerita.</em>
        </div>
      </section>

      <section id="karya">
        <div className="section-head">
          <div>
            <div className="eyebrow">✳ &nbsp;Karya terbaru</div>
            <h2 className="section-title">
              Baru dari <span className="serif-italic">komunitas.</span>
            </h2>
            <p>Klik karya untuk membaca cerita di baliknya, beri apresiasi, atau tinggalkan komentar.</p>
          </div>
          <Link className="btn btn-ghost btn-sm" href="/direktori">
            Cari kreator <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="toolbar">
          <div className="chips">
            <button
              type="button"
              className={mode === "latest" && !tag ? "chip selected" : "chip"}
              onClick={() => {
                setTag(null);
                setMode("latest");
              }}
            >
              Terbaru
            </button>
            {user ? (
              <button
                type="button"
                className={mode === "following" && !tag ? "chip selected" : "chip"}
                onClick={() => {
                  setTag(null);
                  setMode("following");
                }}
              >
                Diikuti
              </button>
            ) : null}
            {tags.map((item) => (
              <button
                key={item}
                type="button"
                className={tag === item ? "chip selected" : "chip"}
                onClick={() => setTag(tag === item ? null : item)}
              >
                #{item}
              </button>
            ))}
          </div>
          <span className="text-xs muted">
            {meta.total ? `${meta.total} karya` : ""}
          </span>
        </div>

        {error ? <ErrorBox message={error} /> : null}

        {loading ? (
          <PhotoGridSkeleton />
        ) : photos.length === 0 ? (
          <EmptyState
            title={mode === "following" ? "Feed pengikut masih kosong" : "Belum ada karya di sini"}
            description={
              mode === "following"
                ? "Ikuti beberapa kreator di direktori, karya mereka akan muncul di sini."
                : "Coba tag lain atau kembali lagi nanti."
            }
            action={{ href: "/direktori", label: "Buka direktori kreator" }}
          />
        ) : (
          <div className="photo-grid">
            {photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        )}

        {meta.current_page < meta.last_page ? (
          <div className="center mt-24">
            <button type="button" className="btn btn-ghost" onClick={loadMore} disabled={loadingMore}>
              {loadingMore ? "Memuat…" : "Muat karya lainnya"}
            </button>
          </div>
        ) : null}
      </section>

      <section id="direktori">
        <div className="section-head">
          <div>
            <div className="eyebrow">✳ &nbsp;Kenalan dengan mereka</div>
            <h2 className="section-title">
              Ruang untuk <span className="serif-italic">karya hebat.</span>
            </h2>
          </div>
          <Link className="link text-sm" href="/direktori">
            Lihat semua kreator <span aria-hidden="true">↗</span>
          </Link>
        </div>

        {creators.length > 0 ? (
          <div className="creator-grid">
            {creators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        ) : (
          <div className="skeleton" style={{ height: 220 }} />
        )}
      </section>

      {event ? (
        <section className="event-hero mt-32" id="event">
          <div>
            <div className="eyebrow">Ketemu di dunia nyata</div>
            <h1>{event.title}</h1>
            <p style={{ color: "rgba(246,240,228,0.78)", maxWidth: "46ch", fontSize: 15 }}>
              {event.description ?? "Bawa pulang karya favoritmu. Temui orang di baliknya."}
            </p>
            <div className="event-meta">
              <span>⌖ {event.location}</span>
              <span>◷ {formatRange(event.starts_at, event.ends_at)}</span>
              <span>◈ {event.attendee_count} kreator terdaftar</span>
            </div>
          </div>
          <Link className="btn" href={`/event/${event.slug}`} style={{ background: "#f6f0e4", color: "#1c1b17" }}>
            Ikuti keseruannya <span aria-hidden="true">↗</span>
          </Link>
        </section>
      ) : null}
    </div>
  );
}
