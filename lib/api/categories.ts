import { getStrapiHost, getStrapiFetchOptions } from "./config";
import { Category } from "./types";
import { processImage, truncateString } from "./utils";

/**
 * Obtiene todas las categorías
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const strapiHost = getStrapiHost();

    // Intentar diferentes nombres posibles de colección, empezando por el más probable
    const possibleEndpoints = [
      `${strapiHost}/api/categories?populate=*`,
      `${strapiHost}/api/category?populate=*`,
      `${strapiHost}/api/categoria?populate=*`,
    ];

    let data = null;
    let successEndpoint = "";

    // Intentar cada endpoint hasta encontrar uno que funcione
    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Intentando obtener categorías desde: ${endpoint}`);

        const response = await fetch(endpoint, getStrapiFetchOptions());

        if (response.ok) {
          data = await response.json();
          successEndpoint = endpoint;
          console.log(`✅ Éxito al obtener categorías desde: ${endpoint}`);
          break;
        } else {
          console.log(`❌ Error ${response.status} al intentar: ${endpoint}`);
        }
      } catch (error) {
        console.log(`Error al intentar ${endpoint}:`, error);
      }
    }

    if (!data) {
      console.error("No se pudo obtener categorías de ningún endpoint");
      return [];
    }

    console.log(`Categorías encontradas en: ${successEndpoint}`);
    console.log("Estructura de datos recibida:", JSON.stringify(data, null, 2));

    if (!data.data && !Array.isArray(data)) {
      console.error("Respuesta sin propiedad 'data' o no es un array:", data);
      return [];
    }

    // La respuesta puede estar directamente en data o ser data en sí mismo
    const items = data.data || data;

    if (!Array.isArray(items)) {
      console.error("Los datos no son un array:", items);
      return [];
    }

    // Transformar los datos para que coincidan con la estructura esperada
    const categories = items.map((category: any) => {
      console.log("Procesando categoría:", category);

      // Los datos pueden estar directamente en el objeto o en attributes
      const attributes = category.attributes || {};

      // Obtener el nombre - buscamos en todos los lugares posibles
      let categoryName = "Categoría sin nombre";
      if (category.nombre) categoryName = category.nombre;
      else if (attributes.nombre) categoryName = attributes.nombre;
      else if (category.name) categoryName = category.name;
      else if (attributes.name) categoryName = attributes.name;

      // Obtener descripción
      let categoryDescription = "";
      if (category.descripcion) categoryDescription = category.descripcion;
      else if (attributes.descripcion)
        categoryDescription = attributes.descripcion;
      else if (category.description) categoryDescription = category.description;
      else if (attributes.description)
        categoryDescription = attributes.description;

      // Obtener slug
      let categorySlug = `categoria-${category.id}`;
      if (category.slug) categorySlug = category.slug;
      else if (attributes.slug) categorySlug = attributes.slug;

      // Crear el objeto categoría
      const processedCategory: Category = {
        id: category.id,
        name: categoryName,
        description: categoryDescription,
        slug: categorySlug,
        image: null,
      };

      // Procesar imagen - buscamos en todos los lugares posibles
      const image =
        processImage(category.imagen) ||
        processImage(attributes.imagen) ||
        processImage(category.image) ||
        processImage(attributes.image) ||
        processImage(category.cover) ||
        processImage(attributes.cover);

      if (image) {
        processedCategory.image = image;
        console.log(
          `Imagen encontrada para categoría ${categoryName}: ${image.url}`
        );
      } else {
        console.log(`No se encontró imagen para la categoría ${categoryName}`);
      }

      return processedCategory;
    });

    console.log(`Total de ${categories.length} categorías procesadas`);
    return categories;
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return [];
  }
}
