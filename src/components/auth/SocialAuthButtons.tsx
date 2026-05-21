"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faFacebookF, faGoogle } from "@fortawesome/free-brands-svg-icons";
import type { AuthProvider } from "@/lib/auth";

interface SocialAuthButtonsProps {
  actionLabel: string;
  onProviderClick: (provider: Exclude<AuthProvider, "email">) => void;
}

const buttonStyles = {
  google: "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50",
  facebook: "border-blue-600 bg-blue-600 text-white hover:bg-blue-700",
  apple: "border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-800",
};

export default function SocialAuthButtons({ actionLabel, onProviderClick }: SocialAuthButtonsProps) {
  const options: Array<{ provider: Exclude<AuthProvider, "email">; label: string; icon: any }> = [
    { provider: "google", label: "Continuar con Google", icon: faGoogle },
    { provider: "facebook", label: "Continuar con Facebook", icon: faFacebookF },
    { provider: "apple", label: "Continuar con Apple", icon: faApple },
  ];

  return (
    <div className="space-y-3">
      {options.map(({ provider, label, icon }) => (
        <button
          key={provider}
          type="button"
          onClick={() => onProviderClick(provider)}
          className={`flex w-full items-center justify-center gap-3 rounded-2xl border px-5 py-4 text-sm font-semibold transition-all duration-200 ${buttonStyles[provider]}`}
        >
          <FontAwesomeIcon icon={icon} className="text-base" />
          <span>{label}</span>
        </button>
      ))}

      <p className="text-xs leading-5 text-zinc-500">
        Al hacer clic en "{actionLabel}" o en cualquiera de las opciones sociales, aceptas las condiciones de uso y la política de privacidad de Etsy.
      </p>
    </div>
  );
}
