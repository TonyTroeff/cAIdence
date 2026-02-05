"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { SpotifyMeResponse } from "@/types/spotify";

interface IProfileFallbackUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

interface IProfileClientProps {
    fallbackUser?: IProfileFallbackUser | null;
}

interface IApiErrorResponse {
    error: string;
    code?: string;
}

export function ProfileClient(props: IProfileClientProps) {
    const [profile, setProfile] = useState<SpotifyMeResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function loadProfile() {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const response = await fetch("/api/spotify/profile", {
                    cache: "no-store",
                });

                let body: unknown = null;
                try {
                    body = await response.json();
                } catch {
                    // Ignore JSON parsing failures
                }

                if (!response.ok) {
                    const apiError = body as Partial<IApiErrorResponse> | null;
                    const message = apiError?.error || "We couldn’t load your Spotify profile.";
                    if (cancelled) return;
                    setErrorMessage(message);
                    setIsLoading(false);
                    return;
                }

                if (cancelled) return;
                setProfile(body as SpotifyMeResponse);
                setIsLoading(false);
            } catch (error) {
                const message = error instanceof Error ? error.message : "We couldn’t load your Spotify profile.";
                if (cancelled) return;
                setErrorMessage(message);
                setIsLoading(false);
            }
        }

        void loadProfile();

        return () => {
            cancelled = true;
        };
    }, []);

    if (isLoading)
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-purple-50/30 to-zinc-50 dark:from-zinc-950 dark:via-purple-950/20 dark:to-zinc-950">
                <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-10">
                            <h1 className="mb-3 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">Your Profile</h1>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400">Loading your Spotify profile…</p>
                        </div>

                        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex animate-pulse flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="h-16 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                                    <div>
                                        <div className="h-6 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
                                        <div className="mt-3 h-4 w-56 rounded bg-zinc-100 dark:bg-zinc-800" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-6 w-28 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                                    <div className="h-6 w-28 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );

    if (!profile)
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-purple-50/30 to-zinc-50 dark:from-zinc-950 dark:via-purple-950/20 dark:to-zinc-950">
                <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Profile</h1>
                        <p className="text-zinc-600 dark:text-zinc-400">We couldn’t load your Spotify profile.</p>
                        {errorMessage && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">{errorMessage}</p>}
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link href="/api/auth/signin?callbackUrl=/profile" className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-500 dark:hover:bg-purple-600">
                                Re-authenticate
                            </Link>
                            <Link href="/" className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900">
                                Back home
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );

    const imageUrl = profile.images?.[0]?.url ?? props.fallbackUser?.image ?? null;
    const displayName = profile.display_name || props.fallbackUser?.name || "Unknown user";
    const email = profile.email || props.fallbackUser?.email || "";

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-purple-50/30 to-zinc-50 dark:from-zinc-950 dark:via-purple-950/20 dark:to-zinc-950">
            <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-10">
                        <h1 className="mb-3 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">Your Profile</h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400">This information is fetched from the Spotify Web API (via an internal API route).</p>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-5">
                                {imageUrl ? (
                                    <Image alt={displayName} src={imageUrl} width={64} height={64} className="h-16 w-16 rounded-full border border-zinc-200 object-cover dark:border-zinc-800" />
                                ) : (
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                        <span className="text-sm font-semibold">SP</span>
                                    </div>
                                )}

                                <div>
                                    <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{displayName}</div>
                                    <div className="text-sm text-zinc-600 dark:text-zinc-400">{email}</div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">{profile.product ? `Plan: ${profile.product}` : "Plan: unknown"}</span>
                                <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">Followers: {profile.followers?.total ?? 0}</span>
                            </div>
                        </div>

                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950/30">
                                <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Country</div>
                                <div className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">{profile.country || "—"}</div>
                            </div>

                            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950/30">
                                <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Spotify ID</div>
                                <div className="mt-2 break-all text-base font-semibold text-zinc-900 dark:text-zinc-100">{profile.id}</div>
                            </div>

                            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950/30">
                                <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Account type</div>
                                <div className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">{profile.type || "—"}</div>
                            </div>

                            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950/30">
                                <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">URI</div>
                                <div className="mt-2 break-all text-sm font-medium text-zinc-700 dark:text-zinc-200">{profile.uri || "—"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
