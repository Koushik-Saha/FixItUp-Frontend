// app/api/products/search/route.ts
// Dedicated product search endpoint

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse } from '@/lib/utils/errors'

// GET /api/products/search - Search products
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)

        // Get search parameters
        const query = searchParams.get('q') || searchParams.get('query') || ''
        const category = searchParams.get('category')
        const brand = searchParams.get('brand')
        const minPrice = searchParams.get('min_price')
        const maxPrice = searchParams.get('max_price')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')

        // Calculate pagination
        const from = (page - 1) * limit
        const to = from + limit - 1

        // Check authentication for wholesale pricing
        const { data: { user } } = await supabase.auth.getUser()

        let userRole = null
        let wholesaleTier = null

        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role, wholesale_tier')
                .eq('id', user.id)
                .single()

            userRole = (profile as any)?.role
            wholesaleTier = (profile as any)?.wholesale_tier
        }

        // Build query
        let dbQuery = supabase
            .from('products')
            .select(`
        *,
        categories(id, name, slug)
      `, { count: 'exact' })
            .eq('is_active', true)

        // Apply search filter
        if (query) {
            dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%,sku.ilike.%${query}%`)
        }

        // Apply category filter
        if (category) {
            const { data: categoryData } = await supabase
                .from('categories')
                .select('id')
                .eq('slug', category)
                .single()

            if (categoryData) {
                dbQuery = dbQuery.eq('category_id', (categoryData as any).id)
            }
        }

        // Apply brand filter
        if (brand) {
            dbQuery = dbQuery.ilike('brand', brand)
        }

        // Apply price range
        if (minPrice) {
            dbQuery = dbQuery.gte('base_price', parseFloat(minPrice))
        }
        if (maxPrice) {
            dbQuery = dbQuery.lte('base_price', parseFloat(maxPrice))
        }

        // Apply sorting and pagination
        dbQuery = dbQuery
            .order('created_at', { ascending: false })
            .range(from, to)

        const { data: products, error, count } = await dbQuery

        if (error) {
            console.error('Search error:', error)
            throw new Error('Failed to search products')
        }

        // Calculate pricing for each product
        const productsWithPricing = products?.map((product: any) => {
            let displayPrice = product.base_price
            let discountPercentage = 0

            // Apply wholesale pricing
            if (userRole === 'wholesale') {
                switch (wholesaleTier) {
                    case 'tier1':
                        discountPercentage = product.wholesale_tier1_discount
                        break
                    case 'tier2':
                        discountPercentage = product.wholesale_tier2_discount
                        break
                    case 'tier3':
                        discountPercentage = product.wholesale_tier3_discount
                        break
                }
                displayPrice = product.base_price * (1 - discountPercentage / 100)
            }

            return {
                ...product,
                displayPrice: Number(displayPrice.toFixed(2)),
                originalPrice: product.base_price,
                discountPercentage,
                isWholesale: userRole === 'wholesale',
            }
        }) || []

        return NextResponse.json({
            data: productsWithPricing,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
            },
            search: {
                query,
                filters: {
                    category,
                    brand,
                    min_price: minPrice,
                    max_price: maxPrice,
                },
                results: productsWithPricing.length,
            },
        })

    } catch (error) {
        return errorResponse(error)
    }
}
