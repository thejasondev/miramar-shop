"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Importaciones de Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";

// Estilos de Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface FeaturedCategoriesProps {
  categories: any[];
}

export default function FeaturedCategories({
  categories,
}: FeaturedCategoriesProps) {
  const [mounted, setMounted] = useState(false);

  // Evitar errores de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  // Configuración del carrusel
  const swiperParams = {
    modules: [Navigation, Pagination, A11y],
    spaceBetween: 20,
    slidesPerView: 1,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      clickable: true,
      el: ".swiper-pagination",
    },
    breakpoints: {
      // Cuando la ventana es >= 640px
      640: {
        slidesPerView: 2,
      },
      // Cuando la ventana es >= 1024px
      1024: {
        slidesPerView: 3,
      },
    },
    // Habilitar explícitamente los gestos táctiles
    touchRatio: 1,
    touchAngle: 45,
    grabCursor: true,
  };

  // Renderizar una tarjeta de categoría
  const renderCategoryCard = (category: any) => {
    // Intentar diferentes estructuras de datos para la imagen
    let imageUrl = "/placeholder.svg?height=300&width=500";
    let categoryName = "Categoría";
    let categoryDescription = "";

    if (category.attributes) {
      categoryName = category.attributes.name || "Categoría";
      categoryDescription = category.attributes.description || "";

      if (category.attributes.image?.data?.attributes?.url) {
        imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}${category.attributes.image.data.attributes.url}`;
      }
    } else if (category.name) {
      categoryName = category.name;
      categoryDescription = category.description || "";

      if (category.image?.url) {
        imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}${category.image.url}`;
      }
    }

    return (
      <Link
        key={category.id}
        href={`/categorias/${category.id}`}
        className="group block h-full mb-4"
      >
        <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full flex flex-col">
          <div className="aspect-video relative">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={categoryName}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4 flex-grow">
            <h3 className="text-xl font-semibold mb-2">
              {categoryName}
            </h3>
            <p className="text-gray-600 line-clamp-2">
              {categoryDescription}
            </p>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Nuestras Categorías
        </h2>
        
        {Array.isArray(categories) && categories.length > 0 ? (
          <div className="relative px-10">
            {/* Botones de navegación personalizados */}
            <div className="swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 shadow-md cursor-pointer flex items-center justify-center hover:bg-gray-100 transition-colors">
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </div>
            
            {/* Carrusel de categorías */}
            {mounted && (
              <div className="relative">
                <Swiper {...swiperParams} className="pb-16">
                  {categories.map((category, index) => (
                    <SwiperSlide key={category.id || index}>
                      {renderCategoryCard(category)}
                    </SwiperSlide>
                  ))}
                </Swiper>
                
                {/* Indicador de paginación personalizado */}
                <div className="swiper-pagination"></div>
              </div>
            )}
            
            {/* Botones de navegación personalizados */}
            <div className="swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 shadow-md cursor-pointer flex items-center justify-center hover:bg-gray-100 transition-colors">
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No hay categorías disponibles en este momento.
            </p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link href="/categorias">
            <Button
              variant="outline"
              className="border-black text-black hover:bg-black hover:text-white"
            >
              Ver todas las categorías
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
