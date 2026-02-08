// src/app/auth/login/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { user, login, isLoading, init } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const onSubmit = async (data: LoginForm) => {
        try {
            await login(data);
            toast.success("Welcome back!");
        } catch (err: any) {
            toast.error(err.message || "Invalid credentials. Please try again.");
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">
                            Email
                        </label>
                        <Input
                            {...register("email")}
                            type="email"
                            placeholder="you@example.com"
                            disabled={isLoading || isSubmitting}
                            className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>
                        )}
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
                        <Input
                            {...register("password")}
                            type="password"
                            placeholder="••••••••"
                            disabled={isLoading || isSubmitting}
                            className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || isSubmitting}
                        loading={isLoading || isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Sign In
                    </Button>
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
