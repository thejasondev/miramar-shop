import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HydrationErrorSuppressor from "@/components/hydration-error-suppressor";

const inter = Inter({ subsets: ["latin"] });

// Estas metadatas deben estar en un archivo separado ya que este componente ahora es un cliente
export const metadata: Metadata = {
  title: "Miramar Shop",
  description: "Tu tienda deportiva de confianza",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <HydrationErrorSuppressor />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
