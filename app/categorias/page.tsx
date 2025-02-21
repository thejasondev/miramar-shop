import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CategoryCard } from "@/components/category-card";

// Esta interfaz se usará cuando integremos Strapi
interface Category {
  id: number;
  title: string;
  description: string;
  image: string;
  slug: string;
}

// Datos de ejemplo - Reemplazar con datos de Strapi
const categories = [
  {
    id: 1,
    title: "Ropa deportiva",
    description: "Encuentra la mejor ropa para tu entrenamiento",
    image: "/placeholder.svg?height=400&width=600",
    slug: "ropa-deportiva",
  },
  {
    id: 2,
    title: "Tecnología",
    description: "Gadgets y accesorios tecnológicos",
    image: "/placeholder.svg?height=400&width=600",
    slug: "tecnologia",
  },
  {
    id: 3,
    title: "Combos de comida",
    description: "Paquetes especiales de alimentación",
    image: "/placeholder.svg?height=400&width=600",
    slug: "combos",
  },
  {
    id: 4,
    title: "Misceláneas",
    description: "Productos variados para tu estilo de vida",
    image: "/placeholder.svg?height=400&width=600",
    slug: "miscelaneas",
  },
  {
    id: 5,
    title: "Descuentos",
    description: "Las mejores ofertas y promociones",
    image: "/placeholder.svg?height=400&width=600",
    slug: "descuentos",
  },
];

export default function CategoriesPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="container py-8 md:py-12">
          <div className="flex flex-col items-start gap-4 md:gap-8">
            <div className="grid gap-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Categorías
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Explora nuestra selección de productos por categoría
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
