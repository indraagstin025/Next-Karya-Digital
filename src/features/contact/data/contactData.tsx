import React from "react";
import {
  DuotoneLocationPinIcon,
  DuotoneEnvelopeMailIcon,
  DuotoneClockScheduleIcon,
  DuotoneChatDiscussionIcon,
} from "@/components/ui/BrandIcons";

export const CONTACT_CHANNELS = [
  {
    icon: <DuotoneLocationPinIcon className="h-7 w-7" />,
    title: "Alamat Studio & Kantor",
    content: "Jl. Karyawangi No. 116, Kec. Parongpong, Kabupaten Bandung Barat, Jawa Barat 40559",
    isLink: true,
    linkHref: "https://maps.google.com/?q=Jl.+Karyawangi+No.+116,+Kec.+Parongpong,+Kabupaten+Bandung+Barat,+Jawa+Barat",
  },
  {
    icon: <DuotoneEnvelopeMailIcon className="h-7 w-7" />,
    title: "Email Resmi Konsultasi",
    content: "nextkarya@gmail.com",
    isLink: true,
    linkHref: "mailto:nextkarya@gmail.com",
  },
  {
    icon: <DuotoneClockScheduleIcon className="h-7 w-7" />,
    title: "Jam Kerja Operasional",
    content: "Senin - Jumat, 09.00 - 18.00 WIB",
  },
  {
    icon: <DuotoneChatDiscussionIcon className="h-7 w-7" />,
    title: "Komitmen Respons",
    content: "Tinjauan spesifikasi & estimasi dalam 1x24 jam kerja",
  },
];
