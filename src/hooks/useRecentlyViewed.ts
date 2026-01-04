import { useState, useEffect, useCallback } from 'react'

export interface RecentlyViewedProduct {
    id: string
    name: string
    brand: string
    deviceModel: string
    thumbnail: string | null
    price: number
    viewedAt: number
}

const STORAGE_KEY = 'recently_viewed_products'
const MAX_ITEMS = 12

export function useRecentlyViewed() {
    const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedProduct[]>([])

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                // Sort by viewedAt descending
                const sorted = parsed.sort((a: RecentlyViewedProduct, b: RecentlyViewedProduct) =>
                    b.viewedAt - a.viewedAt
                )
                setRecentlyViewed(sorted)
            } catch (error) {
                console.error('Failed to parse recently viewed products:', error)
                localStorage.removeItem(STORAGE_KEY)
            }
        }
    }, [])

    // Add a product to recently viewed
    const addProduct = useCallback((product: Omit<RecentlyViewedProduct, 'viewedAt'>) => {
        setRecentlyViewed(prev => {
            // Remove if already exists
            const filtered = prev.filter(p => p.id !== product.id)

            // Add to beginning with current timestamp
            const updated = [
                { ...product, viewedAt: Date.now() },
                ...filtered
            ].slice(0, MAX_ITEMS)

            // Save to localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

            return updated
        })
    }, [])

    // Remove a product
    const removeProduct = useCallback((productId: string) => {
        setRecentlyViewed(prev => {
            const updated = prev.filter(p => p.id !== productId)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
            return updated
        })
    }, [])

    // Clear all
    const clearAll = useCallback(() => {
        setRecentlyViewed([])
        localStorage.removeItem(STORAGE_KEY)
    }, [])

    // Get products (optionally limit)
    const getProducts = useCallback((limit?: number) => {
        if (limit) {
            return recentlyViewed.slice(0, limit)
        }
        return recentlyViewed
    }, [recentlyViewed])

    return {
        recentlyViewed,
        addProduct,
        removeProduct,
        clearAll,
        getProducts,
        count: recentlyViewed.length
    }
}
