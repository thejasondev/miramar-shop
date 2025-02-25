import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProductsByCategory } from "@/lib/api";
import ProductCard from "@/components/product-card";

interface PageProps {
  params: {
    categoryId: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  return {
    title: "Productos | Miramar Shop",
    description: "Explora nuestros productos por categoría",
  };
}

export default async function CategoryProductsPage({ params }: PageProps) {
  // Asegurarnos de que params sea tratado como asíncrono
  const { categoryId } = params;
  console.log("Category ID:", categoryId);

  const products = await getProductsByCategory(categoryId);
  console.log("Products found:", products?.length || 0);

  return (
    <div className="pt-16">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Productos</h1>

        {!Array.isArray(products) || products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-4">
              No hay productos disponibles en esta categoría
            </h2>
            <Link href="/categorias">
              <Button variant="outline">Volver a categorías</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => {
              console.log("Processing product:", product.id);

              // Intentar diferentes estructuras de datos para el producto
              const productData = {
                id: product.id,
                name:
                  product.attributes?.name ||
                  product.attributes?.title ||
                  "Producto",
                description: product.attributes?.description || "",
                price: product.attributes?.price || 0,
                discountPrice: product.attributes?.discountPrice || null,
                image: null,
              };

              // Intentar diferentes estructuras para la imagen
              if (product.attributes?.image?.data?.attributes?.url) {
                productData.image = {
                  url: product.attributes.image.data.attributes.url,
                };
              }

              return <ProductCard key={product.id} product={productData} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
