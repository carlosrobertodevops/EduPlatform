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
