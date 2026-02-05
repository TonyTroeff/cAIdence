import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    /**
     * Extends the built-in Session type to include Spotify OAuth tokens
     */
    interface Session {
        /** The Spotify access token for API calls */
        accessToken?: string;
        /** The Spotify refresh token for obtaining new access tokens */
        refreshToken?: string;
        /** Unix timestamp (in seconds) when the access token expires */
        expiresAt?: number;
    }
}

declare module "next-auth/jwt" {
    /**
     * Extends the built-in JWT type to include Spotify OAuth tokens
     */
    interface JWT {
        /** The Spotify access token for API calls */
        accessToken?: string;
        /** The Spotify refresh token for obtaining new access tokens */
        refreshToken?: string;
        /** Unix timestamp (in seconds) when the access token expires */
        expiresAt?: number;
    }
}

