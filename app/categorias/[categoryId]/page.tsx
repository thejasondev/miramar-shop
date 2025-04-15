import { getProductsByCategory, getCategories } from "@/lib/api";
import ProductGrid from "@/components/product-grid";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: {
    categoryId: string;
  };
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  // Extraer categoryId de forma segura
  const categoryId = props.params.categoryId;

  // Intentar obtener las categorías para encontrar la actual
  const categories = await getCategories();
  const category = categories.find((cat) => cat.id.toString() === categoryId);

  return {
    title: category
      ? `${category.name} | Miramar Shop`
      : "Categoría | Miramar Shop",
    description:
      category?.description ||
      "Explora nuestra selección de productos en esta categoría.",
  };
}

export default async function CategoryProductsPage(props: PageProps) {
  // Extraer categoryId de forma segura
  const categoryId = props.params.categoryId;

  console.log("Category ID:", categoryId);

  // Obtener todas las categorías para encontrar la actual
  const categories = await getCategories();
  const category = categories.find((cat) => cat.id.toString() === categoryId);

  // Intentar obtener los productos para esta categoría
  const products = await getProductsByCategory(categoryId);
  console.log("Products found:", products.length);

  // Si no existe la categoría, mostrar 404
  if (!category) {
    console.error(`Categoría con ID ${categoryId} no encontrada`);
    notFound();
  }

  return (
    <div className="pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            {category.description && (
              <p className="text-gray-600 mt-2">{category.description}</p>
            )}
          </div>
          <Link href="/categorias">
            <Button variant="outline">Todas las categorías</Button>
          </Link>
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              No hay productos en esta categoría
            </h2>
            <p className="text-gray-600 mb-6">
              Pronto agregaremos nuevos productos. ¡Vuelve a visitarnos pronto!
            </p>
            <Link href="/categorias">
              <Button>Ver otras categorías</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
