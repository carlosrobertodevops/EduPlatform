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
    // No frontend coletamos `name` (nome completo) e `confirmPassword`.
    // No backend, o endpoint de signup aceita: email, password, first_name, last_name.
    // Como a confirmação de senha já é validada no frontend, não enviamos `confirmPassword`.
    const { name, email, password, confirmPassword } = payload;

    const parts = (name || "").trim().split(/\s+/).filter(Boolean);
    const firstName = parts.shift() || "";
    const lastName = parts.join(" ");

    const body = {
      email,
      password,
      confirmPassword,
      first_name: firstName,
      last_name: lastName,
    };

    const { data } = await api.post("/accounts/signup/", body);

    return data;
  } catch (error: any) {
    return {
      success: false,
      // DRF pode devolver `detail` (string) ou um objeto com erros por campo.
      detail:
        error?.response?.data?.detail ||
        (typeof error?.response?.data === "object"
          ? JSON.stringify(error?.response?.data)
          : "Erro inesperado ao criar conta."),
    };
  }
}
