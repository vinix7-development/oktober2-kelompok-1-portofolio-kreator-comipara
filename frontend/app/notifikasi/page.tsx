import type { Metadata } from "next";
import { NotificationsView } from "./notifications-view";

export const metadata: Metadata = {
  title: "Notifikasi — KreatorPara",
};

export default function Page() {
  return <NotificationsView />;
}
