// app/api/admin/products/bulk-import/route.ts
// Admin Products API - Bulk import products

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, UnauthorizedError } from '@/lib/utils/errors'
import { handleCorsPreflightRequest, getCorsHeaders } from '@/lib/cors'

// Helper to check if user is admin
async function checkAdmin(supabase: any, userId: string) {
    const { data: profile } = await (supabase
        .from('products') as any)
        .select('role')
        .eq('id', userId)
        .single()

    if (!profile || profile.role !== 'admin') {
        throw new UnauthorizedError('Admin access required')
    }
}

// OPTIONS /api/admin/products/bulk-import - Handle preflight request
export async function OPTIONS(request: NextRequest) {
    return handleCorsPreflightRequest(request)
}

// POST /api/admin/products/bulk-import - Bulk import products
export async function POST(request: NextRequest) {
    try {
        const origin = request.headers.get('origin')
        const supabase = await createClient()
        const body = await request.json()

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError('Please login to access this resource')
        }

        // Check admin role
        await checkAdmin(supabase, user.id)

        const { products } = body

        if (!products || !Array.isArray(products) || products.length === 0) {
            return NextResponse.json(
                { error: 'Products array is required and must not be empty' },
                { status: 400, headers: getCorsHeaders(origin) }
            )
        }

        let imported = 0
        let failed = 0
        const errors: string[] = []

        // Get existing SKUs to check for duplicates
        const skus = products.map(p => p.sku).filter(Boolean)
        const { data: existingProducts } = await (supabase
            .from('products') as any)
            .select('sku')
            .in('sku', skus)

        const existingSKUs = new Set(existingProducts?.map((p: any) => p.sku) || [])

        // Process each product
        const productsToInsert = []

        for (const product of products) {
            try {
                // Validate required fields
                if (!product.name || !product.sku || !product.slug || !product.brand || product.base_price === undefined) {
                    errors.push(`Product "${product.name || product.sku || 'unknown'}": Missing required fields`)
                    failed++
                    continue
                }

                // Check for duplicate SKU
                if (existingSKUs.has(product.sku)) {
                    errors.push(`Product "${product.name}": SKU "${product.sku}" already exists`)
                    failed++
                    continue
                }

                // Prepare product data
                productsToInsert.push({
                    name: product.name,
                    sku: product.sku,
                    slug: product.slug,
                    category_id: product.category_id || null,
                    brand: product.brand,
                    device_model: product.device_model || null,
                    product_type: product.product_type || null,
                    base_price: product.base_price,
                    cost_price: product.cost_price || null,
                    wholesale_tier1_discount: product.wholesale_tier1_discount || 0,
                    wholesale_tier2_discount: product.wholesale_tier2_discount || 0,
                    wholesale_tier3_discount: product.wholesale_tier3_discount || 0,
                    total_stock: product.total_stock || 0,
                    low_stock_threshold: product.low_stock_threshold || 10,
                    images: product.images || [],
                    thumbnail: product.thumbnail || null,
                    description: product.description || null,
                    specifications: product.specifications || null,
                    meta_title: product.meta_title || null,
                    meta_description: product.meta_description || null,
                    is_active: product.is_active !== false,
                    is_featured: product.is_featured || false,
                    is_new: product.is_new || false,
                    is_bestseller: product.is_bestseller || false,
                })

                // Add to existing SKUs to prevent duplicates within the batch
                existingSKUs.add(product.sku)

            } catch (err: any) {
                errors.push(`Product "${product.name || product.sku}": ${err.message}`)
                failed++
            }
        }

        // Bulk insert products
        if (productsToInsert.length > 0) {
            const { data: insertedProducts, error: insertError } = await (supabase
                .from('products') as any)
                .insert(productsToInsert)
                .select()

            if (insertError) {
                console.error('Bulk insert error:', insertError)
                errors.push(`Bulk insert failed: ${insertError.message}`)
                failed += productsToInsert.length
            } else {
                imported = insertedProducts?.length || 0
            }
        }

        return NextResponse.json({
            message: `Bulk import completed: ${imported} imported, ${failed} failed`,
            data: {
                imported,
                failed,
                total: products.length,
                errors: errors.length > 0 ? errors : undefined,
            },
        }, {
            headers: getCorsHeaders(origin)
        })

    } catch (error) {
        const errorRes = errorResponse(error)
        const headers = new Headers(errorRes.headers)
        const origin = request.headers.get('origin')
        Object.entries(getCorsHeaders(origin)).forEach(([key, value]) => {
            headers.set(key, value)
        })
        return new NextResponse(errorRes.body, {
            status: errorRes.status,
            headers,
        })
    }
}
