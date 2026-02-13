'use client'

import { useEffect } from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full w-fit mx-auto mb-6">
                    <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-white">
                    Something went wrong!
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                    We encountered an unexpected error. Our team has been notified.
                </p>
                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:opacity-90 transition-opacity"
                >
                    <RotateCcw className="h-4 w-4" />
                    Try Again
                </button>
            </div>
        </div>
    )
}
