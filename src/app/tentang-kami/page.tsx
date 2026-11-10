import type { Metadata } from "next";
import { AboutPage } from "@/features/about";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Profil tim kami, keahlian rekayasa web dan aplikasi, serta komitmen kualitas Next Karya Digital Solutions.",
  alternates: { canonical: "/tentang-kami" },
};

export default function Page() {
  return <AboutPage />;
}
