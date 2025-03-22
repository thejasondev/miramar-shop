"use client";

import { useState, useEffect } from "react";
import { getFaqs } from "@/lib/api";
import { ChevronDown, ChevronUp } from "lucide-react";

// Actualizar la interfaz para reflejar la estructura real de los datos de Strapi
interface Faq {
  id: number;
  question: string;
  answer: string | any[];
}

export default function FaqClientPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar las FAQs desde el cliente para evitar errores de metadata en Server Component
  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const data = await getFaqs();
        console.log("FAQs data in component:", data);
        
        // Procesar los datos para adaptarlos a nuestra interfaz
        // Basado en la estructura real vista en la respuesta de Strapi
        const processedFaqs = data.map((faq: any) => {
          console.log("Processing FAQ item:", faq);
          
          return {
            id: faq.id,
            question: faq.question || '',
            answer: faq.answer || ''
          };
        });
        
        console.log("Processed FAQs:", processedFaqs);
        setFaqs(processedFaqs);
      } catch (error) {
        console.error("Error loading FAQs:", error);
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
    console.log("Rendering answer:", typeof answer, answer);
    
    // Si la respuesta es un string simple, devolverlo directamente
    if (typeof answer === 'string') {
      return answer;
    }
    
    // Si la respuesta es un array de bloques de Strapi
    if (Array.isArray(answer)) {
      try {
        return answer
          .map((block: any) => {
            if (block.type === 'paragraph') {
              return block.children
                .map((child: any) => {
                  // Aplicar formato si está disponible
                  let text = child.text || '';
                  if (child.bold) text = `<strong>${text}</strong>`;
                  if (child.italic) text = `<em>${text}</em>`;
                  return text;
                })
                .join('');
            }
            return '';
          })
          .filter(Boolean)
          .join(' ');
      } catch (e) {
        console.error("Error processing array answer:", e);
      }
    }
    
    // Si no se puede procesar, devolver una representación en string
    return typeof answer === 'object' ? JSON.stringify(answer) : String(answer);
  };

  return (
    <div className="pt-16">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Preguntas Frecuentes</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : faqs.length === 0 ? (
          <p className="text-center text-gray-600">
            No hay preguntas frecuentes disponibles en este momento.
          </p>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={faq.id} className="border rounded-lg overflow-hidden">
                <button
                  className="flex justify-between items-center w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="p-4 bg-white">
                    <p className="text-gray-700" 
                       dangerouslySetInnerHTML={{ __html: renderAnswer(faq.answer) }}
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
