import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Intentar obtener los datos de Home desde Strapi
    const response = await fetch(
      `${process.env.STRAPI_HOST}/api/home?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        cache: "no-store",
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching home content: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data,
      env: {
        STRAPI_HOST: process.env.STRAPI_HOST,
        NEXT_PUBLIC_STRAPI_HOST: process.env.NEXT_PUBLIC_STRAPI_HOST,
      }
    });
  } catch (error) {
    console.error("Error in test route:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      env: {
        STRAPI_HOST: process.env.STRAPI_HOST,
        NEXT_PUBLIC_STRAPI_HOST: process.env.NEXT_PUBLIC_STRAPI_HOST,
      }
    }, { status: 500 });
  }
} 