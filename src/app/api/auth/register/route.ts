import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { signJWT } from "@/lib/jwt";
import { z } from "zod";
import { cookies } from "next/headers";
import { rateLimit } from "@/lib/ratelimit";

const registerSchema = z.object({
    full_name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        // Rate Limiting
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const { success } = await rateLimit(`register_${ip}`);

        if (!success) {
            return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
        }

        const body = await req.json();
        const validated = registerSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json({ error: validated.error.flatten() }, { status: 400 });
        }

        const { email, password, full_name, phone } = validated.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email already exists" }, { status: 409 });
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                fullName: full_name,
                phone: phone || null,
                role: "CUSTOMER",
            },
        });

        // Auto-login after register
        const token = await signJWT({ id: user.id, email: email, role: "CUSTOMER" });
        const cookieStore = await cookies();
        cookieStore.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        return NextResponse.json({
            data: {
                user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName }
            }
        });

    } catch (error) {
        console.error("Register Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
