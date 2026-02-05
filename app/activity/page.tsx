"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

import type { SpotifyRecentlyPlayedItem, SpotifyRecentlyPlayedResponse } from "@/types/spotify";

interface ApiErrorResponse {
    error: string;
    code?: string;
}

interface TrackRowProps {
    item: SpotifyRecentlyPlayedItem;
}

function isSameDay(a: Date, b: Date) {
    if (a.getFullYear() !== b.getFullYear()) return false;
    if (a.getMonth() !== b.getMonth()) return false;
    return a.getDate() === b.getDate();
}

function formatPlayedAt(playedAtIso: string) {
    const playedAt = new Date(playedAtIso);
    const now = new Date();

    if (Number.isNaN(playedAt.getTime())) return playedAtIso;

    const diffMs = now.getTime() - playedAt.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);

    if (diffSeconds < 60) return "Just now";

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24 && isSameDay(playedAt, now)) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const timePart = playedAt.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
    });

    if (isSameDay(playedAt, yesterday)) return `Yesterday at ${timePart}`;

    const datePart = playedAt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return `${datePart} at ${timePart}`;
}

function LoadingList() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="h-14 w-14 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-700" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
                        <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
                    </div>
                    <div className="hidden h-3 w-28 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700 sm:block" />
                </div>
            ))}
        </div>
    );
}

export default function ActivityPage() {
    const { status } = useSession();

    const [data, setData] = useState<SpotifyRecentlyPlayedResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        if (status !== "authenticated") return;

        let didCancel = false;

        async function load() {
            setIsFetching(true);
            setError(null);

            try {
                const response = await fetch("/api/spotify/recently-played", {
                    cache: "no-store",
                });

                if (!response.ok) {
                    let body: ApiErrorResponse | null = null;
                    try {
                        body = (await response.json()) as ApiErrorResponse;
                    } catch {
                        // Ignore JSON parsing failures
                    }

                    const message = body?.error ?? "Failed to load recent activity.";
                    throw new Error(message);
                }

                const json = (await response.json()) as SpotifyRecentlyPlayedResponse;
                if (!didCancel) setData(json);
            } catch (e) {
                if (!didCancel) setError(e instanceof Error ? e.message : "Failed to load recent activity.");
            } finally {
                if (!didCancel) setIsFetching(false);
            }
        }

        void load();

        return () => {
            didCancel = true;
        };
    }, [status]);

    const items = useMemo(() => {
        const raw = data?.items ?? [];
        return raw.slice().sort((a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime());
    }, [data]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-purple-50/30 to-zinc-50 dark:from-zinc-950 dark:via-purple-950/20 dark:to-zinc-950">
            <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-10">
                        <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">Recent Activity</h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400">Track your listening history and discover patterns in your music journey</p>
                    </div>

                    <div className="mb-8 rounded-2xl border border-purple-200 bg-purple-50 p-4 text-sm text-purple-800 dark:border-purple-900/50 dark:bg-purple-950/30 dark:text-purple-200">Showing your last 50 recently played tracks (Spotify API limit)</div>

                    {status === "loading" && <LoadingList />}

                    {status === "unauthenticated" && (
                        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">You’re not signed in</h2>
                            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Please sign in with Spotify to view your listening history.</p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <button onClick={() => signIn("spotify", { callbackUrl: "/activity" })} className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-500 dark:hover:bg-purple-600">
                                    Sign in with Spotify
                                </button>
                                <Link href="/" className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900">
                                    Back home
                                </Link>
                            </div>
                        </div>
                    )}

                    {status === "authenticated" && (
                        <>
                            {error && (
                                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
                                    {error}
                                    <div className="mt-3 flex flex-wrap gap-3">
                                        <Link href="/api/auth/signin?callbackUrl=/activity" className="rounded-md bg-purple-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-500 dark:hover:bg-purple-600">
                                            Re-authenticate
                                        </Link>
                                        <button onClick={() => window.location.reload()} className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800">
                                            Retry
                                        </button>
                                    </div>
                                </div>
                            )}

                            {!error && isFetching && <LoadingList />}

                            {!error && !isFetching && items.length === 0 && <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">No recently played tracks found.</div>}

                            {!error && !isFetching && items.length > 0 && (
                                <div className="space-y-3">
                                    {items.map((item) => (
                                        <TrackRow key={`${item.played_at}-${item.track.id}`} item={item} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

function TrackRow({ item }: TrackRowProps) {
    const track = item.track;
    const artist = track.artists.map((a) => a.name).join(", ");
    const imageUrl = track.album.images?.[0]?.url ?? null;

    return (
        <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/40">
            {imageUrl ? <Image alt={track.album.name || "Album artwork"} src={imageUrl} width={56} height={56} className="h-14 w-14 rounded-xl border border-zinc-200 object-cover dark:border-zinc-800" /> : <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100 text-xs font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">NA</div>}

            <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">{track.name}</div>
                <div className="truncate text-xs text-zinc-600 dark:text-zinc-400">{artist}</div>
                <div className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 sm:hidden">{formatPlayedAt(item.played_at)}</div>
            </div>

            <div className="hidden text-right text-xs text-zinc-500 dark:text-zinc-400 sm:block">{formatPlayedAt(item.played_at)}</div>
        </div>
    );
}
