// app/api/wholesale/pricing/route.ts
// Wholesale Pricing API - Get pricing tiers info

import { NextRequest, NextResponse } from 'next/server'

// GET /api/wholesale/pricing - Get wholesale pricing tiers
export async function GET(request: NextRequest) {
    try {
        const tiers = [
            {
                id: 'tier1',
                name: 'Bronze',
                discount: 8,
                description: 'Perfect for small repair shops',
                min_order: 100,
                features: [
                    '8% discount on all products',
                    'Priority customer support',
                    'Monthly volume reports',
                    'Free shipping on orders over $500',
                ],
            },
            {
                id: 'tier2',
                name: 'Silver',
                discount: 17,
                description: 'Ideal for growing businesses',
                min_order: 500,
                features: [
                    '17% discount on all products',
                    'Dedicated account manager',
                    'Quarterly business reviews',
                    'Free shipping on orders over $300',
                    'Extended payment terms (Net 30)',
                ],
            },
            {
                id: 'tier3',
                name: 'Gold',
                discount: 25,
                description: 'Best for high-volume retailers',
                min_order: 2000,
                features: [
                    '25% discount on all products',
                    'Premium support 24/7',
                    'Custom pricing on bulk orders',
                    'Free shipping on all orders',
                    'Extended payment terms (Net 45)',
                    'Early access to new products',
                ],
            },
        ]

        return NextResponse.json({
            data: tiers,
        })

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch pricing tiers' },
            { status: 500 }
        )
    }
}
