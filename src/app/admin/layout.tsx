import type { Metadata } from "next";

// Applies to every /admin page, including the login screen: never index or archive them.
export const metadata: Metadata = {
  title: { absolute: "Admin" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
