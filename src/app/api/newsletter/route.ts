import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email || !email.includes("@")) {
            return NextResponse.json(
                { success: false, message: "Valid email is required" },
                { status: 400 }
            );
        }

        const subscriber = await prisma.newsletterSubscriber.create({
            data: {
                email,
            },
        });

        return NextResponse.json({ success: true, data: subscriber }, { status: 201 });
    } catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json(
                { success: false, message: "Email is already subscribed." },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
