import "server-only";

import type { JWT } from "next-auth/jwt";
import { getToken } from "next-auth/jwt";
import { cookies, headers } from "next/headers";
import type { NextRequest } from "next/server";

export interface ISpotifyTokens {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
}

export interface IGetSpotifyTokensOptions {
    /** Override if you changed NextAuth's session cookie name. */
    cookieName?: string;
}

const DEFAULT_SESSION_COOKIE_NAME = "next-auth.session-token";

function getNextAuthSecret() {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret)
        // If you hit this, ensure NEXTAUTH_SECRET is set in your environment.
        throw new Error("NEXTAUTH_SECRET is not set");

    return secret;
}

export function getSpotifyTokensFromJwt(token: JWT): ISpotifyTokens | null {
    if (typeof token.accessToken !== "string") return null;

    const refreshToken = typeof token.refreshToken === "string" ? token.refreshToken : undefined;
    const expiresAt = typeof token.expiresAt === "number" ? token.expiresAt : undefined;

    return {
        accessToken: token.accessToken,
        refreshToken,
        expiresAt,
    };
}

export async function getNextAuthJwtFromRequest(request: NextRequest, options?: IGetSpotifyTokensOptions): Promise<JWT | null> {
    return getToken({
        req: request,
        secret: getNextAuthSecret(),
        cookieName: options?.cookieName ?? DEFAULT_SESSION_COOKIE_NAME,
    });
}

export async function getSpotifyTokensFromRequest(request: NextRequest, options?: IGetSpotifyTokensOptions): Promise<ISpotifyTokens | null> {
    const token = await getNextAuthJwtFromRequest(request, options);

    if (!token) return null;

    return getSpotifyTokensFromJwt(token);
}

/**
 * For Server Components where you don't have a NextRequest instance.
 */
export async function getSpotifyTokensFromServerContext(options?: IGetSpotifyTokensOptions): Promise<ISpotifyTokens | null> {
    const req = {
        cookies: cookies(),
        headers: headers(),
    } as unknown as NextRequest;

    const token = await getToken({
        // NOTE: getToken expects a NextRequest/NextApiRequest, but in Server Components we only
        // have access to cookie/header stores. Casting is safe because next-auth only uses
        // `req.cookies` + `req.headers`.
        req,
        secret: getNextAuthSecret(),
        cookieName: options?.cookieName ?? DEFAULT_SESSION_COOKIE_NAME,
    });

    if (!token) return null;

    return getSpotifyTokensFromJwt(token);
}

export async function getNextAuthJwtFromServerContext(options?: IGetSpotifyTokensOptions): Promise<JWT | null> {
    const req = {
        cookies: cookies(),
        headers: headers(),
    } as unknown as NextRequest;

    return getToken({
        req,
        secret: getNextAuthSecret(),
        cookieName: options?.cookieName ?? DEFAULT_SESSION_COOKIE_NAME,
    });
}
