import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FeaturedCategoriesProps {
  categories: any[];
}

export default function FeaturedCategories({
  categories,
}: FeaturedCategoriesProps) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Nuestras Categorías
        </h2>
        {Array.isArray(categories) && categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 3).map((category) => {
              // Intentar diferentes estructuras de datos para la imagen
              let imageUrl = "/placeholder.svg?height=300&width=500";
              let categoryName = "Categoría";
              let categoryDescription = "";

              if (category.attributes) {
                categoryName = category.attributes.name || "Categoría";
                categoryDescription = category.attributes.description || "";

                if (category.attributes.image?.data?.attributes?.url) {
                  imageUrl = `${process.env.STRAPI_HOST}${category.attributes.image.data.attributes.url}`;
                }
              } else if (category.name) {
                categoryName = category.name;
                categoryDescription = category.description || "";

                if (category.image?.url) {
                  imageUrl = `${process.env.STRAPI_HOST}${category.image.url}`;
                }
              }

              return (
                <Link
                  key={category.id}
                  href={`/categorias/${category.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                    <div className="aspect-video relative">
                      <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt={categoryName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">
                        {categoryName}
                      </h3>
                      <p className="text-gray-600 line-clamp-2">
                        {categoryDescription}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No hay categorías disponibles en este momento.
            </p>
          </div>
        )}
        <div className="text-center mt-8">
          <Link href="/categorias">
            <Button
              variant="outline"
              className="border-black text-black hover:bg-black hover:text-white"
            >
              Ver todas las categorías
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
