import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SplashScreen from "@/components/SplashScreen";
import ScrollProgress from "@/components/ScrollProgress";
import PageTransition from "@/components/PageTransition";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";

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

export const metadata: Metadata = {
  title: {
    default: "Intimate Sabbatical | Sexual Health Education",
    template: "%s | Intimate Sabbatical",
  },
  description:
    "Clinically guided sexual health education for women navigating changes in desire, arousal, orgasm, comfort, bladder health, pelvic health, and intimacy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${montserrat.variable} ${playfair.variable}`}
    >
      <body className="flex min-h-screen flex-col antialiased">
        <CartProvider>
          <div className="grain-overlay" aria-hidden />
          <SplashScreen />
          <ScrollProgress />
          <SiteHeader />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
