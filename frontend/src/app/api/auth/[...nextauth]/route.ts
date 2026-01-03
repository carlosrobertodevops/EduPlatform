import NextAuth from "next-auth";

const nextAuth = NextAuth({
  // Evita erro interno (providers.map) durante o build
  providers: [],

  // Não quebre o build por env ausente (configure em runtime se necessário)
  secret: process.env.NEXTAUTH_SECRET,
});

export const GET = (nextAuth as any).handlers?.GET ?? (nextAuth as any);
export const POST = (nextAuth as any).handlers?.POST ?? (nextAuth as any);
