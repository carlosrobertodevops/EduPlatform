import { api } from "@/lib/api";
import { SignInForm, SignUpForm } from "@/schemas/auth";

export const signIn = async (data: SignInForm) => {
    return api<APISignInResponse>({
        endpoint: "/accounts/signin/",
        method: "POST",
        data
    })
}

export const signUp = async (data: SignUpForm) => {
    return api<APISignUpResponse>({
        endpoint: "/accounts/signup/",
        method: "POST",
        data
    })
}