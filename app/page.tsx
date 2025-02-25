import { getHomeContent, getCategories } from "@/lib/api";
import Hero from "@/components/sections/hero";
import FeaturedCategories from "@/components/sections/featured-categories";
import CallToAction from "@/components/sections/call-to-action";

export default async function HomePage() {
  // Obtener datos de Strapi con manejo de errores
  let homeContent = null;
  let categories = [];

  try {
    homeContent = await getHomeContent();
    console.log("Home content:", homeContent);
  } catch (error) {
    console.error("Error al cargar el contenido de inicio:", error);
    homeContent = {
      title: "Bienvenido a Miramar Shop",
      description:
        "Tu tienda deportiva de confianza. Explora nuestras categorías y encuentra los mejores productos para tu deporte favorito.",
      heroImage: null,
    };
  }

  try {
    categories = await getCategories();
    console.log("Categories:", categories);
  } catch (error) {
    console.error("Error al cargar las categorías:", error);
    categories = [];
  }

  return (
    <div className="pt-16">
      <Hero
        title={homeContent?.title}
        description={homeContent?.description}
        heroImage={homeContent?.heroImage}
      />
      <FeaturedCategories categories={categories} />
      <CallToAction />
    </div>
  );
}
