import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { signIn as signInAPI } from "@/services/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true, // <- resolve UntrustedHost no Docker/localhost

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const response = await signInAPI({
          email: credentials.email as string,
          password: credentials.password as string,
        });

        // response é do seu wrapper API<TypeResponse>
        if (!response?.success || !response.data) return null;

        const access_token = response.data.access_token;
        if (!access_token) return null;

        return {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          access_token,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.access_token = (user as any).access_token ?? null;
      }
      return token;
    },

    async session({ session, token }) {
      // garante estrutura
      if (!session.user) session.user = {} as any;

      (session.user as any).id = (token as any).id ?? null;
      (session.user as any).access_token = (token as any).access_token ?? null;

      return session;
    },
  },
});
