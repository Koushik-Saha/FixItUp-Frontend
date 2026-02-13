import { Metadata } from 'next'
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import ProductClient from './product-client'

// Force dynamic since we use params and db calls
export const dynamic = 'force-dynamic'

interface Props {
    params: Promise<{ id: string }>
}

async function getProduct(id: string) {
    const product = await prisma.product.findUnique({
        where: { id },
    })
    return product
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    const product = await getProduct(id)

    if (!product) {
        return {
            title: 'Product Not Found | Max Phone Repair',
        }
    }

    return {
        title: `${product.metaTitle || product.name} | Max Phone Repair`,
        description: product.metaDescription || product.description?.slice(0, 160) || `Buy ${product.name} at Max Phone Repair.`,
        openGraph: {
            title: product.name,
            description: product.metaDescription || product.description?.slice(0, 160),
            images: product.images && product.images.length > 0 ? [{ url: product.images[0] }] : [],
        },
    }
}

export default async function ProductPage({ params }: Props) {
    const { id } = await params
    const product = await getProduct(id)

    if (!product) {
        notFound()
    }

    // Transform Decimal to number for client component
    const serializedProduct = {
        ...product,
        basePrice: Number(product.basePrice),
        costPrice: product.costPrice ? Number(product.costPrice) : null,
        tier1Discount: Number(product.tier1Discount),
        tier2Discount: Number(product.tier2Discount),
        tier3Discount: Number(product.tier3Discount),
        // Map DB fields to what ProductClient expects if mismatch
        // Looking at Product type in lib/api/products.ts vs DB
    }

    // Cast to any/compatible type for now as we transition types
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Product',
                        name: product.name,
                        description: product.description,
                        image: product.images && product.images.length > 0 ? product.images[0] : product.thumbnail,
                        sku: product.sku,
                        brand: {
                            '@type': 'Brand',
                            name: product.brand,
                        },
                        offers: {
                            '@type': 'Offer',
                            url: `https://maxphonerepair.com/products/${product.id}`,
                            priceCurrency: 'USD',
                            price: product.basePrice,
                            priceValidUntil: '2025-12-31',
                            itemCondition: 'https://schema.org/NewCondition',
                            availability: (product.totalStock || 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                        },
                    }),
                }}
            />
            <ProductClient product={serializedProduct as any} />
        </>
    )
}
