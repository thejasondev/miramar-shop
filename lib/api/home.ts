import { getStrapiHost, getStrapiFetchOptions } from "./config";
import { HomeContent, ImageType } from "./types";
import { processImage, truncateString } from "./utils";
import { getCategories } from "./categories"; // Importar para usar como fallback

/**
 * Obtiene el contenido de la página principal
 */
export async function getHomeContent(): Promise<HomeContent> {
  try {
    const strapiHost = getStrapiHost();
    console.log("Using STRAPI_HOST:", strapiHost);

    // Posibles endpoints para la colección home
    const possibleEndpoints = [
      `${strapiHost}/api/home?populate=*`,
    ];

    let data = null;
    let successEndpoint = "";

    // Intenta cada endpoint hasta que uno funcione
    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Intentando obtener contenido desde: ${endpoint}`);
        const response = await fetch(endpoint, getStrapiFetchOptions());

        if (response.ok) {
          data = await response.json();
          successEndpoint = endpoint;
          console.log(`✅ Éxito al obtener home desde: ${endpoint}`);
          break;
        } else {
          console.log(`❌ Error ${response.status} al intentar: ${endpoint}`);
        }
      } catch (error) {
        console.log(`Error al intentar ${endpoint}:`, error);
      }
    }

    // Si no se pudo obtener el contenido de home, intentar usar la primera categoría como fallback
    if (!data) {
      console.log(
        "Intentando obtener contenido desde categorías como fallback..."
      );
      try {
        // Obtener categorías para usar la primera como home si está disponible
        const categories = await getCategories();
        if (categories && categories.length > 0) {
          const firstCategory = categories[0];
          console.log(
            `✅ Usando la categoría "${firstCategory.name}" como fallback para home`
          );

          return {
            title: "Miramar Shop",
            description: `Explora nuestra colección de ${firstCategory.name} y más productos`,
            cover: firstCategory.image,
          };
        }
      } catch (error) {
        console.log("Error al intentar usar categorías como fallback:", error);
      }

      console.log(
        "No se pudo obtener contenido de ninguna fuente, usando valores por defecto"
      );
      return {
        title: "Miramar Shop",
        description: "Tu tienda online favorita",
        cover: null,
      };
    }

    console.log(
      "Home content raw structure:",
      data.data ? "Tiene data" : "No tiene data",
      data.attributes ? "Tiene attributes" : "No tiene attributes"
    );

    // Extraer los datos según la estructura disponible
    let homeData;
    if (data.data && data.data.attributes) {
      // Estructura normal de Strapi v4
      homeData = data.data.attributes;
    } else if (data.attributes) {
      // Directamente en attributes
      homeData = data.attributes;
    } else if (data.data) {
      // Directamente en data
      homeData = data.data;
    } else {
      // Usar el objeto completo como último recurso
      homeData = data;
    }

    console.log("Home data fields encontrados:", Object.keys(homeData));

    // Procesar y sacar la URL de la imagen correctamente
    let coverImage: ImageType | null = null;

    // Intentar diferentes variantes de la imagen
    if (homeData.Imagen) {
      coverImage = processImage(homeData.Imagen);
    } else if (homeData.Image) {
      coverImage = processImage(homeData.Image);
    } else if (homeData.imagen) {
      coverImage = processImage(homeData.imagen);
    } else if (homeData.image) {
      coverImage = processImage(homeData.image);
    } else if (homeData.cover) {
      coverImage = processImage(homeData.cover);
    }

    if (coverImage) {
      console.log("Cover image processed:", {
        url: coverImage.url,
        width: coverImage.width,
        height: coverImage.height,
      });
    } else {
      console.log("No cover image found in any expected format");
    }

    // Devolver los datos procesados con los nombres de campos correctos
    return {
      title: homeData.Title || homeData.title || "Miramar Shop",
      description:
        homeData.Description ||
        homeData.description ||
        "Tu tienda online favorita",
      cover: coverImage,
    };
  } catch (error) {
    console.error("Error fetching home content:", error);
    // Devolver un objeto con valores por defecto
    return {
      title: "Miramar Shop",
      description: "Tu tienda online favorita",
      cover: null,
    };
  }
}
