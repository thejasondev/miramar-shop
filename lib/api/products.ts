import {
  getStrapiHost,
  getStrapiFetchOptions,
  DEFAULT_IMAGE_PLACEHOLDER,
} from "./config";
import { Category, Price, Product } from "./types";
import { getImageUrl, processImage, truncateString } from "./utils";

/**
 * Obtiene productos por categoría de manera simplificada y robusta
 */
export async function getProductsByCategory(
  categoryId?: string
): Promise<Product[]> {
  try {
    const strapiHost = getStrapiHost();
    console.log(`Buscando productos para categoría ID: ${categoryId}`);

    // Si no tenemos ID o es "0", obtener todos los productos
    if (!categoryId || categoryId === "0") {
      const endpoint = `${strapiHost}/api/productos?populate=*`;
      console.log(`Consultando todos los productos: ${endpoint}`);
      return await fetchAndProcessProducts(endpoint);
    }

    // Si tenemos ID, probar con diferentes variantes de nombres de campo para la relación
    const possibleEndpoints = [
      // Variante 1: categorias (más común)
      `${strapiHost}/api/productos?populate=*&filters[categorias][id][$eq]=${categoryId}`,

      // Variante 2: categoria (singular)
      `${strapiHost}/api/productos?populate=*&filters[categoria][id][$eq]=${categoryId}`,

      // Variante 3: categories (inglés)
      `${strapiHost}/api/productos?populate=*&filters[categories][id][$eq]=${categoryId}`,

      // Variante 4: category (inglés singular)
      `${strapiHost}/api/productos?populate=*&filters[category][id][$eq]=${categoryId}`,

      // Variante 5: Usando populate directo sin filtro (como respaldo)
      `${strapiHost}/api/productos?populate=categorias,imagen`,
    ];

    // Intentar cada endpoint
    for (const endpoint of possibleEndpoints) {
      console.log(`Intentando consultar: ${endpoint}`);
      const products = await fetchAndProcessProducts(endpoint);

      // Si encontramos productos, filtrar manualmente para asegurar que pertenecen a la categoría
      if (products.length > 0) {
        const filteredProducts = products.filter((product) =>
          product.categories.some((cat) => cat.id.toString() === categoryId)
        );

        if (filteredProducts.length > 0) {
          console.log(
            `✅ Encontrados ${filteredProducts.length} productos para categoría ${categoryId}`
          );
          return filteredProducts;
        }
      }
    }

    console.log(`No se encontraron productos para la categoría ${categoryId}`);
    return [];
  } catch (error) {
    console.error("Error en getProductsByCategory:", error);
    return [];
  }
}

/**
 * Función auxiliar para obtener y procesar productos
 */
async function fetchAndProcessProducts(endpoint: string): Promise<Product[]> {
  try {
    const response = await fetch(endpoint, getStrapiFetchOptions());

    if (!response.ok) {
      console.error(`Error al obtener productos: ${response.status}`);
      return [];
    }

    const data = await response.json();
    console.log(`Recibidos ${data?.data?.length || 0} productos`);

    // Si no hay datos, retornamos array vacío
    if (!data?.data || !Array.isArray(data.data) || data.data.length === 0) {
      return [];
    }

    // Procesamos cada producto para extraer la información relevante
    const products = data.data.map((item) => {
      const attributes = item.attributes || {};

      // Crear objeto básico de producto
      const product: Product = {
        id: item.id,
        name: attributes.nombre || "Producto sin nombre",
        slug: attributes.slug || `producto-${item.id}`,
        description: attributes.descripcion || "",
        image: null,
        categories: [],
        prices: [],
      };

      // Procesar imagen
      if (attributes.imagen && attributes.imagen.data) {
        try {
          const imgData = attributes.imagen.data;
          product.image = {
            url: imgData.attributes.url,
            width: imgData.attributes.width,
            height: imgData.attributes.height,
          };
        } catch (e) {
          console.error(`Error procesando imagen para producto ${item.id}:`, e);
        }
      }

      // Procesar categorías - probar con diferentes nombres
      try {
        // Variante 1: categorias (plural español)
        if (attributes.categorias && attributes.categorias.data) {
          product.categories = attributes.categorias.data.map((cat) => ({
            id: cat.id,
            name: cat.attributes.nombre || "Categoría",
            slug: cat.attributes.slug || `categoria-${cat.id}`,
          }));
        }
        // Variante 2: categoria (singular español)
        else if (attributes.categoria && attributes.categoria.data) {
          const cat = attributes.categoria.data;
          product.categories = [
            {
              id: cat.id,
              name: cat.attributes.nombre || "Categoría",
              slug: cat.attributes.slug || `categoria-${cat.id}`,
            },
          ];
        }
        // Variante 3: categories (plural inglés)
        else if (attributes.categories && attributes.categories.data) {
          product.categories = attributes.categories.data.map((cat) => ({
            id: cat.id,
            name: cat.attributes.name || "Categoría",
            slug: cat.attributes.slug || `categoria-${cat.id}`,
          }));
        }
        // Variante 4: category (singular inglés)
        else if (attributes.category && attributes.category.data) {
          const cat = attributes.category.data;
          product.categories = [
            {
              id: cat.id,
              name: cat.attributes.name || "Categoría",
              slug: cat.attributes.slug || `categoria-${cat.id}`,
            },
          ];
        }

        // Log de categorías asociadas
        if (product.categories.length > 0) {
          console.log(
            `Producto ${item.id} tiene ${
              product.categories.length
            } categorías: ${product.categories.map((c) => c.id).join(", ")}`
          );
        }
      } catch (e) {
        console.error(
          `Error procesando categorías para producto ${item.id}:`,
          e
        );
      }

      return product;
    });

    return products;
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    return [];
  }
}

/**
 * Obtiene productos destacados para la página principal
 */
export async function getProductsForHome(): Promise<Product[]> {
  try {
    const strapiHost = getStrapiHost();
    console.log("Obteniendo productos para home");

    // Obtener productos con toda su información relacionada
    const response = await fetch(
      `${strapiHost}/api/productos?populate=imagen,categories,precios`,
      getStrapiFetchOptions()
    );

    if (!response.ok) {
      throw new Error(`Error al obtener productos: ${response.status}`);
    }

    const data = await response.json();
    console.log(
      "Datos productos recibidos:",
      truncateString(JSON.stringify(data))
    );

    if (!data || !data.data) {
      console.error("Estructura de datos de productos inválida:", data);
      return [];
    }

    // Procesar productos
    const products = data.data.map((product: any) => {
      const attributes = product.attributes || {};

      // Extraer categorías
      let categories: Category[] = [];
      if (attributes.categories?.data) {
        categories = attributes.categories.data.map((cat: any) => {
          const catAttributes = cat.attributes || {};
          return {
            id: cat.id,
            name: catAttributes.nombre || catAttributes.name || "",
            slug: catAttributes.slug || `categoria-${cat.id}`,
          };
        });
      }

      // Procesar imagen
      let image = processImage(attributes.imagen);

      // Procesar precios
      let prices: Price[] = [];
      if (attributes.precios?.data) {
        prices = attributes.precios.data.map((price: any) => {
          const priceAttrs = price.attributes || {};
          return {
            id: price.id,
            size: priceAttrs.tamano || priceAttrs.size || "",
            price: priceAttrs.precio || priceAttrs.price || 0,
          };
        });
      }

      // Crear el objeto producto
      return {
        id: product.id,
        name: attributes.nombre || attributes.name || "",
        slug: attributes.slug || `producto-${product.id}`,
        description: attributes.descripcion || attributes.description || "",
        image: image,
        categories: categories,
        prices: prices,
      };
    });

    console.log(`Productos procesados: ${products.length}`);
    return products;
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    return [];
  }
}

/**
 * Obtiene productos con descuento
 */
export async function getDiscountedProducts(): Promise<Product[]> {
  try {
    const strapiHost = getStrapiHost();
    console.log("Buscando productos con descuento...");

    // Intentar diferentes estructuras de campo para descuentos
    const endpoints = [
      // Variantes en español
      `${strapiHost}/api/productos?filters[precioDescuento][$notNull]=true&populate=*`,
      `${strapiHost}/api/productos?filters[PrecioDescuento][$notNull]=true&populate=*`,

      // Variantes en inglés
      `${strapiHost}/api/products?filters[discountPrice][$notNull]=true&populate=*`,
      `${strapiHost}/api/products?filters[DiscountPrice][$notNull]=true&populate=*`,
    ];

    let discountedProducts: any[] = [];

    // Intentar cada endpoint hasta encontrar uno que funcione
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, getStrapiFetchOptions());

        if (!response.ok) {
          console.log(
            `Endpoint ${endpoint} failed with status: ${response.status}`
          );
          continue;
        }

        const data = await response.json();
        if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
          discountedProducts = data.data;
          console.log(
            `Found ${discountedProducts.length} discounted products from ${endpoint}`
          );
          break;
        }
      } catch (error) {
        console.log(`Error with endpoint ${endpoint}:`, error);
      }
    }

    if (discountedProducts.length === 0) {
      console.log("No discounted products found");
      return [];
    }

    // Procesar los productos
    const products = discountedProducts.map((product) => {
      const attributes = product.attributes || {};

      // Extraer datos básicos
      const id = product.id;
      const name =
        attributes.nombre || attributes.name || "Producto sin nombre";
      const description =
        attributes.descripcion || attributes.description || "";
      const price = attributes.precio || attributes.price || 0;

      // Procesar imagen
      const image =
        processImage(attributes.imagen) || processImage(attributes.image);

      // Devolver producto procesado
      return {
        id,
        name,
        slug: attributes.slug || `producto-${id}`,
        description,
        image,
        categories: [], // Por simplicidad no procesamos categorías aquí
        prices: [
          {
            id: 1,
            size: "Único",
            price,
          },
        ],
      };
    });

    console.log(`Processed ${products.length} discounted products`);
    return products;
  } catch (error) {
    console.error("Error fetching discounted products:", error);
    return [];
  }
}
