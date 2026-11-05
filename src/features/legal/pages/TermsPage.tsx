import React from "react";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { ContentBlocks } from "@/components/ContentBlocks";
import type { PublicPageDTO } from "@/lib/public-content";
import type { ContentBlock } from "@/lib/public-validators";

const FALLBACK_BLOCKS: ContentBlock[] = [
  {
    type: "paragraph",
    text: "Ketentuan ini mengatur penggunaan layanan Next Karya Digital Solutions, termasuk situs web, konsultasi, dan pengerjaan proyek digital. Dengan mengirimkan permintaan atau menyetujui penawaran, Anda dianggap telah membaca dan menyetujui ketentuan berikut.",
  },
  {
    type: "heading",
    level: 2,
    text: "1. Ruang Lingkup Layanan",
  },
  {
    type: "paragraph",
    text: "Setiap proyek dimulai dari kesepakatan tertulis yang memuat hasil kerja, batas waktu, dan biaya. Pekerjaan di luar kesepakatan tersebut dianggap sebagai tambahan dan akan ditawarkan secara terpisah.",
  },
  {
    type: "heading",
    level: 2,
    text: "2. Proses Kerja dan Persetujuan",
  },
  {
    type: "list",
    items: [
      "Kami menyiapkan penawaran berdasarkan kebutuhan yang Anda sampaikan.",
      "Pengerjaan dimulai setelah penawaran disetujui dan pembayaran awal diterima.",
      "Anda perlu memberikan materi, akses, dan umpan balik yang dibutuhkan agar jadwal tetap berjalan.",
      "Keterlambatan materi atau umpan balik dapat menggeser jadwal penyelesaian.",
    ],
  },
  {
    type: "heading",
    level: 2,
    text: "3. Pembayaran",
  },
  {
    type: "paragraph",
    text: "Nilai proyek, jadwal pembayaran, dan metode pembayaran tercantum pada penawaran. Keterlambatan pembayaran dapat menunda pengerjaan atau penyerahan hasil. Biaya pihak ketiga seperti domain, hosting, atau lisensi ditanggung klien kecuali disepakati lain.",
  },
  {
    type: "heading",
    level: 2,
    text: "4. Hak Kekayaan Intelektual",
  },
  {
    type: "paragraph",
    text: "Setelah pembayaran penuh diterima, hak penggunaan hasil akhir proyek menjadi milik klien. Kode, komponen, dan alat kerja yang telah kami kembangkan sebelumnya tetap menjadi milik Next Karya dan dapat digunakan kembali untuk proyek lain. Kami dapat menampilkan proyek dalam portofolio kecuali klien meminta sebaliknya secara tertulis.",
  },
  {
    type: "heading",
    level: 2,
    text: "5. Revisi dan Garansi",
  },
  {
    type: "paragraph",
    text: "Jumlah revisi mengikuti penawaran. Perbaikan bug yang berasal dari pekerjaan kami dikerjakan tanpa biaya tambahan selama masa garansi yang tercantum. Perubahan fitur, penambahan halaman, atau kerusakan akibat perubahan pihak ketiga di luar masa garansi akan dihitung sebagai pekerjaan baru.",
  },
  {
    type: "heading",
    level: 2,
    text: "6. Batasan Tanggung Jawab",
  },
  {
    type: "paragraph",
    text: "Kami tidak menjamin peringkat mesin pencari, jumlah kunjungan, atau hasil penjualan tertentu. Kami juga tidak bertanggung jawab atas gangguan yang disebabkan oleh layanan pihak ketiga, perubahan kebijakan platform, atau kelalaian dalam menjaga kredensial akses.",
  },
  {
    type: "heading",
    level: 2,
    text: "7. Data dan Kerahasiaan",
  },
  {
    type: "paragraph",
    text: "Data yang Anda berikan digunakan untuk memahami kebutuhan dan mengerjakan proyek. Kami berupaya menjaga kerahasiaannya dan tidak menjualnya kepada pihak lain. Pengelolaan data pribadi dijelaskan lebih lanjut pada halaman Kebijakan Privasi.",
  },
  {
    type: "heading",
    level: 2,
    text: "8. Perubahan Ketentuan",
  },
  {
    type: "paragraph",
    text: "Ketentuan ini dapat diperbarui sewaktu-waktu. Versi terbaru berlaku sejak dipublikasikan di halaman ini. Untuk proyek yang sedang berjalan, ketentuan pada penawaran yang telah disetujui tetap berlaku.",
  },
  {
    type: "heading",
    level: 2,
    text: "9. Hukum yang Berlaku",
  },
  {
    type: "paragraph",
    text: "Ketentuan ini mengikuti hukum yang berlaku di Indonesia. Jika terjadi perselisihan, kedua pihak sepakat menyelesaikannya secara musyawarah terlebih dahulu.",
  },
];

export function TermsPage({ page }: { page?: PublicPageDTO | null }) {
  const title = page?.title || "Syarat & Ketentuan";
  const blocks = page && page.blocks.length > 0 ? page.blocks : FALLBACK_BLOCKS;

  return (
    <SiteShell>
      <section className="bg-gradient-to-b from-[#FFFFFF] via-[#F8FBFF] to-[#F3F8FF] dark:from-[#030711] dark:via-[#061231] dark:to-[#091a45] py-12 sm:py-16">
        <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-9 lg:px-14">
          <header className="max-w-[860px]">
            <h1 className="text-[30px] sm:text-[40px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#041E42] dark:text-white">
              {title}
            </h1>
            {page?.updatedLabel && (
              <p className="mt-3 text-[13px] tabular-nums text-[#425776] dark:text-slate-400">
                Terakhir diperbarui {page.updatedLabel}
              </p>
            )}
          </header>

          <div className="mt-8 border-t border-[#D5E1EF] pt-8 dark:border-slate-800">
            <ContentBlocks blocks={blocks} />
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-3">
            <Link
              href="/kontak"
              className="inline-flex min-h-11 items-center rounded-xl bg-[#003E70] px-5 text-[13.5px] font-bold text-white transition-colors hover:bg-[#003E99]"
            >
              Tanyakan ketentuan proyek
            </Link>
            <Link
              href="/kebijakan-privasi"
              className="inline-flex min-h-11 items-center rounded-xl border border-[#5B789E] bg-white px-5 text-[13.5px] font-bold text-[#041E42] transition-colors hover:bg-[#EEF4FC] dark:border-[#4E6E9E] dark:bg-[#12213F] dark:text-white dark:hover:bg-[#192D54]"
            >
              Baca kebijakan privasi
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
