
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const DEFAULT_SLIDES = [
    {
        badge: 'New Arrivals',
        badgeColor: 'bg-yellow-500',
        title: 'Latest Tech at Unbeatable Prices',
        description: 'Shop the newest smartphones, laptops, and accessories from top brands. Free shipping on orders over $50!',
        ctaPrimary: { text: 'Shop Now', link: '/shop' },
        ctaSecondary: { text: 'View All Deals', link: '/deals' },
        image: '/images/phone_repair.jpg',
        gradient: 'from-blue-600 via-purple-600 to-pink-600',
        trustBadges: [
            { icon: '🚚', text: 'Free Shipping' },
            { icon: '🛡️', text: '2-Year Warranty' },
            { icon: '💳', text: 'Secure Payment' }
        ],
        discount: '-20% OFF',
        sortOrder: 1
    },
    {
        badge: 'Smartphones',
        badgeColor: 'bg-blue-500',
        title: 'iPhone 15 Series Now Available',
        description: 'Get the latest iPhone 15 Pro Max with all accessories. Complete protection with cases, screen protectors, and chargers.',
        ctaPrimary: { text: 'Shop iPhones', link: '/phones/apple' },
        ctaSecondary: { text: 'View Accessories', link: '/phones/apple/iphone-15-pro-max' },
        image: '/images/phone_repair.jpg',
        gradient: 'from-cyan-600 via-blue-600 to-indigo-600',
        trustBadges: [
            { icon: '✅', text: 'Authentic Products' },
            { icon: '⚡', text: 'Same Day Shipping' },
            { icon: '💰', text: 'Best Price Guarantee' }
        ],
        discount: '-15% OFF',
        sortOrder: 2
    },
    {
        badge: 'Laptops & Tablets',
        badgeColor: 'bg-purple-500',
        title: 'Powerful Laptops for Work & Play',
        description: 'Discover high-performance laptops from Dell, HP, Lenovo, and more. Perfect for work, gaming, or creative projects.',
        ctaPrimary: { text: 'Shop Laptops', link: '/laptops' },
        ctaSecondary: { text: 'View Tablets', link: '/tablets' },
        image: '/images/phone_repair.jpg',
        gradient: 'from-purple-600 via-pink-600 to-red-600',
        trustBadges: [
            { icon: '🎮', text: 'Gaming Ready' },
            { icon: '💻', text: 'Professional Grade' },
            { icon: '🔧', text: 'Free Setup' }
        ],
        discount: '-25% OFF',
        sortOrder: 3
    }
];

export async function GET() {
    try {
        const slides = await prisma.heroSlide.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });

        // "Lazy Seeding": If no slides, return default and attempt async insert
        if (slides.length === 0) {
            console.log('No hero slides found. Returning defaults.');

            // Try to seed in background (fire and forget for this request)
            // But strict Vercel funcs might kill it. 
            // We'll just return items for now. 
            // If we really want to persist, we can try awaiting it if it's fast enough.

            try {
                // We will just return the objects.
                // The user can use the Admin Panel (future) to save them, 
                // OR we can try to insert them now.
                // Given our previous error, let's NOT try to insert to avoid crashing.
                // We just return the in-memory defaults so the Frontend WORKS.
                return NextResponse.json(DEFAULT_SLIDES);
            } catch (err) {
                // Ignore
            }

            return NextResponse.json(DEFAULT_SLIDES);
        }

        return NextResponse.json(slides);
    } catch (error) {
        console.error('Failed to fetch hero slides:', error);
        // Fallback to default slides on error so homepage never breaks
        return NextResponse.json(DEFAULT_SLIDES);
    }
}
