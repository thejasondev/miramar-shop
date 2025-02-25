"use client";

import type React from "react";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    discountPrice?: number | null;
    image?: {
      url: string;
    } | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Formatear mensaje para WhatsApp
    const message = `Hola, estoy interesado en comprar: ${product.name}`;
    const whatsappUrl = `https://wa.me/+123456789?text=${encodeURIComponent(
      message
    )}`;

    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappUrl, "_blank");
  };

  // Construir URL de imagen
  const imageUrl = product.image?.url
    ? `${process.env.PUBLIC_STRAPI_HOST}${product.image.url}`
    : "/placeholder.svg?height=400&width=400";

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="aspect-square relative">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={product.name || "Producto"}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <div>
            {product.discountPrice ? (
              <>
                <span className="text-xl font-bold text-red-600">
                  ${product.discountPrice}
                </span>
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${product.price}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold">${product.price}</span>
            )}
          </div>
          <Button
            onClick={handleBuyClick}
            className="bg-black hover:bg-gray-800 text-white"
          >
            Comprar
          </Button>
        </div>
      </div>
    </div>
  );
}
