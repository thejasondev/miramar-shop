/**
 * Tipos de datos para la aplicación
 */

/**
 * Representa una categoría
 */
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: ImageType | null;
}

/**
 * Representa una imagen
 */
export interface ImageType {
  url: string;
  width?: number;
  height?: number;
  formats?: any;
}

/**
 * Representa un precio de producto
 */
export interface Price {
  id: number;
  size: string;
  price: number;
  discountPrice?: number; // Precio con descuento (opcional)
}

/**
 * Representa un producto completo
 */
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: ImageType | null;
  categories: Category[];
  prices: Price[];
}

/**
 * Representa el contenido de la página principal
 */
export interface HomeContent {
  title: string;
  description: string;
  cover: ImageType | null;
}

/**
 * Representa una pregunta frecuente
 */
export interface FAQ {
  id: number;
  question: string;
  answer: string;
}
