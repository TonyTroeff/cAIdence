"use client";

import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";

import type { SpotifyRecentlyPlayedItem } from "@/types/spotify";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface DailyChartProps {
    items: SpotifyRecentlyPlayedItem[];
}

interface DayCount {
    date: string;
    label: string;
    count: number;
}

function formatDayLabel(date: Date): string {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (date.toDateString() === now.toDateString()) return "Today";

    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
    });
}

export function DailyChart({ items }: DailyChartProps) {
    const dailyData = useMemo(() => {
        const dayCounts = new Map<string, { date: Date; count: number }>();

        for (const item of items) {
            const playedAt = new Date(item.played_at);
            if (Number.isNaN(playedAt.getTime())) continue;

            const dateKey = `${playedAt.getFullYear()}-${playedAt.getMonth()}-${playedAt.getDate()}`;

            const existing = dayCounts.get(dateKey);
            if (existing) existing.count++;
            else dayCounts.set(dateKey, { date: playedAt, count: 1 });
        }

        const sorted: DayCount[] = Array.from(dayCounts.values())
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map((item) => ({
                date: item.date.toISOString(),
                label: formatDayLabel(item.date),
                count: item.count,
            }));

        return sorted;
    }, [items]);

    // Detect dark mode
    const isDarkMode = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const textColor = isDarkMode ? "rgb(161, 161, 170)" : "rgb(113, 113, 122)"; // zinc-400 : zinc-500
    const gridColor = isDarkMode ? "rgba(161, 161, 170, 0.1)" : "rgba(113, 113, 122, 0.1)";

    const chartData = {
        labels: dailyData.map((d) => d.label),
        datasets: [
            {
                label: "Tracks Played",
                data: dailyData.map((d) => d.count),
                fill: true,
                backgroundColor: "rgba(59, 130, 246, 0.15)", // blue-500 with low opacity
                borderColor: "rgba(59, 130, 246, 1)", // blue-500
                borderWidth: 3,
                pointBackgroundColor: "rgba(59, 130, 246, 1)",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.3, // Smooth curves
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    title: function (context: any) {
                        return context[0].label;
                    },
                    label: function (context: any) {
                        const value = context.parsed.y;
                        return `${value} track${value === 1 ? "" : "s"}`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    color: textColor,
                },
                grid: {
                    color: gridColor,
                },
            },
            x: {
                ticks: {
                    color: textColor,
                },
                grid: {
                    display: false,
                },
            },
        },
    };

    if (items.length === 0) return null;

    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Track Count by Day</h2>
            <div className="h-80">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
}
