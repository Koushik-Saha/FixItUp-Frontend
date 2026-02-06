import { Skeleton } from "@/components/ui/skeleton"

export function ProductSkeleton() {
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                    {/* Image Skeleton */}
                    <div>
                        <Skeleton className="aspect-square w-full rounded-lg mb-4 bg-neutral-200 dark:bg-neutral-800" />
                        <div className="grid grid-cols-4 gap-3">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="aspect-square rounded-lg bg-neutral-200 dark:bg-neutral-800" />
                            ))}
                        </div>
                    </div>

                    {/* Info Skeleton */}
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-3/4 bg-neutral-200 dark:bg-neutral-800" />
                        <div className="flex gap-4">
                            <Skeleton className="h-6 w-32 bg-neutral-200 dark:bg-neutral-800" />
                            <Skeleton className="h-6 w-24 bg-neutral-200 dark:bg-neutral-800" />
                        </div>
                        <Skeleton className="h-12 w-40 bg-neutral-200 dark:bg-neutral-800" />
                        <Skeleton className="h-10 w-full bg-neutral-200 dark:bg-neutral-800" />
                        <div className="flex gap-3">
                            <Skeleton className="h-12 flex-1 bg-neutral-200 dark:bg-neutral-800" />
                            <Skeleton className="h-12 w-12 bg-neutral-200 dark:bg-neutral-800" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
