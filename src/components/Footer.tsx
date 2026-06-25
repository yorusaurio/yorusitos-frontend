"use client";

import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faTiktok } from "@fortawesome/free-brands-svg-icons";

const LOGO_GATO = "/images/logo_gato.png";
const WHATSAPP_URL = "https://wa.me/51975885868";

const shopLinks = [
  { href: "/products/polos", label: "Polos" },
  { href: "/products/polos?collection=SuperStars", label: "SuperStars" },
  { href: "/products/hoodies", label: "Hoodies" },
  { href: "/products/pants", label: "Pantalones" },
];

const helpLinks = [
  { href: "/about", label: "Nosotros" },
  { href: "/faq", label: "Preguntas frecuentes" },
  { href: "/contact", label: "Contacto" },
  { href: "/terms", label: "Términos" },
];

const socialLinks = [
  {
    href: "https://instagram.com/yorusito_pe",
    label: "Instagram",
    icon: faInstagram,
  },
  {
    href: "https://tiktok.com/@yorusito_pe",
    label: "TikTok",
    icon: faTiktok,
  },
  {
    href: "https://facebook.com/yorusito",
    label: "Facebook",
    icon: faFacebook,
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr,0.9fr,1fr] lg:gap-10">
          <div>
            <Link href="/home" className="inline-block">
              <img
                src={LOGO_GATO}
                alt="Yorusito"
                width={638}
                height={500}
                className="h-20 w-auto sm:h-24"
              />
              <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-400">
                Polos con diseños únicos, hechos en Perú. Listos para usar o personalizar contigo.
              </p>
            </Link>

            <div className="mt-6 flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition hover:border-zinc-500 hover:text-white"
                >
                  <FontAwesomeIcon icon={social.icon} className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-500">Tienda</p>
            <ul className="mt-4 space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-zinc-400 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-500">Ayuda</p>
            <ul className="mt-4 space-y-3">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-zinc-400 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-500">Hablemos</p>
            <ul className="mt-4 space-y-4 text-sm">
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-medium text-white transition hover:text-zinc-300"
                >
                  +51 975 885 868
                </a>
                <p className="mt-1 text-zinc-500">WhatsApp · respuesta rápida</p>
              </li>
              <li>
                <a
                  href="mailto:yorusito.pe@gmail.com"
                  className="block text-zinc-400 transition hover:text-white"
                >
                  yorusito.pe@gmail.com
                </a>
              </li>
              <li>
                <p className="text-zinc-400">Lima, Perú</p>
                <p className="mt-1 text-zinc-500">Envíos a todo el país</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-zinc-800 pt-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Yorusito. Hecho en Perú.</p>
          <p className="text-zinc-600">Diseños únicos para quienes quieren llevar algo con onda.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
