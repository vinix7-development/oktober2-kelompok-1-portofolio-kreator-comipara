"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Attendance, User } from "@/lib/types";
import { Avatar } from "@/components/avatar";
import { StatusBadge } from "@/components/ui";
import { useToast } from "@/components/toast";

const CATEGORIES = ["Illustrator", "Cosplayer", "Fotografer", "Crafter", "Lainnya"];

export function SettingsView() {
  const { user, loading, refresh, setUser } = useAuth();
  const { notify } = useToast();
  const router = useRouter();
  const avatarInput = useRef<HTMLInputElement | null>(null);

  const [profile, setProfile] = useState({ name: "", username: "", bio: "" });
  const [creator, setCreator] = useState({
    is_creator: false,
    categories: [] as string[],
    city: "",
    commission_open: true,
    description: "",
    instagram: "",
    x: "",
    tiktok: "",
    website: "",
  });
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [busyProfile, setBusyProfile] = useState(false);
  const [busyCreator, setBusyCreator] = useState(false);
  const [busyAvatar, setBusyAvatar] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/masuk");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;

    setProfile({ name: user.name, username: user.username, bio: user.bio ?? "" });
    const cp = user.creator_profile;
    setCreator({
      is_creator: user.is_creator,
      categories: cp?.categories ?? [],
      city: cp?.city ?? "",
      commission_open: cp?.commission_open ?? true,
      description: cp?.description ?? "",
      instagram: cp?.links?.instagram ?? "",
      x: cp?.links?.x ?? "",
      tiktok: cp?.links?.tiktok ?? "",
      website: cp?.links?.website ?? "",
    });

    (async () => {
      try {
        const res = await api<{ data: Attendance[] }>("/me/attendances");
        setAttendances(res.data);
      } catch {
        // daftar kehadiran hanya pelengkap
      }
    })();
  }, [user?.id]);

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setBusyProfile(true);
    try {
      const res = await api<{ user: User; message: string }>("/me", {
        method: "PATCH",
        body: { name: profile.name, username: profile.username, bio: profile.bio },
      });
      setUser(res.user);
      notify(res.message, "success");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyProfile(false);
    }
  }

  async function uploadAvatar(file: File) {
    setBusyAvatar(true);
    setError("");
    try {
      const form = new FormData();
      form.append("avatar", file);
      const res = await api<{ user: User; message: string }>("/me/avatar", {
        method: "POST",
        body: form,
      });
      setUser(res.user);
      notify("Foto profil diperbarui.", "success");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyAvatar(false);
    }
  }

  function toggleCategory(category: string) {
    setCreator((current) => {
      if (current.categories.includes(category)) {
        return { ...current, categories: current.categories.filter((item) => item !== category) };
      }
      if (current.categories.length >= 3) {
        notify("Maksimal tiga kategori.", "error");
        return current;
      }
      return { ...current, categories: [...current.categories, category] };
    });
  }

  async function saveCreator(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (creator.is_creator && creator.categories.length === 0) {
      setError("Pilih minimal satu kategori kreator.");
      return;
    }

    setBusyCreator(true);
    try {
      const res = await api<{ user: User; message: string }>("/me/creator", {
        method: "POST",
        body: {
          is_creator: creator.is_creator,
          categories: creator.categories,
          city: creator.city,
          commission_open: creator.commission_open,
          description: creator.description,
          links: {
            instagram: creator.instagram,
            x: creator.x,
            tiktok: creator.tiktok,
            website: creator.website,
          },
        },
      });
      setUser(res.user);
      await refresh();
      notify(res.message, "success");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyCreator(false);
    }
  }

  if (!user) {
    return (
      <div className="wrap page-narrow">
        <div className="skeleton" style={{ height: 260 }} />
      </div>
    );
  }

  return (
    <div className="wrap page-narrow">
      <div className="section-head" style={{ marginTop: 0 }}>
        <div>
          <div className="eyebrow">✳ &nbsp;Pengaturan akun</div>
          <h1 className="section-title">
            Atur <span className="serif-italic">profilmu.</span>
          </h1>
          <p>Lengkapi data diri dan profil kreator supaya mudah ditemukan di direktori.</p>
        </div>
        <Link className="btn btn-ghost btn-sm" href={`/u/${user.username}`}>
          Lihat profil publik
        </Link>
      </div>

      {error ? <div className="notice error mb-16">{error}</div> : null}

      <section className="panel">
        <h2 className="panel-title">Profil dasar</h2>
        <p className="panel-desc">Nama, nama pengguna, dan bio yang tampil di halaman profil.</p>

        <div className="row mb-16" style={{ gap: 16 }}>
          <Avatar user={user} size="lg" />
          <div className="stack-sm">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => avatarInput.current?.click()}
              disabled={busyAvatar}
            >
              {busyAvatar ? "Mengunggah…" : "Ganti foto profil"}
            </button>
            <span className="hint">JPG/PNG maksimal 5 MB.</span>
            <input
              ref={avatarInput}
              type="file"
              accept="image/*"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadAvatar(file);
                event.target.value = "";
              }}
            />
          </div>
        </div>

        <form className="form-grid" onSubmit={saveProfile}>
          <div className="form-row">
            <div className="field">
              <label htmlFor="name">Nama tampilan</label>
              <input
                id="name"
                className="input"
                value={profile.name}
                onChange={(event) => setProfile({ ...profile, name: event.target.value })}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="username">Nama pengguna</label>
              <input
                id="username"
                className="input"
                value={profile.username}
                pattern="[a-z0-9._]+"
                onChange={(event) =>
                  setProfile({ ...profile, username: event.target.value.toLowerCase() })
                }
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="bio">Bio singkat</label>
            <textarea
              id="bio"
              className="textarea"
              maxLength={280}
              style={{ minHeight: 84 }}
              value={profile.bio}
              onChange={(event) => setProfile({ ...profile, bio: event.target.value })}
              placeholder="Ceritakan dirimu dalam satu-dua kalimat."
            />
            <span className="hint">{profile.bio.length}/280 karakter</span>
          </div>

          <div className="row-between">
            <span className="text-xs muted">Email: {user.email}</span>
            <button className="btn" type="submit" disabled={busyProfile}>
              {busyProfile ? "Menyimpan…" : "Simpan profil"}
            </button>
          </div>
        </form>
      </section>

      <section className="panel" id="kreator">
        <h2 className="panel-title">Profil kreator</h2>
        <p className="panel-desc">
          Tampilkan kategori, kota, dan status komisi. Kreator akan muncul di direktori dan bisa
          mendaftarkan booth event.
        </p>

        <form className="form-grid" onSubmit={saveCreator}>
          <label
            className="row"
            style={{
              border: "1px solid var(--line)",
              background: "var(--paper)",
              borderRadius: 11,
              padding: "12px 14px",
              cursor: "pointer",
              alignItems: "flex-start",
            }}
          >
            <input
              type="checkbox"
              checked={creator.is_creator}
              onChange={(event) => setCreator({ ...creator, is_creator: event.target.checked })}
              style={{ marginTop: 3 }}
            />
            <span className="text-sm">
              <b>Saya kreator</b>
              <br />
              <span className="muted text-xs">
                Aktifkan untuk tampil di direktori kreator dan mendaftar event.
              </span>
            </span>
          </label>

          <div className="field">
            <span className="label">Kategori (1–3)</span>
            <div className="chips">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={creator.categories.includes(category) ? "chip selected" : "chip"}
                  onClick={() => toggleCategory(category)}
                >
                  {creator.categories.includes(category) ? "✓ " : ""}
                  {category}
                </button>
              ))}
            </div>
            <span className="hint">{creator.categories.length}/3 kategori dipilih.</span>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="city">Kota</label>
              <input
                id="city"
                className="input"
                placeholder="Jakarta"
                value={creator.city}
                onChange={(event) => setCreator({ ...creator, city: event.target.value })}
              />
            </div>

            <div className="field">
              <span className="label">Status komisi</span>
              <div className="chips" style={{ paddingTop: 4 }}>
                <button
                  type="button"
                  className={creator.commission_open ? "chip selected" : "chip"}
                  onClick={() => setCreator({ ...creator, commission_open: true })}
                >
                  Komisi buka
                </button>
                <button
                  type="button"
                  className={!creator.commission_open ? "chip selected" : "chip"}
                  onClick={() => setCreator({ ...creator, commission_open: false })}
                >
                  Komisi tutup
                </button>
              </div>
            </div>
          </div>

          <div className="field">
            <label htmlFor="description">Deskripsi portofolio</label>
            <textarea
              id="description"
              className="textarea"
              maxLength={500}
              style={{ minHeight: 96 }}
              placeholder="Jelaskan gaya karyamu, bahan, atau layanan komisi."
              value={creator.description}
              onChange={(event) => setCreator({ ...creator, description: event.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="instagram">Instagram</label>
              <input
                id="instagram"
                className="input"
                placeholder="namaakun"
                value={creator.instagram}
                onChange={(event) => setCreator({ ...creator, instagram: event.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="x">X / Twitter</label>
              <input
                id="x"
                className="input"
                placeholder="namaakun"
                value={creator.x}
                onChange={(event) => setCreator({ ...creator, x: event.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="tiktok">TikTok</label>
              <input
                id="tiktok"
                className="input"
                placeholder="namaakun"
                value={creator.tiktok}
                onChange={(event) => setCreator({ ...creator, tiktok: event.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                className="input"
                type="url"
                placeholder="https://portofolio.kamu"
                value={creator.website}
                onChange={(event) => setCreator({ ...creator, website: event.target.value })}
              />
            </div>
          </div>

          <div className="row-between">
            <span className="text-xs muted">
              {creator.is_creator
                ? "Profil kreator akan tampil di /direktori."
                : "Aktifkan “Saya kreator” untuk tampil di direktori."}
            </span>
            <button className="btn" type="submit" disabled={busyCreator}>
              {busyCreator ? "Menyimpan…" : "Simpan profil kreator"}
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="row-between mb-16">
          <div>
            <h2 className="panel-title">Kehadiran event</h2>
            <p className="panel-desc" style={{ marginBottom: 0 }}>
              Status pendaftaran booth Comipara milikmu.
            </p>
          </div>
          <Link className="btn btn-ghost btn-sm" href="/event">
            Lihat event
          </Link>
        </div>

        {attendances.length === 0 ? (
          <p className="notice">
            Belum mendaftar ke event. Buka halaman event untuk memilih booth.
          </p>
        ) : (
          <div className="stack-sm">
            {attendances.map((attendance) => (
              <div
                key={attendance.id}
                className="row-between"
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  padding: "12px 14px",
                  background: "var(--paper)",
                }}
              >
                <div>
                  <b className="text-sm">{attendance.event?.title ?? "Event"}</b>
                  <div className="text-xs muted">
                    Booth {attendance.booth_number}
                    {attendance.event ? ` · ${attendance.event.location}` : ""}
                  </div>
                </div>
                <div className="row">
                  <StatusBadge status={attendance.status} />
                  {attendance.event ? (
                    <Link className="link text-xs" href={`/event/${attendance.event.slug}`}>
                      Detail
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
