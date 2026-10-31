import React from "react";
import { SewingPinIcon, ExternalLinkIcon } from "@radix-ui/react-icons";

export function GoogleMapsEmbed() {
  const mapAddress = "Jl. Karyawangi No. 116, Kec. Parongpong, Kabupaten Bandung Barat, Jawa Barat 40559";
  const mapEmbedUrl =
    "https://maps.google.com/maps?q=Jl.+Karyawangi+No.+116,+Kec.+Parongpong,+Kabupaten+Bandung+Barat,+Jawa+Barat+40559&t=&z=15&ie=UTF8&iwloc=&output=embed";
  const externalMapsUrl =
    "https://www.google.com/maps/search/?api=1&query=Jl.+Karyawangi+No.+116,+Kec.+Parongpong,+Kabupaten+Bandung+Barat,+Jawa+Barat+40559";

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_16px_40px_-12px_rgba(10,35,80,0.08)] transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-7 border-b border-[#E2E8F0] dark:border-slate-800 bg-gradient-to-r from-[#F8FAFC] via-white to-[#F8FAFC] dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#005090] text-white shadow-sm">
            <SewingPinIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-[#005090]/10 dark:bg-blue-900/40 px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wider text-[#005090] dark:text-[#0986C8]">
                Peta Lokasi Kantor &amp; Studio
              </span>
            </div>
            <p className="mt-1 text-[13.5px] sm:text-[15px] font-bold text-[#041E42] dark:text-white">
              {mapAddress}
            </p>
          </div>
        </div>

        <a
          href={externalMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex min-h-11 items-center justify-center gap-2 self-start sm:self-auto rounded-full bg-[#005090] hover:bg-[#003E70] px-5 py-2.5 text-xs sm:text-[13px] font-bold text-white shadow-[0_6px_16px_-3px_rgba(0,80,144,0.35)] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <span>Buka di Google Maps</span>
          <ExternalLinkIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>

      <div className="relative w-full h-[300px] sm:h-[380px] lg:h-[420px] bg-slate-100 dark:bg-slate-950">
        <iframe
          title="Peta Lokasi Next Karya Digital Solutions"
          src={mapEmbedUrl}
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="px-5 py-3.5 sm:px-7 sm:py-4 bg-[#F8FAFC] dark:bg-slate-950/60 border-t border-[#E2E8F0] dark:border-slate-800 text-xs text-[#4A5D78] dark:text-slate-400">
        <span className="font-semibold text-[#041E42] dark:text-slate-200">
          Catatan Kunjungan:
        </span>{" "}
        Untuk konsultasi langsung atau tatap muka di kantor, disarankan membuat janji temu terlebih dahulu melalui formulir konsultasi atau WhatsApp kami.
      </div>
    </div>
  );
}
