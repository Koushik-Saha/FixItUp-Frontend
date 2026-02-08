import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, ValidationError } from "@/lib/utils/errors";
import { createRepairTicketSchema, validateData, formatValidationErrors } from "@/utils/validation";
import { sendRepairConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input using existing schema
        const validation = validateData(createRepairTicketSchema, body);

        if (!validation.success || !validation.data) {
            return NextResponse.json({
                error: 'Validation failed',
                errors: formatValidationErrors(validation.errors!)
            }, { status: 400 });
        }

        const data = validation.data;
        const userId = request.headers.get("x-user-id");

        // Generate Ticket Number (Format: R-YYYYMMDD-XXXX)
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const ticketNumber = `R-${dateStr}-${randomSuffix}`;

        // Create Ticket
        const ticket = await prisma.repairTicket.create({
            data: {
                ticketNumber,
                customerId: userId || null,

                customerName: data.customer_name,
                customerEmail: data.customer_email,
                customerPhone: data.customer_phone,

                deviceBrand: data.device_brand,
                deviceModel: data.device_model,
                imeiSerial: data.imei_serial,

                issueCategory: data.issue_category,
                issueDescription: data.issue_description,

                appointmentDate: data.appointment_date,
                customerNotes: data.customer_notes,

                status: "SUBMITTED",
                priority: "NORMAL",
            }
        });

        // Send Confirmation Email
        // Map Prisma model to EmailTicket interface expected by sendRepairConfirmationEmail
        await sendRepairConfirmationEmail({
            id: ticket.id,
            ticketNumber: ticket.ticketNumber,
            customerName: ticket.customerName,
            customerEmail: ticket.customerEmail,
            deviceBrand: ticket.deviceBrand,
            deviceModel: ticket.deviceModel,
            issueDescription: ticket.issueDescription,
            status: ticket.status,
            appointmentDate: ticket.appointmentDate,
            estimatedCost: ticket.estimatedCost ? Number(ticket.estimatedCost) : null,
            actualCost: ticket.actualCost ? Number(ticket.actualCost) : null,
            technicianNotes: ticket.technicianNotes
        });

        return NextResponse.json({
            success: true,
            message: "Repair ticket created successfully",
            data: {
                ticketNumber: ticket.ticketNumber,
                id: ticket.id
            }
        }, { status: 201 });

    } catch (error) {
        return errorResponse(error);
    }
}
