import NextAuth from "next-auth"

import { signIn as signInAPI} from "@/services/auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null 

        const response = await signInAPI({ email: credentials.email as string, password: credentials.password as string })
        
        if (!response.data) return null

        return {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          access_token: response.data.access_token, 
        } 
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as number
        token.access_token = user.access_token
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        // @ts-ignore
        session.user.id = token.id;
        session.user.access_token = token.access_token as string;
      }
      return session
    }
  }
})