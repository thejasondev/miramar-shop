"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface HeroClientProps {
  title?: string | null;
  description?: string | any[] | null;
  heroImage?: any;
}

export default function HeroClient({
  title,
  description,
  heroImage,
}: HeroClientProps) {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState("/home-image.jpg");
  const [processedDescription, setProcessedDescription] = useState<string>("");
  
  // Procesar la imagen cuando cambie heroImage
  useEffect(() => {
    console.log("HeroClient props received:", {
      title: title ? title : 'No title',
      description: description ? 'Description present' : 'No description',
      heroImage: heroImage ? 'Image present' : 'No image'
    });
    
    if (heroImage) {
      console.log("Hero image structure:", JSON.stringify(heroImage).substring(0, 200) + "...");
    }

    let url = "/hero.jpg";

    if (heroImage && !imageError) {
      try {
        const strapiHost = process.env.NEXT_PUBLIC_STRAPI_HOST || "http://localhost:1337";
        console.log("Using STRAPI_HOST in client:", strapiHost);
        
        // Estructura basada en la respuesta real de Strapi
        if (heroImage.url) {
          url = `${strapiHost}${heroImage.url}`;
          console.log("Using direct image URL:", url);
        }
        
        setImageUrl(url);
      } catch (error) {
        console.error("Error processing image URL:", error);
        setImageError(true);
      }
    }
  }, [heroImage, imageError]);

  // Procesar la descripción cuando cambie
  useEffect(() => {
    // Función para extraer texto de bloques de Strapi
    const extractTextFromBlocks = (blocks: any[]) => {
      if (!blocks || !Array.isArray(blocks)) return '';
      
      try {
        return blocks
          .map((block: any) => {
            if (block.type === 'paragraph') {
              return block.children
                .map((child: any) => {
                  // Aplicar formato si está disponible
                  let text = child.text || '';
                  if (child.bold) text = `**${text}**`;
                  if (child.italic) text = `*${text}*`;
                  return text;
                })
                .join('');
            }
            return '';
          })
          .filter(Boolean)
          .join(' ');
      } catch (e) {
        console.error("Error extracting text from blocks:", e);
        return '';
      }
    };

    let descriptionText = '';
    
    console.log("Processing description:", typeof description, description ? 'present' : 'absent');
    
    // Si es un array de bloques de Strapi (estructura confirmada)
    if (Array.isArray(description) && description.length > 0) {
      descriptionText = extractTextFromBlocks(description);
      console.log("Extracted text from blocks:", descriptionText);
    }
    // Si es un string
    else if (typeof description === 'string') {
      descriptionText = description;
    }

    // Eliminar los marcadores de formato Markdown para la visualización
    const cleanDescription = typeof descriptionText === 'string' 
      ? descriptionText.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1') 
      : '';
    
    setProcessedDescription(cleanDescription);
  }, [description]);

  // Usar valores predeterminados solo si no hay datos de Strapi
  const displayTitle = title || "Bienvenidos a Miramar Shop";
  const displayDescription = processedDescription || "Tu tienda TODO EN UNO. Descubre nuestras colecciones exclusivas de ropa deportiva, tecnología y mucho más. Diseñado para los que buscan calidad y estilo en cada momento, y en un solo lugar.";

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{displayTitle}</h1>
            <p className="text-lg text-gray-700 mb-8">{displayDescription}</p>
            <Link href="/categorias">
              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 text-white"
              >
                Explorar productos
              </Button>
            </Link>
          </div>

          <div className="hidden md:block">
            <Image
              src={imageUrl}
              alt="Miramar Shop"
              width={600}
              height={600}
              className="rounded-lg object-cover"
              priority
              onError={() => {
                console.error("Error loading image:", imageUrl);
                setImageError(true);
                setImageUrl("/hero.jpg");
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
} 