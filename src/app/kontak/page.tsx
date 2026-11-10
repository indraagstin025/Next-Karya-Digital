import type { Metadata } from "next";
import { ContactPage } from "@/features/contact";

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description:
    "Konsultasikan kebutuhan pembuatan website, sistem internal, dan aplikasi mobile bisnis Anda bersama tim kami di Next Karya Digital Solutions.",
  alternates: { canonical: "/kontak" },
};

export default function Page() {
  return <ContactPage />;
}
