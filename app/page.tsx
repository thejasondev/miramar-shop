import { getHomeContent, getCategories } from "@/lib/api";
import { checkStrapiCollections } from "@/lib/api/debug";
import Hero from "@/components/sections/hero";
import FeaturedCategories from "@/components/sections/featured-categories";
import CallToAction from "@/components/sections/call-to-action";

export default async function HomePage() {
  // Verificar las colecciones disponibles en Strapi
  try {
    await checkStrapiCollections();
  } catch (error) {
    console.error("Error al verificar colecciones:", error);
  }

  // Obtener datos de Strapi con manejo de errores
  let homeContent = null;
  let categories = [];

  try {
    homeContent = await getHomeContent();
    console.log("Home content in page:", {
      title: homeContent?.title || "No title",
      description: homeContent?.description
        ? "Description present"
        : "No description",
      cover: homeContent?.cover ? "Cover present" : "No cover",
    });

    // Verificar la estructura completa del homeContent
    console.log(
      "Home content structure FULL in page:",
      JSON.stringify(homeContent)
    );

    // Verificar la estructura de la imagen de portada
    if (homeContent?.cover) {
      console.log(
        "Cover structure in page FULL:",
        JSON.stringify(homeContent.cover)
      );
    } else {
      console.log("No cover field in homeContent");
    }
  } catch (error) {
    console.error("Error al cargar el contenido de inicio:", error);
    homeContent = {
      title: null,
      description: null,
      cover: null,
    };
  }

  try {
    categories = await getCategories();

    // Mostrar detalles de las categorías para depuración
    console.log("Categories count:", categories?.length || 0);

    if (categories && categories.length > 0) {
      console.log("Primera categoría:", JSON.stringify(categories[0], null, 2));
    }
  } catch (error) {
    console.error("Error al cargar las categorías:", error);
    categories = [];
  }

  // Si no hay categorías, crear algunas de prueba
  if (!categories || categories.length === 0) {
    console.log("Creando categorías de prueba...");
    categories = [
      {
        id: 1,
        name: "Ropa de Verano",
        description: "Colección de ropa fresca para el verano",
        slug: "ropa-verano",
        image: {
          url: "https://res.cloudinary.com/dkyayjjyx/image/upload/v1744663197/miramar-shop/hero_7127cd4725.webp",
          width: 1920,
          height: 1080,
        },
      },
      {
        id: 2,
        name: "Accesorios",
        description: "Complementos para completar tu look",
        slug: "accesorios",
        image: {
          url: "https://res.cloudinary.com/dkyayjjyx/image/upload/v1744663197/miramar-shop/hero_7127cd4725.webp",
          width: 1920,
          height: 1080,
        },
      },
      {
        id: 3,
        name: "Calzado",
        description: "Zapatos y sandalias para toda ocasión",
        slug: "calzado",
        image: {
          url: "https://res.cloudinary.com/dkyayjjyx/image/upload/v1744663197/miramar-shop/hero_7127cd4725.webp",
          width: 1920,
          height: 1080,
        },
      },
    ];
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
