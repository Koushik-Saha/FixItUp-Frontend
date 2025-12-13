// src/lib/auth-client.ts
"use client";

import { createClient } from "@/lib/supabase/client";
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
        const supabase = createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) return null;

        // Get full profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (!profile) return null;

        const profileData = profile as any;

        return {
            id: user.id,
            email: user.email!,
            full_name: profileData.full_name || '',
            phone: profileData.phone || undefined,
            role: profileData.role || 'customer',
            wholesale_status: profileData.wholesale_status || undefined,
            wholesale_tier: profileData.wholesale_tier || undefined,
        };
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

export async function updateProfile(updates: Partial<User>): Promise<User> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    // Update profile in database
    const { data, error } = await (supabase
        .from('profiles') as any)
        .update({
            full_name: updates.full_name,
            phone: updates.phone,
        })
        .eq('id', user.id)
        .select()
        .single();

    if (error) throw new Error(error.message);

    return {
        id: user.id,
        email: user.email!,
        full_name: data.full_name || '',
        phone: data.phone || undefined,
        role: data.role || 'customer',
        wholesale_status: data.wholesale_status || undefined,
        wholesale_tier: data.wholesale_tier || undefined,
    };
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
    
    // Also clear Supabase session
    const supabase = createClient();
    await supabase.auth.signOut();
}
