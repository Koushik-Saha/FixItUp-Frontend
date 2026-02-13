import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://maxphonerepair.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static Routes
    const routes = [
        '',
        '/shop',
        '/auth/login',
        '/auth/register',
        '/contact-us',
        '/privacy-policy',
        '/term-and-condition',
        '/repair-price-checker',
        '/stores',
        '/warranty-claims',
        '/wholesale/apply',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }))

    // Dynamic Routes: Products
    const products = await prisma.product.findMany({
        where: { isActive: true },
        select: { id: true, updatedAt: true },
    })

    const productRoutes = products.map((product) => ({
        url: `${BASE_URL}/products/${product.id}`,
        lastModified: product.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    // Dynamic Routes: Categories (if we had a category page like /shop/category/[slug])
    // Assuming /shop?category=XYZ for now, which isn't a separate page properly indexed unless utilizing params
    // If we have separate category pages, add them here.
    // For now, skipping explicit category pages if they are just query params on /shop.

    return [...routes, ...productRoutes]
}
