// src/lib/auth-client.ts
"use client";

import {
    AuthResponse,
    LoginPayload,
    RegisterPayload,
    User,
} from "@/types/auth";

const API_BASE = "/api/auth";

export async function login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
    }

    const { data } = await response.json();
    return data;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.json();
        if (error.errors) {
            const errorMessages = Object.values(error.errors).flat().join(", ");
            throw new Error(errorMessages);
        }
        throw new Error(error.error || "Registration failed");
    }

    const { data } = await response.json();
    return data;
}

export async function getCurrentUser(): Promise<User | null> {
    try {
        const response = await fetch(`${API_BASE}/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) return null;

        const { user } = await response.json();
        return user;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

export async function updateProfile(updates: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE}/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
    }

    const { user } = await response.json();
    return user;
}

export async function applyForWholesale(): Promise<User> {
    const response = await fetch("/api/wholesale/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Wholesale application failed");
    }

    const { data } = await response.json();
    return data.user;
}

export async function logoutApi(): Promise<void> {
    await fetch(`${API_BASE}/logout`, {
        method: "POST",
    });
}

