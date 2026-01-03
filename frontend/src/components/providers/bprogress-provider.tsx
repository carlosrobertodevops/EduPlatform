"use client";

import React from "react";
import { ProgressProvider } from "@bprogress/next/app";

/**
 * Provider do @bprogress/next para habilitar barra de progresso
 * em mudanças de rota (Next.js App Router).
 *
 * Sem este provider, qualquer uso interno de `useProgress()` gera:
 * "useProgress must be used within a ProgressProvider"
 */
export function BProgressProvider({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider height="3px" color="#1c6bfd" options={{ showSpinner: false }} shallowRouting>
      {children}
    </ProgressProvider>
  );
}
