"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Category } from "@/lib/api";

interface CategoryHeaderProps {
  category: Category;
  productsCount: number;
}

export default function CategoryHeader({
  category,
  productsCount,
}: CategoryHeaderProps) {
  // Procesar la URL de la imagen
  let imageUrl = "/placeholder.svg";
  if (category.image?.url) {
    imageUrl = category.image.url;
  }

  // Verificar si es una imagen de Cloudinary para unoptimized
  const isCloudinaryImage = imageUrl.includes("cloudinary.com");

  // Estado para manejar errores de imagen
  const [imgSrc, setImgSrc] = useState(imageUrl);

  // Función para manejar errores de carga de imagen
  const handleImageError = () => {
    console.error(`Error cargando imagen para ${category.name}`);
    setImgSrc("/placeholder.svg");
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="flex flex-col md:flex-row">
        {/* Imagen de la categoría */}
        <div className="md:w-1/3 relative">
          <div className="aspect-video md:h-full relative">
            <Image
              src={imgSrc}
              alt={category.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={true}
              unoptimized={isCloudinaryImage}
              onError={handleImageError}
            />
          </div>
        </div>

        {/* Información de la categoría */}
        <div className="md:w-2/3 p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <Link href="/categorias">
              <Button variant="outline">Todas las categorías</Button>
            </Link>
          </div>

          {category.description && (
            <p className="text-gray-600 mb-4">{category.description}</p>
          )}

          <div className="text-sm text-gray-500">
            {productsCount} {productsCount === 1 ? "producto" : "productos"}{" "}
            disponibles
          </div>
        </div>
      </div>
    </div>
  );
}
