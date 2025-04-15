import ProductCard from "@/components/product-card";
import { Product } from "@/lib/api";

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  showCategory?: boolean;
}

/**
 * Componente para mostrar una cuadrícula de productos
 */
export default function ProductGrid({
  products,
  title,
  subtitle,
  showCategory = false,
}: ProductGridProps) {
  if (!products || !products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
      {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
