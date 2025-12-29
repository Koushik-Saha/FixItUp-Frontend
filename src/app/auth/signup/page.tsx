// src/app/auth/signup/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
    const router = useRouter();
    const { user, register, isLoading, error, init } = useAuth();
    const [successMessage, setSuccessMessage] = useState("");

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        wantsWholesale: false,
    });

    useEffect(() => {
        init();
    }, [init]);

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage("");

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    full_name: form.full_name,
                    email: form.email,
                    phone: form.phone || undefined,
                    password: form.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message);

                // If in dev mode (no verification required), redirect to login after 2 seconds
                if (!data.data.requires_verification) {
                    setTimeout(() => {
                        router.push("/auth/login");
                    }, 2000);
                } else {
                    // In production, show success message and wait for user to verify email
                    setTimeout(() => {
                        router.push("/auth/login");
                    }, 5000);
                }
            } else {
                console.error('Registration error:', data);
            }
        } catch (err) {
            console.error('Registration failed:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-neutral-900">
            <div className="w-full max-w-xl bg-white dark:bg-neutral-800 shadow-lg rounded-2xl p-8">
                <h1 className="text-2xl font-semibold mb-2 text-slate-900 dark:text-white">
                    Create your account
                </h1>
                <p className="text-sm text-slate-500 dark:text-neutral-400 mb-6">
                    Sign up as a regular customer or apply for a wholesale
                    account.
                </p>

                {successMessage && (
                    <div className="mb-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 text-sm">
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-3 py-2 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">
                            Full Name
                        </label>
                        <input
                            name="full_name"
                            className="w-full rounded-lg border border-slate-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="John Doe"
                            value={form.full_name}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="w-full rounded-lg border border-slate-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">
                            Phone (Optional)
                        </label>
                        <input
                            name="phone"
                            className="w-full rounded-lg border border-slate-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="(555) 123-4567"
                            value={form.phone}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="w-full rounded-lg border border-slate-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="w-full rounded-lg border border-slate-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength={6}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="col-span-2 mt-2 flex items-start gap-2 rounded-lg border border-slate-200 dark:border-neutral-600 bg-slate-50 dark:bg-neutral-700 px-3 py-3">
                        <input
                            id="wantsWholesale"
                            type="checkbox"
                            name="wantsWholesale"
                            className="mt-1"
                            checked={form.wantsWholesale}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <label
                            htmlFor="wantsWholesale"
                            className="text-sm text-slate-700 dark:text-neutral-300"
                        >
                            I want to apply for a{" "}
                            <span className="font-semibold">wholesale</span> account.
                            If approved, I will see wholesale pricing across the
                            site.
                        </label>
                    </div>

                    <div className="col-span-2 mt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-medium px-4 py-2.5 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Creating account...
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-sm text-center text-slate-500 dark:text-neutral-400">
                    Already have an account?{" "}
                    <Link
                        href="/auth/login"
                        className="text-blue-600 dark:text-blue-400 hover:underline dark:hover:text-blue-300 font-medium"
                    >
                        Sign in
                    </Link>
                </p>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <p className="text-xs text-amber-800 dark:text-amber-400">
                            <strong>Dev Mode:</strong> Email verification is disabled. You can login immediately after registration.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
