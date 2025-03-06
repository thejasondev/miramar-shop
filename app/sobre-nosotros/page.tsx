import Image from "next/image";

export const metadata = {
  title: "Sobre Nosotros | Miramar Shop",
  description: "Conoce más sobre Miramar Shop, nuestra historia y valores",
};

export default function SobreNosotrosPage() {
  return (
    <div className="pt-16">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Sobre Nosotros</h1>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Nuestra Historia</h2>
            <p className="text-gray-700 mb-4">
              Miramar Shop nació a finales de 2024 con una visión clara: crear una tienda en línea que ofreciera productos de alta calidad en diversas categorías, todo en un solo lugar.
            </p>
            <p className="text-gray-700 mb-4">
              Fundada por un grupo de emprendedores apasionados por el comercio electrónico y la experiencia del cliente, nuestra tienda ha crecido rápidamente para convertirse en un referente en el mercado.
            </p>
            <p className="text-gray-700">
              Hoy, Miramar Shop es reconocida por su excelente servicio al cliente, productos cuidadosamente seleccionados y una experiencia de compra sin complicaciones.
            </p>
          </div>
          <div className="hidden md:block relative h-80 rounded-lg overflow-hidden">
            <Image 
              src="/hero.jpg" 
              alt="Miramar Shop"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Lo Que Ofrecemos</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">Productos de Calidad</h3>
              <p className="text-gray-700">
                Seleccionamos cuidadosamente cada producto en nuestro catálogo para garantizar la más alta calidad y satisfacción del cliente.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">Variedad de Categorías</h3>
              <p className="text-gray-700">
                Desde ropa deportiva hasta tecnología, ofrecemos una amplia gama de productos para satisfacer todas tus necesidades en un solo lugar.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">Atención Personalizada</h3>
              <p className="text-gray-700">
                Nuestro equipo está siempre disponible para ayudarte con cualquier consulta o problema, brindando un servicio personalizado y amigable.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-black text-white p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">Nuestros Valores</h2>
          <ul className="space-y-3 max-w-2xl mx-auto">
            <li className="flex items-start">
              <span className="font-bold mr-2">•</span>
              <span><strong>Calidad:</strong> Nos comprometemos a ofrecer solo productos que cumplan con nuestros altos estándares.</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">•</span>
              <span><strong>Honestidad:</strong> Creemos en la transparencia en todas nuestras operaciones y comunicaciones.</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">•</span>
              <span><strong>Servicio al cliente:</strong> Tu satisfacción es nuestra prioridad número uno.</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">•</span>
              <span><strong>Innovación:</strong> Constantemente buscamos mejorar nuestra tienda y los productos que ofrecemos.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 