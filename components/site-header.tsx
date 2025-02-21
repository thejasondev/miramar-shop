"use client";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SearchDialog } from "@/components/search-dialog";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-lg font-semibold hover:text-primary/80 transition-colors"
              >
                Inicio
              </Link>
              <Link
                href="/categorias"
                className="text-lg font-semibold hover:text-primary/80 transition-colors"
              >
                Categorías
              </Link>
              <Link
                href="/categorias/descuentos"
                className="text-lg font-semibold hover:text-primary/80 transition-colors"
              >
                Descuento
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex items-center justify-center flex-1 md:justify-start">
          <Link href="/" className="text-xl font-bold">
            Miramar Shop
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 mx-6">
          <Link
            href="/"
            className="text-sm font-medium hover:text-primary/80 transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="/categorias"
            className="text-sm font-medium hover:text-primary/80 transition-colors"
          >
            Categorías
          </Link>
          <Link
            href="/categorias/descuentos"
            className="text-sm font-medium hover:text-primary/80 transition-colors"
          >
            Descuento
          </Link>
        </nav>

        <div className="flex items-center justify-end flex-1">
          <SearchDialog />
        </div>
      </div>
    </header>
  );
}
