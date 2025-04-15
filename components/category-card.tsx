"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Category } from "@/lib/api";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  // Procesar la URL de la imagen
  let imageUrl = "/placeholder.svg?height=300&width=500";

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
    <Link href={`/categorias/${category.id}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full">
        <div className="aspect-video relative">
          <Image
            src={imgSrc}
            alt={category.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
            unoptimized={isCloudinaryImage}
            onError={handleImageError}
          />
        </div>
        <div className="p-6 flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
          {category.description && (
            <p className="text-gray-600 mb-4 flex-grow">
              {category.description}
            </p>
          )}
          <span className="text-black font-medium inline-flex items-center mt-auto group-hover:underline">
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
