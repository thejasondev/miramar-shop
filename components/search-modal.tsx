"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: number;
  type: 'product' | 'category';
  name: string;
  description?: string;
  image?: string;
  url: string;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // Buscar productos
      const productsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/products?filters[name][$containsi]=${query}&populate=image`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );
      const productsData = await productsResponse.json();
      console.log("Productos encontrados:", productsData);

      // Buscar categorías
      const categoriesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/categories?filters[name][$containsi]=${query}&populate=image`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );
      const categoriesData = await categoriesResponse.json();
      console.log("Categorías encontradas:", categoriesData);

      // Procesar resultados de productos
      const productResults: SearchResult[] = (productsData.data || []).map((product: any) => {
        const imageUrl = product.attributes?.image?.data?.attributes?.url || null;
        return {
          id: product.id,
          type: 'product',
          name: product.attributes?.name || "Producto",
          description: product.attributes?.description || "",
          image: imageUrl,
          url: `/productos/${product.id}`
        };
      });

      // Procesar resultados de categorías
      const categoryResults: SearchResult[] = (categoriesData.data || []).map((category: any) => {
        const imageUrl = category.attributes?.image?.data?.attributes?.url || null;
        return {
          id: category.id,
          type: 'category',
          name: category.attributes?.name || "Categoría",
          description: category.attributes?.description || "",
          image: imageUrl,
          url: `/categorias/${category.id}`
        };
      });

      // Combinar resultados
      setResults([...productResults, ...categoryResults]);
    } catch (error) {
      console.error("Error al buscar:", error);
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
              placeholder="Buscar productos o categorías..."
              className="flex-1 ml-2 border-none focus:ring-0"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              autoFocus
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

        <div className="mt-4 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((result) => (
                <Link 
                  key={`${result.type}-${result.id}`} 
                  href={result.url}
                  onClick={onClose}
                  className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  {result.image && (
                    <div className="w-16 h-16 relative mr-3 flex-shrink-0">
                      <Image
                        src={result.image.startsWith('http') 
                          ? result.image 
                          : `${process.env.NEXT_PUBLIC_STRAPI_HOST}${result.image}`}
                        alt={result.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">{result.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {result.type === 'product' ? 'Producto' : 'Categoría'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : searchQuery.length >= 2 ? (
            <p className="text-center text-gray-500 py-8">
              No se encontraron resultados para "{searchQuery}"
            </p>
          ) : searchQuery.length > 0 ? (
            <p className="text-center text-gray-500 py-8">
              Escribe al menos 2 caracteres para buscar
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
