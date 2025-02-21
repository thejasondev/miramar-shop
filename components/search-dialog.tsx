"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Interfaces para Strapi
interface Category {
  id: number;
  attributes: {
    name: string;
    slug: string;
  };
}

interface Product {
  id: number;
  attributes: {
    name: string;
    slug: string;
    category: {
      data: {
        attributes: {
          name: string;
        };
      };
    };
  };
}

// Datos de ejemplo - Reemplazar con datos de Strapi
const categories = [
  { id: 1, attributes: { name: "Ropa deportiva", slug: "ropa-deportiva" } },
  { id: 2, attributes: { name: "Tecnología", slug: "tecnologia" } },
  { id: 3, attributes: { name: "Combos", slug: "combos" } },
];

const products = [
  {
    id: 1,
    attributes: {
      name: "Nike Air Max",
      slug: "nike-air-max",
      category: {
        data: {
          attributes: {
            name: "Ropa deportiva",
          },
        },
      },
    },
  },
  // ... más productos
];

export function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) =>
    product.attributes.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = categories.filter((category) =>
    category.attributes.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
          <span className="sr-only">Buscar productos</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar productos o categorías..."
            className="pl-10 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <DialogClose className="absolute right-0 p-2">
            <X className="h-5 w-5" />
            <span className="sr-only">Cerrar búsqueda</span>
          </DialogClose>
        </div>

        <ScrollArea className="mt-4 max-h-[60vh]">
          {searchQuery ? (
            <div className="space-y-6">
              {/* Resultados de Categorías */}
              {filteredCategories.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Categorías</h3>
                  <div className="space-y-2">
                    {filteredCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/categorias/${category.attributes.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="block p-2 hover:bg-muted rounded-md transition-colors"
                      >
                        {category.attributes.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Resultados de Productos */}
              {filteredProducts.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Productos</h3>
                  <div className="space-y-2">
                    {filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/productos/${product.attributes.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="block p-2 hover:bg-muted rounded-md transition-colors"
                      >
                        <div className="font-medium">
                          {product.attributes.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {product.attributes.category.data.attributes.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {filteredCategories.length === 0 &&
                filteredProducts.length === 0 && (
                  <p className="text-center text-muted-foreground py-6">
                    No se encontraron resultados para "{searchQuery}"
                  </p>
                )}
            </div>
          ) : (
            <div>
              <h3 className="font-semibold mb-2">Categorías populares</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button key={category.id} variant="secondary" asChild>
                    <Link
                      href={`/categorias/${category.attributes.slug}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {category.attributes.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
