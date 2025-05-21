import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {ReactNode} from "react";
import Footer from "./ui/Footer/Footer";
import { Bounce, ToastContainer } from "react-toastify";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Generator Opisów Ogłoszeń",
  description:
    "Szybko twórz opisy do OLX, Vinted i innych. Sprzedawaj skuteczniej.",
  icons: {
    icon: "/favicon.ico",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({children}) => {
  return (
    <html lang="pl" className={inter.className}>
      <body>
        <main>
          {children}{" "}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
        </main>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
