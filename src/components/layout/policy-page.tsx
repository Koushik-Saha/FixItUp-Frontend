import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

interface PolicyPageProps {
    policyKey: string
    titleFallback: string
}

export async function PolicyPage({ policyKey, titleFallback }: PolicyPageProps) {
    const policy = await prisma.systemSetting.findUnique({
        where: { key: policyKey }
    })

    if (!policy) {
        // Fallback or 404
        return (
            <div className="container py-12 md:py-16 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-neutral-900 dark:text-white">
                    {titleFallback}
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                    Policy content not found. Please check back later.
                </p>
            </div>
        )
    }

    const { title, content, updatedAt } = policy.value as { title: string, content: string, updatedAt: string }

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            {/* Header */}
            <div className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container py-12 md:py-16 text-center max-w-4xl">
                    <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                        {title || titleFallback}
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Last Updated: {new Date(updatedAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container py-12 md:py-16 max-w-4xl">
                <div
                    className="prose prose-neutral dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </div>
    )
}
