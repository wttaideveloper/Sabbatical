import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
    // Next.js 16 blocks image optimization for hostnames that resolve to a
    // private/loopback IP by default (SSRF hardening). Our CMS is local-only
    // in this dev setup, so this is the intended, documented opt-in.
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
