import type { MetadataRoute } from "next";

/** The public site is indexable; the admin panel and API routes never are. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
  };
}
