import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getNextAuthJwtFromRequest, getSpotifyTokensFromJwt } from "@/app/lib/auth/spotify-tokens";
import type { SpotifyMeResponse } from "@/types/spotify";

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

async function fetchSpotifyMe(accessToken: string): Promise<SpotifyMeResponse> {
    const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
    });

    if (response.ok) return response.json() as Promise<SpotifyMeResponse>;

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
                error: "You must be authenticated to view your Spotify profile.",
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
        const data = await fetchSpotifyMe(spotifyTokens.accessToken);
        return NextResponse.json<SpotifyMeResponse>(data, {
            status: 200,
            headers: {
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        if (error instanceof SpotifyApiError) {
            console.error("Spotify /me fetch failed", {
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

        console.error("Unexpected error fetching Spotify profile", error);
        return NextResponse.json<ErrorResponse>(
            {
                error: "Failed to fetch Spotify profile.",
                code: "spotify_api_error",
            },
            { status: 502 },
        );
    }
}
