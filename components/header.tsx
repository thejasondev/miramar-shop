"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import SearchModal from "./search-modal";
import MobileMenu from "./mobile-menu";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Menú"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className={cn(
              "text-xl font-bold",
              "lg:text-2xl",
              isMobileMenuOpen && "hidden lg:block"
            )}
          >
            Miramar Shop
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium hover:text-gray-600 transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/categorias"
              className="text-sm font-medium hover:text-gray-600 transition-colors"
            >
              Categorías
            </Link>
            <Link
              href="/descuento"
              className="text-sm font-medium hover:text-gray-600 transition-colors"
            >
              Descuento
            </Link>
          </nav>

          {/* Search Button */}
          <button
            className="hover:text-gray-600 transition-colors"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Buscar"
          >
            <Search className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
}
