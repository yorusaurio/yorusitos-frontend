import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClientWrapper from "@/components/ClientWrapper";
import WhatsAppButton from "@/components/WhatsAppButton"; // Importa el botón
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yorusito",
  description: "Ropa urbana para destacar en la ciudad",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-yorusito-light text-black`}
      >
        <ClientWrapper>
          {children}
          <WhatsAppButton />
        </ClientWrapper>
      </body>
    </html>
  );
}
