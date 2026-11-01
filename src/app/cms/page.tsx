import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthenticatedCmsUser } from "@/lib/cms-server";
import { CmsWorkspace } from "@/features/cms/CmsWorkspace";

export const metadata: Metadata = {
  title: "CMS Command Center | Next Karya Digital Solutions",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CmsPage() {
  const user = await getAuthenticatedCmsUser();
  if (!user) {
    redirect("/");
  }

  return <CmsWorkspace currentUser={user} />;
}
