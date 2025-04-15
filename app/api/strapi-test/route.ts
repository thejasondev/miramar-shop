import { NextResponse } from "next/server";

/**
 * Ruta para examinar la respuesta directa de Strapi
 */
export async function GET() {
  try {
    const strapiHost =
      process.env.NEXT_PUBLIC_STRAPI_HOST || "http://localhost:1337";
    const strapiToken = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

    console.log("Usando Strapi host:", strapiHost);

    // 1. Intentamos obtener productos
    const productsResponse = await fetch(
      `${strapiHost}/api/productos?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${strapiToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const productsData = productsResponse.ok
      ? await productsResponse.json()
      : { error: `Error ${productsResponse.status}` };

    // 2. Intentamos obtener categorías
    const categoriesResponse = await fetch(
      `${strapiHost}/api/categorias?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${strapiToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const categoriesData = categoriesResponse.ok
      ? await categoriesResponse.json()
      : { error: `Error ${categoriesResponse.status}` };

    // Devolvemos toda la información para diagnóstico
    return NextResponse.json({
      environment: {
        STRAPI_HOST: strapiHost,
        TOKEN_PROVIDED: !!strapiToken,
        NODE_ENV: process.env.NODE_ENV,
      },
      products: {
        status: productsResponse.status,
        data: productsData,
      },
      categories: {
        status: categoriesResponse.status,
        data: categoriesData,
      },
    });
  } catch (error) {
    console.error("Error en prueba de conexión a Strapi:", error);
    return NextResponse.json(
      {
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
