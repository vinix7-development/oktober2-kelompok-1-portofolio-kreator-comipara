import type { Metadata } from "next";
import { HomeView } from "./home-view";

export const metadata: Metadata = {
  title: "KreatorPara — Karya lokal, cerita personal",
  description:
    "Direktori kreator lokal Comipara: jelajahi karya illustrator, cosplayer, fotografer, dan crafter, lalu temui mereka di booth.",
};

export default function Page() {
  return <HomeView />;
}
