// type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// function getBaseUrl() {
//   return typeof window === "undefined"
//     ? process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || ""
//     : process.env.NEXT_PUBLIC_API_URL || "";
// }

// async function request<T>(
//   method: HttpMethod,
//   path: string,
//   body?: unknown,
// ): Promise<T> {
//   const baseUrl = getBaseUrl();
//   if (!baseUrl) {
//     throw new Error(
//       "API base URL não definida. Configure API_URL (server) e NEXT_PUBLIC_API_URL (browser) no .env",
//     );
//   }

//   const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

//   const res = await fetch(url, {
//     method,
//     headers: { "Content-Type": "application/json" },
//     body: body ? JSON.stringify(body) : undefined,
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     const txt = await res.text().catch(() => "");
//     throw new Error(`HTTP ${res.status} em ${url}: ${txt}`);
//   }

//   return (await res.json()) as T;
// }

// export const api = {
//   get: <T>(path: string) => request<T>("GET", path),
//   post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
//   put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
//   patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
//   delete: <T>(path: string) => request<T>("DELETE", path),
// };

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

type API<T> = {
  success: boolean;
  detail: string;
  code?: string;
  data: T | null;
};

function getBaseUrl(): string {
  // No server: API_URL
  // No browser: NEXT_PUBLIC_API_URL
  const serverBase = process.env.API_URL?.trim();
  const publicBase = process.env.NEXT_PUBLIC_API_URL?.trim();

  const base = serverBase || publicBase || "";
  if (!base) return "";

  return `${base}/api/v1`;
}

async function getAccessToken(): Promise<string | null> {
  try {
    // Browser
    if (typeof window !== "undefined") {
      const mod = await import("next-auth/react");
      const session = await mod.getSession();
      return (session as any)?.access_token ?? (session as any)?.user?.access_token ?? null;
    }

    // Server
    const mod = await import("@/lib/auth");
    const session = await mod.auth();
    return (session as any)?.access_token ?? (session as any)?.user?.access_token ?? null;
  } catch {
    return null;
  }
}

export const api = async <TypeResponse>({
  endpoint,
  method = "GET",
  data,
  withAuth = true,
}: Props): Promise<API<TypeResponse>> => {
  const BASE_URL = getBaseUrl();

  if (!BASE_URL) {
    return {
      success: false,
      detail: "API base URL is not configured. Set API_URL (server) or NEXT_PUBLIC_API_URL (client).",
      code: "MISSING_API_URL",
      data: null,
    };
  }

  const instance = axios.create({ baseURL: BASE_URL });

  if (withAuth) {
    const accessToken = await getAccessToken();
    if (accessToken) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  try {
    const request = await instance.request<API<TypeResponse>>({
      url: endpoint,
      method,
      params: method === "GET" ? data : undefined,
      data: method !== "GET" ? data : undefined,
    });

    return request.data;
  } catch (error) {
    const e = error as AxiosError<APIError>;

    return {
      success: false,
      detail: e.response?.data?.detail || "An unexpected error occurred",
      code: e.response?.data?.code || "UNKNOWN_ERROR",
      data: null,
    };
  }
};
