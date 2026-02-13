// src/app/auth/signup/page.tsx
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

const signupSchema = z
    .object({
        full_name: z.string().min(2, "Full name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        phone: z.string().optional(),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
        wantsWholesale: z.boolean().default(false),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const router = useRouter();
    const { user, register: registerUser, isLoading, init } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            full_name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            wantsWholesale: false,
        },
    });

    useEffect(() => {
        init();
    }, [init]);

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const onSubmit = async (data: SignupForm) => {
        try {
            await registerUser({
                full_name: data.full_name,
                email: data.email,
                phone: data.phone || undefined,
                password: data.password,
            });

            toast.success("Account created successfully!");
            // session changes will trigger the useEffect to redirect
        } catch (err: any) {
            console.error("Registration failed:", err);
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

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label htmlFor="full_name" className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">
                            Full Name
                        </label>
                        <Input
                            id="full_name"
                            {...register("full_name")}
                            placeholder="John Doe"
                            disabled={isLoading || isSubmitting}
                            className={errors.full_name ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {errors.full_name && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.full_name.message}</p>
                        )}
                    </div>

                    <div className="col-span-1">
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">
                            Email
                        </label>
                        <Input
                            id="email"
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

                    <div className="col-span-1">
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">
                            Phone (Optional)
                        </label>
                        <Input
                            id="phone"
                            {...register("phone")}
                            placeholder="(555) 123-4567"
                            disabled={isLoading || isSubmitting}
                        />
                    </div>

                    <div className="col-span-1">
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">
                            Password
                        </label>
                        <Input
                            id="password"
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

                    <div className="col-span-1">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">
                            Confirm Password
                        </label>
                        <Input
                            id="confirmPassword"
                            {...register("confirmPassword")}
                            type="password"
                            placeholder="••••••••"
                            disabled={isLoading || isSubmitting}
                            className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <div className="col-span-2 mt-2 flex items-start gap-2 rounded-lg border border-slate-200 dark:border-neutral-600 bg-slate-50 dark:bg-neutral-700 px-3 py-3">
                        <input
                            {...register("wantsWholesale")}
                            id="wantsWholesale"
                            type="checkbox"
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            disabled={isLoading || isSubmitting}
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
                            disabled={isLoading || isSubmitting}
                            loading={isLoading || isSubmitting}
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

                {process.env.NODE_ENV === "development" && (
                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <p className="text-xs text-amber-800 dark:text-amber-400">
                            <strong>Dev Mode:</strong> Email verification is disabled.
                            You can login immediately after registration.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
