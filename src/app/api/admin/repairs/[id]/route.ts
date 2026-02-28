import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse } from "@/lib/utils/errors";
import { Prisma } from "@prisma/client";

const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:5001",
    "http://127.0.0.1:5001",
    process.env.NEXT_PUBLIC_SITE_URL,
].filter(Boolean) as string[];

function getCorsHeaders(request: NextRequest) {
    const origin = request.headers.get("origin") || "";
    const allowOrigin = origin || "*";
    return {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-id, x-user-role",
        "Access-Control-Allow-Credentials": "true",
        "Vary": "Origin",
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
    const { id } = await params;

    try {
        const userRole = request.headers.get("x-user-role");
        if (userRole !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401, headers: corsHeaders }
            );
        }

        const ticket = await prisma.repairTicket.findUnique({
            where: { id },
            include: {
                customer: {
                    select: { id: true, email: true, fullName: true, phone: true }
                }
            }
        });

        if (!ticket) {
            return NextResponse.json(
                { error: "Ticket not found" },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json({ data: ticket }, { headers: corsHeaders });

    } catch (err) {
        console.error("GET Ticket Error", err);
        const res = errorResponse(err);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const corsHeaders = getCorsHeaders(request);
    const { id } = await params;

    try {
        const userRole = request.headers.get("x-user-role");
        if (userRole !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401, headers: corsHeaders }
            );
        }

        const body = await request.json();

        // Fields to update
        const updateData: Prisma.RepairTicketUpdateInput = {};

        if (body.status) updateData.status = body.status;
        if (body.priority) updateData.priority = body.priority;
        if (body.technician_notes !== undefined) updateData.technicianNotes = body.technician_notes;
        if (body.internal_notes !== undefined) updateData.internalNotes = body.internal_notes;
        if (body.estimated_cost !== undefined) updateData.estimatedCost = body.estimated_cost;
        if (body.parts_cost !== undefined) updateData.partsCost = body.parts_cost;
        if (body.labor_cost !== undefined) updateData.laborCost = body.labor_cost;
        if (body.assigned_technician !== undefined) updateData.assignedTechnician = body.assigned_technician;


        const ticket = await prisma.repairTicket.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(
            { message: "Ticket updated", data: ticket },
            { headers: corsHeaders }
        );

    } catch (err) {
        console.error("Update Ticket Error", err);
        const res = errorResponse(err);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
    }
}
