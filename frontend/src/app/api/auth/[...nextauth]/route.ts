// import { handlers } from "@/lib/auth"
// export const { GET, POST } = handlers
//
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

type LoginResponse = {
  access?: string;
  refresh?: string;
  user?: {
    id?: string | number;
    name?: string;
    email?: string;
  };
};

const handler = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim();
        const password = credentials?.password?.toString();

        if (!email || !password) return null;

        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!baseUrl) return null;

        // Ajuste o endpoint conforme o seu backend Django (ex.: /auth/login/, /api/auth/login/, etc.)
        const res = await fetch(`${baseUrl}/auth/login/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) return null;

        const data = (await res.json()) as LoginResponse;

        const accessToken = data.access?.toString() || "";
        if (!accessToken) return null;

        const userId = data.user?.id ?? email;
        const userName = data.user?.name ?? email;
        const userEmail = data.user?.email ?? email;

        return {
          id: String(userId),
          name: userName,
          email: userEmail,
          access_token: accessToken,
        } as any;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // user só existe no login
      if (user && (user as any).access_token) {
        (token as any).access_token = (user as any).access_token;
      }
      return token;
    },

    async session({ session, token }) {
      // nunca assume que existe
      (session as any).access_token = (token as any).access_token ?? null;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
