// "use client";

// import { useSignUp } from "@/lib/mutations";
// import { registerSchema, SignUpForm } from "@/schemas/auth";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import { Navbar } from "@/components/layout/navbar";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Eye, EyeOff } from "lucide-react";
// import Link from "next/link";

// export const SignUpPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const router = useRouter();

//   const { mutateAsync, isPending } = useSignUp();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<SignUpForm>({
//     resolver: zodResolver(registerSchema),
//   });

//   const onSubmit = async (data: SignUpForm) => {
//     try {
//       const response = await mutateAsync(data);

//       if (!response.success) {
//         toast.error("Erro ao criar conta.", {
//           description: response.detail,
//         });
//         return;
//       }

//       toast.success("Conta criada com sucesso!", {
//         description: "Redirecionando para o dashboard...",
//       });

//       router.push("/dashboard");
//     } catch (error) {
//       toast.error("Erro ao criar conta.", {
//         description: "Tente novamente mais tarde.",
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen gradient-bg flex flex-col">
//       <Navbar />

//       <div className="flex-1 flex items-center justify-center p-4">
//         <Card className="w-full max-w-md glass-effect">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-2xl font-bold text-center">Criar conta</CardTitle>
//             <CardDescription className="text-center">Crie sua conta para começar a aprender</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Nome completo</Label>
//                 <Input id="name" type="text" placeholder="Seu nome" disabled={isPending} {...register("name")} />
//                 {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="seu@email.com"
//                   disabled={isPending}
//                   {...register("email")}
//                 />
//                 {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password">Senha</Label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Sua senha"
//                     disabled={isPending}
//                     {...register("password")}
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     className="absolute right-0 top-0 h-full px-3 py-2 cursor-pointer"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
//                   </Button>
//                 </div>
//                 {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="confirmPassword">Confirmar Senha</Label>
//                 <div className="relative">
//                   <Input
//                     id="confirmPassword"
//                     type={showConfirmPassword ? "text" : "password"}
//                     placeholder="Sua senha"
//                     disabled={isPending}
//                     {...register("confirmPassword")}
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     className="absolute right-0 top-0 h-full px-3 py-2 cursor-pointer"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   >
//                     {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
//                   </Button>
//                 </div>
//                 {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
//               </div>

//               <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
//                 {isPending ? "Criando conta..." : "Criar conta"}
//               </Button>
//             </form>

//             <div className="text-center text-sm">
//               Já tem conta?{" "}
//               <Link href="/auth/signin" className="text-primary hover:underline">
//                 Faça login
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

"use client";

import { useSignUp } from "@/lib/mutations";
import { registerSchema, SignUpForm } from "@/schemas/auth";
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

export function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutateAsync: signUp, isPending } = useSignUp();

  const form = useForm<SignUpForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignUpForm) => {
    const res = await signUp(values);

    if (!res?.success) {
      toast.error("Erro ao criar conta.", {
        description: res?.detail || "Tente novamente mais tarde.",
      });
      return;
    }

    toast.success("Conta criada com sucesso.");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Criar conta</CardTitle>
            <CardDescription>Crie sua conta para começar a aprender</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" {...form.register("name")} />
                {form.formState.errors.name?.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} />
                {form.formState.errors.email?.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} {...form.register("password")} />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                {form.formState.errors.password?.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    {...form.register("confirmPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirm((v) => !v)}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                {form.formState.errors.confirmPassword?.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Criando..." : "Criar conta"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              Já tem conta?{" "}
              <Link href="/auth/signin" className="text-primary hover:underline">
                Faça login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
