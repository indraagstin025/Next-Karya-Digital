import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const apiBaseUrl =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

const backendOrigin = apiBaseUrl
  .replace(/\/api\/v1\/?$/, "")
  .replace(/\/+$/, "");

const mediaHost = process.env.NEXT_PUBLIC_MEDIA_HOST?.trim();

const imageRemotePatterns = [
  {
    protocol: "https" as const,
    hostname: "**.supabase.co",
    pathname: "/storage/v1/object/public/**",
  },
];

if (mediaHost) {
  imageRemotePatterns.push({
    protocol: "https" as const,
    hostname: mediaHost,
    pathname: "/**",
  });
}

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  ...(isProduction
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  output: "standalone",
  images: {
    remotePatterns: imageRemotePatterns,
  },
  experimental: {
    authInterrupts: true,
    serverActions: {
      bodySizeLimit: "256kb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${backendOrigin}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
