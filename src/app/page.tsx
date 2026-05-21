"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const RootPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/home");
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
        <p className="mt-4 text-gray-600">Cargando...</p>
      </div>
    </div>
  );
};

export default RootPage;
