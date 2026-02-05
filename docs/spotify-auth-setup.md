# Spotify Authentication Setup Guide

This guide explains how to configure Spotify authentication for the cAIdence application using NextAuth.js v4.

## Prerequisites

1. A Spotify account (free or premium)
2. Access to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
3. Node.js 18+ installed locally

## Spotify App Configuration

### Step 1: Create a Spotify Application

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click **Create App**
4. Fill in the application details:
    - **App name**: cAIdence (or your preferred name)
    - **App description**: Personal music diary and analyzer
    - **Website**: `http://localhost:3000` (for development)
    - **Redirect URI**: `http://localhost:3000/api/auth/callback/spotify`
5. Check the box to agree to the Developer Terms of Service
6. Click **Save**

### Step 2: Get Your Client Credentials

1. After creating the app, you'll be redirected to your app's dashboard
2. Click **Settings** in the top right
3. Note down the **Client ID**
4. Click **View client secret** and note down the **Client Secret**

### Step 3: Configure Redirect URIs

1. In your app's Settings, scroll to **Redirect URIs**
2. Add the following URIs:
    - Development: `http://localhost:3000/api/auth/callback/spotify`
    - Production: `https://your-production-domain.com/api/auth/callback/spotify`
3. Click **Save**

## Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```bash
# Spotify OAuth credentials
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# NextAuth.js configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### Generating NEXTAUTH_SECRET

Generate a secure random secret using one of these methods:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Usage Examples

### Sign In / Sign Out (Client Components)

```tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButtons() {
    const { data: session, status } = useSession();

    if (status === "loading") return <div>Loading...</div>;

    if (session)
        return (
            <div>
                <p>Welcome, {session.user?.name}</p>
                <button onClick={() => signOut()}>Sign Out</button>
            </div>
        );

    return <button onClick={() => signIn("spotify")}>Sign in with Spotify</button>;
}
```

### Access Session in Server Components

```tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ServerComponent() {
    const session = await getServerSession(authOptions);

    if (!session) return <div>Please sign in to access this page.</div>;

    return (
        <div>
            <h1>Welcome, {session.user?.name}</h1>
            <p>Email: {session.user?.email}</p>
        </div>
    );
}
```

### Retrieve Access Token for Spotify API Calls

```tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getSpotifyData() {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) throw new Error("No access token available");

    const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    });

    if (!response.ok) throw new Error("Failed to fetch Spotify data");

    return response.json();
}
```

## Example API Call: Get Current User Profile

Here's a complete example of fetching the current user's Spotify profile:

```tsx
// app/actions/spotify.ts
"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface SpotifyUserProfile {
    id: string;
    display_name: string;
    email: string;
    images: { url: string }[];
    followers: { total: number };
    country: string;
    product: string;
}

export async function getCurrentUserProfile(): Promise<SpotifyUserProfile | null> {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) return null;

    const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    });

    if (!response.ok) return null;

    return response.json();
}
```

## Troubleshooting

### Redirect URI Mismatch

**Error**: `INVALID_REDIRECT_URI` or redirect mismatch error during login

**Solution**:

- Ensure the redirect URI in your Spotify app settings exactly matches: `http://localhost:3000/api/auth/callback/spotify`
- Check for trailing slashes - they must match exactly
- For production, update to your production domain

### Missing Environment Variables

**Error**: Application crashes or authentication fails silently

**Solution**:

- Verify all required variables are set in `.env.local`
- Restart the development server after adding/changing environment variables
- Check that variable names match exactly (case-sensitive)

### Session Not Persisting

**Error**: User is logged out after page refresh

**Solution**:

- Ensure `NEXTAUTH_SECRET` is set and consistent
- Verify `NEXTAUTH_URL` matches your application URL exactly
- Check that cookies are not being blocked by browser settings

### Access Token Not Available

**Error**: `session.accessToken` is undefined

**Solution**:

- Verify the jwt and session callbacks in the NextAuth configuration
- Ensure the types/next-auth.d.ts file is properly set up
- Check that the types file is included in your tsconfig.json

### Token Expired

**Error**: Spotify API returns 401 Unauthorized

**Solution**:

- The access token expires after 1 hour
- Implement token refresh logic using the refresh token
- Consider checking `session.expiresAt` before making API calls

## Requested Scopes

The application requests the following Spotify scopes:

| Scope                       | Description                                  |
| --------------------------- | -------------------------------------------- |
| `user-read-email`           | Read access to user's email address          |
| `user-read-private`         | Read access to user's subscription details   |
| `user-top-read`             | Read access to user's top artists and tracks |
| `user-read-recently-played` | Read access to user's recently played tracks |

To request additional scopes, modify the `SPOTIFY_SCOPES` array in `app/api/auth/[...nextauth]/route.ts`.
