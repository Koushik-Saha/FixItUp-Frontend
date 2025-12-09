// src/types/auth.ts
export type UserRole = "regular" | "wholesale" | "pending_wholesale";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: UserRole;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
    wantsWholesale: boolean;
}
