export default function ActivityPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-purple-50/30 to-zinc-50 dark:from-zinc-950 dark:via-purple-950/20 dark:to-zinc-950">
            <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    {/* Page Header */}
                    <div className="mb-12">
                        <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">Recent Activity</h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400">Track your listening history and discover patterns in your music journey</p>
                    </div>

                    {/* Placeholder Content */}
                    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                            <svg className="h-12 w-12 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Coming Soon</h2>
                        <p className="mx-auto max-w-md text-zinc-600 dark:text-zinc-400">This feature is currently under development. Soon you&apos;ll be able to view your recent listening activity, track your favorite songs, and analyze your music preferences over time.</p>
                        <div className="mt-8">
                            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Feature in development
                            </div>
                        </div>
                    </div>

                    {/* Future Features Preview */}
                    <div className="mt-12 grid gap-6 sm:grid-cols-2">
                        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                            <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Listening History</h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">View a chronological timeline of all the songs you&apos;ve listened to</p>
                        </div>
                        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                            <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Top Tracks & Artists</h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">Discover your most played songs and favorite artists</p>
                        </div>
                        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                            <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Listening Patterns</h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">Analyze when and how you listen to music throughout the day</p>
                        </div>
                        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                            <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Genre Insights</h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">Explore your music taste across different genres and moods</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
