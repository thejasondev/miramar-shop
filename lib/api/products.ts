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

    // MÉTODO PRINCIPAL: Obtener las categorías con sus productos
    try {
      // Usamos populate=* para incluir todas las relaciones, incluido cover del producto
      const categoriesEndpoint = `${strapiHost}/api/categories?populate[products][populate]=cover&populate=cover`;
      console.log(`Obteniendo categorías con productos: ${categoriesEndpoint}`);

      const response = await fetch(categoriesEndpoint, getStrapiFetchOptions());

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Éxito obteniendo categorías con productos`);

        // Buscar la categoría específica
        const categories = data.data || [];
        const targetCategory = categories.find(
          (cat: any) => cat.id.toString() === categoryId
        );

        if (targetCategory) {
          console.log(
            `✅ Encontrada categoría ID ${categoryId}: ${targetCategory.name}`
          );
          console.log(
            `Datos de categoría: ${JSON.stringify(targetCategory, null, 2)}`
          );

          // Verificar si tiene productos asociados
          const products = targetCategory.products || [];
          console.log(
            `La categoría tiene ${products.length} productos asociados`
          );

          if (products.length > 0) {
            // Procesar los productos de la categoría
            const processedProducts: Product[] = products.map(
              (product: any) => {
                console.log(
                  `Procesando producto: ${product.name || product.id}`
                );
                console.log(
                  `Datos del producto: ${JSON.stringify(product, null, 2)}`
                );

                // Intentamos usar la imagen del producto si existe
                let productImage = null;

                // Verificar si el producto tiene imagen propia
                if (product.cover && product.cover.url) {
                  console.log(
                    `Producto tiene su propia imagen: ${product.cover.url}`
                  );
                  productImage = {
                    url: product.cover.url,
                    width: product.cover.width || 800,
                    height: product.cover.height || 600,
                  };
                } else {
                  // Si no tiene imagen propia, usar la de la categoría como respaldo
                  console.log(
                    `Producto no tiene imagen propia, usando la de la categoría`
                  );
                  if (targetCategory.cover && targetCategory.cover.url) {
                    productImage = {
                      url: targetCategory.cover.url,
                      width: targetCategory.cover.width || 800,
                      height: targetCategory.cover.height || 600,
                    };
                  }
                }

                // Crear objeto de producto con la estructura correcta
                return {
                  id: product.id,
                  name: product.name,
                  slug: product.slug || `producto-${product.id}`,
                  description: product.description || "",
                  image: productImage,
                  categories: [
                    {
                      id: parseInt(categoryId),
                      name: targetCategory.name || "Categoría",
                      slug: targetCategory.slug || `categoria-${categoryId}`,
                    },
                  ],
                  prices: [
                    {
                      id: 1,
                      size: "Único",
                      price: product.price || 0,
                      discountPrice: product.discountPrice || 0,
                    },
                  ],
                };
              }
            );

            console.log(
              `✅ Procesados ${processedProducts.length} productos de categoría ${targetCategory.name}`
            );
            return processedProducts;
          }
        }
      }
    } catch (error) {
      console.error("Error obteniendo categorías con productos:", error);
    }

    // Si no se encontraron productos, devolver array vacío
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
        prices: [
          {
            id: 1,
            size: "Único",
            price: attributes.precio || attributes.price || 0,
            discountPrice:
              attributes.descuento || attributes.discountPrice || 0,
          },
        ],
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
            discountPrice:
              priceAttrs.descuento || priceAttrs.discountPrice || 0,
          };
        });
      } else {
        // Si no hay precios en el objeto precios, usar el precio directo del producto
        prices = [
          {
            id: 1,
            size: "Único",
            price: attributes.precio || attributes.price || 0,
            discountPrice:
              attributes.descuento || attributes.discountPrice || 0,
          },
        ];
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
  const strapiHost = getStrapiHost();
  console.log("Obteniendo productos con descuento...");

  try {
    // 1. Hacer la petición a Strapi
    const url = `${strapiHost}/api/products?filters[discountPrice][$notNull]=true&populate=*`;
    console.log(`Consultando: ${url}`);

    const response = await fetch(url, getStrapiFetchOptions());

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // 2. Procesar la respuesta
    const responseData = await response.json();

    // 3. Validar que hay datos
    if (
      !responseData.data ||
      !Array.isArray(responseData.data) ||
      responseData.data.length === 0
    ) {
      console.log("No se encontraron productos con descuento");
      return [];
    }

    console.log(
      `Se encontraron ${responseData.data.length} productos con descuento`
    );

    // Imprimir la estructura completa del primer producto para diagnóstico
    if (responseData.data.length > 0) {
      const firstProduct = responseData.data[0];
      console.log("Estructura completa del primer producto:");
      console.log(JSON.stringify(firstProduct, null, 2));
    }

    // 4. Mapear los datos - IMPORTANTE: Los datos vienen directamente en el objeto, no en attributes
    const products = responseData.data.map((product) => {
      // Extraer datos básicos - Acceso directo porque no están en attributes
      const id = product.id;
      const name = product.name || "Producto sin nombre"; // Acceso directo
      const description = product.description || ""; // Acceso directo
      const price = product.price || 0; // Acceso directo
      const discountPrice = product.discountPrice || 0; // Acceso directo

      console.log(`Procesando producto con descuento: ${name} (ID: ${id})`);
      console.log(
        `Precio original: ${price}, Precio con descuento: ${discountPrice}`
      );

      // Procesar imagen - El objeto cover está directamente en el producto
      let image = null;

      if (product.cover && product.cover.url) {
        image = {
          url: product.cover.url,
          width: product.cover.width || 800,
          height: product.cover.height || 600,
        };
        console.log(`Imagen encontrada: ${image.url}`);
      }

      // Crear producto con estructura correcta
      return {
        id,
        name,
        slug: `producto-${id}`,
        description,
        image,
        categories: product.category
          ? [
              {
                id: product.category.id,
                name: product.category.name || "Categoría",
                slug: `categoria-${product.category.id}`,
              },
            ]
          : [],
        prices: [
          {
            id: 1,
            size: "Único",
            price,
            discountPrice,
          },
        ],
      };
    });

    // Verificar los productos procesados
    console.log("Productos procesados correctamente:");
    products.forEach((p) => {
      console.log(`- ${p.name} (ID: ${p.id}):`);
      console.log(`  • Precio original: $${p.prices[0].price}`);
      console.log(`  • Precio descuento: $${p.prices[0].discountPrice}`);
      console.log(`  • Tiene imagen: ${p.image ? "SÍ" : "NO"}`);
      if (p.image) {
        console.log(`  • URL imagen: ${p.image.url}`);
      }
    });

    return products;
  } catch (error) {
    console.error("Error obteniendo productos con descuento:", error);
    return [];
  }
}
