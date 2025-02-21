import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Datos de ejemplo - Reemplazar con datos de Strapi
const faqs = [
  {
    id: 1,
    question: "¿Cómo realizo una compra?",
    answer:
      "Para realizar una compra, simplemente selecciona el producto que deseas y haz clic en el botón 'Comprar por WhatsApp'. Te atenderemos personalmente para procesar tu pedido.",
  },
  {
    id: 2,
    question: "¿Cuáles son los métodos de pago aceptados?",
    answer:
      "Aceptamos transferencias bancarias, pagos en efectivo y pagos móviles. Los detalles específicos se proporcionarán durante la conversación de WhatsApp.",
  },
  {
    id: 3,
    question: "¿Realizan envíos a domicilio?",
    answer:
      "Sí, realizamos envíos a domicilio en toda la ciudad. El costo y tiempo de entrega varían según la zona y serán confirmados durante la compra.",
  },
  {
    id: 4,
    question: "¿Tienen política de devoluciones?",
    answer:
      "Sí, aceptamos devoluciones dentro de los primeros 7 días después de la compra, siempre y cuando el producto esté en su estado original y con el empaque intacto.",
  },
  {
    id: 5,
    question: "¿Cómo puedo hacer seguimiento a mi pedido?",
    answer:
      "Una vez realizado tu pedido, te proporcionaremos actualizaciones sobre el estado de tu envío a través de WhatsApp.",
  },
];

export default function FAQPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="container py-8 md:py-12">
          <div className="mx-auto max-w-[800px]">
            <div className="grid gap-4 mb-8">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center">
                Preguntas Frecuentes
              </h1>
              <p className="text-muted-foreground md:text-xl text-center">
                Encuentra respuestas a las preguntas más comunes sobre nuestros
                servicios
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
