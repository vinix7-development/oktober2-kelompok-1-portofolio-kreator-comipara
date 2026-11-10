import type { Metadata } from "next";
import { ProfileView } from "./profile-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `@${username} — KreatorPara`,
    description: `Portofolio kreator @${username} di KreatorPara.`,
  };
}

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return <ProfileView username={username} />;
}

export const instant = false;
