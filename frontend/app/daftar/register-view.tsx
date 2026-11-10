"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/toast";

export function RegisterView() {
  const { register, user, loading } = useAuth();
  const router = useRouter();
  const { notify } = useToast();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    is_creator: true,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (form.password !== form.password_confirmation) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setBusy(true);
    try {
      await register(form);
      notify("Akun berhasil dibuat. Lengkapi profil kreatormu.", "success");
      router.push(form.is_creator ? "/pengaturan" : "/");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <aside className="auth-art">
        <div className="auth-art-content">
          <Link className="eyebrow" href="/" style={{ color: "#e7b28d" }}>
            ← Kembali ke beranda
          </Link>
          <h2 className="mt-32">
            Punya karya?
            <br />
            Beri <span style={{ fontStyle: "italic", color: "#e7b28d" }}>panggung.</span>
          </h2>
          <p>
            Buat profil portofolio, unggah karya, dan daftarkan booth-mu di Comipara. Pengunjung
            bisa menemukanmu lewat direktori kreator.
          </p>
          <ul className="stack-sm mt-32" style={{ color: "rgba(246,240,228,0.82)", fontSize: 13.5 }}>
            <li>✳ Profil kreator dengan kategori & status komisi</li>
            <li>✳ Unggah hingga 10 karya per album</li>
            <li>✳ Nomor booth tampil di profil setelah disetujui admin</li>
          </ul>
        </div>
        <div className="auth-art-content">
          <p className="text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em" }}>
            ILLUSTRATOR · COSPLAYER · FOTOGRAFER · CRAFTER
          </p>
        </div>
      </aside>

      <section className="auth-form">
        <div className="auth-form-inner">
          <div className="eyebrow">Buat akun baru</div>
          <h1 style={{ fontSize: 34, margin: "12px 0 8px" }}>Gabung komunitas.</h1>
          <p className="muted text-sm mb-16">Gratis, dan bisa langsung mengunggah karya.</p>

          {error ? (
            <div className="notice error mb-16" role="alert">
              {error}
            </div>
          ) : null}

          <form className="form-grid" onSubmit={submit}>
            <div className="field">
              <label htmlFor="name">Nama tampilan</label>
              <input
                id="name"
                className="input"
                required
                minLength={2}
                placeholder="Nama atau nama studio"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="username">Nama pengguna</label>
              <input
                id="username"
                className="input"
                required
                minLength={3}
                pattern="[a-z0-9._]+"
                placeholder="huruf kecil, angka, titik"
                value={form.username}
                onChange={(event) => update("username", event.target.value.toLowerCase())}
              />
              <span className="hint">Profilmu akan menjadi /u/{form.username || "namamu"}</span>
            </div>

            <div className="field">
              <label htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                className="input"
                type="email"
                required
                autoComplete="email"
                placeholder="nama@email.com"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="reg-password">Kata sandi</label>
                <input
                  id="reg-password"
                  className="input"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(event) => update("password", event.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="reg-password2">Ulangi sandi</label>
                <input
                  id="reg-password2"
                  className="input"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={form.password_confirmation}
                  onChange={(event) => update("password_confirmation", event.target.value)}
                />
              </div>
            </div>

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
                checked={form.is_creator}
                onChange={(event) => update("is_creator", event.target.checked)}
                style={{ marginTop: 3 }}
              />
              <span className="text-sm">
                <b>Saya kreator</b>
                <br />
                <span className="muted text-xs">
                  Aktifkan profil portofolio dan pendaftaran booth Comipara.
                </span>
              </span>
            </label>

            <button className="btn btn-block" type="submit" disabled={busy}>
              {busy ? <span className="spinner" /> : null}
              {busy ? "Membuat akun…" : "Daftar sekarang"}
            </button>
          </form>

          <p className="text-sm muted mt-24">
            Sudah punya akun?{" "}
            <Link className="link" href="/masuk">
              Masuk
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
