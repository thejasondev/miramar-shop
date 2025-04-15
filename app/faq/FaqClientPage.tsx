"use client";

import { useState, useEffect } from "react";
import { getFaqs, Faq } from "@/lib/api";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FaqClientPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar las FAQs desde el cliente para evitar errores de metadata en Server Component
  useEffect(() => {
    const loadFaqs = async () => {
      try {
        setLoading(true);
        const data = await getFaqs();
        console.log(`Recibidas ${data.length} FAQs del servidor`);

        if (data.length === 0) {
          console.log("No se encontraron FAQs");
        } else {
          console.log("Primera FAQ:", {
            id: data[0].id,
            question: data[0].question,
          });
        }

        setFaqs(data);
        setError(null);
      } catch (error) {
        console.error("Error cargando FAQs:", error);
        setError(
          "No se pudieron cargar las preguntas frecuentes. Por favor, intenta de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    loadFaqs();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Función para renderizar el contenido de la respuesta
  const renderAnswer = (answer: string | any[]) => {
    // Si la respuesta es un string simple, devolverlo directamente
    if (typeof answer === "string") {
      return answer;
    }

    // Si la respuesta es un array de bloques de Strapi
    if (Array.isArray(answer)) {
      try {
        return answer
          .map((block: any) => {
            if (block.type === "paragraph") {
              return block.children
                .map((child: any) => {
                  // Aplicar formato si está disponible
                  let text = child.text || "";
                  if (child.bold) text = `<strong>${text}</strong>`;
                  if (child.italic) text = `<em>${text}</em>`;
                  if (child.underline) text = `<u>${text}</u>`;
                  return text;
                })
                .join("");
            } else if (block.type === "list") {
              const listType = block.format === "ordered" ? "ol" : "ul";
              const listItems = block.children
                .map((item: any) => {
                  if (item.type === "list-item") {
                    const itemContent = item.children
                      .map((child: any) => child.text || "")
                      .join("");
                    return `<li>${itemContent}</li>`;
                  }
                  return "";
                })
                .join("");
              return `<${listType}>${listItems}</${listType}>`;
            }
            return "";
          })
          .filter(Boolean)
          .join(" ");
      } catch (e) {
        console.error("Error procesando respuesta estructurada:", e);
        return String(answer);
      }
    }

    // Si no se puede procesar, devolver una representación en string
    return typeof answer === "object" ? JSON.stringify(answer) : String(answer);
  };

  return (
    <div className="pt-16">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Preguntas Frecuentes
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-3xl mx-auto">
            <p>{error}</p>
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            <p>No hay preguntas frecuentes disponibles en este momento.</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
              >
                <button
                  className="flex justify-between items-center w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => toggleFaq(index)}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <span className="font-medium">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div id={`faq-answer-${faq.id}`} className="p-4 bg-white">
                    <div
                      className="prose max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: renderAnswer(faq.answer),
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
