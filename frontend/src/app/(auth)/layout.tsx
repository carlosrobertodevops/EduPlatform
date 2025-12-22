import { NoAuthMiddleware } from "@/components/middlewares/noauth-middleware";

export default async function ({ children }: { children: React.ReactNode }) {
    return <NoAuthMiddleware>{children}</NoAuthMiddleware>
}