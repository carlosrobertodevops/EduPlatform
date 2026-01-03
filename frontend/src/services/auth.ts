import { api } from "@/lib/api";
import { SignInForm, SignUpForm } from "@/schemas/auth";

export const signIn = async (data: SignInForm) => {
  return api<APISignInResponse>({
    endpoint: "/accounts/signin/",
    method: "POST",
    data,
    withAuth: false,
  });
};

export const signUp = async (data: SignUpForm) => {
  // Backend espera password_confirm, não confirmPassword
  const payload = {
    name: data.name,
    email: data.email,
    password: data.password,
    password_confirm: data.confirmPassword,
  };

  return api<APISignUpResponse>({
    endpoint: "/accounts/signup/",
    method: "POST",
    data: payload,
    withAuth: false,
  });
};
