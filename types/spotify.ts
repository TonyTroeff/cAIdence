export interface SpotifyImage {
    url: string;
    height: number | null;
    width: number | null;
}

export interface SpotifyFollowers {
    href: string | null;
    total: number;
}

export interface SpotifyMeResponse {
    country: string;
    display_name: string;
    email: string;
    followers: SpotifyFollowers;
    id: string;
    images: SpotifyImage[];
    product: string;
    type: string;
    uri: string;
}

export interface SpotifyArtist {
    id: string;
    name: string;
}

export interface SpotifyAlbum {
    id: string;
    name: string;
    images: SpotifyImage[];
}

export interface SpotifyTrack {
    id: string;
    name: string;
    artists: SpotifyArtist[];
    album: SpotifyAlbum;
    duration_ms?: number;
    popularity?: number;
}

export interface SpotifyRecentlyPlayedItem {
    played_at: string;
    track: SpotifyTrack;
}

export interface SpotifyRecentlyPlayedCursors {
    after?: string;
    before?: string;
}

export interface SpotifyRecentlyPlayedResponse {
    href?: string;
    limit: number;
    next: string | null;
    cursors?: SpotifyRecentlyPlayedCursors;
    total?: number;
    items: SpotifyRecentlyPlayedItem[];
}
