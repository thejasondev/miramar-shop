/**
 * Configuración global para API
 */

/**
 * Obtiene la URL base de Strapi
 */
export const getStrapiHost = (): string => {
  return process.env.NEXT_PUBLIC_STRAPI_HOST || "http://localhost:1337";
};

/**
 * Obtiene el token de Strapi para autenticación
 */
export const getStrapiToken = (): string => {
  return process.env.NEXT_PUBLIC_STRAPI_TOKEN || "";
};

/**
 * Opciones de fetch por defecto para Strapi
 */
export const getStrapiFetchOptions = (method: string = "GET"): RequestInit => {
  return {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getStrapiToken()}`,
    },
    cache: "no-store",
  };
};

/**
 * Image placeholder por defecto
 */
export const DEFAULT_IMAGE_PLACEHOLDER = "/placeholder.svg";
