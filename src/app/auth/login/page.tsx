// src/app/auth/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {useAuth} from "@/hooks/useAuth";

export default function LoginPage() {
    const router = useRouter();
    const { user, login, isLoading, error, init } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password });
        } catch {
            // error already in store
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-neutral-900">
            <div className="w-full max-w-md bg-white dark:bg-neutral-800 shadow-lg rounded-2xl p-8">
                <h1 className="text-2xl font-semibold mb-2 text-slate-900 dark:text-white">
                    Sign in to your account
                </h1>
                <p className="text-sm text-slate-500 dark:text-neutral-400 mb-6">
                    Enter your email and password to access your dashboard.
                </p>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-3 py-2 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full rounded-lg border border-slate-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300">
                                Password
                            </label>
                            <Link 
                                href="/auth/forgot-password"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            type="password"
                            className="w-full rounded-lg border border-slate-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-medium px-4 py-2.5 hover:bg-blue-700 disabled:opacity-60"
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="mt-6 text-sm text-center text-slate-500 dark:text-neutral-400">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/auth/signup"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}
