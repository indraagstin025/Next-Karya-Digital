import type { Metadata } from "next";
import { BlogPage } from "@/features/blog";
import { getPublicArticles } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Blog & Wawasan Teknologi | Next Karya Digital Solutions",
  description:
    "Artikel, panduan teknis, dan wawasan seputar rekayasa website, aplikasi mobile, dan transformasi digital bisnis.",
  alternates: { canonical: "/blog" },
};

export default async function Page() {
  const articles = await getPublicArticles(24);
  return <BlogPage articles={articles} />;
}
