import NextAuth, { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

// Define the Spotify scopes required for the application
const SPOTIFY_SCOPES = [
    "user-read-email",
    "user-read-private",
    "user-top-read",
    "user-read-recently-played",
].join(" ");

// NextAuth configuration
export const authOptions: NextAuthOptions = {
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID ?? "",
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? "",
            authorization: {
                params: {
                    scope: SPOTIFY_SCOPES,
                },
            },
        }),
    ],
    callbacks: {
        // Persist the OAuth access_token, refresh_token, and expires_at in the JWT
        async jwt({ token, account }) {
            // Initial sign in - capture tokens from the OAuth response
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expiresAt = account.expires_at;
            }
            return token;
        },
        // Make access token available in the session for API calls
        async session({ session, token }) {
            session.accessToken = token.accessToken as string | undefined;
            session.refreshToken = token.refreshToken as string | undefined;
            session.expiresAt = token.expiresAt as number | undefined;
            return session;
        },
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

