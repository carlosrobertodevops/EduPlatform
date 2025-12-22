import { AuthMiddleware } from "@/components/middlewares/auth-middleware";

export default async function ({ children }: { children: React.ReactNode }) {
  return <AuthMiddleware>{children}</AuthMiddleware>
}