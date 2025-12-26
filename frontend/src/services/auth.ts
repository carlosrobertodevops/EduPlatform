// import { apiGet, apiPost } from "@/lib/api";

// export type AuthResult<T = unknown> = { success: true; data: T } | { success: false; detail: string };

// export type SignUpPayload = {
//   name: string;
//   email: string;
//   password: string;
//   /**
//    * Campo apenas do formulário (validação no frontend).
//    * O backend Django NÃO espera este campo.
//    */
//   confirmPassword?: string;
// };

// export type SignInPayload = {
//   email: string;
//   password: string;
// };

// type BackendErrorShape = {
//   detail?: string;
//   non_field_errors?: string[];
//   [key: string]: unknown;
// };

// function extractBackendError(err: unknown): string {
//   if (!err || typeof err !== "object") return "Erro inesperado";

//   const anyErr = err as any;
//   const data: BackendErrorShape | undefined = anyErr?.response?.data;

//   if (data?.detail && typeof data.detail === "string") return data.detail;

//   if (Array.isArray(data?.non_field_errors) && data!.non_field_errors!.length > 0) {
//     return String(data!.non_field_errors![0]);
//   }

//   if (data && typeof data === "object") {
//     const firstKey = Object.keys(data)[0];
//     const firstVal = (data as any)[firstKey];
//     if (Array.isArray(firstVal) && firstVal.length > 0) return String(firstVal[0]);
//     if (typeof firstVal === "string") return firstVal;
//   }

//   return anyErr?.message ? String(anyErr.message) : "Erro inesperado";
// }

// /**
//  * IMPORTANT:
//  * - Os endpoints do backend estão em /api/v1/accounts/...
//  * - O baseURL (API_URL / NEXT_PUBLIC_API_URL) deve apontar para o HOST do backend,
//  *   exemplo: http://backend:8000 (server) e http://localhost:8000 (browser)
//  */

// export async function signUp(payload: SignUpPayload): Promise<AuthResult> {
//   try {
//     const { confirmPassword: _confirmPassword, ...clean } = payload;

//     await apiPost("/api/v1/accounts/signup/", clean);
//     return { success: true, data: null };
//   } catch (err) {
//     return { success: false, detail: extractBackendError(err) };
//   }
// }

// export async function signIn(
//   payload: SignInPayload,
// ): Promise<AuthResult<{ access: string; refresh?: string; user: { id: number; name: string; email: string } }>> {
//   try {
//     const data = await apiPost<{ access: string; refresh?: string; user: { id: number; name: string; email: string } }>(
//       "/api/v1/accounts/signin/",
//       payload,
//     );
//     return { success: true, data };
//   } catch (err) {
//     return { success: false, detail: extractBackendError(err) };
//   }
// }

// export async function getUserMe(): Promise<AuthResult<{ id: number; name: string; email: string }>> {
//   try {
//     const data = await apiGet<{ id: number; name: string; email: string }>("/api/v1/accounts/me/");
//     return { success: true, data };
//   } catch (err) {
//     return { success: false, detail: extractBackendError(err) };
//   }
// }

import { api } from "@/lib/api";

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignUpResponse {
  success: boolean;
  detail?: string;
}

export async function signUp(payload: SignUpPayload): Promise<SignUpResponse> {
  try {
    const { data } = await api.post("/accounts/signup/", payload);

    return data;
  } catch (error: any) {
    return {
      success: false,
      detail: error?.response?.data?.detail || "Erro inesperado ao criar conta.",
    };
  }
}
