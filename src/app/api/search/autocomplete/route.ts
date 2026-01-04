// app/api/search/autocomplete/route.ts
// Search autocomplete endpoint for smart search

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q')
        const limit = parseInt(searchParams.get('limit') || '8')

        if (!query || query.trim().length < 2) {
            return NextResponse.json({
                success: true,
                data: { suggestions: [] }
            })
        }

        const supabase = await createClient()

        // Search products by name, brand, device model, SKU
        const { data: products, error } = await (supabase
            .from('products') as any)
            .select('id, name, brand, device_model, sku, thumbnail, base_price, retail_price, wholesale_price, total_stock, product_type')
            .eq('is_active', true)
            .or(`name.ilike.%${query}%,brand.ilike.%${query}%,device_model.ilike.%${query}%,sku.ilike.%${query}%`)
            .limit(limit)

        if (error) {
            console.error('Search autocomplete error:', error)
            return NextResponse.json(
                { error: 'Failed to fetch search suggestions' },
                { status: 500 }
            )
        }

        // Format suggestions
        const suggestions = (products || []).map((product: any) => ({
            id: product.id,
            name: product.name,
            brand: product.brand,
            deviceModel: product.device_model,
            sku: product.sku,
            thumbnail: product.thumbnail,
            price: product.retail_price || product.base_price,
            wholesalePrice: product.wholesale_price,
            stock: product.total_stock,
            productType: product.product_type
        }))

        // Also get brand suggestions
        const { data: brands } = await (supabase
            .from('products') as any)
            .select('brand')
            .eq('is_active', true)
            .ilike('brand', `%${query}%`)
            .limit(5)

        const uniqueBrands = [...new Set((brands || []).map((b: any) => b.brand))]

        // Get device model suggestions
        const { data: models } = await (supabase
            .from('products') as any)
            .select('device_model, brand')
            .eq('is_active', true)
            .ilike('device_model', `%${query}%`)
            .limit(5)

        const uniqueModels = [...new Set((models || []).map((m: any) => ({
            model: m.device_model,
            brand: m.brand
        })))]

        return NextResponse.json({
            success: true,
            data: {
                suggestions,
                brands: uniqueBrands,
                models: uniqueModels,
                query: query.trim()
            }
        })

    } catch (error) {
        console.error('Search autocomplete API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
