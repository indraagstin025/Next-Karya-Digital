import React from "react";

export interface BrandIconProps {
  className?: string;
}

/**
 * Sistem Ikon Vektor Duotone Next Karya (mengikuti desain referensi SDLC:
 * garis utama Navy #072146 + aksen Teal #14B8A6, tampil terbuka tanpa kotak latar).
 */

/* ─── 01. PLAN: Kaca Pembesar Berlapis + Grafik Batang ─── */
export function SdlcPlanIcon({
  className = "h-14 w-14 sm:h-16 sm:w-16",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={`${className} shrink-0`}
    >
      <circle
        cx="26"
        cy="26"
        r="18"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
      />
      <circle
        cx="26"
        cy="26"
        r="13.5"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="1.6"
        strokeOpacity="0.35"
      />
      <path
        d="M39 39L53 53"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M20 31.5V26"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M26 31.5V22"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M32 31.5V18.5"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── 02. DESIGN: Simbol Kode </> + Garis Aksen Teal ─── */
export function SdlcDesignIcon({
  className = "h-14 w-14 sm:h-16 sm:w-16",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={`${className} shrink-0`}
    >
      <path
        d="M22 19L11 30L22 41"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42 19L53 30L42 41"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M35.5 16L28.5 44"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        d="M23 51H41"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── 03. DEVELOPMENT: Laptop dengan Simbol </> ─── */
export function SdlcDevelopmentIcon({
  className = "h-14 w-14 sm:h-16 sm:w-16",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={`${className} shrink-0`}
    >
      <rect
        x="11"
        y="14"
        width="42"
        height="28"
        rx="3.5"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
      />
      <path
        d="M6 42H58L55 48.5C54.3 49.8 53 50.5 51.5 50.5H12.5C11 50.5 9.7 49.8 9 48.5L6 42Z"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        d="M28 46H36"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M26 23L20.5 28L26 33"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M38 23L43.5 28L38 33"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34 21.5L30 34.5"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── 04. TESTING: Papan Clipboard Checklist ─── */
export function SdlcTestingIcon({
  className = "h-14 w-14 sm:h-16 sm:w-16",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={`${className} shrink-0`}
    >
      <rect
        x="13"
        y="14"
        width="38"
        height="41"
        rx="4.5"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
      />
      <path
        d="M24 14V11.5C24 10.1 25.1 9 26.5 9H37.5C38.9 9 40 10.1 40 11.5V14H24Z"
        className="fill-[#FAFBFD] dark:fill-slate-900 stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        d="M20 29L23.5 32.5L29.5 26"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M35 29.5H43"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M20 41L23.5 44.5L29.5 38"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M35 41.5H43"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── 05. DEPLOYMENT: Roket Meluncur + Semburan Teal ─── */
export function SdlcDeploymentIcon({
  className = "h-14 w-14 sm:h-16 sm:w-16",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={`${className} shrink-0`}
    >
      <path
        d="M51 13C40.5 13.5 31.5 18.5 25.5 26.5L37.5 38.5C45.5 32.5 50.5 23.5 51 13Z"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        d="M42.5 15.5L48.5 21.5"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M25.5 26.5L17 28.5L14 35L21.5 36.5"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M37.5 38.5L35.5 47L29 50L27.5 42.5"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="38"
        cy="26"
        r="3.8"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.4"
      />
      <path
        d="M19 41L12 48"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        d="M23 45L15 53"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        d="M15 37L10 42"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── 06. MAINTENANCE: Headset Dukungan & Pemeliharaan ─── */
export function SdlcMaintenanceIcon({
  className = "h-14 w-14 sm:h-16 sm:w-16",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={`${className} shrink-0`}
    >
      <path
        d="M14 33V29C14 19.1 22.1 11 32 11C41.9 11 50 19.1 50 29V33"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <rect
        x="11"
        y="29"
        width="7.5"
        height="13"
        rx="3.75"
        className="fill-[#14B8A6] dark:fill-[#2DD4BF] stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.4"
      />
      <rect
        x="45.5"
        y="29"
        width="7.5"
        height="13"
        rx="3.75"
        className="fill-[#14B8A6] dark:fill-[#2DD4BF] stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.4"
      />
      <path
        d="M49 42V44C49 48.4 45.4 52 41 52H34"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle
        cx="31.5"
        cy="52"
        r="2.4"
        className="fill-[#072146] dark:fill-slate-100"
      />
    </svg>
  );
}

/* ─── IKON KONTAK DENGAN GAYA GARIS DUOTONE SDLC YANG SAMA ─── */

export function DuotoneLocationPinIcon({
  className = "h-12 w-12",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={`${className} shrink-0`}
    >
      <path
        d="M32 54C32 54 49 39.2 49 25.5C49 15.8 41.4 8 32 8C22.6 8 15 15.8 15 25.5C15 39.2 32 54 32 54Z"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <circle
        cx="32"
        cy="25.5"
        r="6.5"
        className="fill-[#14B8A6]/25 stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.8"
      />
    </svg>
  );
}

export function DuotoneEnvelopeMailIcon({
  className = "h-12 w-12",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={`${className} shrink-0`}
    >
      <rect
        x="10"
        y="15"
        width="44"
        height="34"
        rx="5"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
      />
      <path
        d="M13 19L32 33.5L51 19"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DuotoneClockScheduleIcon({
  className = "h-12 w-12",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={`${className} shrink-0`}
    >
      <circle
        cx="32"
        cy="32"
        r="21"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
      />
      <path
        d="M32 19V32L40.5 37"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="32"
        cy="32"
        r="2.6"
        className="fill-[#072146] dark:fill-slate-100"
      />
    </svg>
  );
}

/* ─── IKON LAYANAN MOBILE APP DENGAN GAYA GARIS DUOTONE SDLC ─── */
export function SdlcMobileAppIcon({
  className = "h-12 w-12",
  lightOnDark = false,
}: BrandIconProps & { lightOnDark?: boolean }) {
  const strokeMain = lightOnDark
    ? "stroke-white"
    : "stroke-[#072146] dark:stroke-slate-100";
  const strokeAccent = lightOnDark
    ? "stroke-[#2DD4BF]"
    : "stroke-[#14B8A6] dark:stroke-[#2DD4BF]";

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={`${className} shrink-0`}
    >
      <rect
        x="17"
        y="8"
        width="30"
        height="48"
        rx="6"
        className={strokeMain}
        strokeWidth="2.6"
      />
      <path
        d="M28 13.5H36"
        className={strokeMain}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M27.5 26L23 30.5L27.5 35"
        className={strokeAccent}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36.5 26L41 30.5L36.5 35"
        className={strokeAccent}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M33.5 24.5L30.5 36.5"
        className={strokeAccent}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M27 49.5H37"
        className={strokeAccent}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Alias ekspor agar seluruh pemanggilan ikon tetap konsisten */
export const DuotoneDigitalSolutionIcon = SdlcPlanIcon;
export const DuotoneWebDevIcon = SdlcDevelopmentIcon;
export const DuotoneTechInnovationIcon = SdlcDeploymentIcon;
export const DuotoneTargetProblemIcon = SdlcPlanIcon;
export const DuotoneTransparentProgressIcon = SdlcTestingIcon;
export const DuotoneLongTermCodeIcon = SdlcDevelopmentIcon;
export const DuotoneShieldGuaranteeIcon = SdlcMaintenanceIcon;
export const DuotonePartnerBadgeIcon = SdlcMaintenanceIcon;
export const DuotoneRocketVisionIcon = SdlcDeploymentIcon;
export const DuotoneAnalyticsChartIcon = SdlcPlanIcon;
export const DuotoneChatDiscussionIcon = SdlcMaintenanceIcon;
