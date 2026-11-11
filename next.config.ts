import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

/**
 * One upload ceiling for the whole chain: nginx (client_max_body_size), Next.js Server
 * Actions, the proxy body buffer, and Strapi. Keep them in sync.
 */
const UPLOAD_LIMIT = "20mb";

/** Variables that are inlined into the build and therefore MUST exist at `next build` time. */
const REQUIRED_BUILD_VARS = [
  "NEXT_PUBLIC_CMS_PUBLIC_URL",
  "NEXT_PUBLIC_WEB_URL",
  "NEXT_PUBLIC_CONTACT_EMAIL",
] as const;

type ImageRemotePattern = {
  protocol: "http" | "https";
  hostname: string;
  port: string;
  pathname: string;
};

/** Allows next/image to optimise ONLY media served from the CMS uploads folder. */
function cmsRemotePattern(rawUrl: string): ImageRemotePattern {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error(`NEXT_PUBLIC_CMS_PUBLIC_URL must be an absolute URL such as https://cms.example.com (got "${rawUrl}").`);
  }
  return {
    protocol: url.protocol === "https:" ? "https" : "http",
    hostname: url.hostname,
    // "" means "the default port for the protocol" — never "any port".
    port: url.port,
    pathname: "/uploads/**",
  };
}

export default function nextConfig(phase: string): NextConfig {
  const isProduction = process.env.NODE_ENV === "production";
  const cmsPublicUrl = process.env.NEXT_PUBLIC_CMS_PUBLIC_URL?.trim();

  if (phase === PHASE_PRODUCTION_BUILD) {
    const missing = REQUIRED_BUILD_VARS.filter((name) => !process.env[name]?.trim());
    if (missing.length > 0) {
      throw new Error(
        `Missing required build-time variable(s): ${missing.join(", ")}. ` +
          `They are inlined into the build, so pass them as build arguments (see .env.example and DEPLOYMENT.md).`
      );
    }
  }

  const remotePatterns: ImageRemotePattern[] = [];
  if (cmsPublicUrl) remotePatterns.push(cmsRemotePattern(cmsPublicUrl));
  if (!isProduction) {
    // Local development only: Strapi on http://localhost:1337.
    remotePatterns.push({ protocol: "http", hostname: "localhost", port: "1337", pathname: "/uploads/**" });
  }

  const securityHeaders = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    // The admin preview iframes this same site, so SAMEORIGIN (not DENY).
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
    // A deliberately minimal CSP: it adds clickjacking/base-tag/plugin protection without a
    // script-src, which would require per-request nonces and could break Next's inline scripts.
    { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'" },
    // HSTS is set by nginx (the TLS terminator), not here.
  ];

  return {
    // Self-contained server bundle for the Docker image (node server.js).
    output: "standalone",
    poweredByHeader: false,

    turbopack: {
      root: __dirname,
    },

    images: {
      remotePatterns,
      // Next.js 16 blocks the image optimiser from fetching hosts that resolve to private or
      // loopback addresses (SSRF hardening). That opt-out exists ONLY for local development
      // (Strapi on localhost); in production it stays off and the CMS is reached through its
      // public HTTPS hostname.
      dangerouslyAllowLocalIP: !isProduction,
    },

    experimental: {
      serverActions: {
        // Admin uploads travel through Server Actions. The default is 1 MB.
        bodySizeLimit: UPLOAD_LIMIT,
      },
      // src/proxy.ts matches /admin/*, and Next buffers request bodies for proxied routes
      // (default 10 MB, silently truncating larger uploads).
      proxyClientMaxBodySize: UPLOAD_LIMIT,
    },

    async headers() {
      return [
        { source: "/:path*", headers: securityHeaders },
        {
          source: "/admin/:path*",
          headers: [
            { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
            { key: "Cache-Control", value: "no-store" },
          ],
        },
      ];
    },
  };
}
