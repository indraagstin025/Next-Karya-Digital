import React from "react";
import {
  TargetIcon,
  LightningBoltIcon,
  CodeIcon,
  CheckCircledIcon,
  RocketIcon,
} from "@radix-ui/react-icons";

export const ABOUT_APPROACH_ITEMS = [
  {
    icon: <TargetIcon className="h-5 w-5" />,
    title: "Dimulai dari Masalah Anda, Bukan dari Teknologi",
    description:
      "Kami dengarkan dulu kendala bisnis Anda, baru kami bangun solusinya. Jadi setiap fitur ada alasannya, dan setiap biaya yang Anda keluarkan terasa manfaatnya.",
  },
  {
    icon: <LightningBoltIcon className="h-5 w-5" />,
    title: "Anda Tidak Perlu Menebak-nebak Progresnya",
    description:
      "Setiap tahap kami kabari. Anda bisa melihat, mengoreksi, dan meminta penyesuaian sebelum terlambat, tanpa drama revisi di akhir proyek.",
  },
  {
    icon: <CodeIcon className="h-5 w-5" />,
    title: "Dibangun untuk Jangka Panjang, Bukan Sekadar Rilis",
    description:
      "Kode yang rapi, cepat, dan aman, sehingga website Anda siap ditambah fiturnya kapan pun bisnis Anda berkembang, tanpa harus dibangun ulang dari awal.",
  },
  {
    icon: <CheckCircledIcon className="h-5 w-5" />,
    title: "Harga Jelas di Awal, Tenang Setelah Rilis",
    description:
      "Tidak ada biaya tiba-tiba. Setelah website live, bug kami perbaiki dan tim kami tetap mendampingi Anda.",
  },
];

export const ABOUT_VALUE_CARDS = [
  {
    icon: <RocketIcon className="h-6 w-6" />,
    title: "Visi Tim Kami",
    description:
      "Menjadi mitra rekayasa teknologi pilihan utama bagi UMKM, perusahaan, dan organisasi di Indonesia dalam membangun website profesional yang bekerja nyata mendatangkan hasil.",
  },
  {
    icon: <LightningBoltIcon className="h-6 w-6" />,
    title: "Misi Rekayasa",
    description:
      "Membangun website modern, cepat, aman, dan mudah dihubungi dengan alur kerja transparan di setiap tahapan, tanpa drama revisi berlarut-larut.",
  },
];
