"use client";
import { redirect } from "next/navigation";
import userAuth from "./userAuth";
import { useEffect, useState } from "react";

interface ProtectedProps {
    children: React.ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
    const [loading, setLoading] = useState(true);
    const isAuthenticated = userAuth();

    useEffect(() => {
        // Simulate loading state
        const timer = setTimeout(() => setLoading(false), 100); // Adjust timeout as needed
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Optionally show a loading indicator
    }

  return isAuthenticated ? children : redirect("/");
}
