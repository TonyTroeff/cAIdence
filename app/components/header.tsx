"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export function Header() {
    const { data: session, status } = useSession();
    const isLoading = status === "loading";

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800 dark:bg-zinc-950/95 dark:supports-[backdrop-filter]:bg-zinc-950/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center gap-6">
                    <Link href="/" className="text-lg font-semibold text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-400">
                        <span className="text-zinc-900 dark:text-zinc-100">c</span>
                        <span className="text-purple-600 dark:text-purple-400">AI</span>
                        <span className="text-zinc-900 dark:text-zinc-100">dence</span>
                    </Link>
                    <div className="hidden sm:flex sm:gap-6">
                        <Link href="/activity" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                            Recent Activity
                        </Link>
                    </div>
                </nav>
                <div className="flex items-center gap-3">
                    {isLoading ? (
                        <div className="h-9 w-16 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-700" />
                    ) : session ? (
                        <>
                            {session.user?.name && (
                                <span className="hidden text-sm text-zinc-600 dark:text-zinc-400 sm:inline">
                                    {session.user.name}
                                </span>
                            )}
                            <button
                                onClick={() => signOut()}
                                className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => signIn("spotify")}
                            className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-500 dark:hover:bg-purple-600"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}

