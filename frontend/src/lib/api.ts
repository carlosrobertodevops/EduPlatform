import axios, { AxiosError } from "axios";

type Props = {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: object;
  withAuth?: boolean;
};

type APIError = {
  detail?: string;
  code?: string;
};

export type API<T> = {
  success: boolean;
  detail: string;
  code?: string;
  data: T | null;
};

function normalizeBaseUrl(url: string): string {
  const trimmed = (url || "").trim();
  if (!trimmed) return "";
  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
}

function getBaseUrl(): string {
  // Server-side (SSR dentro do container): API_URL
  const serverBase = normalizeBaseUrl(process.env.API_URL || "");

  // Client-side: NEXT_PUBLIC_API_URL
  const publicBase = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL || "");

  const base = serverBase || publicBase;
  if (base) return base;

  // Fallbacks seguros para evitar crash em build/SSR no Docker quando env não foi injetada.
  if (process.env.NODE_ENV === "production") return "http://backend:8000";
  return "http://localhost:8000";
}

function getApiBaseUrl(): string {
  return `${getBaseUrl()}/api/v1`;
}

async function getAccessTokenClient(): Promise<string | null> {
  try {
    const { getSession } = await import("next-auth/react");
    const session: any = await getSession();
    return session?.user?.access_token ?? null;
  } catch {
    return null;
  }
}

export async function api<T>({ endpoint, method = "GET", data, withAuth = true }: Props): Promise<API<T>> {
  const instance = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  // Para evitar ciclos/imports problemáticos no SSR, o auth automático é feito no client.
  if (withAuth && typeof window !== "undefined") {
    const token = await getAccessTokenClient();
    if (token) {
      instance.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const res = await instance.request<T>({
      url: endpoint,
      method,
      data,
    });

    return {
      success: true,
      detail: "ok",
      data: res.data,
    };
  } catch (err) {
    const error = err as AxiosError<APIError>;
    const detail = error.response?.data?.detail || error.message || "Unexpected error";

    return {
      success: false,
      detail,
      code: error.response?.data?.code,
      data: null,
    };
  }
}
