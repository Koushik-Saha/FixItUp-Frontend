import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-white dark:bg-neutral-950">
                <h1 className="text-9xl font-bold text-neutral-200 dark:text-neutral-800">404</h1>
                <h2 className="text-2xl font-semibold mt-4 mb-2 text-neutral-900 dark:text-white">
                    Page Not Found
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
                    Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been removed or moved to a new address.
                </p>
                <div className="flex justify-center gap-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Home className="h-4 w-4" />
                        Go Home
                    </Link>
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                        Browse Shop
                    </Link>
                </div>
            </div>
            {/* <Newsletter /> */}
        </div>
    );
}
