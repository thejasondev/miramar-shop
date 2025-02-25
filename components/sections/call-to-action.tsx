import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="py-16 bg-black text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">¿Listo para comprar?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Explora nuestra colección de productos y encuentra exactamente lo que
          estás buscando.
        </p>
        <Link href="/categorias">
          <Button size="lg" className="bg-white text-black hover:bg-gray-200">
            Comprar ahora
          </Button>
        </Link>
      </div>
    </section>
  );
}
