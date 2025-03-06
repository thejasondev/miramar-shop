import HeroClient from "./hero-client";

interface HeroProps {
  title?: string | null;
  description?: string | any[] | null;
  heroImage?: any;
}

export default function Hero({
  title,
  description,
  heroImage,
}: HeroProps) {
  // Verificar los datos recibidos
  console.log("Hero server component received:", {
    title: title ? title : 'No title',
    description: description ? (typeof description === 'object' ? 'Complex object' : 'Simple string') : 'No description',
    heroImage: heroImage ? 'Image present' : 'No image'
  });
  
  // Mostrar más detalles sobre la imagen
  if (heroImage) {
    console.log("Hero image in server component:", 
      typeof heroImage === 'object' 
        ? `Object with keys: ${Object.keys(heroImage).join(', ')}` 
        : typeof heroImage
    );
    
    // Verificar si la imagen tiene una URL
    if (heroImage.url) {
      console.log("Image URL in server component:", heroImage.url);
    }
  }
  
  // Pasar los datos al componente de cliente
  return <HeroClient title={title} description={description} heroImage={heroImage} />;
}
