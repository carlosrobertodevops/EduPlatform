// import api from "@/lib/api";

// export type SignUpInput = {
//   name: string;
//   email: string;
//   password: string;
//   // o form usa `confirmPassword`
//   confirmPassword: string;
// };

// export type SignInInput = {
//   email: string;
//   password: string;
// };

// export async function signUp(payload: SignUpInput) {
//   const res = await api.post("/api/v1/accounts/signup/", {
//     name: payload.name,
//     email: payload.email,
//     password: payload.password,
//     // contrato novo (prioritário)
//     password_confirmation: payload.confirmPassword,
//     // compat legado (aceito pelo serializer)
//     password_confirm: payload.confirmPassword,
//   });

//   return res.data;
// }

// export async function signIn(payload: SignInInput) {
//   const res = await api.post("/api/v1/accounts/signin/", {
//     email: payload.email,
//     password: payload.password,
//   });

//   return res.data;
// }

import api from "@/lib/api";

type SignUpPayload = {
  name?: string;
  email: string;
  password: string;

  // backend espera este
  password_confirmation?: string;

  // frontend atual usa este
  confirmPassword?: string;

  // compat (legado)
  password_confirm?: string;
};

type SignInPayload = {
  email: string;
  password: string;
};

export async function signUp(payload: SignUpPayload) {
  const password_confirmation =
    payload.password_confirmation ??
    payload.confirmPassword ??
    payload.password_confirm;

  return api.post("/api/v1/accounts/signup/", {
    name: payload.name ?? "",
    email: payload.email,
    password: payload.password,
    password_confirmation,
  });
}

export async function signIn(payload: SignInPayload) {
  return api.post("/api/v1/accounts/signin/", {
    email: payload.email,
    password: payload.password,
  });
}
