import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}


