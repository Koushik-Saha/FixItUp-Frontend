import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse, UnauthorizedError, ValidationError } from '@/lib/utils/errors'
import { createRepairTicketSchema, validateData, formatValidationErrors } from '@/utils/validation'
import { sendRepairConfirmationEmail } from '@/lib/email'
import { Prisma } from '@prisma/client'

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5001",
    process.env.NEXT_PUBLIC_SITE_URL,
].filter(Boolean) as string[];

function getCorsHeaders(request: NextRequest) {
    const origin = request.headers.get("origin") || "";
    const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || origin;
    return {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-id, x-user-role",
        "Access-Control-Allow-Credentials": "true",
    };
}

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function GET(request: NextRequest) {
    const corsHeaders = getCorsHeaders(request);

    try {
        const userId = request.headers.get('x-user-id');
        const userRole = request.headers.get('x-user-role');

        if (!userId) {
            throw new UnauthorizedError('Please login to view repair tickets');
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');
        const skip = (page - 1) * limit;

        const isAdmin = userRole === 'ADMIN';

        const where: Prisma.RepairTicketWhereInput = {};

        if (!isAdmin) {
            where.customerId = userId;
        }

        if (status) {
            // Map status if needed
            where.status = status.toUpperCase() as any;
        }

        const [tickets, count] = await Promise.all([
            prisma.repairTicket.findMany({
                where,
                include: {
                    // If there's a relation to Store, include it (if schema has it)
                    // Schema has assignedStoreId string, but no relation defined in my snippet?
                    // Wait, checking schema... Schema says: assignedStoreId String?
                    // But no @relation to Store model! 
                    // My schema snippet:
                    // model Store { ... inventory Inventory[] }
                    // model RepairTicket { ... assignedStoreId String? ... }
                    // It does NOT have a relation to Store in the schema I wrote earlier!
                    // I should fix the schema later. For now, fetch raw field.
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.repairTicket.count({ where })
        ]);

        return NextResponse.json({
            data: tickets,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
            },
        }, { headers: corsHeaders });

    } catch (error) {
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}

export async function POST(request: NextRequest) {
    const corsHeaders = getCorsHeaders(request);

    try {
        const body = await request.json();
        const userId = request.headers.get('x-user-id');

        const validation = validateData(createRepairTicketSchema, body);
        if (!validation.success || !validation.data) {
            return NextResponse.json({
                error: 'Validation failed',
                errors: formatValidationErrors(validation.errors!)
            }, { status: 400, headers: corsHeaders });
        }

        const ticketData = validation.data;

        // Generate Ticket Number
        const ticketNumber = `TKT-${Date.now()}`;

        const ticket = await prisma.repairTicket.create({
            data: {
                ticketNumber,
                customerId: userId || null, // Allow guest?
                customerName: ticketData.customer_name,
                customerEmail: ticketData.customer_email,
                customerPhone: ticketData.customer_phone,
                deviceBrand: ticketData.device_brand,
                deviceModel: ticketData.device_model,
                imeiSerial: ticketData.imei_serial,
                issueDescription: ticketData.issue_description,
                issueCategory: ticketData.issue_category,
                appointmentDate: ticketData.appointment_date,
                customerNotes: ticketData.customer_notes,
                status: 'SUBMITTED',
                priority: 'NORMAL',
                // Handle guest logic if needed (no userId)
            }
        });

        // Email
        try {
            await sendRepairConfirmationEmail(ticket as any);
        } catch (e) {
            console.error('Email failed', e);
        }

        return NextResponse.json({
            message: 'Repair ticket created successfully',
            data: {
                ticket_id: ticket.id,
                ticket_number: ticket.ticketNumber,
            }
        }, { status: 201, headers: corsHeaders });

    } catch (error) {
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}
