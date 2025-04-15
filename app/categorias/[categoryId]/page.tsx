import { getProductsByCategory, getCategories } from "@/lib/api";
import ProductGrid from "@/components/product-grid";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CategoryHeader from "@/components/category-header";

interface PageProps {
  params: {
    categoryId: string;
  };
}

// Usar dynamic metadata para evitar problemas de "props must be serializable"
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    // Extraer categoryId de forma segura
    const categoryId = params.categoryId;

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
  } catch (error) {
    console.error("Error generando metadata:", error);
    return {
      title: "Categoría | Miramar Shop",
      description: "Explora nuestra selección de productos",
    };
  }
}

export default async function CategoryProductsPage({ params }: PageProps) {
  try {
    // Extraer categoryId de forma segura
    const categoryId = params.categoryId;
    console.log("Category ID:", categoryId);

    // Obtener todas las categorías para encontrar la actual
    const categories = await getCategories();
    const category = categories.find((cat) => cat.id.toString() === categoryId);

    // Si no existe la categoría, mostrar 404
    if (!category) {
      console.error(`Categoría con ID ${categoryId} no encontrada`);
      notFound();
    }

    // Intentar obtener los productos para esta categoría
    console.log(
      `Obteniendo productos para categoría: ${category.name} (ID: ${categoryId})`
    );
    const products = await getProductsByCategory(categoryId);
    console.log("Products found:", products.length);

    if (products.length > 0) {
      console.log("Primer producto:", {
        id: products[0].id,
        name: products[0].name,
        hasImage: !!products[0].image,
        imageUrl: products[0].image?.url,
      });
    }

    return (
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Cabecera de la categoría */}
          <CategoryHeader category={category} productsCount={products.length} />

          {/* Lista de productos */}
          {products.length > 0 ? (
            <ProductGrid
              products={products}
              title="Productos en esta categoría"
              showCategory={false}
            />
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                No hay productos en esta categoría
              </h2>
              <p className="text-gray-600 mb-6">
                Pronto agregaremos nuevos productos. ¡Vuelve a visitarnos
                pronto!
              </p>
              <Link href="/categorias">
                <Button>Ver otras categorías</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error en página de categoría:", error);
    return (
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12 bg-red-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Error cargando la categoría
            </h2>
            <p className="text-gray-600 mb-6">
              Ha ocurrido un error al cargar los datos. Por favor, intenta de
              nuevo.
            </p>
            <Link href="/categorias">
              <Button>Ver todas las categorías</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
