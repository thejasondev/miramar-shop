import { getDiscountedProducts } from "@/lib/api";
import ProductCard from "@/components/product-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDown, Tag } from "lucide-react";

export const metadata = {
  title: "Descuentos | Miramar Shop",
  description: "Productos con descuento en Miramar Shop",
};

export default async function DiscountPage() {
  try {
    // Obtener productos con descuento
    console.log("Página de descuentos - Obteniendo productos con descuento");
    const products = await getDiscountedProducts();

    // Log detallado de los productos
    console.log(
      `Mostrando ${products.length} productos en la página de descuentos`
    );

    if (products.length > 0) {
      products.forEach((product, index) => {
        console.log(
          `Producto ${index + 1}: ${product.name} (ID: ${product.id})`
        );
        console.log(`- Precio original: $${product.prices?.[0]?.price}`);
        console.log(
          `- Precio descuento: $${product.prices?.[0]?.discountPrice}`
        );
        console.log(`- Tiene imagen: ${product.image ? "SÍ" : "NO"}`);
        if (product.image) {
          console.log(`- URL imagen: ${product.image.url}`);
        }
      });
    }

    return (
      <div className="pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg p-8 mb-12">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Ofertas Especiales
                </h1>
                <p className="text-lg mb-4 md:mb-0">
                  Aprovecha nuestros descuentos exclusivos en productos
                  seleccionados. ¡Ofertas por tiempo limitado!
                </p>
              </div>
              <div className="hidden md:flex items-center gap-3 bg-white/20 rounded-full px-5 py-2 backdrop-blur-sm">
                <Tag className="h-5 w-5 animate-pulse" />
                <span className="font-semibold">Precios Rebajados</span>
              </div>
            </div>
          </div>

          {products.length === 0 ? (
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
            <>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="text-red-600 mr-2">
                  Productos con descuento
                </span>
                <span className="bg-red-100 text-red-600 text-sm px-2.5 py-1 rounded-full">
                  {products.length} productos
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="relative">
                    <ProductCard key={product.id} product={product} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error en la página de descuentos:", error);

    return (
      <div className="pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-bold">
              Error cargando los productos con descuento
            </p>
            <p>
              {error instanceof Error ? error.message : "Error desconocido"}
            </p>
          </div>

          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}
