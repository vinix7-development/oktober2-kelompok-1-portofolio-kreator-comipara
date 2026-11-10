"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/toast";

const DEMO = [
  { label: "Kreator demo", email: "narakinasih@kreatorpara.id", password: "password" },
  { label: "Admin demo", email: "admin@kreatorpara.id", password: "admin12345" },
];

export function LoginView() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const { notify } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const account = await login(email.trim(), password);
      notify(`Selamat datang, ${account.name.split(" ")[0]}!`, "success");
      router.push("/");
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
            Karya terbaik dimulai
            <br />
            dari <span style={{ fontStyle: "italic", color: "#e7b28d" }}>pertemuan.</span>
          </h2>
          <p>
            Masuk untuk memberi apresiasi, mengomentari karya, mengikuti kreator, dan mengelola
            portofoliomu untuk Comipara.
          </p>
        </div>
        <div className="auth-art-content">
          <p className="text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em" }}>
            KREATORPARA · COMIPARA 2026
          </p>
        </div>
      </aside>

      <section className="auth-form">
        <div className="auth-form-inner">
          <div className="eyebrow">Masuk ke akunmu</div>
          <h1 style={{ fontSize: 34, margin: "12px 0 8px" }}>Halo lagi.</h1>
          <p className="muted text-sm mb-16">Gunakan email dan kata sandi yang kamu daftarkan.</p>

          {error ? (
            <div className="notice error mb-16" role="alert">
              {error}
            </div>
          ) : null}

          <form className="form-grid" onSubmit={submit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                type="email"
                autoComplete="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="password">Kata sandi</label>
              <input
                id="password"
                className="input"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <button className="btn btn-block" type="submit" disabled={busy}>
              {busy ? <span className="spinner" /> : null}
              {busy ? "Memeriksa…" : "Masuk"}
            </button>
          </form>

          <div className="panel mt-24" style={{ padding: 16 }}>
            <div className="label mb-8">Akun demo</div>
            <div className="stack-sm">
              {DEMO.map((item) => (
                <button
                  key={item.email}
                  type="button"
                  className="row-between"
                  style={{
                    border: "1px solid var(--line)",
                    background: "var(--paper)",
                    borderRadius: 10,
                    padding: "9px 12px",
                    fontSize: 12.5,
                  }}
                  onClick={() => {
                    setEmail(item.email);
                    setPassword(item.password);
                  }}
                >
                  <span>{item.label}</span>
                  <span className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: 10.5 }}>
                    isi otomatis
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm muted mt-24">
            Belum punya akun?{" "}
            <Link className="link" href="/daftar">
              Daftar gratis
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
