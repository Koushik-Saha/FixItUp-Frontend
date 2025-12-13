"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { init } = useAuth();

    useEffect(() => {
        init();
    }, [init]);

    return <>{children}</>;
}