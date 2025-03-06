export async function getFaqs() {
  try {
    // Usar fetch directamente con la URL completa y el token hardcodeado
    const strapiHost = process.env.STRAPI_HOST || 'http://localhost:1337';
    const strapiToken = "3a00d21bd74155346d76384e0f1f5134bd6849a0d9c721ac84717b88c7ecfde602a01b61a72734e055167b98edd5c342648e6c9cdbcf01ea1d5eec66a31054434e62bda0ca54daa3962ea08d482a8dd72505329eec08a88c12f4685473fd52ec03238ebcf0075a67ce851b105378574277386d7dfaa46a992f42f2a1dcd8ae7b";
    
    console.log("Using STRAPI_HOST for FAQs:", strapiHost);
    
    const response = await fetch(
      `${strapiHost}/api/faqs?populate=*`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${strapiToken}`,
        },
        cache: "no-store",
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching FAQs: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("FAQs raw data:", JSON.stringify(data).substring(0, 200) + "...");
    
    // Verificar la estructura de los datos
    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error("Invalid data structure from Strapi for FAQs:", data);
      throw new Error("Invalid data structure from Strapi for FAQs");
    }
    
    console.log(`Found ${data.data.length} FAQs`);
    
    // Verificar la estructura del primer FAQ si existe
    if (data.data.length > 0) {
      const firstFaq = data.data[0];
      console.log("First FAQ structure:", {
        id: firstFaq.id,
        question: firstFaq.question || 'No question field directly',
        answer: firstFaq.answer || 'No answer field directly'
      });
    }
    
    return data.data || [];
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
}

export async function getHomeContent() {
  try {
    // Usar fetch directamente con la URL completa para evitar problemas con variables de entorno
    const strapiHost = process.env.STRAPI_HOST || 'http://localhost:1337';
    const strapiToken = process.env.STRAPI_TOKEN;
    
    console.log("Using STRAPI_HOST:", strapiHost);
    
    const response = await fetch(
      `${strapiHost}/api/home?populate=*`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${strapiToken}`,
        },
        cache: "no-store",
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching home content: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Home content raw data:", JSON.stringify(data).substring(0, 200) + "...");
    
    // Verificar la estructura de los datos
    if (!data || !data.data) {
      console.error("Invalid data structure from Strapi:", data);
      throw new Error("Invalid data structure from Strapi");
    }
    
    // Extraer los datos de la respuesta
    const homeData = data.data;
    
    console.log("Home data fields:", Object.keys(homeData));
    
    // Verificar si tenemos la imagen de portada
    if (homeData.cover) {
      console.log("Cover image found:", {
        id: homeData.cover.id,
        url: homeData.cover.url,
        formats: homeData.cover.formats ? Object.keys(homeData.cover.formats) : 'No formats'
      });
    } else {
      console.log("No cover image found in home data");
    }
    
    // Devolver los datos procesados
    return {
      title: homeData.title || null,
      description: homeData.description || null,
      cover: homeData.cover || null
    };
  } catch (error) {
    console.error("Error fetching home content:", error);
    // Devolver un objeto vacío con la estructura esperada
    return {
      title: null,
      description: null,
      cover: null
    };
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
