"use client";

import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import type { SpotifyRecentlyPlayedItem } from "@/types/spotify";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ArtistChartProps {
    items: SpotifyRecentlyPlayedItem[];
}

interface ArtistCount {
    name: string;
    count: number;
}

export function ArtistChart({ items }: ArtistChartProps) {
    const artistData = useMemo(() => {
        const artistCounts = new Map<string, number>();

        for (const item of items) {
            const artistName = item.track.artists.map((a) => a.name).join(", ");
            artistCounts.set(artistName, (artistCounts.get(artistName) || 0) + 1);
        }

        const sorted: ArtistCount[] = Array.from(artistCounts.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        // Show top 8 artists, aggregate the rest into "Others"
        const topArtists = sorted.slice(0, 8);
        const otherArtists = sorted.slice(8);

        if (otherArtists.length > 0) {
            const othersCount = otherArtists.reduce((sum, artist) => sum + artist.count, 0);
            topArtists.push({ name: "Others", count: othersCount });
        }

        return topArtists;
    }, [items]);

    // Detect dark mode
    const isDarkMode = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const textColor = isDarkMode ? "rgb(161, 161, 170)" : "rgb(113, 113, 122)"; // zinc-400 : zinc-500

    const chartData = {
        labels: artistData.map((a) => a.name),
        datasets: [
            {
                label: "Tracks",
                data: artistData.map((a) => a.count),
                backgroundColor: [
                    "rgba(239, 68, 68, 0.8)", // red-500
                    "rgba(59, 130, 246, 0.8)", // blue-500
                    "rgba(34, 197, 94, 0.8)", // green-500
                    "rgba(251, 146, 60, 0.8)", // orange-500
                    "rgba(168, 85, 247, 0.8)", // purple-500
                    "rgba(236, 72, 153, 0.8)", // pink-500
                    "rgba(14, 165, 233, 0.8)", // sky-500
                    "rgba(234, 179, 8, 0.8)", // yellow-500
                    "rgba(99, 102, 241, 0.8)", // indigo-500
                ],
                borderColor: ["rgba(239, 68, 68, 1)", "rgba(59, 130, 246, 1)", "rgba(34, 197, 94, 1)", "rgba(251, 146, 60, 1)", "rgba(168, 85, 247, 1)", "rgba(236, 72, 153, 1)", "rgba(14, 165, 233, 1)", "rgba(234, 179, 8, 1)", "rgba(99, 102, 241, 1)"],
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    padding: 15,
                    font: {
                        size: 12,
                    },
                    color: textColor,
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const label = context.label || "";
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} tracks (${percentage}%)`;
                    },
                },
            },
        },
    };

    if (items.length === 0) return null;

    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Track Count by Artist</h2>
            <div className="h-80">
                <Doughnut data={chartData} options={options} />
            </div>
        </div>
    );
}
