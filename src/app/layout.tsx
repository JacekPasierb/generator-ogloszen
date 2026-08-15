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
  metadataBase: new URL("https://generator-ogloszen.com"),
  title: "Generator Opisów Ogłoszeń",
  description:
    "Wrzuć zdjęcie produktu lub słowa kluczowe — AI napisze opis pod OLX, Vinted i Marketplace.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Generator Opisów Ogłoszeń",
    description:
      "Ze zdjęcia do gotowego ogłoszenia w kilka sekund. OLX, Vinted i Marketplace.",
    url: "https://generator-ogloszen.com/",
    siteName: "Generator Opisów Ogłoszeń",
    images: [
      {
        // ?v= wymusza świeży pobór obrazu przez cache Meta / Messengera
        url: "https://generator-ogloszen.com/og-image.jpg?v=20260809",
        secureUrl: "https://generator-ogloszen.com/og-image.jpg?v=20260809",
        width: 1200,
        height: 630,
        alt: "Generator Ogłoszeń — ze zdjęcia do gotowego ogłoszenia",
        type: "image/jpeg",
      },
    ],
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Generator Opisów Ogłoszeń",
    description:
      "Ze zdjęcia do gotowego ogłoszenia w kilka sekund. OLX, Vinted i Marketplace.",
    images: ["https://generator-ogloszen.com/og-image.jpg?v=20260809"],
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
