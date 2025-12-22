import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware obrigatório do Next.js:
 * precisa exportar `middleware` (named) ou `default`.
 *
 * Este middleware é intencionalmente "noop" (não altera requisições),
 * mas mantém o app estável e evita erro em produção.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

/**
 * Matcher padrão para evitar interceptar assets do Next.
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
