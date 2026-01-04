// app/api/notifications/stock-alert/route.ts
// Subscribe to back-in-stock notifications

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { product_id, email } = body

        if (!product_id || !email) {
            return NextResponse.json(
                { error: 'Product ID and email are required' },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Check if product exists
        const { data: product, error: productError } = await (supabase
            .from('products') as any)
            .select('id, name')
            .eq('id', product_id)
            .single()

        if (productError || !product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        // Check if already subscribed
        const { data: existing } = await (supabase
            .from('stock_alerts') as any)
            .select('id')
            .eq('product_id', product_id)
            .eq('email', email.toLowerCase())
            .eq('notified', false)
            .single()

        if (existing) {
            return NextResponse.json({
                success: true,
                message: 'You are already subscribed to notifications for this product'
            })
        }

        // Create stock alert subscription
        const { error: insertError } = await (supabase
            .from('stock_alerts') as any)
            .insert({
                product_id,
                email: email.toLowerCase(),
                notified: false,
                created_at: new Date().toISOString()
            })

        if (insertError) {
            console.error('Failed to create stock alert:', insertError)
            return NextResponse.json(
                { error: 'Failed to subscribe to notifications' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Successfully subscribed to stock notifications'
        })

    } catch (error) {
        console.error('Stock alert API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
