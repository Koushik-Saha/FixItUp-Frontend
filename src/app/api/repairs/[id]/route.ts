import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma, RepairStatus, Priority } from '@prisma/client'
import { errorResponse, UnauthorizedError, NotFoundError, ForbiddenError } from '@/lib/utils/errors'
import { sendRepairStatusUpdateEmail } from '@/lib/email'

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

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const corsHeaders = getCorsHeaders(request);

    try {
        const { id } = await params;
        const userId = request.headers.get('x-user-id');
        const userRole = request.headers.get('x-user-role');

        if (!userId) throw new UnauthorizedError();

        const ticket = await prisma.repairTicket.findUnique({
            where: { id }
            // include store if needed
        });

        if (!ticket) throw new NotFoundError('Repair ticket');

        if (userRole !== 'ADMIN' && ticket.customerId !== userId) {
            throw new ForbiddenError('Access denied');
        }

        return NextResponse.json({ data: ticket }, { headers: corsHeaders });

    } catch (error) {
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const corsHeaders = getCorsHeaders(request);

    try {
        const { id } = await params;
        const userRole = request.headers.get('x-user-role');

        if (userRole !== 'ADMIN') {
            throw new ForbiddenError('Admin access required');
        }

        const body = await request.json();
        const updateData: Prisma.RepairTicketUpdateInput = {};

        // Mapping (snake_case from frontend/docs to camelCase prisma)
        if (body.status) updateData.status = body.status.toUpperCase() as RepairStatus;
        if (body.priority) updateData.priority = body.priority.toUpperCase() as Priority;
        if (body.assigned_store_id) updateData.assignedStoreId = body.assigned_store_id;
        if (body.assigned_technician) updateData.assignedTechnician = body.assigned_technician;
        if (body.appointment_date) updateData.appointmentDate = body.appointment_date;

        // Costs (Decimal)
        if (body.estimated_cost) updateData.estimatedCost = isNaN(Number(body.estimated_cost)) ? undefined : Number(body.estimated_cost);
        // Note: Prisma Decimal input usually accepts number or string. Let's pass what we got if it matches, 
        // or ensure it's a Decimal compatible format. 
        // Actually, for strict typing, let's cast or transform.
        // Assuming body contains numbers or strings that Prisma can handle.
        if (body.estimated_cost !== undefined) updateData.estimatedCost = body.estimated_cost;
        if (body.actual_cost !== undefined) updateData.actualCost = body.actual_cost;
        if (body.parts_cost !== undefined) updateData.partsCost = body.parts_cost;
        if (body.labor_cost !== undefined) updateData.laborCost = body.labor_cost;

        if (body.technician_notes) updateData.technicianNotes = body.technician_notes;
        if (body.internal_notes) updateData.internalNotes = body.internal_notes;

        // Timestamps
        const now = new Date();
        if (body.status === 'confirmed') updateData.confirmedAt = now;
        if (body.status === 'in_progress') updateData.startedAt = now;
        if (body.status === 'completed') updateData.completedAt = now;
        if (body.status === 'cancelled') updateData.cancelledAt = now;

        const updatedTicket = await prisma.repairTicket.update({
            where: { id },
            data: updateData
        });

        // Email
        try {
            if (body.status) {
                await sendRepairStatusUpdateEmail(updatedTicket as any, body.status);
            }
        } catch (e) {
            console.error('Email failed', e);
        }

        return NextResponse.json({
            message: 'Repair ticket updated successfully',
            data: updatedTicket
        }, { headers: corsHeaders });

    } catch (error) {
        const res = errorResponse(error);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}
