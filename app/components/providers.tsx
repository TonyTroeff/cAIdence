"use client";

import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
    children: React.ReactNode;
}

/**
 * Client-side provider wrapper that includes SessionProvider for authentication.
 * This component must be a Client Component since SessionProvider uses React Context.
 */
export function Providers({ children }: ProvidersProps) {
    return <SessionProvider>{children}</SessionProvider>;
}

