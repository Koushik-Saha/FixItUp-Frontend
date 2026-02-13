import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your-secret-key-change-this-in-prod";
const key = new TextEncoder().encode(SECRET_KEY);

export interface JWTPayload {
    id: string;
    email: string;
    role: string;
    [key: string]: unknown;
}

export async function signJWT(payload: JWTPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(key);
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, key);
        return payload as unknown as JWTPayload;
    } catch {
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    return await verifyJWT(token);
}
