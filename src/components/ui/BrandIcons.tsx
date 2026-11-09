import React from "react";

export interface BrandIconProps {
  className?: string;
}

/**
 * Sistem Ikon Vektor Duotone Next Karya (Navy #072146 + Teal #14B8A6).
 * Dirancang agar konsisten di seluruh halaman publik (Light & Dark Mode).
 */

/* ─── HERO HIGHLIGHTS ─── */

export function DuotoneDigitalSolutionIcon({
  className = "h-7 w-7",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="6"
        y="8"
        width="36"
        height="25"
        rx="4"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
      />
      <path
        d="M16 40H32"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M24 33V40"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M14 25L20 19L25 23L33 15"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="33"
        cy="15"
        r="2.2"
        className="fill-[#14B8A6] dark:fill-[#2DD4BF]"
      />
    </svg>
  );
}

export function DuotoneWebDevIcon({ className = "h-7 w-7" }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M16 15L7 24L16 33"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 15L41 24L32 33"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27 12L21 36"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.7"
        strokeLinecap="round"
      />
      <path
        d="M17 41H31"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DuotoneTechInnovationIcon({
  className = "h-7 w-7",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="13"
        y="13"
        width="22"
        height="22"
        rx="4.5"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
      />
      <rect
        x="19.5"
        y="19.5"
        width="9"
        height="9"
        rx="2"
        className="fill-[#14B8A6]/20 stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.4"
      />
      <path
        d="M19 7V13M29 7V13M19 35V41M29 35V41M7 19H13M7 29H13M35 19H41M35 29H41"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── TENTANG KAMI / KEUNGGULAN ─── */

export function DuotoneTargetProblemIcon({
  className = "h-10 w-10",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="24"
        cy="24"
        r="16"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
      />
      <circle
        cx="24"
        cy="24"
        r="9.5"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.4"
      />
      <circle
        cx="24"
        cy="24"
        r="3.5"
        className="fill-[#14B8A6] dark:fill-[#2DD4BF]"
      />
      <path
        d="M34 14L41 7M41 7H35.5M41 7V12.5"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DuotoneTransparentProgressIcon({
  className = "h-10 w-10",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="7"
        y="9"
        width="34"
        height="30"
        rx="4.5"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
      />
      <path
        d="M14 18H28"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M14 25H34"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        d="M14 32H23"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle
        cx="32"
        cy="32"
        r="2.8"
        className="fill-[#14B8A6] dark:fill-[#2DD4BF]"
      />
    </svg>
  );
}

export function DuotoneLongTermCodeIcon({
  className = "h-10 w-10",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="8"
        y="10"
        width="32"
        height="22"
        rx="3.5"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
      />
      <path
        d="M5 32H43L40.5 37.5C39.9 38.5 38.8 39 37.6 39H10.4C9.2 39 8.1 38.5 7.5 37.5L5 32Z"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M19 17.5L15 21L19 24.5"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29 17.5L33 21L29 24.5"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25.5 16.5L22.5 25.5"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DuotoneShieldGuaranteeIcon({
  className = "h-10 w-10",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M24 6L38 11.5V22.5C38 31.8 31.9 39.4 24 42C16.1 39.4 10 31.8 10 22.5V11.5L24 6Z"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 24.5L22.5 28.5L30.5 19.5"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DuotonePartnerBadgeIcon({
  className = "h-7 w-7",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="19"
        cy="16"
        r="6"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.5"
      />
      <path
        d="M9 36C9 30.5 13.5 26 19 26C24.5 26 29 30.5 29 36"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle
        cx="32"
        cy="18"
        r="4.5"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.4"
      />
      <path
        d="M31 27.5C35.5 27.5 39 31 39 35.5"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DuotoneRocketVisionIcon({
  className = "h-10 w-10",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M39 9C31 9.5 24 13.5 19.5 19.5L28.5 28.5C34.5 24 38.5 17 39 9Z"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        d="M19.5 19.5L13 21L10.5 26L16.5 27.5"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28.5 28.5L27 35L22 37.5L20.5 31.5"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="29.5"
        cy="18.5"
        r="2.8"
        className="fill-[#14B8A6] dark:fill-[#2DD4BF]"
      />
      <path
        d="M14.5 31L9 36.5M17.5 34L11.5 40"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── ANALITIK, DISKUSI & KONTAK ─── */

export function DuotoneAnalyticsChartIcon({
  className = "h-10 w-10",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="7"
        y="8"
        width="34"
        height="32"
        rx="4.5"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
      />
      <path
        d="M16 32V24"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M24 32V17"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M32 32V20"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DuotoneChatDiscussionIcon({
  className = "h-10 w-10",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M10 13C10 10.2 12.2 8 15 8H33C35.8 8 38 10.2 38 13V27C38 29.8 35.8 32 33 32H21L13 38V32H15C12.2 32 10 29.8 10 27V13Z"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        d="M17 17.5H31"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.7"
        strokeLinecap="round"
      />
      <path
        d="M17 23.5H25"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DuotoneLocationPinIcon({
  className = "h-10 w-10",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M24 41C24 41 37 29.8 37 19.5C37 12.3 31.2 6.5 24 6.5C16.8 6.5 11 12.3 11 19.5C11 29.8 24 41 24 41Z"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <circle
        cx="24"
        cy="19.5"
        r="5"
        className="fill-[#14B8A6]/25 stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.6"
      />
    </svg>
  );
}

export function DuotoneEnvelopeMailIcon({
  className = "h-10 w-10",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="7"
        y="11"
        width="34"
        height="26"
        rx="4"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
      />
      <path
        d="M9.5 14L24 25L38.5 14"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DuotoneClockScheduleIcon({
  className = "h-10 w-10",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="24"
        cy="24"
        r="16"
        className="stroke-[#072146] dark:stroke-slate-100"
        strokeWidth="2.6"
      />
      <path
        d="M24 15V24L30 28"
        className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="24"
        cy="24"
        r="2.2"
        className="fill-[#072146] dark:fill-slate-100"
      />
    </svg>
  );
}
