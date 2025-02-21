import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function AboutPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="container py-8 md:py-12">
          <div className="mx-auto max-w-[800px]">
            <div className="grid gap-4 mb-8">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center">
                Sobre Nosotros
              </h1>
              <div className="mt-8 space-y-6 text-muted-foreground">
                <p className="leading-7">
                  Bienvenidos a Miramar Shop, tu destino en línea para encontrar
                  los mejores productos deportivos, tecnológicos y más. Desde
                  nuestra fundación, nos hemos dedicado a ofrecer una
                  experiencia de compra única, combinando calidad, conveniencia
                  y servicio personalizado.
                </p>
                <p className="leading-7">
                  En Miramar Shop, creemos en la importancia de brindar a
                  nuestros clientes no solo productos excepcionales, sino
                  también una atención personalizada. Por eso, hemos
                  implementado un sistema de compra directa a través de
                  WhatsApp, permitiéndonos estar más cerca de ti y atender todas
                  tus necesidades de manera inmediata.
                </p>
                <p className="leading-7">
                  Nuestra selección de productos está cuidadosamente curada para
                  satisfacer las necesidades de nuestros clientes, desde
                  equipamiento deportivo de alta calidad hasta los últimos
                  gadgets tecnológicos. También ofrecemos combos especiales y
                  promociones exclusivas para brindarte el mejor valor por tu
                  dinero.
                </p>
                <p className="leading-7">
                  Nos enorgullece ser parte de tu estilo de vida activo y
                  moderno, y estamos comprometidos a seguir mejorando y
                  expandiendo nuestra oferta para satisfacer tus necesidades
                  cambiantes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
