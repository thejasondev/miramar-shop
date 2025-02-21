"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: {
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    image: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
    slug: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const handleWhatsAppClick = () => {
    const message = `Hola, me interesa el producto: ${product.name} - $${
      product.discountPrice || product.price
    }`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const discount = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;

  return (
    <Card className="group">
      <Link href={`/productos/${product.slug}`}>
        <CardHeader className="p-0">
          <div className="aspect-square overflow-hidden relative">
            <img
              src={product.image.data.attributes.url || "/placeholder.svg"}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            {discount > 0 && (
              <Badge className="absolute top-2 right-2 bg-red-500">
                -{discount}%
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {product.description}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">
              ${product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.price}
              </span>
            )}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleWhatsAppClick} className="w-full">
          <WhatsappIcon className="w-4 h-4 mr-2" />
          Comprar por WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
}
