import NextAuth, { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

// Define the Spotify scopes required for the application
const SPOTIFY_SCOPES = ["user-read-email", "user-read-private", "user-top-read", "user-read-recently-played", "user-library-read"].join(" ");

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
        // IMPORTANT: Do NOT expose provider tokens to the browser.
        // The session object returned here is sent to `/api/auth/session` and `useSession()`.
        async session({ session }) {
            if (!session.user) return session;

            session.user = {
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
            };

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
