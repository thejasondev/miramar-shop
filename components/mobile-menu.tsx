import { X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 bg-white z-50 transform transition-transform duration-300 lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <span className="text-xl font-bold">Miramar Shop</span>
        <button
          onClick={onClose}
          className="hover:text-gray-600 transition-colors"
          aria-label="Cerrar menú"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="p-4">
        <ul className="space-y-4">
          <li>
            <Link
              href="/"
              className="text-lg font-medium hover:text-gray-600 transition-colors block"
              onClick={onClose}
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              href="/categorias"
              className="text-lg font-medium hover:text-gray-600 transition-colors block"
              onClick={onClose}
            >
              Categorías
            </Link>
          </li>
          <li>
            <Link
              href="/descuento"
              className="text-lg font-medium hover:text-gray-600 transition-colors block"
              onClick={onClose}
            >
              Descuento
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
