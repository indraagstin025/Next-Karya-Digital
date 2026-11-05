import type { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { findSafeRedirect } from "@/lib/public-content";

type Props = { params: Promise<{ slug: string[] }> };

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan - Next Karya Digital Solutions",
  robots: {
    index: false,
    follow: false,
  },
};

function toPathname(segments: string[]): string {
  const decoded = segments.map((segment) => {
    try {
      return decodeURIComponent(segment);
    } catch {
      return segment;
    }
  });
  return `/${decoded.join("/")}`;
}

export default async function CatchAllPage({ params }: Props) {
  const { slug } = await params;

  // Unknown paths are checked against the CMS redirect table before returning
  // 404, so renamed pages and portfolio slugs keep working site-wide.
  if (Array.isArray(slug) && slug.length > 0) {
    const target = await findSafeRedirect(toPathname(slug));
    if (target) {
      if (target.status === 301 || target.status === 308) {
        permanentRedirect(target.to);
      }
      redirect(target.to);
    }
  }

  notFound();
}
