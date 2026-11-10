const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export function parseDate(value: string): Date {
  if (value.length <= 10) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, (m ?? 1) - 1, d ?? 1);
  }
  return new Date(value);
}

export function formatDate(value: string, opts: { short?: boolean; withYear?: boolean } = {}): string {
  const date = parseDate(value);
  if (Number.isNaN(date.getTime())) return value;
  const month = opts.short ? MONTHS_SHORT[date.getMonth()] : MONTHS[date.getMonth()];
  const year = opts.withYear === false ? "" : ` ${date.getFullYear()}`;
  return `${date.getDate()} ${month}${year}`;
}

export function formatRange(start: string, end: string): string {
  const a = parseDate(start);
  const b = parseDate(end);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return `${start} — ${end}`;
  if (a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()) {
    if (a.getDate() === b.getDate()) return `${a.getDate()} ${MONTHS[a.getMonth()]} ${a.getFullYear()}`;
    return `${a.getDate()} — ${b.getDate()} ${MONTHS[b.getMonth()]} ${b.getFullYear()}`;
  }
  return `${formatDate(start)} — ${formatDate(end)}`;
}

export function timeAgo(value: string): string {
  const date = parseDate(value);
  if (Number.isNaN(date.getTime())) return "";
  const diff = Date.now() - date.getTime();
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "baru saja";
  if (diff < hour) return `${Math.floor(diff / minute)} menit lalu`;
  if (diff < day) return `${Math.floor(diff / hour)} jam lalu`;
  if (diff < 7 * day) return `${Math.floor(diff / day)} hari lalu`;
  return formatDate(value, { short: true });
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function compactNumber(value: number): string {
  if (value >= 1000) {
    const n = value / 1000;
    return `${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}k`;
  }
  return String(value);
}

export function statusLabel(status: string): string {
  if (status === "approved") return "Disetujui";
  if (status === "rejected") return "Ditolak";
  return "Menunggu";
}
