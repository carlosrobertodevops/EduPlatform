// import {z} from 'zod'

// export const loginSchema = z.object({
//     email: z.string({ required_error: 'O email é obrigatório.' }).email("Email inválido"),
//     password: z.string({required_error: 'A senha é obrigatória.'}).min(6, "Senha deve ter pelo menos 6 caracteres.")
// })

// export type SignInForm = z.infer<typeof loginSchema>

// export const registerSchema = z.object({
//     name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
//     email: z.string({ required_error: 'O email é obrigatório.' }).email("Email inválido"),
//     password: z.string({ required_error: 'A senha é obrigatória.' }).min(6, "Senha deve ter pelo menos 6 caracteres."),
//     confirmPassword: z.string()
// }).refine((data) => data.password === data.confirmPassword, {
//     message: "Senhas não coincidem",
//     path: ["confirmPassword"]
// })

// export type SignUpForm = z.infer<typeof registerSchema>

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
