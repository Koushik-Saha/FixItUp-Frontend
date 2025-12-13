"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 text-center">
                <div className="mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                        Access Denied
                    </h1>
                    <p className="text-slate-600">
                        You don't have permission to access this page. Please contact an administrator if you believe this is an error.
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => router.back()}
                        className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-medium px-4 py-2.5 hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                    <Link
                        href="/"
                        className="w-full inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-700 text-sm font-medium px-4 py-2.5 hover:bg-slate-50"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}