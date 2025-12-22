"use client";

import { loginSchema, SignInForm } from "@/schemas/auth";
import { useRouter } from "@bprogress/next/app";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export const SignInPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInForm>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: SignInForm) => {
        setIsLoading(true)
        try {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false
            })

            if (result.error) {
                toast.error("Erro ao fazer login", { description: "Email ou senha incorretos" });
                return;
            }

            toast.success("Login realizado com sucesso!", { description: "Redirecionando para o dashboard...", duration: 2000 })
            router.push("/dashboard")
        } catch (error) {
            toast.error("Erro ao entrar na conta.", {
                description: "Tente novamente mais tarde."
            })
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen gradient-bg flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md glass-effect">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Entrar</CardTitle>
                        <CardDescription className="text-center">Entre na sua conta para continuar</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="seu@email.com" disabled={isLoading} {...register("email")} />
                                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <div className="relative">
                                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="Sua senha" disabled={isLoading} {...register("password")} />
                                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </Button>
                                </div>
                                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                            </div>

                            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                                {isLoading ? "Entrando..." : "Entrar"}
                            </Button>
                        </form>

                        <div className="text-center text-sm">
                            Não tem uma conta? {" "}
                            <Link href="/auth/signup" className="text-primary hover:underline">
                                Cadastre-se
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}