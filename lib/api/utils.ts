import { getStrapiHost } from "./config";

/**
 * Obtiene la URL completa de una imagen desde Strapi
 * @param imageData Datos de la imagen de Strapi
 * @param fallback URL por defecto si no hay imagen
 */
export function getImageUrl(imageData: any, fallback: string = ""): string {
  if (!imageData) return fallback;

  const strapiHost = getStrapiHost();

  // Para imágenes de Cloudinary u otros proveedores externos
  if (
    imageData.attributes?.url &&
    imageData.attributes.url.startsWith("http")
  ) {
    return imageData.attributes.url;
  }

  // Para imágenes almacenadas en Strapi
  if (imageData.attributes?.url) {
    return `${strapiHost}${imageData.attributes.url}`;
  }

  return fallback;
}

/**
 * Procesa una imagen de Strapi en cualquiera de sus posibles formatos
 * @param data Datos de la imagen (puede estar en diferentes estructuras)
 */
export function processImage(
  data: any
): { url: string; width?: number; height?: number } | null {
  if (!data) return null;

  // Caso 1: es un string directo
  if (typeof data === "string") {
    return { url: data };
  }

  // Caso 2: Es un objeto de Strapi con data > attributes
  if (data.data?.attributes?.url) {
    return {
      url: data.data.attributes.url,
      width: data.data.attributes.width,
      height: data.data.attributes.height,
    };
  }

  // Caso 3: Es un objeto simple con url
  if (data.url) {
    return {
      url: data.url,
      width: data.width,
      height: data.height,
    };
  }

  return null;
}

/**
 * Trunca un string a un número específico de caracteres
 */
export function truncateString(str: string, length: number = 200): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}
