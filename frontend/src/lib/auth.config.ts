import Credentials from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import api from "./api";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const response = await api.post("/api/v1/accounts/signin/", {
          email: credentials?.email,
          password: credentials?.password,
        });

        if (!response.data.success) return null;

        return response.data.data.user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
};
