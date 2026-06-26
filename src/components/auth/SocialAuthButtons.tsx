"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

interface SocialAuthButtonsProps {
  disabled?: boolean;
  onGoogleClick: () => void;
}

export default function SocialAuthButtons({ disabled = false, onGoogleClick }: SocialAuthButtonsProps) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={disabled}
        onClick={onGoogleClick}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-zinc-300 bg-white px-5 py-4 text-sm font-semibold text-zinc-900 transition-all duration-200 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <FontAwesomeIcon icon={faGoogle} className="text-base" />
        <span>Continuar con Google</span>
      </button>

      <p className="text-xs leading-5 text-zinc-500">
        Al continuar con Google, aceptas los términos y condiciones y la política de privacidad de Yorusito.
      </p>
    </div>
  );
}
