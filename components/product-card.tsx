"use client";

import type React from "react";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/api";

interface ProductCardProps {
  product: Product;
  onBuyClick?: (product: Product) => void;
}

export default function ProductCard({ product, onBuyClick }: ProductCardProps) {
  // Añadamos logs para entender qué datos recibimos
  console.log(
    `Renderizando ProductCard para: ${product.name} (ID: ${product.id})`
  );
  console.log(
    "Datos del producto:",
    JSON.stringify({
      id: product.id,
      name: product.name,
      desc: product.description?.substring(0, 30),
      imageUrl: product.image?.url,
      prices: product.prices?.length,
      categories: product.categories?.map((c) => c.name),
    })
  );

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Si se proporciona una función onBuyClick personalizada, usarla
    if (onBuyClick) {
      onBuyClick(product);
      return;
    }

    // Comportamiento predeterminado: abrir WhatsApp
    const message = `Hola, estoy interesado en comprar: ${product.name}, ${product.description}`;
    const whatsappUrl = `https://wa.me/+5353118193?text=${encodeURIComponent(
      message
    )}`;

    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappUrl, "_blank");
  };

  // Determinar URL de imagen
  let imageUrl = "/placeholder.svg";

  // Si el producto tiene una imagen con url, la usamos
  if (product.image?.url) {
    imageUrl = product.image.url;
  }

  // Determinar si la URL es absoluta o relativa
  const isAbsoluteUrl =
    imageUrl.startsWith("http://") || imageUrl.startsWith("https://");

  // Si la URL no es absoluta y no es placeholder, agregar el host de Strapi
  if (!isAbsoluteUrl && imageUrl !== "/placeholder.svg") {
    imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST || ""}${imageUrl}`;
  }

  console.log(`Imagen final para ${product.name}: ${imageUrl}`);

  // Precio formateado con moneda - usar el primer precio en la lista de precios
  let formattedPrice = "Precio no disponible";
  if (product.prices && product.prices.length > 0) {
    const firstPrice = product.prices[0];
    formattedPrice = new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(firstPrice.price || 0);

    if (firstPrice.size && firstPrice.size !== "Único") {
      formattedPrice += ` (${firstPrice.size})`;
    }
  }

  // Verificamos si es una imagen de Cloudinary para usar unoptimized
  const isCloudinaryImage = imageUrl.includes("cloudinary.com");

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link href={`/productos/${product.id}`}>
        <div className="aspect-square relative">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={false}
            unoptimized={isCloudinaryImage}
            onError={(e) => {
              console.error(
                `Error cargando imagen para ${product.name}: ${imageUrl}`
              );
              // @ts-ignore - Cambiar la fuente a un placeholder en caso de error
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description || "Sin descripción"}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">{formattedPrice}</span>
            <Button
              onClick={handleBuyClick}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Comprar
            </Button>
          </div>
          {product.categories?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {product.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
