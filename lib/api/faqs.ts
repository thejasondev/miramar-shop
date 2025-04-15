import { getStrapiHost, getStrapiFetchOptions } from "./config";

/**
 * Interfaz para las preguntas frecuentes
 */
export interface Faq {
  id: number;
  question: string;
  answer: string | any[];
}

/**
 * Obtiene las preguntas frecuentes desde Strapi
 */
export async function getFaqs(): Promise<Faq[]> {
  try {
    const strapiHost = getStrapiHost();
    console.log("Obteniendo preguntas frecuentes desde Strapi...");

    const endpoint = `${strapiHost}/api/faqs?populate=*`;
    console.log(`Consultando endpoint: ${endpoint}`);

    const response = await fetch(endpoint, getStrapiFetchOptions());

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(
      "Respuesta de Strapi para FAQs:",
      JSON.stringify(data, null, 2).substring(0, 200) + "..."
    );

    // Validar la estructura de datos
    if (!data?.data || !Array.isArray(data.data)) {
      console.log("Estructura de datos inválida o vacía");
      return [];
    }

    // Mapear las FAQs al formato requerido por el cliente
    const faqs = data.data.map((item: any) => {
      // Los datos pueden venir directamente en el item o en attributes
      const attributes = item.attributes || item;
      const question = attributes.question || "";
      const answer = attributes.answer || "";

      console.log(
        `Procesando FAQ ID ${item.id}: "${question.substring(0, 30)}..."`
      );

      return {
        id: item.id,
        question,
        answer,
      };
    });

    console.log(`Se encontraron ${faqs.length} preguntas frecuentes`);
    return faqs;
  } catch (error) {
    console.error("Error obteniendo FAQs:", error);
    return [];
  }
}
