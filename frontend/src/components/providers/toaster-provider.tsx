"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export const ToasterProvider = ({ children }: { children: React.ReactNode }) => {
    const { theme } = useTheme()

    return (
        <>
            {children}
            <Toaster theme={theme as "light" | "dark" | "system"} />
        </>
    )
}