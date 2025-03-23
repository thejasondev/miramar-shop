import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/api";

export const metadata = {
  title: "Categorías | Miramar Shop",
  description: "Explora todas nuestras categorías de productos",
};

export default async function CategoriesPage() {
  const categories = await getCategories();
  console.log("Categories in page:", categories);

  return (
    <div className="pt-16">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Categorías</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category: any) => {
              // Intentar diferentes estructuras de datos para la imagen
              let imageUrl = "/placeholder.svg?height=300&width=500";
              let categoryName = "Categoría";
              let categoryDescription = "";
              if (category.attributes) {
                categoryName = category.attributes.name || "Categoría";
                categoryDescription = category.attributes.description || "";

                if (category.attributes.image?.data?.attributes?.url) {
                  imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}${category.attributes.image.data.attributes.url}`;
                }
              } else if (category.name) {
                categoryName = category.name;
                categoryDescription = category.description || "";

                if (category.image?.url) {
                  imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}${category.image.url}`;
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
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-2">
                        {categoryName}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {categoryDescription}
                      </p>
                      <span className="text-black font-medium inline-flex items-center group-hover:underline">
                        Ver productos
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-600">
                No hay categorías disponibles en este momento.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
