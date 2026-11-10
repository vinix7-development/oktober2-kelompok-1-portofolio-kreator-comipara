"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { timeAgo } from "@/lib/format";
import type { NotificationItem } from "@/lib/types";
import { Avatar } from "@/components/avatar";
import { EmptyState, ErrorBox } from "@/components/ui";
import { useToast } from "@/components/toast";

export function NotificationsView() {
  const { user, loading } = useAuth();
  const { notify } = useToast();
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await api<{ data: NotificationItem[]; unread: number }>("/me/notifications");
      setItems(res.data);
      setUnread(res.unread);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/masuk");
      return;
    }
    if (user) void load();
  }, [loading, user, router, load]);

  async function readAll() {
    try {
      await api("/me/notifications/read", { method: "POST" });
      setUnread(0);
      setItems((current) => current.map((item) => ({ ...item, read: true })));
      notify("Semua notifikasi ditandai sudah dibaca.", "success");
    } catch (err) {
      notify(errorMessage(err), "error");
    }
  }

  if (!ready) {
    return (
      <div className="wrap page-narrow">
        <div className="skeleton" style={{ height: 60 }} />
        <div className="skeleton mt-16" style={{ height: 200 }} />
      </div>
    );
  }

  return (
    <div className="wrap page-narrow">
      <div className="section-head" style={{ marginTop: 0 }}>
        <div>
          <div className="eyebrow">✳ &nbsp;Notifikasi</div>
          <h1 className="section-title">
            Kabar dari <span className="serif-italic">komunitas.</span>
          </h1>
          <p>{unread > 0 ? `${unread} notifikasi belum dibaca.` : "Semua notifikasi sudah dibaca."}</p>
        </div>
        {unread > 0 ? (
          <button type="button" className="btn btn-ghost btn-sm" onClick={readAll}>
            Tandai semua dibaca
          </button>
        ) : null}
      </div>

      {error ? <ErrorBox message={error} /> : null}

      {items.length === 0 ? (
        <EmptyState
          title="Belum ada notifikasi"
          description="Saat ada yang menyukai, mengomentari, atau mengikuti kamu, kabarnya muncul di sini."
          action={{ href: "/direktori", label: "Jelajahi kreator" }}
        />
      ) : (
        <div className="notif-list">
          {items.map((item) => {
            const href = item.photo
              ? `/foto/${item.photo.id}`
              : item.actor
                ? `/u/${item.actor.username}`
                : "/";
            return (
              <Link className={item.read ? "notif" : "notif unread"} href={href} key={item.id}>
                {item.actor ? (
                  <Avatar user={item.actor} size="md" />
                ) : (
                  <span className="avatar md" aria-hidden="true">
                    ✳
                  </span>
                )}
                <div style={{ flex: 1 }}>
                  <div>{item.message ?? "Ada aktivitas baru."}</div>
                  <small>{timeAgo(item.created_at)}</small>
                </div>
                {!item.read ? <span className="dot" aria-label="Belum dibaca" /> : null}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
