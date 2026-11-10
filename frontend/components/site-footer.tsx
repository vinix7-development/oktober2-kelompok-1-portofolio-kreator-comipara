import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <Link className="brand" href="/" style={{ fontSize: 17 }}>
          <span className="brand-mark" aria-hidden="true" style={{ width: 24, height: 24, fontSize: 13 }}>
            k.
          </span>
          <span>
            kreatorpara<span className="brand-dot">.</span>
          </span>
        </Link>
        <span>Ruang tumbuh untuk kreativitas lokal.</span>
        <span>© 2026 KreatorPara · Dibuat untuk komunitas Comipara</span>
      </div>
    </footer>
  );
}
