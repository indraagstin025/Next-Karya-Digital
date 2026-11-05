import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { forwardToCmsBackend } from "@/lib/cms-server";
import type {
  CmsCategory,
  CmsMediaItem,
  CmsPost,
} from "@/features/cms/types";
import { PostEditorPage } from "@/features/cms/posts/PostEditorPage";

export const metadata: Metadata = {
  title: "Sunting Artikel | Next Karya Digital Solutions",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [postResult, categoriesResult, mediaResult, postsResult] = await Promise.all([
    forwardToCmsBackend<CmsPost>(`/posts/${encodeURIComponent(id)}`, {
      method: "GET",
      timeoutMs: 10_000,
    }),
    forwardToCmsBackend<CmsCategory[]>("/categories", {
      method: "GET",
      timeoutMs: 10_000,
    }),
    forwardToCmsBackend<CmsMediaItem[]>("/media?limit=50", {
      method: "GET",
      timeoutMs: 10_000,
    }),
    forwardToCmsBackend<CmsPost[]>("/posts?limit=100", {
      method: "GET",
      timeoutMs: 10_000,
    }),
  ]);

  if (
    postResult.status === 401 ||
    categoriesResult.status === 401 ||
    mediaResult.status === 401 ||
    postsResult.status === 401
  ) {
    redirect("/");
  }

  if (!postResult.body.success || !postResult.body.data) {
    redirect("/cms/artikel");
  }

  const post = postResult.body.data;
  const categories =
    categoriesResult.body.success && Array.isArray(categoriesResult.body.data)
      ? categoriesResult.body.data
      : [];
  const mediaItems =
    mediaResult.body.success && Array.isArray(mediaResult.body.data)
      ? mediaResult.body.data
      : [];
  const availablePosts =
    postsResult.body.success && Array.isArray(postsResult.body.data)
      ? postsResult.body.data
      : [];

  const initialError = !categoriesResult.body.success
    ? categoriesResult.body.error?.message ||
      "Kategori artikel belum bisa dimuat. Muat ulang halaman ini."
    : !mediaResult.body.success
      ? mediaResult.body.error?.message ||
        "Pustaka media belum bisa dimuat. Muat ulang halaman ini."
      : !postsResult.body.success
        ? postsResult.body.error?.message ||
          "Daftar artikel belum bisa dimuat. Muat ulang halaman ini."
        : null;

  return (
    <PostEditorPage
      key={post.id}
      mode="edit"
      post={post}
      categories={categories}
      mediaItems={mediaItems}
      availablePosts={availablePosts}
      initialError={initialError}
    />
  );
}
