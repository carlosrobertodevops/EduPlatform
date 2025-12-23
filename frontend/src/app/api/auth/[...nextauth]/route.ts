// import { handlers } from "@/lib/auth";
// export const { GET, POST } = handlers;
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;

// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";

// const handler = NextAuth({
//   providers: [
//     Credentials({
//       name: "credentials",
//       credentials: {
//         email: { type: "email" },
//         password: { type: "password" },
//       },
//       async authorize(credentials) {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/accounts/signin/`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(credentials),
//         });

//         if (!res.ok) return null;

//         const data = await res.json();

//         return {
//           id: data.user.id,
//           email: data.user.email,
//           name: data.user.name,
//           accessToken: data.access_token,
//         };
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.accessToken = (user as any).accessToken;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.accessToken = token.accessToken as string;
//       return session;
//     },
//   },
//   trustHost: true,
// });

// export { handler as GET, handler as POST };
