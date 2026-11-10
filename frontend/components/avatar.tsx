import Link from "next/link";
import { initials } from "@/lib/format";

type Props = {
  user: { name: string; username?: string; avatar_url?: string | null; id?: number };
  size?: "sm" | "md" | "lg" | "xl";
  link?: boolean;
};

const TONES = [
  ["#f7e2d1", "#8c3c12"],
  ["#e4ecdc", "#3f5742"],
  ["#f1e4f2", "#6b3f6f"],
  ["#e2e9f2", "#334b66"],
  ["#f6ecd0", "#7a5a12"],
];

export function Avatar({ user, size = "md", link = false }: Props) {
  const toneIndex = Math.abs(user.id ?? user.name.length) % TONES.length;
  const [bg, fg] = TONES[toneIndex];

  const inner = user.avatar_url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`avatar ${size}`}
      src={user.avatar_url}
      alt={`Avatar ${user.name}`}
      loading="lazy"
    />
  ) : (
    <span
      className={`avatar ${size}`}
      style={{ background: bg, color: fg }}
      aria-hidden="true"
      title={user.name}
    >
      {initials(user.name)}
    </span>
  );

  if (link && user.username) {
    return <Link href={`/u/${user.username}`}>{inner}</Link>;
  }

  return inner;
}
