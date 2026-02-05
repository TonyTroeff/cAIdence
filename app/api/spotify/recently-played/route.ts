import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getNextAuthJwtFromRequest, getSpotifyTokensFromJwt } from "@/app/lib/auth/spotify-tokens";
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

async function checkTracksLikedStatus(accessToken: string, trackIds: string[]): Promise<boolean[]> {
    if (trackIds.length === 0) return [];

    // Spotify API allows up to 50 IDs per request
    const url = new URL("https://api.spotify.com/v1/me/tracks/contains");
    url.searchParams.set("ids", trackIds.join(","));

    const response = await fetch(url.toString(), {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
    });

    if (response.ok) return response.json() as Promise<boolean[]>;

    let errorBody: unknown = null;
    try {
        errorBody = await response.json();
    } catch {
        // Ignore JSON parsing failures
    }

    throw new SpotifyApiError(response.status, errorBody);
}

export async function GET(request: NextRequest) {
    const jwt = await getNextAuthJwtFromRequest(request, {
        cookieName: authOptions.cookies?.sessionToken?.name,
    });

    if (!jwt)
        return NextResponse.json<ErrorResponse>(
            {
                error: "You must be authenticated to view recent activity.",
                code: "not_authenticated",
            },
            { status: 401 },
        );

    const spotifyTokens = getSpotifyTokensFromJwt(jwt);
    if (!spotifyTokens)
        return NextResponse.json<ErrorResponse>(
            {
                error: "Your session is missing a Spotify access token. Please sign out and sign in again.",
                code: "missing_access_token",
            },
            { status: 401 },
        );

    const nowSeconds = Math.floor(Date.now() / 1000);
    if (spotifyTokens.expiresAt && spotifyTokens.expiresAt <= nowSeconds)
        return NextResponse.json<ErrorResponse>(
            {
                error: "Your Spotify access token has expired. Please sign out and sign in again.",
                code: "token_expired",
            },
            { status: 401 },
        );

    try {
        const data = await fetchRecentlyPlayed(spotifyTokens.accessToken);

        // Extract unique track IDs
        const trackIds = data.items.map((item) => item.track.id);

        // Fetch liked status for all tracks
        let likedStatuses: boolean[] = [];
        try {
            likedStatuses = await checkTracksLikedStatus(spotifyTokens.accessToken, trackIds);
        } catch (error) {
            // If fetching liked status fails, log the error but continue without liked data
            console.error("Failed to fetch liked status for tracks", error);
            // Fill with false values as fallback
            likedStatuses = new Array(trackIds.length).fill(false);
        }

        // Enrich items with liked status
        const enrichedItems = data.items.map((item, index) => ({
            ...item,
            liked: likedStatuses[index] ?? false,
        }));

        const enrichedData: SpotifyRecentlyPlayedResponse = {
            ...data,
            items: enrichedItems,
        };

        return NextResponse.json<SpotifyRecentlyPlayedResponse>(enrichedData, {
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
