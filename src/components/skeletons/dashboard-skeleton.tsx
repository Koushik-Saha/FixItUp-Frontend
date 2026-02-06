import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50">
            <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <Skeleton className="h-10 w-48 mb-2 bg-neutral-800" />
                        <Skeleton className="h-5 w-64 bg-neutral-800" />
                    </div>
                    <Skeleton className="h-10 w-24 rounded-lg bg-neutral-800" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[260px,1fr] gap-8">
                    {/* Sidebar */}
                    <aside className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-6">
                            <Skeleton className="h-10 w-10 rounded-full bg-neutral-800" />
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-20 bg-neutral-800" />
                                <Skeleton className="h-4 w-32 bg-neutral-800" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full rounded-lg bg-neutral-800" />
                            ))}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="space-y-8">
                        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-7 w-40 bg-neutral-800" />
                                    <Skeleton className="h-4 w-64 bg-neutral-800" />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6 pt-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <Skeleton className="h-3 w-24 bg-neutral-800" />
                                        <Skeleton className="h-5 w-48 bg-neutral-800" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
