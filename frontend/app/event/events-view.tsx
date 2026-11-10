"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, errorMessage } from "@/lib/api";
import { formatRange } from "@/lib/format";
import type { EventItem } from "@/lib/types";
import { Avatar } from "@/components/avatar";
import { EmptyState, ErrorBox } from "@/components/ui";

export function EventsView() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api<{ data: EventItem[] }>("/events");
        if (active) setEvents(res.data);
      } catch (err) {
        if (active) setError(errorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const upcoming = events.filter((event) => !event.is_past);
  const past = events.filter((event) => event.is_past);

  return (
    <div className="wrap">
      <div className="section-head" style={{ marginTop: 0 }}>
        <div>
          <div className="eyebrow">✳ &nbsp;Event Comipara</div>
          <h1 className="section-title">
            Karya digital, <span className="serif-italic">pertemuan nyata.</span>
          </h1>
          <p>
            Comipara mempertemukan kreator lokal dengan pengunjung. Cek jadwal, lihat siapa saja yang
            hadir, dan catat nomor booth favoritmu.
          </p>
        </div>
        <Link className="btn btn-ghost" href="/direktori">
          Cari kreator <span aria-hidden="true">↗</span>
        </Link>
      </div>

      {error ? <ErrorBox message={error} /> : null}

      {loading ? (
        <div className="event-list" aria-hidden="true">
          {[0, 1].map((item) => (
            <div className="skeleton" key={item} style={{ height: 140 }} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          title="Belum ada event"
          description="Admin belum menambahkan event Comipara. Cek kembali nanti."
          action={{ href: "/", label: "Kembali ke beranda" }}
        />
      ) : (
        <>
          <h2 className="panel-title mb-16">Akan datang</h2>
          {upcoming.length === 0 ? (
            <p className="notice mb-16">Belum ada event mendatang. Lihat arsip event sebelumnya di bawah.</p>
          ) : (
            <div className="event-list">
              {upcoming.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </div>
          )}

          {past.length ? (
            <>
              <h2 className="panel-title mt-32 mb-16">Arsip event</h2>
              <div className="event-list">
                {past.map((event) => (
                  <EventRow key={event.id} event={event} past />
                ))}
              </div>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}

function EventRow({ event, past = false }: { event: EventItem; past?: boolean }) {
  return (
    <article className="event-card" style={past ? { opacity: 0.82 } : undefined}>
      <div>
        <div className="event-date">{formatRange(event.starts_at, event.ends_at)}</div>
        <h3>
          <Link href={`/event/${event.slug}`}>{event.title}</Link>
        </h3>
        <p className="muted mt-8">
          ⌖ {event.location} · ◈ {event.attendee_count} kreator terdaftar
        </p>

        {event.attendees?.length ? (
          <div className="row mt-16" style={{ gap: 6 }}>
            {event.attendees.slice(0, 6).map((attendee) => (
              <Avatar user={attendee} size="sm" key={attendee.id} />
            ))}
            {event.attendee_count > 6 ? (
              <span className="text-xs muted">+{event.attendee_count - 6} lainnya</span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="stack-sm" style={{ alignItems: "flex-end" }}>
        {event.my_attendance ? (
          <span className={`status ${event.my_attendance.status}`}>
            Booth {event.my_attendance.booth_number} ·{" "}
            {event.my_attendance.status === "approved"
              ? "disetujui"
              : event.my_attendance.status === "rejected"
                ? "ditolak"
                : "menunggu"}
          </span>
        ) : null}
        <Link className="btn btn-ghost btn-sm" href={`/event/${event.slug}`}>
          {past ? "Lihat arsip" : "Detail event"} <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
