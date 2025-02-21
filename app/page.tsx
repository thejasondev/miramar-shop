import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";

// Interfaces para Strapi
interface Product {
  id: number;
  attributes: {
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
    featured: boolean;
    slug: string;
  };
}

// Datos de ejemplo - Reemplazar con datos de Strapi
const featuredProducts = [
  {
    id: 1,
    attributes: {
      name: "Nike Air Max",
      description: "Zapatillas deportivas premium",
      price: 129.99,
      image: {
        data: {
          attributes: {
            url: "/placeholder.svg?height=400&width=400",
          },
        },
      },
      featured: true,
      slug: "nike-air-max",
    },
  },
  // ... más productos destacados
];

const discountedProducts = [
  {
    id: 2,
    attributes: {
      name: "Adidas Runner",
      description: "Zapatillas para correr",
      price: 99.99,
      discountPrice: 79.99,
      image: {
        data: {
          attributes: {
            url: "/placeholder.svg?height=400&width=400",
          },
        },
      },
      featured: false,
      slug: "adidas-runner",
    },
  },
  // ... más productos con descuento
];

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container grid lg:grid-cols-2 gap-8 py-8 md:py-12">
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Tu estilo, tu deporte, tu vida
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Descubre nuestra colección exclusiva de ropa deportiva, tecnología
              y más. Diseñado para los que buscan calidad y estilo en cada
              momento.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="w-full min-[400px]:w-auto" asChild>
                <Link href="/categorias">Explorar categorías</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full min-[400px]:w-auto"
                asChild
              >
                <Link href="/categorias/descuentos">Ver ofertas</Link>
              </Button>
            </div>
          </div>
          <div className="hidden lg:block relative min-h-[400px]">
            <div className="absolute inset-0">
              <img
                src="/public/home-image.jpg?height=400&width=600"
                alt="Hero image"
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="container py-8 md:py-12">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                Productos Destacados
              </h2>
              <p className="text-muted-foreground">
                Descubre nuestra selección de productos más populares
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product.attributes} />
              ))}
            </div>
          </div>
        </section>

        {/* Latest Offers Section */}
        <section className="container py-8 md:py-12">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                  Últimas Ofertas
                </h2>
                <Badge variant="secondary" className="text-sm">
                  Hasta 30% OFF
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Aprovecha nuestros mejores descuentos
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {discountedProducts.map((product) => (
                <ProductCard key={product.id} product={product.attributes} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
