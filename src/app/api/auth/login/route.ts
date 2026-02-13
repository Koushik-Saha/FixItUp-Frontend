import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { signJWT } from "@/lib/jwt";
import { z } from "zod";
import { cookies } from "next/headers";
import { rateLimit } from "@/lib/ratelimit";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export async function POST(req: Request) {
    try {
        console.log("Login Request Received");
        // Rate Limiting
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const { success } = await rateLimit(`login_${ip}`);

        if (!success) {
            return NextResponse.json({ error: "Too many login attempts. Please try again later." }, { status: 429 });
        }

        const body = await req.json();
        const validated = loginSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const { email, password } = validated.data;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.password) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = await signJWT({ id: user.id, email: email, role: user.role || 'CUSTOMER' });
        const cookieStore = await cookies();

        cookieStore.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return NextResponse.json({
            data: {
                user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName }
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
