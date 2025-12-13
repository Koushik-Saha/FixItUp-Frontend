// src/app/auth/signup/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
    const router = useRouter();
    const { user, register, isLoading, error, init } = useAuth();

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

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            await register({
                full_name: form.full_name,
                email: form.email,
                phone: form.phone || undefined,
                password: form.password,
                wantsWholesale: form.wantsWholesale,
            });
            // Registration successful - user will need to verify email
            alert("Registration successful! Please check your email to verify your account.");
            router.push("/auth/login");
        } catch {
            // error already in store
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-8">
                <h1 className="text-2xl font-semibold mb-2 text-slate-900">
                    Create your account
                </h1>
                <p className="text-sm text-slate-500 mb-6">
                    Sign up as a regular customer or apply for a wholesale
                    account.
                </p>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-3 py-2 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Full Name
                        </label>
                        <input
                            name="full_name"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="John Doe"
                            value={form.full_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Phone
                        </label>
                        <input
                            name="phone"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-span-2 mt-2 flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                        <input
                            id="wantsWholesale"
                            type="checkbox"
                            name="wantsWholesale"
                            className="mt-1"
                            checked={form.wantsWholesale}
                            onChange={handleChange}
                        />
                        <label
                            htmlFor="wantsWholesale"
                            className="text-sm text-slate-700"
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
                            className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-medium px-4 py-2.5 hover:bg-blue-700 disabled:opacity-60"
                        >
                            {isLoading ? "Creating account..." : "Create Account"}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-sm text-center text-slate-500">
                    Already have an account?{" "}
                    <Link
                        href="/auth/login"
                        className="text-blue-600 hover:underline font-medium"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
