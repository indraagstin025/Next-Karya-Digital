import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthenticatedCmsUser } from "@/lib/cms-server";
import { CmsShell } from "@/features/cms/CmsShell";
import { WorkspaceUnavailable } from "@/features/cms/WorkspaceUnavailable";

export const metadata: Metadata = {
  title: "Editor Artikel | Next Karya Digital Solutions",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ArticleEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getAuthenticatedCmsUser();

  if (auth.status === "unauthenticated") {
    redirect("/?sesi=berakhir");
  }

  if (auth.status === "unavailable") {
    return <WorkspaceUnavailable message={auth.message} retryHref="/cms/artikel" />;
  }

  return <CmsShell>{children}</CmsShell>;
}
