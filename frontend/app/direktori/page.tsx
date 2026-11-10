import type { Metadata } from "next";
import { DirectoryView } from "./directory-view";

export const metadata: Metadata = {
  title: "Direktori Kreator — KreatorPara",
  description:
    "Cari illustrator, cosplayer, fotografer, dan crafter lokal. Filter berdasarkan kategori, status komisi, dan event Comipara.",
};

export default function Page() {
  return <DirectoryView />;
}
