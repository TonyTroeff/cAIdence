export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-purple-50/30 to-zinc-50 dark:from-zinc-950 dark:via-purple-950/20 dark:to-zinc-950">
            <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center">
                    <div className="w-full max-w-4xl space-y-12 text-center">
                        {/* App Name */}
                        <div className="space-y-6">
                            <h1 className="text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl">
                                <span className="text-zinc-900 dark:text-zinc-100">c</span>
                                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">AI</span>
                                <span className="text-zinc-900 dark:text-zinc-100">dence</span>
                            </h1>

                            {/* Description */}
                            <div className="mx-auto max-w-2xl">
                                <p className="text-xl text-zinc-600 dark:text-zinc-400 sm:text-2xl">
                                    Your personal <span className="font-semibold text-purple-600 dark:text-purple-400">music diary</span> and <span className="font-semibold text-pink-600 dark:text-pink-400">analyzer</span>
                                </p>
                            </div>
                        </div>

                        {/* Interactive Feature Cards */}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:scale-105 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                                    <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Track Your Music</h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">Keep a detailed diary of your listening habits and discover patterns</p>
                            </div>

                            <div className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:scale-105 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
                                    <svg className="h-6 w-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">AI-Powered Insights</h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">Get intelligent analysis of your music preferences and trends</p>
                            </div>

                            <div className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:scale-105 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 sm:col-span-2 lg:col-span-1">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                                    <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Recent Activity</h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">View your listening history and recent discoveries</p>
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="pt-8">
                            <p className="text-sm text-zinc-500 dark:text-zinc-500">Connect your music streaming service to get started</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
