import type { Metadata } from "next";
import { LoginView } from "./login-view";

export const metadata: Metadata = {
  title: "Masuk — KreatorPara",
};

export default function Page() {
  return <LoginView />;
}
