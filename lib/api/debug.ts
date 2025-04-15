import { getStrapiHost, getStrapiFetchOptions } from "./config";

/**
 * Función de depuración para verificar las colecciones y contenido disponibles en Strapi
 */
export async function checkStrapiCollections() {
  try {
    const strapiHost = getStrapiHost();
    console.log("Verificando colecciones en Strapi:", strapiHost);

    // Intentar obtener el endpoint de categorías
    const categoriesEndpoint = `${strapiHost}/api/categories?populate=*`;
    console.log(`Intentando acceder a: ${categoriesEndpoint}`);

    try {
      const categoriesResponse = await fetch(
        categoriesEndpoint,
        getStrapiFetchOptions()
      );
      console.log(
        `Respuesta de categorías: ${categoriesResponse.status} ${categoriesResponse.statusText}`
      );

      if (categoriesResponse.ok) {
        const data = await categoriesResponse.json();
        console.log(
          "Estructura de datos de categorías:",
          JSON.stringify(data, null, 2)
        );
        return {
          success: true,
          message: "Datos de categorías obtenidos correctamente",
          data,
        };
      }
    } catch (error) {
      console.error("Error al verificar categorías:", error);
    }

    // Intentar obtener la colección de API disponible
    const apiEndpoint = `${strapiHost}/api`;
    console.log(`Intentando acceder a: ${apiEndpoint}`);

    try {
      const apiResponse = await fetch(apiEndpoint, getStrapiFetchOptions());
      console.log(
        `Respuesta del API: ${apiResponse.status} ${apiResponse.statusText}`
      );

      if (apiResponse.ok) {
        const data = await apiResponse.json();
        console.log("Colecciones API disponibles:", data);
        return {
          success: true,
          message: "Listado de APIs obtenido correctamente",
          data,
        };
      }
    } catch (error) {
      console.error("Error al verificar APIs disponibles:", error);
    }

    return {
      success: false,
      message: "No se pudo obtener información de Strapi",
      data: null,
    };
  } catch (error) {
    console.error("Error general al verificar Strapi:", error);
    return {
      success: false,
      message: "Error al conectar con Strapi",
      error,
    };
  }
}
