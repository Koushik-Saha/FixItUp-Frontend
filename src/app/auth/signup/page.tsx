// src/app/auth/signup/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
    const router = useRouter();
    const { user, register, isLoading, init } = useAuth();
    // successMessage state removed in favor of toast

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
            toast.error("Passwords do not match");
            return;
        }

        try {
            await register({
                full_name: form.full_name,
                email: form.email,
                phone: form.phone || undefined,
                password: form.password,
            });

            toast.success("Account created successfully!");
            // useAuth register handles the redirection on success via user state change?
            // Actually useAuth doesn't auto redirect usually, but the useEffect([user]) above will handle it.

        } catch (err: any) {
            console.error('Registration failed:', err);
            toast.error(err.message || "Registration failed. Please try again.");
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

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">
                            Full Name
                        </label>
                        <Input
                            name="full_name"
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
                        <Input
                            type="email"
                            name="email"
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
                        <Input
                            name="phone"
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
                        <Input
                            type="password"
                            name="password"
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
                        <Input
                            type="password"
                            name="confirmPassword"
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
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
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
                        <Button
                            type="submit"
                            disabled={isLoading}
                            loading={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Create Account
                        </Button>
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
