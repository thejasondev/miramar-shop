// Tipos para los datos de Strapi
export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiImage {
  data: {
    id: number;
    attributes: {
      url: string;
      alternativeText: string;
    };
  };
}

export interface Category {
  id: number;
  attributes: {
    name: string;
    description: string;
    slug: string;
    image: StrapiImage;
  };
}

export interface Product {
  id: number;
  attributes: {
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    featured: boolean;
    slug: string;
    image: StrapiImage;
    category: {
      data: {
        id: number;
        attributes: {
          name: string;
          slug: string;
        };
      };
    };
  };
}

export interface FAQ {
  id: number;
  attributes: {
    question: string;
    answer: string;
  };
}

// Funciones de utilidad
const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
const strapiToken = process.env.STRAPI_API_TOKEN;

async function fetchAPI<T>(endpoint: string, options = {}): Promise<T> {
  const defaultOptions = {
    headers: {
      Authorization: `Bearer ${strapiToken}`,
      "Content-Type": "application/json",
    },
    ...options,
  };

  const response = await fetch(`${strapiUrl}/api/${endpoint}`, defaultOptions);

  if (!response.ok) {
    throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
  }

  return response.json();
}

// Funciones específicas para cada tipo de contenido
export async function getCategories() {
  return fetchAPI<StrapiResponse<Category>>("categories?populate=*");
}

export async function getCategoryBySlug(slug: string) {
  return fetchAPI<StrapiResponse<Category>>(
    `categories?filters[slug]=${slug}&populate=*`
  );
}

export async function getProducts(options = {}) {
  const queryString = new URLSearchParams({
    populate: "*",
    ...options,
  }).toString();

  return fetchAPI<StrapiResponse<Product>>(`products?${queryString}`);
}

export async function getFeaturedProducts() {
  return fetchAPI<StrapiResponse<Product>>(
    "products?filters[featured][$eq]=true&populate=*"
  );
}

export async function getDiscountedProducts() {
  return fetchAPI<StrapiResponse<Product>>(
    "products?filters[discountPrice][$notNull]=true&populate=*"
  );
}

export async function getProductsByCategory(categorySlug: string) {
  return fetchAPI<StrapiResponse<Product>>(
    `products?filters[category][slug][$eq]=${categorySlug}&populate=*`
  );
}

export async function getFAQs() {
  return fetchAPI<StrapiResponse<FAQ>>("faqs?populate=*");
}

// Función de búsqueda
export async function searchProducts(query: string) {
  return fetchAPI<StrapiResponse<Product>>(
    `products?filters[$or][0][name][$containsi]=${query}&filters[$or][1][description][$containsi]=${query}&populate=*`
  );
}
