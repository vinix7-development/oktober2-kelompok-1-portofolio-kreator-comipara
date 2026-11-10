import Link from "next/link";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="empty">
      <span className="mark" aria-hidden="true">
        ✳
      </span>
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {action ? (
        <Link className="btn btn-ghost btn-sm" href={action.href}>
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const label = status === "approved" ? "Disetujui" : status === "rejected" ? "Ditolak" : "Menunggu";
  return <span className={`status ${status}`}>{label}</span>;
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="notice error" role="alert">
      {message}
    </div>
  );
}
