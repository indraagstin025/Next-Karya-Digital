import type { Metadata } from "next";
import { AboutPage } from "@/features/about";

export const metadata: Metadata = {
  title: "Tentang Kami | Next Karya Digital Solutions",
  description:
    "Profil tim kami, keahlian rekayasa web dan aplikasi, serta komitmen kualitas Next Karya Digital Solutions.",
};

export default function Page() {
  return <AboutPage />;
}
