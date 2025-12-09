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
    token: string | null;
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
        (set, get) => ({
            user: null,
            token: null,
            isLoading: false,
            error: null,

            init: async () => {
                set({ isLoading: true, error: null });
                try {
                    const user = await getCurrentUser();
                    set({ user, isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },

            login: async (payload) => {
                set({ isLoading: true, error: null });
                try {
                    const { user, token } = await login(payload);
                    set({ user, token, isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                    throw err;
                }
            },

            register: async (payload) => {
                set({ isLoading: true, error: null });
                try {
                    const { user, token } = await register(payload);
                    set({ user, token, isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                    throw err;
                }
            },

            logout: async () => {
                await logoutApi();
                set({ user: null, token: null });
            },

            updateProfile: async (updates) => {
                set({ isLoading: true, error: null });
                try {
                    const user = await updateProfile(updates);
                    set({ user, isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                    throw err;
                }
            },

            applyWholesale: async () => {
                set({ isLoading: true, error: null });
                try {
                    const user = await applyForWholesale();
                    set({ user, isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                    throw err;
                }
            },
        }),
        {
            name: "fixitup-auth-store",
            partialize: (state) => ({
                user: state.user,
                token: state.token,
            }),
        }
    )
);
