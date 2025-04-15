import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/api";
import CategoryCard from "@/components/category-card";

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
            categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))
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
