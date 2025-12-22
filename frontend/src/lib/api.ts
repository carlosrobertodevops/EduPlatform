"use server";

import axios, { AxiosError } from "axios";
import { auth } from "@/lib/auth";

type Props = {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: object;
  withAuth?: boolean;
};

const getBaseUrl = () => {
  const base = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "";

  // Seu backend expõe /api/v1
  if (!base) return "";
  return `${base}/api/v1`;
};

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

  // auth() pode ser chamado em server actions
  const session = await auth().catch(() => null);

  const instance = axios.create({
    baseURL: BASE_URL,
  });

  const accessToken = (session as any)?.user?.access_token;

  if (withAuth && accessToken) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }

  try {
    const request = await instance<API<TypeResponse>>(endpoint, {
      method,
      params: method === "GET" ? data : undefined,
      data: method !== "GET" ? data : undefined,
    });

    return request.data;
  } catch (error) {
    const e = error as AxiosError<APIError>;

    return {
      success: false,
      detail: e.response?.data.detail || "An unexpected error occurred",
      code: e.response?.data.code || "UNKNOWN_ERROR",
      data: null,
    };
  }
};
