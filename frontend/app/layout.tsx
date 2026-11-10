import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "KreatorPara — Direktori & Portofolio Kreator Lokal Comipara",
  description:
    "Temukan illustrator, cosplayer, fotografer, dan crafter lokal. Jelajahi karya mereka dan temui langsung di Comipara.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <Providers>
          <div className="shell">
            <SiteHeader />
            <main className="page">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
