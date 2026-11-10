import type { Metadata } from "next";
import { EventsView } from "./events-view";

export const metadata: Metadata = {
  title: "Event Comipara — KreatorPara",
  description: "Jadwal event Comipara, daftar kreator yang hadir, dan nomor booth mereka.",
};

export default function Page() {
  return <EventsView />;
}
