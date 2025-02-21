import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  category: {
    title: string;
    description: string;
    image: string;
    slug: string;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Card className="group overflow-hidden">
      <Link href={`/categorias/${category.slug}`}>
        <CardHeader className="p-0">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={category.image || "/placeholder.svg"}
              alt={category.title}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
          <p className="text-sm text-muted-foreground">
            {category.description}
          </p>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <div className="flex items-center text-sm font-medium">
            Ver productos
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
