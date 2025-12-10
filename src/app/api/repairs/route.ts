// app/api/repairs/route.ts
// Repair Tickets API - List and Create

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, UnauthorizedError } from '@/utils/errors'
import { createRepairTicketSchema, validateData, formatValidationErrors } from '@/utils/validation'

// GET /api/repairs - List repair tickets
export async function GET(request: NextRequest) {
    try {
        const supabase = createClient()
        const { searchParams } = new URL(request.url)

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            throw new UnauthorizedError('Please login to view repair tickets')
        }

        // Get query parameters
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const status = searchParams.get('status')

        // Calculate pagination
        const from = (page - 1) * limit
        const to = from + limit - 1

        // Check if user is admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        const isAdmin = profile?.role === 'admin'

        // Build query
        let query = supabase
            .from('repair_tickets')
            .select('*, stores(id, name, city, state)', { count: 'exact' })

        // Admins see all tickets, users see only their own
        if (!isAdmin) {
            query = query.eq('customer_id', user.id)
        }

        // Apply status filter
        if (status) {
            query = query.eq('status', status)
        }

        // Apply sorting and pagination
        query = query
            .order('created_at', { ascending: false })
            .range(from, to)

        const { data: tickets, error, count } = await query

        if (error) {
            console.error('Failed to fetch repair tickets:', error)
            throw new Error('Failed to fetch repair tickets')
        }

        return NextResponse.json({
            data: tickets,
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

// POST /api/repairs - Create repair ticket
export async function POST(request: NextRequest) {
    try {
        const supabase = createClient()

        // Get authenticated user (optional for repair tickets)
        const { data: { user } } = await supabase.auth.getUser()

        // Parse and validate request
        const body = await request.json()
        const validation = validateData(createRepairTicketSchema, body)

        if (!validation.success || !validation.data) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    errors: formatValidationErrors(validation.errors!),
                },
                { status: 400 }
            )
        }

        const ticketData = validation.data

        // Generate ticket number
        const { data: ticketNumberData } = await supabase.rpc('generate_ticket_number')
        const ticketNumber = ticketNumberData || `TKT-${Date.now()}`

        // Create repair ticket
        const { data: ticket, error: createError } = await supabase
            .from('repair_tickets')
            .insert({
                ticket_number: ticketNumber,
                customer_id: user?.id || null,
                customer_name: ticketData.customer_name,
                customer_email: ticketData.customer_email,
                customer_phone: ticketData.customer_phone,
                device_brand: ticketData.device_brand,
                device_model: ticketData.device_model,
                imei_serial: ticketData.imei_serial,
                issue_description: ticketData.issue_description,
                issue_category: ticketData.issue_category,
                appointment_date: ticketData.appointment_date,
                customer_notes: ticketData.customer_notes,
                status: 'submitted',
                priority: 'normal',
            })
            .select()
            .single()

        if (createError) {
            console.error('Failed to create repair ticket:', createError)
            throw new Error('Failed to create repair ticket')
        }

        // TODO: Send confirmation email to customer
        // TODO: Send notification to admin

        return NextResponse.json(
            {
                message: 'Repair ticket created successfully',
                data: {
                    ticket_id: ticket.id,
                    ticket_number: ticket.ticket_number,
                },
            },
            { status: 201 }
        )

    } catch (error) {
        return errorResponse(error)
    }
}
