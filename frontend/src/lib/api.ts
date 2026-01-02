// import axios, { AxiosError } from "axios";

// type Props = {
//   endpoint: string;
//   method?: "GET" | "POST" | "PUT" | "DELETE";
//   data?: object;
//   withAuth?: boolean;
// };

// type APIError = {
//   detail?: string;
//   code?: string;
// };

// export type API<T> = {
//   success: boolean;
//   detail: string;
//   code?: string;
//   data: T | null;
// };

// function normalizeBaseUrl(url: string): string {
//   const trimmed = (url || "").trim();
//   if (!trimmed) return "";
//   return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
// }

// function getBaseUrl(): string {
//   // Server-side (SSR dentro do container): API_URL
//   const serverBase = normalizeBaseUrl(process.env.API_URL || "");

//   // Client-side: NEXT_PUBLIC_API_URL
//   const publicBase = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL || "");

//   const base = serverBase || publicBase;
//   if (base) return base;

//   // Fallbacks seguros para evitar crash em build/SSR no Docker quando env não foi injetada.
//   if (process.env.NODE_ENV === "production") return "http://backend:8000";
//   return "http://localhost:8000";
// }

// function getApiBaseUrl(): string {
//   return `${getBaseUrl()}/api/v1`;
// }

// async function getAccessTokenClient(): Promise<string | null> {
//   try {
//     const { getSession } = await import("next-auth/react");
//     const session: any = await getSession();
//     return session?.user?.access_token ?? null;
//   } catch {
//     return null;
//   }
// }

// export async function api<T>({ endpoint, method = "GET", data, withAuth = true }: Props): Promise<API<T>> {
//   const instance = axios.create({
//     baseURL: getApiBaseUrl(),
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//   });

//   // Para evitar ciclos/imports problemáticos no SSR, o auth automático é feito no client.
//   if (withAuth && typeof window !== "undefined") {
//     const token = await getAccessTokenClient();
//     if (token) {
//       instance.defaults.headers.common.Authorization = `Bearer ${token}`;
//     }
//   }

//   try {
//     const res = await instance.request<T>({
//       url: endpoint,
//       method,
//       data,
//     });

//     return {
//       success: true,
//       detail: "ok",
//       data: res.data,
//     };
//   } catch (err) {
//     const error = err as AxiosError<APIError>;
//     const detail = error.response?.data?.detail || error.message || "Unexpected error";

//     return {
//       success: false,
//       detail,
//       code: error.response?.data?.code,
//       data: null,
//     };
//   }
// }
// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.data) {
//       return Promise.reject(error.response.data);
//     }
//     return Promise.reject({
//       success: false,
//       detail: "Erro inesperado de comunicação com a API",
//     });
//   },
// );

// export default api;

import axios, { AxiosError } from "axios";

type ApiErrorPayload = {
  detail?: string;
  errors?: unknown;
  [key: string]: unknown;
};

function normalizeBaseUrl(raw?: string) {
  if (!raw) return "";
  return raw.replace(/\/+$/, "");
}

/**
 * Importante (Docker / Browser):
 * - No CLIENT (browser), usamos baseURL "" para chamar /api/v1/* no mesmo host do Next.
 *   O proxy é feito via next.config.ts (rewrites) para o backend.
 * - No SERVER (Next / NextAuth), usamos API_URL (container-to-container) ou NEXT_PUBLIC_API_URL.
 */
const isServer = typeof window === "undefined";

const serverBase =
  normalizeBaseUrl(process.env.API_URL) || normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL) || "http://localhost:8000";

const api = axios.create({
  baseURL: isServer ? serverBase : "",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (err: AxiosError) => {
    const data = (err.response?.data ?? {}) as ApiErrorPayload;

    // Mantém compatibilidade com o padrão do backend (detail/success/data)
    const detail =
      data.detail ||
      (typeof data === "string" ? data : undefined) ||
      (err.message ? `Erro de comunicação: ${err.message}` : "Erro de comunicação.");

    const payload: ApiErrorPayload = {
      ...data,
      detail,
    };

    return Promise.reject(payload);
  },
);

export default api;
