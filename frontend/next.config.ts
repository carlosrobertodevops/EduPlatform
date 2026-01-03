import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  output: "standalone",

  /**
   * Permite que o browser chame o backend via o próprio Next, evitando
   * depender de hostnames de rede Docker (ex: "backend") no client.
   *
   * Requisições do tipo:
   *   /api/v1/...  ->  ${API_URL}/api/v1/...
   *
   * Observação:
   * - API_URL pode estar definido no container do frontend (docker-compose).
   * - Se não estiver, escolhe automaticamente:
   *   - produção (Docker): http://backend:8000
   *   - desenvolvimento:   http://localhost:8000
   */
  async rewrites() {
    /**
     * Docker fix:
     * - Dentro do container do frontend, "localhost" aponta para o PRÓPRIO container.
     * - Se esta rewrite usar "http://localhost:8000", o Next tentará acessar o backend
     *   no container errado e retornará ECONNREFUSED.
     */
    const defaultApiUrl =
      process.env.NODE_ENV === "production"
        ? "http://backend:8000"
        : "http://localhost:8000";

    const apiUrl = (process.env.API_URL || defaultApiUrl).replace(/\/+$/, "");

    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
