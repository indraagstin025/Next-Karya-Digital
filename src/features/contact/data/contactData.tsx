import React from "react";
import {
  SewingPinIcon,
  EnvelopeClosedIcon,
  ClockIcon,
  ChatBubbleIcon,
} from "@radix-ui/react-icons";

export const CONTACT_CHANNELS = [
  {
    icon: <SewingPinIcon className="h-5 w-5" />,
    title: "Alamat Studio & Kantor",
    content: "Jl. Karyawangi No. 116, Kec. Parongpong, Kabupaten Bandung Barat, Jawa Barat 40559",
    isLink: true,
    linkHref: "https://maps.google.com/?q=Jl.+Karyawangi+No.+116,+Kec.+Parongpong,+Kabupaten+Bandung+Barat,+Jawa+Barat",
  },
  {
    icon: <EnvelopeClosedIcon className="h-5 w-5" />,
    title: "Email Resmi Konsultasi",
    content: "nextkarya@gmail.com",
    isLink: true,
    linkHref: "mailto:nextkarya@gmail.com",
  },
  {
    icon: <ClockIcon className="h-5 w-5" />,
    title: "Jam Kerja Operasional",
    content: "Senin - Jumat, 09.00 - 18.00 WIB",
  },
  {
    icon: <ChatBubbleIcon className="h-5 w-5" />,
    title: "Komitmen Respons",
    content: "Tinjauan spesifikasi & estimasi dalam 1x24 jam kerja",
  },
];
