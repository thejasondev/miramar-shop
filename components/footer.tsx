import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  // Función para crear el enlace de WhatsApp con mensaje predeterminado
  const getWhatsAppLink = () => {
    const phoneNumber = "+5353118193";
    const message = encodeURIComponent("Hola, me gustaría solicitar atención al cliente de Miramar Shop.");
    return `https://wa.me/${phoneNumber}?text=${message}`;
  };

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Social Links & About */}
          <div>
            <h3 className="text-lg font-bold mb-4">Miramar Shop</h3>
            <p className="text-gray-300 mb-4">
              Tu tienda TODO EN UNO con productos de calidad en diversas categorías.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="hover:text-gray-400 transition-colors"
                >
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre-nosotros"
                  className="hover:text-gray-400 transition-colors"
                >
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-400 transition-colors flex items-center"
                >
                  Atención al cliente
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <address className="not-italic space-y-2">
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>miramarshop@gmail.com</span>
              </p>
              <p className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>+53 53118193</span>
              </p>
              <p className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>La Habana, Cuba</span>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Miramar Shop. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
