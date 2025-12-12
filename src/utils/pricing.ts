// lib/utils/pricing.ts
// Wholesale pricing calculations

export type WholesaleTier = 'tier1' | 'tier2' | 'tier3' | null

export interface PriceCalculation {
    basePrice: number
    discountPercentage: number
    discountAmount: number
    finalPrice: number
    savings: number
}

export function calculateWholesalePrice(
    basePrice: number,
    tier: WholesaleTier
): PriceCalculation {
    let discountPercentage = 0

    switch (tier) {
        case 'tier1':
            discountPercentage = 8
            break
        case 'tier2':
            discountPercentage = 17
            break
        case 'tier3':
            discountPercentage = 25
            break
        default:
            discountPercentage = 0
    }

    const discountAmount = (basePrice * discountPercentage) / 100
    const finalPrice = basePrice - discountAmount

    return {
        basePrice: Number(basePrice.toFixed(2)),
        discountPercentage,
        discountAmount: Number(discountAmount.toFixed(2)),
        finalPrice: Number(finalPrice.toFixed(2)),
        savings: Number(discountAmount.toFixed(2)),
    }
}

export function calculateOrderTotal(items: Array<{
    basePrice: number
    quantity: number
    tier?: WholesaleTier
}>) {
    let subtotal = 0
    let totalDiscount = 0

    items.forEach((item) => {
        const priceCalc = calculateWholesalePrice(item.basePrice, item.tier || null)
        subtotal += priceCalc.basePrice * item.quantity
        totalDiscount += priceCalc.discountAmount * item.quantity
    })

    const finalTotal = subtotal - totalDiscount

    return {
        subtotal: Number(subtotal.toFixed(2)),
        discount: Number(totalDiscount.toFixed(2)),
        total: Number(finalTotal.toFixed(2)),
    }
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price)
}

export function getTierName(tier: WholesaleTier): string {
    switch (tier) {
        case 'tier1':
            return 'Bronze (8% off)'
        case 'tier2':
            return 'Silver (17% off)'
        case 'tier3':
            return 'Gold (25% off)'
        default:
            return 'Retail'
    }
}

export function getTierDiscount(tier: WholesaleTier): number {
    switch (tier) {
        case 'tier1':
            return 8
        case 'tier2':
            return 17
        case 'tier3':
            return 25
        default:
            return 0
    }
}
