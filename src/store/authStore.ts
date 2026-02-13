// src/store/authStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    login,
    register,
    getCurrentUser,
    updateProfile,
    applyForWholesale,
    logoutApi,
} from "@/lib/auth-client";
import type {
    User,
    LoginPayload,
    RegisterPayload,
} from "@/types/auth";

interface AuthState {
    user: User | null;
    session: unknown | null;
    isLoading: boolean;
    error: string | null;

    init: () => Promise<void>;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (updates: Partial<User>) => Promise<void>;
    applyWholesale: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            session: null,
            isLoading: false,
            error: null,

            init: async () => {
                set({ isLoading: true, error: null });
                try {
                    const user = await getCurrentUser();
                    set({ user, isLoading: false });
                } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : 'An unknown error occurred';
                    set({ error: message, isLoading: false });
                }
            },

            login: async (payload) => {
                set({ isLoading: true, error: null });
                try {
                    const { user, session } = await login(payload);
                    set({ user, session, isLoading: false });
                } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : 'Login failed';
                    set({ error: message, isLoading: false });
                    throw err;
                }
            },

            register: async (payload) => {
                set({ isLoading: true, error: null });
                try {
                    const { user, session } = await register(payload);
                    set({ user, session, isLoading: false });
                } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : 'Registration failed';
                    set({ error: message, isLoading: false });
                    throw err;
                }
            },

            logout: async () => {
                await logoutApi();
                set({ user: null, session: null });
            },

            updateProfile: async (updates) => {
                set({ isLoading: true, error: null });
                try {
                    const user = await updateProfile(updates);
                    set({ user, isLoading: false });
                } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : 'Profile update failed';
                    set({ error: message, isLoading: false });
                    throw err;
                }
            },

            applyWholesale: async () => {
                set({ isLoading: true, error: null });
                try {
                    const user = await applyForWholesale();
                    set({ user, isLoading: false });
                } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : 'Wholesale application failed';
                    set({ error: message, isLoading: false });
                    throw err;
                }
            },
        }),
        {
            name: "fixitup-auth-store",
            partialize: (state) => ({
                user: state.user,
                session: state.session,
            }),
        }
    )
);
