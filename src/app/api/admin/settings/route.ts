import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const settings = await prisma.siteSetting.findMany();

        // Convert the flat array to a key-value object
        const transformedSettings = settings.reduce((acc: Record<string, string>, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        return NextResponse.json({ success: true, data: transformedSettings });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Upsert each key in the payload individually
        const promises = Object.entries(body).map(([key, value]) => {
            if (value === undefined || value === null) return null;

            return prisma.siteSetting.upsert({
                where: { key: key },
                update: { value: String(value) },
                create: { key: key, value: String(value) },
            });
        });

        await Promise.all(promises.filter(Boolean));

        return NextResponse.json({ success: true, message: "Settings saved successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
