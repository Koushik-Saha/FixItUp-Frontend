import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
    errorResponse,
    UnauthorizedError,
    ForbiddenError,
} from "@/lib/utils/errors";
import { handleCorsPreflightRequest, getCorsHeaders } from '@/lib/cors';
import { Role, Prisma } from "@prisma/client";

// OPTIONS /api/admin/inventory/users - Handle preflight request
export async function OPTIONS(request: NextRequest) {
    return handleCorsPreflightRequest(request);
}

// GET /api/admin/users - List all users
export async function GET(request: NextRequest) {
    try {
        const origin = request.headers.get('origin');

        // Query params
        const { searchParams } = new URL(request.url);
        const role = searchParams.get("role");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "50");
        const skip = (page - 1) * limit;

        // Apply filters
        const where: Prisma.UserWhereInput = {};
        if (role) {
            where.role = role.toUpperCase() as Role; // Enum mapping
        }

        // Fetch users
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count({ where })
        ]);

        // Stats
        const [totalCount, customerCount, wholesaleCount, adminCount] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: 'CUSTOMER' } }),
            prisma.user.count({ where: { role: 'WHOLESALE' } }),
            prisma.user.count({ where: { role: 'ADMIN' } })
        ]);

        const stats = {
            total: totalCount,
            customers: customerCount,
            wholesale: wholesaleCount,
            admins: adminCount,
        };

        return NextResponse.json({
            data: users,
            stats,
            pagination: {
                page,
                limit,
                total: total,
                totalPages: Math.ceil(total / limit),
            },
        }, {
            headers: getCorsHeaders(origin),
        });
    } catch (error) {
        const errorRes = errorResponse(error);
        const headers = new Headers(errorRes.headers);
        const origin = request.headers.get('origin');
        Object.entries(getCorsHeaders(origin)).forEach(([key, value]) => {
            headers.set(key, value);
        });
        return new NextResponse(errorRes.body, {
            status: errorRes.status,
            headers,
        });
    }
}
