import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";

// Interfaces para cuando integremos Strapi
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;	
}

// Datos de ejemplo - Reemplazar con datos de Strapi
const products = [
  {
    id: 1,
    name: "Camiseta deportiva",
    description: "Camiseta transpirable para entrenamiento",
    price: 29.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "ropa-deportiva",
  },
  {
    id: 2,
    name: "Shorts deportivos",
    description: "Shorts ligeros con bolsillos",
    price: 24.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "ropa-deportiva",
  },
  {
    id: 3,
    name: "Zapatillas running",
    description: "Zapatillas para correr con amortiguación",
    price: 89.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "ropa-deportiva",
  },
  // Agregar más productos de ejemplo según sea necesario
];

export default function CategoryPage({ params }: { params: { slug: string } }) {
  // Filtrar productos por categoría - Esto se reemplazará con una consulta a Strapi
  const categoryProducts = products.filter(
    (product) => product.category === params.slug
  );

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="container py-8 md:py-12">
          <div className="flex flex-col items-start gap-4 md:gap-8">
            <div className="grid gap-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl capitalize">
                {params.slug.replace(/-/g, " ")}
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Explora nuestra selección de productos
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
