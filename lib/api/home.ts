import { getStrapiHost, getStrapiFetchOptions } from "./config";
import { HomeContent, ImageType } from "./types";
import { processImage, truncateString } from "./utils";

/**
 * Obtiene el contenido de la página principal
 */
export async function getHomeContent(): Promise<HomeContent> {
  try {
    const strapiHost = getStrapiHost();
    console.log("Using STRAPI_HOST:", strapiHost);

    const response = await fetch(
      `${strapiHost}/api/home?populate=*`,
      getStrapiFetchOptions()
    );

    if (!response.ok) {
      throw new Error(`Error fetching home content: ${response.status}`);
    }

    const data = await response.json();
    console.log("Home content raw data:", truncateString(JSON.stringify(data)));

    // Verificar la estructura de los datos
    if (!data || !data.data) {
      console.error("Invalid data structure from Strapi:", data);
      throw new Error("Invalid data structure from Strapi");
    }

    // Extraer los datos de la respuesta
    const homeData = data.data.attributes || data.data;
    console.log("Home data fields:", Object.keys(homeData));

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
    // Devolver un objeto vacío con la estructura esperada
    return {
      title: "Miramar Shop",
      description: "Tu tienda online favorita",
      cover: null,
    };
  }
}
