import { getDiscountedProducts } from "@/lib/api";
import ProductCard from "@/components/product-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Descuentos | Miramar Shop",
  description: "Productos con descuento en Miramar Shop",
};

export default async function DiscountPage() {
  const products = await getDiscountedProducts();
  console.log("Discounted products:", products);

  return (
    <div className="pt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-600 text-white rounded-lg p-8 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Ofertas Especiales
          </h1>
          <p className="text-lg mb-6">
            Aprovecha nuestros descuentos exclusivos en productos seleccionados.
            ¡Ofertas por tiempo limitado!
          </p>
        </div>

        {!Array.isArray(products) || products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-4">
              No hay productos en oferta en este momento
            </h2>
            <p className="text-gray-600 mb-8">
              Vuelve pronto para ver nuestras nuevas ofertas
            </p>
            <Link href="/categorias">
              <Button className="bg-black hover:bg-gray-800 text-white">
                Explorar todas las categorías
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => {
              // Intentar diferentes estructuras de datos para el producto
              const productData = {
                id: product.id,
                name: product.attributes?.name || "Producto",
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
