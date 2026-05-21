"use client";

import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { faShirt, faHeart, faEnvelope, faPhone, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faShirt} className="text-black text-xl" />
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-wide">Yorusito</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Prendas personalizadas que reflejan tu estilo único. Calidad premium y diseños exclusivos.
            </p>
            {/* Redes Sociales */}
            <div className="flex gap-3 pt-2">
              <a
                href="https://facebook.com/yorusito"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a
                href="https://instagram.com/yorusito_pe"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="https://tiktok.com/@yorusito_pe"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white hover:text-black rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="TikTok"
              >
                <FontAwesomeIcon icon={faTiktok} />
              </a>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="text-lg font-bold mb-4">Navegación</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/home" className="text-gray-400 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Productos */}
          <div>
            <h4 className="text-lg font-bold mb-4">Productos</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/products/polos" className="text-gray-400 hover:text-white transition-colors">
                  Polos
                </Link>
              </li>
              <li>
                <Link href="/products/hoodies" className="text-gray-400 hover:text-white transition-colors">
                  Hoodies
                </Link>
              </li>
              <li>
                <Link href="/products/pants" className="text-gray-400 hover:text-white transition-colors">
                  Pantalones
                </Link>
              </li>
              <li>
                <Link href="/products/polos/superstars" className="text-gray-400 hover:text-white transition-colors">
                  Colección SuperStars
                </Link>
              </li>
              <li>
                <Link href="/products/polos/romantic" className="text-gray-400 hover:text-white transition-colors">
                  Colección Romantic
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400">
                <FontAwesomeIcon icon={faEnvelope} className="mt-1 text-white" />
                <span>contacto@yorusito.com</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <FontAwesomeIcon icon={faPhone} className="mt-1 text-white" />
                <span>+51 999 999 999</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mt-1 text-white" />
                <span>Lima, Perú</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p className="flex items-center gap-2">
              © 2026 Yorusito. Todos los derechos reservados. 
              <span className="text-white">Hecho con</span>
              <FontAwesomeIcon icon={faHeart} className="text-red-500" />
              <span className="text-white">en Perú</span>
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacidad
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Términos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
