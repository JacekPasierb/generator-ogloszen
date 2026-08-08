import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import Footer from "./ui/Footer/Footer";
import { DescriptionProvider } from "./context/DescriptionContext";
import Script from "next/script";
import AnalyticsTracker from "./AnalyticsTracker";
import BackToTop from "./components/BackToTop/BackToTop";
import AppToast from "./components/AppToast/AppToast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Generator Opisów Ogłoszeń",
  description: "Szybko twórz opisy do OLX, Vinted i innych. Sprzedawaj skuteczniej.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Generator Opisów Ogłoszeń",
    description:
      "Gotowy opis ogłoszenia w 10 sekund. Sprzedawaj szybciej na OLX, Vinted i Marketplace.",
    url: "https://generator-ogloszen.com",
    siteName: "Generator Opisów Ogłoszeń",
    images: [{ url: "https://generator-ogloszen.com/og-image.png", width: 1200, height: 630 }],
    locale: "pl_PL",
    type: "website",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="pl" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EBP2HDV362"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EBP2HDV362');
          `}
        </Script>

        <AnalyticsTracker />

        <DescriptionProvider>
          <main>
            {children}
            <AppToast />
          </main>

          <Footer />
          <BackToTop />
        </DescriptionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
