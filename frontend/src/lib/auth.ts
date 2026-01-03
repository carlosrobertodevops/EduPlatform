// frontend/src/lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Base URL do Backend (server-side).
 * - Em Docker: use o nome do serviço "backend"
 * - Fora do Docker: pode usar http://localhost:8000
 *
 * Ordem de prioridade:
 * 1) API_URL (server)
 * 2) NEXT_PUBLIC_API_URL (fallback)
 * 3) http://backend:8000/api/v1 (padrão para docker compose)
 */
const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://backend:8000/api/v1";

/**
 * Secret do Auth.js/NextAuth.
 * Preferir AUTH_SECRET (Auth.js) e manter compatibilidade com NEXTAUTH_SECRET.
 */
const AUTH_SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "";

/**
 * Em ambientes com proxy/container é comum precisar “trustHost”.
 * - Se quiser forçar: AUTH_TRUST_HOST=true
 * - Caso contrário: false
 */
const TRUST_HOST = process.env.AUTH_TRUST_HOST === "true";

type BackendSignInResponse =
  | {
      success: true;
      data: {
        access_token: string;
        user: {
          id: string | number;
          name?: string | null;
          email?: string | null;
        };
      };
      detail?: string;
    }
  | {
      success: false;
      data?: any;
      detail?: string;
    };

// signIn 
async function signInWithBackend(email: string, password: string) {
  const url = `${API_BASE_URL.replace(/\/$/, "")}/accounts/signin/`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Sem cache para auth
    cache: "no-store",
    body: JSON.stringify({ email, password }),
  });

  // Backend pode retornar 400/401 com JSON explicando
  const json = (await res.json().catch(() => null)) as BackendSignInResponse | null;

  if (!res.ok || !json || json.success !== true) {
    return null;
  }

  const accessToken = json.data?.access_token;
  const user = json.data?.user;

  if (!accessToken || !user?.id) return null;

  return {
    id: String(user.id),
    name: user.name ?? undefined,
    email: user.email ?? email,
    access_token: accessToken,
  };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Auth.js
  secret: AUTH_SECRET || undefined,
  trustHost: TRUST_HOST,

  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string | undefined)?.trim();
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const user = await signInWithBackend(email, password);
        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Quando loga, o "user" vem do authorize()
      if (user) {
        (token as any).id = (user as any).id ?? null;
        (token as any).access_token = (user as any).access_token ?? null;
        token.name = (user as any).name ?? token.name;
        token.email = (user as any).email ?? token.email;
      }
      return token;
    },

    async session({ session, token }) {
      (session as any).user = session.user || {};
      (session as any).user.id = (token as any).id ?? null;
      (session as any).access_token = (token as any).access_token ?? null;
      return session;
    },
  },
});
