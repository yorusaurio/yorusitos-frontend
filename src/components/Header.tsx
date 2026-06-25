"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faShoppingBag,
  faUser,
  faSearch,
  faChevronDown,
  faGear,
  faBoxOpen,
  faHeart,
  faRightFromBracket,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/components/auth/AuthProvider";

interface HeaderProps {
  variant?: "transparent" | "solid";
}

const LOGO_SRC = "/images/logo_yorusito.png";
const LOGO_WIDTH = 1251;
const LOGO_HEIGHT = 199;

const Header: React.FC<HeaderProps> = ({ variant = "solid" }) => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const isOverlay = variant === "transparent" && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((open) => !open);
  const firstName = user?.firstName?.trim().split(/\s+/)[0] || user?.displayName?.trim().split(/\s+/)[0] || "";
  const canAccessAdmin = Boolean(user?.roles?.some((role) => role === "vendedor" || role === "admin"));

  const handleLogout = async () => {
    await signOut();
    setIsAccountMenuOpen(false);
    setIsMobileMenuOpen(false);
    router.replace("/login");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isOverlay
          ? "bg-transparent"
          : "border-b border-white/10 bg-black/95 shadow-lg backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex h-[4.75rem] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:gap-8 lg:px-8">
        <Link href="/home" className="relative z-10 shrink-0" aria-label="Yorusito — Inicio">
          <img
            src={LOGO_SRC}
            alt="Yorusito"
            width={LOGO_WIDTH}
            height={LOGO_HEIGHT}
            className="h-7 w-auto sm:h-8 lg:h-9"
          />
        </Link>

        <div className="hidden flex-1 items-center justify-center lg:flex">
          <div className="flex items-center gap-1">
            <NavLink href="/home">Inicio</NavLink>
            <NavLink href="/about">Nosotros</NavLink>

            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("products")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70 transition-colors duration-200 hover:text-white"
              >
                Productos
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`h-2.5 w-2.5 transition-transform duration-200 ${activeDropdown === "products" ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`absolute left-1/2 top-full z-50 mt-3 w-52 -translate-x-1/2 rounded-xl border border-white/10 bg-black/95 p-2 shadow-2xl backdrop-blur-md transition-all duration-200 ${
                  activeDropdown === "products" ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
                }`}
              >
                <DropdownLink href="/products/polos">Polos</DropdownLink>
                <DropdownLink href="/products/hoodies">Hoodies</DropdownLink>
                <DropdownLink href="/products/pants">Pantalones</DropdownLink>
                <div className="my-2 border-t border-white/10" />
                <DropdownLink href="/products">Ver todo</DropdownLink>
              </div>
            </div>

            <NavLink href="/faq">FAQ</NavLink>
            <NavLink href="/contact">Contacto</NavLink>
          </div>
        </div>

        <div className="ml-auto hidden items-center gap-1 lg:flex">
          <IconButton ariaLabel="Buscar">
            <FontAwesomeIcon icon={faSearch} className="h-[1.125rem] w-[1.125rem]" />
          </IconButton>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen((value) => !value)}
                className="flex items-center gap-2 rounded-full px-3 py-2 text-white/70 transition-colors duration-200 hover:bg-white/5 hover:text-white"
                aria-label="Mi cuenta"
              >
                <FontAwesomeIcon icon={faUser} className="h-[1.125rem] w-[1.125rem]" />
                <span className="max-w-[7rem] truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                  {firstName}
                </span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`h-2.5 w-2.5 transition-transform ${isAccountMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isAccountMenuOpen && (
                <div className="absolute right-0 top-full z-[60] mt-2 w-64 rounded-2xl border border-white/10 bg-black/95 p-2 shadow-2xl backdrop-blur-md">
                  <AccountLink href="/account" onClick={() => setIsAccountMenuOpen(false)} icon={faUser} label="Mi cuenta" />
                  {canAccessAdmin && (
                    <AccountLink href="/admin" onClick={() => setIsAccountMenuOpen(false)} icon={faChartLine} label="Admin" />
                  )}
                  <AccountLink href="/account/settings" onClick={() => setIsAccountMenuOpen(false)} icon={faGear} label="Configuración" />
                  <AccountLink href="/account/orders" onClick={() => setIsAccountMenuOpen(false)} icon={faBoxOpen} label="Mis órdenes" />
                  <AccountLink href="/account/wishlist" onClick={() => setIsAccountMenuOpen(false)} icon={faHeart} label="Wishlist" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-sm text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white"
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 transition-colors duration-200 hover:text-white"
            >
              Cuenta
            </Link>
          )}

          <IconButton ariaLabel="Carrito" className="relative">
            <FontAwesomeIcon icon={faShoppingBag} className="h-[1.125rem] w-[1.125rem]" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
              0
            </span>
          </IconButton>
        </div>

        <button
          type="button"
          onClick={toggleMobileMenu}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center text-white transition-colors duration-200 hover:text-white/70 lg:hidden"
          aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="h-5 w-5" />
        </button>
      </nav>

      <div
        className={`lg:hidden overflow-hidden border-t border-white/10 bg-black/95 backdrop-blur-md transition-all duration-300 ${
          isMobileMenuOpen ? "max-h-[calc(100vh-4.75rem)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-1 overflow-y-auto px-4 py-4">
          <MobileNavLink href="/home" onClick={() => setIsMobileMenuOpen(false)}>
            Inicio
          </MobileNavLink>
          <MobileNavLink href="/about" onClick={() => setIsMobileMenuOpen(false)}>
            Nosotros
          </MobileNavLink>
          <MobileNavLink href="/products" onClick={() => setIsMobileMenuOpen(false)}>
            Productos
          </MobileNavLink>
          <MobileNavLink href="/products/polos" onClick={() => setIsMobileMenuOpen(false)}>
            Polos
          </MobileNavLink>
          <MobileNavLink href="/products/hoodies" onClick={() => setIsMobileMenuOpen(false)}>
            Hoodies
          </MobileNavLink>
          <MobileNavLink href="/products/pants" onClick={() => setIsMobileMenuOpen(false)}>
            Pantalones
          </MobileNavLink>
          <MobileNavLink href="/faq" onClick={() => setIsMobileMenuOpen(false)}>
            FAQ
          </MobileNavLink>
          <MobileNavLink href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
            Contacto
          </MobileNavLink>

          <div className="mt-3 border-t border-white/10 pt-3">
            <MobileNavLink href={user ? "/account" : "/login"} onClick={() => setIsMobileMenuOpen(false)}>
              {user ? `Mi cuenta · ${firstName}` : "Iniciar sesión"}
            </MobileNavLink>
            {!user && (
              <MobileNavLink href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                Registrarme
              </MobileNavLink>
            )}
            {user && (
              <>
                <MobileNavLink href="/account/settings" onClick={() => setIsMobileMenuOpen(false)}>
                  Configuración
                </MobileNavLink>
                <MobileNavLink href="/account/orders" onClick={() => setIsMobileMenuOpen(false)}>
                  Mis órdenes
                </MobileNavLink>
                <MobileNavLink href="/account/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
                  Wishlist
                </MobileNavLink>
                {canAccessAdmin && (
                  <MobileNavLink href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                    Admin
                  </MobileNavLink>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-lg px-4 py-3 text-left text-sm uppercase tracking-[0.14em] text-white/70 transition-colors duration-200 hover:bg-white/5 hover:text-white"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <Link
    href={href}
    className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70 transition-colors duration-200 hover:text-white"
  >
    {children}
  </Link>
);

const DropdownLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <Link
    href={href}
    className="block rounded-lg px-4 py-2.5 text-sm text-white/75 transition-colors duration-200 hover:bg-white/5 hover:text-white"
  >
    {children}
  </Link>
);

const MobileNavLink: React.FC<{ href: string; children: React.ReactNode; onClick: () => void }> = ({
  href,
  children,
  onClick,
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="block rounded-lg px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/75 transition-colors duration-200 hover:bg-white/5 hover:text-white"
  >
    {children}
  </Link>
);

const IconButton: React.FC<{ children: React.ReactNode; ariaLabel: string; className?: string }> = ({
  children,
  ariaLabel,
  className = "",
}) => (
  <button
    type="button"
    aria-label={ariaLabel}
    className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors duration-200 hover:bg-white/5 hover:text-white ${className}`}
  >
    {children}
  </button>
);

const AccountLink: React.FC<{ href: string; label: string; icon: any; onClick: () => void }> = ({
  href,
  label,
  icon,
  onClick,
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-white/75 transition-colors duration-200 hover:bg-white/10 hover:text-white"
  >
    <FontAwesomeIcon icon={icon} className="h-4 w-4" />
    <span>{label}</span>
  </Link>
);

export default Header;
