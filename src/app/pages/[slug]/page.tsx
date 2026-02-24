import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import type { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string }>;
};

// Next.js 15+ fetch params as Promise
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const page = await prisma.page.findUnique({
        where: { slug: resolvedParams.slug, isPublished: true }
    });

    if (!page) {
        return { title: 'Page Not Found' };
    }

    return {
        title: page.metaTitle || page.title,
        description: page.metaDescription,
    };
}

export default async function CMSPage({ params }: Props) {
    const resolvedParams = await params;
    const page = await prisma.page.findUnique({
        where: { slug: resolvedParams.slug, isPublished: true }
    });

    if (!page) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 dark:text-white">{page.title}</h1>

            {/* Render HTML content safely */}
            <div
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
            />
        </div>
    );
}
