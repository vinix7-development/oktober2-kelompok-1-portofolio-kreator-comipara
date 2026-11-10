"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDate, formatRange } from "@/lib/format";
import type { Attendance, EventItem } from "@/lib/types";
import { Avatar } from "@/components/avatar";
import { ErrorBox, StatusBadge } from "@/components/ui";
import { useToast } from "@/components/toast";

type Tab = "ringkasan" | "kehadiran" | "event";

type Counts = {
  creators: number;
  photos: number;
  events: number;
  pending_attendances: number;
  comments: number;
};

const EMPTY_EVENT = {
  id: 0,
  title: "",
  description: "",
  location: "",
  starts_at: "",
  ends_at: "",
};

export function AdminView() {
  const { user, loading } = useAuth();
  const { notify } = useToast();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("ringkasan");
  const [counts, setCounts] = useState<Counts | null>(null);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [form, setForm] = useState(EMPTY_EVENT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/masuk");
    }
  }, [loading, user, router]);

  const loadDashboard = useCallback(async () => {
    try {
      const res = await api<{ counts: Counts }>("/admin/dashboard");
      setCounts(res.counts);
    } catch (err) {
      setError(errorMessage(err));
    }
  }, []);

  const loadAttendances = useCallback(async (status: string) => {
    try {
      const suffix = status && status !== "all" ? `?status=${status}` : "";
      const res = await api<{ data: Attendance[] }>(`/admin/attendances${suffix}`);
      setAttendances(res.data);
    } catch (err) {
      setError(errorMessage(err));
    }
  }, []);

  const loadEvents = useCallback(async () => {
    try {
      const res = await api<{ data: EventItem[] }>("/events");
      setEvents(res.data);
    } catch (err) {
      setError(errorMessage(err));
    }
  }, []);

  useEffect(() => {
    if (!user?.is_admin) return;
    void loadDashboard();
    void loadEvents();
  }, [user?.is_admin, loadDashboard, loadEvents]);

  useEffect(() => {
    if (!user?.is_admin) return;
    void loadAttendances(statusFilter);
  }, [user?.is_admin, statusFilter, loadAttendances]);

  async function review(attendance: Attendance, status: "approved" | "rejected") {
    try {
      await api(`/admin/attendances/${attendance.id}`, {
        method: "PATCH",
        body: { status },
      });
      notify(status === "approved" ? "Kehadiran disetujui." : "Kehadiran ditolak.", "success");
      await Promise.all([loadAttendances(statusFilter), loadDashboard()]);
    } catch (err) {
      notify(errorMessage(err), "error");
    }
  }

  async function saveEvent(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const body = {
        title: form.title,
        description: form.description,
        location: form.location,
        starts_at: form.starts_at,
        ends_at: form.ends_at,
      };

      if (form.id) {
        await api(`/admin/events/${form.id}`, { method: "PUT", body });
        notify("Event diperbarui.", "success");
      } else {
        await api("/admin/events", { method: "POST", body });
        notify("Event dibuat.", "success");
      }

      setForm(EMPTY_EVENT);
      await Promise.all([loadEvents(), loadDashboard()]);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function deleteEvent(event: EventItem) {
    if (!window.confirm(`Hapus event “${event.title}”? Pendaftaran booth ikut terhapus.`)) return;
    try {
      await api(`/admin/events/${event.id}`, { method: "DELETE" });
      notify("Event dihapus.", "success");
      await Promise.all([loadEvents(), loadDashboard()]);
    } catch (err) {
      notify(errorMessage(err), "error");
    }
  }

  if (loading) {
    return (
      <div className="wrap">
        <div className="skeleton" style={{ height: 220 }} />
      </div>
    );
  }

  if (!user?.is_admin) {
    return (
      <div className="wrap page-narrow">
        <div className="empty">
          <span className="mark">✳</span>
          <h3>Halaman khusus admin</h3>
          <p>Masuk dengan akun admin untuk mengelola event dan kehadiran kreator.</p>
          <Link className="btn btn-ghost btn-sm" href="/masuk">
            Masuk sebagai admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <div className="section-head" style={{ marginTop: 0 }}>
        <div>
          <div className="eyebrow">✳ &nbsp;Panel admin</div>
          <h1 className="section-title">
            Kelola <span className="serif-italic">Comipara.</span>
          </h1>
          <p>Buat event, tinjau pendaftaran booth, dan pantau statistik komunitas.</p>
        </div>
        <Link className="btn btn-ghost btn-sm" href="/">
          Lihat situs
        </Link>
      </div>

      {error ? <ErrorBox message={error} /> : null}

      <div className="admin-tabs">
        {(
          [
            ["ringkasan", "Ringkasan"],
            ["kehadiran", `Kehadiran${counts?.pending_attendances ? ` · ${counts.pending_attendances}` : ""}`],
            ["event", "Event"],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={tab === key ? "active" : undefined}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "ringkasan" ? (
        <>
          <div className="stats" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {[
              ["Kreator", counts?.creators ?? "—"],
              ["Karya", counts?.photos ?? "—"],
              ["Event", counts?.events ?? "—"],
              ["Booth menunggu", counts?.pending_attendances ?? "—"],
            ].map(([label, value]) => (
              <div className="stat" key={label as string}>
                <b>{value}</b>
                <small>{label}</small>
              </div>
            ))}
          </div>

          <div className="panel mt-24">
            <div className="row-between">
              <div>
                <h2 className="panel-title">Pendaftaran menunggu tinjauan</h2>
                <p className="panel-desc" style={{ marginBottom: 0 }}>
                  Setujui untuk menampilkan badge booth di profil kreator.
                </p>
              </div>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setTab("kehadiran")}>
                Buka daftar
              </button>
            </div>

            <div className="mt-16">
              <PendingList />
            </div>
          </div>
        </>
      ) : null}

      {tab === "kehadiran" ? (
        <section>
          <div className="toolbar">
            <div className="chips">
              {[
                ["pending", "Menunggu"],
                ["approved", "Disetujui"],
                ["rejected", "Ditolak"],
                ["all", "Semua"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={statusFilter === value ? "chip selected" : "chip"}
                  onClick={() => setStatusFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="text-xs muted">{attendances.length} pendaftaran</span>
          </div>

          {attendances.length === 0 ? (
            <p className="notice">Tidak ada pendaftaran pada filter ini.</p>
          ) : (
            <div className="table-wrap">
              <table className="admin">
                <thead>
                  <tr>
                    <th>Kreator</th>
                    <th>Event</th>
                    <th>Booth</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {attendances.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="row" style={{ gap: 8 }}>
                          {item.user ? <Avatar user={item.user} size="sm" /> : null}
                          <div>
                            <b>{item.user?.name ?? "—"}</b>
                            <div className="text-xs muted">@{item.user?.username}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {item.event ? (
                          <Link className="link" href={`/event/${item.event.slug}`} style={{ borderBottom: 0 }}>
                            {item.event.title}
                          </Link>
                        ) : (
                          "—"
                        )}
                        <div className="text-xs muted">
                          {item.event ? formatRange(item.event.starts_at, item.event.ends_at) : ""}
                        </div>
                      </td>
                      <td style={{ fontFamily: "var(--font-mono)" }}>{item.booth_number}</td>
                      <td>
                        <StatusBadge status={item.status} />
                      </td>
                      <td>
                        <div className="row" style={{ gap: 6, flexWrap: "nowrap" }}>
                          {item.status !== "approved" ? (
                            <button
                              type="button"
                              className="btn btn-sm"
                              onClick={() => review(item, "approved")}
                            >
                              Setujui
                            </button>
                          ) : null}
                          {item.status !== "rejected" ? (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => review(item, "rejected")}
                            >
                              Tolak
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}

      {tab === "event" ? (
        <div className="detail-grid">
          <section>
            <h2 className="panel-title mb-16">Daftar event</h2>
            <div className="event-list">
              {events.map((event) => (
                <article className="event-card" key={event.id}>
                  <div>
                    <div className="event-date">{formatRange(event.starts_at, event.ends_at)}</div>
                    <h3 style={{ fontSize: 20 }}>
                      <Link href={`/event/${event.slug}`}>{event.title}</Link>
                    </h3>
                    <p className="muted text-sm mt-8">
                      ⌖ {event.location} · ◈ {event.attendee_count} booth
                    </p>
                  </div>
                  <div className="row" style={{ gap: 6 }}>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() =>
                        setForm({
                          id: event.id,
                          title: event.title,
                          description: event.description ?? "",
                          location: event.location,
                          starts_at: event.starts_at,
                          ends_at: event.ends_at,
                        })
                      }
                    >
                      Ubah
                    </button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteEvent(event)}>
                      Hapus
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="detail-aside">
            <form className="panel form-grid" onSubmit={saveEvent}>
              <div>
                <h2 className="panel-title" style={{ fontSize: 20 }}>
                  {form.id ? "Ubah event" : "Event baru"}
                </h2>
                <p className="panel-desc" style={{ marginBottom: 12 }}>
                  {form.id ? `Mengubah “${form.title}”` : "Isi detail event Comipara."}
                </p>
              </div>

              <div className="field">
                <label htmlFor="event-title">Nama event</label>
                <input
                  id="event-title"
                  className="input"
                  required
                  minLength={3}
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                />
              </div>

              <div className="field">
                <label htmlFor="event-location">Lokasi</label>
                <input
                  id="event-location"
                  className="input"
                  required
                  value={form.location}
                  onChange={(event) => setForm({ ...form, location: event.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="event-start">Mulai</label>
                  <input
                    id="event-start"
                    className="input"
                    type="date"
                    required
                    value={form.starts_at}
                    onChange={(event) => setForm({ ...form, starts_at: event.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="event-end">Selesai</label>
                  <input
                    id="event-end"
                    className="input"
                    type="date"
                    required
                    value={form.ends_at}
                    onChange={(event) => setForm({ ...form, ends_at: event.target.value })}
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="event-desc">Deskripsi</label>
                <textarea
                  id="event-desc"
                  className="textarea"
                  style={{ minHeight: 88 }}
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                />
              </div>

              <div className="row">
                <button className="btn grow" type="submit" disabled={busy}>
                  {busy ? "Menyimpan…" : form.id ? "Simpan perubahan" : "Buat event"}
                </button>
                {form.id ? (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setForm(EMPTY_EVENT)}
                  >
                    Batal
                  </button>
                ) : null}
              </div>
            </form>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function PendingList() {
  const [items, setItems] = useState<Attendance[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api<{ data: Attendance[] }>("/admin/attendances?status=pending");
        if (active) setItems(res.data.slice(0, 5));
      } catch {
        // abaikan
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (items.length === 0) {
    return <p className="notice">Semua pendaftaran sudah ditinjau. Kerja bagus ✳</p>;
  }

  return (
    <div className="stack-sm">
      {items.map((item) => (
        <div className="row-between" key={item.id}>
          <div className="row" style={{ gap: 8 }}>
            {item.user ? <Avatar user={item.user} size="sm" /> : null}
            <div className="text-sm">
              <b>{item.user?.name}</b>
              <div className="text-xs muted">
                {item.event?.title} · Booth {item.booth_number} · {formatDate(item.created_at ?? "")}
              </div>
            </div>
          </div>
          <StatusBadge status={item.status} />
        </div>
      ))}
    </div>
  );
}
