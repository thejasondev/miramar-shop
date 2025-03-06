"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/product-card";

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

  const handleSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setResults([]);
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
      console.log("Productos encontrados:", productsData);

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
      console.log("Categorías encontradas:", categoriesData);

      // Procesar resultados de productos
      const productResults: SearchResult[] = (productsData.data || []).map((product: any) => {
        console.log("Producto original:", product);
        
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
          console.log("Imagen del producto:", product.image);
          
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
          
          console.log("URL de imagen construida:", imageUrl);
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
        
        console.log("Producto procesado:", productData);
        return productData;
      });

      // Procesar resultados de categorías
      const categoryResults: SearchResult[] = (categoriesData.data || []).map((category: any) => {
        console.log("Categoría original:", category);
        
        // Extraer datos directamente del objeto
        const id = category.id;
        
        // Los datos están directamente en el objeto, no en attributes
        const name = category.name || "Categoría sin nombre";
        const description = category.description || "";
        
        // Extraer URL de la imagen
        let imageUrl = null;
        if (category.image) {
          console.log("Imagen de la categoría:", category.image);
          
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
          
          console.log("URL de imagen construida:", imageUrl);
        }
        
        const categoryData = {
          id,
          type: 'category',
          name,
          description,
          image: imageUrl ? { url: imageUrl } : null,
          url: `/categorias/${id}`
        };
        
        console.log("Categoría procesada:", categoryData);
        return categoryData;
      });

      // Combinar resultados
      setResults([...productResults, ...categoryResults]);
    } catch (error) {
      console.error("Error al buscar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-500" />
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar productos y categorías..."
            className="border-0 focus-visible:ring-0 flex-1"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : results.length === 0 ? (
            searchQuery.length > 1 ? (
              <p className="text-center py-8 text-gray-500">
                No se encontraron resultados para "{searchQuery}"
              </p>
            ) : (
              <p className="text-center py-8 text-gray-500">
                Escribe al menos 2 caracteres para buscar
              </p>
            )
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((result) => {
                if (result.type === 'product') {
                  // Crear un objeto de producto compatible con ProductCard
                  const productData = {
                    id: result.id,
                    name: result.name,
                    description: result.description || "",
                    price: result.price || 0,
                    discountPrice: result.discountPrice,
                    image: result.image
                  };
                  
                  console.log("Datos pasados a ProductCard:", productData);
                  
                  // Función personalizada para manejar el clic en el botón de compra
                  const handleProductBuy = (product: any) => {
                    console.log("Comprar producto:", product);
                    // Cerrar el modal
                    onClose();
                    
                    // Formatear mensaje para WhatsApp
                    const message = `Hola, estoy interesado en comprar: ${product.name}`;
                    const whatsappUrl = `https://wa.me/+123456789?text=${encodeURIComponent(
                      message
                    )}`;
                    
                    // Abrir WhatsApp en una nueva pestaña
                    window.open(whatsappUrl, "_blank");
                  };
                  
                  return (
                    <div key={`product-${result.id}`}>
                      <ProductCard 
                        product={productData} 
                        onBuyClick={handleProductBuy}
                      />
                    </div>
                  );
                } else {
                  console.log("Datos de categoría para renderizar:", result);
                  
                  return (
                    <Link
                      key={`category-${result.id}`}
                      href={result.url}
                      onClick={onClose}
                      className="group"
                    >
                      <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                        <div className="aspect-video relative">
                          {result.image?.url ? (
                            <Image
                              src={result.image.url}
                              alt={result.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                            />
                          ) : (
                            <Image
                              src="/placeholder.svg"
                              alt={result.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="p-6">
                          <h2 className="text-xl font-semibold mb-2">
                            {result.name}
                          </h2>
                          <p className="text-gray-600 mb-4">
                            {result.description}
                          </p>
                          <span className="text-black font-medium inline-flex items-center group-hover:underline">
                            Ver productos
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 ml-1"
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
                    </Link>
                  );
                }
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}