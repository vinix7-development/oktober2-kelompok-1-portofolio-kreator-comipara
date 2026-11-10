"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, errorMessage } from "@/lib/api";
import type { DirectoryList } from "@/lib/types";
import { CreatorCard } from "@/components/creator-card";
import { EmptyState, ErrorBox } from "@/components/ui";

const SORTS = [
  { value: "name", label: "Nama A–Z" },
  { value: "newest", label: "Terbaru bergabung" },
  { value: "followers", label: "Paling diikuti" },
];

export function DirectoryView() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [commission, setCommission] = useState("");
  const [eventId, setEventId] = useState("");
  const [sort, setSort] = useState("name");
  const [creators, setCreators] = useState<DirectoryList["data"]>([]);
  const [filters, setFilters] = useState<DirectoryList["filters"] | null>(null);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;

    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q");
    const initialCategory = params.get("category");
    const initialEvent = params.get("event");
    if (initialQuery) setQuery(initialQuery);
    if (initialCategory) setCategory(initialCategory);
    if (initialEvent) setEventId(initialEvent);
  }, []);

  const buildParams = useCallback(
    (page: number) => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (category) params.set("category", category);
      if (commission) params.set("commission", commission);
      if (eventId) params.set("event", eventId);
      if (sort) params.set("sort", sort);
      params.set("page", String(page));
      return params.toString();
    },
    [query, category, commission, eventId, sort],
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    const timer = window.setTimeout(async () => {
      try {
        const res = await api<DirectoryList>(`/direktori?${buildParams(1)}`);
        if (!active) return;
        setCreators(res.data);
        setMeta(res.meta);
        setFilters(res.filters);
      } catch (err) {
        if (active) {
          setError(errorMessage(err));
          setCreators([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }, query ? 280 : 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [buildParams, query]);

  async function loadMore() {
    if (loadingMore || meta.current_page >= meta.last_page) return;
    setLoadingMore(true);
    try {
      const res = await api<DirectoryList>(`/direktori?${buildParams(meta.current_page + 1)}`);
      setCreators((current) => [...current, ...res.data]);
      setMeta(res.meta);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoadingMore(false);
    }
  }

  function reset() {
    setQuery("");
    setCategory("");
    setCommission("");
    setEventId("");
    setSort("name");
  }

  const activeFilter = query || category || commission || eventId;

  return (
    <div className="wrap">
      <div className="section-head" style={{ marginTop: 0 }}>
        <div>
          <div className="eyebrow">✳ &nbsp;Direktori kreator</div>
          <h1 className="section-title">
            Temukan orang di balik <span className="serif-italic">karya.</span>
          </h1>
          <p>
            Cari berdasarkan nama, kategori, status komisi, atau event. Nomor booth membantu kamu
            menemui mereka langsung di Comipara.
          </p>
        </div>
        <span className="text-sm muted">
          {meta.total} kreator{activeFilter ? " cocok dengan filter" : ""}
        </span>
      </div>

      <div className="chips mb-16">
        <button
          type="button"
          className={!category ? "chip selected" : "chip"}
          onClick={() => setCategory("")}
        >
          Semua kreator
        </button>
        {(filters?.categories ?? ["Illustrator", "Cosplayer", "Fotografer", "Crafter", "Lainnya"]).map(
          (item) => (
            <button
              key={item}
              type="button"
              className={category === item ? "chip selected" : "chip"}
              onClick={() => setCategory(category === item ? "" : item)}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <div className="toolbar">
        <label className="search">
          <span aria-hidden="true">⌕</span>
          <input
            aria-label="Cari kreator"
            placeholder="Cari nama, kota, atau deskripsi…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Hapus pencarian"
              style={{ border: 0, background: "transparent", color: "var(--muted)" }}
            >
              ✕
            </button>
          ) : null}
        </label>

        <div className="filters-row">
          <select
            className="select"
            aria-label="Filter status komisi"
            value={commission}
            onChange={(event) => setCommission(event.target.value)}
          >
            <option value="">Semua status komisi</option>
            <option value="open">Komisi buka</option>
            <option value="closed">Komisi tutup</option>
          </select>

          <select
            className="select"
            aria-label="Filter event"
            value={eventId}
            onChange={(event) => setEventId(event.target.value)}
          >
            <option value="">Semua event</option>
            {(filters?.events ?? []).map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>

          <select
            className="select"
            aria-label="Urutkan"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            {SORTS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          {activeFilter ? (
            <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
              Reset
            </button>
          ) : null}
        </div>
      </div>

      {error ? <ErrorBox message={error} /> : null}

      {loading ? (
        <div className="creator-grid" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="creator-card" key={index}>
              <div className="skeleton" style={{ height: 148, borderRadius: 0 }} />
              <div className="creator-main">
                <div className="skeleton line" style={{ width: "60%" }} />
                <div className="skeleton line" style={{ width: "85%" }} />
                <div className="skeleton line" style={{ width: "40%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : creators.length === 0 ? (
        <EmptyState
          title="Kreator tidak ditemukan"
          description="Coba kata kunci atau filter kategori yang berbeda."
        />
      ) : (
        <>
          <div className="creator-grid">
            {creators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>

          {meta.current_page < meta.last_page ? (
            <div className="center mt-24">
              <button type="button" className="btn btn-ghost" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? "Memuat…" : "Muat kreator lainnya"}
              </button>
            </div>
          ) : null}
        </>
      )}

      <p className="text-sm muted mt-32 center">
        Ingin tampil di direktori?{" "}
        <Link className="link" href="/pengaturan">
          Aktifkan profil kreator
        </Link>{" "}
        dan daftarkan booth-mu di halaman event.
      </p>
    </div>
  );
}
