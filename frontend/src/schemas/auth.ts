import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Informe seu nome."),
    email: z.string().email("Informe um email válido."),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
    confirmPassword: z.string().min(6, "Confirme sua senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type SignUpForm = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Informe um email válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export type SignInForm = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Informe um email válido."),
});

export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  confirmPassword: z.string().min(6, "Confirme sua senha."),
});

export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  newPassword: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  confirmPassword: z.string().min(6, "Confirme sua senha."),
});

export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export const verifyEmailSchema = z.object({
  token: z.string().uuid("Informe um token válido."),
});

export type VerifyEmailForm = z.infer<typeof verifyEmailSchema>;

export const resendEmailSchema = z.object({
  email: z.string().email("Informe um email válido."),
});

export type ResendEmailForm = z.infer<typeof resendEmailSchema>;