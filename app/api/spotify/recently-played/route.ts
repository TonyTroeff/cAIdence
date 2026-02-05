import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { SpotifyRecentlyPlayedResponse } from "@/types/spotify";

export const dynamic = "force-dynamic";

interface ErrorResponse {
    error: string;
    code?: "not_authenticated" | "missing_access_token" | "token_expired" | "spotify_unauthorized" | "spotify_api_error";
    details?: unknown;
}

class SpotifyApiError extends Error {
    status: number;
    body: unknown;

    constructor(status: number, body: unknown) {
        super("Spotify API request failed");
        this.status = status;
        this.body = body;
    }
}

async function fetchRecentlyPlayed(accessToken: string): Promise<SpotifyRecentlyPlayedResponse> {
    const url = new URL("https://api.spotify.com/v1/me/player/recently-played");
    url.searchParams.set("limit", "50");

    const response = await fetch(url.toString(), {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
    });

    if (response.ok) return response.json() as Promise<SpotifyRecentlyPlayedResponse>;

    let errorBody: unknown = null;
    try {
        errorBody = await response.json();
    } catch {
        // Ignore JSON parsing failures
    }

    throw new SpotifyApiError(response.status, errorBody);
}

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session)
        return NextResponse.json<ErrorResponse>(
            {
                error: "You must be authenticated to view recent activity.",
                code: "not_authenticated",
            },
            { status: 401 },
        );

    if (!session.accessToken)
        return NextResponse.json<ErrorResponse>(
            {
                error: "Your session is missing a Spotify access token. Please sign out and sign in again.",
                code: "missing_access_token",
            },
            { status: 401 },
        );

    const nowSeconds = Math.floor(Date.now() / 1000);
    if (session.expiresAt && session.expiresAt <= nowSeconds)
        return NextResponse.json<ErrorResponse>(
            {
                error: "Your Spotify access token has expired. Please sign out and sign in again.",
                code: "token_expired",
            },
            { status: 401 },
        );

    try {
        const data = await fetchRecentlyPlayed(session.accessToken);
        return NextResponse.json<SpotifyRecentlyPlayedResponse>(data, {
            status: 200,
            headers: {
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        if (error instanceof SpotifyApiError) {
            console.error("Spotify recently-played fetch failed", {
                status: error.status,
                body: error.body,
            });

            if (error.status === 401)
                return NextResponse.json<ErrorResponse>(
                    {
                        error: "Spotify authorization failed. Please re-authenticate.",
                        code: "spotify_unauthorized",
                    },
                    { status: 401 },
                );

            return NextResponse.json<ErrorResponse>(
                {
                    error: "Spotify API error. Please try again later.",
                    code: "spotify_api_error",
                },
                { status: 502 },
            );
        }

        console.error("Unexpected error fetching recently played", error);
        return NextResponse.json<ErrorResponse>(
            {
                error: "Failed to fetch recently played tracks.",
                code: "spotify_api_error",
            },
            { status: 502 },
        );
    }
}
