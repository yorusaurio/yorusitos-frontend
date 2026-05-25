"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/auth/AuthProvider";

const ClientWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isStandaloneRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/admin");

  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-yorusito-light text-yorusito-neutral">
        {!isStandaloneRoute && <Header />}
        <main className="flex-1">{children}</main>
        {!isStandaloneRoute && <Footer />}
      </div>
    </AuthProvider>
  );
};

export default ClientWrapper;
