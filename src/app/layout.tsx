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

export const metadata: Metadata = {
  title: {
    default: "Intimate Sabbatical | Sexual Health Education",
    template: "%s | Intimate Sabbatical",
  },
  description:
    "Clinically guided sexual health education for women navigating changes in desire, arousal, orgasm, comfort, bladder health, pelvic health, and intimacy.",
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
