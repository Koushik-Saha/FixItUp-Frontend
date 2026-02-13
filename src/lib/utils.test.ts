import { describe, it, expect } from 'vitest'
import {
    formatCurrency,
    calculateDiscount,
    generateSKU,
    getStockStatus,
    calculateBulkPrice,
    isValidEmail,
    calculateOrderTotal,
    slugify
} from './utils'

describe('Utils', () => {
    describe('formatCurrency', () => {
        it('should format number to USD currency', () => {
            expect(formatCurrency(100)).toBe('$100.00')
            expect(formatCurrency(1234.56)).toBe('$1,234.56')
            expect(formatCurrency(0)).toBe('$0.00')
        })
    })

    describe('calculateDiscount', () => {
        it('should calculate correct discount percentage', () => {
            expect(calculateDiscount(100, 80)).toBe(20)
            expect(calculateDiscount(100, 50)).toBe(50)
            expect(calculateDiscount(1000, 900)).toBe(10)
        })

        it('should handle zero discount', () => {
            expect(calculateDiscount(100, 100)).toBe(0)
        })
    })

    describe('slugify', () => {
        it('should convert string to slug', () => {
            expect(slugify('Hello World')).toBe('hello-world')
            expect(slugify('iPhone 13 Pro')).toBe('iphone-13-pro')
            expect(slugify('  Trim Me  ')).toBe('trim-me')
        })

        it('should handle special characters', () => {
            expect(slugify('Café & Bar')).toBe('cafe-bar')
        })
    })

    describe('generateSKU', () => {
        it('should generate SKU with correct format', () => {
            const sku = generateSKU('Apple', 'iPhone 13', 'Battery')
            expect(sku).toMatch(/^APP-IPHON-BAT-\d{3}$/)
        })
    })

    describe('getStockStatus', () => {
        it('should return out-of-stock for 0 quantity', () => {
            const status = getStockStatus(0)
            expect(status.status).toBe('out-of-stock')
            expect(status.label).toBe('Out of Stock')
        })

        it('should return low-stock for quantity < 10', () => {
            const status = getStockStatus(5)
            expect(status.status).toBe('low-stock')
            expect(status.label).toBe('Only 5 left')
        })

        it('should return in-stock for quantity >= 10', () => {
            const status = getStockStatus(15)
            expect(status.status).toBe('in-stock')
            expect(status.label).toBe('In Stock')
        })
    })

    describe('calculateBulkPrice', () => {
        const tiers = [
            { min: 10, discount: 10 },
            { min: 50, discount: 20 }
        ]

        it('should apply no discount for low quantity', () => {
            const result = calculateBulkPrice(100, 5, tiers)
            expect(result.price).toBe(100)
            expect(result.discount).toBe(0)
            expect(result.tier).toBe('1-9 units')
        })

        it('should apply first tier discount', () => {
            const result = calculateBulkPrice(100, 15, tiers)
            expect(result.price).toBe(90) // 10% off
            expect(result.discount).toBe(10)
            expect(result.tier).toBe('10+ units')
        })

        it('should apply higher tier discount', () => {
            const result = calculateBulkPrice(100, 60, tiers)
            expect(result.price).toBe(80) // 20% off
            expect(result.discount).toBe(20)
            expect(result.tier).toBe('50+ units')
        })
    })

    describe('isValidEmail', () => {
        it('should return true for valid email', () => {
            expect(isValidEmail('test@example.com')).toBe(true)
            expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
        })

        it('should return false for invalid email', () => {
            expect(isValidEmail('invalid')).toBe(false)
            expect(isValidEmail('user@')).toBe(false)
            expect(isValidEmail('@domain.com')).toBe(false)
            expect(isValidEmail('user@domain')).toBe(false) // Basic regex might allow this, referencing implementation
        })
    })

    describe('calculateOrderTotal', () => {
        it('should calculate total correctly with all parameters', () => {
            // subtotal 100, discount 10%, tax 8%, shipping 10
            const result = calculateOrderTotal(100, 10, 8, 10)

            // subtotal: 100
            // discount amount: 10
            // taxable: 90
            // tax amount: 7.2
            // total: 90 + 7.2 + 10 = 107.2

            expect(result.subtotal).toBe(100)
            expect(result.discount).toBe(10)
            expect(result.tax).toBeCloseTo(7.2)
            expect(result.shipping).toBe(10)
            expect(result.total).toBeCloseTo(107.2)
        })

        it('should handle defaults', () => {
            const result = calculateOrderTotal(100)
            expect(result.total).toBe(100)
        })
    })
})
