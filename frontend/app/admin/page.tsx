import type { Metadata } from "next";
import { AdminView } from "./admin-view";

export const metadata: Metadata = {
  title: "Panel admin — KreatorPara",
};

export default function Page() {
  return <AdminView />;
}
