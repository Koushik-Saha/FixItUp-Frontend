// src/lib/auth-client.ts
"use client";

import {
    AuthResponse,
    LoginPayload,
    RegisterPayload,
    User,
} from "@/types/auth";

const STORAGE_KEY = "fixitup_auth_user";

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
    await delay(500);

    const stored = typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;

    if (!stored) {
        throw new Error("No user found. Please sign up first.");
    }

    const user: User = JSON.parse(stored);

    // Fake password check – ignore in mock
    if (payload.email !== user.email) {
        throw new Error("Invalid email or password");
    }

    return {
        user,
        token: "mock-token",
    };
}

export async function register(
    payload: RegisterPayload
): Promise<AuthResponse> {
    await delay(500);

    const user: User = {
        id: crypto.randomUUID(),
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        role: payload.wantsWholesale ? "pending_wholesale" : "regular",
    };

    if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }

    return {
        user,
        token: "mock-token",
    };
}

export async function getCurrentUser(): Promise<User | null> {
    const stored =
        typeof window !== "undefined"
            ? window.localStorage.getItem(STORAGE_KEY)
            : null;

    if (!stored) return null;
    return JSON.parse(stored) as User;
}

export async function updateProfile(
    updates: Partial<User>
): Promise<User> {
    const current = await getCurrentUser();
    if (!current) throw new Error("Not authenticated");

    const updated = { ...current, ...updates };

    if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    return updated;
}

export async function applyForWholesale(): Promise<User> {
    const current = await getCurrentUser();
    if (!current) throw new Error("Not authenticated");

    const updated: User = {
        ...current,
        role:
            current.role === "wholesale"
                ? "wholesale"
                : "pending_wholesale",
    };

    if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    return updated;
}

export async function logoutApi(): Promise<void> {
    if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEY);
    }
}
