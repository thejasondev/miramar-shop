import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroProps {
  title?: string;
  description?: string;
  heroImage?: any;
}

export default function Hero({
  title = "Bienvenido a Miramar Shop",
  description = "Tu tienda deportiva de confianza. Explora nuestras categorías y encuentra los mejores productos para tu deporte favorito.",
  heroImage,
}: HeroProps) {
  // Intentar diferentes estructuras de datos para la imagen
  let imageUrl = "/home-image.jpg?height=600&width=600";

  if (heroImage) {
    if (heroImage.data?.attributes?.url) {
      imageUrl = `${process.env.STRAPI_HOST}${heroImage.data.attributes.url}`;
    } else if (heroImage.url) {
      imageUrl = `${process.env.STRAPI_HOST}${heroImage.url}`;
    }
  }

  console.log("Hero image URL:", imageUrl);

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-lg text-gray-700 mb-8">{description}</p>
            <Link href="/categorias">
              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 text-white"
              >
                Explorar productos
              </Button>
            </Link>
          </div>

          <div className="hidden md:block">
            <Image
              src={imageUrl || "/home-image.jpg"}
              alt="Miramar Shop"
              width={600}
              height={600}
              className="rounded-lg object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
