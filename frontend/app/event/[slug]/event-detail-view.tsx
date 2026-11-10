"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatRange } from "@/lib/format";
import type { EventDetail } from "@/lib/types";
import { Avatar } from "@/components/avatar";
import { ErrorBox, StatusBadge } from "@/components/ui";
import { useToast } from "@/components/toast";

export function EventDetailView({ slug }: { slug: string }) {
  const { user } = useAuth();
  const { notify } = useToast();
  const [data, setData] = useState<EventDetail | null>(null);
  const [error, setError] = useState("");
  const [booth, setBooth] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api<EventDetail>(`/events/${slug}`);
      setData(res);
      if (res.event.my_attendance) {
        setBooth(res.event.my_attendance.booth_number);
      }
    } catch (err) {
      setError(errorMessage(err));
    }
  }, [slug]);

  useEffect(() => {
    void load();
  }, [load]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!data) return;

    setBusy(true);
    try {
      await api(`/events/${data.event.id}/attendance`, {
        method: "POST",
        body: { booth_number: booth.trim() },
      });
      notify("Pendaftaran terkirim. Menunggu persetujuan admin.", "success");
      await load();
    } catch (err) {
      notify(errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    if (!data) return;
    if (!window.confirm("Batalkan pendaftaran kehadiran?")) return;
    setBusy(true);
    try {
      await api(`/events/${data.event.id}/attendance`, { method: "DELETE" });
      setBooth("");
      notify("Pendaftaran dibatalkan.", "success");
      await load();
    } catch (err) {
      notify(errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  if (error) {
    return (
      <div className="wrap page-narrow">
        <ErrorBox message={error} />
        <div className="center mt-24">
          <Link className="link" href="/event">
            ← Semua event
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="wrap">
        <div className="skeleton" style={{ height: 260 }} />
        <div className="skeleton mt-16" style={{ height: 180 }} />
      </div>
    );
  }

  const { event, attendees } = data;
  const attendance = event.my_attendance;

  return (
    <div className="wrap">
      <div className="row-between mb-16">
        <Link className="text-sm muted" href="/event">
          ← Semua event
        </Link>
        {user?.is_admin ? (
          <Link className="btn btn-ghost btn-sm" href="/admin">
            Kelola event
          </Link>
        ) : null}
      </div>

      <section className="event-hero">
        <div>
          <div className="eyebrow">{event.is_past ? "Arsip event" : "Akan datang"}</div>
          <h1>{event.title}</h1>
          <p style={{ color: "rgba(246,240,228,0.78)", maxWidth: "56ch", fontSize: 15 }}>
            {event.description ?? "Pameran dan bazar kreator lokal Comipara."}
          </p>
          <div className="event-meta">
            <span>⌖ {event.location}</span>
            <span>◷ {formatRange(event.starts_at, event.ends_at)}</span>
            <span>◈ {attendees.length} kreator hadir</span>
          </div>
        </div>
        <span className="tag" style={{ background: "rgba(246,240,228,0.12)", borderColor: "rgba(246,240,228,0.3)", color: "#f6f0e4" }}>
          {event.is_past ? "Selesai" : "Booth terbuka"}
        </span>
      </section>

      <div className="detail-grid mt-32">
        <section>
          <div className="gallery-head" style={{ marginTop: 0 }}>
            <h2 className="section-title" style={{ fontSize: 26 }}>
              Kreator yang hadir
            </h2>
            <span className="text-sm muted">{attendees.length} booth terisi</span>
          </div>

          {attendees.length === 0 ? (
            <p className="notice">Belum ada kreator yang disetujui untuk event ini.</p>
          ) : (
            <div className="creator-grid">
              {attendees.map((item) => {
                const profile = item.user.creator_profile;
                return (
                  <article className="creator-card" key={item.id}>
                    <div className="creator-main">
                      <div className="creator-id">
                        <Avatar user={item.user} size="md" link />
                        <div style={{ minWidth: 0 }}>
                          <h3>
                            <Link href={`/u/${item.user.username}`}>{item.user.name}</Link>
                          </h3>
                          <small>
                            @{item.user.username}
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

                      <div className="creator-foot">
                        <span className="booth">
                          <span>⌖</span> Booth <b>{item.booth_number}</b>
                        </span>
                        <Link className="btn btn-ghost btn-sm" href={`/u/${item.user.username}`}>
                          Lihat profil
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside className="detail-aside">
          <div className="panel">
            <h3 className="panel-title" style={{ fontSize: 20 }}>
              Daftarkan booth-mu
            </h3>
            <p className="panel-desc">
              Khusus kreator dengan profil lengkap. Admin akan meninjau pendaftaran sebelum badge
              tampil di profilmu.
            </p>

            {!user ? (
              <div className="stack">
                <p className="notice">Masuk dulu untuk mendaftarkan kehadiran.</p>
                <Link className="btn btn-block" href="/masuk">
                  Masuk
                </Link>
              </div>
            ) : !user.is_creator || !user.creator_profile ? (
              <div className="stack">
                <p className="notice">
                  Aktifkan dan lengkapi profil kreator dulu sebelum mendaftar ke event.
                </p>
                <Link className="btn btn-block" href="/pengaturan">
                  Lengkapi profil kreator
                </Link>
              </div>
            ) : event.is_past ? (
              <p className="notice">Event ini sudah selesai. Pendaftaran ditutup.</p>
            ) : attendance ? (
              <div className="stack">
                <div className="row-between">
                  <span className="text-sm">Status pendaftaran</span>
                  <StatusBadge status={attendance.status} />
                </div>
                <div className="row-between">
                  <span className="text-sm muted">Nomor booth</span>
                  <b style={{ fontFamily: "var(--font-mono)" }}>{attendance.booth_number}</b>
                </div>

                {attendance.status === "approved" ? (
                  <p className="notice success">
                    Badge “Hadir di {event.title} · Booth {attendance.booth_number}” sudah tampil di profilmu.
                  </p>
                ) : attendance.status === "rejected" ? (
                  <p className="notice error">
                    Pendaftaran belum disetujui. Kamu bisa memperbaiki nomor booth lalu kirim ulang.
                  </p>
                ) : (
                  <p className="notice">Menunggu persetujuan admin. Kamu masih bisa mengubah nomor booth.</p>
                )}

                <form className="form-grid" onSubmit={submit}>
                  <div className="field">
                    <label htmlFor="booth">Nomor booth</label>
                    <input
                      id="booth"
                      className="input"
                      required
                      maxLength={12}
                      placeholder="Contoh: B-12"
                      value={booth}
                      onChange={(event) => setBooth(event.target.value)}
                    />
                  </div>
                  <button className="btn btn-block" type="submit" disabled={busy || !booth.trim()}>
                    {busy ? "Menyimpan…" : "Kirim ulang pendaftaran"}
                  </button>
                  <button type="button" className="btn btn-danger btn-block" onClick={cancel} disabled={busy}>
                    Batalkan pendaftaran
                  </button>
                </form>
              </div>
            ) : (
              <form className="form-grid" onSubmit={submit}>
                <div className="field">
                  <label htmlFor="booth">Nomor booth</label>
                  <input
                    id="booth"
                    className="input"
                    required
                    maxLength={12}
                    placeholder="Contoh: B-12"
                    value={booth}
                    onChange={(event) => setBooth(event.target.value)}
                  />
                  <span className="hint">Nomor booth tidak boleh sama dengan kreator lain yang sudah disetujui.</span>
                </div>
                <button className="btn btn-block" type="submit" disabled={busy || !booth.trim()}>
                  {busy ? "Mengirim…" : "Daftar kehadiran"}
                </button>
              </form>
            )}
          </div>

          <div className="panel">
            <h3 className="panel-title" style={{ fontSize: 20 }}>
              Info event
            </h3>
            <div className="stack-sm text-sm">
              <div className="row-between">
                <span className="muted">Tanggal</span>
                <span>{formatRange(event.starts_at, event.ends_at)}</span>
              </div>
              <div className="row-between">
                <span className="muted">Lokasi</span>
                <span style={{ textAlign: "right" }}>{event.location}</span>
              </div>
              <div className="row-between">
                <span className="muted">Kreator</span>
                <span>{attendees.length} booth</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
