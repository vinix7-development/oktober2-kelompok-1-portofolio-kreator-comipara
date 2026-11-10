import type { Metadata } from "next";
import { UploadView } from "./upload-view";

export const metadata: Metadata = {
  title: "Unggah karya — KreatorPara",
};

export default function Page() {
  return <UploadView />;
}
