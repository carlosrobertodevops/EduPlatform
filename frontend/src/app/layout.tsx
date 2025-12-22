import { Metadata } from "next"
import "./globals.css"

import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { BProgressProvider } from "@/components/providers/bprogress-provider"
import { ToasterProvider } from "@/components/providers/toaster-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EduPlatfom - Plataforma de Cursos Online",
  description: "Aprenda com os melhores cursos online. Plataform moderna e intuitiva para seu desenvolvimento profissional."
}

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <QueryProvider>
              <BProgressProvider>
                <ToasterProvider>
                  {children}
                </ToasterProvider>
              </BProgressProvider>
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}