"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faShoppingBag, faUser, faSearch, faChevronDown, faGear, faBoxOpen, faHeart, faRightFromBracket, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/components/auth/AuthProvider";

interface HeaderProps {
  variant?: "transparent" | "solid";
}

const Header: React.FC<HeaderProps> = ({ variant = "solid" }) => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const firstName = user?.firstName?.trim().split(/\s+/)[0] || user?.displayName?.trim().split(/\s+/)[0] || "";

  const handleLogout = async () => {
    await signOut();
    setIsAccountMenuOpen(false);
    setIsMobileMenuOpen(false);
    router.replace("/login");
  };

  const headerClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-300
    ${variant === "transparent" && !isScrolled 
      ? "bg-transparent" 
      : "bg-black shadow-lg"
    }
  `;

  return (
    <header className={headerClasses}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/home" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur-xl group-hover:bg-white/30 transition-all duration-300"></div>
              <h1 className="relative text-3xl font-bold tracking-wider text-white uppercase">
                Yorusito
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink href="/home">Inicio</NavLink>
            <NavLink href="/about">Nosotros</NavLink>
            
            {/* Products Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown("products")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200">
                Productos
              </button>
              <div className={`
                absolute top-full left-0 mt-2 w-48 bg-zinc-900 rounded-lg shadow-xl border border-zinc-800
                transition-all duration-200 origin-top
                ${activeDropdown === "products" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
              `}>
                <div className="py-2">
                  <DropdownLink href="/products/polos">Polos</DropdownLink>
                  <DropdownLink href="/products/hoodies">Hoodies</DropdownLink>
                  <DropdownLink href="/products/pants">Pantalones</DropdownLink>
                  <div className="border-t border-zinc-800 my-2"></div>
                  <DropdownLink href="/products">Ver Todo</DropdownLink>
                </div>
              </div>
            </div>

            <NavLink href="/faq">FAQ</NavLink>
            <NavLink href="/contact">Contacto</NavLink>
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <button 
              className="p-2 text-gray-300 hover:text-white transition-colors duration-200"
              aria-label="Buscar"
            >
              <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
            </button>
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsAccountMenuOpen((value) => !value)}
                  className="flex items-center gap-2 rounded-full px-3 py-2 text-gray-300 hover:bg-white/5 hover:text-white transition-colors duration-200"
                  aria-label="Mi cuenta"
                >
                  <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
                  <span className="text-sm font-semibold text-white">{firstName}</span>
                  <FontAwesomeIcon icon={faChevronDown} className={`w-3 h-3 transition-transform ${isAccountMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {isAccountMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl z-[60]">
                    <AccountLink href="/account" onClick={() => setIsAccountMenuOpen(false)} icon={faUser} label="Mi cuenta" />
                    <AccountLink href="/admin" onClick={() => setIsAccountMenuOpen(false)} icon={faChartLine} label="Admin" />
                    <AccountLink href="/account/settings" onClick={() => setIsAccountMenuOpen(false)} icon={faGear} label="Configuración" />
                    <AccountLink href="/account/orders" onClick={() => setIsAccountMenuOpen(false)} icon={faBoxOpen} label="Mis órdenes" />
                    <AccountLink href="/account/wishlist" onClick={() => setIsAccountMenuOpen(false)} icon={faHeart} label="Wishlist" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-2 flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors duration-200"
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="p-2 text-gray-300 hover:text-white transition-colors duration-200" aria-label="Cuenta">
                <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
              </Link>
            )}
            <button 
              className="relative p-2 text-gray-300 hover:text-white transition-colors duration-200"
              aria-label="Carrito"
            >
              <FontAwesomeIcon icon={faShoppingBag} className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black text-xs font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-white hover:text-gray-300 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`
          lg:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}
        `}>
          <div className="py-4 space-y-2 border-t border-zinc-800">
            <MobileNavLink href="/home" onClick={() => setIsMobileMenuOpen(false)}>
              Inicio
            </MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setIsMobileMenuOpen(false)}>
              Nosotros
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

            <div className="pt-3 border-t border-zinc-800">
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
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full rounded-lg px-4 py-3 text-left text-gray-300 hover:bg-white/5 hover:text-white transition-colors duration-200"
                  >
                    Cerrar sesión
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

// Componentes auxiliares
const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <Link 
    href={href}
    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5"
  >
    {children}
  </Link>
);

const DropdownLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <Link
    href={href}
    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
  >
    {children}
  </Link>
);

const MobileNavLink: React.FC<{ href: string; children: React.ReactNode; onClick: () => void }> = ({ href, children, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200 rounded-lg"
  >
    {children}
  </Link>
);

const AccountLink: React.FC<{ href: string; label: string; icon: any; onClick: () => void }> = ({ href, label, icon, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors duration-200"
  >
    <FontAwesomeIcon icon={icon} className="w-4 h-4" />
    <span>{label}</span>
  </Link>
);

export default Header;
