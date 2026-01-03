// app/api/device-finder/parts/route.ts
// Get available part types for a specific brand + device model

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const brand = searchParams.get('brand')
        const device = searchParams.get('device')

        if (!brand || !device) {
            return NextResponse.json(
                { error: 'Brand and device parameters are required' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Query products filtered by brand and device_model
        // Group by product_type to get unique part categories
        const { data: products, error } = await (supabase
            .from('products') as any)
            .select('product_type, thumbnail, images, id')
            .eq('is_active', true)
            .ilike('brand', brand)
            .ilike('device_model', `%${device}%`)

        if (error) {
            console.error('Failed to fetch products:', error)
            return NextResponse.json(
                { error: 'Failed to fetch product types' },
                { status: 500 }
            )
        }

        if (!products || products.length === 0) {
            return NextResponse.json({
                data: [],
                message: 'No products found for this device'
            })
        }

        // Group by product_type and count
        const partTypesMap = new Map<string, { type: string; count: number; sample_image: string | null }>()

        products.forEach((product: any) => {
            const type = product.product_type || 'Other'
            const existing = partTypesMap.get(type)

            if (existing) {
                existing.count++
            } else {
                partTypesMap.set(type, {
                    type,
                    count: 1,
                    sample_image: product.thumbnail || product.images?.[0] || null
                })
            }
        })

        // Convert to array and sort by count (most popular first)
        const partTypes = Array.from(partTypesMap.values())
            .sort((a, b) => b.count - a.count)

        return NextResponse.json({
            data: partTypes,
            total: partTypes.length
        })

    } catch (error) {
        console.error('Device finder parts API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
