import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthenticatedCmsUser } from "@/lib/cms-server";
import { WorkspaceShellLoader } from "@/features/cms/WorkspaceShellLoader";
import { WorkspaceUnavailable } from "@/features/cms/WorkspaceUnavailable";

export const metadata: Metadata = {
  title: "Command Center | Next Karya Digital Solutions",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getAuthenticatedCmsUser();

  if (auth.status === "unauthenticated") {
    redirect("/");
  }

  if (auth.status === "unavailable") {
    return <WorkspaceUnavailable message={auth.message} retryHref="/dashboard" />;
  }

  return (
    <WorkspaceShellLoader currentUser={auth.user}>{children}</WorkspaceShellLoader>
  );
}
