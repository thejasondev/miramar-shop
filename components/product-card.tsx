"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/api";

interface ProductCardProps {
  product: Product;
  onBuyClick?: (product: Product) => void;
}

export default function ProductCard({ product, onBuyClick }: ProductCardProps) {
  // Log inicial - información de producto recibida
  console.log(`ProductCard recibió: ${product.name} (ID: ${product.id})`);

  // Determinar URL de imagen o usar placeholder
  const defaultImageUrl = "/placeholder.svg";
  const initialImageUrl = product.image?.url || defaultImageUrl;

  console.log(`ProductCard - URL de imagen inicial: ${initialImageUrl}`);

  // Estado para la imagen
  const [imageUrl, setImageUrl] = useState(initialImageUrl);

  // Actualizar la imagen si cambia el producto
  useEffect(() => {
    if (product.image?.url) {
      setImageUrl(product.image.url);
    }
  }, [product.image?.url]);

  // Determinar si es una imagen de Cloudinary (para optimización)
  const isCloudinaryImage = imageUrl.includes("cloudinary.com");

  // Extraer información de precios
  const priceInfo =
    product.prices && product.prices.length > 0
      ? product.prices[0]
      : { price: 0, discountPrice: 0, size: "Único" };

  // Comprobar si tiene descuento
  const hasDiscount = priceInfo.discountPrice && priceInfo.discountPrice > 0;

  // Log para depuración
  console.log(`ProductCard - Precios para ${product.name}:`);
  console.log(`- Precio original: $${priceInfo.price}`);
  console.log(`- Precio descuento: $${priceInfo.discountPrice}`);
  console.log(`- Tiene descuento: ${hasDiscount ? "SÍ" : "NO"}`);

  // Precio original formateado
  const formattedPrice = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceInfo.price || 0);

  // Precio con descuento formateado (si existe)
  const formattedDiscountPrice = hasDiscount
    ? new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(priceInfo.discountPrice)
    : "";

  // Manejador para errores de carga de imagen
  const handleImageError = () => {
    console.error(`Error cargando imagen para ${product.name}`);
    setImageUrl(defaultImageUrl);
  };

  // Manejador para el botón de compra
  const handleBuyClick = () => {
    if (onBuyClick) {
      onBuyClick(product);
      return;
    }

    // Comportamiento por defecto: abrir WhatsApp
    const message = `Hola, estoy interesado en comprar: ${product.name}${
      product.description ? `, ${product.description}` : ""
    }`;
    const whatsappUrl = `https://wa.me/+5353118193?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <div>
        <div className="aspect-square relative">
          {/* Etiqueta de oferta */}
          {hasDiscount && (
            <div className="absolute top-0 right-0 bg-red-600 text-white z-10 px-3 py-1 rounded-bl-lg font-semibold text-sm">
              OFERTA
            </div>
          )}

          {/* Imagen del producto */}
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized={isCloudinaryImage}
            onError={handleImageError}
          />
        </div>

        <div className="p-4">
          {/* Nombre del producto */}
          <h3 className="text-lg font-semibold mb-1 line-clamp-1">
            {product.name}
          </h3>

          {/* Descripción */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description || "Sin descripción"}
          </p>

          {/* Precios y botón de compra */}
          <div className="flex items-center justify-between">
            <div>
              {hasDiscount ? (
                <div>
                  <span className="text-lg font-bold text-red-600">
                    {formattedDiscountPrice}
                  </span>
                  <span className="text-sm text-gray-500 line-through ml-2">
                    {formattedPrice}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold">{formattedPrice}</span>
              )}
            </div>

            <Button
              onClick={handleBuyClick}
              className={
                hasDiscount
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-black hover:bg-gray-800 text-white"
              }
            >
              Comprar
            </Button>
          </div>

          {/* Categorías (si existen) */}
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
      </div>
    </div>
  );
}
