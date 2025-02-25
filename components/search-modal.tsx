"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async (query: string) => {
    if (!query) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.STRAPI_HOST}/api/products?filters[title][$containsi]=${query}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
          },
        }
      );
      const data = await response.json();
      setResults(data.data || []);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 bg-white z-50 transform transition-transform duration-300",
        isOpen ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4 border-b">
          <div className="flex items-center flex-1 max-w-2xl mx-auto">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="flex-1 ml-2 border-none focus:ring-0"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
            />
          </div>
          <button
            onClick={onClose}
            className="ml-4 hover:text-gray-600 transition-colors"
            aria-label="Cerrar búsqueda"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <p className="text-center text-gray-500">Buscando...</p>
          ) : results.length > 0 ? (
            <ul className="space-y-2">
              {results.map((product: any) => (
                <li key={product.id} className="p-2 hover:bg-gray-50 rounded">
                  <a href={`/productos/${product.id}`} onClick={onClose}>
                    {product.attributes.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : searchQuery ? (
            <p className="text-center text-gray-500">
              No se encontraron resultados
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
