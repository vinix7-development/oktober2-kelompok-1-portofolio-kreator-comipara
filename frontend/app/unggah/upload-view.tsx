"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/toast";
import type { Photo } from "@/lib/types";

const MAX_FILES = 10;
const MAX_SIZE = 15 * 1024 * 1024;

type Picked = { file: File; url: string; id: string };

export function UploadView() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { notify } = useToast();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<Picked[]>([]);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [albumTitle, setAlbumTitle] = useState("");
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/masuk");
    }
  }, [loading, user, router]);

  const filesRef = useRef<Picked[]>([]);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    return () => {
      filesRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, []);

  function addFiles(incoming: FileList | File[]) {
    const list = Array.from(incoming);
    const accepted: Picked[] = [];
    let nextCount = files.length;

    for (const file of list) {
      if (!file.type.startsWith("image/")) {
        setError(`“${file.name}” bukan file gambar. Gunakan JPG, PNG, WEBP, atau GIF.`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        setError(`“${file.name}” lebih dari 15 MB. Perkecil dulu sebelum diunggah.`);
        continue;
      }
      if (nextCount >= MAX_FILES) {
        setError(`Maksimal ${MAX_FILES} foto per unggahan.`);
        break;
      }

      accepted.push({
        file,
        url: URL.createObjectURL(file),
        id: `${file.name}-${file.size}-${file.lastModified}`,
      });
      nextCount += 1;
    }

    if (accepted.length) {
      setFiles((current) => [...current, ...accepted]);
      setError("");
    }
  }

  function remove(id: string) {
    setFiles((current) => {
      const target = current.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return current.filter((item) => item.id !== id);
    });
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (files.length === 0) {
      setError("Pilih minimal satu foto terlebih dahulu.");
      return;
    }

    const form = new FormData();
    files.forEach((item) => form.append("images[]", item.file));
    if (caption.trim()) form.append("caption", caption.trim());
    if (tags.trim()) form.append("tags", tags.trim());
    if (albumTitle.trim()) form.append("album_title", albumTitle.trim());

    setBusy(true);
    try {
      const res = await api<{ photos: Photo[]; message: string }>("/photos", {
        method: "POST",
        body: form,
      });
      notify(res.message, "success");
      files.forEach((item) => URL.revokeObjectURL(item.url));
      setFiles([]);
      router.push(`/foto/${res.photos[0].id}`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  if (!loading && !user) {
    return null;
  }

  return (
    <div className="wrap page-narrow">
      <div className="section-head" style={{ marginTop: 0 }}>
        <div>
          <div className="eyebrow">✳ &nbsp;Unggah karya</div>
          <h1 className="section-title">
            Bagikan <span className="serif-italic">ceritamu.</span>
          </h1>
          <p>Satu foto atau album hingga 10 foto. Setiap file maksimal 15 MB.</p>
        </div>
        <Link className="btn btn-ghost btn-sm" href={user ? `/u/${user.username}` : "/"}>
          Lihat profil
        </Link>
      </div>

      {error ? <div className="notice error mb-16">{error}</div> : null}

      <form className="panel" onSubmit={submit}>
        <div
          className={drag ? "dropzone drag" : "dropzone"}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDrag(false);
            addFiles(event.dataTransfer.files);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
        >
          <b>{files.length ? `${files.length} foto siap diunggah` : "Tarik foto ke sini"}</b>
          <span className="text-sm muted">atau klik untuk memilih dari perangkat · JPG, PNG, WEBP, GIF · maks 15 MB</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            hidden
            onChange={(event) => {
              if (event.target.files) addFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </div>

        {files.length ? (
          <div className="preview-grid">
            {files.map((item) => (
              <div className="preview-item" key={item.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.file.name} />
                <button type="button" onClick={() => remove(item.id)} aria-label={`Hapus ${item.file.name}`}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <div className="form-grid mt-24">
          <div className="field">
            <label htmlFor="caption">Caption</label>
            <textarea
              id="caption"
              className="textarea"
              maxLength={2200}
              placeholder="Ceritakan proses, bahan, atau momen di balik karya ini… #contoh #hashtag"
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
            />
            <span className="hint">{caption.length}/2200 karakter · hashtag di caption otomatis terdeteksi.</span>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="tags">Hashtag tambahan</label>
              <input
                id="tags"
                className="input"
                maxLength={300}
                placeholder="ilustrasi, proses, comipara"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="album">Judul album (opsional)</label>
              <input
                id="album"
                className="input"
                maxLength={120}
                placeholder="Contoh: Seri Kostum Musim Panas"
                value={albumTitle}
                onChange={(event) => setAlbumTitle(event.target.value)}
              />
              <span className="hint">Isi bila mengunggah beberapa foto sekaligus.</span>
            </div>
          </div>

          <div className="row-between">
            <span className="text-xs muted">Karya akan langsung tampil di profil dan feed.</span>
            <button className="btn" type="submit" disabled={busy || files.length === 0}>
              {busy ? <span className="spinner" /> : null}
              {busy ? "Mengunggah…" : `Unggah ${files.length || ""} karya`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
