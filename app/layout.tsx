import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import CookieStatus from "@/components/CookieStatus";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Grimmiz - Tienda de Manualidades",
  description: "Tienda online de productos de manualidades hechos a mano",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={montserrat.variable}>
        {children}
        <CookieBanner />
        <CookieStatus />
      </body>
    </html>
  );
}


