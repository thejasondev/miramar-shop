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
    console.log("Home content in page:", {
      title: homeContent?.title || 'No title',
      description: homeContent?.description ? 'Description present' : 'No description',
      cover: homeContent?.cover ? 'Cover present' : 'No cover'
    });
    
    // Verificar la estructura completa del homeContent
    console.log("Home content structure FULL in page:", JSON.stringify(homeContent));
    
    // Verificar la estructura de la imagen de portada
    if (homeContent?.cover) {
      console.log("Cover structure in page FULL:", JSON.stringify(homeContent.cover));
    } else {
      console.log("No cover field in homeContent");
    }
  } catch (error) {
    console.error("Error al cargar el contenido de inicio:", error);
    homeContent = {
      title: null,
      description: null,
      cover: null
    };
  }

  try {
    categories = await getCategories();
    console.log("Categories count:", categories?.length || 0);
  } catch (error) {
    console.error("Error al cargar las categorías:", error);
    categories = [];
  }

  // Pasar los datos directamente al componente Hero
  return (
    <div className="pt-16">
      <Hero
        title={homeContent?.title}
        description={homeContent?.description}
        heroImage={homeContent?.cover}
      />
      <FeaturedCategories categories={categories} />
      <CallToAction />
    </div>
  );
}
