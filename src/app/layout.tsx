import type { Metadata } from "next";
import { Montserrat, Playfair_Display, Lora, Cormorant_Garamond, Inter } from "next/font/google";
import { draftMode } from "next/headers";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SplashScreen from "@/components/SplashScreen";
import ScrollProgress from "@/components/ScrollProgress";
import PageTransition from "@/components/PageTransition";
import { getMenuItems, getSiteSetting } from "@/lib/strapi";
import { getMenuItemsPreview, getSiteSettingPreview } from "@/lib/strapi-preview";
import { WEB_URL } from "@/lib/public-config";

// Every page renders on request. Nothing CMS-derived may be baked into the build output:
// inside a Docker build the CMS isn't reachable, so a static build would freeze fallback
// content into the image. (CMS fetches still use a 60s revalidate window — see lib/strapi.ts.)
export const dynamic = "force-dynamic";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const SITE_DESCRIPTION =
  "Clinically guided sexual health education for women navigating changes in desire, arousal, orgasm, comfort, bladder health, pelvic health, and intimacy.";

export const metadata: Metadata = {
  // Absolute base for canonical / Open Graph URLs (NEXT_PUBLIC_WEB_URL).
  metadataBase: new URL(WEB_URL),
  applicationName: "Intimate Sabbatical",
  title: {
    default: "Intimate Sabbatical | Sexual Health Education",
    template: "%s | Intimate Sabbatical",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Intimate Sabbatical",
    title: "Intimate Sabbatical | Sexual Health Education",
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Intimate Sabbatical | Sexual Health Education",
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode();
  const [siteSetting, menuItems] = await Promise.all([
    isEnabled ? getSiteSettingPreview() : getSiteSetting(),
    isEnabled ? getMenuItemsPreview() : getMenuItems(),
  ]);

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${montserrat.variable} ${playfair.variable} ${lora.variable} ${cormorant.variable} ${inter.variable}`}
    >
      <body className="flex min-h-screen flex-col antialiased">
        <div className="grain-overlay" aria-hidden />
        <SplashScreen />
        <ScrollProgress />
        <SiteHeader siteSetting={siteSetting} menuItems={menuItems} />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter siteSetting={siteSetting} />
      </body>
    </html>
  );
}
