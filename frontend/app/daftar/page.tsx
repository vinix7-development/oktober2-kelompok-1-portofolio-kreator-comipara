import type { Metadata } from "next";
import { RegisterView } from "./register-view";

export const metadata: Metadata = {
  title: "Daftar — KreatorPara",
};

export default function Page() {
  return <RegisterView />;
}
