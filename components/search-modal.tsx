"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, ShoppingBag, Folder } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/product-card";
import { motion, AnimatePresence } from "framer-motion";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: number;
  type: 'product' | 'category';
  name: string;
  description?: string;
  image?: {
    url: string;
  } | null;
  url: string;
  price?: number;
  discountPrice?: number | null;
  stock?: number;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [resultTypes, setResultTypes] = useState<{products: SearchResult[], categories: SearchResult[]}>({
    products: [],
    categories: []
  });

  const handleSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setResults([]);
      setResultTypes({products: [], categories: []});
      return;
    }

    setIsLoading(true);
    try {
      // Buscar productos
      const productsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/products?filters[name][$containsi]=${query}&populate=*`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );
      const productsData = await productsResponse.json();

      // Buscar categorías
      const categoriesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/categories?filters[name][$containsi]=${query}&populate=*`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );
      const categoriesData = await categoriesResponse.json();

      // Procesar resultados de productos
      const productResults: SearchResult[] = (productsData.data || []).map((product: any) => {
        // Extraer datos directamente del objeto
        const id = product.id;
        
        // Los datos están directamente en el objeto, no en attributes
        const name = product.name || "Producto sin nombre";
        const description = product.description || "";
        const price = product.price || 0;
        const discountPrice = product.discountPrice || null;
        const stock = product.stock || 0;
        
        // Extraer URL de la imagen
        let imageUrl = null;
        if (product.image) {
          // Intentar diferentes formas de obtener la URL de la imagen
          if (product.image.url) {
            imageUrl = product.image.url;
          } else if (product.image.name) {
            imageUrl = `/uploads/${product.image.name}`;
          }
          
          // Asegurarse de que la URL sea absoluta
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}${imageUrl}`;
          }
        }
        
        const productData = {
          id,
          type: 'product',
          name,
          description,
          price,
          discountPrice,
          stock,
          image: imageUrl ? { url: imageUrl } : null,
          url: `/productos/${id}`
        };
        
        return productData;
      });

      // Procesar resultados de categorías
      const categoryResults: SearchResult[] = (categoriesData.data || []).map((category: any) => {
        // Extraer datos directamente del objeto
        const id = category.id;
        
        // Los datos están directamente en el objeto, no en attributes
        const name = category.name || "Categoría sin nombre";
        const description = category.description || "";
        
        // Extraer URL de la imagen
        let imageUrl = null;
        if (category.image) {
          // Intentar diferentes formas de obtener la URL de la imagen
          if (category.image.url) {
            imageUrl = category.image.url;
          } else if (category.image.name) {
            imageUrl = `/uploads/${category.image.name}`;
          }
          
          // Asegurarse de que la URL sea absoluta
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}${imageUrl}`;
          }
        }
        
        const categoryData = {
          id,
          type: 'category',
          name,
          description,
          image: imageUrl ? { url: imageUrl } : null,
          url: `/categorias/${id}`
        };
        
        return categoryData;
      });

      // Combinar resultados
      const allResults = [...productResults, ...categoryResults];
      setResults(allResults);
      setResultTypes({
        products: productResults,
        categories: categoryResults
      });
    } catch (error) {
      console.error("Error al buscar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Cerrar modal al presionar Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Enfocar el input al abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Cerrar al hacer clic fuera del modal
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && isOpen) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  // Ejecutar búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isOpen) return null;

  // Función personalizada para manejar el clic en el botón de compra
  const handleProductBuy = (product: any) => {
    // Cerrar el modal
    onClose();
    
    // Formatear mensaje para WhatsApp
    const message = `Hola, estoy interesado en comprar: ${product.name}`;
    const whatsappUrl = `https://wa.me/+5353118193?text=${encodeURIComponent(
      message
    )}`;
    
    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappUrl, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center sm:items-center px-4 py-6 sm:py-0 overflow-y-auto">
          <motion.div 
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] sm:max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Cabecera de búsqueda */}
            <div className="p-4 sm:p-5 border-b flex items-center gap-3 sticky top-0 bg-white z-10">
              <Search className="w-5 h-5 text-gray-500" />
              <Input
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos y categorías..."
                className="border-0 focus-visible:ring-0 flex-1 text-base sm:text-lg"
              />
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Cerrar búsqueda"
                title="Cerrar búsqueda"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mb-4"></div>
                  <p className="text-gray-600">Buscando resultados...</p>
                </div>
              ) : results.length === 0 ? (
                searchQuery.length > 1 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex justify-center items-center p-4 bg-gray-100 rounded-full mb-4">
                      <Search className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="text-lg text-gray-800 font-medium mb-2">
                      No se encontraron resultados
                    </p>
                    <p className="text-gray-500 max-w-md mx-auto">
                      No encontramos resultados para "{searchQuery}". Prueba con otros términos o categorías.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex justify-center items-center p-4 bg-gray-100 rounded-full mb-4">
                      <Search className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="text-lg text-gray-800 font-medium mb-2">
                      ¿Qué estás buscando?
                    </p>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Escribe al menos 2 caracteres para comenzar a buscar productos y categorías
                    </p>
                  </div>
                )
              ) : (
                <div className="space-y-8">
                  {/* Sección de productos */}
                  {resultTypes.products.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <ShoppingBag className="w-5 h-5 text-gray-700" />
                        <h2 className="text-lg font-semibold text-gray-800">Productos ({resultTypes.products.length})</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {resultTypes.products.map((product) => (
                          <motion.div 
                            key={`product-${product.id}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ProductCard 
                              product={{
                                id: product.id,
                                name: product.name,
                                description: product.description || "",
                                price: product.price || 0,
                                discountPrice: product.discountPrice,
                                image: product.image
                              }} 
                              onBuyClick={handleProductBuy}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sección de categorías */}
                  {resultTypes.categories.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Folder className="w-5 h-5 text-gray-700" />
                        <h2 className="text-lg font-semibold text-gray-800">Categorías ({resultTypes.categories.length})</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {resultTypes.categories.map((category) => (
                          <motion.div
                            key={`category-${category.id}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Link
                              href={category.url}
                              onClick={onClose}
                              className="group block"
                            >
                              <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 border border-gray-100">
                                <div className="flex flex-col sm:flex-row">
                                  <div className="sm:w-1/3 aspect-video sm:aspect-square relative">
                                    {category.image?.url ? (
                                      <Image
                                        src={category.image.url}
                                        alt={category.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <Folder className="w-10 h-10 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="p-4 sm:w-2/3 flex flex-col justify-between">
                                    <div>
                                      <h2 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                                        {category.name}
                                      </h2>
                                      <p className="text-gray-600 text-sm line-clamp-2">
                                        {category.description}
                                      </p>
                                    </div>
                                    <span className="text-blue-600 font-medium inline-flex items-center mt-3 text-sm group-hover:underline">
                                      Ver productos
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M9 5l7 7-7 7"
                                        />
                                      </svg>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}