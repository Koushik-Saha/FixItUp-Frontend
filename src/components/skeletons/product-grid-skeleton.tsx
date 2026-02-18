import { Skeleton } from "@/components/ui/skeleton"

export function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 space-y-4">
                    <Skeleton className="aspect-square w-full rounded-xl bg-neutral-200 dark:bg-neutral-800" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-800" />
                        <Skeleton className="h-4 w-1/2 bg-neutral-200 dark:bg-neutral-800" />
                    </div>
                    <div className="flex justify-between pt-2">
                        <Skeleton className="h-6 w-20 bg-neutral-200 dark:bg-neutral-800" />
                        <Skeleton className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                    </div>
                </div>
            ))}
        </div>
    )
}
