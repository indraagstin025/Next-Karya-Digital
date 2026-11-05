import { redirect } from "next/navigation";

const tabTargets: Record<string, string> = {
  dashboard: "/dashboard",
  posts: "/cms/artikel",
  portfolios: "/cms/portofolio",
  services: "/cms/layanan",
  media: "/cms/media",
  crm: "/crm/calon-klien",
  emergency: "/pengaturan/darurat",
  profile: "/pengaturan/profil",
};

const structuredTargets: Record<string, string> = {
  faqs: "/cms/konten-pendukung/faq",
  testimonials: "/cms/konten-pendukung/testimoni",
  pages: "/cms/konten-pendukung/halaman",
  redirects: "/cms/konten-pendukung/pengalihan",
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LegacyCmsRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const tab = firstValue(params.tab);
  const sub = firstValue(params.sub);

  if (tab === "structured") {
    redirect(structuredTargets[sub ?? ""] ?? structuredTargets.faqs);
  }

  redirect((tab && tabTargets[tab]) || "/cms/artikel");
}
