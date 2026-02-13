// src/types/auth.ts
export type UserRole = "customer" | "admin" | "wholesale";
export type WholesaleStatus = "pending" | "approved" | "rejected";
export type WholesaleTier = "tier1" | "tier2" | "tier3";

export interface User {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    role: UserRole;
    wholesale_status?: WholesaleStatus;
    wholesale_tier?: WholesaleTier;
    company_name?: string;
}

export interface AuthResponse {
    user: User;
    session: {
        access_token: string;
        refresh_token: string;
        expires_at: number;
    };
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    wantsWholesale?: boolean;
}
