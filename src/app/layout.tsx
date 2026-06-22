import type { Metadata } from "next";
import ClientWrapper from "@/components/ClientWrapper";
import WhatsAppButton from "@/components/WhatsAppButton";
import "./globals.css";

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
      <body className="antialiased bg-yorusito-light text-black">
        <ClientWrapper>
          {children}
          <WhatsAppButton />
        </ClientWrapper>
      </body>
    </html>
  );
}
