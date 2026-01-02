import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  output: "standalone",

  /**
   * Permite que o browser chame o backend via o próprio Next, evitando
   * depender de hostnames de rede Docker (ex: "backend") no client.
   *
   * Requisicoes do tipo:
   *   /api/v1/...  ->  ${API_URL}/api/v1/...
   *
   * Observação:
   * - API_URL deve estar definido no container do frontend (docker-compose).
   * - Se não estiver, cai para http://localhost:8000.
   */
  async rewrites() {
    const apiUrl = (process.env.API_URL || "http://localhost:8000").replace(/\/+$/, "");

    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
