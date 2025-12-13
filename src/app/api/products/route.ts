// app/api/products/route.ts
// Products API - List and Create

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, NotFoundError, UnauthorizedError, ForbiddenError } from '@/lib/utils/errors'
import { productSchema, validateData, formatValidationErrors } from '@/utils/validation'

// GET /api/products - List products with filtering
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)

        // Get query parameters
        const category = searchParams.get('category')
        const brand = searchParams.get('brand')
        const device = searchParams.get('device')
        const search = searchParams.get('search')
        const featured = searchParams.get('featured')
        const isNew = searchParams.get('new')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const sortBy = searchParams.get('sort') || 'created_at'
        const sortOrder = searchParams.get('order') || 'desc'

        // Calculate pagination
        const from = (page - 1) * limit
        const to = from + limit - 1

        // Build query
        let query = (supabase
            .from('products') as any)
            .select('*, category:categories(id, name, slug)', { count: 'exact' })
            .eq('is_active', true)

        // Apply filters
        if (category) {
            // If category is a slug, look up the ID first
            const { data: categoryData } = await (supabase
                .from('categories') as any)
                .select('id')
                .eq('slug', category)
                .single()

            if (categoryData) {
                query = query.eq('category_id', categoryData.id)
            }
        }

        if (brand) {
            query = query.ilike('brand', brand)
        }

        if (device) {
            query = query.ilike('device_model', `%${device}%`)
        }

        if (search) {
            query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,sku.ilike.%${search}%`)
        }

        if (featured === 'true') {
            query = query.eq('is_featured', true)
        }

        if (isNew === 'true') {
            query = query.eq('is_new', true)
        }

        // Apply sorting
        query = query.order(sortBy, { ascending: sortOrder === 'asc' })

        // Apply pagination
        query = query.range(from, to)

        // Execute query
        const { data: products, error, count } = await query

        if (error) {
            console.error('Database error:', error)
            throw new Error('Failed to fetch products')
        }

        // Calculate pricing for user
        const { data: { user } } = await supabase.auth.getUser()
        let userProfile = null

        if (user) {
            const { data: profile } = await (supabase
                .from('profiles') as any)
                .select('role, wholesale_tier')
                .eq('id', user.id)
                .single()

            userProfile = profile
        }

        // Add calculated prices to products
        const productsWithPricing = products?.map((product: any) => {
            let displayPrice = product.base_price
            let discountPercentage = 0

            // Apply wholesale discount if applicable
            if (userProfile?.role === 'wholesale') {
                switch (userProfile.wholesale_tier) {
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
                discountPercentage,
                originalPrice: product.base_price,
                isWholesale: userProfile?.role === 'wholesale',
            }
        })

        return NextResponse.json({
            data: productsWithPricing,
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

// POST /api/products - Create new product (Admin only)
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError()
        }

        // Check if user is admin
        const { data: profile } = await (supabase
            .from('profiles') as any)
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || (profile as any).role !== 'admin') {
            throw new ForbiddenError('Only admins can create products')
        }

        // Parse and validate request body
        const body = await request.json()
        const validation = validateData(productSchema, body)

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    errors: formatValidationErrors(validation.errors!),
                },
                { status: 400 }
            )
        }

        // Create product
        const { data: product, error: createError } = await (supabase
            .from('products') as any)
            .insert(validation.data)
            .select()
            .single()

        if (createError) {
            console.error('Failed to create product:', createError)
            throw new Error('Failed to create product')
        }

        return NextResponse.json({ data: product }, { status: 201 })

    } catch (error) {
        return errorResponse(error)
    }
}
