import { getStrapiHost, getStrapiFetchOptions } from "./config";
import { FAQ } from "./types";
import { truncateString } from "./utils";

/**
 * Obtiene las FAQs desde Strapi
 */
export async function getFaqs(): Promise<FAQ[]> {
  try {
    const strapiHost = getStrapiHost();
    console.log("Using STRAPI_HOST for FAQs:", strapiHost);

    const response = await fetch(
      `${strapiHost}/api/faqs?populate=*`,
      getStrapiFetchOptions()
    );

    if (!response.ok) {
      throw new Error(`Error fetching FAQs: ${response.status}`);
    }

    const data = await response.json();
    console.log("FAQs raw data:", truncateString(JSON.stringify(data)));

    // Verificar la estructura de los datos
    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error("Invalid data structure from Strapi for FAQs:", data);
      throw new Error("Invalid data structure from Strapi for FAQs");
    }

    console.log(`Found ${data.data.length} FAQs`);

    // Procesar las FAQs
    return data.data.map((item: any) => {
      const attributes = item.attributes || {};
      return {
        id: item.id,
        question: attributes.question || attributes.pregunta || "",
        answer: attributes.answer || attributes.respuesta || "",
      };
    });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
}
