"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import userAuth from "./userAuth";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

interface ProtectedProps {
    children: React.ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
    const router = useRouter();
    const { isLoading } = useLoadUserQuery({});
    const isAuthenticated = userAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/");
        }
    }, [isAuthenticated, router, isLoading]);

    if (isLoading) return null;
    if (!isAuthenticated) return null;

    return children;
}
