// app/api/admin/products/route.ts
// Admin Products API - List and Create products

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, UnauthorizedError } from '@/lib/utils/errors'

// Helper to check if user is admin
async function checkAdmin(supabase: any, userId: string) {
    const { data: profile } = await (supabase
        .from('profiles') as any)
        .select('role')
        .eq('id', userId)
        .single()

    if (!profile || profile.role !== 'admin') {
        throw new UnauthorizedError('Admin access required')
    }
}

// GET /api/admin/products - List products with filters
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError('Please login to access this resource')
        }

        // Check admin role
        await checkAdmin(supabase, user.id)

        // Get query parameters
        const search = searchParams.get('search')
        const category = searchParams.get('category')
        const brand = searchParams.get('brand')
        const status = searchParams.get('status')
        const stock = searchParams.get('stock')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '50')

        // Build query
        let query = (supabase
            .from('products') as any)
            .select('*, categories(id, name, slug)', { count: 'exact' })

        // Apply search filter
        if (search) {
            query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,brand.ilike.%${search}%,device_model.ilike.%${search}%`)
        }

        // Apply category filter
        if (category) {
            query = query.eq('category_id', category)
        }

        // Apply brand filter
        if (brand) {
            query = query.eq('brand', brand)
        }

        // Apply status filter
        if (status === 'active') {
            query = query.eq('is_active', true)
        } else if (status === 'inactive') {
            query = query.eq('is_active', false)
        }

        // Apply stock filter
        if (stock === 'out-of-stock') {
            query = query.eq('total_stock', 0)
        } else if (stock === 'low-stock') {
            query = query.gt('total_stock', 0).lte('total_stock', 'low_stock_threshold')
        } else if (stock === 'in-stock') {
            query = query.gt('total_stock', 0)
        }

        // Apply sorting
        query = query.order('created_at', { ascending: false })

        // Apply pagination
        const from = (page - 1) * limit
        const to = from + limit - 1
        query = query.range(from, to)

        const { data: products, error, count } = await query

        if (error) {
            console.error('Failed to fetch products:', error)
            throw new Error('Failed to fetch products')
        }

        return NextResponse.json({
            data: products,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
            },
        })

    } catch (error) {
        return errorResponse(error)
    }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError('Please login to access this resource')
        }

        // Check admin role
        await checkAdmin(supabase, user.id)

        // Extract product data
        const {
            name,
            sku,
            slug,
            category_id,
            brand,
            device_model,
            product_type,
            base_price,
            cost_price,
            wholesale_tier1_discount,
            wholesale_tier2_discount,
            wholesale_tier3_discount,
            total_stock,
            low_stock_threshold,
            images,
            thumbnail,
            description,
            specifications,
            meta_title,
            meta_description,
            is_active,
            is_featured,
            is_new,
            is_bestseller,
        } = body

        // Validate required fields
        if (!name || !sku || !slug || !brand || base_price === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: name, sku, slug, brand, base_price' },
                { status: 400 }
            )
        }

        // Check if SKU already exists
        const { data: existingProduct } = await (supabase
            .from('products') as any)
            .select('id')
            .eq('sku', sku)
            .single()

        if (existingProduct) {
            return NextResponse.json(
                { error: 'Product with this SKU already exists' },
                { status: 400 }
            )
        }

        // Create product
        const { data: product, error: createError } = await (supabase
            .from('products') as any)
            .insert({
                name,
                sku,
                slug,
                category_id,
                brand,
                device_model,
                product_type,
                base_price,
                cost_price,
                wholesale_tier1_discount: wholesale_tier1_discount || 0,
                wholesale_tier2_discount: wholesale_tier2_discount || 0,
                wholesale_tier3_discount: wholesale_tier3_discount || 0,
                total_stock: total_stock || 0,
                low_stock_threshold: low_stock_threshold || 10,
                images: images || [],
                thumbnail,
                description,
                specifications,
                meta_title,
                meta_description,
                is_active: is_active !== false,
                is_featured: is_featured || false,
                is_new: is_new || false,
                is_bestseller: is_bestseller || false,
            })
            .select()
            .single()

        if (createError) {
            console.error('Failed to create product:', createError)
            throw new Error('Failed to create product')
        }

        return NextResponse.json(
            {
                message: 'Product created successfully',
                data: product,
            },
            { status: 201 }
        )

    } catch (error) {
        return errorResponse(error)
    }
}
