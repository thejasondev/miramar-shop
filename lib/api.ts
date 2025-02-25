export async function getFaqs() {
  try {
    const response = await fetch(`${process.env.STRAPI_HOST}/api/faqs`, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      },
      cache: "no-store",
    });
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
}

export async function getHomeContent() {
  try {
    const response = await fetch(
      `${process.env.STRAPI_HOST}/api/home?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        cache: "no-store",
      }
    );
    const data = await response.json();
    return data?.data?.attributes || {};
  } catch (error) {
    console.error("Error fetching home content:", error);
    return {};
  }
}

export async function getCategories() {
  try {
    const response = await fetch(
      `${process.env.STRAPI_HOST}/api/categories?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        cache: "no-store",
      }
    );
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Función para obtener productos por categoría
export async function getProductsByCategory(categoryId: string) {
  try {
    console.log(
      `Intentando obtener productos para la categoría ID: ${categoryId}`
    );

    // Intentar diferentes endpoints y estructuras
    const endpoints = [
      // 1. Productos filtrados por categoría
      `${process.env.STRAPI_HOST}/api/products?filters[category][id][$eq]=${categoryId}&populate=*`,

      // 2. Productos filtrados por categoría (estructura alternativa)
      `${process.env.STRAPI_HOST}/api/products?filters[categories][id][$eq]=${categoryId}&populate=*`,

      // 3. Obtener la categoría con sus productos relacionados
      `${process.env.STRAPI_HOST}/api/categories/${categoryId}?populate[products][populate]=*`,

      // 4. Obtener la categoría con sus productos relacionados (estructura alternativa)
      `${process.env.STRAPI_HOST}/api/categories/${categoryId}?populate=products.image`,
    ];

    let products = [];
    let lastError = null;

    // Intentar cada endpoint hasta encontrar uno que funcione
    for (const endpoint of endpoints) {
      try {
        console.log(`Intentando endpoint: ${endpoint}`);

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          console.log(
            `Endpoint ${endpoint} falló con estado: ${response.status}`
          );
          continue;
        }

        const data = await response.json();
        console.log(
          `Datos obtenidos de ${endpoint}:`,
          JSON.stringify(data, null, 2).substring(0, 300) + "..."
        );

        // Extraer productos según la estructura de datos
        if (endpoint.includes("products?filters")) {
          // Caso 1 y 2: Respuesta directa de productos
          if (data?.data && Array.isArray(data.data)) {
            products = data.data;
            break;
          }
        } else {
          // Caso 3 y 4: Productos dentro de la categoría
          if (
            data?.data?.attributes?.products?.data &&
            Array.isArray(data.data.attributes.products.data)
          ) {
            products = data.data.attributes.products.data;
            break;
          }
        }
      } catch (error) {
        console.log(`Error con endpoint ${endpoint}:`, error);
        lastError = error;
      }
    }

    if (products.length > 0) {
      console.log(
        `Se encontraron ${products.length} productos para la categoría ${categoryId}`
      );
      return products;
    }

    if (lastError) {
      throw lastError;
    }

    return [];
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    return [];
  }
}

export async function getDiscountedProducts() {
  try {
    const response = await fetch(
      `${process.env.STRAPI_HOST}/api/products?filters[discountPrice][$notNull]=true&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        cache: "no-store",
      }
    );
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching discounted products:", error);
    return [];
  }
}
