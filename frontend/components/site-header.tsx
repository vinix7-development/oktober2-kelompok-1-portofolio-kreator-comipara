"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Avatar } from "./avatar";

const NAV = [
  { href: "/", label: "Jelajahi" },
  { href: "/direktori", label: "Direktori" },
  { href: "/event", label: "Event" },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="nav" aria-label="Navigasi utama">
      {NAV.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={active ? "active" : undefined}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        );
      })}
      <Link href="/unggah" onClick={onNavigate}>
        Unggah
      </Link>
    </nav>
  );
}

function NavWithPath({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() ?? "/";
  return <NavLinks pathname={pathname} onNavigate={onNavigate} />;
}

export function SiteHeader() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const accountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user) {
      setUnread(0);
      return;
    }

    let active = true;
    const load = async () => {
      try {
        const res = await api<{ unread: number }>("/me/notifications?unread=1");
        if (active) setUnread(res.unread);
      } catch {
        // diamkan; badge hanya informatif
      }
    };

    void load();
    const timer = window.setInterval(load, 45_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [user]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    setMenuOpen(false);
    router.push(query.trim() ? `/direktori?q=${encodeURIComponent(query.trim())}` : "/direktori");
  }

  async function handleLogout() {
    setAccountOpen(false);
    setMenuOpen(false);
    await logout();
    router.push("/");
  }

  return (
    <>
      <div className="announcement">
        <span aria-hidden="true">✳</span>
        <span>Pendaftaran kreator Comipara 2026 sudah dibuka</span>
        <Link href="/event">
          Lihat event <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <header className="topbar">
        <div className="wrap topbar-inner">
          <Link className="brand" href="/">
            <span className="brand-mark" aria-hidden="true">
              k.
            </span>
            <span>
              kreatorpara<span className="brand-dot">.</span>
            </span>
          </Link>

          <Suspense fallback={<NavLinks pathname="" />}>
            <NavWithPath />
          </Suspense>

          <div className="top-actions">
            <form className="search desktop-only" onSubmit={submitSearch} role="search">
              <span aria-hidden="true">⌕</span>
              <input
                aria-label="Cari kreator"
                placeholder="Cari kreator…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </form>

            {!loading && user ? (
              <>
                <Link className="icon-btn desktop-only" href="/notifikasi" aria-label="Notifikasi">
                  <span aria-hidden="true">◔</span>
                  {unread > 0 ? <span className="icon-badge">{unread > 9 ? "9+" : unread}</span> : null}
                </Link>

                {user.is_admin ? (
                  <Link className="btn btn-ghost btn-sm desktop-only" href="/admin">
                    Admin
                  </Link>
                ) : null}

                <div ref={accountRef} style={{ position: "relative" }}>
                  <button
                    type="button"
                    className="avatar-btn"
                    onClick={() => setAccountOpen((value) => !value)}
                    aria-expanded={accountOpen}
                  >
                    <Avatar user={user} size="sm" />
                    <span className="desktop-only">{user.name.split(" ")[0]}</span>
                    <span aria-hidden="true">▾</span>
                  </button>

                  {accountOpen ? (
                    <div
                      className="panel"
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 46,
                        width: 210,
                        padding: 8,
                        zIndex: 50,
                        boxShadow: "var(--shadow-lift)",
                      }}
                    >
                      <Link
                        href={`/u/${user.username}`}
                        className="chip"
                        style={{ display: "block", border: 0, borderRadius: 8, padding: "9px 10px" }}
                        onClick={() => setAccountOpen(false)}
                      >
                        Profil saya
                      </Link>
                      <Link
                        href="/unggah"
                        className="chip"
                        style={{ display: "block", border: 0, borderRadius: 8, padding: "9px 10px" }}
                        onClick={() => setAccountOpen(false)}
                      >
                        Unggah karya
                      </Link>
                      <Link
                        href="/pengaturan"
                        className="chip"
                        style={{ display: "block", border: 0, borderRadius: 8, padding: "9px 10px" }}
                        onClick={() => setAccountOpen(false)}
                      >
                        Pengaturan
                      </Link>
                      <Link
                        href="/notifikasi"
                        className="chip"
                        style={{ display: "block", border: 0, borderRadius: 8, padding: "9px 10px" }}
                        onClick={() => setAccountOpen(false)}
                      >
                        Notifikasi{unread > 0 ? ` · ${unread}` : ""}
                      </Link>
                      {user.is_admin ? (
                        <Link
                          href="/admin"
                          className="chip"
                          style={{ display: "block", border: 0, borderRadius: 8, padding: "9px 10px" }}
                          onClick={() => setAccountOpen(false)}
                        >
                          Panel admin
                        </Link>
                      ) : null}
                      <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          border: 0,
                          background: "transparent",
                          borderRadius: 8,
                          padding: "9px 10px",
                          color: "var(--danger)",
                          fontSize: 14,
                        }}
                      >
                        Keluar
                      </button>
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}

            {!loading && !user ? (
              <>
                <Link className="btn btn-ghost btn-sm desktop-only" href="/masuk">
                  Masuk
                </Link>
                <Link className="btn btn-sm desktop-only" href="/daftar">
                  Gabung komunitas
                </Link>
              </>
            ) : null}

            <button
              type="button"
              className="icon-btn mobile-toggle"
              aria-label="Buka menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="mobile-nav">
            <div className="wrap mobile-nav-inner">
              <form className="search" onSubmit={submitSearch} role="search" style={{ marginBottom: 10 }}>
                <span aria-hidden="true">⌕</span>
                <input
                  aria-label="Cari kreator"
                  placeholder="Cari kreator…"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </form>

              <Suspense fallback={<NavLinks pathname="" onNavigate={() => setMenuOpen(false)} />}>
                <NavWithPath onNavigate={() => setMenuOpen(false)} />
              </Suspense>

              {user ? (
                <>
                  <Link href="/notifikasi" onClick={() => setMenuOpen(false)}>
                    Notifikasi <span>{unread > 0 ? unread : "→"}</span>
                  </Link>
                  <Link href="/pengaturan" onClick={() => setMenuOpen(false)}>
                    Pengaturan <span>→</span>
                  </Link>
                  {user.is_admin ? (
                    <Link href="/admin" onClick={() => setMenuOpen(false)}>
                      Panel admin <span>→</span>
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      border: 0,
                      background: "transparent",
                      textAlign: "left",
                      padding: "11px 4px",
                      color: "var(--danger)",
                    }}
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <Link href="/masuk" onClick={() => setMenuOpen(false)}>
                    Masuk <span>→</span>
                  </Link>
                  <Link href="/daftar" onClick={() => setMenuOpen(false)}>
                    Gabung komunitas <span>→</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : null}
      </header>
    </>
  );
}
