"use client";

import { useEffect } from "react";

export default function HydrationErrorSuppressor() {
  useEffect(() => {
    // Suprimir errores de hidratación relacionados con atributos añadidos por extensiones
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (args[0]?.includes?.('Hydration failed because the initial UI does not match what was rendered on the server') ||
          args[0]?.includes?.('There was an error while hydrating') ||
          args[0]?.includes?.('Hydration completed but contains mismatches')) {
        return;
      }
      originalConsoleError(...args);
    };

    // Eliminar atributos añadidos por extensiones
    if (typeof document !== 'undefined') {
      const htmlElement = document.documentElement;
      if (htmlElement.hasAttribute('webcrx')) {
        htmlElement.removeAttribute('webcrx');
      }
    }
  }, []);

  // Este componente no renderiza nada visible
  return null;
} 